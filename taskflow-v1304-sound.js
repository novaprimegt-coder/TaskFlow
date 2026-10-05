(function(){
'use strict';
if(window.__tfV1304Sound)return;window.__tfV1304Sound=true;

const STORAGE_KEY='taskflow_sound_enabled_v1304';
const ONLY_APP_KEY='taskflow_sound_only_in_app_v1305';
const PLAYBACK_KEY='taskflow_sound_playback_v13056';
const DB_NAME='taskflow_audio_internal_v13056';
const DB_VERSION=1;
const STORE_TRACKS='tracks';
const STORE_META='meta';
const META_PACK='audio_pack';
const CODE='SONIDO';
const TRACKS=[
  {id:'solo-leveling-motivacion',src:'./audio/Las%20MEJORES%20Frases%20de%20MOTIVACI%C3%93N%20de%20SOLO%20LEVELING%20para%20Escuchar%20%F0%9F%94%A5%F0%9F%92%AF(MP3_160K).mp3'},
  {id:'anime-motivacion',src:'./audio/Las%20MEJORES%20Frases%20de%20MOTIVACI%C3%93N%20del%20ANIME%20para%20ESCUCHAR%20%F0%9F%94%A5%F0%9F%92%AF(MP3_160K).mp3'}
];
const PACK_SIGNATURE=TRACKS.map(t=>t.id+'|'+t.src).join('||');

let enabled=true,onlyInApp=false,current=0,players=[],resumeTimer=0,saveTimer=0;
let previousOverflow='',panel=null,toggle=null,statusText=null,onlyToggle=null,onlyStateText=null;
let objectUrls=new Array(TRACKS.length).fill(null);
let audioReady=false,downloadRunning=false,downloadGate=null,downloadStatus=null,downloadBar=null,downloadRetry=null;

function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/\s+/g,' ').trim()}
function readEnabled(){try{const value=localStorage.getItem(STORAGE_KEY);return value===null?true:value!=='0'}catch(_){return true}}
function writeEnabled(value){try{localStorage.setItem(STORAGE_KEY,value?'1':'0')}catch(_){}}
function readOnlyInApp(){try{return localStorage.getItem(ONLY_APP_KEY)==='1'}catch(_){return false}}
function writeOnlyInApp(value){try{localStorage.setItem(ONLY_APP_KEY,value?'1':'0')}catch(_){}}
function canPlayNow(){return enabled&&audioReady&&(!onlyInApp||!document.hidden)}
function enforceVolume(audio){if(!audio)return;try{audio.volume=1;audio.muted=false}catch(_){}}
function setPlaybackState(state){try{if('mediaSession' in navigator)navigator.mediaSession.playbackState=state}catch(_){}}
function updatePanel(){
  if(toggle)toggle.checked=enabled;
  if(statusText){statusText.textContent=enabled?'ACTIVADO':'DESACTIVADO';statusText.classList.toggle('off',!enabled)}
  if(onlyToggle)onlyToggle.checked=onlyInApp;
  if(onlyStateText)onlyStateText.textContent=onlyInApp?'SOLO EN LA APP':'APP + SEGUNDO PLANO';
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

function openDb(){
  return new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)){reject(new Error('El almacenamiento interno no está disponible.'));return}
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(STORE_TRACKS))db.createObjectStore(STORE_TRACKS,{keyPath:'id'});
      if(!db.objectStoreNames.contains(STORE_META))db.createObjectStore(STORE_META,{keyPath:'key'});
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error||new Error('No se pudo abrir el almacenamiento interno.'));
  });
}
function idbGet(db,store,key){return new Promise((resolve,reject)=>{const tx=db.transaction(store,'readonly');const req=tx.objectStore(store).get(key);req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>reject(req.error)})}
function idbPut(db,store,value){return new Promise((resolve,reject)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).put(value);tx.oncomplete=()=>resolve(true);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('Escritura cancelada'))})}

function installStyle(){
  if(document.getElementById('tfV1304SoundStyle'))return;
  const style=document.createElement('style');style.id='tfV1304SoundStyle';style.textContent=`
#tfSoundV1304{position:fixed;inset:0;z-index:2147483644;display:none;align-items:center;justify-content:center;padding:14px;background:rgba(2,6,16,.84);backdrop-filter:blur(9px);overscroll-behavior:none}
#tfSoundV1304.open{display:flex}.tf1304-sheet{width:min(520px,100%);max-height:calc(100dvh - 28px);display:flex;flex-direction:column;border-radius:24px;border:1px solid rgba(78,205,196,.28);background:linear-gradient(160deg,#121d34 0%,#0a1120 58%,#070c17 100%);box-shadow:0 30px 90px rgba(0,0,0,.62);color:#fff;overflow:hidden}
.tf1304-head{display:flex;justify-content:space-between;gap:14px;padding:18px 18px 14px;border-bottom:1px solid rgba(255,255,255,.055);background:linear-gradient(180deg,rgba(20,31,54,.96),rgba(14,22,39,.92))}.tf1304-head small{color:#55e1d3;font-size:9px;font-weight:950;letter-spacing:.15em}.tf1304-head h2{margin:5px 0 4px;font-size:24px;line-height:1.08}.tf1304-head p{margin:0;color:#8f9db3;font-size:11px;line-height:1.45}
.tf1304-x{width:42px;height:42px;flex:0 0 42px;border-radius:13px;border:1px solid rgba(255,255,255,.11);background:rgba(255,255,255,.045);color:#fff;font-size:27px;line-height:1;display:grid;place-items:center}.tf1304-body{padding:16px;display:grid;gap:11px}.tf1304-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:15px 14px;border:1px solid rgba(255,255,255,.075);border-radius:15px;background:rgba(255,255,255,.028)}
.tf1304-row strong{display:block;font-size:13px}.tf1304-row small{display:block;margin-top:4px;color:#7e8da5;font-size:8.5px;line-height:1.45}.tf1304-row input{position:absolute;opacity:0;pointer-events:none}.tf1304-sw{width:50px;height:28px;border-radius:99px;background:#263247;position:relative;flex:0 0 50px}.tf1304-sw:after{content:"";position:absolute;width:22px;height:22px;left:3px;top:3px;border-radius:50%;background:#8998ad;transition:.18s}.tf1304-row input:checked+.tf1304-sw{background:rgba(50,221,201,.31)}.tf1304-row input:checked+.tf1304-sw:after{left:25px;background:#55e5d7;box-shadow:0 0 12px rgba(79,226,213,.32)}
.tf1304-state{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px 13px;border-radius:13px;background:rgba(139,99,255,.055);border:1px solid rgba(139,99,255,.12);font-size:9px;color:#8f9db3}.tf1304-state b{color:#55e1d3;font-size:9px;letter-spacing:.08em}.tf1304-state b.off{color:#ff9ca7}
#tfAudioGateV13056{position:fixed;inset:0;z-index:2147483646;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(2,6,16,.96);backdrop-filter:blur(12px)}#tfAudioGateV13056.open{display:flex}.tf-audio-gate-card{width:min(500px,100%);border-radius:24px;padding:24px;border:1px solid rgba(76,224,211,.3);background:linear-gradient(155deg,#101d34,#080f1d 62%,#060b14);box-shadow:0 30px 90px rgba(0,0,0,.7);text-align:center}.tf-audio-gate-card h2{margin:0 0 8px;font-size:23px}.tf-audio-gate-card p{margin:0;color:#9cabc0;font-size:12px;line-height:1.55}.tf-audio-gate-bar{height:8px;margin:20px 0 10px;border-radius:99px;background:#142036;overflow:hidden}.tf-audio-gate-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#45e1d2,#6be8c6,#9c78ff);transition:width .25s ease}.tf-audio-gate-status{font-size:11px;color:#c8d2e2}.tf-audio-gate-retry{display:none;margin:18px auto 0;padding:11px 18px;border-radius:12px;border:1px solid rgba(85,225,211,.3);background:#12303a;color:#66e8db;font-weight:850}.tf-audio-gate-retry.show{display:inline-flex}
@media(max-width:430px){#tfSoundV1304{padding:12px}.tf1304-head{padding:16px 15px 13px}.tf1304-body{padding:13px}.tf1304-head h2{font-size:22px}.tf-audio-gate-card{padding:21px 18px}}
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
function buildDownloadGate(){
  if(downloadGate)return;
  downloadGate=document.createElement('div');downloadGate.id='tfAudioGateV13056';
  downloadGate.innerHTML=`<section class="tf-audio-gate-card" role="dialog" aria-modal="true"><h2>Preparando música de TaskFlow</h2><p>La música se guardará dentro del sistema para reproducirse sin depender de una conexión rápida. Esta descarga es obligatoria cuando es la primera vez o cuando hay música nueva.</p><div class="tf-audio-gate-bar"><i></i></div><div class="tf-audio-gate-status">Comprobando archivos internos…</div><button type="button" class="tf-audio-gate-retry">Reintentar descarga</button></section>`;
  document.body.appendChild(downloadGate);downloadStatus=downloadGate.querySelector('.tf-audio-gate-status');downloadBar=downloadGate.querySelector('.tf-audio-gate-bar i');downloadRetry=downloadGate.querySelector('.tf-audio-gate-retry');downloadRetry.addEventListener('click',()=>syncAudioPack(true));
}
function showGate(text){buildDownloadGate();downloadGate.classList.add('open');if(text)downloadStatus.textContent=text;downloadRetry.classList.remove('show')}
function hideGate(){if(downloadGate)downloadGate.classList.remove('open')}
function gateProgress(done,total,label){if(!downloadGate)return;downloadBar.style.width=Math.max(0,Math.min(100,Math.round(done/Math.max(1,total)*100)))+'%';downloadStatus.textContent=label||('Música '+done+' de '+total+' preparada')}

async function requestPersistentStorage(){try{if(navigator.storage&&navigator.storage.persist)await navigator.storage.persist()}catch(_){}}
async function fetchTrackBlob(track,onProgress){
  const response=await fetch(track.src,{cache:'no-store',credentials:'same-origin'});
  if(!response.ok)throw new Error('No se pudo descargar la música ('+response.status+').');
  const total=Number(response.headers.get('content-length'))||0;
  if(response.body&&response.body.getReader){
    const reader=response.body.getReader();const chunks=[];let received=0;
    while(true){const part=await reader.read();if(part.done)break;chunks.push(part.value);received+=part.value.byteLength;if(onProgress)onProgress(received,total)}
    const blob=new Blob(chunks,{type:response.headers.get('content-type')||'audio/mpeg'});if(!blob.size)throw new Error('El archivo de música llegó vacío.');return blob;
  }
  const blob=await response.blob();if(!blob.size)throw new Error('El archivo de música llegó vacío.');if(onProgress)onProgress(blob.size,total||blob.size);return blob;
}
async function validateStoredPack(db){
  const meta=await idbGet(db,STORE_META,META_PACK);
  const missing=[];
  for(const track of TRACKS){const row=await idbGet(db,STORE_TRACKS,track.id);if(!row||row.signature!==track.src||!(row.blob instanceof Blob)||!row.blob.size)missing.push(track)}
  const signatureOk=!!(meta&&meta.signature===PACK_SIGNATURE);
  return {complete:signatureOk&&missing.length===0,missing,meta};
}
async function cleanupRemovedTracks(db){
  const valid=new Set(TRACKS.map(t=>t.id));
  return new Promise((resolve)=>{try{const tx=db.transaction(STORE_TRACKS,'readwrite');const store=tx.objectStore(STORE_TRACKS);const req=store.openCursor();req.onsuccess=()=>{const cursor=req.result;if(!cursor)return;if(!valid.has(cursor.key))cursor.delete();cursor.continue()};tx.oncomplete=()=>resolve();tx.onerror=()=>resolve()}catch(_){resolve()}})
}
async function syncAudioPack(force=false){
  if(downloadRunning)return;downloadRunning=true;audioReady=false;stopSound();showGate('Comprobando música guardada…');gateProgress(0,TRACKS.length,'Comprobando música guardada…');
  let db;
  try{
    await requestPersistentStorage();db=await openDb();const state=await validateStoredPack(db);
    if(state.complete&&!force){await loadPlayersFromDb(db);audioReady=true;gateProgress(TRACKS.length,TRACKS.length,'Música interna lista');hideGate();if(canPlayNow())startPlayback();return}
    const targets=force?TRACKS:state.missing;
    let completed=TRACKS.length-targets.length;
    for(const track of targets){
      const index=TRACKS.findIndex(t=>t.id===track.id);
      let lastPct=0;
      const blob=await fetchTrackBlob(track,(received,total)=>{if(!total)return;const pct=Math.floor(received/total*100);if(pct===lastPct)return;lastPct=pct;const overall=(completed+(pct/100));gateProgress(overall,TRACKS.length,'Descargando música '+(index+1)+' de '+TRACKS.length+' · '+pct+'%')});
      await idbPut(db,STORE_TRACKS,{id:track.id,signature:track.src,blob,size:blob.size,updatedAt:Date.now()});completed++;gateProgress(completed,TRACKS.length,'Música '+completed+' de '+TRACKS.length+' guardada internamente');
    }
    await cleanupRemovedTracks(db);await idbPut(db,STORE_META,{key:META_PACK,signature:PACK_SIGNATURE,tracks:TRACKS.map(t=>t.id),updatedAt:Date.now()});
    const verify=await validateStoredPack(db);if(!verify.complete)throw new Error('La verificación interna de la música no se completó.');
    await loadPlayersFromDb(db);audioReady=true;gateProgress(TRACKS.length,TRACKS.length,'Música interna lista');setTimeout(hideGate,250);if(canPlayNow())startPlayback();
  }catch(err){console.error('TaskFlow audio interno:',err);audioReady=false;showGate('La música debe descargarse antes de reproducirse. '+(err&&err.message?err.message:''));if(downloadRetry)downloadRetry.classList.add('show')}
  finally{try{if(db)db.close()}catch(_){}downloadRunning=false}
}
async function loadPlayersFromDb(db){
  objectUrls.forEach(url=>{if(url)try{URL.revokeObjectURL(url)}catch(_){}});objectUrls=new Array(TRACKS.length).fill(null);
  const savedTime=readPlayback();
  for(let i=0;i<TRACKS.length;i++){
    const row=await idbGet(db,STORE_TRACKS,TRACKS[i].id);if(!row||!(row.blob instanceof Blob)||!row.blob.size)throw new Error('Falta música interna '+(i+1)+'.');
    objectUrls[i]=URL.createObjectURL(row.blob);const audio=players[i];audio.src=objectUrls[i];audio.preload='auto';audio.load();
    if(i===current&&savedTime>0){const restore=()=>{try{if(!Number.isFinite(audio.duration)||savedTime<audio.duration)audio.currentTime=savedTime}catch(_){}};if(audio.readyState>=1)restore();else audio.addEventListener('loadedmetadata',restore,{once:true})}
  }
  await Promise.all(players.map(audio=>new Promise(resolve=>{if(audio.readyState>=3){resolve();return}const done=()=>resolve();audio.addEventListener('canplay',done,{once:true});setTimeout(done,4500)})));
}

function scheduleResume(delay){if(!canPlayNow())return;clearTimeout(resumeTimer);resumeTimer=setTimeout(()=>{if(canPlayNow())ensurePlaying()},Math.max(0,delay||0))}
async function playIndex(index){
  if(!canPlayNow()||!players.length)return false;current=((index%players.length)+players.length)%players.length;const audio=players[current];enforceVolume(audio);
  try{const p=audio.play();if(p&&typeof p.then==='function')await p;setPlaybackState('playing');return true}catch(_){scheduleResume(900);return false}
}
async function startPlayback(){if(!canPlayNow())return false;return playIndex(current)}
async function advance(from){if(!canPlayNow()||from!==current)return;savePlayback();try{players[from].currentTime=0}catch(_){}current=(from+1)%players.length;try{localStorage.setItem(PLAYBACK_KEY,JSON.stringify({index:current,time:0,at:Date.now()}))}catch(_){}await playIndex(current)}
function ensurePlaying(){if(!canPlayNow()||!players.length)return;const audio=players[current];enforceVolume(audio);if(audio.ended){advance(current);return}if(audio.paused)startPlayback();else setPlaybackState('playing')}
function stopSound(){clearTimeout(resumeTimer);savePlayback();players.forEach(audio=>{try{audio.pause()}catch(_){}});setPlaybackState('paused')}
function setEnabled(value,persist=true){enabled=!!value;if(persist)writeEnabled(enabled);updatePanel();if(canPlayNow())startPlayback();else stopSound()}
function setOnlyInApp(value,persist=true){onlyInApp=!!value;if(persist)writeOnlyInApp(onlyInApp);updatePanel();if(canPlayNow())startPlayback();else stopSound()}
function createPlayer(index){
  const audio=new Audio();audio.preload='auto';audio.autoplay=false;audio.loop=false;audio.controls=false;audio.playsInline=true;audio.setAttribute('playsinline','');audio.setAttribute('webkit-playsinline','');audio.setAttribute('data-taskflow-sound',String(index));enforceVolume(audio);
  audio.addEventListener('ended',()=>advance(index));audio.addEventListener('pause',()=>{if(canPlayNow()&&index===current&&!audio.ended)scheduleResume(500)});audio.addEventListener('volumechange',()=>{if(enabled)enforceVolume(audio)});return audio;
}
function initAudio(){
  readPlayback();players=TRACKS.map((_,index)=>createPlayer(index));
  if('mediaSession' in navigator){try{navigator.mediaSession.metadata=new MediaMetadata({title:'TaskFlow · Motivación',artist:'TaskFlow',album:'Reproducción interna'})}catch(_){}try{navigator.mediaSession.setActionHandler('play',()=>{if(canPlayNow())startPlayback()})}catch(_){}try{navigator.mediaSession.setActionHandler('pause',()=>{if(!onlyInApp)stopSound()})}catch(_){} }
  try{if(navigator.audioSession)navigator.audioSession.type='playback'}catch(_){}
}
function openPanel(){if(!panel)buildPanel();previousOverflow=document.body.style.overflow||'';document.body.style.overflow='hidden';panel.classList.add('open');panel.setAttribute('aria-hidden','false');updatePanel()}
function closePanel(){if(!panel)return;panel.classList.remove('open');panel.setAttribute('aria-hidden','true');document.body.style.overflow=previousOverflow}
function bindSearch(){document.addEventListener('taskflow:search-submit',event=>{const query=event&&event.detail&&event.detail.query;if(norm(query)!==CODE)return;openPanel()})}
function bindRecovery(){
  document.addEventListener('visibilitychange',()=>{if(onlyInApp&&document.hidden){stopSound();return}if(canPlayNow())scheduleResume(0)},false);
  const recover=()=>{if(canPlayNow())scheduleResume(0)};window.addEventListener('pageshow',recover,false);window.addEventListener('focus',recover,false);
  ['pointerdown','touchstart','click','keydown'].forEach(type=>document.addEventListener(type,()=>{if(canPlayNow()&&players[current]&&players[current].paused)startPlayback()},{capture:true,passive:true}));
  saveTimer=setInterval(()=>{if(audioReady)savePlayback()},5000);
}
async function ready(){
  enabled=readEnabled();onlyInApp=readOnlyInApp();installStyle();buildPanel();buildDownloadGate();initAudio();bindSearch();bindRecovery();updatePanel();await syncAudioPack(false);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
