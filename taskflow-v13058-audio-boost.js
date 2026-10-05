(function(){
'use strict';
if(window.__tfV13058AudioBoost)return;window.__tfV13058AudioBoost=true;

/* V130.5.8 · Capa aislada de audio.
   - No modifica rutinas, búsqueda, perfil, datos ni diseño.
   - Acelera la descarga obligatoria iniciando en paralelo el siguiente audio.
   - Pausa únicamente la música de TaskFlow mientras se reproduce un video y la reanuda al salir/terminar. */

const TRACK_URLS=[
  new URL('./audio/Las%20MEJORES%20Frases%20de%20MOTIVACI%C3%93N%20de%20SOLO%20LEVELING%20para%20Escuchar%20%F0%9F%94%A5%F0%9F%92%AF(MP3_160K).mp3',location.href).href,
  new URL('./audio/Las%20MEJORES%20Frases%20de%20MOTIVACI%C3%93N%20del%20ANIME%20para%20ESCUCHAR%20%F0%9F%94%A5%F0%9F%92%AF(MP3_160K).mp3',location.href).href
];
const TRACK_SET=new Set(TRACK_URLS);
const nativeFetch=window.fetch.bind(window);
const nativePlay=HTMLMediaElement.prototype.play;
const bufferedJobs=new Map();
const knownTaskFlowAudio=new Set();
const activeVideos=new Set();
let videoWatch=0,resumeAfterVideo=0;

function absoluteUrl(input){
  try{return new URL(typeof input==='string'?input:(input&&input.url)||'',location.href).href}catch(_){return ''}
}
function bufferResponse(url){
  return nativeFetch(url,{cache:'no-store',credentials:'same-origin'}).then(async response=>{
    const buffer=await response.arrayBuffer();
    const headers=new Headers(response.headers);
    if(!headers.get('content-length'))headers.set('content-length',String(buffer.byteLength));
    return {buffer,status:response.status,statusText:response.statusText,headers};
  });
}
function makeResponse(data){
  return new Response(data.buffer.slice(0),{status:data.status,statusText:data.statusText,headers:new Headers(data.headers)});
}
function prefetchOtherTracks(requestedUrl){
  for(const url of TRACK_URLS){
    if(url===requestedUrl||bufferedJobs.has(url))continue;
    bufferedJobs.set(url,bufferResponse(url).catch(()=>null));
  }
}

/* Mantiene el primer archivo como descarga visible/progresiva y descarga los demás
   simultáneamente. Cuando TaskFlow pide el siguiente, normalmente ya está listo. */
window.fetch=function(input,init){
  const url=absoluteUrl(input);
  if(!TRACK_SET.has(url))return nativeFetch(input,init);
  if(bufferedJobs.has(url)){
    return bufferedJobs.get(url).then(data=>data?makeResponse(data):nativeFetch(input,init));
  }
  prefetchOtherTracks(url);
  return nativeFetch(input,init);
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
  if(!activeVideos.size){if(videoWatch){clearInterval(videoWatch);videoWatch=0}}
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
