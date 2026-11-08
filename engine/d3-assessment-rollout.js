(function(root,factory){
  const api=factory(root.D3AssessmentData,root.D3AssessmentBridge);
  if(typeof module==="object"&&module.exports) module.exports=api;
  if(root) root.D3AssessmentRollout=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(Data,Bridge){
  "use strict";
  if(!Data||!Bridge) throw new Error("D3AssessmentData and D3AssessmentBridge must load first");
  const READ_FLAG="d3_assessment_v2_read_enabled";
  function own(o,k){return !!o&&Object.prototype.hasOwnProperty.call(o,k)}
  function idsFrom(modules){
    if(!Array.isArray(modules)) throw new TypeError("modules must be an array");
    return modules.flatMap(m=>(m.items||[]).map(x=>x[0]));
  }
  function legacyAnswer(profile,id){
    if(!own(profile.assessment,id)) return {value:null,status:"not_answered"};
    const v=profile.assessment[id];
    return v===null||v===undefined||(typeof v==="string"&&!v.trim())
      ? {value:null,status:"not_answered"} : {value:v,status:"answered"};
  }
  function structuredAnswer(profile,id){
    const store=profile&&profile.assessmentV2&&profile.assessmentV2.answers;
    if(!store||!own(store,id)) return {value:null,status:"not_answered"};
    const a=store[id];
    if(!a||typeof a!=="object") return {value:null,status:"invalid"};
    return {value:a.status==="not_answered"?null:a.value,status:a.status};
  }
  function equal(a,b){return a.status===b.status && JSON.stringify(a.value)===JSON.stringify(b.value)}
  function compare(profile,modules){
    const ids=idsFrom(modules), mismatches=[], rows=[];
    ids.forEach(id=>{
      const legacy=legacyAnswer(profile,id),structured=structuredAnswer(profile,id);
      const match=equal(legacy,structured);
      rows.push({id,match});
      if(!match) mismatches.push({id,legacyStatus:legacy.status,structuredStatus:structured.status});
    });
    return {
      passed:mismatches.length===0,
      checked:ids.length,
      matched:ids.length-mismatches.length,
      mismatchCount:mismatches.length,
      mismatches,
      rows
    };
  }
  function summary(profile,modules){
    const ids=idsFrom(modules), a=profile&&profile.assessment||{}, v2=profile&&profile.assessmentV2||{};
    const answers=v2.answers||{};
    const legacyAnswered=ids.filter(id=>{const v=a[id];return v!==undefined&&v!==null&&String(v).trim()!==""}).length;
    const structuredAnswered=ids.filter(id=>{const x=answers[id];return !!x&&x.status!=="not_answered"&&x.value!==null&&x.value!==undefined&&String(x.value).trim()!==""}).length;
    const parity=compare(profile,modules);
    return {questionCount:ids.length,legacyAnswered,structuredAnswered,parity};
  }
  function canEnable(profile,modules){
    const check=compare(profile,modules);
    const valid=Data.validateProfile(profile||{assessment:{}}).valid;
    const hasV2=!!(profile&&profile.assessmentV2&&profile.assessmentV2.answers);
    return {allowed:valid&&hasV2&&check.passed,valid,hasStructuredStore:hasV2,parity:check};
  }
  function isEnabled(storage){try{return !!storage&&storage.getItem(READ_FLAG)==="true"}catch(_){return false}}
  function setEnabled(storage,enabled,profile,modules){
    if(!storage||typeof storage.setItem!=="function") throw new TypeError("Writable storage is required");
    if(enabled){
      const gate=canEnable(profile,modules);
      if(!gate.allowed) throw new Error("Structured reads blocked: parity or schema validation failed");
    }
    storage.setItem(READ_FLAG,enabled?"true":"false");
    return !!enabled;
  }
  function read(profile,id,storage){
    if(isEnabled(storage)){
      const a=Data.readAnswer(profile,id);
      if(a) return a.status==="not_answered"?"":a.value;
    }
    return profile&&profile.assessment&&own(profile.assessment,id)?profile.assessment[id]:"";
  }
  function readView(profile,modules,storage){
    const view={};
    idsFrom(modules).forEach(id=>{view[id]=read(profile,id,storage)});
    return view;
  }
  return Object.freeze({READ_FLAG,idsFrom,compare,summary,canEnable,isEnabled,setEnabled,read,readView});
});