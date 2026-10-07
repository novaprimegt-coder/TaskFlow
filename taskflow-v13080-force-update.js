(function(){
'use strict';
if(window.__tfV13090ForceUpdate)return;
window.__tfV13090ForceUpdate=true;

/* V130.9.0 · Actualización obligatoria fail-closed.
   SOLO modifica el bloqueo/notificación de actualización.
   - Cancelar descarga NO desbloquea.
   - Volver a la app antigua NO desbloquea.
   - Cerrar/reabrir la app antigua NO desbloquea.
   - localStorage antiguo NO sirve como confirmación.
   - Solo se libera con evidencia nativa explícita de la versión requerida
     o con un cambio real de huella nativa después de iniciar la actualización. */

const RELEASE_ID='taskflow-forced-stable-20261006-v13090';
const RELEASE_LABEL='Nueva actualización obligatoria';
const DOWNLOAD_URL='https://github.com/novaprimegt-coder/Apk/releases/download/stable/TaskFlow.apk';
const REQUIRED_VERSION_NAME='9.8';
const REQUIRED_VERSION_CODE=6;
const STATE_KEY='taskflow_required_update_state_v13090';
const ACK_KEY='taskflow_required_update_ack_v13090';
const STYLE_ID='tfV13090ForceUpdateStyle';
const MODAL_ID='tfV13090ForceUpdate';

let checkTimer=0;
let lastFingerprint='';

function get(k){try{return localStorage.getItem(k)||''}catch(_){return ''}}
function set(k,v){try{localStorage.setItem(k,String(v));return true}catch(_){return false}}
function del(k){try{localStorage.removeItem(k)}catch(_){}}
function ua(){return String(navigator.userAgent||'')}
function norm(v){return String(v==null?'':v).trim()}
function isAppShell(){
  return /\bwv\b/i.test(ua())||/Vinebre/i.test(ua())||!!window.AC24BlobDataDownload||
    !!window.AC24_INTERNAL_SHARE_BRIDGE_2026||!!window.AC24_INTERNAL_PRINT_BRIDGE_2026;
}
function hasFn(obj,name){try{return !!obj&&typeof obj[name]==='function'}catch(_){return false}}
function safeCall(obj,name){
  try{
    if(!obj||typeof obj[name]!=='function')return '';
    const v=obj[name]();
    return (v==null||typeof v==='object')?'':String(v);
  }catch(_){return ''}
}
function parseState(){
  try{
    const s=JSON.parse(get(STATE_KEY)||'null');
    return s&&typeof s==='object'&&!Array.isArray(s)?s:null;
  }catch(_){return null}
}
function writeState(s){
  try{return set(STATE_KEY,JSON.stringify(s))}catch(_){return false}
}

/* Busca una versión REAL expuesta por el contenedor Android.
   No acepta localStorage ni variables creadas por esta web como prueba. */
function nativeVersionEvidence(){
  const candidates=[
    window.TaskFlowNative,
    window.TaskFlowAndroid,
    window.Android,
    window.App,
    window.NativeApp,
    window.AC24App,
    window.AC24
  ];
  const versionMethods=['getVersionName','getAppVersion','versionName','appVersion'];
  const codeMethods=['getVersionCode','getAppVersionCode','versionCode','appVersionCode'];

  for(const obj of candidates){
    if(!obj)continue;
    let name='',code='';
    for(const m of versionMethods){name=safeCall(obj,m);if(name)break}
    for(const m of codeMethods){code=safeCall(obj,m);if(code)break}
    const ncode=Number(code);
    if(name===REQUIRED_VERSION_NAME && (!code || (Number.isFinite(ncode)&&ncode>=REQUIRED_VERSION_CODE))){
      return {ok:true,source:'native-version',name,code:Number.isFinite(ncode)?ncode:null};
    }
    if(Number.isFinite(ncode)&&ncode>=REQUIRED_VERSION_CODE && /9\.8/.test(name)){
      return {ok:true,source:'native-version',name,code:ncode};
    }
  }

  const s=ua();
  const patterns=[
    /TaskFlow(?:\/|\s|Version\/)(9\.8)(?:[\/\s-]*(?:build)?\s*(6))?/i,
    /AppVersion[\/:\s]+(9\.8)(?:[\/\s-]+(6))?/i
  ];
  for(const re of patterns){
    const m=s.match(re);
    if(m&&m[1]===REQUIRED_VERSION_NAME&&(!m[2]||Number(m[2])>=REQUIRED_VERSION_CODE)){
      return {ok:true,source:'user-agent-version',name:m[1],code:m[2]?Number(m[2]):null};
    }
  }
  return {ok:false,source:'none'};
}

/* Huella exclusivamente de la capa nativa AC24/Vinebre.
   No incluye módulos TaskFlow para que una actualización web NO pueda desbloquearse sola. */
function nativeFingerprint(){
  const parts=[];
  parts.push(/Vinebre/i.test(ua())?'vinebre:1':'vinebre:0');
  parts.push(/\bwv\b/i.test(ua())?'wv:1':'wv:0');

  const known=[
    ['AC24BlobDataDownload',window.AC24BlobDataDownload,['save','download','saveFile']],
    ['AC24_INTERNAL_SHARE_BRIDGE_2026',window.AC24_INTERNAL_SHARE_BRIDGE_2026,['startShare','finishShare','cancelShare','startFile','fileChunk','finishFile']],
    ['AC24_INTERNAL_PRINT_BRIDGE_2026',window.AC24_INTERNAL_PRINT_BRIDGE_2026,['print','printPopup']],
    ['TaskFlowNative',window.TaskFlowNative,['getVersionName','getVersionCode','getAppVersion','getAppVersionCode']],
    ['TaskFlowAndroid',window.TaskFlowAndroid,['getVersionName','getVersionCode','getAppVersion','getAppVersionCode']],
    ['Android',window.Android,['getVersionName','getVersionCode','getAppVersion','getAppVersionCode']]
  ];
  for(const [name,obj,methods] of known){
    parts.push(name+':'+(obj?'1':'0')+':'+methods.map(m=>hasFn(obj,m)?'1':'0').join(''));
  }
  parts.push('__AC24_INTERNAL_SHARE_INSTALLED_2026:'+(window.__AC24_INTERNAL_SHARE_INSTALLED_2026===true?'1':'0'));
  parts.push('__AC24_INTERNAL_PRINT_INSTALLED_2026:'+(window.__AC24_INTERNAL_PRINT_INSTALLED_2026===true?'1':'0'));
  parts.push('navigator.share:'+(typeof navigator.share==='function'?'1':'0'));
  parts.push('navigator.canShare:'+(typeof navigator.canShare==='function'?'1':'0'));

  try{
    const globals=Object.getOwnPropertyNames(window)
      .filter(k=>/^(?:__)?AC24/i.test(k))
      .sort();
    parts.push('globals:'+globals.join(','));
  }catch(_){}

  return parts.join('|');
}
function nativeCoreReady(){
  const share=window.AC24_INTERNAL_SHARE_BRIDGE_2026;
  const print=window.AC24_INTERNAL_PRINT_BRIDGE_2026;
  const blob=window.AC24BlobDataDownload;
  const shareFns=['startShare','finishShare','cancelShare','startFile','fileChunk','finishFile'];
  return shareFns.every(name=>hasFn(share,name))&&hasFn(print,'print')&&hasFn(print,'printPopup')&&hasFn(blob,'save');
}

function ensureState(){
  let s=parseState();
  const fp=nativeFingerprint();
  lastFingerprint=fp;
  if(!s||s.releaseId!==RELEASE_ID){
    s={
      releaseId:RELEASE_ID,
      required:true,
      baselineFingerprint:fp,
      downloadStarted:false,
      downloadStartedAt:0,
      createdAt:Date.now(),
      verifiedAt:0,
      verifiedBy:''
    };
    writeState(s);
    del(ACK_KEY);
  }else if(!s.baselineFingerprint){
    s.baselineFingerprint=fp;
    writeState(s);
  }
  return s;
}
function installedVerified(){
  const version=nativeVersionEvidence();
  if(version.ok)return {ok:true,by:version.source};

  const s=ensureState();
  const fp=nativeFingerprint();

  /* La huella solo puede servir DESPUÉS de pulsar descargar.
     La misma APK que vuelve tras cancelar conserva la misma huella y sigue bloqueada. */
  if(s.downloadStarted===true && s.baselineFingerprint && fp!==s.baselineFingerprint && nativeCoreReady()){
    return {ok:true,by:'native-fingerprint-change'};
  }
  return {ok:false,by:'none'};
}
function acknowledge(by){
  const s=ensureState();
  s.verifiedAt=Date.now();
  s.verifiedBy=by||'native';
  writeState(s);
  set(ACK_KEY,RELEASE_ID);
}
function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
#${MODAL_ID}{position:fixed!important;inset:0!important;z-index:2147483647!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:18px!important;background:radial-gradient(circle at 50% 12%,rgba(70,232,218,.15),transparent 34%),radial-gradient(circle at 82% 82%,rgba(122,88,255,.11),transparent 31%),rgba(2,6,15,.985)!important;backdrop-filter:blur(19px) saturate(1.18)!important;-webkit-backdrop-filter:blur(19px) saturate(1.18)!important;overscroll-behavior:none!important;touch-action:none!important}
#${MODAL_ID} .tfu-card{position:relative;width:min(470px,100%);overflow:hidden;border-radius:28px;border:1px solid rgba(78,231,218,.32);background:radial-gradient(circle at 90% 0%,rgba(95,222,213,.11),transparent 30%),radial-gradient(circle at 0 100%,rgba(117,86,255,.09),transparent 35%),linear-gradient(160deg,#121d34,#0b1326 54%,#070c18);box-shadow:0 36px 110px rgba(0,0,0,.70),0 0 58px rgba(57,224,211,.09),inset 0 1px 0 rgba(255,255,255,.05);color:#f7fbff}
#${MODAL_ID} .tfu-card:before{content:'';position:absolute;left:9%;right:9%;top:0;height:2px;border-radius:999px;background:linear-gradient(90deg,transparent,#48e6d8 24%,#8189ff 58%,#ff9d4c 84%,transparent);box-shadow:0 0 18px rgba(72,230,216,.45)}
#${MODAL_ID} .tfu-head{padding:27px 24px 18px;text-align:center}
#${MODAL_ID} .tfu-icon{width:70px;height:70px;margin:0 auto 17px;border-radius:22px;display:grid;place-items:center;border:1px solid rgba(82,232,218,.30);background:linear-gradient(145deg,rgba(21,72,80,.75),rgba(20,31,58,.96));color:#59e8dc;box-shadow:0 15px 34px rgba(0,0,0,.26),0 0 25px rgba(78,230,217,.10),inset 0 1px 0 rgba(255,255,255,.055)}
#${MODAL_ID} .tfu-icon svg{width:35px;height:35px;filter:drop-shadow(0 0 8px rgba(83,232,219,.30))}
#${MODAL_ID} .tfu-kicker{font-size:9px;font-weight:950;letter-spacing:.17em;color:#64eadf;text-transform:uppercase}
#${MODAL_ID} h2{margin:7px 0;font-size:27px;line-height:1.05;letter-spacing:-.02em}
#${MODAL_ID} .tfu-version{font-size:10px;font-weight:850;color:#899ab3;letter-spacing:.12em;text-transform:uppercase}
#${MODAL_ID} .tfu-copy{margin:18px 0 0;color:#a8b5c8;font-size:12px;line-height:1.55}
#${MODAL_ID} .tfu-required{margin:17px 20px 0;padding:12px 13px;border-radius:14px;text-align:center;border:1px solid rgba(255,168,78,.22);background:rgba(255,142,55,.07);color:#f3c393;font-size:10px;line-height:1.5}
#${MODAL_ID} .tfu-actions{padding:18px 20px 22px;display:grid;gap:10px}
#${MODAL_ID} .tfu-download{width:100%;min-height:54px;border-radius:17px;display:flex;align-items:center;justify-content:center;gap:10px;padding:13px 16px;text-decoration:none;font-size:13px;font-weight:950;border:1px solid rgba(83,234,219,.40);background:linear-gradient(135deg,rgba(34,121,120,.82),rgba(43,74,130,.82));color:#efffff;box-shadow:0 15px 34px rgba(0,0,0,.24),0 0 23px rgba(67,224,211,.09),inset 0 1px 0 rgba(255,255,255,.08)}
#${MODAL_ID} .tfu-download:active{transform:scale(.985)}
#${MODAL_ID} .tfu-download svg{width:20px;height:20px;flex:0 0 20px}
#${MODAL_ID} .tfu-status{text-align:center;color:#8fa2bc;font-size:9.5px;line-height:1.5}
@media(max-width:430px){#${MODAL_ID}{padding:12px!important}#${MODAL_ID} .tfu-card{border-radius:24px}#${MODAL_ID} .tfu-head{padding:24px 18px 16px}#${MODAL_ID} h2{font-size:24px}#${MODAL_ID} .tfu-copy{font-size:11px}#${MODAL_ID} .tfu-required{margin-left:16px;margin-right:16px}#${MODAL_ID} .tfu-actions{padding-left:16px;padding-right:16px}}
`;document.head.appendChild(s);
}
function lockPage(){
  try{document.documentElement.dataset.tfRequiredUpdate='1'}catch(_){}
  try{document.documentElement.style.setProperty('overflow','hidden','important')}catch(_){}
  try{document.body.style.setProperty('overflow','hidden','important')}catch(_){}
}
function unlockPage(){
  try{delete document.documentElement.dataset.tfRequiredUpdate}catch(_){}
  try{document.documentElement.style.removeProperty('overflow')}catch(_){}
  try{document.body.style.removeProperty('overflow')}catch(_){}
}
function status(text){
  const el=document.getElementById('tfuStatus');if(el)el.textContent=text;
}
function finish(by){
  acknowledge(by);
  if(checkTimer){clearInterval(checkTimer);checkTimer=0}
  unlockPage();
  const root=document.getElementById(MODAL_ID);if(root)root.remove();
  return true;
}
function recheck(){
  const proof=installedVerified();
  if(proof.ok){finish(proof.by);return true}
  lockPage();
  const s=ensureState();
  status(s.downloadStarted?
    'La instalación nueva aún no fue verificada. TaskFlow seguirá bloqueado hasta detectar la APK actualizada.':
    'Debes instalar la actualización para continuar.');
  return false;
}
function markDownloadStarted(){
  const s=ensureState();
  s.downloadStarted=true;
  s.downloadStartedAt=Date.now();
  writeState(s);
  status('Descarga iniciada. Si la cancelas o no instalas la APK, TaskFlow seguirá bloqueado.');
}
function build(){
  if(!isAppShell())return;
  const proof=installedVerified();
  if(proof.ok){finish(proof.by);return}
  if(document.getElementById(MODAL_ID))return;

  installStyle();lockPage();ensureState();
  const root=document.createElement('div');
  root.id=MODAL_ID;
  root.setAttribute('role','dialog');
  root.setAttribute('aria-modal','true');
  root.innerHTML=`<section class="tfu-card"><div class="tfu-head"><div class="tfu-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/></svg></div><div class="tfu-kicker">Actualización obligatoria</div><h2>Actualiza TaskFlow para continuar</h2><div class="tfu-version">${RELEASE_LABEL}</div><p class="tfu-copy">Descarga e instala la nueva APK. TaskFlow permanecerá bloqueado hasta verificar que la aplicación instalada realmente cambió.</p></div><div class="tfu-required">Cancelar la descarga, volver atrás, cerrar el instalador o reabrir la APK anterior <b>no desbloquea TaskFlow</b>.</div><div class="tfu-actions"><a class="tfu-download" id="tfuDownload" href="${DOWNLOAD_URL}" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/></svg><span>Descargar actualización</span></a><div class="tfu-status" id="tfuStatus">Debes instalar la actualización para continuar.</div></div></section>`;
  document.body.appendChild(root);

  const a=document.getElementById('tfuDownload');
  if(a)a.addEventListener('click',markDownloadStarted,{capture:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(recheck,350)},true);
  window.addEventListener('pageshow',()=>setTimeout(recheck,350),true);
  window.addEventListener('focus',()=>setTimeout(recheck,350),true);
  checkTimer=setInterval(recheck,1200);
}
function boot(){
  [
    'taskflow_required_update_ack_v1','taskflow_required_update_ack_v2','taskflow_required_update_ack_v3','taskflow_required_update_ack_v4',
    'taskflow_required_update_native_ack_v2','taskflow_required_update_flow_v2','taskflow_required_update_flow_v3','taskflow_required_update_flow_v4',
    'taskflow_required_update_pending_v1','taskflow_required_update_pending_v2'
  ].forEach(del);

  if(!isAppShell())return;
  const proof=installedVerified();
  if(proof.ok){finish(proof.by);return}
  del(ACK_KEY);
  if(document.body)build();else document.addEventListener('DOMContentLoaded',build,{once:true});
}
boot();
})();