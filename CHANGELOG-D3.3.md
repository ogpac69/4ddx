# Changelog — D3.3

- Added feature-flagged compatibility bridge between legacy assessment storage and D3.2 structured answers.
- Added pure migration preview, backup-returning migration, rollback, and fail-closed feature flag helpers.
- Added legacy-first/structured-first read routing based on flag state.
- Added synthetic bridge tests.
- No live app modifications, no localStorage writes, no profile migrations.
