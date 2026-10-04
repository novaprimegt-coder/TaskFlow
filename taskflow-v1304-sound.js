(function(){
'use strict';
if(window.__tfV1304Sound)return;window.__tfV1304Sound=true;

const STORAGE_KEY='taskflow_sound_enabled_v1304';
const ONLY_APP_KEY='taskflow_sound_only_in_app_v1305';
const PLAYBACK_KEY='taskflow_sound_playback_v13055';
const CACHE_NAME='taskflow-audio-local-v13055';
const TRACKS=[
  './audio/Las%20MEJORES%20Frases%20de%20MOTIVACI%C3%93N%20de%20SOLO%20LEVELING%20para%20Escuchar%20%F0%9F%94%A5%F0%9F%92%AF(MP3_160K).mp3',
  './audio/Las%20MEJORES%20Frases%20de%20MOTIVACI%C3%93N%20del%20ANIME%20para%20ESCUCHAR%20%F0%9F%94%A5%F0%9F%92%AF(MP3_160K).mp3'
];
const CODE='SONIDO';

let enabled=true,onlyInApp=false,current=0,players=[],resumeTimer=0,watchdog=0,saveTimer=0;
let previousOverflow='',panel=null,toggle=null,statusText=null,onlyToggle=null,onlyStateText=null;
let objectUrls=new Array(TRACKS.length).fill(null);
let preparePromises=new Array(TRACKS.length).fill(null);
let prepared=new Array(TRACKS.length).fill(false);
let starting=false;

function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/\s+/g,' ').trim()}
function readEnabled(){try{const value=localStorage.getItem(STORAGE_KEY);return value===null?true:value!=='0'}catch(_){return true}}
function writeEnabled(value){try{localStorage.setItem(STORAGE_KEY,value?'1':'0')}catch(_){}}
function readOnlyInApp(){try{return localStorage.getItem(ONLY_APP_KEY)==='1'}catch(_){return false}}
function writeOnlyInApp(value){try{localStorage.setItem(ONLY_APP_KEY,value?'1':'0')}catch(_){}}
function canPlayNow(){return enabled&&(!onlyInApp||!document.hidden)}
function enforceVolume(audio){if(!audio)return;try{audio.volume=1;audio.muted=false}catch(_){}}
function setPlaybackState(state){try{if('mediaSession' in navigator)navigator.mediaSession.playbackState=state}catch(_){}}
function updatePanel(){
  if(toggle)toggle.checked=enabled;
  if(statusText){statusText.textContent=enabled?'ACTIVADO':'DESACTIVADO';statusText.classList.toggle('off',!enabled)}
  if(onlyToggle)onlyToggle.checked=onlyInApp;
  if(onlyStateText){onlyStateText.textContent=onlyInApp?'SOLO EN LA APP':'APP + SEGUNDO PLANO';onlyStateText.classList.toggle('off',false)}
}
function readPlayback(){
  try{
    const data=JSON.parse(localStorage.getItem(PLAYBACK_KEY)||'{}');
    const index=Number(data.index),time=Number(data.time);
    if(Number.isFinite(index)&&index>=0&&index<TRACKS.length)current=index;
    return Number.isFinite(time)&&time>=0?time:0;
  }catch(_){return 0}
}
function savePlayback(){
  const audio=players[current];if(!audio)return;
  let time=0;try{time=Number(audio.currentTime)||0}catch(_){}
  try{localStorage.setItem(PLAYBACK_KEY,JSON.stringify({index:current,time,at:Date.now()}))}catch(_){}
}
async function getLocalResponse(index){
  const url=TRACKS[index];
  if(!('caches' in window))return null;
  const cache=await caches.open(CACHE_NAME);
  let response=await cache.match(url,{ignoreSearch:true});
  if(response&&response.ok)return response;
  const fetched=await fetch(url,{cache:'force-cache',credentials:'same-origin'});
  if(!fetched.ok)throw new Error('Audio '+(index+1)+' HTTP '+fetched.status);
  try{await cache.put(url,fetched.clone())}catch(_){}
  return fetched;
}
async function prepareTrack(index){
  if(prepared[index]&&objectUrls[index])return objectUrls[index];
  if(preparePromises[index])return preparePromises[index];
  preparePromises[index]=(async()=>{
    try{
      let response=await getLocalResponse(index);
      if(!response){
        response=await fetch(TRACKS[index],{cache:'force-cache',credentials:'same-origin'});
        if(!response.ok)throw new Error('Audio '+(index+1)+' HTTP '+response.status);
      }
      const blob=await response.blob();
      if(!blob||!blob.size)throw new Error('Archivo de audio vacío');
      if(objectUrls[index]){try{URL.revokeObjectURL(objectUrls[index])}catch(_){}}
      objectUrls[index]=URL.createObjectURL(blob);
      const audio=players[index];
      if(audio){
        const saved=(index===current)?readPlayback():0;
        audio.src=objectUrls[index];audio.preload='auto';
        try{audio.load()}catch(_){}
        if(saved>0){
          const restore=()=>{try{if(!Number.isFinite(audio.duration)||saved<audio.duration)audio.currentTime=saved}catch(_){}};
          if(audio.readyState>=1)restore();else audio.addEventListener('loadedmetadata',restore,{once:true});
        }
      }
      prepared[index]=true;
      return objectUrls[index];
    }catch(err){
      console.warn('TaskFlow audio cache:',err);
      const audio=players[index];
      if(audio&&!audio.src){audio.src=TRACKS[index];audio.preload='auto';try{audio.load()}catch(_){}}
      prepared[index]=true;
      return TRACKS[index];
    }finally{preparePromises[index]=null}
  })();
  return preparePromises[index];
}
async function primeNext(){const next=(current+1)%TRACKS.length;try{await prepareTrack(next)}catch(_){}}
function scheduleResume(delay){if(!canPlayNow())return;clearTimeout(resumeTimer);resumeTimer=setTimeout(()=>{if(canPlayNow())ensurePlaying()},Math.max(0,delay||0))}
async function playIndex(index){
  if(!canPlayNow()||!players.length)return false;
  current=((index%players.length)+players.length)%players.length;
  const audio=players[current];
  if(!audio.src)await prepareTrack(current);
  if(!canPlayNow())return false;
  enforceVolume(audio);
  try{const p=audio.play();if(p&&typeof p.then==='function')await p;setPlaybackState('playing');primeNext();return true}catch(_){scheduleResume(1200);return false}
}
async function startSmooth(){if(starting||!canPlayNow()||!players.length)return;starting=true;try{await prepareTrack(current);await playIndex(current);primeNext()}finally{starting=false}}
async function advance(from){
  if(!canPlayNow()||from!==current)return;
  savePlayback();try{players[from].currentTime=0}catch(_){}
  current=(from+1)%players.length;
  try{localStorage.setItem(PLAYBACK_KEY,JSON.stringify({index:current,time:0,at:Date.now()}))}catch(_){}
  await prepareTrack(current);await playIndex(current);
}
function ensurePlaying(){if(!canPlayNow()||!players.length)return;const audio=players[current];enforceVolume(audio);if(audio.ended){advance(current);return}if(audio.paused)startSmooth();else setPlaybackState('playing')}
function stopSound(){clearTimeout(resumeTimer);savePlayback();players.forEach(audio=>{try{audio.pause()}catch(_){}});setPlaybackState('paused')}
function setEnabled(value,persist=true){enabled=!!value;if(persist)writeEnabled(enabled);updatePanel();if(canPlayNow())startSmooth();else stopSound()}
function setOnlyInApp(value,persist=true){onlyInApp=!!value;if(persist)writeOnlyInApp(onlyInApp);updatePanel();if(canPlayNow())startSmooth();else stopSound()}
function createPlayer(index){
  const audio=new Audio();audio.preload='auto';audio.autoplay=false;audio.loop=false;audio.controls=false;audio.playsInline=true;
  audio.setAttribute('playsinline','');audio.setAttribute('webkit-playsinline','');audio.setAttribute('data-taskflow-sound',String(index));enforceVolume(audio);
  audio.addEventListener('ended',()=>advance(index));
  audio.addEventListener('pause',()=>{if(canPlayNow()&&index===current&&!audio.ended)scheduleResume(700)});
  audio.addEventListener('volumechange',()=>{if(enabled)enforceVolume(audio)});
  audio.addEventListener('stalled',()=>{if(canPlayNow()&&index===current)scheduleResume(1400)});
  audio.addEventListener('waiting',()=>{if(canPlayNow()&&index===current&&objectUrls[index])scheduleResume(900)});
  return audio;
}
function initAudio(){
  readPlayback();players=TRACKS.map((_,index)=>createPlayer(index));
  if('mediaSession' in navigator){
    try{navigator.mediaSession.metadata=new MediaMetadata({title:'TaskFlow · Motivación',artist:'TaskFlow',album:'Reproducción continua'})}catch(_){}
    const keep=()=>{if(canPlayNow())scheduleResume(0)};
    ['play','pause','stop'].forEach(action=>{try{navigator.mediaSession.setActionHandler(action,keep)}catch(_){}});
    ['seekbackward','seekforward','seekto','previoustrack','nexttrack'].forEach(action=>{try{navigator.mediaSession.setActionHandler(action,()=>{})}catch(_){}});
  }
  try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(_){}
}
function installStyle(){
  if(document.getElementById('tfV1304SoundStyle'))return;
  const style=document.createElement('style');style.id='tfV1304SoundStyle';style.textContent=`
#tfSoundV1304{position:fixed;inset:0;z-index:2147483644;display:none;align-items:center;justify-content:center;padding:14px;background:rgba(2,6,16,.84);backdrop-filter:blur(9px);overscroll-behavior:none}
#tfSoundV1304.open{display:flex}
.tf1304-sheet{width:min(520px,100%);max-height:calc(100dvh - 28px);display:flex;flex-direction:column;border-radius:24px;border:1px solid rgba(78,205,196,.28);background:linear-gradient(160deg,#121d34 0%,#0a1120 58%,#070c17 100%);box-shadow:0 30px 90px rgba(0,0,0,.62);color:#fff;overflow:hidden}
.tf1304-head{display:flex;justify-content:space-between;gap:14px;padding:18px 18px 14px;border-bottom:1px solid rgba(255,255,255,.055);background:linear-gradient(180deg,rgba(20,31,54,.96),rgba(14,22,39,.92))}
.tf1304-head small{color:#55e1d3;font-size:9px;font-weight:950;letter-spacing:.15em}.tf1304-head h2{margin:5px 0 4px;font-size:24px;line-height:1.08}.tf1304-head p{margin:0;color:#8f9db3;font-size:11px;line-height:1.45}
.tf1304-x{width:42px;height:42px;flex:0 0 42px;border-radius:13px;border:1px solid rgba(255,255,255,.11);background:rgba(255,255,255,.045);color:#fff;font-size:27px;line-height:1;display:grid;place-items:center}
.tf1304-body{padding:16px;display:grid;gap:11px}.tf1304-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:15px 14px;border:1px solid rgba(255,255,255,.075);border-radius:15px;background:rgba(255,255,255,.028)}
.tf1304-row strong{display:block;font-size:13px}.tf1304-row small{display:block;margin-top:4px;color:#7e8da5;font-size:8.5px;line-height:1.45}.tf1304-row input{position:absolute;opacity:0;pointer-events:none}
.tf1304-sw{width:50px;height:28px;border-radius:99px;background:#263247;position:relative;flex:0 0 50px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.025)}.tf1304-sw:after{content:"";position:absolute;width:22px;height:22px;left:3px;top:3px;border-radius:50%;background:#8998ad;transition:.18s}
.tf1304-row input:checked+.tf1304-sw{background:rgba(50,221,201,.31);box-shadow:inset 0 0 0 1px rgba(82,232,217,.16)}.tf1304-row input:checked+.tf1304-sw:after{left:25px;background:#55e5d7;box-shadow:0 0 12px rgba(79,226,213,.32)}
.tf1304-state{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 13px;border-radius:13px;background:rgba(139,99,255,.055);border:1px solid rgba(139,99,255,.12);font-size:9px;color:#8f9db3}.tf1304-state b{color:#55e1d3;font-size:9px;letter-spacing:.08em}.tf1304-state b.off{color:#ff9ca7}
@media(max-width:430px){#tfSoundV1304{padding:12px}.tf1304-head{padding:16px 15px 13px}.tf1304-body{padding:13px}.tf1304-head h2{font-size:22px}}
`;
  document.head.appendChild(style);
}
function buildPanel(){
  if(document.getElementById('tfSoundV1304')){panel=document.getElementById('tfSoundV1304');toggle=document.getElementById('tfSoundToggleV1304');statusText=document.getElementById('tfSoundStateV1304');onlyToggle=document.getElementById('tfSoundOnlyAppV1305');onlyStateText=document.getElementById('tfSoundOnlyStateV1305');updatePanel();return}
  panel=document.createElement('div');panel.id='tfSoundV1304';panel.setAttribute('aria-hidden','true');
  panel.innerHTML=`<section class="tf1304-sheet" role="dialog" aria-modal="true" aria-labelledby="tfSoundTitleV1304"><header class="tf1304-head"><div><small>CONFIGURACIÓN DEL SISTEMA</small><h2 id="tfSoundTitleV1304">Sonido</h2><p>Controla cómo se reproduce la música de TaskFlow.</p></div><button class="tf1304-x" type="button" data-tf-sound-close aria-label="Cerrar">×</button></header><div class="tf1304-body"><label class="tf1304-row"><div><strong>Música de TaskFlow</strong><small>Activa o desactiva la reproducción continua de música.</small></div><input id="tfSoundToggleV1304" type="checkbox" aria-label="Activar o desactivar música"><span class="tf1304-sw" aria-hidden="true"></span></label><label class="tf1304-row"><div><strong>Solo dentro de la aplicación</strong><small>Activado: la música se detiene al salir de TaskFlow. Desactivado: puede continuar en segundo plano.</small></div><input id="tfSoundOnlyAppV1305" type="checkbox" aria-label="Reproducir solo dentro de la aplicación"><span class="tf1304-sw" aria-hidden="true"></span></label><div class="tf1304-state"><span>Estado de la música</span><b id="tfSoundStateV1304">ACTIVADO</b></div><div class="tf1304-state"><span>Modo de reproducción</span><b id="tfSoundOnlyStateV1305">APP + SEGUNDO PLANO</b></div></div></section>`;
  document.body.appendChild(panel);toggle=document.getElementById('tfSoundToggleV1304');statusText=document.getElementById('tfSoundStateV1304');onlyToggle=document.getElementById('tfSoundOnlyAppV1305');onlyStateText=document.getElementById('tfSoundOnlyStateV1305');
  toggle.addEventListener('change',()=>setEnabled(toggle.checked,true));onlyToggle.addEventListener('change',()=>setOnlyInApp(onlyToggle.checked,true));panel.querySelector('[data-tf-sound-close]').addEventListener('click',closePanel);panel.addEventListener('click',event=>{if(event.target===panel)closePanel()});updatePanel();
}
function openPanel(){if(!panel)buildPanel();previousOverflow=document.body.style.overflow||'';document.body.style.overflow='hidden';panel.classList.add('open');panel.setAttribute('aria-hidden','false');updatePanel()}
function closePanel(){if(!panel)return;panel.classList.remove('open');panel.setAttribute('aria-hidden','true');document.body.style.overflow=previousOverflow}
function bindSearch(){document.addEventListener('taskflow:search-submit',event=>{const query=event&&event.detail&&event.detail.query;if(norm(query)!==CODE)return;openPanel()})}
function bindRecovery(){
  document.addEventListener('visibilitychange',()=>{if(onlyInApp&&document.hidden){stopSound();return}if(canPlayNow())scheduleResume(0)},false);
  const recover=()=>{if(canPlayNow())scheduleResume(0)};window.addEventListener('pageshow',recover,false);window.addEventListener('focus',recover,false);window.addEventListener('online',recover,false);
  ['pointerdown','touchstart','click','keydown'].forEach(type=>document.addEventListener(type,()=>{if(canPlayNow()&&players[current]&&players[current].paused)ensurePlaying()},{capture:true,passive:true}));
  watchdog=setInterval(()=>{if(canPlayNow())ensurePlaying()},8000);saveTimer=setInterval(()=>{if(canPlayNow())savePlayback()},5000);window.addEventListener('pagehide',savePlayback,false);window.addEventListener('beforeunload',savePlayback,false);
}
function ready(){enabled=readEnabled();onlyInApp=readOnlyInApp();installStyle();buildPanel();initAudio();bindSearch();bindRecovery();updatePanel();if(canPlayNow())startSmooth();else stopSound()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();