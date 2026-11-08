# 4DDX Phase D3.2 — Assessment data layer

This ZIP includes the D3.1.3 design package plus D3.2 implementation and tests.

Extract at the repository root, preserving paths. Do not replace `app/index.html`.

Run:
```sh
node tests/node/d3.1.3-registry.test.js
node tests/node/d3.2-assessment-data.test.js
node scripts/validate-assessment-registry.js app/index.html
```

The engine is standalone and is not loaded by the deployed app. Existing profile data is not migrated until a future integration explicitly calls the migration function.

Next: integrate behind a feature flag, test actual app backup fixtures, and verify analytics parity before enabling structured writes.
