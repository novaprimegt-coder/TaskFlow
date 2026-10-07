(function(){
'use strict';
if(window.__tfV13080ForceUpdate)return;
window.__tfV13080ForceUpdate=true;

/* V130.8.6 · Actualización obligatoria sin falsos positivos.
   SOLO corrige el flujo de actualización forzosa.
   Descargar, cancelar, cerrar o reabrir TaskFlow NUNCA desbloquea el sistema automáticamente. */

const RELEASE_ID='taskflow-9.8-v6-20261006';
const RELEASE_LABEL='TaskFlow 9.8';
const DOWNLOAD_URL='https://novaprimegt-coder.github.io/Apk/TaskFlow-download.html';
const ACK_KEY='taskflow_required_update_ack_v4';
const FLOW_KEY='taskflow_required_update_flow_v4';
const STYLE_ID='tfV13080ForceUpdateStyle';
const MODAL_ID='tfV13080ForceUpdate';
let confirmArmed=false;

function get(key){try{return localStorage.getItem(key)||''}catch(_){return ''}}
function set(key,value){try{localStorage.setItem(key,String(value));return true}catch(_){return false}}
function del(key){try{localStorage.removeItem(key)}catch(_){}}
function json(key){try{const x=JSON.parse(get(key)||'null');return x&&typeof x==='object'?x:null}catch(_){return null}}
function installedAcknowledged(){return get(ACK_KEY)===RELEASE_ID}
function readFlow(){const x=json(FLOW_KEY);return x&&x.release===RELEASE_ID?x:null}
function writeFlow(extra){const old=readFlow()||{};set(FLOW_KEY,JSON.stringify(Object.assign({},old,extra,{release:RELEASE_ID})))}

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
#${MODAL_ID}{position:fixed!important;inset:0!important;z-index:2147483647!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:18px!important;background:radial-gradient(circle at 50% 15%,rgba(70,232,218,.13),transparent 34%),radial-gradient(circle at 82% 78%,rgba(122,88,255,.10),transparent 30%),rgba(2,6,15,.96)!important;backdrop-filter:blur(18px) saturate(1.15)!important;-webkit-backdrop-filter:blur(18px) saturate(1.15)!important;overscroll-behavior:none!important;touch-action:none!important}
#${MODAL_ID} .tf13080-card{position:relative!important;width:min(470px,100%)!important;overflow:hidden!important;border-radius:28px!important;border:1px solid rgba(78,231,218,.30)!important;background:radial-gradient(circle at 90% 0%,rgba(95,222,213,.10),transparent 30%),radial-gradient(circle at 0% 100%,rgba(117,86,255,.08),transparent 35%),linear-gradient(160deg,#121d34 0%,#0b1326 54%,#070c18 100%)!important;box-shadow:0 36px 110px rgba(0,0,0,.68),0 0 55px rgba(57,224,211,.08),inset 0 1px 0 rgba(255,255,255,.045)!important;color:#f7fbff!important}
#${MODAL_ID} .tf13080-card::before{content:'';position:absolute;left:9%;right:9%;top:0;height:2px;border-radius:999px;background:linear-gradient(90deg,transparent,#48e6d8 24%,#8189ff 58%,#ff9d4c 84%,transparent);box-shadow:0 0 18px rgba(72,230,216,.45);pointer-events:none}
#${MODAL_ID} .tf13080-head{padding:27px 24px 18px;text-align:center}
#${MODAL_ID} .tf13080-icon{width:70px;height:70px;margin:0 auto 17px;border-radius:22px;display:grid;place-items:center;border:1px solid rgba(82,232,218,.30);background:linear-gradient(145deg,rgba(21,72,80,.75),rgba(20,31,58,.96));color:#59e8dc;box-shadow:0 15px 34px rgba(0,0,0,.26),0 0 25px rgba(78,230,217,.10),inset 0 1px 0 rgba(255,255,255,.055)}
#${MODAL_ID} .tf13080-icon svg{width:35px;height:35px;filter:drop-shadow(0 0 8px rgba(83,232,219,.30))}
#${MODAL_ID} .tf13080-kicker{font-size:9px;font-weight:950;letter-spacing:.17em;color:#64eadf;text-transform:uppercase}
#${MODAL_ID} h2{margin:7px 0 7px;font-size:27px;line-height:1.05;letter-spacing:-.02em}
#${MODAL_ID} .tf13080-version{font-size:10px;font-weight:850;color:#899ab3;letter-spacing:.12em;text-transform:uppercase}
#${MODAL_ID} .tf13080-copy{margin:18px 0 0;color:#a8b5c8;font-size:12px;line-height:1.55;text-wrap:pretty}
#${MODAL_ID} .tf13080-required{margin:17px 20px 0;padding:12px 13px;border-radius:14px;text-align:center;border:1px solid rgba(255,168,78,.18);background:rgba(255,142,55,.055);color:#f3c393;font-size:10px;line-height:1.45}
#${MODAL_ID} .tf13080-actions{padding:18px 20px 22px;display:grid;gap:10px}
#${MODAL_ID} .tf13080-download,#${MODAL_ID} .tf13080-installed{width:100%;min-height:54px;border-radius:17px;display:flex;align-items:center;justify-content:center;gap:10px;padding:13px 16px;text-decoration:none;font-size:13px;font-weight:950;letter-spacing:.01em;-webkit-tap-highlight-color:transparent}
#${MODAL_ID} .tf13080-download{border:1px solid rgba(83,234,219,.38);background:linear-gradient(135deg,rgba(34,121,120,.78),rgba(43,74,130,.78));color:#efffff;box-shadow:0 15px 34px rgba(0,0,0,.24),0 0 23px rgba(67,224,211,.08),inset 0 1px 0 rgba(255,255,255,.08)}
#${MODAL_ID} .tf13080-installed{display:none;border:1px solid rgba(132,154,191,.20);background:rgba(255,255,255,.035);color:#aebbd0}
#${MODAL_ID} .tf13080-installed.show{display:flex}
#${MODAL_ID} .tf13080-installed.armed{border-color:rgba(255,174,83,.35);background:rgba(255,151,61,.08);color:#ffc184}
#${MODAL_ID} .tf13080-download:active,#${MODAL_ID} .tf13080-installed:active{transform:scale(.985)}
#${MODAL_ID} .tf13080-download svg{width:20px;height:20px;flex:0 0 20px}
#${MODAL_ID} .tf13080-status{display:none;text-align:center;color:#78eadf;font-size:10px;line-height:1.45}
#${MODAL_ID} .tf13080-status.show{display:block}
@media(max-width:430px){#${MODAL_ID}{padding:12px!important}#${MODAL_ID} .tf13080-card{border-radius:24px!important}#${MODAL_ID} .tf13080-head{padding:24px 18px 16px}#${MODAL_ID} h2{font-size:24px}#${MODAL_ID} .tf13080-copy{font-size:11px}#${MODAL_ID} .tf13080-required{margin-left:16px;margin-right:16px}#${MODAL_ID} .tf13080-actions{padding-left:16px;padding-right:16px}}
`;
  document.head.appendChild(s);
}

function lockPage(){
  try{document.documentElement.dataset.tf13080UpdateLock='1'}catch(_){}
  try{document.body.style.setProperty('overflow','hidden','important')}catch(_){}
}
function unlockPage(){
  try{delete document.documentElement.dataset.tf13080UpdateLock}catch(_){}
  try{document.body.style.removeProperty('overflow')}catch(_){}
}
function showReturnControls(){
  const status=document.getElementById('tf13080Status');
  const installed=document.getElementById('tf13080Installed');
  if(status){status.textContent='La descarga no desbloquea TaskFlow. Instala la APK completa y después confirma la instalación.';status.classList.add('show')}
  if(installed)installed.classList.add('show');
}
function finishAcknowledgement(){
  set(ACK_KEY,RELEASE_ID);del(FLOW_KEY);unlockPage();
  const root=document.getElementById(MODAL_ID);if(root)root.remove();
}

function build(){
  if(document.getElementById(MODAL_ID)||installedAcknowledged())return;
  installStyle();lockPage();
  const root=document.createElement('div');
  root.id=MODAL_ID;root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','tf13080Title');
  root.innerHTML=`<section class="tf13080-card"><div class="tf13080-head"><div class="tf13080-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/></svg></div><div class="tf13080-kicker">Actualización obligatoria</div><h2 id="tf13080Title">Hay una nueva actualización</h2><div class="tf13080-version">${RELEASE_LABEL}</div><p class="tf13080-copy">Descarga e instala la versión más reciente de TaskFlow para continuar usando el sistema.</p></div><div class="tf13080-required">Cancelar la descarga o volver a TaskFlow no completa la actualización. El acceso seguirá bloqueado.</div><div class="tf13080-actions"><a class="tf13080-download" id="tf13080Download" href="${DOWNLOAD_URL}" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/></svg><span>Descargar actualización</span></a><div class="tf13080-status" id="tf13080Status"></div><button class="tf13080-installed" id="tf13080Installed" type="button">Ya instalé TaskFlow 9.8</button></div></section>`;
  document.body.appendChild(root);

  const btn=document.getElementById('tf13080Download');
  const installed=document.getElementById('tf13080Installed');
  const oldFlow=readFlow();if(oldFlow&&oldFlow.startedAt)showReturnControls();

  btn&&btn.addEventListener('click',()=>{
    writeFlow({startedAt:Date.now(),leftAt:0,returnedAt:0});
    const status=document.getElementById('tf13080Status');
    if(status){status.textContent='Descarga iniciada. TaskFlow se cerrará y seguirá bloqueado hasta que Android valide la actualización.';status.classList.add('show')}
  },{capture:true});

  installed&&installed.addEventListener('click',()=>{
    const flow=readFlow();if(!flow||!flow.startedAt)return;
    if(!confirmArmed){
      confirmArmed=true;
      installed.classList.add('armed');
      installed.textContent='Confirmar: Android terminó la instalación';
      const status=document.getElementById('tf13080Status');
      if(status){status.textContent='Confirma únicamente si Android mostró que TaskFlow 9.8 fue instalada correctamente.';status.classList.add('show')}
      return;
    }
    finishAcknowledgement();
  });

  document.addEventListener('visibilitychange',()=>{
    const flow=readFlow();if(!flow||!flow.startedAt)return;
    if(document.hidden)writeFlow({leftAt:Date.now()});
    else {writeFlow({returnedAt:Date.now()});showReturnControls()}
  },true);

  document.addEventListener('keydown',e=>{
    if(document.getElementById(MODAL_ID)&&(e.key==='Escape'||e.key==='Esc')){e.preventDefault();e.stopImmediatePropagation()}
  },true);
}

function boot(){
  del('taskflow_required_update_ack_v1');
  del('taskflow_required_update_pending_v1');
  del('taskflow_required_update_pending_v2');
  del('taskflow_required_update_ack_v2');
  del('taskflow_required_update_flow_v2');
  del('taskflow_required_update_ack_v3');
  del('taskflow_required_update_flow_v3');
  if(installedAcknowledged())return;
  if(document.body)build();else document.addEventListener('DOMContentLoaded',build,{once:true});
}
boot();
})();
