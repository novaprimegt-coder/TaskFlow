(function(){
'use strict';
if(window.__tfV13065UiStability)return;
window.__tfV13065UiStability=true;

/* V130.6.5 · Solo tres ajustes solicitados:
   1) lupa del buscador al tamaño visual del botón X;
   2) elimina por completo el botón de enviar, dejando únicamente X;
   3) elimina parpadeos visuales durante la apertura de Mentalista. */

const STYLE_ID='tfV13065UiStabilityStyle';
let mentalTimer=0;

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
.search-container>i.fa-search,
.search-container .search-icon,
.tf13053-loupe{
  width:42px!important;
  height:42px!important;
  min-width:42px!important;
  min-height:42px!important;
  flex:0 0 42px!important;
  display:grid!important;
  place-items:center!important;
  font-size:30px!important;
  line-height:1!important;
  color:#50e5da!important;
  opacity:1!important;
  margin:0!important;
  filter:drop-shadow(0 0 8px rgba(80,229,218,.34))!important;
}
.search-container>i.fa-search:before{font-size:30px!important;line-height:1!important}
.tf13053-loupe svg,.search-container .search-icon svg{width:30px!important;height:30px!important;display:block!important}
.tf13053-search-btn.submit{display:none!important}
#tfSearchActionsV13053{gap:0!important}

html.tf13065-mental-opening #windowContainer,
html.tf13065-mental-opening #windowContainer *{
  animation:none!important;
  transition:none!important;
}
html.tf13065-mental-opening #windowContainer.window-container.open{
  opacity:1!important;
  visibility:visible!important;
}
html.tf13065-mental-opening #windowContainer.window-container.open>#windowContent{
  opacity:1!important;
  visibility:visible!important;
}
@media(max-width:430px){
  .search-container>i.fa-search,
  .search-container .search-icon,
  .tf13053-loupe{width:40px!important;height:40px!important;min-width:40px!important;min-height:40px!important;flex-basis:40px!important;font-size:29px!important}
  .search-container>i.fa-search:before{font-size:29px!important}
  .tf13053-loupe svg,.search-container .search-icon svg{width:29px!important;height:29px!important}
}
`;
  document.head.appendChild(s);
}

function removeSend(){
  document.querySelectorAll('.tf13053-search-btn.submit').forEach(btn=>btn.remove());
}
function beginMentalStableOpen(){
  clearTimeout(mentalTimer);
  document.documentElement.classList.add('tf13065-mental-opening');
  mentalTimer=setTimeout(()=>document.documentElement.classList.remove('tf13065-mental-opening'),1400);
}
function bind(){
  installStyle();
  removeSend();
  [80,220,500,900,1500].forEach(ms=>setTimeout(removeSend,ms));
  document.addEventListener('pointerdown',event=>{
    const card=event.target&&event.target.closest?event.target.closest('#tfMentalistPairV117'):null;
    if(card)beginMentalStableOpen();
  },true);
  document.addEventListener('click',event=>{
    const card=event.target&&event.target.closest?event.target.closest('#tfMentalistPairV117'):null;
    if(card)beginMentalStableOpen();
  },true);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
