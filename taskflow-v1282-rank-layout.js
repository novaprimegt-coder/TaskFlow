(function(){
'use strict';
if(window.__tfV1282RankLayout)return;window.__tfV1282RankLayout=true;

const STYLE_ID='tfV1282RankLayoutStyle';
const AD_SAFE=96;

function installStyle(){
  if(document.getElementById(STYLE_ID))return;
  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
/* V128.2 · SOLO las áreas solicitadas, tomando Jerarquía de rango como referencia visual. */

/* Superficie compartida: misma filosofía visual de Jerarquía de rango. */
#windowContainer.tf1282-store.open,
#windowContainer.tf1282-routine.open,
#windowContainer.tf1282-management.open{
  position:fixed!important;
  top:0!important;
  right:0!important;
  left:0!important;
  bottom:${AD_SAFE}px!important;
  width:100vw!important;
  height:auto!important;
  max-height:none!important;
  margin:0!important;
  box-sizing:border-box!important;
  overflow:hidden!important;
  background:rgba(0,0,0,.97)!important;
}

#windowContainer.tf1282-store.open>#windowContent,
#windowContainer.tf1282-routine.open>#windowContent,
#windowContainer.tf1282-management.open>#windowContent{
  width:min(96%,760px)!important;
  max-width:760px!important;
  box-sizing:border-box!important;
  background:var(--bg-tertiary)!important;
  border:1px solid var(--border-medium)!important;
  border-radius:var(--radius-xl)!important;
  box-shadow:none!important;
}

/* 1) TIENDA: sin hueco final; el propio panel ocupa el área útil y desplaza todo el contenido. */
#windowContainer.tf1282-store.open{
  display:flex!important;
  align-items:stretch!important;
  justify-content:center!important;
  padding:4px 0!important;
}
#windowContainer.tf1282-store.open>#windowContent.window-content.store-mode.v79-store-mode{
  height:100%!important;
  min-height:0!important;
  max-height:100%!important;
  margin:0 auto!important;
  padding:12px 12px 8px!important;
  overflow-y:auto!important;
  overflow-x:hidden!important;
  -webkit-overflow-scrolling:touch!important;
  touch-action:pan-y!important;
  overscroll-behavior-y:contain!important;
  scroll-padding-bottom:8px!important;
}
#windowContainer.tf1282-store .v79-store-shell{
  height:auto!important;
  min-height:0!important;
  max-height:none!important;
  margin:0!important;
  padding-bottom:0!important;
}
#windowContainer.tf1282-store .v79-store-shell>:last-child,
#windowContainer.tf1282-store .v79-store-rule:last-child{
  margin-bottom:0!important;
  padding-bottom:0!important;
}

/* 2-6) TODAS LAS RUTINAS PREDETERMINADAS: centradas verticalmente y sin hueco unilateral. */
#windowContainer.tf1282-routine.open{
  display:flex!important;
  align-items:center!important;
  justify-content:center!important;
  padding:8px 6px!important;
}
#windowContainer.tf1282-routine.open>#windowContent{
  height:auto!important;
  min-height:0!important;
  max-height:calc(100% - 16px)!important;
  margin:auto!important;
  padding:12px 12px 8px!important;
  overflow:hidden!important;
  display:flex!important;
  flex-direction:column!important;
}
#windowContainer.tf1282-routine .v85-routine-modal-head{
  flex:0 0 auto!important;
  margin-bottom:10px!important;
}
#windowContainer.tf1282-routine .v96-mentalist-scroll,
#windowContainer.tf1282-routine .v97-routine-scroll{
  flex:0 1 auto!important;
  height:auto!important;
  min-height:0!important;
  max-height:calc(100dvh - ${AD_SAFE + 150}px)!important;
  margin:0!important;
  padding-bottom:0!important;
  scroll-padding-bottom:0!important;
  overflow-y:auto!important;
  overflow-x:hidden!important;
  -webkit-overflow-scrolling:touch!important;
  touch-action:pan-y!important;
  overscroll-behavior-y:contain!important;
  box-sizing:border-box!important;
}
#windowContainer.tf1282-routine .v94-mentalist-list,
#windowContainer.tf1282-routine .v69-routine-card,
#windowContainer.tf1282-routine .v69-routine-list,
#windowContainer.tf1282-routine .v85-sung-list,
#windowContainer.tf1282-routine .v83-legal-list,
#windowContainer.tf1282-routine .v96-mentalist-scroll>:last-child,
#windowContainer.tf1282-routine .v97-routine-scroll>:last-child{
  margin-bottom:0!important;
  padding-bottom:0!important;
}

/* 7-8) Tareas, hábitos, categorías y creación: marco continuo a pantalla útil, no panel flotante. */
#windowContainer.tf1282-management.open{
  display:flex!important;
  align-items:stretch!important;
  justify-content:center!important;
  padding:4px 0!important;
}
#windowContainer.tf1282-management.open>#windowContent{
  height:100%!important;
  min-height:100%!important;
  max-height:100%!important;
  margin:0 auto!important;
  padding:12px 12px 8px!important;
  overflow-y:auto!important;
  overflow-x:hidden!important;
  -webkit-overflow-scrolling:touch!important;
  touch-action:pan-y!important;
  overscroll-behavior-y:contain!important;
  scroll-padding-bottom:8px!important;
}
#windowContainer.tf1282-management .window-header-main{
  margin-bottom:12px!important;
}
#windowContainer.tf1282-management .dashboard-card.v27-create-card{
  margin-bottom:0!important;
  box-shadow:none!important;
}
#windowContainer.tf1282-management .form-stack:last-child,
#windowContainer.tf1282-management .dashboard-card:last-child,
#windowContainer.tf1282-management .tasks-group:last-child,
#windowContainer.tf1282-management .v27-subcategory-grid:last-child,
#windowContainer.tf1282-management .v27-items-list:last-child{
  margin-bottom:0!important;
  padding-bottom:0!important;
}

/* Lista activa/completada: evita el segundo encabezado pesado y conserva la información. */
#windowContainer.tf1282-management .tasks-group-header.tf1282-duplicate-heading{
  background:transparent!important;
  border:0!important;
  border-bottom:1px solid rgba(255,255,255,.07)!important;
  border-radius:0!important;
  padding:7px 2px 10px!important;
  margin:0 0 10px!important;
  box-shadow:none!important;
}
#windowContainer.tf1282-management .tasks-group-header.tf1282-duplicate-heading h4{
  font-size:15px!important;
  font-weight:850!important;
}

@media(max-width:600px){
  #windowContainer.tf1282-store.open>#windowContent,
  #windowContainer.tf1282-routine.open>#windowContent,
  #windowContainer.tf1282-management.open>#windowContent{
    width:96%!important;
    max-width:96%!important;
    border-radius:var(--radius-xl)!important;
  }
  #windowContainer.tf1282-store.open>#windowContent,
  #windowContainer.tf1282-management.open>#windowContent{
    padding:12px 12px 8px!important;
  }
  #windowContainer.tf1282-routine.open>#windowContent{
    max-height:calc(100% - 8px)!important;
    padding:10px 10px 6px!important;
  }
  #windowContainer.tf1282-routine .v96-mentalist-scroll,
  #windowContainer.tf1282-routine .v97-routine-scroll{
    max-height:calc(100dvh - ${AD_SAFE + 132}px)!important;
  }
}
`;
  document.head.appendChild(s);
}

function txt(el){return String(el&&el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();}
function clearInline(el,props){if(!el)return;for(const p of props){try{el.style.removeProperty(p)}catch(_){}}}
function clearTargetClasses(container){
  if(!container)return;
  container.classList.remove('tf1282-store','tf1282-routine','tf1282-management');
}

function clearOldLayout(container,content){
  clearInline(container,['inset','top','right','bottom','left','width','height','min-height','max-height','margin','padding','padding-bottom','overflow','overflow-x','overflow-y','display','align-items','justify-content','background','scroll-padding-bottom']);
  clearInline(content,['width','height','min-height','max-height','margin','margin-bottom','padding','padding-bottom','overflow','overflow-x','overflow-y','display','flex-direction','scroll-padding-bottom','background','border-radius']);
  content.querySelectorAll('.v96-mentalist-scroll,.v97-routine-scroll').forEach(sc=>clearInline(sc,['height','min-height','max-height','margin','margin-bottom','padding-bottom','scroll-padding-bottom','overflow','overflow-x','overflow-y','flex']));
}

function renameMentalista(){
  const selectors=['#windowContent .v85-routine-modal-copy h2','#windowContent .v94-mentalist-head h3','#windowContent .v94-mentalist-copy strong','#v94MentalistRoutine .v94-mentalist-head h3','#v94MentalistRoutine .v94-mentalist-copy strong'];
  document.querySelectorAll(selectors.join(',')).forEach(el=>{
    if(/mentalista\s+forense/i.test(el.textContent||''))el.textContent='Mentalista';
  });
}

function isManagement(content){
  const h=txt(content.querySelector(':scope > .window-header-main h2'));
  const exact=new Set(['tareas','hábitos','habitos','tareas activas','tareas completadas','hábitos activos','habitos activos','hábitos completados','habitos completados','nueva tarea','nuevo hábito','nuevo habito','crear categoría','crear categoria','nueva subcategoría','nueva subcategoria']);
  if(exact.has(h))return true;
  if(content.querySelector('.v27-kind-chip.tasks,.v27-kind-chip.habits,.dashboard-card.v27-create-card,.v27-subcategory-grid,.v27-category-picker,.v27-items-list,.tasks-group'))return true;
  return false;
}

function markDuplicateHeading(content){
  content.querySelectorAll('.tasks-group-header').forEach(h=>h.classList.remove('tf1282-duplicate-heading'));
  const main=txt(content.querySelector(':scope > .window-header-main h2'));
  if(!main)return;
  content.querySelectorAll('.tasks-group-header').forEach(group=>{
    const t=txt(group.querySelector('h4'));
    if(t&&t===main)group.classList.add('tf1282-duplicate-heading');
  });
}

function apply(){
  installStyle();
  renameMentalista();
  const container=document.getElementById('windowContainer');
  const content=document.getElementById('windowContent');
  if(!container||!content)return;
  clearTargetClasses(container);
  if(!container.classList.contains('open'))return;
  if(container.classList.contains('rank-modal'))return;

  const store=container.classList.contains('store-modal')||!!content.querySelector('.v79-store-shell');
  const routine=!!content.querySelector('.v96-mentalist-scroll,.v97-routine-scroll');
  const management=!store&&!routine&&isManagement(content);

  if(store){
    clearOldLayout(container,content);
    container.classList.add('tf1282-store');
    return;
  }
  if(routine){
    clearOldLayout(container,content);
    container.classList.add('tf1282-routine');
    renameMentalista();
    return;
  }
  if(management){
    clearOldLayout(container,content);
    container.classList.add('tf1282-management');
    markDuplicateHeading(content);
  }
}

function schedule(){
  requestAnimationFrame(apply);
  setTimeout(apply,60);
  setTimeout(apply,185);
  setTimeout(apply,360);
  setTimeout(apply,700);
  setTimeout(apply,1120);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
document.addEventListener('click',schedule,{capture:true,passive:true});
window.addEventListener('resize',schedule,{passive:true});
})();
