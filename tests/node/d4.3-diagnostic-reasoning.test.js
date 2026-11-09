const assert = require('assert');
const D = require('../../engine/d4-diagnostic-reasoning.js');

const c0 = D.createCase({
  clinicalQuestion: 'What explains recurring fatigue?',
  observations: ['Fatigue is worse after poor sleep'],
  safetyReview: { redFlagsPresent: [] }
});
assert.strictEqual(c0.schemaVersion, '4ddx.d4.3');
const c1 = D.addHypothesis(c0, {
  id: 'h1', title: 'Sleep disruption may contribute', perspective: 'mainstream_clinical',
  evidenceLevel: 'supported_hypothesis',
  supportingObservations: ['Fatigue follows short sleep'],
  contradictingObservations: ['Fatigue also occurs after adequate sleep'],
  confounders: ['Caffeine timing', 'Workload'],
  predictions: ['Improved sleep regularity may coincide with lower fatigue'],
  falsifiers: ['Fatigue remains unchanged across a sustained period of adequate sleep'],
  missingData: ['Sleep duration measured consistently']
});
assert.strictEqual(c0.hypotheses.length, 0, 'addHypothesis must not mutate source');
assert.strictEqual(c1.hypotheses.length, 1);
assert.strictEqual(D.assessCompleteness(c1.hypotheses[0]).completeness, 100);
assert.strictEqual(D.review(c1).hypothesisReviews.length, 1);
assert.strictEqual(D.review(c1).safety.requiresHumanClinicalReview, false);
const c2 = D.updateHypothesis(c1, 'h1', { status: 'deferred' });
assert.strictEqual(c2.hypotheses[0].status, 'deferred');
assert.strictEqual(c1.hypotheses[0].status, 'open', 'update must not mutate source');
const unsafe = D.createCase({ safetyReview: { redFlagsPresent: ['new one-sided weakness'] } });
assert.strictEqual(D.review(unsafe).safety.requiresHumanClinicalReview, true);
assert.strictEqual(D.validate(c1).valid, true);
assert.throws(() => D.addHypothesis(c1, { id: 'h1', title: 'Duplicate' }), /already exists/);
assert.throws(() => D.addHypothesis(c1, { title: '' }), /required/);
console.log('D4.3 tests passed');
