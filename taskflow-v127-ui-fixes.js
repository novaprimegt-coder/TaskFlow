(function(){
'use strict';
if(window.__tfV127UiFixes)return;window.__tfV127UiFixes=true;
const STYLE_ID='tfV127UiFixesStyle';

function installStyle(){
 if(document.getElementById(STYLE_ID))return;
 const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
/* V127.1 · SOLO tienda, hábitos y rutinas predeterminadas */

/* 1. TIENDA: desplazamiento vertical completo */
#windowContainer.tf127-store-modal.open{position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;max-height:100dvh!important;padding:0!important;overflow:hidden!important;background:#050914!important}
#windowContainer.tf127-store-modal.open>#windowContent.window-content.store-mode.v79-store-mode{width:min(96vw,760px)!important;max-width:760px!important;height:calc(100dvh - 8px)!important;min-height:0!important;max-height:calc(100dvh - 8px)!important;margin:4px auto 0!important;overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;overscroll-behavior-y:contain!important;padding-bottom:max(94px,calc(72px + env(safe-area-inset-bottom)))!important;scroll-padding-bottom:max(94px,calc(72px + env(safe-area-inset-bottom)))!important;box-sizing:border-box!important}
#windowContainer.tf127-store-modal .v79-store-shell{height:auto!important;min-height:0!important;max-height:none!important;margin-bottom:0!important;padding-bottom:0!important}

/* 2. HÁBITOS: estilo más limpio y profesional */
#windowContainer.tf127-habits-modal.open{position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;max-height:100dvh!important;padding:0!important;overflow:hidden!important;background:#050914!important}
#windowContainer.tf127-habits-modal.open>#windowContent{width:min(96vw,720px)!important;max-width:720px!important;height:auto!important;min-height:0!important;max-height:calc(100dvh - 10px)!important;margin:5px auto 0!important;padding:14px 14px max(94px,calc(72px + env(safe-area-inset-bottom)))!important;overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;overscroll-behavior-y:contain!important;border-radius:24px!important;border:1px solid rgba(90,215,204,.16)!important;background:radial-gradient(circle at 0 0,rgba(61,220,204,.07),transparent 30%),linear-gradient(155deg,#0b1222 0%,#0d1426 58%,#0a1020 100%)!important;box-shadow:0 24px 60px rgba(0,0,0,.42),inset 0 0 0 1px rgba(255,255,255,.015)!important;box-sizing:border-box!important}
#windowContainer.tf127-habits-modal .window-header-main{margin:0 0 14px!important;padding:4px 2px 12px!important;border-bottom:1px solid rgba(255,255,255,.07)!important;align-items:center!important}
#windowContainer.tf127-habits-modal .window-header-main h2{font-size:22px!important;line-height:1.05!important;font-weight:950!important;letter-spacing:-.02em!important;background:linear-gradient(90deg,#54dfd2,#f2bb53)!important;-webkit-background-clip:text!important;background-clip:text!important;-webkit-text-fill-color:transparent!important;color:transparent!important}
#windowContainer.tf127-habits-modal .window-close{width:42px!important;height:42px!important;min-width:42px!important;min-height:42px!important;border-radius:14px!important;border:1px solid rgba(255,255,255,.10)!important;background:rgba(255,255,255,.045)!important}
#windowContainer.tf127-habits-modal .tasks-group{display:grid!important;gap:12px!important;margin:0!important}
#windowContainer.tf127-habits-modal .tasks-group-header{display:flex!important;align-items:center!important;gap:9px!important;margin:0!important;padding:10px 12px!important;border-radius:15px!important;border:1px solid rgba(86,220,207,.10)!important;background:linear-gradient(145deg,rgba(72,216,202,.055),rgba(255,176,68,.025))!important}
#windowContainer.tf127-habits-modal .tasks-group-header h4{margin:0!important;font-size:15px!important;font-weight:900!important;color:#f5f8ff!important}
#windowContainer.tf127-habits-modal .tasks-group-header .badge{margin-left:auto!important;min-width:28px!important;height:28px!important;display:grid!important;place-items:center!important;padding:0 9px!important;border-radius:999px!important;background:rgba(255,255,255,.055)!important;color:#b9c4d8!important;border:1px solid rgba(255,255,255,.06)!important;font-weight:850!important}
#windowContainer.tf127-habits-modal .tasks-subgroup{margin:0!important;padding:0!important;display:grid!important;gap:8px!important}
#windowContainer.tf127-habits-modal .tasks-subgroup-header{display:flex!important;align-items:center!important;gap:8px!important;padding:3px 6px!important;margin:0!important;color:#c5cfdf!important;font-size:11px!important;font-weight:850!important}
#windowContainer.tf127-habits-modal .tasks-subgroup-list{display:grid!important;gap:9px!important;margin:0!important;padding:0!important}
#windowContainer.tf127-habits-modal .task-item.v27-habit-item,#windowContainer.tf127-habits-modal .list-item.v27-habit-item{min-height:78px!important;gap:11px!important;padding:11px 12px!important;border-radius:18px!important;border:1px solid rgba(255,159,65,.14)!important;border-left:3px solid rgba(255,157,54,.72)!important;background:radial-gradient(circle at 100% 0,rgba(255,158,60,.055),transparent 36%),linear-gradient(145deg,rgba(20,26,47,.98),rgba(12,17,32,.99))!important;box-shadow:0 10px 24px rgba(0,0,0,.16),inset 0 0 0 1px rgba(255,255,255,.012)!important}
#windowContainer.tf127-habits-modal .task-item.v27-habit-item.done,#windowContainer.tf127-habits-modal .list-item.v27-habit-item.done{border-left-color:rgba(76,222,164,.78)!important;opacity:.76!important}
#windowContainer.tf127-habits-modal .list-item-title,#windowContainer.tf127-habits-modal .task-title{font-size:13px!important;font-weight:850!important;color:#f5f7fc!important;margin-bottom:5px!important}
#windowContainer.tf127-habits-modal .list-item-meta{gap:6px!important}
#windowContainer.tf127-habits-modal .v27-chip{min-height:24px!important;padding:0 9px!important;border-radius:999px!important;font-size:8px!important;font-weight:800!important}
#windowContainer.tf127-habits-modal .list-item-check,#windowContainer.tf127-habits-modal .task-check{width:34px!important;height:34px!important;min-width:34px!important;border-radius:11px!important;border-width:1.5px!important;background:rgba(255,255,255,.025)!important}

/* 3. TODAS LAS RUTINAS PREDETERMINADAS: igual filosofía que 50/30/20, contenido compacto y desplazable */
#windowContainer.tf127-routine-modal.open{position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;max-height:100dvh!important;padding:0!important;overflow:hidden!important;background:#050914!important;display:flex!important;align-items:flex-start!important;justify-content:center!important}
#windowContainer.tf127-routine-modal.open>#windowContent{width:min(96vw,760px)!important;height:auto!important;min-height:0!important;max-height:calc(100dvh - 92px)!important;margin:4px auto 0!important;padding-bottom:0!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;box-sizing:border-box!important}
#windowContainer.tf127-routine-modal .v85-routine-modal-head{flex:0 0 auto!important}
#windowContainer.tf127-routine-modal .v96-mentalist-scroll,#windowContainer.tf127-routine-modal .v97-routine-scroll{flex:0 1 auto!important;height:auto!important;min-height:0!important;max-height:calc(100dvh - 180px)!important;margin-bottom:0!important;padding-bottom:4px!important;overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;overscroll-behavior-y:contain!important;align-content:start!important;box-sizing:border-box!important}
#windowContainer.tf127-routine-modal .v96-mentalist-scroll>:last-child,#windowContainer.tf127-routine-modal .v97-routine-scroll>:last-child,#windowContainer.tf127-routine-modal .v69-routine-card,#windowContainer.tf127-routine-modal .v69-routine-list,#windowContainer.tf127-routine-modal .v85-sung-list,#windowContainer.tf127-routine-modal .v83-legal-list,#windowContainer.tf127-routine-modal .v94-mentalist-list{margin-bottom:0!important;padding-bottom:0!important}

/* 50/30/20 se mantiene aislado a pantalla completa */
#tf503020Overlay.tf503020-overlay.open{position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;max-height:100dvh!important;overflow-y:auto!important;overflow-x:hidden!important;background:#050914!important;padding-bottom:0!important}

@media(max-width:520px){
 #windowContainer.tf127-habits-modal.open>#windowContent{width:97vw!important;border-radius:20px!important;padding-left:11px!important;padding-right:11px!important}
 #windowContainer.tf127-habits-modal .task-item.v27-habit-item,#windowContainer.tf127-habits-modal .list-item.v27-habit-item{min-height:72px!important;padding:10px!important}
 #windowContainer.tf127-routine-modal.open>#windowContent{width:97vw!important;max-height:calc(100dvh - 92px)!important}
 #windowContainer.tf127-routine-modal .v96-mentalist-scroll,#windowContainer.tf127-routine-modal .v97-routine-scroll{max-height:calc(100dvh - 170px)!important}
}
`;
 document.head.appendChild(s);
}

function txt(el){return String(el&&el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();}
function clearProp(el,p){try{el&&el.style.removeProperty(p)}catch(_){}}

function clearStaleRoutineState(overlay,content){
 if(!overlay||!content)return;
 overlay.classList.remove('tf126-routine-overlay','tf127-routine-modal');
 content.classList.remove('tf126-routine-content','tf127-routine-content');
 ['bottom','height','max-height','min-height','padding-bottom','scroll-padding-bottom','overflow','display','flex-direction','margin-bottom'].forEach(p=>{clearProp(overlay,p);clearProp(content,p)});
 content.querySelectorAll('.v96-mentalist-scroll,.v97-routine-scroll').forEach(sc=>['height','max-height','min-height','padding-bottom','scroll-padding-bottom','margin-bottom','overflow-y','overflow','flex'].forEach(p=>clearProp(sc,p)));
}

function fixRoutine(overlay,content){
 overlay.classList.add('tf127-routine-modal');
 overlay.style.setProperty('inset','0','important');
 overlay.style.setProperty('bottom','0','important');
 overlay.style.setProperty('padding-bottom','0','important');
 content.style.setProperty('height','auto','important');
 content.style.setProperty('min-height','0','important');
 content.style.setProperty('max-height','calc(100dvh - 92px)','important');
 content.style.setProperty('margin-bottom','0','important');
 content.style.setProperty('padding-bottom','0','important');
 content.style.setProperty('overflow','hidden','important');
 content.style.setProperty('display','flex','important');
 content.style.setProperty('flex-direction','column','important');
 content.querySelectorAll('.v96-mentalist-scroll,.v97-routine-scroll').forEach(sc=>{
  sc.style.setProperty('height','auto','important');sc.style.setProperty('min-height','0','important');sc.style.setProperty('max-height','calc(100dvh - 180px)','important');sc.style.setProperty('margin-bottom','0','important');sc.style.setProperty('padding-bottom','4px','important');sc.style.setProperty('overflow-y','auto','important');sc.style.setProperty('flex','0 1 auto','important');
 });
}

function fixStore(overlay,content){
 clearStaleRoutineState(overlay,content);
 overlay.classList.add('tf127-store-modal');
 overlay.style.setProperty('inset','0','important');overlay.style.setProperty('height','100dvh','important');overlay.style.setProperty('max-height','100dvh','important');overlay.style.setProperty('padding','0','important');overlay.style.setProperty('overflow','hidden','important');overlay.style.setProperty('background','#050914','important');
 content.style.setProperty('height','calc(100dvh - 8px)','important');content.style.setProperty('max-height','calc(100dvh - 8px)','important');content.style.setProperty('min-height','0','important');content.style.setProperty('margin','4px auto 0','important');content.style.setProperty('overflow-y','auto','important');content.style.setProperty('overflow-x','hidden','important');content.style.setProperty('padding-bottom','max(94px,calc(72px + env(safe-area-inset-bottom)))','important');
}

function classifyAndFix(){
 installStyle();
 const overlay=document.getElementById('windowContainer'),content=document.getElementById('windowContent');
 if(!overlay||!content)return;
 overlay.classList.remove('tf127-store-modal','tf127-habits-modal');
 if(!overlay.classList.contains('open'))return;
 const hasRoutine=!!content.querySelector('.v96-mentalist-scroll,.v97-routine-scroll');
 const isStore=overlay.classList.contains('store-modal')||!!content.querySelector('.v79-store-shell');
 const heading=txt(content.querySelector(':scope > .window-header-main h2'));
 const isHabits=heading==='hábitos activos'||heading==='hábitos completados'||heading==='habitos activos'||heading==='habitos completados';
 if(isStore){fixStore(overlay,content);return;}
 if(hasRoutine){fixRoutine(overlay,content);return;}
 clearStaleRoutineState(overlay,content);
 if(isHabits)overlay.classList.add('tf127-habits-modal');
}

function schedule(){requestAnimationFrame(classifyAndFix);setTimeout(classifyAndFix,40);setTimeout(classifyAndFix,130);setTimeout(classifyAndFix,260);setTimeout(classifyAndFix,430)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
document.addEventListener('click',schedule,{capture:true,passive:true});
window.addEventListener('resize',schedule,{passive:true});
})();
