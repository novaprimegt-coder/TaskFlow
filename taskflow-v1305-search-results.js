(function(){
'use strict';
if(window.__tfV13054Bridge)return;window.__tfV13054Bridge=true;

/* V130.8.3 · Puente actual de TaskFlow.
   - Conserva exactamente la pista y la posición guardada antes de reproducir al volver a abrir TaskFlow.
   - Evita que un arranque en 0 sobrescriba una posición válida antes de restaurarla.
   - Aplica el sonido de notificación a todas las misiones, tareas y hábitos al completarse.
   - Conserva el aviso único "Conecta tus auriculares".
   - No modifica rutinas, progreso, búsqueda, perfil ni diseño general. */
function installAudioContinuityGuard(){
  if(window.__tfV13071AudioContinuity)return;window.__tfV13071AudioContinuity=true;
  const KEY='taskflow_sound_playback_v13057';
  const originalSetItem=Storage.prototype.setItem;
  const previousPlay=HTMLMediaElement.prototype.play;
  const bootAt=Date.now();
  let protectedState=null,lastActive=null,lastWriteAt=0;

  const parse=value=>{
    try{
      const d=JSON.parse(value||'{}'),index=Number(d.index),time=Number(d.time);
      return Number.isFinite(index)&&index>=0&&Number.isFinite(time)&&time>=0?{index,time}:null;
    }catch(_){return null}
  };
  try{protectedState=parse(localStorage.getItem(KEY))}catch(_){}

  const isMusic=media=>media instanceof HTMLAudioElement&&media.getAttribute('data-taskflow-sound')!==null;
  const indexOf=audio=>Number(audio&&audio.getAttribute('data-taskflow-sound'));
  const directWrite=state=>{
    if(!state||!Number.isFinite(state.index)||state.index<0||!Number.isFinite(state.time)||state.time<0)return;
    try{originalSetItem.call(localStorage,KEY,JSON.stringify({index:state.index,time:state.time,at:Date.now()}))}catch(_){}
  };
  const safeSavedTime=(audio,time)=>{
    let t=Math.max(0,Number(time)||0);
    try{const d=Number(audio.duration);if(Number.isFinite(d)&&d>0)t=Math.min(t,Math.max(0,d-.15))}catch(_){}
    return t;
  };
  const save=(audio,force)=>{
    if(!isMusic(audio))return;
    const index=indexOf(audio),time=Number(audio.currentTime);
    if(!Number.isFinite(index)||index<0||!Number.isFinite(time)||time<0)return;
    if(protectedState&&audio.dataset.tf13071Restored!=='1')return;
    const now=Date.now();
    if(!force&&now-lastWriteAt<700)return;
    lastWriteAt=now;
    directWrite({index,time});
  };
  const bind=audio=>{
    if(!isMusic(audio)||audio.dataset.tf13071Bound==='1')return;
    audio.dataset.tf13071Bound='1';
    audio.addEventListener('timeupdate',()=>save(audio,false));
    audio.addEventListener('pause',()=>save(audio,true));
  };

  Storage.prototype.setItem=function(key,value){
    if(this===localStorage&&key===KEY&&protectedState&&protectedState.time>.05&&Date.now()-bootAt<90000){
      const next=parse(value);
      if(next&&next.index===protectedState.index&&next.time+1<protectedState.time)return;
    }
    return originalSetItem.apply(this,arguments);
  };

  function playWithRestore(audio,args){
    lastActive=audio;bind(audio);
    const index=indexOf(audio),state=protectedState;
    if(!state||state.index!==index||state.time<=.05){
      audio.dataset.tf13071Restored='1';
      return previousPlay.apply(audio,args);
    }
    if(audio.dataset.tf13071Restored==='1')return previousPlay.apply(audio,args);
    if(audio.__tf13071RestorePromise)return audio.__tf13071RestorePromise;

    const run=()=>{
      const target=safeSavedTime(audio,state.time);
      try{audio.currentTime=target}catch(_){}
      audio.dataset.tf13071Restored='1';
      protectedState=null;
      directWrite({index,time:target});
      return previousPlay.apply(audio,args);
    };

    if(audio.readyState>=1)return run();
    audio.__tf13071RestorePromise=new Promise((resolve,reject)=>{
      let finished=false;
      const done=()=>{
        if(finished)return;finished=true;
        audio.removeEventListener('loadedmetadata',done);
        clearTimeout(timer);
        try{Promise.resolve(run()).then(resolve,reject)}catch(err){reject(err)}
      };
      const timer=setTimeout(done,2600);
      audio.addEventListener('loadedmetadata',done,{once:true});
    }).finally(()=>{try{delete audio.__tf13071RestorePromise}catch(_){audio.__tf13071RestorePromise=null}});
    return audio.__tf13071RestorePromise;
  }

  HTMLMediaElement.prototype.play=function(){
    if(isMusic(this))return playWithRestore(this,arguments);
    return previousPlay.apply(this,arguments);
  };

  const persist=()=>{if(lastActive)save(lastActive,true)};
  window.addEventListener('pagehide',persist,{capture:true});
  window.addEventListener('beforeunload',persist,{capture:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)persist()},true);
  document.addEventListener('freeze',persist,true);
  setInterval(persist,1200);
}

function addCss(){if(document.getElementById('tfV13051ProfileCss'))return;const l=document.createElement('link');l.id='tfV13051ProfileCss';l.rel='stylesheet';l.href='./taskflow-v13051-profile-compact.css?v=13051-20261004';document.head.appendChild(l)}
function addScript(id,src){if(document.getElementById(id))return;const s=document.createElement('script');s.id=id;s.src=src;s.async=false;document.body.appendChild(s)}
function boot(){addCss();addScript('tfV13051ProfileJs','./taskflow-v13051-profile-compact.js?v=13051-20261004');addScript('tfV13053SearchStabilityJs','./taskflow-v13053-search-stability.js?v=13053-20261004');addScript('tfV13053VisualPolishJs','./taskflow-v13053-visual-polish.js?v=13079-20261006');addScript('tfV13054SearchCompleteJs','./taskflow-v13054-search-complete.js?v=13054-20261004');addScript('tfV13062MentalistaSearchGuardJs','./taskflow-v13062-mentalista-search-guard.js?v=13062-20261005');addScript('tfV13063WelcomeJs','./taskflow-v13063-welcome.js?v=13083-20261006');addScript('tfV13064WelcomeEmphasisJs','./taskflow-v13064-welcome-emphasis.js?v=13064-20261005');addScript('tfV13065UiStabilityJs','./taskflow-v13065-ui-stability.js?v=13065-20261005');addScript('tfV13066MentalistStabilityJs','./taskflow-v13066-mentalist-stability.js?v=13067-20261005');addScript('tfV13073MissionSoundJs','./taskflow-v13073-mission-sound.js?v=13074-20261005');addScript('tfV13072HeadphonesJs','./taskflow-v13072-headphones.js?v=13072-20261005');addScript('tfV13078MindUnifiedStyleJs','./taskflow-v13078-mind-unified-style.js?v=13078-20261006');addScript('tfV13080ForceUpdateJs','./taskflow-v13080-force-update.js?v=13085-20261006');}

installAudioContinuityGuard();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
