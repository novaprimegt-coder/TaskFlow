(function(){
'use strict';
if(window.__tfV128FullscreenUi)return;window.__tfV128FullscreenUi=true;

const STYLE_ID='tfV128FullscreenUiStyle';
const AD_SAFE=92;

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
/* V128 · SOLO presentación a pantalla completa de funciones y rutinas. */

/* Todas las funciones que usan la ventana principal ocupan todo el alto útil. */
#windowContainer.window-container.open{
  position:fixed!important;
  top:0!important;
  right:0!important;
  bottom:${AD_SAFE}px!important;
  left:0!important;
  width:100vw!important;
  height:auto!important;
  min-height:0!important;
  max-height:none!important;
  margin:0!important;
  padding:0!important;
  overflow:hidden!important;
  box-sizing:border-box!important;
  background:#050914!important;
  backdrop-filter:none!important;
  isolation:isolate!important;
  display:flex!important;
  justify-content:center!important;
  align-items:stretch!important;
}

#windowContainer.window-container.open>#windowContent.window-content{
  width:min(100%,820px)!important;
  height:100%!important;
  min-height:0!important;
  max-height:none!important;
  margin:0 auto!important;
  padding-bottom:10px!important;
  overflow-y:auto!important;
  overflow-x:hidden!important;
  -webkit-overflow-scrolling:touch!important;
  overscroll-behavior-y:contain!important;
  touch-action:pan-y!important;
  scroll-behavior:auto!important;
  scroll-padding-bottom:10px!important;
  box-sizing:border-box!important;
}

/* Evita espacios externos heredados al final de cualquier función. */
#windowContainer.window-container.open>#windowContent.window-content>:last-child{
  margin-bottom:0!important;
}
#windowContainer.window-container.open .v79-store-shell,
#windowContainer.window-container.open .tasks-group,
#windowContainer.window-container.open .tasks-subgroup,
#windowContainer.window-container.open .v69-routine-card,
#windowContainer.window-container.open .v69-routine-list,
#windowContainer.window-container.open .v85-sung-list,
#windowContainer.window-container.open .v83-legal-list,
#windowContainer.window-container.open .v94-mentalist-list{
  margin-bottom:0!important;
}

/* Rutinas predeterminadas: el contenido usa la misma superficie completa,
   sin una segunda caja flotante ni reserva inferior artificial. */
#windowContainer.window-container.open.tf128-routine-fullscreen>#windowContent.window-content{
  display:block!important;
  height:100%!important;
  max-height:none!important;
  overflow-y:auto!important;
  padding-bottom:10px!important;
}
#windowContainer.window-container.open.tf128-routine-fullscreen .v96-mentalist-scroll,
#windowContainer.window-container.open.tf128-routine-fullscreen .v97-routine-scroll{
  height:auto!important;
  min-height:0!important;
  max-height:none!important;
  margin-bottom:0!important;
  padding-bottom:0!important;
  overflow:visible!important;
  overflow-x:hidden!important;
  flex:none!important;
  box-sizing:border-box!important;
}
#windowContainer.window-container.open.tf128-routine-fullscreen .v96-mentalist-scroll>:last-child,
#windowContainer.window-container.open.tf128-routine-fullscreen .v97-routine-scroll>:last-child{
  margin-bottom:0!important;
  padding-bottom:0!important;
}

/* Tienda: toda la pantalla útil es la propia tienda y ella misma se desplaza. */
#windowContainer.window-container.open.store-modal>#windowContent.window-content.store-mode.v79-store-mode{
  height:100%!important;
  min-height:0!important;
  max-height:none!important;
  margin:0 auto!important;
  padding-bottom:10px!important;
  overflow-y:auto!important;
  overflow-x:hidden!important;
}
#windowContainer.window-container.open.store-modal .v79-store-shell{
  height:auto!important;
  min-height:0!important;
  max-height:none!important;
  padding-bottom:0!important;
}
#windowContainer.window-container.open.store-modal .v79-store-shell>:last-child{
  margin-bottom:0!important;
  padding-bottom:0!important;
}

/* 50/30/20 ya es la referencia correcta: se conserva como pantalla completa. */
#tf503020Overlay.tf503020-overlay.open{
  position:fixed!important;
  inset:0!important;
  width:100vw!important;
  height:100dvh!important;
  max-height:100dvh!important;
  overflow-y:auto!important;
  overflow-x:hidden!important;
  background:#050914!important;
  box-sizing:border-box!important;
}

@media(max-width:820px){
  #windowContainer.window-container.open{
    bottom:${AD_SAFE}px!important;
  }
  #windowContainer.window-container.open>#windowContent.window-content{
    width:100%!important;
    max-width:none!important;
  }
}
`;
  document.head.appendChild(s);
}

function clearOldGeometry(el){
  if(!el)return;
  ['inset','top','right','bottom','left','width','height','min-height','max-height','margin','margin-bottom','padding','padding-bottom','scroll-padding-bottom','overflow','overflow-y','overflow-x','display','flex-direction','align-items','justify-content'].forEach(p=>{
    try{el.style.removeProperty(p)}catch(_){ }
  });
}

function apply(){
  installStyle();
  const overlay=document.getElementById('windowContainer');
  const content=document.getElementById('windowContent');
  if(!overlay||!content||!overlay.classList.contains('open'))return;

  const isRoutine=!!content.querySelector('.v96-mentalist-scroll,.v97-routine-scroll');
  overlay.classList.toggle('tf128-routine-fullscreen',isRoutine);

  /* Se reemplaza únicamente la geometría heredada que generaba franjas o huecos. */
  clearOldGeometry(overlay);
  clearOldGeometry(content);

  overlay.style.setProperty('position','fixed','important');
  overlay.style.setProperty('top','0','important');
  overlay.style.setProperty('right','0','important');
  overlay.style.setProperty('bottom',AD_SAFE+'px','important');
  overlay.style.setProperty('left','0','important');
  overlay.style.setProperty('width','100vw','important');
  overlay.style.setProperty('height','auto','important');
  overlay.style.setProperty('max-height','none','important');
  overlay.style.setProperty('margin','0','important');
  overlay.style.setProperty('padding','0','important');
  overlay.style.setProperty('overflow','hidden','important');
  overlay.style.setProperty('background','#050914','important');

  content.style.setProperty('width','min(100%,820px)','important');
  content.style.setProperty('height','100%','important');
  content.style.setProperty('min-height','0','important');
  content.style.setProperty('max-height','none','important');
  content.style.setProperty('margin','0 auto','important');
  content.style.setProperty('padding-bottom','10px','important');
  content.style.setProperty('overflow-y','auto','important');
  content.style.setProperty('overflow-x','hidden','important');

  if(isRoutine){
    content.querySelectorAll('.v96-mentalist-scroll,.v97-routine-scroll').forEach(sc=>{
      clearOldGeometry(sc);
      sc.style.setProperty('height','auto','important');
      sc.style.setProperty('min-height','0','important');
      sc.style.setProperty('max-height','none','important');
      sc.style.setProperty('margin-bottom','0','important');
      sc.style.setProperty('padding-bottom','0','important');
      sc.style.setProperty('overflow','visible','important');
      sc.style.setProperty('flex','none','important');
    });
  }
}

function schedule(){
  requestAnimationFrame(apply);
  setTimeout(apply,70);
  setTimeout(apply,180);
  setTimeout(apply,360);
  setTimeout(apply,620);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
document.addEventListener('click',schedule,{capture:true,passive:true});
window.addEventListener('resize',schedule,{passive:true});
})();
