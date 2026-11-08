# Architecture decisions

## ADR-001 — Local-first data boundary

Personal records remain in the user's browser and in user-controlled exports. Knowledge datasets are versioned repository assets. Importing/updating knowledge must never mutate the personal record database.

## ADR-002 — Tracker is not a diagnostic engine

The application supports self-recording, historical assessment and longitudinal review. It does not rank diseases, generate differential diagnoses or automatically prescribe investigations. HOLOS is a separate project and is outside this repository's scope.

## ADR-003 — Participant and reviewer workflow

The tracker operator records observations. A designated reviewer may receive an exported backup and review changes over time. Initial sharing is manual file export/import. No account system, remote database or live synchronization is included.

## ADR-004 — Preserve the monolith during baseline capture

The original v22.6 HTML remains the executable application in Phase B. Code separation is deferred to Phase C and must be incremental, behavior-preserving and covered by tests.

## ADR-005 — Independent knowledge versioning

Application, schema and knowledge versions are tracked separately. Knowledge packages are validated before import and are not permitted to overwrite personal data.

## ADR-006 — Evidence provenance

Every knowledge assertion must carry its evidence classification, population, limitations and citations. Historical and speculative bioenergetic ideas must not be presented as established clinical knowledge.
