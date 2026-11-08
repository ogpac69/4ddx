# Phase D1 — Knowledge foundation

Status: proposed foundation package; not yet merged into the live repository or deployed website.

## Objective

Create a versioned, source-traceable knowledge layer that can later support cautious interpretation of a single participant's longitudinal health observations. This is not a diagnostic engine and must not produce disease rankings or autonomous treatment recommendations.

## Non-negotiable principles

1. Separate clinical guidance, human outcome evidence, observational evidence, mechanistic evidence, animal/cellular evidence, historical theories, and speculation.
2. Never promote a mechanistic explanation into a clinical recommendation without relevant human outcome evidence.
3. Store evidence quality separately from certainty in a claim and separately from relevance to the participant.
4. Record population, measurement method, context, limitations, conflicts, and review date.
5. Every factual claim must have a traceable source. Never invent citations or fill missing details by inference.
6. Preserve uncertainty. Conflicting, null, and negative findings are valid records.
7. Keep the participant's records separate from the public knowledge repository.
8. Knowledge updates must never mutate or migrate participant data.
9. No automatic diagnosis, disease probability, medication changes, or supplement dosing recommendations.
10. Ray Peat, Gilbert Ling, and related bioenergetic frameworks may be represented as historical/theoretical hypotheses, clearly labelled and tested against contemporary evidence.

## Knowledge record types

- `clinical_guideline`: recommendation from an identifiable professional body or public health authority.
- `reference_interval`: laboratory or physiological interval with population, method, and source.
- `evidence_synthesis`: systematic review, meta-analysis, or evidence report.
- `human_trial`: randomized or non-randomized intervention study.
- `observational_study`: cohort, case-control, cross-sectional, or other observational human evidence.
- `mechanism`: human mechanistic or physiological research.
- `preclinical`: animal, ex-vivo, or cellular research.
- `historical_hypothesis`: historically important theory or author's proposed model.
- `interpretive_rule`: transparent rule for describing tracker observations; not a diagnosis.

## Evidence dimensions (do not collapse into one score)

- `study_design`: what kind of evidence it is.
- `risk_of_bias`: assessed limitations of the source/study.
- `certainty`: certainty in the specific claim, not a generic score for the paper.
- `population_match`: how well the evidence population matches the person being assessed.
- `measurement_match`: whether the source's measurement method matches the tracker method.
- `clinical_actionability`: whether evidence supports any clinical action; default `none`.
- `consistency`: whether other credible evidence agrees, conflicts, or is insufficient.

Avoid a single numeric "evidence score". It creates false precision and hides why evidence is weak.

## Suggested repository domains

1. `clinical-references`: guidelines, red flags, laboratory reference context.
2. `physiology`: established human physiology and measurement interpretation.
3. `bioenergetics`: Peat/Ling-inspired hypotheses and related models, separately labelled.
4. `nutrition`: dietary patterns, nutrient requirements, human outcome evidence.
5. `foods`: food composition and practical food context, not health claims by default.
6. `supplements`: efficacy, safety, interactions, contraindications, and product variability.
7. `medications`: drug class context and interaction references; no prescribing.
8. `sleep`: sleep duration, circadian timing, measurement limitations, clinical context.
9. `temperature-pulse`: measurement protocol, normal variation, confounders, and clinical caveats.
10. `research`: cross-domain studies and review queue; avoid duplicating canonical records.

## Relationship to tracker data

The current app collects temperature, pulse, time/checkpoint, weight, sleep, symptoms, food notes, and supplement adherence. A later assessment layer may:
- summarize within-person trends;
- identify missing or inconsistent measurements;
- show possible confounders;
- compare observations with appropriately matched references;
- present competing explanations with evidence labels;
- state when evidence is insufficient and suggest clinician review where appropriate.

It must not infer a diagnosis from isolated temperature, pulse, weight, sleep, or symptom entries.

## Proposed assessment output

Each generated observation should contain:
- `observation`: what the data literally show;
- `time_window`: dates and number of observations;
- `data_quality`: missingness, measurement consistency, and limitations;
- `context`: known confounders and relevant participant context;
- `possible_interpretations`: explicitly non-diagnostic alternatives;
- `evidence_links`: stable knowledge record IDs;
- `counterevidence`: evidence or context that weakens each interpretation;
- `uncertainty`: what cannot be concluded;
- `next_measurement`: optional measurement-quality improvement;
- `clinical_review_note`: only when warranted by established guidance or safety concerns.

## Initial priority order

1. Measurement methods and limitations for temperature and pulse.
2. Normal within-person variation and confounders.
3. Sleep timing/duration and basic anthropometry context.
4. Nutrition fundamentals and dietary adequacy.
5. Supplement safety and medication interaction references.
6. Bioenergetic hypotheses mapped against human evidence and counterevidence.

## Release gates

D1 is complete when the record contract, evidence policy, dataset ownership, and validation rules are agreed.
D2 is complete only when initial records have verified source citations and have passed schema validation.
D3 is complete only when the assessment output can be traced to source records and cannot silently convert hypotheses into clinical facts.
