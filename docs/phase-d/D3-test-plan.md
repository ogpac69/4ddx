# D3 — Test plan

All tests use synthetic records. Never place participant exports or identifiable health information in the repository.

## Parser and validation

1. Empty database object.
2. Missing optional collections.
3. Malformed date key.
4. Invalid temperature/pulse type.
5. Numeric value outside app input bounds.
6. Duplicate date values.
7. Missing checkpoint timestamp.
8. Missing measurement method.
9. Temperature stored as °F and display conversion requested.
10. Health-data entry with only symptoms or notes.
11. Supplement record with missing dose.
12. Unknown fields preserved but ignored by calculations.

## Statistical summaries

1. One observation: no trend claim.
2. Two observations: small-sample warning.
3. Several matched morning observations: median/range computed correctly.
4. Missing values excluded from numeric calculations but counted in data quality.
5. Different checkpoints not pooled.
6. Different measurement methods not silently pooled.
7. Outlier retained in raw data and flagged; no silent deletion.
8. Time-window comparison reports both date ranges and sample sizes.
9. No data in selected period produces an explicit empty state.
10. Daylight-saving/time-zone boundary does not rewrite original date keys.

## Knowledge retrieval and output

1. Reviewed, source-verified matching record is eligible.
2. Draft record is excluded from authoritative interpretation.
3. Unverified source is excluded or marked research-only.
4. Retired record is excluded.
5. Bioenergetic hypothesis appears in the primary section with theoretical status.
6. Mainstream comparison appears in its own section.
7. Counterevidence is attached to the relevant claim.
8. Missing knowledge produces an empty section and explanation, not invented content.
9. Safety record can override display order.
10. Every claim has record IDs; no orphan claims.

## Safety and privacy

1. Engine never produces medication start/stop/dose advice.
2. Engine never produces diagnosis or disease probability.
3. Raw user notes are not sent to a network service.
4. Engine does not mutate the input database object.
5. No real participant data in fixtures, logs, screenshots, or commits.
6. Export remains manual and local.
7. Unknown safety state is reported as incomplete, not safe.

## Acceptance criteria

D3.1 passes only when:
- all synthetic tests pass;
- input object remains byte-for-byte equivalent after analysis;
- output validates against the output schema;
- each interpretation is traceable to a knowledge record;
- unsupported interpretations are omitted;
- no diagnostic or intervention output can be produced.
