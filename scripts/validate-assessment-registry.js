#!/usr/bin/env node
"use strict";
// Run: node scripts/validate-assessment-registry.js app/index.html
// This validates IDs against the live questionnaire source without changing it.
const fs = require("fs");
const path = require("path");
const sourcePath = process.argv[2] || "app/index.html";
const registryPath = "schemas/assessment-question-registry.v1.json";
const source = fs.readFileSync(sourcePath, "utf8");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const sourceIds = [...source.matchAll(/\[['"]([a-z][a-z0-9_]*)['"]\s*,\s*['"][^'"]+['"]\s*,\s*['"](?:number|select|text|textarea|time)['"]/g)].map(m => m[1]);
const uniqueSource = [...new Set(sourceIds)];
const registryIds = registry.questions.map(q => q.id);
const uniqueRegistry = [...new Set(registryIds)];
const missing = uniqueSource.filter(id => !uniqueRegistry.includes(id));
const stale = uniqueRegistry.filter(id => !uniqueSource.includes(id));
const duplicates = registryIds.filter((id, i) => registryIds.indexOf(id) !== i);
const failures = [];
if (missing.length) failures.push(`IDs missing from registry: ${missing.join(", ")}`);
if (duplicates.length) failures.push(`Duplicate registry IDs: ${[...new Set(duplicates)].join(", ")}`);
if (stale.length) failures.push(`Registry IDs absent from source (review status): ${stale.join(", ")}`);
console.log(JSON.stringify({
  sourceQuestionOccurrences: sourceIds.length,
  uniqueSourceQuestionIds: uniqueSource.length,
  registryQuestionCount: registryIds.length,
  uniqueRegistryQuestionIds: uniqueRegistry.length,
  missing, stale, duplicates,
  exactLabelsAndOptionsSynced: registry.questions.every(q => q.legacy_label_status === "verified")
}, null, 2));
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("ID coverage check passed. Exact label/option synchronization remains a separate release gate.");
}
