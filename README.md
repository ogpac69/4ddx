# 4DDX D3.7–D3.9 consolidated UI release

This release patches both live HTML entry points and installs the structured-assessment rollout engines.

## What changed

- D3.7: local parity check compares every active questionnaire ID between legacy and structured answers.
- D3.8: on-demand comparison displays matched/mismatched counts and mismatching IDs/statuses. It sends no data to a server.
- D3.9: structured reads can be enabled only when the structured store validates and every active question passes parity. Legacy reads can be restored from Settings.
- D3.6 shadow-write control is included. When enabled, saving the questionnaire synchronizes a structured shadow copy while retaining the legacy `db.assessment` values.
- Questionnaire rendering, module completion, dashboard completion, domain completion, and completion score use the selected read source. Daily measurement charts are unchanged.
- Existing D3.4 migration and rollback controls remain. Migration/rollback disable the structured read and shadow-write flags.

## Safety boundaries

- Structured reads and shadow writes are off by default unless the browser already has their respective local flags set.
- No participant profile is migrated automatically by loading the page.
- No remote telemetry or health-data upload is added.
- Legacy assessment fields remain stored and are still written on questionnaire save.
- A parity failure blocks structured-read activation.

## Android / Gitling installation

1. Keep a current JSON backup from the app before replacing files.
2. Extract this ZIP at the repository root, preserving folder paths.
3. Replace `index.html` and `app/index.html` with the two files in this ZIP.
4. Add/replace the four files under `engine/`.
5. Add/replace `tests/node/d3.7-d3.9-rollout.test.js` if you keep the repository tests.
6. Commit and push using Gitling. No terminal, Node, or manual code editing is required on the phone.
7. Open the deployed app, go to Settings, enable structured shadow writes, save the questionnaire, and run the parity check. Do not enable structured reads until the check reports PASS.

If parity fails, leave structured reads disabled. Keep using legacy reads and inspect the listed IDs.
