#!/usr/bin/env node
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const D = require("../../engine/d3-assessment-data.js");
const old = JSON.parse(fs.readFileSync(path.join(__dirname,"../fixtures/d3.2-legacy-profile.json"),"utf8"));
const partial = JSON.parse(fs.readFileSync(path.join(__dirname,"../fixtures/d3.2-partially-migrated-profile.json"),"utf8"));
function test(name, fn) { fn(); process.stdout.write("PASS "+name+"\n"); }

test("migrates v1 profile without deleting fields", () => {
  const out = D.migrateProfile(old, { migratedAt:"2026-11-09T00:00:00.000Z" });
  assert.equal(out.schemaVersion, "2.0.0");
  assert.deepEqual(out.logs, old.logs);
  assert.deepEqual(out.supplements, old.supplements);
  assert.deepEqual(out.healthData, old.healthData);
  assert.deepEqual(out.customTopLevel, old.customTopLevel);
  assert.deepEqual(out.assessment, old.assessment);
});
test("preserves numeric zero as answered", () => {
  const out = D.migrateProfile(old);
  assert.equal(out.assessmentV2.answers.morning_pulse.value, 0);
  assert.equal(out.assessmentV2.answers.morning_pulse.status, "answered");
});
test("empty legacy values become not_answered", () => {
  const out = D.migrateProfile(old);
  assert.equal(out.assessmentV2.answers.health_conditions.status, "not_answered");
});
test("preserves unknown assessment keys", () => {
  const out = D.migrateProfile(old);
  assert.deepEqual(out.assessmentV2.legacy.unknown_legacy_field, old.assessment.unknown_legacy_field);
  assert.deepEqual(out.assessment.unknown_legacy_field, old.assessment.unknown_legacy_field);
});
test("migration is idempotent", () => {
  const once = D.migrateProfile(old);
  once.assessmentV2.answers.age = D.makeAnswer("21", {provenance:"self_report"});
  const twice = D.migrateProfile(once);
  assert.equal(twice.assessmentV2.answers.age.value, "21");
  assert.deepEqual(twice.assessmentV2.legacy, once.assessmentV2.legacy);
});
test("captures later legacy keys without overwriting the original snapshot", () => {
  const once = D.migrateProfile(old);
  once.assessment.added_later = "new raw";
  once.assessmentV2.legacy.age = "original snapshot";
  const twice = D.migrateProfile(once);
  assert.equal(twice.assessmentV2.legacy.added_later, "new raw");
  assert.equal(twice.assessmentV2.legacy.age, "original snapshot");
});
test("blank legacy fallback reads as not_answered", () => {
  const answer = D.readAnswer(old, "health_conditions");
  assert.equal(answer.status, "not_answered");
  assert.equal(answer.value, null);
});
test("supports partially migrated profile", () => {
  const out = D.migrateProfile(partial);
  assert.equal(out.assessmentV2.answers.age.value, "20");
  assert.equal(out.assessment.custom_unknown, "preserve");
});
test("structured write is non-destructive by default", () => {
  const source = D.migrateProfile(old);
  const before = JSON.stringify(source);
  const out = D.writeAnswer(source, "new_question", 12, {unit:"hours", provenance:"self_report"});
  assert.equal(JSON.stringify(source), before);
  assert.equal(out.assessment.new_question, undefined);
  assert.equal(out.assessmentV2.answers.new_question.value, 12);
});
test("explicit legacy mirror writes primitive compatibility value", () => {
  const out = D.writeAnswer(old, "age", "21", {legacyMirror:true, provenance:"self_report"});
  assert.equal(out.assessment.age, "21");
  assert.equal(out.assessmentV2.answers.age.value, "21");
});
test("reads structured answer before legacy fallback", () => {
  const out = D.migrateProfile(old);
  out.assessmentV2.answers.age = D.makeAnswer("22", {provenance:"self_report"});
  assert.equal(D.readAnswer(out,"age").value, "22");
  assert.equal(D.readAnswer(out,"unknown_new"), null);
});
test("supports distinct missingness statuses", () => {
  for (const status of ["not_answered","unknown","not_measured","not_applicable","prefer_not_to_answer","explicit_none"]) {
    const value = status === "not_answered" ? null : "none";
    assert.equal(D.makeAnswer(value,{status}).status,status);
  }
});
test("JSON round trip preserves legacy and v2 data", () => {
  const out = D.migrateProfile(old);
  const imported = D.importProfile(D.exportProfile(out));
  assert.deepEqual(imported, out);
});
test("validates answer metadata", () => {
  assert.throws(()=>D.makeAnswer("x",{status:"made_up"}),/Invalid answer status/);
  assert.throws(()=>D.makeAnswer("x",{confidence:1.5}),/confidence/);
  assert.throws(()=>D.makeAnswer("x",{recordedAt:"yesterday"}),/recordedAt/);
});
test("migration does not mutate source object", () => {
  const before = JSON.stringify(old);
  D.migrateProfile(old);
  assert.equal(JSON.stringify(old), before);
});
console.log("All D3.2 tests passed.");
