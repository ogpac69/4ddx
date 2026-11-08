#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const targets = [
  { file: "index.html", data: "engine/d3-assessment-data.js", bridge: "engine/d3-assessment-bridge.js", integration: "engine/d3-assessment-integration.js" },
  { file: "app/index.html", data: "../engine/d3-assessment-data.js", bridge: "../engine/d3-assessment-bridge.js", integration: "../engine/d3-assessment-integration.js" }
];
const settingsAnchor = '<div class="card"><h3>Data deletion</h3>';
const settingsCard = `<div class="card" id="d36StructuredCard"><h3>Structured assessment shadow sync</h3>
<p class="small">When enabled, each questionnaire save writes a structured v2 copy alongside the original legacy answers. The original answers remain unchanged and continue to power the current interface and analytics. This does not enable structured reads.</p>
<label class="small" style="display:flex;align-items:center;gap:9px;margin:12px 0"><input id="d36ShadowToggle" type="checkbox" style="width:18px;height:18px"> Enable structured shadow writes</label>
<div id="d36ShadowStatus" class="small" aria-live="polite">Disabled by default. No shadow writes occur until enabled.</div></div>
`;
const saveOld = `function saveAssessment(){modules.forEach(m=>m.items.forEach(([id,label,type])=>{let el=document.getElementById('q_'+id);if(el)db.assessment[id]=el.value.trim();else if(type==='time')db.assessment[id]=getTimePicker('q_'+id)}));saveDB();calculateScore();renderDashboard();document.getElementById('scoreOutput').innerHTML='<div class="notice">Assessment saved in this browser. These indicators describe completion, not health status.</div>'}`;
const saveNew = `function saveAssessment(){modules.forEach(m=>m.items.forEach(([id,label,type])=>{let el=document.getElementById('q_'+id);if(el)db.assessment[id]=el.value.trim();else if(type==='time')db.assessment[id]=getTimePicker('q_'+id)}));try{if(window.D3AssessmentIntegration&&D3AssessmentIntegration.isShadowWriteEnabled(localStorage)){const result=D3AssessmentIntegration.sync(db,modules);db=result.profile;const status=document.getElementById('d36ShadowStatus');if(status)status.textContent='Shadow sync saved · '+result.summary.structuredAnswerCount+' structured answers · legacy unchanged: '+result.summary.legacyUnchanged}}catch(e){const status=document.getElementById('d36ShadowStatus');if(status)status.textContent='Shadow sync failed; legacy answers were retained. '+(e.message||String(e));console.error(e)}saveDB();calculateScore();renderDashboard();document.getElementById('scoreOutput').innerHTML='<div class="notice">Assessment saved in this browser. These indicators describe completion, not health status.</div>'}`;
const statusAnchor = "function d3Status(message)";
const statusFunctions = `function d36InitShadowControls(){const toggle=document.getElementById('d36ShadowToggle');const status=document.getElementById('d36ShadowStatus');if(!toggle||!window.D3AssessmentIntegration)return;toggle.checked=D3AssessmentIntegration.isShadowWriteEnabled(localStorage);if(status)status.textContent=toggle.checked?'Enabled. Structured answers are shadow-written on questionnaire save; legacy remains authoritative.':'Disabled by default. No shadow writes occur until enabled.';toggle.addEventListener('change',()=>{try{D3AssessmentIntegration.setShadowWriteEnabled(localStorage,toggle.checked);if(status)status.textContent=toggle.checked?'Enabled. Save the questionnaire to create/update the structured copy.':'Disabled. Existing structured answers are retained; future saves will not update them.'}catch(e){toggle.checked=false;if(status)status.textContent='Could not change setting: '+(e.message||String(e))}})}
`;
// Preflight every target before changing either file. This avoids half-applied patches.
for (const target of targets) {
  const file = path.join(root, target.file);
  if (!fs.existsSync(file)) throw new Error("Missing " + target.file);
  const html = fs.readFileSync(file, "utf8");
  const bridgeAnchor = `<script src="${target.bridge}"></script>`;
  if (!html.includes(bridgeAnchor)) throw new Error("Missing bridge script anchor in " + target.file);
  if (!html.includes(settingsAnchor)) throw new Error("Missing Settings insertion anchor in " + target.file);
  if (!html.includes(saveOld) && !(html.includes("D3AssessmentIntegration") && html.includes("d36StructuredCard"))) throw new Error("saveAssessment() source differs; refusing unsafe patch for " + target.file);
  if (!html.includes(statusAnchor) && !(html.includes("D3AssessmentIntegration") && html.includes("d36StructuredCard"))) throw new Error("Missing D3.4 function insertion anchor in " + target.file);
  if (!html.includes("buildQuestionnaire();") && !(html.includes("D3AssessmentIntegration") && html.includes("d36StructuredCard"))) throw new Error("Missing app initialization anchor in " + target.file);
}
for (const target of targets) {
  const file = path.join(root, target.file);
  let html = fs.readFileSync(file, "utf8");
  if (html.includes("D3AssessmentIntegration") && html.includes("d36StructuredCard")) {
    console.log("Already patched: " + target.file); continue;
  }
  const scriptAnchor = `<script src="${target.bridge}"></script>`;
  if (!html.includes(scriptAnchor)) throw new Error("Missing bridge script anchor in " + target.file);
  html = html.replace(scriptAnchor, scriptAnchor + `\n<script src="${target.integration}"></script>`);
  if (!html.includes(settingsAnchor)) throw new Error("Missing Settings insertion anchor in " + target.file);
  html = html.replace(settingsAnchor, settingsCard + settingsAnchor);
  if (!html.includes(saveOld)) throw new Error("saveAssessment() source differs; refusing unsafe patch for " + target.file);
  html = html.replace(saveOld, saveNew);
  if (!html.includes(statusAnchor)) throw new Error("Missing D3.4 function insertion anchor in " + target.file);
  html = html.replace(statusAnchor, statusFunctions + statusAnchor);
  const initAnchor = "buildQuestionnaire();";
  if (!html.includes(initAnchor)) throw new Error("Missing app initialization anchor in " + target.file);
  html = html.replace(initAnchor, initAnchor + "\nd36InitShadowControls();");
  fs.writeFileSync(file, html);
  console.log("Patched " + target.file);
}
console.log("D3.6 UI integration applied. Review the diff before committing.");
