(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.D4Longitudinal = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const VERSION = '4.2.0';
  const METRICS = Object.freeze({
    temperature: { canonicalUnit: '°C', dimension: 'temperature' }, pulse: { canonicalUnit: 'bpm', dimension: 'rate' },
    weight: { canonicalUnit: 'kg', dimension: 'mass' }, height: { canonicalUnit: 'cm', dimension: 'length' },
    waist: { canonicalUnit: 'cm', dimension: 'length' }, hip: { canonicalUnit: 'cm', dimension: 'length' },
    sleep_duration: { canonicalUnit: 'h', dimension: 'time' }, sleep_quality: { canonicalUnit: 'score', dimension: 'ordinal' },
    steps: { canonicalUnit: 'steps', dimension: 'count' }, water: { canonicalUnit: 'L', dimension: 'volume' },
    energy_intake: { canonicalUnit: 'kcal', dimension: 'energy' }, protein: { canonicalUnit: 'g', dimension: 'mass' },
    carbohydrate: { canonicalUnit: 'g', dimension: 'mass' }, fat: { canonicalUnit: 'g', dimension: 'mass' },
    fiber: { canonicalUnit: 'g', dimension: 'mass' }
  });
  const ALIASES = Object.freeze({ temp:'temperature', temperature:'temperature', body_temperature:'temperature', pulse:'pulse', heart_rate:'pulse', weight:'weight', weightkg:'weight', height:'height', waist:'waist', hip:'hip', sleep:'sleep_duration', sleephours:'sleep_duration', sleep_duration:'sleep_duration', sleepquality:'sleep_quality', sleep_quality:'sleep_quality', steps:'steps', water:'water', water_l:'water', calorie_estimate:'energy_intake', calories:'energy_intake', energy_intake:'energy_intake', protein_g:'protein', protein:'protein', carb_estimate:'carbohydrate', carbohydrate:'carbohydrate', fat_estimate:'fat', fat:'fat', fiber_estimate:'fiber', fiber:'fiber' });
  function isObj(v){return v!==null&&typeof v==='object'&&!Array.isArray(v)}
  function number(v){ if(v===null||v===undefined||v==='') return null; const n=Number(v); return Number.isFinite(n)?n:null; }
  function dateOnly(v){ return typeof v==='string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v+'T00:00:00Z')) ? v : null; }
  function canonicalMetric(key){ const k=String(key||'').toLowerCase().replace(/[\s-]/g,'_'); return ALIASES[k] || null; }
  function convert(value, fromUnit, metric) {
    const n=number(value); if(n===null) return {value:null,unit:METRICS[metric]?.canonicalUnit||fromUnit||null};
    const u=String(fromUnit||'').trim().toLowerCase();
    if(metric==='temperature') { if(['f','°f','fahrenheit'].includes(u)) return {value:(n-32)*5/9,unit:'°C'}; if(['c','°c','celsius'].includes(u)||!u) return {value:n,unit:'°C'}; }
    if(metric==='weight') { if(['lb','lbs','pound','pounds'].includes(u)) return {value:n*0.45359237,unit:'kg'}; if(['kg','kilogram','kilograms'].includes(u)||!u) return {value:n,unit:'kg'}; }
    if(metric==='height') { if(['m','meter','meters'].includes(u)) return {value:n*100,unit:'cm'}; if(['in','inch','inches'].includes(u)) return {value:n*2.54,unit:'cm'}; if(['cm','centimeter','centimeters'].includes(u)||!u) return {value:n,unit:'cm'}; }
    if(metric==='water') { if(['ml','milliliter','milliliters'].includes(u)) return {value:n/1000,unit:'L'}; if(['l','liter','liters'].includes(u)||!u) return {value:n,unit:'L'}; }
    if(metric==='sleep_duration' && ['min','minutes'].includes(u)) return {value:n/60,unit:'h'};
    return {value:n,unit:METRICS[metric]?.canonicalUnit||fromUnit||null};
  }
  function event(input) {
    if(!isObj(input)) throw new TypeError('Measurement must be an object');
    const metric=canonicalMetric(input.metric||input.key||input.label);
    if(!metric) throw new Error('Unknown metric: '+String(input.metric||input.key||input.label));
    const date=dateOnly(input.date); if(!date) throw new Error('Measurement date must be YYYY-MM-DD');
    const rawValue=input.rawValue!==undefined?input.rawValue:input.value;
    const rawUnit=input.rawUnit!==undefined?input.rawUnit:input.unit;
    const normalized=metric==='sleep_quality' && typeof rawValue==='string' && rawValue.trim() ? {value:rawValue,unit:'score'} : convert(rawValue,rawUnit,metric);
    return {
      id: input.id||null, date, time: typeof input.time==='string'?input.time:null,
      recordedAt: input.recordedAt||null, metric, value:normalized.value, unit:normalized.unit,
      rawValue:rawValue===undefined?null:rawValue, rawUnit:rawUnit||null,
      method:input.method||null, provenance:input.provenance||'unknown',
      context:input.context||null, source:input.source||null, notes:input.notes||null,
      status: normalized.value===null ? (input.status||'not_measured') : (input.status||(metric==='sleep_quality'?'recorded':'measured'))
    };
  }
  function collect(profile) {
    if(!isObj(profile)) throw new TypeError('Profile must be an object');
    const out=[];
    Object.entries(profile.logs||{}).forEach(([date,log])=>{
      if(!isObj(log)) return;
      (Array.isArray(log.measurements)?log.measurements:[]).forEach((m,i)=>{
        if(m.temp!==undefined&&m.temp!==null&&m.temp!=='') out.push(event({id:`log:${date}:${i}:temperature`,date,time:m.time,metric:'temperature',value:m.temp,unit:m.tempUnit||'°F',method:log.method||null,provenance:'measured',context:(log.contextTags||[]).join(', '),source:'logs.measurements',notes:m.notes||log.notes||null}));
        if(m.pulse!==undefined&&m.pulse!==null&&m.pulse!=='') out.push(event({id:`log:${date}:${i}:pulse`,date,time:m.time,metric:'pulse',value:m.pulse,unit:'bpm',method:log.method||null,provenance:'measured',context:(log.contextTags||[]).join(', '),source:'logs.measurements',notes:m.notes||log.notes||null}));
      });
    });
    Object.entries(profile.healthData&&profile.healthData.daily||{}).forEach(([date,row])=>{
      if(!isObj(row)||!dateOnly(date)) return;
      const map=[['weightKg','weight','kg'],['sleepHours','sleep_duration','h']];
      map.forEach(([key,metric,unit])=>{if(row[key]!==undefined&&row[key]!==null&&row[key]!=='')out.push(event({id:`health:${date}:${metric}`,date,metric,value:row[key],unit,provenance:'self_report',source:'healthData.daily',recordedAt:row.updatedAt||null,notes:row.notes||null}));});
      if(row.sleepQuality!==undefined&&row.sleepQuality!==null&&row.sleepQuality!=='') out.push(event({id:`health:${date}:sleep_quality`,date,metric:'sleep_quality',value:row.sleepQuality,unit:'score',provenance:'self_report',source:'healthData.daily',recordedAt:row.updatedAt||null}));
    });
    return out.sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||'')));
  }
  function series(events, metric) {
    const rows=(events||[]).filter(e=>e&&e.metric===metric&&Number.isFinite(e.value)).slice().sort((a,b)=>(a.date+(a.time||'')).localeCompare(b.date+(b.time||'')));
    return rows;
  }
  function median(values){if(!values.length)return null;const a=values.slice().sort((x,y)=>x-y),m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;}
  function summarize(events, metric) {
    const rows=series(events,metric), values=rows.map(r=>r.value), n=values.length;
    const first=n?rows[0]:null,last=n?rows[n-1]:null;
    let slopePerDay=null;
    if(n>=3){const t=rows.map(r=>(Date.parse(r.date+'T00:00:00Z')-Date.parse(rows[0].date+'T00:00:00Z'))/86400000),mt=t.reduce((a,b)=>a+b,0)/n,mv=values.reduce((a,b)=>a+b,0)/n;const den=t.reduce((s,x)=>s+(x-mt)**2,0);if(den>0)slopePerDay=t.reduce((s,x,i)=>s+(x-mt)*(values[i]-mv),0)/den;}
    return {metric,unit:METRICS[metric]?.canonicalUnit||rows[0]?.unit||null,count:n,firstDate:first?.date||null,lastDate:last?.date||null,latest:last?.value??null,minimum:n?Math.min(...values):null,maximum:n?Math.max(...values):null,mean:n?values.reduce((a,b)=>a+b,0)/n:null,median:median(values),slopePerDay,interpretation:'Descriptive only; not a diagnosis or causal estimate.'};
  }
  function weekly(events,metric){const groups={};series(events,metric).forEach(e=>{const d=new Date(e.date+'T00:00:00Z');d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));const key=d.toISOString().slice(0,10);(groups[key]||(groups[key]=[])).push(e.value)});return Object.keys(groups).sort().map(week=>({week,count:groups[week].length,median:median(groups[week]),mean:groups[week].reduce((a,b)=>a+b,0)/groups[week].length,unit:METRICS[metric]?.canonicalUnit||null}));}
  function snapshot(profile){const events=collect(profile);return {engineVersion:VERSION,generatedAt:null,eventCount:events.length,events};}
  return Object.freeze({VERSION,METRICS,canonicalMetric,convert,event,collect,series,summarize,weekly,snapshot});
});
