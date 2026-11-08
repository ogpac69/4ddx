# Changelog

All notable changes to this project are documented here.

## Unreleased — Phase B repository foundation

- Added the untouched v22.6 application as `app/index.html`.
- Recorded the original source SHA-256 and retained a baseline copy.
- Added repository structure, privacy rules, backup/rollback guidance and development instructions.
- Added initial knowledge-record and manifest schemas.
- Added empty, versioned dataset placeholders for planned knowledge domains.
- Added a standard-library validation script.
- No application behavior, local-storage key, UI, or personal data format was changed.

## Phase C — characterization baseline
- Added a staged Phase C refactoring plan.
- Documented the v22.6 application behaviour and local data contract.
- Added seven automated static source-contract checks.
- Added a manual browser regression checklist for daily tracking, questionnaire, supplements, analytics, exports, and destructive actions.
- No runtime application code changed; the v22.6 source remains byte-for-byte identical to its preserved baseline.

## Phase C1 — Regression test harness

- Added browser-level Playwright tests for app initialization, seven-view presence, daily-log validation and persistence, JSON export, backup import/rejection, and local-data deletion.
- Kept all browser fixtures synthetic and isolated; no application runtime code or participant data changed.
- Added test setup and execution instructions.
- Static regression suite: 7/7 passed; source-baseline checksum passed; knowledge manifest validation passed (10 datasets).
- Browser suite is authored but was not successfully executed in this restricted build environment: Chromium navigation is blocked by the environment's administrator policy. Run it on a normal desktop or CI runner before treating browser coverage as verified.
