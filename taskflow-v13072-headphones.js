(function(){
'use strict';
if(window.__tfV13072Headphones)return;
window.__tfV13072Headphones=true;

/* V130.7.2 · Aviso único de auriculares.
   - Aparece una sola vez por ciclo del sistema.
   - No reaparece al cerrar/abrir TaskFlow.
   - Se habilita nuevamente únicamente tras un reinicio de sistema exitoso. */

const SEEN_KEY='taskflow_headphones_notice_seen_v13072';
const OVERLAY_ID='tfHeadphonesV13072';
let shown=false,resetWatch=null,probeTimer=0;

function getSeen(){try{return localStorage.getItem(SEEN_KEY)==='1'}catch(_){return false}}
function setSeen(){try{localStorage.setItem(SEEN_KEY,'1')}catch(_){}}
function clearSeen(){try{localStorage.removeItem(SEEN_KEY)}catch(_){}}

function installStyle(){
  if(document.getElementById('tfHeadphonesV13072Style'))return;
  const s=document.createElement('style');
  s.id='tfHeadphonesV13072Style';
  s.textContent=`
#${OVERLAY_ID}{position:fixed;inset:0;z-index:2147483646;display:none;align-items:center;justify-content:center;padding:18px;background:radial-gradient(circle at 50% 35%,rgba(59,230,216,.12),transparent 30%),rgba(2,6,16,.91);backdrop-filter:blur(13px) saturate(1.12);-webkit-backdrop-filter:blur(13px) saturate(1.12);color:#fff;overscroll-behavior:none}
#${OVERLAY_ID}.open{display:flex}.tf13072-card{position:relative;width:min(430px,100%);padding:25px 22px 21px;text-align:center;border-radius:26px;border:1px solid rgba(85,231,218,.30);background:radial-gradient(circle at 85% 0%,rgba(127,91,255,.12),transparent 31%),linear-gradient(155deg,#111d34 0%,#0a1223 58%,#060c17 100%);box-shadow:0 34px 100px rgba(0,0,0,.72),0 0 42px rgba(66,225,209,.09),inset 0 1px 0 rgba(255,255,255,.05);overflow:hidden}.tf13072-card:before{content:"";position:absolute;left:13%;right:13%;top:0;height:2px;border-radius:99px;background:linear-gradient(90deg,transparent,#4ae7da 26%,#8976ff 62%,#ff9b45 88%,transparent);box-shadow:0 0 18px rgba(74,231,218,.42)}
.tf13072-icon{width:82px;height:82px;margin:0 auto 17px;display:grid;place-items:center;border-radius:24px;border:1px solid rgba(83,230,216,.24);background:linear-gradient(145deg,rgba(24,69,77,.56),rgba(25,31,63,.68));color:#63eadf;box-shadow:0 16px 35px rgba(0,0,0,.28),0 0 28px rgba(83,230,216,.08),inset 0 1px 0 rgba(255,255,255,.05)}.tf13072-icon svg{width:45px;height:45px;display:block;filter:drop-shadow(0 0 10px rgba(99,234,223,.28))}
.tf13072-kicker{display:inline-block;color:#6aeadf;font-size:8px;font-weight:950;letter-spacing:.16em;text-transform:uppercase}.tf13072-card h2{margin:8px 0 8px;font-size:28px;line-height:1.04;letter-spacing:-.025em}.tf13072-card p{margin:0 auto;max-width:340px;color:#9eabc0;font-size:11px;line-height:1.55}.tf13072-note{margin:16px auto 0;padding:11px 13px;border-radius:14px;border:1px solid rgba(255,255,255,.065);background:rgba(255,255,255,.025);color:#b4bfd0;font-size:9px;line-height:1.45}.tf13072-btn{width:100%;min-height:49px;margin-top:16px;border-radius:15px;border:1px solid rgba(78,226,213,.34);background:linear-gradient(135deg,rgba(25,127,126,.38),rgba(30,72,104,.42));color:#6cf0e4;font-size:12px;font-weight:950;letter-spacing:.02em;box-shadow:0 12px 30px rgba(0,0,0,.22),0 0 24px rgba(57,221,208,.08),inset 0 1px 0 rgba(255,255,255,.05)}.tf13072-btn:active{transform:scale(.99)}
@media(max-width:430px){#${OVERLAY_ID}{padding:14px}.tf13072-card{padding:23px 17px 18px;border-radius:23px}.tf13072-card h2{font-size:25px}.tf13072-icon{width:75px;height:75px;border-radius:21px}.tf13072-icon svg{width:41px;height:41px}}
`;
  document.head.appendChild(s);
}

function build(){
  let overlay=document.getElementById(OVERLAY_ID);
  if(overlay)return overlay;
  overlay=document.createElement('div');
  overlay.id=OVERLAY_ID;
  overlay.setAttribute('aria-hidden','true');
  overlay.innerHTML=`<section class="tf13072-card" role="dialog" aria-modal="true" aria-labelledby="tfHeadphonesTitleV13072">
    <div class="tf13072-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h3v6H5a1 1 0 0 1-1-1v-5Z"/><path d="M20 14h-3v6h2a1 1 0 0 0 1-1v-5Z"/><path d="M17 20c-.8 1-2 1.5-3.5 1.5"/></svg></div>
    <span class="tf13072-kicker">Recomendación de audio</span>
    <h2 id="tfHeadphonesTitleV13072">Conecta tus auriculares</h2>
    <p>Disfruta con mayor claridad la música y los sonidos de TaskFlow.</p>
    <div class="tf13072-note">Puedes seguir usando el sistema normalmente. Este aviso solo aparecerá una vez.</div>
    <button class="tf13072-btn" type="button" data-tf13072-close>Entendido · continuar</button>
  </section>`;
  document.body.appendChild(overlay);
  overlay.querySelector('[data-tf13072-close]').addEventListener('click',close,{once:true});
  return overlay;
}

function close(){
  const overlay=document.getElementById(OVERLAY_ID);
  if(!overlay)return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden','true');
  document.body.style.overflow=overlay.dataset.prevOverflow||'';
  setTimeout(()=>overlay.remove(),180);
}

function blockersOpen(){
  const ids=['tfAudioGateV13057','tfWelcomeV13063'];
  return ids.some(id=>{const el=document.getElementById(id);return !!(el&&el.classList.contains('open'))});
}

function show(){
  if(shown||getSeen())return;
  if(blockersOpen()){probeTimer=setTimeout(show,450);return}
  shown=true;
  setSeen();
  installStyle();
  const overlay=build();
  overlay.dataset.prevOverflow=document.body.style.overflow||'';
  document.body.style.overflow='hidden';
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden','false');
}

function watchResetSuccess(status){
  if(resetWatch){try{resetWatch.disconnect()}catch(_){}resetWatch=null}
  if(!status)return;
  resetWatch=new MutationObserver(()=>{
    if(!status.classList.contains('ok'))return;
    clearSeen();
    try{resetWatch.disconnect()}catch(_){}
    resetWatch=null;
  });
  resetWatch.observe(status,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
}

function bindReset(){
  document.addEventListener('click',event=>{
    const button=event.target&&event.target.closest?event.target.closest('#tf120ResetConfirm'):null;
    if(!button)return;
    watchResetSuccess(document.getElementById('tf120ResetStatus'));
  },true);
}

function boot(){
  bindReset();
  if(getSeen())return;
  probeTimer=setTimeout(show,900);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('pagehide',()=>{if(probeTimer)clearTimeout(probeTimer)},{once:true});
})();
