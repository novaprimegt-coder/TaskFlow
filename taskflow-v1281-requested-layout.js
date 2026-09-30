(function(){
'use strict';
if(window.__tfV1281RequestedLayout)return;window.__tfV1281RequestedLayout=true;

const STYLE_ID='tfV1281RequestedLayoutStyle';
const AD_SAFE=96;

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
/* V128.1 · SOLO las ocho áreas solicitadas por el usuario. */
#windowContainer.tf1281-store.open{position:fixed!important;top:0!important;right:0!important;left:0!important;bottom:${AD_SAFE}px!important;width:100vw!important;height:auto!important;max-height:none!important;padding:0!important;margin:0!important;overflow:hidden!important;background:#050914!important}
#windowContainer.tf1281-store.open>#windowContent.window-content.store-mode.v79-store-mode{width:min(96vw,760px)!important;max-width:760px!important;height:100%!important;min-height:0!important;max-height:100%!important;margin:0 auto!important;padding:8px 10px!important;overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;overscroll-behavior-y:contain!important;scroll-padding-bottom:8px!important;box-sizing:border-box!important}
#windowContainer.tf1281-store .v79-store-shell{height:auto!important;min-height:0!important;max-height:none!important;margin:0!important;padding-bottom:0!important}
#windowContainer.tf1281-store .v79-store-shell>:last-child,#windowContainer.tf1281-store .v79-store-rule{margin-bottom:0!important}

#windowContainer.tf1281-routine.open{position:fixed!important;top:0!important;right:0!important;left:0!important;bottom:${AD_SAFE}px!important;width:100vw!important;height:auto!important;max-height:none!important;padding:8px 6px!important;margin:0!important;overflow:hidden!important;display:flex!important;align-items:center!important;justify-content:center!important;background:#050914!important;box-sizing:border-box!important}
#windowContainer.tf1281-routine.open>#windowContent{width:min(97vw,760px)!important;max-width:760px!important;height:auto!important;min-height:0!important;max-height:100%!important;margin:0 auto!important;padding-bottom:0!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;box-sizing:border-box!important}
#windowContainer.tf1281-routine .v85-routine-modal-head{flex:0 0 auto!important;margin-bottom:8px!important}
#windowContainer.tf1281-routine .v96-mentalist-scroll,#windowContainer.tf1281-routine .v97-routine-scroll{flex:0 1 auto!important;height:auto!important;min-height:0!important;max-height:calc(100dvh - ${AD_SAFE + 120}px)!important;margin:0!important;padding-bottom:0!important;scroll-padding-bottom:0!important;overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;overscroll-behavior-y:contain!important;box-sizing:border-box!important}
#windowContainer.tf1281-routine .v94-mentalist-list,#windowContainer.tf1281-routine .v69-routine-card,#windowContainer.tf1281-routine .v69-routine-list,#windowContainer.tf1281-routine .v85-sung-list,#windowContainer.tf1281-routine .v83-legal-list{margin-bottom:0!important;padding-bottom:0!important}
#windowContainer.tf1281-routine .v96-mentalist-scroll>:last-child,#windowContainer.tf1281-routine .v97-routine-scroll>:last-child{margin-bottom:0!important;padding-bottom:0!important}

#windowContainer.tf1281-management.open{position:fixed!important;top:0!important;right:0!important;left:0!important;bottom:${AD_SAFE}px!important;width:100vw!important;height:auto!important;max-height:none!important;margin:0!important;padding:0!important;overflow:hidden!important;box-sizing:border-box!important}
#windowContainer.tf1281-management.open>#windowContent{width:min(100vw,760px)!important;max-width:760px!important;height:100%!important;min-height:100%!important;max-height:100%!important;margin:0 auto!important;padding-bottom:10px!important;overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;overscroll-behavior-y:contain!important;border-radius:0!important;box-sizing:border-box!important}
#windowContainer.tf1281-management .dashboard-card.v27-create-card:last-child,#windowContainer.tf1281-management .form-stack:last-child,#windowContainer.tf1281-management .tasks-group:last-child,#windowContainer.tf1281-management .v27-subcategory-grid:last-child{margin-bottom:0!important}

@media(max-width:820px){#windowContainer.tf1281-store.open>#windowContent.window-content.store-mode.v79-store-mode{width:100vw!important;max-width:100vw!important;border-radius:0!important}#windowContainer.tf1281-management.open>#windowContent{width:100vw!important;max-width:100vw!important;border-radius:0!important;margin:0!important}}
`;
  document.head.appendChild(s);
}
function text(el){return String(el&&el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();}
function clearInline(el,props){if(!el)return;props.forEach(p=>{try{el.style.removeProperty(p)}catch(_){}});}
function clearLegacyLayout(container,content){if(!container||!content)return;container.classList.remove('tf126-routine-overlay','tf127-routine-modal','tf127-store-modal','tf128-store','tf128-routine','tf128-workspace','tf128-create');content.classList.remove('tf126-routine-content','tf127-routine-content');clearInline(container,['inset','top','right','bottom','left','width','height','max-height','min-height','padding','padding-bottom','margin','overflow','overflow-x','overflow-y','display','align-items','justify-content','background','scroll-padding-bottom']);clearInline(content,['width','height','max-height','min-height','margin','margin-bottom','padding-bottom','overflow','overflow-x','overflow-y','display','flex-direction','scroll-padding-bottom']);content.querySelectorAll('.v96-mentalist-scroll,.v97-routine-scroll').forEach(sc=>clearInline(sc,['height','max-height','min-height','margin','margin-bottom','padding-bottom','overflow','overflow-x','overflow-y','flex','scroll-padding-bottom']));}
function clearClasses(container){if(container)container.classList.remove('tf1281-store','tf1281-routine','tf1281-management','tf128-store','tf128-routine','tf128-workspace','tf128-create');}
function removeMentalistaForense(content){const root=content||document;root.querySelectorAll('.v85-routine-modal-copy h2,.v94-mentalist-head h3,.v94-mentalist-copy strong').forEach(el=>{if(/mentalista\s+forense/i.test(el.textContent||''))el.textContent='Mentalista';});document.querySelectorAll('.v94-mentalist-copy strong,.v94-mentalist-head h3').forEach(el=>{if(/mentalista\s+forense/i.test(el.textContent||''))el.textContent='Mentalista';});}
function isManagement(content){if(!content)return false;const h=text(content.querySelector('.window-header-main h2'));const allowed=new Set(['tareas','hábitos','habitos','tareas activas','tareas completadas','hábitos activos','habitos activos','hábitos completados','habitos completados','nueva tarea','nuevo hábito','nuevo habito']);if(allowed.has(h))return true;if(content.querySelector('.dashboard-card.v27-create-card'))return true;if(content.querySelector('.v27-kind-chip.tasks,.v27-kind-chip.habits'))return true;if(content.querySelector('.v27-subcategory-grid'))return true;return false;}
function apply(){installStyle();const container=document.getElementById('windowContainer');const content=document.getElementById('windowContent');if(!container||!content)return;clearClasses(container);removeMentalistaForense(content);if(!container.classList.contains('open'))return;const store=container.classList.contains('store-modal')||!!content.querySelector('.v79-store-shell');const routine=!!content.querySelector('.v96-mentalist-scroll,.v97-routine-scroll');if(store){clearLegacyLayout(container,content);container.classList.add('tf1281-store');return;}if(routine){clearLegacyLayout(container,content);container.classList.add('tf1281-routine');return;}if(isManagement(content)){container.classList.add('tf1281-management');}}
function schedule(){requestAnimationFrame(apply);setTimeout(apply,50);setTimeout(apply,160);setTimeout(apply,320);setTimeout(apply,380);setTimeout(apply,620);setTimeout(apply,980);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();document.addEventListener('click',schedule,{capture:true,passive:true});window.addEventListener('resize',schedule,{passive:true});
})();
