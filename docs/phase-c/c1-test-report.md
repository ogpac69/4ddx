# Phase C1 — Regression test report

Date: 2026-11-09

## Scope

The test harness targets the existing v22.6 application without changing its runtime code. All fixtures are synthetic. The original source baseline remains byte-for-byte unchanged.

## Verified in this build environment

- Static source contract tests: **7 passed**.
- Original source checksum: **passed** (`77451c9d271a80f3e4320a4690070160996382398d24954e7b7df6326ac86c11`).
- Knowledge manifest: **10 datasets validated; all hashes match**.
- Python test file syntax compilation: **passed**.

## Browser test coverage authored

1. App initialization and presence of all seven views.
2. Daily-log save and localStorage persistence after reload.
3. Invalid temperature rejection.
4. JSON backup export content.
5. Valid backup import and invalid backup rejection without overwriting existing data.
6. Delete-all confirmation and localStorage clearing.

## Execution limitation

The browser suite could not be run successfully in this environment. Chromium navigation to both `file://` and the temporary local HTTP server was rejected with `net::ERR_BLOCKED_BY_ADMINISTRATOR`. This is an execution-environment restriction, not a passing test. Run the Playwright suite on a normal desktop or CI runner using the instructions in `tests/README.md`.

## Explicitly unchanged

- `app/index.html` runtime source.
- `bioenergetic_profile_v1` localStorage key and current data model.
- No diagnosis, cloud sync, disease ranking, or automated clinical recommendation functionality was introduced.
