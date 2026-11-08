# D3 — Assessment output contract

The output schema is `schemas/D3-assessment-output.schema.json`.

## Required report sections

- `observation_summary`: literal description of the selected period.
- `data_quality`: valid counts, missingness, comparability, exclusions.
- `bioenergetic_interpretation`: primary lens; source-linked and theory-labelled.
- `physiology`: established mechanisms and proposed links kept distinct.
- `mainstream_comparison`: independent clinical evidence section.
- `critical_appraisal`: counterevidence, alternative explanations, and uncertainty.
- `safety`: verified safety information and escalation status.
- `next_steps`: optional measurement-quality improvements or clinician-discussion prompts.

## Empty layers

An empty array is valid. The report must explain when no eligible knowledge record exists. It must never fill a missing layer with invented medical facts.

## Provenance

Each interpretation item includes:
- a concise claim;
- explanation;
- theoretical status;
- evidence description;
- applicability note;
- linked knowledge record IDs;
- counterevidence IDs where available.

## Output language

Use neutral language:
- "The records show..."
- "One possible interpretation in [model] is..."
- "This is a hypothesis, not a clinical conclusion."
- "The available records do not establish..."
- "The comparison is limited because..."

Avoid:
- "You have..."
- "This proves..."
- "Your thyroid is..."
- "Your metabolism is..."
- "This supplement caused..."
