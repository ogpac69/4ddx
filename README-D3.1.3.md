# 4DDX Phase D3.1.3 — Consolidated questionnaire package

This is a design-and-validation release. It does not modify the live app.

## Contents
- `schemas/assessment-question-registry.v1.json` — 178 IDs grouped by module; exact source labels/options remain a required sync gate.
- `docs/phase-d/D3.1.3-registry-and-migration-spec.md` — immutable ID rules, data model, migration stages and safety boundaries.
- `docs/phase-d/D3.1.3-questionnaire-blueprint.md` — proposed questionnaire flow and redesign backlog.
- `schemas/assessment-answer-v2.schema.json` — structured answer contract.
- `scripts/validate-assessment-registry.js` — compare registry IDs against current `app/index.html`.
- `tests/node/d3.1.3-registry.test.js` — structural tests.
- `CHANGELOG-D3.1.3.md`.

## Install
Extract this ZIP at the repository root, preserving folders. Do not replace `app/index.html`.

## Validate
Run:
`node tests/node/d3.1.3-registry.test.js`
`node scripts/validate-assessment-registry.js app/index.html`

The source validator is deliberately strict and may report stale IDs if the deployed source differs from the source snapshot. Resolve those reports by inspecting the live source; do not delete historical IDs to make the test green.

## Next release gate
Before D3.2 implementation, synchronize exact labels, types, placeholders and option values from the exact current source, then add synthetic old-backup migration tests. Only after those pass should UI changes begin.
