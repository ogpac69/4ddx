# 4DDX D4.1–D4.2 UI integration

This additive release wires the canonical questionnaire registry into field rendering and connects the longitudinal engine to the Trends view. It includes root GitHub Pages and app copies, both using the same engine files.

The current live questionnaire source was validated as 11 modules and 178 questions. Registry validation found no duplicate IDs or invalid definitions.

No localStorage schema migration is performed. Existing assessment values, daily logs, health records, supplements, and JSON import/export behavior remain in their existing structures. The longitudinal panel is read-only.

Install by extracting the ZIP into the repository root and preserving paths. Android-only users can install the files through Gitling without running scripts.
