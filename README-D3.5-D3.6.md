# 4DDX D3.5 + D3.6 consolidated release

This release combines questionnaire source synchronization (D3.5) with opt-in structured assessment shadow integration (D3.6).

New files:
- `scripts/sync-assessment-registry.js`
- `scripts/apply-d3.6-ui-integration.js`
- `engine/d3-assessment-integration.js`
- `tests/node/d3.5-registry-sync.test.js`
- `tests/node/d3.6-assessment-integration.test.js`
- `docs/phase-d/D3.5-questionnaire-source-sync.md`
- `docs/phase-d/D3.6-structured-shadow-integration.md`
- `docs/phase-d/D3.5-D3.6-installation.md`

D3.5 extracts the current questionnaire literal and creates a registry containing exact labels, types, placeholders, select options, module order, and stable IDs. The 12 IDs from the prior registry that are not currently rendered are retained as legacy-only.

D3.6 adds a disabled-by-default Settings toggle for structured shadow writes. It does not switch the app to structured reads and does not change existing analytics. Legacy answers remain authoritative.

See `docs/phase-d/D3.5-D3.6-installation.md` for installation and test commands.
