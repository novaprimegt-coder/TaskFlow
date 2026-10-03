(function(){
'use strict';
if(window.__tfV1304Sound)return;window.__tfV1304Sound=true;

const STORAGE_KEY='taskflow_sound_enabled_v1304';
const TRACKS=[
  './audio/Las%20MEJORES%20Frases%20de%20MOTIVACI%C3%93N%20de%20SOLO%20LEVELING%20para%20Escuchar%20%F0%9F%94%A5%F0%9F%92%AF(MP3_160K).mp3',
  './audio/Las%20MEJORES%20Frases%20de%20MOTIVACI%C3%93N%20del%20ANIME%20para%20ESCUCHAR%20%F0%9F%94%A5%F0%9F%92%AF(MP3_160K).mp3'
];
const CODE='SONIDO';
let enabled=true,current=0,players=[],resumeTimer=0,watchdog=0,previousOverflow='',panel=null,toggle=null,statusText=null;
const failures=[0,0];

function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/\s+/g,' ').trim()}
function readEnabled(){try{const value=localStorage.getItem(STORAGE_KEY);return value===null?true:value!=='0'}catch(_){return true}}
function writeEnabled(value){try{localStorage.setItem(STORAGE_KEY,value?'1':'0')}catch(_){}}
function enforceVolume(audio){if(!audio)return;try{if(audio.volume!==1)audio.volume=1;if(audio.muted)audio.muted=false}catch(_){}}
function setPlaybackState(state){try{if('mediaSession' in navigator)navigator.mediaSession.playbackState=state}catch(_){}}
function updatePanel(){if(toggle)toggle.checked=enabled;if(statusText){statusText.textContent=enabled?'ACTIVADO':'DESACTIVADO';statusText.classList.toggle('off',!enabled)}}

function scheduleResume(delay){if(!enabled)return;clearTimeout(resumeTimer);resumeTimer=setTimeout(()=>{if(enabled)ensurePlaying()},Math.max(0,delay||0))}
function playIndex(index){
  if(!enabled||!players.length)return Promise.resolve(false);
  current=((index%players.length)+players.length)%players.length;
  const audio=players[current];
  enforceVolume(audio);
  try{audio.autoplay=true}catch(_){}
  let result;
  try{result=audio.play()}catch(_){scheduleResume(700);return Promise.resolve(false)}
  if(result&&typeof result.then==='function'){
    return result.then(()=>{failures[current]=0;setPlaybackState('playing');return true}).catch(()=>{scheduleResume(850);return false});
  }
  setPlaybackState('playing');return Promise.resolve(true);
}
function advance(from){
  if(!enabled||from!==current)return;
  const old=players[from];
  try{old.currentTime=0}catch(_){}
  playIndex((from+1)%players.length);
}
function recoverError(index){
  if(!enabled||index!==current)return;
  failures[index]++;
  const audio=players[index];
  if(failures[index]>=3){failures[index]=0;advance(index);return}
  setTimeout(()=>{if(!enabled||index!==current)return;try{audio.load()}catch(_){}playIndex(index)},900);
}
function ensurePlaying(){
  if(!enabled||!players.length)return;
  const audio=players[current];
  enforceVolume(audio);
  if(audio.ended){advance(current);return}
  if(audio.paused)playIndex(current);else setPlaybackState('playing');
}
function stopSound(){
  clearTimeout(resumeTimer);
  players.forEach(audio=>{try{audio.pause()}catch(_){}});
  setPlaybackState('paused');
}
function setEnabled(value,persist=true){
  enabled=!!value;
  if(persist)writeEnabled(enabled);
  updatePanel();
  if(enabled){players.forEach(enforceVolume);scheduleResume(0)}else stopSound();
}

function createPlayer(src,index){
  const audio=new Audio();
  audio.preload='auto';audio.autoplay=false;audio.loop=false;audio.controls=false;audio.playsInline=true;
  audio.setAttribute('playsinline','');audio.setAttribute('webkit-playsinline','');audio.setAttribute('data-taskflow-sound',String(index));
  audio.src=src;enforceVolume(audio);
  audio.addEventListener('ended',()=>advance(index));
  audio.addEventListener('pause',()=>{if(enabled&&index===current&&!audio.ended)scheduleResume(140)});
  audio.addEventListener('volumechange',()=>{if(enabled)enforceVolume(audio)});
  audio.addEventListener('error',()=>recoverError(index));
  audio.addEventListener('stalled',()=>{if(enabled&&index===current)scheduleResume(450)});
  return audio;
}
function initAudio(){
  players=TRACKS.map(createPlayer);
  players.forEach(audio=>{try{audio.load()}catch(_){}});
  if('mediaSession' in navigator){
    try{navigator.mediaSession.metadata=new MediaMetadata({title:'TaskFlow · Motivación',artist:'TaskFlow',album:'Reproducción continua'})}catch(_){}
    const keep=()=>{if(enabled)scheduleResume(0)};
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
  if(document.getElementById('tfSoundV1304')){panel=document.getElementById('tfSoundV1304');toggle=document.getElementById('tfSoundToggleV1304');statusText=document.getElementById('tfSoundStateV1304');updatePanel();return}
  panel=document.createElement('div');panel.id='tfSoundV1304';panel.setAttribute('aria-hidden','true');
  panel.innerHTML=`<section class="tf1304-sheet" role="dialog" aria-modal="true" aria-labelledby="tfSoundTitleV1304"><header class="tf1304-head"><div><small>CONFIGURACIÓN DEL SISTEMA</small><h2 id="tfSoundTitleV1304">Sonido</h2><p>Reproducción motivacional continua de TaskFlow.</p></div><button class="tf1304-x" type="button" data-tf-sound-close aria-label="Cerrar">×</button></header><div class="tf1304-body"><label class="tf1304-row"><div><strong>Sonido de TaskFlow</strong><small>Los dos audios se reproducen uno tras otro de forma continua. Volumen interno fijo al 100%.</small></div><input id="tfSoundToggleV1304" type="checkbox" aria-label="Activar o desactivar sonido"><span class="tf1304-sw" aria-hidden="true"></span></label><div class="tf1304-state"><span>Estado del sonido</span><b id="tfSoundStateV1304">ACTIVADO</b></div></div></section>`;
  document.body.appendChild(panel);
  toggle=document.getElementById('tfSoundToggleV1304');statusText=document.getElementById('tfSoundStateV1304');
  toggle.addEventListener('change',()=>setEnabled(toggle.checked,true));
  panel.querySelector('[data-tf-sound-close]').addEventListener('click',closePanel);
  panel.addEventListener('click',event=>{if(event.target===panel)closePanel()});
  updatePanel();
}
function openPanel(){
  if(!panel)buildPanel();
  previousOverflow=document.body.style.overflow||'';document.body.style.overflow='hidden';
  panel.classList.add('open');panel.setAttribute('aria-hidden','false');updatePanel();
}
function closePanel(){if(!panel)return;panel.classList.remove('open');panel.setAttribute('aria-hidden','true');document.body.style.overflow=previousOverflow}
function bindSearch(){
  const input=document.getElementById('searchInput');if(!input||input.dataset.tf1304SoundBound==='1')return;
  input.dataset.tf1304SoundBound='1';
  const trigger=event=>{
    if(norm(input.value)!==CODE)return false;
    event.preventDefault();event.stopImmediatePropagation();input.value='';
    const clear=document.getElementById('clearSearch');if(clear)clear.style.display='none';
    try{input.blur()}catch(_){}openPanel();
    queueMicrotask(()=>{try{input.dispatchEvent(new Event('input',{bubbles:true}))}catch(_){}});
    return true;
  };
  input.addEventListener('input',trigger,true);
  input.addEventListener('keydown',event=>{if(event.key==='Enter')trigger(event)},true);
}
function bindRecovery(){
  const recover=()=>{if(enabled)scheduleResume(80)};
  document.addEventListener('visibilitychange',recover,false);
  window.addEventListener('pageshow',recover,false);window.addEventListener('focus',recover,false);window.addEventListener('online',recover,false);
  ['pointerdown','touchstart','click','keydown'].forEach(type=>document.addEventListener(type,()=>{if(enabled&&players[current]&&players[current].paused)ensurePlaying()},{capture:true,passive:true}));
  watchdog=setInterval(()=>{if(enabled)ensurePlaying()},1500);
}
function ready(){
  enabled=readEnabled();installStyle();buildPanel();initAudio();bindSearch();bindRecovery();setEnabled(enabled,false);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
