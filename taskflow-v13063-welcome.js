(function(){
'use strict';
if(window.__tfV13063Welcome)return;window.__tfV13063Welcome=true;

/* V130.8.3 · Bienvenida reactivada una sola vez para la nueva versión.
   - Explica únicamente los comandos SONIDO y MEJORAR.
   - El botón aparece después de 10 segundos.
   - Una vez confirmada, no reaparece al salir/entrar de la app.
   - Vuelve a habilitarse únicamente después de un reinicio de sistema exitoso. */

const SEEN_KEY='taskflow_welcome_seen_v13083_release';
const OVERLAY_ID='tfWelcomeV13063';
const WAIT_SECONDS=10;
let timer=0,shown=false,resetWatch=null;

function getSeen(){try{return localStorage.getItem(SEEN_KEY)==='1'}catch(_){return false}}
function setSeen(){try{localStorage.setItem(SEEN_KEY,'1')}catch(_){}}
function clearSeen(){try{localStorage.removeItem(SEEN_KEY)}catch(_){}}

function installStyle(){
  if(document.getElementById('tfWelcomeV13063Style'))return;
  const s=document.createElement('style');
  s.id='tfWelcomeV13063Style';
  s.textContent=`
#${OVERLAY_ID}{position:fixed;inset:0;z-index:2147483645;display:none;align-items:center;justify-content:center;padding:18px;background:radial-gradient(circle at 50% 24%,rgba(63,226,212,.11),transparent 32%),rgba(2,6,16,.92);backdrop-filter:blur(14px) saturate(1.12);-webkit-backdrop-filter:blur(14px) saturate(1.12);color:#fff;overscroll-behavior:none}
#${OVERLAY_ID}.open{display:flex}
.tf13063-card{position:relative;width:min(470px,100%);overflow:hidden;border-radius:26px;border:1px solid rgba(83,226,214,.30);background:radial-gradient(circle at 92% 0%,rgba(102,83,255,.11),transparent 29%),radial-gradient(circle at 0% 100%,rgba(255,151,67,.07),transparent 32%),linear-gradient(160deg,#131d35 0%,#0b1325 54%,#070d19 100%);box-shadow:0 34px 100px rgba(0,0,0,.72),0 0 44px rgba(66,225,209,.08),inset 0 1px 0 rgba(255,255,255,.05)}
.tf13063-card:before{content:"";position:absolute;left:12%;right:12%;top:0;height:2px;border-radius:99px;background:linear-gradient(90deg,transparent,#4ae7da 28%,#8a73ff 62%,#ff9b45 88%,transparent);box-shadow:0 0 18px rgba(74,231,218,.42)}
.tf13063-head{padding:24px 22px 14px;text-align:center}.tf13063-kicker{display:inline-flex;align-items:center;gap:7px;padding:6px 10px;border-radius:999px;border:1px solid rgba(76,228,215,.18);background:rgba(41,190,181,.07);color:#61e8dc;font-size:8px;font-weight:950;letter-spacing:.16em}.tf13063-kicker:before{content:"";width:6px;height:6px;border-radius:50%;background:#59e5d8;box-shadow:0 0 10px rgba(89,229,216,.8)}
.tf13063-head h2{margin:13px 0 7px;font-size:28px;line-height:1.05;letter-spacing:-.025em}.tf13063-head p{margin:0 auto;max-width:360px;color:#9eabc0;font-size:11px;line-height:1.5}
.tf13063-body{padding:4px 18px 20px;display:grid;gap:10px}.tf13063-command{display:grid;grid-template-columns:92px minmax(0,1fr);gap:12px;align-items:center;padding:13px 14px;border:1px solid rgba(255,255,255,.075);border-radius:16px;background:linear-gradient(145deg,rgba(255,255,255,.038),rgba(255,255,255,.018));box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
.tf13063-code{display:grid;place-items:center;min-height:42px;border-radius:12px;font-size:11px;font-weight:950;letter-spacing:.08em}.tf13063-command.sound .tf13063-code{color:#5ce9dc;border:1px solid rgba(79,230,216,.24);background:rgba(45,205,193,.08);box-shadow:0 0 18px rgba(57,220,207,.06)}.tf13063-command.improve .tf13063-code{color:#bb9bff;border:1px solid rgba(160,125,255,.24);background:rgba(136,95,239,.08);box-shadow:0 0 18px rgba(143,101,246,.06)}
.tf13063-copy strong{display:block;font-size:12px;margin-bottom:3px}.tf13063-copy span{display:block;color:#8f9eb4;font-size:9px;line-height:1.45}
.tf13063-foot{padding:0 18px 20px;text-align:center}.tf13063-wait{display:flex;align-items:center;justify-content:center;gap:9px;min-height:46px;border-radius:14px;border:1px solid rgba(255,255,255,.065);background:rgba(255,255,255,.025);color:#9ba9bd;font-size:10px}.tf13063-count{min-width:28px;color:#63e9dd;font-weight:950;font-variant-numeric:tabular-nums}
.tf13063-next{display:none;width:100%;min-height:48px;border-radius:15px;border:1px solid rgba(78,226,213,.34);background:linear-gradient(135deg,rgba(25,127,126,.36),rgba(30,72,104,.40));color:#6cf0e4;font-size:12px;font-weight:950;letter-spacing:.02em;box-shadow:0 12px 30px rgba(0,0,0,.22),0 0 24px rgba(57,221,208,.08),inset 0 1px 0 rgba(255,255,255,.05)}.tf13063-next.show{display:block}.tf13063-next:active{transform:scale(.99)}
@media(max-width:430px){#${OVERLAY_ID}{padding:14px}.tf13063-card{border-radius:23px}.tf13063-head{padding:21px 18px 12px}.tf13063-head h2{font-size:25px}.tf13063-body{padding:4px 14px 17px}.tf13063-command{grid-template-columns:82px minmax(0,1fr);padding:12px}.tf13063-code{font-size:10px}.tf13063-foot{padding:0 14px 16px}}
@media(prefers-reduced-motion:reduce){.tf13063-next{transition:none!important}}
`;
  document.head.appendChild(s);
}

function build(){
  if(document.getElementById(OVERLAY_ID))return document.getElementById(OVERLAY_ID);
  const overlay=document.createElement('div');
  overlay.id=OVERLAY_ID;
  overlay.setAttribute('aria-hidden','true');
  overlay.innerHTML=`<section class="tf13063-card" role="dialog" aria-modal="true" aria-labelledby="tfWelcomeTitleV13063">
    <header class="tf13063-head">
      <span class="tf13063-kicker">ACCESOS RÁPIDOS</span>
      <h2 id="tfWelcomeTitleV13063">Bienvenido a TaskFlow</h2>
      <p>El buscador también acepta comandos para abrir herramientas del sistema al instante.</p>
    </header>
    <div class="tf13063-body">
      <div class="tf13063-command sound"><div class="tf13063-code">SONIDO</div><div class="tf13063-copy"><strong>Control de música</strong><span>Abre las opciones de música y reproducción en segundo plano.</span></div></div>
      <div class="tf13063-command improve"><div class="tf13063-code">MEJORAR</div><div class="tf13063-copy"><strong>Configura tus rutinas</strong><span>Abre el administrador de rutinas predeterminadas de TaskFlow.</span></div></div>
    </div>
    <footer class="tf13063-foot">
      <div class="tf13063-wait" data-tf13063-wait>Podrás continuar en <b class="tf13063-count">10 s</b></div>
      <button class="tf13063-next" type="button" data-tf13063-next>Entendido · continuar →</button>
    </footer>
  </section>`;
  document.body.appendChild(overlay);
  return overlay;
}

function closeWelcome(){
  const overlay=document.getElementById(OVERLAY_ID);
  if(!overlay)return;
  setSeen();
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden','true');
  document.body.style.overflow=overlay.dataset.prevOverflow||'';
  setTimeout(()=>overlay.remove(),180);
}

function showWelcome(){
  if(shown||getSeen())return;
  const gate=document.getElementById('tfAudioGateV13057');
  if(gate&&gate.classList.contains('open')){setTimeout(showWelcome,500);return}
  shown=true;
  installStyle();
  const overlay=build();
  overlay.dataset.prevOverflow=document.body.style.overflow||'';
  document.body.style.overflow='hidden';
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden','false');
  const wait=overlay.querySelector('[data-tf13063-wait]');
  const count=overlay.querySelector('.tf13063-count');
  const next=overlay.querySelector('[data-tf13063-next]');
  let remaining=WAIT_SECONDS;
  clearInterval(timer);
  timer=setInterval(()=>{
    remaining--;
    if(remaining>0){if(count)count.textContent=remaining+' s';return}
    clearInterval(timer);timer=0;
    if(wait)wait.style.display='none';
    if(next)next.classList.add('show');
  },1000);
  next.addEventListener('click',closeWelcome,{once:true});
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
    const status=document.getElementById('tf120ResetStatus');
    watchResetSuccess(status);
  },true);
}

function boot(){
  bindReset();
  if(getSeen())return;
  setTimeout(showWelcome,650);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();
