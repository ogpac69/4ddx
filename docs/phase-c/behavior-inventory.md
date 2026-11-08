# v22.6 behaviour inventory

This is the initial characterization inventory for the preserved v22.6 source. It is a record of existing behaviour, not a promise that every workflow has already passed interactive browser testing.

## Application shell
- Seven views: dashboard, daily, questionnaire, supplements, healthdata, trends, settings.
- Dark, mobile-first single-page HTML/CSS/JavaScript application.
- Custom date calendar and clock/time pickers.
- Canvas-rendered charts.

## Local data contract
- localStorage key: `bioenergetic_profile_v1`.
- Top-level collections: `logs`, `assessment`, `supplements`, `customSupplements`.
- Daily measurement records are date-keyed under `logs`.
- Temperature is stored in Fahrenheit; display can be switched to Celsius.
- No cloud synchronization; data is browser-origin-specific.

## Tracking and assessment
- Daily measurement checkpoints: waking, pre-meal, post-meal, bedtime.
- Daily health records include weight, sleep, symptoms, food and notes.
- Questionnaire modules cover profile/history, anthropometry, thermoregulation, digestion, reproductive health, sleep, cognition, physical performance, nutrition, lifestyle and goals.
- Questionnaire completion is a completion indicator, not a health score.

## Supplements
- Inventory supports predefined and custom items.
- Inventory metadata and date-specific adherence are separate concepts.
- Adherence states include taken, skipped and missed.

## Analytics and exports
- Dashboard, trends, averages/ranges, checkpoint comparisons, weight/sleep trends, questionnaire completion.
- Full JSON backup export and JSON import.
- Temperature/pulse CSV export; this is not a complete export of every data category.
- Printable HTML report with browser print / Save as PDF workflow.

## Known risks to protect during refactoring
- JSON import currently performs only basic structural validation and replaces the active in-memory database after parsing.
- Import rollback and schema-version handling are not yet robust.
- CSV export is narrower than the full JSON backup.
- Source is monolithic and contains inline event handlers; extraction must preserve callable names until handlers are migrated.
- Labels in the document title and header do not consistently match the source filename. Resolve intentionally during a release-label task, not during mechanical extraction.
