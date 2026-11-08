#!/usr/bin/env node
"use strict";
const fs=require("fs"),path=require("path");
const files=[["index.html","engine/"],["app/index.html","../engine/"]];
const root=process.cwd();
const card=`<div class="card" id="d37ParityCard"><h3>Assessment read parity &amp; rollout</h3><p class="small">Compares every active questionnaire answer between legacy and structured storage. Structured reads remain off until the comparison passes. This check runs locally in this browser.</p><div class="btnrow"><button class="btn secondary" type="button" onclick="d37RunParity()">Run parity check</button><button class="btn" type="button" onclick="d39EnableReads()">Enable structured reads</button><button class="btn secondary" type="button" onclick="d39DisableReads()">Use legacy reads</button></div><pre id="d37ParityStatus" class="small" style="white-space:pre-wrap;overflow-wrap:anywhere" aria-live="polite">Parity has not been checked. Structured reads are off by default.</pre></div>`;
const code=String.raw`
function d37Status(s){const e=document.getElementById('d37ParityStatus');if(e)e.textContent=s}
function d37RunParity(){try{const r=D3AssessmentRollout.compare(db,modules);const s=D3AssessmentRollout.summary(db,modules);d37Status('PARITY '+(r.passed?'PASS':'FAIL')+'\nChecked: '+r.checked+'\nMatched: '+r.matched+'\nMismatches: '+r.mismatchCount+'\nLegacy answered: '+s.legacyAnswered+'\nStructured answered: '+s.structuredAnswered+(r.mismatches.length?'\n\nMismatched IDs:\n'+r.mismatches.map(x=>x.id+' ('+x.legacyStatus+' vs '+x.structuredStatus+')').join('\n'):'')+'\n\nNo profile data was changed.');return r}catch(e){d37Status('Parity check failed: '+(e.message||String(e)));return null}}
function d39EnableReads(){const r=d37RunParity();if(!r||!r.passed){d37Status('ROLLOUT BLOCKED\nResolve parity mismatches first. Legacy reads remain active.');return}if(!confirm('Parity passed. Enable structured reads for questionnaire display and completion analytics on this device? You can switch back to legacy reads at any time.'))return;try{D3AssessmentRollout.setEnabled(localStorage,true,db,modules);calculateScore();renderDashboard();renderTrends();buildQuestionnaire();d37Status('STRUCTURED READS ENABLED\nParity passed for '+r.checked+' active fields. Use “Use legacy reads” to revert.')}catch(e){d37Status('ROLLOUT BLOCKED: '+(e.message||String(e)))}}
function d39DisableReads(){try{D3AssessmentRollout.setEnabled(localStorage,false,db,modules);calculateScore();renderDashboard();renderTrends();buildQuestionnaire();d37Status('LEGACY READS ACTIVE\nStructured read flag is off.')}catch(e){d37Status('Could not change read mode: '+(e.message||String(e)))}}
function assessmentReadView(){return D3AssessmentRollout.readView(db,modules,localStorage)}
`;
for(const [rel,base] of files){
 const p=path.join(root,rel);
 if(!fs.existsSync(p)) throw new Error("Missing "+rel);
 let s=fs.readFileSync(p,"utf8");
 if(s.includes("D3AssessmentRollout")) { console.log(rel+": already patched"); continue; }
 const bridge='<script src="'+base+'d3-assessment-bridge.js"></script>';
 if(!s.includes(bridge)) throw new Error("Could not find D3 bridge script in "+rel);
 s=s.replace(bridge,bridge+'\n<script src="'+base+'d3-assessment-integration.js"></script>\n<script src="'+base+'d3-assessment-rollout.js"></script>');
 const cardAnchor='<div class="card" id="d3MigrationCard">';
 if(!s.includes(cardAnchor)) throw new Error("Could not find D3 migration card in "+rel);
 s=s.replace(cardAnchor,card+'\n'+cardAnchor);
 const saveAnchor="function saveAssessment(){";
 if(!s.includes(saveAnchor)) throw new Error("Could not find saveAssessment in "+rel);
 s=s.replace(saveAnchor,code+"\n"+saveAnchor);
 const saveEnd="));saveDB();calculateScore();renderDashboard();";
 if(!s.includes(saveEnd)) throw new Error("Could not find saveAssessment persistence anchor in "+rel);
 s=s.replace(saveEnd, "));if(D3AssessmentRollout.isEnabled(localStorage)&&window.D3AssessmentIntegration){db=D3AssessmentIntegration.sync(db,modules).profile;}saveDB();calculateScore();renderDashboard();");
 const replacements=[
  ["function calculateScore(){","function calculateScore(){const assessment=assessmentReadView();"],
  ["function renderDashboard(){","function renderDashboard(){const assessment=assessmentReadView();"],
  ["function renderDomainScores(){","function renderDomainScores(){const assessment=assessmentReadView();"],
  ["function moduleCompletion(mod){","function moduleCompletion(mod){const assessment=assessmentReadView();"],
  ["function buildQuestionnaire(){","function buildQuestionnaire(){const assessment=assessmentReadView();"],
  ["function fieldHTML(id,label,type,extra){","function fieldHTML(id,label,type,extra){const assessment=assessmentReadView();"]
 ];
 for(const [a,b] of replacements){if(!s.includes(a))throw new Error("Missing read consumer "+a+" in "+rel);s=s.replace(a,b);}
 function replaceInFunction(src,name){
  const start=src.indexOf("function "+name+"("); if(start<0)return src;
  const brace=src.indexOf("{",start); let depth=0,quote=null,esc=false;
  for(let i=brace;i<src.length;i++){
   const c=src[i];
   if(quote){if(esc)esc=false;else if(c==="\\")esc=true;else if(c===quote)quote=null;continue}
   if(c==="'"||c==='"'||c==="`"){quote=c;continue}
   if(c==="{")depth++;
   else if(c==="}"){depth--;if(depth===0){const body=src.slice(brace+1,i).replace(/db\.assessment/g,"assessment");return src.slice(0,brace+1)+body+src.slice(i)}}
  }
  throw new Error("Unclosed function "+name);
 }
 for(const n of ["calculateScore","renderDashboard","renderDomainScores","moduleCompletion","buildQuestionnaire","fieldHTML"])s=replaceInFunction(s,n);
 fs.writeFileSync(p,s);
 console.log(rel+": patched");
}
