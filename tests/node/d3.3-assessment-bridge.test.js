#!/usr/bin/env node
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Data = require("../../engine/d3-assessment-data.js");
const Bridge = require("../../engine/d3-assessment-bridge.js");
const old = JSON.parse(fs.readFileSync(path.join(__dirname,"../fixtures/d3.2-legacy-profile.json"),"utf8"));
function test(name, fn) { fn(); console.log("PASS "+name); }

test("preview does not mutate source profile", () => {
  const before = JSON.stringify(old);
  const p = Bridge.preview(old);
  assert.equal(JSON.stringify(old), before);
  assert.equal(p.safeToProceed, true);
  assert.ok(p.after.structuredAnswerCount > 0);
});
test("preview reports the legacy and structured counts", () => {
  const p = Bridge.preview(old);
  assert.equal(p.before.legacyQuestionCount, Object.keys(old.assessment).length);
  assert.equal(p.after.structuredAnswerCount, Object.keys(old.assessment).length);
});
test("migration returns a complete pre-migration backup", () => {
  const m = Bridge.migrateWithBackup(old);
  assert.deepEqual(JSON.parse(m.backup), old);
  assert.equal(m.migratedProfile.schemaVersion, Data.CURRENT_SCHEMA_VERSION);
  assert.equal(m.summary.after.structuredAnswerCount, m.summary.before.legacyQuestionCount);
});
test("rollback restores exact legacy profile", () => {
  const m = Bridge.migrateWithBackup(old);
  const restored = Bridge.rollbackFromBackup(m.backup);
  assert.deepEqual(restored, old);
});
test("rollback rejects malformed or unrelated backup", () => {
  assert.throws(()=>Bridge.rollbackFromBackup("{}"),/valid 4DDX profile/);
  assert.throws(()=>Bridge.rollbackFromBackup("not json"),/JSON/);
});
test("feature flag is disabled unless explicitly enabled", () => {
  const values = {};
  const storage = {getItem:k=>values[k]??null,setItem:(k,v)=>values[k]=v};
  assert.equal(Bridge.isEnabled(storage),false);
  Bridge.setEnabled(storage,true);
  assert.equal(Bridge.isEnabled(storage),true);
  Bridge.setEnabled(storage,false);
  assert.equal(Bridge.isEnabled(storage),false);
});
test("feature flag fails closed when storage is unavailable", () => {
  assert.equal(Bridge.isEnabled(null),false);
});
test("read uses legacy path while flag is off and structured path when on", () => {
  const migrated = Data.migrateProfile(old);
  migrated.assessment.age = "20";
  migrated.assessmentV2.answers.age = Data.makeAnswer("21",{provenance:"self_report"});
  assert.equal(Bridge.read(migrated,"age",false).value,"20");
  assert.equal(Bridge.read(migrated,"age",true).value,"21");
});
test("unknown legacy fields remain visible in migration summary", () => {
  const p = Bridge.preview(old);
  assert.ok(p.profile.assessmentV2.legacy.unknown_legacy_field);
  assert.ok(p.profile.assessment.unknown_legacy_field);
});
console.log("All D3.3 bridge tests passed.");
