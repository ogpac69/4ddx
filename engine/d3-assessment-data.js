(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.D3AssessmentData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const CURRENT_SCHEMA_VERSION = "2.0.0";
  const ANSWER_STATUSES = new Set([
    "answered", "not_answered", "unknown", "not_measured",
    "not_applicable", "prefer_not_to_answer", "explicit_none"
  ]);
  const PROVENANCE = new Set([
    "self_report", "measured", "estimated", "recalled", "imported",
    "clinician_record", "device_record", "unknown"
  ]);

  function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function cloneJSON(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  function hasMeaningfulLegacyValue(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim().length > 0;
    // Zero and false are valid answers and must not be treated as missing.
    return true;
  }

  function inferLegacyStatus(value) {
    return hasMeaningfulLegacyValue(value) ? "answered" : "not_answered";
  }

  function makeAnswer(value, options) {
    const o = options || {};
    const status = o.status || inferLegacyStatus(value);
    if (!ANSWER_STATUSES.has(status)) throw new Error("Invalid answer status: " + status);
    const provenance = o.provenance || "self_report";
    if (!PROVENANCE.has(provenance)) throw new Error("Invalid provenance: " + provenance);
    const answer = {
      value: status === "not_answered" || value === undefined ? null : cloneJSON(value),
      status,
      recordedAt: o.recordedAt || null,
      recallWindow: o.recallWindow || null,
      provenance,
      confidence: o.confidence === undefined ? null : o.confidence,
      unit: o.unit || null,
      method: o.method || null,
      notes: o.notes || null
    };
    validateAnswer(answer);
    return answer;
  }

  function validateAnswer(answer) {
    if (!isObject(answer)) throw new TypeError("Answer must be an object");
    if (!ANSWER_STATUSES.has(answer.status)) throw new Error("Invalid answer status");
    if (!PROVENANCE.has(answer.provenance)) throw new Error("Invalid answer provenance");
    if (answer.recordedAt !== null && answer.recordedAt !== undefined &&
        Number.isNaN(Date.parse(answer.recordedAt))) {
      throw new Error("recordedAt must be a valid date-time or null");
    }
    if (answer.confidence !== null && answer.confidence !== undefined &&
        (typeof answer.confidence !== "number" || answer.confidence < 0 || answer.confidence > 1)) {
      throw new Error("confidence must be null or a number between 0 and 1");
    }
    if (answer.status === "not_answered" && answer.value !== null) {
      throw new Error("not_answered answers must have a null value");
    }
    if (answer.status === "explicit_none" && answer.value === null) {
      throw new Error("explicit_none must retain an explicit value");
    }
    return true;
  }

  function migrateProfile(input, options) {
    const o = options || {};
    if (!isObject(input)) throw new TypeError("Profile must be a plain object");
    const profile = cloneJSON(input);
    profile.assessment = isObject(profile.assessment) ? profile.assessment : {};
    profile.assessmentV2 = isObject(profile.assessmentV2) ? profile.assessmentV2 : {};
    const v2 = profile.assessmentV2;
    v2.schemaVersion = CURRENT_SCHEMA_VERSION;
    v2.answers = isObject(v2.answers) ? v2.answers : {};
    v2.legacy = isObject(v2.legacy) ? v2.legacy : {};

    // Preserve a raw snapshot. Copy only missing keys so later legacy fields
    // are retained without overwriting previously captured source values.
    Object.keys(profile.assessment).forEach(function (key) {
      if (!Object.prototype.hasOwnProperty.call(v2.legacy, key)) {
        v2.legacy[key] = cloneJSON(profile.assessment[key]);
      }
    });
    v2.migration = Object.assign({}, v2.migration || {}, {
      from: (v2.migration && v2.migration.from) || o.fromVersion || "bioenergetic_profile_v1",
      to: CURRENT_SCHEMA_VERSION,
      legacySnapshotCreated: true,
      migratedAt: (v2.migration && v2.migration.migratedAt) || o.migratedAt || null
    });

    // Promote only IDs explicitly supplied by the registry. Unknown keys remain
    // in assessment and in the raw legacy snapshot; they are never discarded.
    const ids = Array.isArray(o.questionIds) ? o.questionIds : Object.keys(profile.assessment);
    ids.forEach(function (id) {
      if (Object.prototype.hasOwnProperty.call(v2.answers, id)) return;
      if (!Object.prototype.hasOwnProperty.call(profile.assessment, id)) return;
      const raw = profile.assessment[id];
      const status = inferLegacyStatus(raw);
      // Keep the exact raw value in the legacy snapshot; represent missing
      // structured answers with null rather than carrying an empty string.
      v2.answers[id] = makeAnswer(status === "not_answered" ? null : raw, {
        status,
        provenance: "imported"
      });
    });

    profile.schemaVersion = CURRENT_SCHEMA_VERSION;
    return profile;
  }

  function readAnswer(profile, questionId) {
    if (!isObject(profile) || typeof questionId !== "string") return null;
    const v2 = profile.assessmentV2;
    if (isObject(v2) && isObject(v2.answers) &&
        Object.prototype.hasOwnProperty.call(v2.answers, questionId)) {
      return cloneJSON(v2.answers[questionId]);
    }
    if (isObject(profile.assessment) &&
        Object.prototype.hasOwnProperty.call(profile.assessment, questionId)) {
      return makeAnswer(profile.assessment[questionId], { provenance: "imported" });
    }
    return null;
  }

  function writeAnswer(profileInput, questionId, value, options) {
    if (typeof questionId !== "string" || !questionId.trim()) {
      throw new TypeError("questionId must be a non-empty string");
    }
    const o = options || {};
    const profile = migrateProfile(profileInput, { questionIds: [] });
    const answer = makeAnswer(value, o);
    profile.assessmentV2.answers[questionId] = answer;

    // Dual-write only when explicitly requested. The old UI expects primitive
    // values under assessment[questionId]; callers must opt in per known field.
    if (o.legacyMirror === true) {
      profile.assessment[questionId] = cloneJSON(answer.value);
    }
    return profile;
  }

  function setAnswerStatus(profileInput, questionId, status, options) {
    const current = readAnswer(profileInput, questionId);
    if (!current) throw new Error("Cannot change status for an unanswered unknown question");
    const o = Object.assign({}, current, options || {}, { status });
    const value = status === "not_answered" ? null : current.value;
    return writeAnswer(profileInput, questionId, value, o);
  }

  function validateProfile(profile) {
    const errors = [];
    if (!isObject(profile)) return { valid: false, errors: ["Profile must be an object"] };
    if (!isObject(profile.assessment)) errors.push("assessment must remain an object");
    if (profile.assessmentV2 !== undefined) {
      const v2 = profile.assessmentV2;
      if (!isObject(v2)) errors.push("assessmentV2 must be an object");
      else {
        if (v2.schemaVersion !== CURRENT_SCHEMA_VERSION) errors.push("Unsupported assessmentV2 schemaVersion");
        if (!isObject(v2.answers)) errors.push("assessmentV2.answers must be an object");
        else Object.keys(v2.answers).forEach(function (id) {
          try { validateAnswer(v2.answers[id]); }
          catch (e) { errors.push(id + ": " + e.message); }
        });
        if (!isObject(v2.legacy)) errors.push("assessmentV2.legacy must be an object");
      }
    }
    return { valid: errors.length === 0, errors };
  }

  function exportProfile(profileInput) {
    const profile = cloneJSON(profileInput);
    const result = validateProfile(profile);
    if (!result.valid) throw new Error("Cannot export invalid profile: " + result.errors.join("; "));
    return JSON.stringify(profile, null, 2);
  }

  function importProfile(jsonText, options) {
    if (typeof jsonText !== "string") throw new TypeError("Import payload must be JSON text");
    const parsed = JSON.parse(jsonText);
    const migrated = migrateProfile(parsed, options);
    const result = validateProfile(migrated);
    if (!result.valid) throw new Error("Imported profile is invalid: " + result.errors.join("; "));
    return migrated;
  }

  return Object.freeze({
    CURRENT_SCHEMA_VERSION,
    ANSWER_STATUSES: Array.from(ANSWER_STATUSES),
    PROVENANCE: Array.from(PROVENANCE),
    makeAnswer,
    validateAnswer,
    migrateProfile,
    readAnswer,
    writeAnswer,
    setAnswerStatus,
    validateProfile,
    exportProfile,
    importProfile
  });
});
