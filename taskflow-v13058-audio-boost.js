(function(){
'use strict';
if(window.__tfV13058AudioBoost)return;window.__tfV13058AudioBoost=true;

/* V130.5.9 · Capa aislada de audio.
   - No modifica rutinas, búsqueda, perfil, datos ni diseño.
   - Acelera la descarga obligatoria usando descargas por rangos concurrentes cuando el servidor lo permite.
   - Mantiene un único flujo final para que V130.5.7 siga validando y guardando la música completa en IndexedDB.
   - Pausa únicamente la música de TaskFlow mientras se reproduce un video y la reanuda al salir/terminar. */

const TRACKS=[
  {url:new URL('./audio/Las%20MEJORES%20Frases%20de%20MOTIVACI%C3%93N%20de%20SOLO%20LEVELING%20para%20Escuchar%20%F0%9F%94%A5%F0%9F%92%AF(MP3_160K).mp3',location.href).href,size:12698636},
  {url:new URL('./audio/Las%20MEJORES%20Frases%20de%20MOTIVACI%C3%93N%20del%20ANIME%20para%20ESCUCHAR%20%F0%9F%94%A5%F0%9F%92%AF(MP3_160K).mp3',location.href).href,size:14697486}
];
const TRACK_MAP=new Map(TRACKS.map(track=>[track.url,track]));
const nativeFetch=window.fetch.bind(window);
const nativePlay=HTMLMediaElement.prototype.play;
const knownTaskFlowAudio=new Set();
const activeVideos=new Set();
let videoWatch=0,resumeAfterVideo=0;

function absoluteUrl(input){
  try{return new URL(typeof input==='string'?input:(input&&input.url)||'',location.href).href}catch(_){return ''}
}
function networkConcurrency(){
  try{
    const c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
    const type=String(c&&c.effectiveType||'').toLowerCase();
    if(type==='slow-2g'||type==='2g')return 2;
    if(type==='3g')return 4;
    return 6;
  }catch(_){return 6}
}
function fastInit(extra){
  const out=Object.assign({cache:'default',credentials:'same-origin'},extra||{});
  try{out.priority='high'}catch(_){}
  return out;
}
async function fetchRange(url,start,end,retries){
  let lastError=null;
  for(let attempt=0;attempt<=retries;attempt++){
    try{
      const response=await nativeFetch(url,fastInit({headers:{Range:'bytes='+start+'-'+end}}));
      if(response.status!==206)throw new Error('El servidor no entregó el rango solicitado.');
      const range=response.headers.get('content-range')||'';
      if(range&&range.indexOf('bytes '+start+'-')!==0)throw new Error('El rango recibido no coincide.');
      return response;
    }catch(err){lastError=err;if(attempt<retries)await new Promise(r=>setTimeout(r,120*(attempt+1)))}
  }
  throw lastError||new Error('No se pudo descargar un segmento de audio.');
}
async function streamResponseBody(response,controller,expectedBytes){
  let received=0;
  if(response.body&&response.body.getReader){
    const reader=response.body.getReader();
    while(true){
      const part=await reader.read();
      if(part.done)break;
      if(part.value&&part.value.byteLength){received+=part.value.byteLength;controller.enqueue(part.value)}
    }
  }else{
    const buffer=await response.arrayBuffer();
    received=buffer.byteLength;
    controller.enqueue(new Uint8Array(buffer));
  }
  if(received!==expectedBytes)throw new Error('Segmento de audio incompleto.');
}
async function fastTrackResponse(track){
  const total=track.size;
  const parts=Math.max(2,Math.min(networkConcurrency(),Math.ceil(total/(2*1024*1024))));
  const segmentSize=Math.ceil(total/parts);
  const firstEnd=Math.min(total-1,segmentSize-1);

  /* El primer pedido también funciona como prueba de Range. Si Pages no admite
     rangos, ese mismo response 200 ya contiene el archivo completo y se usa sin duplicarlo. */
  const first=await nativeFetch(track.url,fastInit({headers:{Range:'bytes=0-'+firstEnd}}));
  if(first.status!==206){return first}

  const ranges=[];
  for(let i=0;i<parts;i++){
    const start=i*segmentSize;
    if(start>=total)break;
    const end=Math.min(total-1,start+segmentSize-1);
    ranges.push({start,end,length:end-start+1});
  }
  const jobs=ranges.map((range,index)=>index===0?Promise.resolve(first):fetchRange(track.url,range.start,range.end,2));
  const stream=new ReadableStream({
    async start(controller){
      try{
        for(let i=0;i<jobs.length;i++){
          const response=await jobs[i];
          await streamResponseBody(response,controller,ranges[i].length);
        }
        controller.close();
      }catch(err){controller.error(err)}
    }
  });
  return new Response(stream,{status:200,statusText:'OK',headers:{'Content-Type':'audio/mpeg','Content-Length':String(total),'Cache-Control':'no-store','X-TaskFlow-Download':'parallel-range'}});
}

/* Solo intercepta los dos MP3 de TaskFlow. Todo el resto del sistema conserva fetch intacto. */
window.fetch=function(input,init){
  const url=absoluteUrl(input);
  const track=TRACK_MAP.get(url);
  if(!track)return nativeFetch(input,init);
  return fastTrackResponse(track).catch(()=>nativeFetch(input,Object.assign({},init||{},{cache:'default',credentials:'same-origin'})));
};

function isTaskFlowMusic(media){
  return media instanceof HTMLAudioElement&&media.getAttribute('data-taskflow-sound')!==null;
}
function musicIsEnabled(){
  try{return localStorage.getItem('taskflow_sound_enabled_v1304')!=='0'}catch(_){return true}
}
function onlyInsideApp(){
  try{return localStorage.getItem('taskflow_sound_only_in_app_v1305')==='1'}catch(_){return false}
}
function savedMusicIndex(){
  try{
    const data=JSON.parse(localStorage.getItem('taskflow_sound_playback_v13057')||'{}');
    const index=Number(data.index);return Number.isFinite(index)&&index>=0?index:0;
  }catch(_){return 0}
}
function videoStillPresent(video){
  if(!video||!video.isConnected||video.ended)return false;
  if(!video.paused)return true;
  try{
    const style=getComputedStyle(video),rect=video.getBoundingClientRect();
    if(style.display==='none'||style.visibility==='hidden'||Number(style.opacity)===0)return false;
    if(rect.width<2||rect.height<2)return false;
  }catch(_){return false}
  return true;
}
function pauseTaskFlowMusic(){
  clearTimeout(resumeAfterVideo);
  for(const audio of knownTaskFlowAudio){try{if(!audio.paused)audio.pause()}catch(_){}}
}
function resumeTaskFlowMusic(){
  clearTimeout(resumeAfterVideo);
  if(activeVideos.size||!musicIsEnabled()||(onlyInsideApp()&&document.hidden))return;
  const index=savedMusicIndex();
  let target=null;
  for(const audio of knownTaskFlowAudio){
    if(Number(audio.getAttribute('data-taskflow-sound'))===index){target=audio;break}
  }
  if(!target){for(const audio of knownTaskFlowAudio){target=audio;break}}
  if(!target||!target.paused||target.ended)return;
  try{const result=nativePlay.call(target);if(result&&typeof result.catch==='function')result.catch(()=>{})}catch(_){}
}
function scheduleVideoResume(delay){
  clearTimeout(resumeAfterVideo);
  resumeAfterVideo=setTimeout(()=>{reconcileVideos();if(!activeVideos.size)resumeTaskFlowMusic()},Math.max(80,delay||180));
}
function reconcileVideos(){
  for(const video of Array.from(activeVideos))if(!videoStillPresent(video))activeVideos.delete(video);
  if(!activeVideos.size&&videoWatch){clearInterval(videoWatch);videoWatch=0}
}
function startVideoWatch(){
  if(videoWatch)return;
  videoWatch=setInterval(()=>{
    const had=activeVideos.size;reconcileVideos();
    if(had&&!activeVideos.size)resumeTaskFlowMusic();
  },450);
}
function markVideoActive(video){
  if(!(video instanceof HTMLVideoElement))return;
  activeVideos.add(video);startVideoWatch();pauseTaskFlowMusic();
}
function releaseVideo(video,force){
  if(!(video instanceof HTMLVideoElement))return;
  if(force||!videoStillPresent(video))activeVideos.delete(video);
  if(!activeVideos.size)scheduleVideoResume(160);
}

/* Bloquea cualquier intento automático de reanudar la música mientras un video
   está activo. No toca el audio del propio video. */
HTMLMediaElement.prototype.play=function(){
  if(isTaskFlowMusic(this)){
    knownTaskFlowAudio.add(this);
    if(activeVideos.size)return Promise.resolve();
  }
  return nativePlay.apply(this,arguments);
};

document.addEventListener('play',event=>{if(event.target instanceof HTMLVideoElement)markVideoActive(event.target)},true);
document.addEventListener('playing',event=>{if(event.target instanceof HTMLVideoElement)markVideoActive(event.target)},true);
document.addEventListener('ended',event=>{if(event.target instanceof HTMLVideoElement)releaseVideo(event.target,true)},true);
document.addEventListener('emptied',event=>{if(event.target instanceof HTMLVideoElement)releaseVideo(event.target,true)},true);
document.addEventListener('abort',event=>{if(event.target instanceof HTMLVideoElement)releaseVideo(event.target,true)},true);
document.addEventListener('pause',event=>{
  if(!(event.target instanceof HTMLVideoElement))return;
  const video=event.target;
  setTimeout(()=>releaseVideo(video,false),420);
},true);
document.addEventListener('fullscreenchange',()=>setTimeout(()=>{reconcileVideos();if(!activeVideos.size)resumeTaskFlowMusic()},120),true);
document.addEventListener('webkitfullscreenchange',()=>setTimeout(()=>{reconcileVideos();if(!activeVideos.size)resumeTaskFlowMusic()},120),true);
window.addEventListener('pageshow',()=>{reconcileVideos();if(!activeVideos.size)scheduleVideoResume(120)},false);
})();
