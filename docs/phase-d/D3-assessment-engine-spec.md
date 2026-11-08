# Phase D3 — Assessment engine specification

Version: 0.1.0  
Status: design specification; not connected to the live app.

## 1. Objective

Turn the tracker's existing self-reported records into transparent longitudinal summaries and carefully bounded interpretations. D3 is an interpretation and review aid, not a diagnostic engine, disease-ranking system, or treatment recommender.

The first implementation is a deterministic, explainable rules engine. It must not use opaque machine-learning predictions or generate disease probabilities.

## 2. Existing input contract

The current application persists one object under localStorage key `bioenergetic_profile_v1`.

Relevant properties confirmed in `app/index.html`:

- `assessment`: keyed baseline questionnaire values.
- `logs`: date-keyed daily records. Each record contains `date`, `wakeTime`, `method`, `measurements` (four checkpoint objects with `label`, `time`, `temp` in °F, `pulse` in BPM), `contextTags`, and `notes`.
- `healthData.daily`: date-keyed records containing `weightKg`, `sleepHours`, `sleepQuality`, `bedtime`, `wakeTime`, `symptoms`, `food`, `notes`, and `updatedAt`.
- `supplements`: keyed inventory objects including `status`, `dose`, `frequency`, `timing`, `dates`, `product`, and `notes`.
- `supplementSchedules` and `supplementAdherence`: schedule and adherence records.

The engine must treat all free-text fields as untrusted user-entered observations. Do not infer medication use, diagnoses, nutrient intake, or causal relationships from ambiguous notes.

## 3. Interpretive sequence

Every generated assessment follows this order:

1. **Data observation:** report exactly what was logged, the time window, counts, units, and missingness.
2. **Bioenergetic interpretation:** primary project lens. Retrieve only matching, source-linked records labelled `bioenergetic_primary`. Clearly state the model and its theoretical status. If no matching verified record exists, say no supported bioenergetic interpretation is available rather than inventing one.
3. **Physiological mechanisms:** show relevant `physiology` records and distinguish established mechanisms from proposed links.
4. **Mainstream clinical comparison:** show relevant `mainstream_comparative` records as a separate section, not a footnote.
5. **Critical appraisal:** show counterevidence, alternative explanations, conflicts, applicability limits, and uncertainty.
6. **Safety and escalation:** show relevant `safety` records. This layer can override the interpretive order when a validated safety trigger is present.

The priority order controls presentation, not truth or certainty. Framework priority must never increase a claim's certainty.

## 4. Engine pipeline

### Stage A — Parse and validate

- Accept a read-only snapshot of the current database object.
- Validate expected types, dates, units, numeric bounds, and array/object shapes.
- Reject malformed values from calculations but preserve the raw source record.
- Never write normalized values back to `db` automatically.
- Do not migrate or mutate participant records.

### Stage B — Normalize for analysis

- Convert dates to a consistent local calendar representation without changing the original date string.
- Temperatures are stored in °F in `db.logs`; convert only for display if requested.
- Pulse is BPM.
- Weight is kg.
- Sleep duration is hours.
- Preserve checkpoint labels, measurement times, and method.
- Keep missing values as missing; never impute a normal value.

### Stage C — Data quality

Calculate and display:
- number of days with any record;
- number of valid temperature/pulse measurements by checkpoint;
- percentage of complete core checkpoints (the first three checkpoints are core in the current UI);
- missing timestamps and measurement method;
- duplicate dates or malformed date keys;
- out-of-range values and values rejected from analysis;
- gaps in the timeline;
- whether measurement methods changed during the comparison window.

Do not label data as clinically reliable merely because the form accepted it.

### Stage D — Descriptive summaries

Permitted summaries:
- count, median, range, and interquartile range where sample size permits;
- daily and checkpoint-specific time series;
- within-person change between explicitly selected windows;
- sleep/weight summaries;
- supplement schedule/adherence descriptions;
- context-tag frequency.

For a trend comparison, show both windows, date range, number of observations, and missingness. Do not silently choose a favourable baseline. Do not compare unlike checkpoints or measurement methods as if they were equivalent.

### Stage E — Context and competing explanations

Present context tags and notes as possible confounders, not causal variables. Examples include illness, activity, meal timing, caffeine, alcohol, ambient temperature, stress, menstrual cycle where applicable, medication changes, and measurement method. Only use factors actually recorded or explicitly asked about. Do not fabricate context.

### Stage F — Knowledge retrieval

Retrieve records by topic and framework. A record is eligible only if:
- its schema validates;
- its status is `reviewed` or `approved`;
- source verification is adequate for the claim;
- the topic and population/measurement context are relevant.

Draft, unverified, retired, or poorly matched records may appear only in a clearly marked research queue, never as authoritative interpretation.

### Stage G — Compose report

Each report follows `D3-assessment-output.schema.json`. Every interpretation links to one or more knowledge record IDs. If no suitable record exists, leave that layer empty and explain why.

## 5. Minimum data requirements

There is no universal minimum observation count that makes a trend medically meaningful. The engine should use conservative display gates:

- 1 valid observation: show the observation only.
- 2–3 observations: show a small-sample summary with an explicit warning; do not label a trend.
- 4–6 observations: allow a provisional descriptive comparison only when checkpoints and methods match.
- 7+ observations: allow a descriptive trend view, still not a diagnosis or causal claim.

These are UI/reporting gates, not clinical thresholds. A later implementation must keep the gates configurable and explain them.

## 6. Safety rules

- Never use temperature or pulse alone to infer thyroid status, metabolic rate, infection, shock, or another disease.
- Never recommend starting, stopping, or changing medication or supplement doses.
- Never delay emergency care because a bioenergetic interpretation appears plausible.
- Do not present population reference ranges as individual targets.
- Red-flag rules must come from verified, current, jurisdiction-appropriate clinical sources and be reviewed before implementation.
- If an urgent symptom is reported in free text, the engine must not pretend to reliably classify it with keyword matching. It should display a conservative prompt to seek professional assessment when the text suggests immediate danger, and preserve the original wording for human review.
- If safety knowledge is missing or stale, state that the safety layer is incomplete; do not invent thresholds.

## 7. Bioenergetic interpretation rules

- The bioenergetic layer is shown first and is the primary conceptual lens.
- It must cite specific knowledge record IDs and identify the originating model/author.
- Each claim must carry `theoretical_status`.
- A historical hypothesis is not upgraded by being displayed first.
- The engine must not infer that a person has "low metabolism", "high stress hormones", "thyroid dysfunction", or "cellular dehydration" from isolated temperature/pulse patterns.
- Do not attribute a claim to Ray Peat, Gilbert Ling, Warburg, or Szent-Györgyi without source-level support.
- Where the catalog has no eligible matching record, say so plainly.

## 8. Non-goals

D3 does not:
- diagnose or rank diseases;
- calculate disease probabilities;
- provide medication or supplement dosing;
- infer causality from co-occurring logs;
- automatically alter the user's records;
- upload or synchronize health data;
- send data to an external AI service;
- claim that a bioenergetic model is clinically validated without evidence.

## 9. Implementation sequence

D3.1: implement pure parsing/validation and descriptive summaries on synthetic fixtures.  
D3.2: add knowledge-record retrieval and source-linked layer composition.  
D3.3: add the report UI in a separate view, initially read-only and opt-in.  
D3.4: run regression, privacy, safety, and manual mobile browser tests before connecting real participant data.

Do not skip directly to interpretation UI before the pure engine passes synthetic tests.
