(function(){
'use strict';
if(window.__tfV127UiFixes)return;window.__tfV127UiFixes=true;

const STYLE_ID='tfV127UiFixesStyle';
const MOBILE_AD_SAFE=96;

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
/* V127 · SOLO: tienda desplazable, hábitos refinados y rutinas sin espacios finales. */

/* 1) TIENDA: pantalla completa útil + desplazamiento vertical real. */
#windowContainer.store-modal.open{
  position:fixed!important;
  top:0!important;
  right:0!important;
  bottom:0!important;
  left:0!important;
  width:100vw!important;
  height:100dvh!important;
  max-height:100dvh!important;
  overflow-y:auto!important;
  overflow-x:hidden!important;
  -webkit-overflow-scrolling:touch!important;
  overscroll-behavior-y:contain!important;
  touch-action:pan-y!important;
  padding:8px 6px 10px!important;
  box-sizing:border-box!important;
  background:#050914!important;
  backdrop-filter:none!important;
  isolation:isolate!important;
}
#windowContainer.store-modal.open>.window-content.store-mode.v79-store-mode{
  width:min(96vw,760px)!important;
  max-width:760px!important;
  height:auto!important;
  min-height:0!important;
  max-height:none!important;
  overflow:visible!important;
  margin:0 auto!important;
  padding-bottom:10px!important;
  box-sizing:border-box!important;
}
#windowContainer.store-modal.open .v79-store-shell{
  min-height:0!important;
  height:auto!important;
  max-height:none!important;
  margin-bottom:0!important;
  padding-bottom:0!important;
}
#windowContainer.store-modal.open .v79-store-rule:last-child,
#windowContainer.store-modal.open .v79-store-shell>:last-child{
  margin-bottom:0!important;
}
@media(max-width:820px){
  #windowContainer.store-modal.open{
    bottom:${MOBILE_AD_SAFE}px!important;
    height:auto!important;
    max-height:none!important;
  }
}

/* 2) HÁBITOS ACTIVOS / COMPLETADOS: apariencia más limpia, profesional y compacta. */
#windowContainer.tf127-habits-modal.open{
  position:fixed!important;
  top:0!important;
  right:0!important;
  bottom:0!important;
  left:0!important;
  width:100vw!important;
  height:100dvh!important;
  max-height:100dvh!important;
  overflow-y:auto!important;
  overflow-x:hidden!important;
  -webkit-overflow-scrolling:touch!important;
  touch-action:pan-y!important;
  overscroll-behavior-y:contain!important;
  padding:14px 8px!important;
  box-sizing:border-box!important;
  background:rgba(2,7,18,.92)!important;
}
#windowContainer.tf127-habits-modal.open>#windowContent{
  width:min(95vw,720px)!important;
  max-width:720px!important;
  height:auto!important;
  min-height:0!important;
  max-height:none!important;
  overflow:visible!important;
  margin:0 auto!important;
  padding:16px!important;
  border-radius:26px!important;
  border:1px solid rgba(80,222,208,.18)!important;
  background:
    radial-gradient(circle at 8% 0%,rgba(78,205,196,.09),transparent 29%),
    radial-gradient(circle at 92% 100%,rgba(255,138,43,.07),transparent 32%),
    linear-gradient(165deg,#151a31 0%,#101628 54%,#0d1323 100%)!important;
  box-shadow:0 28px 70px rgba(0,0,0,.48),inset 0 1px 0 rgba(255,255,255,.025)!important;
  box-sizing:border-box!important;
}
#windowContainer.tf127-habits-modal .window-header-main{
  display:flex!important;
  align-items:center!important;
  justify-content:space-between!important;
  gap:12px!important;
  margin:0 0 16px!important;
  padding:2px 0 13px!important;
  border-bottom:1px solid rgba(255,255,255,.08)!important;
}
#windowContainer.tf127-habits-modal .window-header-main h2{
  margin:0!important;
  font-size:20px!important;
  line-height:1.1!important;
  font-weight:900!important;
  letter-spacing:-.02em!important;
  background:linear-gradient(90deg,#58e3d5 0%,#75dac0 48%,#ffad54 100%)!important;
  -webkit-background-clip:text!important;
  background-clip:text!important;
  -webkit-text-fill-color:transparent!important;
}
#windowContainer.tf127-habits-modal .window-close{
  width:42px!important;
  height:42px!important;
  min-width:42px!important;
  min-height:42px!important;
  border-radius:14px!important;
  background:rgba(255,255,255,.045)!important;
  border:1px solid rgba(255,255,255,.10)!important;
}
#windowContainer.tf127-habits-modal .tasks-group{
  margin:0!important;
  padding:0!important;
}
#windowContainer.tf127-habits-modal .tasks-group-header{
  display:flex!important;
  align-items:center!important;
  gap:9px!important;
  margin:0 0 12px!important;
  padding:0 2px 11px!important;
  border-bottom:1px solid rgba(255,255,255,.08)!important;
}
#windowContainer.tf127-habits-modal .tasks-group-header h4{
  margin:0!important;
  font-size:13px!important;
  font-weight:800!important;
  color:#f4f7ff!important;
}
#windowContainer.tf127-habits-modal .tasks-group-header .badge{
  min-width:30px!important;
  height:28px!important;
  display:grid!important;
  place-items:center!important;
  padding:0 9px!important;
  border-radius:999px!important;
  background:rgba(255,255,255,.055)!important;
  border:1px solid rgba(255,255,255,.07)!important;
  color:#b9c4d8!important;
  font-weight:800!important;
}
#windowContainer.tf127-habits-modal .tasks-subgroup{
  margin:0 0 14px!important;
  padding:0!important;
}
#windowContainer.tf127-habits-modal .tasks-subgroup-header{
  margin:0 0 9px!important;
  padding:0 2px!important;
  gap:7px!important;
}
#windowContainer.tf127-habits-modal .tasks-subgroup-header span{
  font-size:11px!important;
  font-weight:750!important;
  color:#cbd4e5!important;
}
#windowContainer.tf127-habits-modal .tasks-subgroup-list{
  margin:0!important;
  gap:10px!important;
}
#windowContainer.tf127-habits-modal .task-item.v27-habit-item,
#windowContainer.tf127-habits-modal .list-item.v27-habit-item{
  min-height:82px!important;
  gap:12px!important;
  padding:12px 13px!important;
  border-radius:18px!important;
  border:1px solid rgba(255,255,255,.09)!important;
  border-left:4px solid rgba(255,153,55,.72)!important;
  background:linear-gradient(145deg,rgba(255,255,255,.055),rgba(12,18,34,.92))!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.025),0 8px 20px rgba(0,0,0,.12)!important;
}
#windowContainer.tf127-habits-modal .task-item.v27-habit-item.done,
#windowContainer.tf127-habits-modal .list-item.v27-habit-item.done{
  border-left-color:rgba(76,222,164,.78)!important;
}
#windowContainer.tf127-habits-modal .task-check,
#windowContainer.tf127-habits-modal .list-item-check{
  width:38px!important;
  height:38px!important;
  min-width:38px!important;
  border-radius:13px!important;
  background:rgba(7,12,25,.38)!important;
  border:2px solid rgba(151,163,190,.22)!important;
}
#windowContainer.tf127-habits-modal .task-check.checked,
#windowContainer.tf127-habits-modal .list-item-check.checked{
  background:rgba(54,217,106,.20)!important;
  border-color:rgba(54,217,106,.72)!important;
  color:#77eca0!important;
}
#windowContainer.tf127-habits-modal .task-title,
#windowContainer.tf127-habits-modal .list-item-title{
  font-size:14px!important;
  line-height:1.25!important;
  font-weight:800!important;
  color:#f5f7fc!important;
}
#windowContainer.tf127-habits-modal .task-meta,
#windowContainer.tf127-habits-modal .list-item-meta{
  margin-top:7px!important;
  gap:7px!important;
}
#windowContainer.tf127-habits-modal .v27-chip{
  min-height:26px!important;
  display:inline-flex!important;
  align-items:center!important;
  padding:0 10px!important;
  border-radius:999px!important;
  font-size:9px!important;
  font-weight:750!important;
}
@media(max-width:820px){
  #windowContainer.tf127-habits-modal.open{
    bottom:${MOBILE_AD_SAFE}px!important;
    height:auto!important;
    max-height:none!important;
    padding:8px 7px!important;
  }
  #windowContainer.tf127-habits-modal.open>#windowContent{
    width:96vw!important;
    padding:13px!important;
    border-radius:22px!important;
  }
}

/* 3) TODAS LAS RUTINAS PREDETERMINADAS: sin altura forzada ni hueco final.
   El desplazamiento lo realiza la ventana exterior, como 50/30/20. */
#windowContainer.tf127-routine-modal.open{
  position:fixed!important;
  top:0!important;
  right:0!important;
  bottom:0!important;
  left:0!important;
  width:100vw!important;
  height:100dvh!important;
  max-height:100dvh!important;
  overflow-y:auto!important;
  overflow-x:hidden!important;
  -webkit-overflow-scrolling:touch!important;
  overscroll-behavior-y:contain!important;
  touch-action:pan-y!important;
  padding:8px 6px 10px!important;
  box-sizing:border-box!important;
}
#windowContainer.tf127-routine-modal.open>#windowContent.tf127-routine-content{
  height:auto!important;
  min-height:0!important;
  max-height:none!important;
  overflow:visible!important;
  display:block!important;
  margin:0 auto!important;
  padding-bottom:8px!important;
}
#windowContainer.tf127-routine-modal .v96-mentalist-scroll,
#windowContainer.tf127-routine-modal .v97-routine-scroll{
  height:auto!important;
  min-height:0!important;
  max-height:none!important;
  overflow:visible!important;
  flex:none!important;
  margin-bottom:0!important;
  padding-bottom:0!important;
  scroll-padding-bottom:0!important;
}
#windowContainer.tf127-routine-modal .v94-mentalist-list,
#windowContainer.tf127-routine-modal .v69-routine-card,
#windowContainer.tf127-routine-modal .v69-routine-list,
#windowContainer.tf127-routine-modal .v85-sung-list,
#windowContainer.tf127-routine-modal .v83-legal-list{
  margin-bottom:0!important;
  padding-bottom:0!important;
}
#windowContainer.tf127-routine-modal .v96-mentalist-scroll>:last-child,
#windowContainer.tf127-routine-modal .v97-routine-scroll>:last-child,
#windowContainer.tf127-routine-modal .v69-routine-card>:last-child{
  margin-bottom:0!important;
  padding-bottom:0!important;
}
@media(max-width:820px){
  #windowContainer.tf127-routine-modal.open{
    bottom:${MOBILE_AD_SAFE}px!important;
    height:auto!important;
    max-height:none!important;
  }
}
`;
  document.head.appendChild(s);
}

function titleText(){
  const h=document.querySelector('#windowContent .window-header-main h2');
  return String(h&&h.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
}

function tagHabits(){
  const container=document.getElementById('windowContainer');
  const content=document.getElementById('windowContent');
  if(!container||!content)return;
  const t=titleText();
  const isHabits=t.includes('hábitos activos')||t.includes('habitos activos')||t.includes('hábitos completados')||t.includes('habitos completados');
  container.classList.toggle('tf127-habits-modal',isHabits);
}

function tagRoutines(){
  const container=document.getElementById('windowContainer');
  const content=document.getElementById('windowContent');
  if(!container||!content)return;
  const scroll=content.querySelector('.v96-mentalist-scroll,.v97-routine-scroll');
  const isRoutine=!!scroll;
  container.classList.toggle('tf127-routine-modal',isRoutine);
  content.classList.toggle('tf127-routine-content',isRoutine);
  if(!isRoutine)return;

  content.style.setProperty('height','auto','important');
  content.style.setProperty('min-height','0','important');
  content.style.setProperty('max-height','none','important');
  content.style.setProperty('overflow','visible','important');
  content.style.setProperty('display','block','important');
  content.style.setProperty('margin-bottom','0','important');
  content.style.setProperty('padding-bottom','8px','important');

  content.querySelectorAll('.v96-mentalist-scroll,.v97-routine-scroll').forEach(el=>{
    el.style.setProperty('height','auto','important');
    el.style.setProperty('min-height','0','important');
    el.style.setProperty('max-height','none','important');
    el.style.setProperty('overflow','visible','important');
    el.style.setProperty('flex','none','important');
    el.style.setProperty('margin-bottom','0','important');
    el.style.setProperty('padding-bottom','0','important');
    el.style.setProperty('scroll-padding-bottom','0','important');
  });
}

function fixStore(){
  const container=document.getElementById('windowContainer');
  if(!container||!container.classList.contains('store-modal'))return;
  container.style.setProperty('overflow-y','auto','important');
  container.style.setProperty('overflow-x','hidden','important');
  container.style.setProperty('background','#050914','important');
  const content=container.querySelector('.window-content.store-mode.v79-store-mode');
  if(content){
    content.style.setProperty('height','auto','important');
    content.style.setProperty('min-height','0','important');
    content.style.setProperty('max-height','none','important');
    content.style.setProperty('overflow','visible','important');
    content.style.setProperty('margin','0 auto','important');
    content.style.setProperty('margin-bottom','0','important');
  }
}

function apply(){
  installStyle();
  tagHabits();
  tagRoutines();
  fixStore();
}

function schedule(){
  requestAnimationFrame(apply);
  setTimeout(apply,70);
  setTimeout(apply,190);
  setTimeout(apply,390);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
document.addEventListener('click',schedule,{capture:true,passive:true});
window.addEventListener('resize',schedule,{passive:true});
})();
