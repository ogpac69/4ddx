(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.D4QuestionnaireRegistry = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const VERSION = '4.1.0';
  const DOMAIN_RULES = [
    [/personal profile|health history/i, 'personal_history'],
    [/anthropometry|body composition/i, 'anthropometry'],
    [/thermoregulation|metabolism/i, 'thermoregulation'],
    [/post-meal|digestion/i, 'digestion'],
    [/sexual|reproductive/i, 'reproductive_health'],
    [/circadian|sleep/i, 'circadian_sleep'],
    [/cognition|mental performance/i, 'cognition'],
    [/muscle mass|physical performance/i, 'physical_performance'],
    [/nutrition|food intake/i, 'nutrition'],
    [/stress|environment|lifestyle/i, 'stress_environment'],
    [/goals|agency|life direction/i, 'goals_agency']
  ];
  const UNIT_RULES = [
    [/\btemperature\b|\btemp\b/i, '°F'], [/\bpulse\b|\bheart rate\b/i, 'bpm'],
    [/weight \(kg\)|weight.*\(kg\)/i, 'kg'], [/height.*cm/i, 'cm'],
    [/circumference \(cm\)/i, 'cm'], [/body-fat percentage/i, '%'],
    [/\(hours\)|duration \(hours\)|hours\)/i, 'h'], [/\(minutes\)|minutes\)/i, 'min'],
    [/\(minutes\) per day/i, 'min/day'], [/\(kcal\)/i, 'kcal/day'],
    [/\(mL per day\)/i, 'mL/day'], [/\(g\/day\)|\(g\)/i, 'g/day'],
    [/\(l\)/i, 'L/day'], [/steps/i, 'steps/day'], [/\(bpm\)/i, 'bpm']
  ];
  const NUMERIC_TYPES = new Set(['number','range']);
  function domainFor(title) { const hit = DOMAIN_RULES.find(([re]) => re.test(title || '')); return hit ? hit[1] : 'other'; }
  function unitFor(label, id) { const hit = UNIT_RULES.find(([re]) => re.test(label || '')); if (hit) return hit[1]; if (id === 'morning_temp') return '°F'; if (id === 'morning_pulse') return 'bpm'; return null; }
  function validateItem(item) {
    if (!item || typeof item !== 'object') throw new TypeError('Question definition must be an object');
    if (!/^[a-z][a-z0-9_]*$/.test(item.id || '')) throw new Error('Invalid question ID: ' + item.id);
    if (!item.label || !item.domain || !item.type) throw new Error('Question requires id, label, domain and type');
    if (item.type === 'select' && !Array.isArray(item.options)) throw new Error(item.id + ': select options must be an array');
    if (Array.isArray(item.options) && new Set(item.options).size !== item.options.length) throw new Error(item.id + ': duplicate options');
    if (item.validation && item.validation.min != null && item.validation.max != null && item.validation.min > item.validation.max) throw new Error(item.id + ': min exceeds max');
    return true;
  }
  function build(modules) {
    if (!Array.isArray(modules)) throw new TypeError('modules must be an array');
    const seen = new Set(), questions = [], domains = [];
    modules.forEach((mod, index) => {
      const domain = domainFor(mod.title);
      domains.push({ id: domain, title: String(mod.title || '').replace(/^\d+\s*[·.]\s*/, ''), order: index + 1, description: mod.desc || '' });
      (mod.items || []).forEach((raw, order) => {
        const [id,label,type,extra] = raw;
        if (seen.has(id)) throw new Error('Duplicate questionnaire ID: ' + id);
        seen.add(id);
        const item = {
          id, label, domain, moduleOrder: index + 1, order: order + 1, type,
          options: type === 'select' ? (Array.isArray(extra) ? extra.slice() : []) : null,
          placeholder: typeof extra === 'string' ? extra : null,
          unit: unitFor(label, id),
          valueType: NUMERIC_TYPES.has(type) ? 'number' : (type === 'checkbox' ? 'boolean' : 'string'),
          required: false,
          missingness: ['not_answered','unknown','not_measured','not_applicable','prefer_not_to_answer','explicit_none'],
          provenance: ['self_report','measured','estimated','recalled','imported','clinician_record','device_record','unknown'],
          validation: NUMERIC_TYPES.has(type) ? { min: null, max: null, step: 'any', finite: true } : null,
          source: 'existing_questionnaire'
        };
        validateItem(item); questions.push(item);
      });
    });
    return { registryVersion: VERSION, generatedAt: null, questionCount: questions.length, domainCount: domains.length, domains, questions };
  }
  function validateRegistry(registry) {
    const errors = [];
    if (!registry || registry.registryVersion !== VERSION) errors.push('Unsupported registry version');
    if (!Array.isArray(registry && registry.questions)) errors.push('questions must be an array');
    else {
      const ids = new Set();
      registry.questions.forEach(q => { try { validateItem(q); } catch (e) { errors.push(e.message); } if (ids.has(q.id)) errors.push('Duplicate ID: ' + q.id); ids.add(q.id); });
      if (registry.questionCount !== registry.questions.length) errors.push('questionCount mismatch');
    }
    return { valid: errors.length === 0, errors };
  }
  function get(registry, id) { return registry && Array.isArray(registry.questions) ? registry.questions.find(q => q.id === id) || null : null; }
  function byDomain(registry, domain) { return (registry && registry.questions || []).filter(q => q.domain === domain); }
  return Object.freeze({ VERSION, build, validateItem, validateRegistry, get, byDomain });
});
