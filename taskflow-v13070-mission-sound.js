(function(){
'use strict';
if(window.__tfV13070MissionSound)return;
window.__tfV13070MissionSound=true;

/* V130.7.0 · Notificación global de misión completada.
   - Se aplica a rutinas del sistema y a tareas/hábitos creados por el usuario.
   - La notificación usa ganancia reforzada para quedar claramente por encima de la música.
   - No modifica progreso, datos, rutinas ni configuración de sonido. */

const SRC='./audio/notificaciones/SONIDO%20DE%20NOTIFICACIONES.mp3';
const CACHE='taskflow-mission-sfx-v13070';
const INTENT_MS=2600;
const DEBOUNCE_MS=520;
let fallbackPlayer=null;
let objectUrl='';
let audioCtx=null;
let audioBuffer=null;
let lastPlayAt=0;
let intentUntil=0;

const rawSetItem=Storage.prototype.setItem;
const norm=value=>String(value||'').replace(/([a-z0-9])([A-Z])/g,'$1_$2').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,'_');
const completionKey=key=>/(^|_)(DONE|COMPLETED|COMPLETE|COMPLETION|FINISHED|HECHO|COMPLETADO|COMPLETADA|COMPLETADOS|COMPLETADAS|CUMPLIDO|CUMPLIDA|TERMINADO|TERMINADA)(_|$)/.test(norm(key));

function makeFallback(src){
  const audio=new Audio();
  audio.preload='auto';
  audio.autoplay=false;
  audio.loop=false;
  audio.controls=false;
  audio.playsInline=true;
  audio.setAttribute('playsinline','');
  audio.setAttribute('data-taskflow-mission-sfx','1');
  audio.src=src;
  try{audio.volume=1}catch(_){}
  try{audio.load()}catch(_){}
  return audio;
}

function ensureContext(){
  if(audioCtx)return audioCtx;
  try{
    const Ctx=window.AudioContext||window.webkitAudioContext;
    if(Ctx)audioCtx=new Ctx({latencyHint:'interactive'});
  }catch(_){audioCtx=null}
  return audioCtx;
}

async function prepare(){
  let src=SRC,blob=null;
  try{
    if('caches' in window){
      const cache=await caches.open(CACHE);
      let response=await cache.match(SRC);
      if(!response){
        const fresh=await fetch(SRC,{cache:'force-cache',credentials:'same-origin'});
        if(fresh.ok){await cache.put(SRC,fresh.clone());response=fresh}
      }
      if(response&&response.ok){
        blob=await response.blob();
        if(blob&&blob.size>0){objectUrl=URL.createObjectURL(blob);src=objectUrl}
      }
    }
    if(!blob){
      const response=await fetch(SRC,{cache:'force-cache',credentials:'same-origin'});
      if(response.ok)blob=await response.blob();
    }
  }catch(_){}
  fallbackPlayer=makeFallback(src);
  try{
    const ctx=ensureContext();
    if(ctx&&blob&&blob.size){
      const bytes=await blob.arrayBuffer();
      audioBuffer=await ctx.decodeAudioData(bytes.slice(0));
    }
  }catch(_){audioBuffer=null}
}

function playWebAudio(){
  const ctx=ensureContext();
  if(!ctx||!audioBuffer)return false;
  try{
    if(ctx.state==='suspended')ctx.resume().catch(()=>{});
    const source=ctx.createBufferSource();
    const gain=ctx.createGain();
    const compressor=ctx.createDynamicsCompressor();
    source.buffer=audioBuffer;
    gain.gain.value=2.15;
    compressor.threshold.value=-16;
    compressor.knee.value=16;
    compressor.ratio.value=3.5;
    compressor.attack.value=.002;
    compressor.release.value=.16;
    source.connect(gain);gain.connect(compressor);compressor.connect(ctx.destination);
    source.start(0);
    return true;
  }catch(_){return false}
}

function play(){
  const now=Date.now();
  if(now-lastPlayAt<DEBOUNCE_MS)return;
  lastPlayAt=now;
  if(playWebAudio())return;
  if(!fallbackPlayer)fallbackPlayer=makeFallback(SRC);
  try{fallbackPlayer.pause();fallbackPlayer.currentTime=0;fallbackPlayer.volume=1}catch(_){}
  try{const p=fallbackPlayer.play();if(p&&typeof p.catch==='function')p.catch(()=>{})}catch(_){}
}

function markIntent(){intentUntil=Date.now()+INTENT_MS}

document.addEventListener('pointerdown',markIntent,{capture:true,passive:true});
document.addEventListener('touchstart',markIntent,{capture:true,passive:true});
document.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '||event.code==='Space')markIntent()},true);

function markerValue(value){
  if(value===true)return 1;
  if(value===false||value==null)return 0;
  if(typeof value==='number')return Number.isFinite(value)&&value>0?1:0;
  if(typeof value==='string'){
    const v=norm(value);
    if(/^(TRUE|DONE|COMPLETED|COMPLETE|FINISHED|HECHO|COMPLETADO|COMPLETADA|CUMPLIDO|CUMPLIDA|TERMINADO|TERMINADA|1)$/.test(v))return 1;
    return 0;
  }
  if(Array.isArray(value))return value.length;
  if(typeof value==='object')return Object.keys(value).length;
  return 0;
}

function completionScore(value,key='',seen){
  if(value==null)return 0;
  if(!seen)seen=new WeakSet();
  if(typeof value!=='object')return completionKey(key)?markerValue(value):0;
  if(seen.has(value))return 0;seen.add(value);
  if(completionKey(key))return markerValue(value);
  let total=0;
  if(Array.isArray(value)){
    for(const item of value)total+=completionScore(item,'',seen);
    return total;
  }
  for(const k of Object.keys(value))total+=completionScore(value[k],k,seen);
  return total;
}

function parseScore(raw){
  if(raw==null||raw==='')return 0;
  try{return completionScore(JSON.parse(raw))}catch(_){return 0}
}

function eligibleStorageKey(key){
  const k=String(key||'');
  if(!k.startsWith('taskflow_'))return false;
  if(/sound|audio|playback|welcome|profile|firebase|global_reset|cloud_local_touch/i.test(k))return false;
  return true;
}

Storage.prototype.setItem=function(key,value){
  const active=this===localStorage&&eligibleStorageKey(key)&&Date.now()<=intentUntil;
  let before=0;
  if(active){try{before=parseScore(localStorage.getItem(key))}catch(_){}}
  const out=rawSetItem.apply(this,arguments);
  if(active){
    let after=0;try{after=parseScore(String(value))}catch(_){}
    if(after>before)queueMicrotask(play);
  }
  return out;
};

function excludedCheckbox(input){
  return !!input.closest('#tfSoundV1304,#tfManagerV117,#tfProfileOverlay,.tf120-overlay,[class*="settings" i],[class*="config" i]');
}

document.addEventListener('change',event=>{
  const input=event.target;
  if(!(input instanceof HTMLInputElement)||input.type!=='checkbox'||!input.checked||excludedCheckbox(input))return;
  markIntent();
  const semantic=input.closest('[class*="task" i],[class*="habit" i],[class*="mission" i],[class*="routine" i],li,article,label');
  if(semantic)setTimeout(play,40);
},true);

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',prepare,{once:true});else prepare();
window.addEventListener('pagehide',()=>{if(objectUrl)try{URL.revokeObjectURL(objectUrl)}catch(_){}},{once:true});
})();
