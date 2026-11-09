'use strict';
const assert = require('node:assert/strict');
const Registry = require('../../engine/d4-questionnaire-registry.js');
const Long = require('../../engine/d4-longitudinal.js');

const modules = [
  {title:'01 · Thermoregulation & metabolism',desc:'temp and pulse',items:[
    ['morning_temp','Typical waking temperature (°F)','number',''],
    ['morning_pulse','Typical waking resting pulse (BPM)','number',''],
    ['temp_method','Temperature measurement site','select',['Oral','Axillary']]
  ]},
  {title:'02 · Nutrition & food intake',desc:'diet',items:[
    ['protein_g','Estimated protein per day (g)','number',''],
    ['food_log','Three-day food record','textarea','']
  ]}
];
const registry=Registry.build(modules);
assert.equal(registry.questionCount,5);
assert.equal(Registry.validateRegistry(registry).valid,true);
assert.equal(Registry.get(registry,'morning_temp').unit,'°F');
assert.equal(Registry.get(registry,'morning_pulse').domain,'thermoregulation');
assert.deepEqual(Registry.get(registry,'temp_method').options,['Oral','Axillary']);
assert.equal(Registry.byDomain(registry,'nutrition').length,2);
assert.throws(()=>Registry.build([{title:'x',items:[['bad_id','Bad','text',''],['bad_id','Duplicate','text','']]}]),/Duplicate/);

assert.equal(Long.convert(98.6,'°F','temperature').value,37);
assert.ok(Math.abs(Long.convert(10,'lb','weight').value-4.5359237)<1e-9);
assert.equal(Long.convert(750,'mL','water').value,0.75);
assert.equal(Long.convert(90,'min','sleep_duration').value,1.5);
const profile={
  logs:{
    '2026-11-01':{method:'oral',measurements:[{label:'Waking',time:'07:00',temp:97.7,pulse:62,contextTags:['fasted']},{label:'Pre-meal',time:'12:00',temp:98.1,pulse:70}]},
    '2026-11-02':{measurements:[{label:'Waking',time:'07:10',temp:98.0,pulse:64}]}
  },
  healthData:{daily:{
    '2026-11-01':{weightKg:57,sleepHours:7.5,sleepQuality:'Good',updatedAt:'2026-11-01T08:00:00Z'},
    '2026-11-02':{weightKg:57.2,sleepHours:8,notes:'normal'}
  }},
  assessment:{morning_temp:'98.2'}
};
const events=Long.collect(profile);
assert.equal(events.length,11); // 6 log events + 5 dated health metrics
const firstTemp=events.find(e=>e.metric==='temperature');
assert.equal(firstTemp.unit,'°C');
assert.equal(firstTemp.rawUnit,'°F');
assert.equal(firstTemp.provenance,'measured');
assert.equal(events.some(e=>e.metric==='weight'&&e.value===57),true);
assert.equal(events.some(e=>e.metric==='sleep_duration'&&e.value===7.5),true);
assert.equal(events.some(e=>e.rawValue==='Good'&&e.metric==='sleep_quality'),true);
const temps=Long.series(events,'temperature');
assert.equal(temps.length,3);
const summary=Long.summarize(events,'temperature');
assert.equal(summary.count,3);
assert.equal(summary.firstDate,'2026-11-01');
assert.equal(summary.lastDate,'2026-11-02');
assert.ok(summary.median>36 && summary.median<37);
assert.equal(summary.interpretation,'Descriptive only; not a diagnosis or causal estimate.');
assert.equal(Long.weekly(events,'weight').length,2);
assert.throws(()=>Long.event({metric:'pulse',date:'11/01/2026',value:70,unit:'bpm'}),/YYYY-MM-DD/);
assert.throws(()=>Long.event({metric:'unknown',date:'2026-11-01',value:1}),/Unknown metric/);
assert.deepEqual(profile.assessment,{morning_temp:'98.2'}); // read-only collector
console.log('D4.1-D4.2 tests passed');
