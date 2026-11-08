# 4DDX Phase D3.3 — Integration bridge

This ZIP includes D3.1.3 and D3.2 plus the D3.3 bridge and tests.

Extract at repository root, preserving paths. Do not replace `app/index.html`.

Run:
```sh
node tests/node/d3.1.3-registry.test.js
node tests/node/d3.2-assessment-data.test.js
node tests/node/d3.3-assessment-bridge.test.js
```

The bridge is standalone and intentionally not loaded by the live app. Migration is preview-only until a later release adds explicit backup and user confirmation controls.
