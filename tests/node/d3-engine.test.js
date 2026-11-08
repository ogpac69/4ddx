const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const engine = require("../../engine/d3-assessment-engine.js");
const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, "../fixtures/d3-synthetic-profile.json"), "utf8"));
function test(name, fn) { try { fn(); process.stdout.write("PASS " + name + "\n"); } catch (e) { process.stderr.write("FAIL " + name + ": " + e.message + "\n"); process.exitCode = 1; } }
test("accepts synthetic tracker shape", () => { const r=engine.analyze(fixture); assert.equal(r.ok,true); assert.equal(r.report.period.days_with_records,3); });
test("does not mutate input", () => { const before=JSON.stringify(fixture); engine.analyze(fixture); assert.equal(JSON.stringify(fixture),before); });
test("separates measurement methods", () => { const r=engine.analyze(fixture); assert.equal(r.quality.measurement_methods.length,2); assert.ok(r.report.data_quality.comparability_notes.some(x=>x.includes("More than one"))); });
test("counts valid values", () => { const r=engine.analyze(fixture); assert.equal(r.report.data_quality.valid_temperature_count,11); assert.equal(r.report.data_quality.valid_pulse_count,11); });
test("does not treat missing values as zero", () => { const r=engine.analyze(fixture); const g=r.quality.checkpoint_summaries.find(x=>x.label==="Waking"&&x.method==="Oral"); assert.equal(g.temperatureF.count,2); assert.equal(g.pulseBpm.count,2); });
test("excludes out-of-range values", () => { const c=JSON.parse(JSON.stringify(fixture)); c.logs["2026-11-02"].measurements[0].temp=120; const r=engine.analyze(c); assert.equal(r.report.data_quality.valid_temperature_count,10); assert.ok(r.report.data_quality.excluded_values.some(x=>x.field==="Waking.temperature")); });
test("handles empty and malformed input", () => { assert.equal(engine.analyze({}).report.period.days_with_records,0); assert.equal(engine.analyze(null).ok,false); });
test("accepts additive question IDs", () => { const c=JSON.parse(JSON.stringify(fixture)); c.assessment.new_future_question="answer"; const r=engine.analyze(c); assert.equal(r.ok,true); assert.equal(r.quality.assessment_field_count,Object.keys(c.assessment).length); });
test("filters explicit date window", () => { const r=engine.analyze(fixture,{startDate:"2026-11-02",endDate:"2026-11-03"}); assert.equal(r.report.period.days_with_records,2); assert.equal(r.report.data_quality.valid_temperature_count,8); });
test("does not generate interpretations in D3.1", () => { const r=engine.analyze(fixture); assert.deepEqual(r.report.bioenergetic_interpretation,[]); assert.deepEqual(r.report.physiology,[]); assert.deepEqual(r.report.mainstream_comparison,[]); assert.equal(r.report.safety.status,"incomplete_knowledge"); });
