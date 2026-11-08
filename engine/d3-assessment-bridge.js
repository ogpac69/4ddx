(function (root, factory) {
  const api = factory(root.D3AssessmentData);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.D3AssessmentBridge = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (Data) {
  "use strict";
  if (!Data) throw new Error("D3AssessmentData must be loaded before D3AssessmentBridge");

  const FEATURE_FLAG_KEY = "d3_assessment_v2_enabled";
  const BACKUP_PREFIX = "4ddx-pre-d3-migration-";

  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function summarize(profile) {
    const legacy = profile && profile.assessment && typeof profile.assessment === "object"
      ? profile.assessment : {};
    const v2 = profile && profile.assessmentV2 && typeof profile.assessmentV2 === "object"
      ? profile.assessmentV2 : {};
    const ids = Object.keys(legacy);
    const structured = v2.answers && typeof v2.answers === "object" ? Object.keys(v2.answers) : [];
    return {
      legacyQuestionCount: ids.length,
      structuredAnswerCount: structured.length,
      legacyKeysWithoutStructuredAnswer: ids.filter(id => !structured.includes(id)),
      unknownLegacyKeysPreserved: ids.length,
      hasPriorMigration: !!(v2.migration && v2.migration.legacySnapshotCreated),
      schemaVersion: v2.schemaVersion || null
    };
  }

  // Preview is pure: it does not mutate or persist the supplied profile.
  function preview(profile, options) {
    const before = summarize(profile);
    const migrated = Data.migrateProfile(profile, options);
    const after = summarize(migrated);
    const validation = Data.validateProfile(migrated);
    return {
      safeToProceed: validation.valid,
      before,
      after,
      validation,
      changedTopLevelKeys: Object.keys(migrated).filter(k => JSON.stringify(migrated[k]) !== JSON.stringify(profile[k])),
      profile: migrated
    };
  }

  // Caller must persist the returned backup before persisting the migrated profile.
  // This function itself performs no localStorage or network writes.
  function migrateWithBackup(profile, options) {
    const backup = JSON.stringify(profile, null, 2);
    const result = preview(profile, options);
    if (!result.safeToProceed) throw new Error("Migration validation failed: " + result.validation.errors.join("; "));
    return {
      backup,
      backupName: BACKUP_PREFIX + new Date().toISOString().replace(/[:.]/g, "-") + ".json",
      migratedProfile: result.profile,
      summary: {
        before: result.before,
        after: result.after,
        schemaVersion: Data.CURRENT_SCHEMA_VERSION
      }
    };
  }

  function rollbackFromBackup(backupJSON) {
    if (typeof backupJSON !== "string") throw new TypeError("Backup must be JSON text");
    const restored = JSON.parse(backupJSON);
    if (!restored || typeof restored !== "object" || !restored.assessment) {
      throw new Error("Backup does not look like a valid 4DDX profile");
    }
    return restored;
  }

  function isEnabled(storage) {
    try { return !!(storage && storage.getItem(FEATURE_FLAG_KEY) === "true"); }
    catch (_) { return false; }
  }

  function setEnabled(storage, enabled) {
    if (!storage || typeof storage.setItem !== "function") {
      throw new TypeError("A writable storage object is required");
    }
    storage.setItem(FEATURE_FLAG_KEY, enabled ? "true" : "false");
    return !!enabled;
  }

  function read(profile, questionId, enabled) {
    if (enabled) {
      const structured = Data.readAnswer(profile, questionId);
      if (structured) return structured;
    }
    if (profile && profile.assessment &&
        Object.prototype.hasOwnProperty.call(profile.assessment, questionId)) {
      return Data.makeAnswer(profile.assessment[questionId], { provenance: "imported" });
    }
    return null;
  }

  return Object.freeze({
    FEATURE_FLAG_KEY,
    preview,
    migrateWithBackup,
    rollbackFromBackup,
    isEnabled,
    setEnabled,
    read,
    summarize
  });
});
