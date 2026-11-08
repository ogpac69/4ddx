#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const SOURCE_CANDIDATES = ["index.html", "app/index.html"];
const PRIOR_REGISTRY = path.join(ROOT, "schemas/assessment-question-registry.v1.json");
const OUTPUT = path.join(ROOT, "schemas/assessment-question-registry.v2.json");

function extractModules(html) {
  const match = html.match(/const\s+modules\s*=\s*(\[[\s\S]*?\n\];)/);
  if (!match) throw new Error("Could not find the questionnaire `const modules = [...]` block.");
  // The extracted expression is the app's own literal array, evaluated in an isolated function.
  const modules = new Function("return (" + match[1].replace(/;\s*$/, "") + ");")();
  if (!Array.isArray(modules)) throw new Error("Questionnaire module source did not evaluate to an array.");
  return modules;
}
function inferUnit(id, label, type) {
  const s = (id + " " + label).toLowerCase();
  if (/\btemperature\b|_temp\b/.test(s)) return "°F (as displayed by the current source)";
  if (/pulse/.test(s)) return "BPM";
  if (/\bweight\b/.test(s) && /kg/.test(s)) return "kg";
  if (/waist|hip/.test(s)) return "cm";
  if (/body.?fat/.test(s)) return "%";
  if (/duration|hours|sleep_duration/.test(s)) return "hours or minutes as specified in label";
  if (/minutes|\(min/.test(s)) return "minutes";
  if (/steps/.test(s)) return "steps/day";
  if (/ml/.test(s)) return "mL/day";
  if (/\(g\)|_g\b/.test(s)) return "g";
  if (/kcal/.test(s)) return "kcal/day";
  if (/per week|frequency/.test(s)) return "frequency as specified by options/label";
  if (type === "time") return "local clock time";
  return null;
}
function buildRegistry(html, prior) {
  const modules = extractModules(html);
  const questions = [];
  const moduleRecords = [];
  const seen = new Set();
  modules.forEach((mod, moduleIndex) => {
    const moduleId = String(mod.title || ("module_" + (moduleIndex + 1)))
      .toLowerCase().replace(/^\d+\s*[·.]\s*/, "")
      .replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    const ids = [];
    (mod.items || []).forEach((item, displayOrder) => {
      const [id, label, controlType, extra] = item;
      if (!id || seen.has(id)) throw new Error("Missing or duplicate question ID: " + id);
      seen.add(id); ids.push(id);
      const isOptions = controlType === "select" && Array.isArray(extra);
      questions.push({
        id, module: moduleId, module_title: String(mod.title || "").replace(/^\d+\s*[·.]\s*/, ""),
        display_order: displayOrder, status: "active_in_source",
        legacy_label: String(label), legacy_control_type: String(controlType),
        legacy_placeholder: typeof extra === "string" ? extra : null,
        legacy_options: isOptions ? extra.map(value => ({ value: String(value), label: String(value) })) : null,
        response_kind: controlType === "select" ? "categorical" :
          controlType === "number" ? "numeric_text_input" :
          controlType === "time" ? "time" :
          controlType === "textarea" ? "free_text_multiline" :
          controlType === "text" ? "free_text_singleline" : "source_defined",
        unit: inferUnit(id, label, controlType),
        recall_window: "not specified in current source; do not infer",
        provenance_default: "self_report",
        missingness: ["not_answered","unknown","not_measured","not_applicable","prefer_not_to_answer","explicit_none"],
        sensitivity: /sexual|erection|ejaculation|genital|urinary|reproductive|anxiety|mood|health_conditions|medications|family_history/i.test(id)
          ? "sensitive_or_health_related" : "general_health_or_context",
        migration: { preserve_raw_value: true, canonical_key_immutable: true, semantic_change_requires_new_id: true }
      });
    });
    moduleRecords.push({ id: moduleId, title: String(mod.title || "").replace(/^\d+\s*[·.]\s*/, ""), description: mod.desc || "", question_ids: ids });
  });

  // Preserve the 12 previously catalogued performance IDs that are not currently rendered.
  // They remain recognized legacy keys, but are not presented as active questionnaire items.
  const priorQuestions = prior && Array.isArray(prior.questions) ? prior.questions : [];
  const carried = [];
  priorQuestions.forEach(q => {
    if (seen.has(q.id)) return;
    questions.push({
      id: q.id, module: q.module || "legacy_unrendered", module_title: null,
      display_order: null, status: "legacy_only_not_rendered",
      legacy_label: q.legacy_label || null, legacy_control_type: q.legacy_control_type || null,
      legacy_placeholder: null, legacy_options: q.legacy_options || null,
      response_kind: "legacy_unverified", unit: q.unit || null,
      recall_window: "unknown", provenance_default: "unknown",
      missingness: ["not_answered","unknown","not_measured","not_applicable","prefer_not_to_answer","explicit_none"],
      sensitivity: "unclassified",
      migration: { preserve_raw_value: true, canonical_key_immutable: true, semantic_change_requires_new_id: true }
    });
    carried.push(q.id);
  });
  const activeCount = questions.filter(q => q.status === "active_in_source").length;
  return {
    registry_id: "4ddx-assessment-question-registry",
    version: "2.0.0",
    generated_at: new Date().toISOString(),
    source: SOURCE_CANDIDATES.find(p => html === fs.readFileSync(path.join(ROOT,p),"utf8")) || "provided-source",
    source_fingerprint: require("node:crypto").createHash("sha256").update(html).digest("hex"),
    status: "source-synchronized; legacy-only IDs explicitly identified",
    question_count: questions.length,
    active_source_question_count: activeCount,
    legacy_only_not_rendered_count: carried.length,
    modules: moduleRecords,
    questions,
    compatibility_policy: "docs/phase-d/D3.1.3-registry-and-migration-spec.md"
  };
}

function main() {
  const sourcePath = SOURCE_CANDIDATES.map(p => path.join(ROOT,p)).find(p => fs.existsSync(p));
  if (!sourcePath) throw new Error("Neither index.html nor app/index.html exists.");
  const html = fs.readFileSync(sourcePath, "utf8");
  const prior = fs.existsSync(PRIOR_REGISTRY) ? JSON.parse(fs.readFileSync(PRIOR_REGISTRY,"utf8")) : null;
  const registry = buildRegistry(html, prior);
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(registry, null, 2) + "\n");
  console.log("Wrote " + path.relative(ROOT, OUTPUT));
  console.log("Active source questions: " + registry.active_source_question_count);
  console.log("Legacy-only IDs preserved: " + registry.legacy_only_not_rendered_count);
  console.log("Total registry IDs: " + registry.question_count);
}
if (require.main === module) main();
module.exports = { extractModules, buildRegistry };
