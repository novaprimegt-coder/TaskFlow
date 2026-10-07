(function(){
'use strict';
if(window.__tfV13087ForceUpdate)return;
window.__tfV13087ForceUpdate=true;

/* V130.8.7 · Actualización obligatoria validada por capacidades nativas.
   SOLO modifica el bloqueo/notificación de actualización.
   Cancelar una descarga, volver a la app o conservar localStorage NO desbloquea TaskFlow. */

const RELEASE_ID='taskflow-apk-v6-9.8-20261006-native';
const RELEASE_LABEL='TaskFlow 9.8';
const DOWNLOAD_URL='https://novaprimegt-coder.github.io/Apk/TaskFlow-9.8-build6.html';
const ACK_KEY='taskflow_required_update_native_ack_v1';
const STYLE_ID='tfV13087ForceUpdateStyle';
const MODAL_ID='tfV13087ForceUpdate';
let checkTimer=0;

function get(k){try{return localStorage.getItem(k)||''}catch(_){return ''}}
function set(k,v){try{localStorage.setItem(k,String(v));return true}catch(_){return false}}
function del(k){try{localStorage.removeItem(k)}catch(_){}}
function ua(){return String(navigator.userAgent||'')}
function isAppShell(){
  return /\bwv\b/i.test(ua())||/Vinebre/i.test(ua())||!!window.AC24BlobDataDownload||
    !!window.AC24_INTERNAL_SHARE_BRIDGE_2026||!!window.AC24_INTERNAL_PRINT_BRIDGE_2026;
}
function hasFn(obj,name){try{return !!obj&&typeof obj[name]==='function'}catch(_){return false}}
function hasRequiredNativeBuild(){
  try{
    const share=window.AC24_INTERNAL_SHARE_BRIDGE_2026;
    const print=window.AC24_INTERNAL_PRINT_BRIDGE_2026;
    const blob=window.AC24BlobDataDownload;
    return hasFn(share,'startShare')&&hasFn(share,'finishShare')&&
      hasFn(print,'print')&&hasFn(print,'printPopup')&&hasFn(blob,'save');
  }catch(_){return false}
}
function installedAcknowledged(){
  return hasRequiredNativeBuild()&&get(ACK_KEY)===RELEASE_ID;
}
function acknowledgeNativeBuild(){
  if(!hasRequiredNativeBuild())return false;
  set(ACK_KEY,RELEASE_ID);
  return true;
}

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
#${MODAL_ID}{position:fixed!important;inset:0!important;z-index:2147483647!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:18px!important;background:radial-gradient(circle at 50% 12%,rgba(70,232,218,.14),transparent 34%),radial-gradient(circle at 82% 82%,rgba(122,88,255,.10),transparent 31%),rgba(2,6,15,.97)!important;backdrop-filter:blur(18px) saturate(1.16)!important;-webkit-backdrop-filter:blur(18px) saturate(1.16)!important;overscroll-behavior:none!important;touch-action:none!important}
#${MODAL_ID} .tfu-card{position:relative;width:min(470px,100%);overflow:hidden;border-radius:28px;border:1px solid rgba(78,231,218,.31);background:radial-gradient(circle at 90% 0%,rgba(95,222,213,.10),transparent 30%),radial-gradient(circle at 0 100%,rgba(117,86,255,.08),transparent 35%),linear-gradient(160deg,#121d34,#0b1326 54%,#070c18);box-shadow:0 36px 110px rgba(0,0,0,.68),0 0 55px rgba(57,224,211,.08),inset 0 1px 0 rgba(255,255,255,.045);color:#f7fbff}
#${MODAL_ID} .tfu-card:before{content:'';position:absolute;left:9%;right:9%;top:0;height:2px;border-radius:999px;background:linear-gradient(90deg,transparent,#48e6d8 24%,#8189ff 58%,#ff9d4c 84%,transparent);box-shadow:0 0 18px rgba(72,230,216,.45)}
#${MODAL_ID} .tfu-head{padding:27px 24px 18px;text-align:center}
#${MODAL_ID} .tfu-icon{width:70px;height:70px;margin:0 auto 17px;border-radius:22px;display:grid;place-items:center;border:1px solid rgba(82,232,218,.30);background:linear-gradient(145deg,rgba(21,72,80,.75),rgba(20,31,58,.96));color:#59e8dc;box-shadow:0 15px 34px rgba(0,0,0,.26),0 0 25px rgba(78,230,217,.10),inset 0 1px 0 rgba(255,255,255,.055)}
#${MODAL_ID} .tfu-icon svg{width:35px;height:35px;filter:drop-shadow(0 0 8px rgba(83,232,219,.30))}
#${MODAL_ID} .tfu-kicker{font-size:9px;font-weight:950;letter-spacing:.17em;color:#64eadf;text-transform:uppercase}
#${MODAL_ID} h2{margin:7px 0;font-size:27px;line-height:1.05;letter-spacing:-.02em}
#${MODAL_ID} .tfu-version{font-size:10px;font-weight:850;color:#899ab3;letter-spacing:.12em;text-transform:uppercase}
#${MODAL_ID} .tfu-copy{margin:18px 0 0;color:#a8b5c8;font-size:12px;line-height:1.55}
#${MODAL_ID} .tfu-required{margin:17px 20px 0;padding:12px 13px;border-radius:14px;text-align:center;border:1px solid rgba(255,168,78,.20);background:rgba(255,142,55,.06);color:#f3c393;font-size:10px;line-height:1.48}
#${MODAL_ID} .tfu-actions{padding:18px 20px 22px;display:grid;gap:10px}
#${MODAL_ID} .tfu-download{width:100%;min-height:54px;border-radius:17px;display:flex;align-items:center;justify-content:center;gap:10px;padding:13px 16px;text-decoration:none;font-size:13px;font-weight:950;border:1px solid rgba(83,234,219,.38);background:linear-gradient(135deg,rgba(34,121,120,.78),rgba(43,74,130,.78));color:#efffff;box-shadow:0 15px 34px rgba(0,0,0,.24),0 0 23px rgba(67,224,211,.08),inset 0 1px 0 rgba(255,255,255,.08)}
#${MODAL_ID} .tfu-download:active{transform:scale(.985)}
#${MODAL_ID} .tfu-download svg{width:20px;height:20px;flex:0 0 20px}
#${MODAL_ID} .tfu-status{text-align:center;color:#8fa2bc;font-size:9.5px;line-height:1.5}
@media(max-width:430px){#${MODAL_ID}{padding:12px!important}#${MODAL_ID} .tfu-card{border-radius:24px}#${MODAL_ID} .tfu-head{padding:24px 18px 16px}#${MODAL_ID} h2{font-size:24px}#${MODAL_ID} .tfu-copy{font-size:11px}#${MODAL_ID} .tfu-required{margin-left:16px;margin-right:16px}#${MODAL_ID} .tfu-actions{padding-left:16px;padding-right:16px}}
`;document.head.appendChild(s);
}
function lockPage(){
  try{document.documentElement.dataset.tfRequiredUpdate='1'}catch(_){}
  try{document.body.style.setProperty('overflow','hidden','important')}catch(_){}
}
function unlockPage(){
  try{delete document.documentElement.dataset.tfRequiredUpdate}catch(_){}
  try{document.body.style.removeProperty('overflow')}catch(_){}
}
function finish(){
  if(!acknowledgeNativeBuild())return false;
  if(checkTimer){clearInterval(checkTimer);checkTimer=0}
  unlockPage();
  const root=document.getElementById(MODAL_ID);if(root)root.remove();
  return true;
}
function status(text){
  const el=document.getElementById('tfuStatus');if(el)el.textContent=text;
}
function recheck(){
  if(hasRequiredNativeBuild()){finish();return true}
  lockPage();
  status('La versión nueva aún no fue detectada. Si cancelaste la descarga, TaskFlow seguirá bloqueado.');
  return false;
}
function build(){
  if(!isAppShell())return;
  if(hasRequiredNativeBuild()){finish();return}
  if(document.getElementById(MODAL_ID))return;
  installStyle();lockPage();
  const root=document.createElement('div');root.id=MODAL_ID;root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');
  root.innerHTML=`<section class="tfu-card"><div class="tfu-head"><div class="tfu-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/></svg></div><div class="tfu-kicker">Actualización obligatoria</div><h2>Actualiza TaskFlow para continuar</h2><div class="tfu-version">${RELEASE_LABEL}</div><p class="tfu-copy">Instala la nueva APK. TaskFlow verificará automáticamente la compilación instalada antes de permitir el acceso.</p></div><div class="tfu-required">Cancelar la descarga, cerrar esta ventana o volver a TaskFlow <b>no completa la actualización</b>.</div><div class="tfu-actions"><a class="tfu-download" id="tfuDownload" href="${DOWNLOAD_URL}" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/></svg><span>Descargar actualización</span></a><div class="tfu-status" id="tfuStatus">El acceso permanecerá bloqueado hasta detectar la APK nueva.</div></div></section>`;
  document.body.appendChild(root);
  const a=document.getElementById('tfuDownload');
  if(a)a.addEventListener('click',()=>status('Descarga iniciada. Instala la APK completa; cancelar no desbloqueará TaskFlow.'),{capture:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(recheck,250)},true);
  window.addEventListener('pageshow',()=>setTimeout(recheck,250),true);
  checkTimer=setInterval(recheck,1500);
}
function boot(){
  ['taskflow_required_update_ack_v1','taskflow_required_update_ack_v2','taskflow_required_update_ack_v3','taskflow_required_update_ack_v4',
   'taskflow_required_update_flow_v2','taskflow_required_update_flow_v3','taskflow_required_update_flow_v4',
   'taskflow_required_update_pending_v1','taskflow_required_update_pending_v2'].forEach(del);
  if(!isAppShell())return;
  if(hasRequiredNativeBuild()){acknowledgeNativeBuild();return}
  del(ACK_KEY);
  if(document.body)build();else document.addEventListener('DOMContentLoaded',build,{once:true});
}
boot();
})();