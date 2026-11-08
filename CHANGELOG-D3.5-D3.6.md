# Changelog — D3.5 + D3.6

## D3.5
- Added generator that extracts the exact questionnaire source literal.
- Captures labels, control types, placeholders, select options, module order, and source fingerprint.
- Preserves prior IDs absent from the current rendered questionnaire as legacy-only.
- Added registry synchronization tests.

## D3.6
- Added structured shadow integration adapter.
- Added opt-in Settings control via a guarded patch script.
- Structured answers are refreshed on questionnaire save only when explicitly enabled.
- Legacy answers remain unchanged and authoritative.
- Structured reads and analytics cutover remain disabled.
- Added synthetic integration tests.
