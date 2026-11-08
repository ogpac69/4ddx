#!/usr/bin/env node
"use strict";
const assert = require("node:assert/strict");
const Data = require("../../engine/d3-assessment-data.js");
const Integration = require("../../engine/d3-assessment-integration.js");
const modules = [
  { items: [["age","Age","number",""],["sex","Sex","select",["Male","Female"]],["notes","Notes","textarea",""]] }
];
const profile = {
  logs: { "2026-01-01": { date:"2026-01-01", measurements:[] } },
  assessment: { age:"20", sex:"Male", notes:"", unknown_key:"preserve" },
  supplements: { magnesium: { status:"Currently using" } },
  customTopLevel: { keep:true }
};
function test(name, fn) { fn(); console.log("PASS " + name); }
test("shadow sync creates structured answers without mutating input", () => {
  const before = JSON.stringify(profile);
  const result = Integration.sync(profile, modules, { recordedAt:"2026-11-09T00:00:00.000Z" });
  assert.equal(JSON.stringify(profile), before);
  assert.equal(result.profile.assessmentV2.answers.age.value, "20");
  assert.equal(result.profile.assessmentV2.answers.age.status, "answered");
  assert.equal(result.profile.assessmentV2.answers.notes.status, "not_answered");
});
test("legacy data and unrelated profile sections remain unchanged", () => {
  const result = Integration.sync(profile, modules);
  assert.deepEqual(result.profile.assessment, profile.assessment);
  assert.deepEqual(result.profile.logs, profile.logs);
  assert.deepEqual(result.profile.supplements, profile.supplements);
  assert.deepEqual(result.profile.customTopLevel, profile.customTopLevel);
  assert.equal(result.summary.legacyUnchanged, true);
});
test("zero and false remain valid structured values", () => {
  const p = { assessment: { zero:0, no:false } };
  const m = [{ items:[["zero","Zero","number",""],["no","No","select",[]]] }];
  const out = Integration.sync(p,m).profile;
  assert.equal(out.assessmentV2.answers.zero.value,0);
  assert.equal(out.assessmentV2.answers.zero.status,"answered");
  assert.equal(out.assessmentV2.answers.no.value,false);
});
test("shadow writes are disabled unless explicitly enabled", () => {
  const store = {};
  const storage = { getItem:k=>store[k] || null, setItem:(k,v)=>store[k]=v };
  assert.equal(Integration.isShadowWriteEnabled(storage),false);
  Integration.setShadowWriteEnabled(storage,true);
  assert.equal(Integration.isShadowWriteEnabled(storage),true);
  Integration.setShadowWriteEnabled(storage,false);
  assert.equal(Integration.isShadowWriteEnabled(storage),false);
});
test("legacy key preservation survives structured sync", () => {
  const result = Integration.sync(profile,modules);
  assert.equal(result.profile.assessment.unknown_key,"preserve");
  assert.equal(result.profile.assessmentV2.legacy.unknown_key,"preserve");
});
test("structured read helper remains gated by explicit flag", () => {
  const storage = { getItem:()=> "false" };
  const p = Data.migrateProfile({ assessment:{age:"20"} });
  p.assessmentV2.answers.age = Data.makeAnswer("21",{provenance:"self_report"});
  assert.equal(Integration.read(p,"age",storage).value,"20");
});
console.log("All D3.6 integration tests passed.");
