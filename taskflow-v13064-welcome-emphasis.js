(function(){
'use strict';
if(window.__tfV13064WelcomeEmphasis)return;window.__tfV13064WelcomeEmphasis=true;

/* V130.6.4 · Solo ajusta la bienvenida:
   - 20 segundos antes de continuar.
   - Énfasis visual parpadeante/pulsante en SONIDO y MEJORAR.
   - No modifica buscador, rutinas, música, datos ni sincronización. */

const OVERLAY_ID='tfWelcomeV13063';
const TOTAL_MS=20000;
let seekTimer=0;
let countdownTimer=0;

function installStyle(){
  if(document.getElementById('tfV13064WelcomeEmphasisStyle'))return;
  const s=document.createElement('style');
  s.id='tfV13064WelcomeEmphasisStyle';
  s.textContent=`
#${OVERLAY_ID} .tf13063-command{
  position:relative;
  overflow:hidden;
  animation:tf13064CommandPulse 1.9s ease-in-out infinite;
  will-change:filter,box-shadow,border-color;
}
#${OVERLAY_ID} .tf13063-command.improve{animation-delay:.95s}
#${OVERLAY_ID} .tf13063-command .tf13063-code,
#${OVERLAY_ID} .tf13063-command .tf13063-copy{
  animation:tf13064ReadBlink 1.9s ease-in-out infinite;
}
#${OVERLAY_ID} .tf13063-command.improve .tf13063-code,
#${OVERLAY_ID} .tf13063-command.improve .tf13063-copy{animation-delay:.95s}
#${OVERLAY_ID} .tf13063-command::after{
  content:"";
  position:absolute;
  inset:-40% -65%;
  pointer-events:none;
  background:linear-gradient(110deg,transparent 38%,rgba(255,255,255,.08) 50%,transparent 62%);
  transform:translateX(-35%);
  animation:tf13064Sweep 1.9s ease-in-out infinite;
}
#${OVERLAY_ID} .tf13063-command.improve::after{animation-delay:.95s}
@keyframes tf13064CommandPulse{
  0%,100%{filter:brightness(.94) saturate(1);border-color:rgba(255,255,255,.075);box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}
  42%,58%{filter:brightness(1.18) saturate(1.28);border-color:rgba(94,235,222,.30);box-shadow:0 0 0 1px rgba(77,231,218,.07),0 0 28px rgba(77,231,218,.11),inset 0 1px 0 rgba(255,255,255,.055)}
}
@keyframes tf13064ReadBlink{
  0%,100%{opacity:.72;transform:translateZ(0)}
  42%,58%{opacity:1}
}
@keyframes tf13064Sweep{
  0%,30%{opacity:0;transform:translateX(-35%)}
  48%{opacity:1}
  68%,100%{opacity:0;transform:translateX(35%)}
}
@media(prefers-reduced-motion:reduce){
  #${OVERLAY_ID} .tf13063-command,
  #${OVERLAY_ID} .tf13063-command .tf13063-code,
  #${OVERLAY_ID} .tf13063-command .tf13063-copy,
  #${OVERLAY_ID} .tf13063-command::after{animation:none!important}
  #${OVERLAY_ID} .tf13063-command{border-color:rgba(94,235,222,.24)!important;box-shadow:0 0 24px rgba(77,231,218,.08)!important}
}
`;
  document.head.appendChild(s);
}

function enforceTwentySeconds(overlay){
  if(!overlay||overlay.dataset.tf13064Timer==='1')return;
  overlay.dataset.tf13064Timer='1';
  const wait=overlay.querySelector('[data-tf13063-wait]');
  const count=overlay.querySelector('.tf13063-count');
  const next=overlay.querySelector('[data-tf13063-next]');
  if(!wait||!count||!next)return;

  const started=performance.now();
  const tick=()=>{
    if(!document.documentElement.contains(overlay)){
      if(countdownTimer){clearInterval(countdownTimer);countdownTimer=0}
      return;
    }
    const elapsed=performance.now()-started;
    const remaining=Math.max(0,Math.ceil((TOTAL_MS-elapsed)/1000));
    if(elapsed<TOTAL_MS){
      wait.style.setProperty('display','flex','important');
      next.style.setProperty('display','none','important');
      count.textContent=remaining+' s';
      return;
    }
    wait.style.setProperty('display','none','important');
    next.style.setProperty('display','block','important');
    next.classList.add('show');
    if(countdownTimer){clearInterval(countdownTimer);countdownTimer=0}
  };
  tick();
  countdownTimer=setInterval(tick,200);
}

function seek(){
  installStyle();
  const overlay=document.getElementById(OVERLAY_ID);
  if(overlay){
    if(seekTimer){clearInterval(seekTimer);seekTimer=0}
    enforceTwentySeconds(overlay);
  }
}

function boot(){
  installStyle();
  seek();
  seekTimer=setInterval(seek,150);
  setTimeout(()=>{if(seekTimer){clearInterval(seekTimer);seekTimer=0}},12000);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();