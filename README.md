# Ray Peat Health Tracker

A local-first personal health logging and longitudinal tracking application. It is designed for the person entering their own observations. The assessment is a historical profile used by the person reviewing the record to understand context and change over time; it is not a disease detector or automated differential-diagnosis system.

The tracker and its data are separate from HOLOS. This repository does not implement HOLOS functionality.

## Current baseline

- Source release supplied for migration: `bioenergetic_profile_v22_6.html`
- Baseline source SHA-256: `77451c9d271a80f3e4320a4690070160996382398d24954e7b7df6326ac86c11`
- Current application packaging: single-file HTML with inline CSS and JavaScript
- External runtime dependencies found in the source audit: none
- Local persistence key: `bioenergetic_profile_v1`
- No application code has been refactored in this Phase B preparation.

**Release metadata needs reconciliation:** the source filename is v22.6, while its HTML title and header contain older version labels. See `docs/architecture/source-audit.md`. Do not silently rewrite the original baseline.

## Use

Open `app/index.html` in a modern browser. Records are stored in that browser's local storage. Use the application's JSON backup/export before changing browsers, devices, browser profiles, or application origins.

This repository is public. It contains source code and knowledge datasets only—not personal health records. Never commit a real participant's JSON backup, exported report, screenshots containing health data, or other identifiable health information.

## Repository layout

- `app/` — current application entry point and future modular code locations.
- `knowledge/` — independently versioned knowledge datasets, separated by subject.
- `schemas/` — JSON Schemas and data contracts.
- `tests/` — synthetic-only fixtures and validation tests.
- `docs/` — source audit, architecture decisions, migration and operating procedures.
- `scripts/` — local validation tooling.

The `app/js/` directories are reserved for incremental extraction. They are intentionally empty at this stage. The working application remains `app/index.html` until Phase C.

## Data handling and sharing model

The person using the tracker enters their own observations locally. They can export a JSON backup and share that file with the designated reviewer through a separately agreed secure channel. The reviewer can import the backup into their own local copy for longitudinal review. This is a manual file-transfer workflow, not live synchronization or a hosted patient portal.

Before sharing, the participant should review the export for identifying or sensitive information and share only with the intended recipient. The repository itself must never be used as the transfer location.

## Versioning

- Application: Semantic Versioning once modular releases begin (`MAJOR.MINOR.PATCH`); preserve historical source labels for archived releases.
- Knowledge base: independent SemVer in `knowledge/manifest.json`.
- Schemas: independent version in `schemas/manifest.json`; use backward-compatible additions where possible.
- Dataset records: stable IDs; increment the relevant dataset version when records materially change.
- Every knowledge update must leave personal local storage untouched.

## Development

No build step is required for the current baseline. Open `app/index.html` directly. Validation scripts are run with Python 3.11+ and use only the standard library in this foundation stage.

Run:

```bash
python scripts/validate_knowledge.py
python scripts/check_source_baseline.py
```

## Backup and rollback

1. Export a JSON backup from the application before any release or migration.
2. Keep the original backup outside the repository in encrypted/private storage.
3. For a rollback, restore the previous application release and import the backup.
4. Never use `Delete all local data` as a migration or troubleshooting step.
5. Test imports against a copy of a backup before using a new release with a participant's only data copy.

## Evidence policy

Clinical guidelines, systematic reviews, human trials, observational research, mechanistic studies, animal/cellular work, historical hypotheses and speculative interpretations must remain distinguishable. Ray Peat's writings and Gilbert Ling's association-induction hypothesis are recorded as historical/theoretical sources, not clinical consensus. No citation may be invented. Unknown or conflicting evidence must be represented explicitly.

## Privacy

The repository is intentionally public. Public repository status means all source code and documentation are visible to everyone. Do not commit participant records, backups, exports, credentials, or identifiable health data. Public source code does not make local browser data public; however, a separately deployed website and any future synchronization require their own security review. Do not enable public Pages hosting for an app containing or capable of exposing personal health records. Future synchronization requires a separate threat model, authentication, authorization, encryption, consent and audit design.

## Phase C development

Phase C begins with characterization before refactoring. See:
- `docs/phase-c/plan.md` — staged refactoring plan and non-negotiable constraints.
- `docs/phase-c/behavior-inventory.md` — current application and data behaviour.
- `tests/regression/MANUAL-REGRESSION.md` — browser regression checklist.

Run the static source-contract checks with:

```bash
python3 tests/regression/check_source_contract.py
```

These checks do not replace interactive browser testing. The application runtime has not yet been changed in Phase C0.
