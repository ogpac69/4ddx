/*
 * 4DDX D4.3 — transparent differential-reasoning primitives.
 * This module organizes clinician/user-entered hypotheses. It does not diagnose,
 * rank diseases, estimate probabilities, or recommend treatment.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.D4DiagnosticReasoning = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const EVIDENCE_LEVELS = Object.freeze([
    'established_mechanism', 'supported_hypothesis', 'contested_claim', 'speculation', 'unknown'
  ]);
  const STATUS = Object.freeze(['open', 'supported', 'weakened', 'deferred', 'closed']);
  const PERSPECTIVES = Object.freeze(['mainstream_clinical', 'bioenergetic_peat_ling', 'other']);
  const REQUIRED_LISTS = ['supportingObservations', 'contradictingObservations', 'confounders', 'predictions', 'falsifiers', 'missingData'];

  function cleanText(value, max) {
    return typeof value === 'string' ? value.trim().slice(0, max || 1000) : '';
  }
  function uniqueStrings(values) {
    if (!Array.isArray(values)) return [];
    return [...new Set(values.map(v => cleanText(v, 500)).filter(Boolean))];
  }
  function makeHypothesis(input) {
    input = input || {};
    const evidenceLevel = EVIDENCE_LEVELS.includes(input.evidenceLevel) ? input.evidenceLevel : 'unknown';
    const perspective = PERSPECTIVES.includes(input.perspective) ? input.perspective : 'other';
    const status = STATUS.includes(input.status) ? input.status : 'open';
    const h = {
      id: cleanText(input.id, 100) || ('hyp-' + Math.random().toString(36).slice(2, 10)),
      title: cleanText(input.title, 180),
      mechanism: cleanText(input.mechanism, 2000),
      perspective,
      evidenceLevel,
      status,
      supportingObservations: uniqueStrings(input.supportingObservations),
      contradictingObservations: uniqueStrings(input.contradictingObservations),
      confounders: uniqueStrings(input.confounders),
      predictions: uniqueStrings(input.predictions),
      falsifiers: uniqueStrings(input.falsifiers),
      missingData: uniqueStrings(input.missingData),
      sourceNotes: cleanText(input.sourceNotes, 2000),
      updatedAt: cleanText(input.updatedAt, 80) || null
    };
    if (!h.title) throw new Error('Hypothesis title is required.');
    return h;
  }
  function createCase(input) {
    input = input || {};
    return {
      schemaVersion: '4ddx.d4.3',
      caseId: cleanText(input.caseId, 100) || ('case-' + Date.now().toString(36)),
      createdAt: cleanText(input.createdAt, 80) || new Date().toISOString(),
      clinicalQuestion: cleanText(input.clinicalQuestion, 1000),
      observations: uniqueStrings(input.observations),
      timeline: Array.isArray(input.timeline) ? input.timeline.map(x => ({
        date: cleanText(x && x.date, 40), event: cleanText(x && x.event, 500),
        context: cleanText(x && x.context, 500)
      })).filter(x => x.date || x.event || x.context) : [],
      hypotheses: Array.isArray(input.hypotheses) ? input.hypotheses.map(makeHypothesis) : [],
      safetyReview: {
        redFlagsPresent: uniqueStrings(input.safetyReview && input.safetyReview.redFlagsPresent),
        reviewedByClinician: !!(input.safetyReview && input.safetyReview.reviewedByClinician),
        notes: cleanText(input.safetyReview && input.safetyReview.notes, 2000)
      },
      boundaries: {
        noProbabilityScoring: true,
        noAutomatedDiagnosis: true,
        noTreatmentDosing: true,
        statement: 'Organizes observations and competing explanations; it is not a diagnosis or a substitute for clinical assessment.'
      }
    };
  }
  function addHypothesis(caseData, hypothesis) {
    const c = cloneCase(caseData);
    const h = makeHypothesis(hypothesis);
    if (c.hypotheses.some(x => x.id === h.id)) throw new Error('Hypothesis ID already exists.');
    c.hypotheses.push(h);
    return c;
  }
  function updateHypothesis(caseData, id, patch) {
    const c = cloneCase(caseData);
    const i = c.hypotheses.findIndex(x => x.id === id);
    if (i < 0) throw new Error('Hypothesis not found.');
    c.hypotheses[i] = makeHypothesis(Object.assign({}, c.hypotheses[i], patch || {}, { id }));
    return c;
  }
  function cloneCase(c) {
    if (!c || c.schemaVersion !== '4ddx.d4.3') throw new Error('Invalid D4.3 case.');
    return JSON.parse(JSON.stringify(c));
  }
  function assessCompleteness(h) {
    const present = REQUIRED_LISTS.filter(k => Array.isArray(h[k]) && h[k].length > 0);
    return {
      populatedSections: present,
      emptySections: REQUIRED_LISTS.filter(k => !present.includes(k)),
      hasCompetingEvidence: h.supportingObservations.length > 0 && h.contradictingObservations.length > 0,
      hasTestablePrediction: h.predictions.length > 0 && h.falsifiers.length > 0,
      hasConfounderReview: h.confounders.length > 0,
      completeness: Math.round((present.length / REQUIRED_LISTS.length) * 100)
    };
  }
  function review(caseData) {
    const c = cloneCase(caseData);
    return {
      caseId: c.caseId,
      clinicalQuestion: c.clinicalQuestion,
      hypothesisReviews: c.hypotheses.map(h => ({
        id: h.id, title: h.title, perspective: h.perspective,
        evidenceLevel: h.evidenceLevel, status: h.status,
        review: assessCompleteness(h),
        caution: h.evidenceLevel === 'contested_claim' || h.evidenceLevel === 'speculation'
          ? 'Keep this interpretation provisional; seek independent evidence and plausible alternatives.' : null
      })),
      safety: {
        redFlagsPresent: c.safetyReview.redFlagsPresent,
        requiresHumanClinicalReview: c.safetyReview.redFlagsPresent.length > 0,
        note: c.safetyReview.redFlagsPresent.length
          ? 'A red-flag item was recorded. Use appropriate urgent or emergency medical services; this engine cannot triage severity.'
          : 'No red flags were entered. This does not establish that the case is safe or exclude urgent illness.'
      },
      limitations: [
        'No disease probability or diagnostic ranking is calculated.',
        'Evidence labels are entered by the user and are not independently verified.',
        'Absence of a recorded finding is not evidence that the finding is absent.',
        'Bioenergetic interpretations are kept distinct from mainstream clinical evidence.'
      ]
    };
  }
  function validate(caseData) {
    const errors = [];
    if (!caseData || caseData.schemaVersion !== '4ddx.d4.3') errors.push('Unsupported schema version.');
    if (caseData && !Array.isArray(caseData.hypotheses)) errors.push('Hypotheses must be an array.');
    if (caseData && Array.isArray(caseData.hypotheses)) {
      const ids = caseData.hypotheses.map(h => h.id);
      if (new Set(ids).size !== ids.length) errors.push('Hypothesis IDs must be unique.');
      caseData.hypotheses.forEach((h, i) => {
        if (!h.title) errors.push('Hypothesis ' + i + ' has no title.');
        if (!EVIDENCE_LEVELS.includes(h.evidenceLevel)) errors.push('Hypothesis ' + i + ' has invalid evidence level.');
        if (!PERSPECTIVES.includes(h.perspective)) errors.push('Hypothesis ' + i + ' has invalid perspective.');
      });
    }
    return { valid: errors.length === 0, errors };
  }
  return Object.freeze({
    VERSION: '4.3.0', EVIDENCE_LEVELS, STATUS, PERSPECTIVES,
    createCase, makeHypothesis, addHypothesis, updateHypothesis,
    assessCompleteness, review, validate
  });
});
