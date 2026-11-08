# Phase C — Safe application refactoring

## Objective
Move the v22.6 single-file tracker toward maintainable modules without changing its user-facing behaviour, stored data, or manual sharing model.

## Non-negotiable constraints
- This is a logging, tracking, history, and assessment-record tool. It is not HOLOS and must not become a disease detector.
- No diagnosis, differential diagnosis, disease ranking, or automated investigation recommendations.
- Preserve the dark, mobile-first interface and all existing workflows unless a separately reviewed change explicitly authorizes a change.
- Preserve the `bioenergetic_profile_v1` localStorage key and existing JSON data shape during the first extraction stages.
- Preserve the v22.6 baseline byte-for-byte in `docs/source-baselines/v22.6-original.html`.
- Keep participant records local and support manual JSON export/import. No cloud sync is introduced.
- Ray Peat/Ling-inspired ideas may be represented only as clearly labelled interpretive context; do not present hypotheses as established clinical facts.

## Work sequence

### C0 — Characterization (current)
- Record the existing application surface and storage contract.
- Add automated static regression checks for the source baseline, navigation views, storage key, data collections, and critical workflows.
- Add a manual browser regression checklist for workflows that require a real browser and user interaction.
- Do not change application runtime code in this stage.

### C1 — Testable runtime seams
- Add a repeatable browser test harness if the target environment supports it.
- Test localStorage load/save, date navigation, temperature-unit conversion, questionnaire save, supplement adherence, JSON export/import, and delete confirmation using synthetic data only.
- Establish import validation and rollback tests before modifying import behaviour.

### C2 — Extract pure utilities
- Extract escaping, date/time formatting, temperature conversion, and data-shaping helpers into modules.
- Keep a compatibility adapter so the existing inline handlers continue to work during transition.
- Compare outputs against characterization tests.

### C3 — Extract storage and domain modules
- Separate storage, daily tracking, questionnaire, supplements, analytics, and exports incrementally.
- Maintain the existing localStorage key and backward-compatible data shape.
- Introduce explicit schema versioning only with a tested migration and rollback path.

### C4 — Stabilize and release
- Run the full regression suite on desktop and mobile browsers.
- Test old backups, new backups, malformed imports, empty datasets, and multi-day histories.
- Update release labels and documentation deliberately; do not silently change version strings.

## Completion criteria
- No regression in the manual checklist.
- Existing v22.6 data loads without transformation or loss.
- JSON backup round-trips successfully; invalid imports do not overwrite valid local data.
- All automated checks pass.
- No diagnosis/disease-detector functionality is added.
