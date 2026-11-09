const assert=require('node:assert/strict');
const Registry=require('../../engine/d4-questionnaire-registry.js');
const Long=require('../../engine/d4-longitudinal.js');
const fs=require('node:fs');
const vm=require('node:vm');
const htmlRoot=fs.readFileSync('../../index.html','utf8');
const moduleStart=htmlRoot.indexOf('const modules=['), moduleEnd=htmlRoot.indexOf('const D4Questionnaire =',moduleStart);
assert.ok(moduleStart>=0&&moduleEnd>moduleStart,'live questionnaire source found');
const context={D4QuestionnaireRegistry:Registry,console};
vm.createContext(context);
vm.runInContext(htmlRoot.slice(moduleStart,moduleEnd)+'globalThis.__modules=modules;',context);
const liveRegistry=Registry.build(context.__modules);
assert.equal(context.__modules.length,11);
assert.equal(liveRegistry.questionCount,178);
assert.equal(Registry.validateRegistry(liveRegistry).valid,true);
const fixture=[
 {title:'01 · Personal profile & health history',desc:'Context',items:[['age','Age (years)','number','20'],['sex','Sex assigned at birth','select',['Male','Female','Prefer not to say']]]},
 {title:'03 · Thermoregulation & metabolism',desc:'Measurements',items:[['morning_temp','Typical waking temperature (°F)','number','Measured'],['morning_pulse','Typical waking resting pulse (BPM)','number','Measured']]}
];
const registry=Registry.build(fixture);
assert.equal(registry.questionCount,4);
assert.equal(Registry.validateRegistry(registry).valid,true);
assert.equal(new Set(registry.questions.map(q=>q.id)).size,registry.questionCount);
assert.equal(Registry.get(registry,'morning_temp').unit,'°F');
const profile={logs:{'2026-01-01':{date:'2026-01-01',method:'oral',measurements:[{label:'Waking',temp:98.6,pulse:70,time:'07:00'}],contextTags:['rested']}},healthData:{daily:{'2026-01-02':{weightKg:57,sleepHours:8,sleepQuality:'Good',updatedAt:'2026-01-02T08:00:00Z'}}}};
const events=Long.collect(profile);
assert.equal(events.length,5);
assert.ok(Math.abs(events.find(x=>x.metric==='temperature').value-37)<0.01);
assert.equal(events.find(x=>x.metric==='weight').value,57);
assert.equal(Long.summarize(events,'pulse').count,1);
assert.equal(Long.weekly(events,'weight').length,1);
for(const file of ['../../index.html','../../app/index.html']){
 const h=fs.readFileSync(file,'utf8');
 assert.ok(h.includes('d4-questionnaire-registry.js'));
 assert.ok(h.includes('d4-longitudinal.js'));
 assert.ok(h.includes('renderD4Longitudinal()'));
 assert.ok(h.includes('D4QuestionnaireRegistry.get(D4Questionnaire,id)'));
 assert.ok(h.includes('data-question-id='));
}
console.log('D4.1-D4.2 UI integration tests passed');
