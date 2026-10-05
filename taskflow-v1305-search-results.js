(function(){
'use strict';
if(window.__tfV13054Bridge)return;window.__tfV13054Bridge=true;

/* V130.6.5 · Puente actual.
   Conserva la posición real de la música antes de que el módulo de sonido termine de iniciar. */
function installAudioContinuityGuard(){
  if(window.__tfV13065AudioContinuity)return;window.__tfV13065AudioContinuity=true;
  const KEY='taskflow_sound_playback_v13057';
  const originalSetItem=Storage.prototype.setItem;
  const previousPlay=HTMLMediaElement.prototype.play;
  const bootAt=Date.now();
  let protectedState=null,lastActive=null,lastWriteAt=0;
  const parse=value=>{try{const d=JSON.parse(value||'{}'),index=Number(d.index),time=Number(d.time);return Number.isFinite(index)&&index>=0&&Number.isFinite(time)&&time>=0?{index,time}:null}catch(_){return null}};
  try{protectedState=parse(localStorage.getItem(KEY))}catch(_){}
  const isMusic=media=>media instanceof HTMLAudioElement&&media.getAttribute('data-taskflow-sound')!==null;
  const directWrite=state=>{if(!state)return;try{originalSetItem.call(localStorage,KEY,JSON.stringify({index:state.index,time:state.time,at:Date.now()}))}catch(_){}};
  const save=(audio,force)=>{if(!isMusic(audio))return;const index=Number(audio.getAttribute('data-taskflow-sound')),time=Number(audio.currentTime);if(!Number.isFinite(index)||index<0||!Number.isFinite(time)||time<0)return;const now=Date.now();if(!force&&now-lastWriteAt<900)return;lastWriteAt=now;directWrite({index,time});if(time>.05)protectedState=null};
  const bind=audio=>{if(!isMusic(audio)||audio.dataset.tf13065Continuity==='1')return;audio.dataset.tf13065Continuity='1';audio.addEventListener('timeupdate',()=>save(audio,false));audio.addEventListener('pause',()=>save(audio,true));audio.addEventListener('ended',()=>save(audio,true))};
  Storage.prototype.setItem=function(key,value){
    if(this===localStorage&&key===KEY&&protectedState&&protectedState.time>.05&&Date.now()-bootAt<30000){
      const next=parse(value);
      if(next&&next.index===protectedState.index&&next.time<=.05)return;
      if(next&&(next.index!==protectedState.index||next.time>.05))protectedState=null;
    }
    return originalSetItem.apply(this,arguments);
  };
  HTMLMediaElement.prototype.play=function(){if(isMusic(this)){lastActive=this;bind(this)}return previousPlay.apply(this,arguments)};
  const persist=()=>{if(lastActive)save(lastActive,true)};
  window.addEventListener('pagehide',persist,{capture:true});
  window.addEventListener('beforeunload',persist,{capture:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)persist()},true);
}

function addCss(){if(document.getElementById('tfV13051ProfileCss'))return;const l=document.createElement('link');l.id='tfV13051ProfileCss';l.rel='stylesheet';l.href='./taskflow-v13051-profile-compact.css?v=13051-20261004';document.head.appendChild(l)}
function addScript(id,src){if(document.getElementById(id))return;const s=document.createElement('script');s.id=id;s.src=src;s.async=false;document.body.appendChild(s)}
function boot(){addCss();addScript('tfV13051ProfileJs','./taskflow-v13051-profile-compact.js?v=13051-20261004');addScript('tfV13053SearchStabilityJs','./taskflow-v13053-search-stability.js?v=13053-20261004');addScript('tfV13053VisualPolishJs','./taskflow-v13053-visual-polish.js?v=13053-20261004');addScript('tfV13054SearchCompleteJs','./taskflow-v13054-search-complete.js?v=13054-20261004');addScript('tfV13062MentalistaSearchGuardJs','./taskflow-v13062-mentalista-search-guard.js?v=13062-20261005');addScript('tfV13063WelcomeJs','./taskflow-v13063-welcome.js?v=13063-20261005');addScript('tfV13064WelcomeEmphasisJs','./taskflow-v13064-welcome-emphasis.js?v=13064-20261005');addScript('tfV13065UiStabilityJs','./taskflow-v13065-ui-stability.js?v=13065-20261005')}

installAudioContinuityGuard();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
