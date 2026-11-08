#!/usr/bin/env node
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const registry = JSON.parse(fs.readFileSync("schemas/assessment-question-registry.v1.json","utf8"));
const ids = registry.questions.map(q=>q.id);
assert.equal(ids.length, registry.question_count);
assert.equal(new Set(ids).size, ids.length);
assert.ok(registry.questions.every(q=>q.migration.preserve_raw_value));
assert.ok(registry.questions.every(q=>q.migration.canonical_key_immutable));
assert.ok(registry.questions.every(q=>q.missingness.includes("not_answered")));
assert.ok(registry.questions.every(q=>q.missingness.includes("explicit_none")));
assert.ok(registry.modules.length >= 10);
console.log("D3.1.3 registry structural tests passed.");
