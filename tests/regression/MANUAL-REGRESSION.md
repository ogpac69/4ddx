# Manual browser regression checklist

Use synthetic records only. Before testing, export a JSON backup and keep it outside the app.

## Navigation and layout
- [ ] All seven views open from the navigation.
- [ ] Mobile layout has no horizontal overflow; desktop layout remains usable.
- [ ] Calendar opens, changes month, selects a date and closes.
- [ ] Time picker selects AM/PM and preserves the selected value.

## Daily tracking
- [ ] Save a waking measurement with temperature and pulse.
- [ ] Save pre-meal, post-meal and bedtime checkpoints.
- [ ] Switch °F/°C and confirm the stored value remains Fahrenheit.
- [ ] Reopen a previous date and confirm values persist.
- [ ] Save weight, sleep, symptoms, food and notes; reopen the date.

## Questionnaire
- [ ] Enter values in multiple modules, including a time field and a textarea.
- [ ] Save, navigate away, return and confirm values persist.
- [ ] Completion indicator describes completion only, not health status.

## Supplements
- [ ] Add or edit an inventory item.
- [ ] Record taken, skipped and missed adherence on separate dates.
- [ ] Navigate dates and confirm adherence history remains associated with the correct date.

## Analytics and exports
- [ ] Dashboard and trends render with empty data and with multiple synthetic dates.
- [ ] Temperature/pulse CSV opens and contains expected readings.
- [ ] JSON export downloads and contains all four top-level collections.
- [ ] Import a copy of the exported JSON into a clean test browser profile and confirm values return.
- [ ] Print report opens and browser Print / Save as PDF works.

## Destructive actions
- [ ] Cancel the delete-all confirmation and verify data remains.
- [ ] Only in a disposable test profile, confirm delete-all clears local app data.
