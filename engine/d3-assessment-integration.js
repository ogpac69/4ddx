(function (root, factory) {
  const api = factory(root.D3AssessmentData, root.D3AssessmentBridge);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.D3AssessmentIntegration = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (Data, Bridge) {
  "use strict";
  if (!Data) throw new Error("D3AssessmentData must load before D3AssessmentIntegration");
  if (!Bridge) throw new Error("D3AssessmentBridge must load before D3AssessmentIntegration");
  const SHADOW_FLAG = "d3_assessment_v2_shadow_write_enabled";
  function questionIds(modules) {
    if (!Array.isArray(modules)) throw new TypeError("Questionnaire modules must be an array");
    return modules.flatMap(module => (module.items || []).map(item => item[0]));
  }
  function snapshot(profile, modules, options) {
    const ids = questionIds(modules);
    const migrated = Data.migrateProfile(profile, { questionIds: ids });
    const source = profile && profile.assessment && typeof profile.assessment === "object" ? profile.assessment : {};
    const answers = migrated.assessmentV2.answers;
    const now = options && options.recordedAt ? options.recordedAt : new Date().toISOString();
    ids.forEach(id => {
      if (!Object.prototype.hasOwnProperty.call(source, id)) return;
      const raw = source[id];
      answers[id] = Data.makeAnswer(raw, {
        provenance: "self_report", recordedAt: now,
        status: raw === null || raw === undefined || (typeof raw === "string" && raw.trim() === "") ? "not_answered" : "answered"
      });
    });
    const validation = Data.validateProfile(migrated);
    if (!validation.valid) throw new Error("Structured shadow validation failed: " + validation.errors.join("; "));
    return migrated;
  }
  function sync(profile, modules, options) {
    const next = snapshot(profile, modules, options);
    return { profile: next, summary: {
      schemaVersion: next.assessmentV2.schemaVersion,
      questionCount: questionIds(modules).length,
      structuredAnswerCount: Object.keys(next.assessmentV2.answers).length,
      legacyAnswerCount: Object.keys(next.assessment || {}).length,
      legacyUnchanged: JSON.stringify(next.assessment) === JSON.stringify(profile.assessment)
    }};
  }
  function isShadowWriteEnabled(storage) { try { return !!storage && storage.getItem(SHADOW_FLAG) === "true"; } catch (_) { return false; } }
  function setShadowWriteEnabled(storage, enabled) {
    if (!storage || typeof storage.setItem !== "function") throw new TypeError("Writable storage is required");
    storage.setItem(SHADOW_FLAG, enabled ? "true" : "false"); return !!enabled;
  }
  function read(profile, id, storage) { return Bridge.read(profile, id, isShadowWriteEnabled(storage)); }
  return Object.freeze({ SHADOW_FLAG, questionIds, snapshot, sync, isShadowWriteEnabled, setShadowWriteEnabled, read });
});
