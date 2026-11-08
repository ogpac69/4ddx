# Source audit — v22.6

## Artifact identity

- Supplied file: `bioenergetic_profile_v22_6.html`
- File size: 160982 bytes
- SHA-256: `77451c9d271a80f3e4320a4690070160996382398d24954e7b7df6326ac86c11`
- HTML title observed: `Bioenergetic Profile v22.1 — Navigation Fix`
- Header label observed: `PERSONAL HEALTH INTELLIGENCE · V12.0`
- Source filename and embedded labels are inconsistent. The baseline has been preserved byte-for-byte; release metadata should be reconciled in a later deliberate release.

## Architecture

- One self-contained HTML document.
- Inline CSS and vanilla JavaScript.
- No external JS/CSS imports found.
- Browser `localStorage` persistence using `bioenergetic_profile_v1`.
- Canvas-based charts.
- Custom calendar and clock selectors.
- Seven views: dashboard, daily, questionnaire, supplements, healthdata, trends, settings.

## Verified modules

- Questionnaire: 11 modules covering personal history, anthropometry, thermoregulation, digestion/post-meal response, sexual/reproductive health, sleep/circadian rhythm, cognition, muscular performance, nutrition, stress/environment and goals.
- Daily measurements: waking, pre-meal, post-meal and bedtime checkpoints; temperature, pulse, time, method, wake time, context tags and notes.
- Health history: daily weight, sleep duration/quality, bedtime, wake time, free-text symptoms, food and notes.
- Supplement inventory: predefined/custom items, status, amount, frequency, timing, dates, product and notes.
- Adherence: schedule and date-specific taken/skipped/missed records.
- Trends: temperature/pulse charts, morning summary, meal checkpoint comparisons, weight/sleep charts, profile completion.
- Exports: JSON, temperature/pulse CSV and printable HTML report.
- Import: JSON import with basic structural checks; it replaces the active in-memory database.
- Storage: one serialized database object in localStorage.

## Migration cautions

1. Preserve the storage key and existing JSON shape during initial migration.
2. Strengthen import validation only with explicit backup and rollback behavior.
3. Do not reinterpret free-text symptoms or food notes as structured values.
4. Preserve the custom calendar and clock.
5. CSV currently exports daily temperature/pulse measurements, not the entire database.
6. The current trends view is descriptive; it is not a causal or diagnostic engine.
7. Test supplement schedule/adherence behavior independently; inventory dose notes are not equivalent to a scheduled dose.
8. Browser localStorage is origin/profile-specific. Opening a hosted copy will not automatically inherit data from a local file.
