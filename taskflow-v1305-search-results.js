(function(){
'use strict';
if(window.__tfV1305SearchResults)return;
window.__tfV1305SearchResults=true;

let input=null,container=null,submitBtn=null,clearBtn=null,modal=null,host=null,activeRoot=null,placeholder=null;
let allowNative=false,lastQuery='';

function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/\s+/g,' ').trim()}
function dispatchNative(value){
  if(!input)return;
  input.value=value;
  allowNative=true;
  try{input.dispatchEvent(new Event('input',{bubbles:true,cancelable:true}))}finally{allowNative=false}
}
function installStyle(){
  if(document.getElementById('tfV1305SearchStyle'))return;
  const s=document.createElement('style');s.id='tfV1305SearchStyle';s.textContent=`
#searchInput::-webkit-search-cancel-button,#searchInput::-webkit-search-decoration{display:none!important;-webkit-appearance:none!important}
#clearSearch{display:none!important}
.search-container{overflow:visible!important}
.tf1305-search-actions{display:flex!important;align-items:center!important;gap:8px!important;flex:0 0 auto!important;margin-left:auto!important}
.tf1305-search-btn{width:42px!important;height:42px!important;min-width:42px!important;border-radius:13px!important;border:1px solid rgba(255,255,255,.10)!important;background:rgba(255,255,255,.045)!important;color:#c9d4e8!important;display:grid!important;place-items:center!important;padding:0!important;margin:0!important;line-height:1!important;font-weight:900!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important;cursor:pointer!important}
.tf1305-search-btn:active{transform:scale(.96)!important}.tf1305-search-btn.clear{font-size:25px!important}.tf1305-search-btn.submit{font-size:25px!important;color:#5ce6da!important;border-color:rgba(78,205,196,.30)!important;background:linear-gradient(145deg,rgba(31,123,132,.23),rgba(20,55,73,.28))!important;box-shadow:0 0 18px rgba(48,215,204,.10),inset 0 1px 0 rgba(255,255,255,.04)!important}
.tf1305-inline-hidden{display:none!important}
#tfSearchModalV1305{position:fixed;inset:0;z-index:2147483646;display:none;align-items:center;justify-content:center;padding:12px;background:rgba(2,6,16,.88);backdrop-filter:blur(10px);overscroll-behavior:none}
#tfSearchModalV1305.open{display:flex}
.tf1305-sheet{width:min(650px,100%);height:min(860px,calc(100dvh - 24px));max-height:calc(100dvh - 24px);display:flex;flex-direction:column;min-height:0;border-radius:24px;border:1px solid rgba(78,205,196,.28);background:linear-gradient(160deg,#121d34 0%,#0a1120 58%,#070c17 100%);box-shadow:0 30px 90px rgba(0,0,0,.68);color:#fff;overflow:hidden}
.tf1305-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:17px 17px 14px;border-bottom:1px solid rgba(255,255,255,.065);background:linear-gradient(180deg,rgba(20,31,54,.98),rgba(14,22,39,.94))}
.tf1305-head small{display:block;color:#55e1d3;font-size:9px;font-weight:950;letter-spacing:.16em}.tf1305-head h2{margin:5px 0 4px;font-size:24px;line-height:1.05}.tf1305-head p{margin:0;color:#96a3b8;font-size:10px;line-height:1.4}.tf1305-x{width:44px;height:44px;flex:0 0 44px;border-radius:14px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.045);color:#fff;font-size:28px;display:grid;place-items:center;padding:0}
.tf1305-host{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain;padding:13px;scrollbar-width:thin;scrollbar-color:#27d8cd rgba(255,255,255,.04)}
.tf1305-host::-webkit-scrollbar{width:5px}.tf1305-host::-webkit-scrollbar-thumb{background:#27d8cd;border-radius:999px}.tf1305-host::-webkit-scrollbar-track{background:rgba(255,255,255,.03)}
.tf1305-empty{padding:22px 16px;border:1px solid rgba(255,255,255,.075);border-radius:16px;background:rgba(255,255,255,.028);color:#97a5ba;text-align:center;font-size:12px;line-height:1.5}
.tf1305-host .tf1305-mounted-results{display:block!important;position:static!important;width:100%!important;max-width:none!important;height:auto!important;max-height:none!important;margin:0!important;padding:0!important;overflow:visible!important;background:transparent!important;border:0!important;box-shadow:none!important}
.tf1305-host .tf1305-mounted-results h1,.tf1305-host .tf1305-mounted-results h2,.tf1305-host .tf1305-mounted-results h3{font-size:16px!important;line-height:1.15!important;margin:0 0 8px!important}
.tf1305-host .tf1305-mounted-results article,.tf1305-host .tf1305-mounted-results [class*="result"],.tf1305-host .tf1305-mounted-results [class*="item"]{font-size:.92em}
@media(max-width:430px){.tf1305-search-btn{width:38px!important;height:38px!important;min-width:38px!important;border-radius:12px!important}.tf1305-search-btn.clear{font-size:23px!important}.tf1305-search-btn.submit{font-size:23px!important}#tfSearchModalV1305{padding:8px}.tf1305-sheet{height:calc(100dvh - 16px);max-height:calc(100dvh - 16px);border-radius:21px}.tf1305-head{padding:15px 14px 12px}.tf1305-head h2{font-size:22px}.tf1305-host{padding:11px}}
`;
  document.head.appendChild(s);
}
function buildModal(){
  if(document.getElementById('tfSearchModalV1305')){modal=document.getElementById('tfSearchModalV1305');host=document.getElementById('tfSearchHostV1305');return}
  modal=document.createElement('div');modal.id='tfSearchModalV1305';modal.setAttribute('aria-hidden','true');
  modal.innerHTML=`<section class="tf1305-sheet" role="dialog" aria-modal="true" aria-labelledby="tfSearchTitleV1305"><header class="tf1305-head"><div><small>BÚSQUEDA TASKFLOW</small><h2 id="tfSearchTitleV1305">Resultados de búsqueda</h2><p id="tfSearchQueryV1305"></p></div><button class="tf1305-x" type="button" data-tf1305-close aria-label="Cerrar">×</button></header><div class="tf1305-host" id="tfSearchHostV1305"></div></section>`;
  document.body.appendChild(modal);host=document.getElementById('tfSearchHostV1305');
  modal.querySelector('[data-tf1305-close]').addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeModal()},true);
}
function ownText(el){return Array.from(el.childNodes).filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.nodeValue||'').join(' ').trim()}
function findResultsRoot(){
  const direct=['searchResults','search-results','resultsContainer','results-container','searchResult','search-result'].map(id=>document.getElementById(id)).find(Boolean);
  if(direct&&!direct.closest('#tfSearchModalV1305'))return direct;
  const all=[...document.querySelectorAll('h1,h2,h3,h4,strong,div,section')];
  let title=all.find(el=>!el.closest('#tfSearchModalV1305')&&norm(ownText(el))==='RESULTADOS DE BUSQUEDA');
  if(!title)title=all.find(el=>!el.closest('#tfSearchModalV1305')&&norm(el.textContent)==='RESULTADOS DE BUSQUEDA');
  if(!title)return null;
  let node=title;
  for(let i=0;i<6&&node&&node!==document.body;i++,node=node.parentElement){
    const txt=norm(node.textContent);
    const cards=node.querySelectorAll('article,button,[role="button"],[class*="card"],[class*="item"],[class*="result"]');
    if(txt.includes('RESULTADOS DE BUSQUEDA')&&cards.length>=1)return node;
  }
  return title.parentElement||null;
}
function hideInlineResults(){
  const root=findResultsRoot();
  if(root&&!root.closest('#tfSearchModalV1305'))root.classList.add('tf1305-inline-hidden');
}
function mountResults(root){
  if(!host)return;
  host.innerHTML='';activeRoot=null;placeholder=null;
  if(!root){host.innerHTML='<div class="tf1305-empty">No se encontraron coincidencias para esta búsqueda.</div>';return}
  placeholder=document.createComment('taskflow-search-results-home');
  root.parentNode&&root.parentNode.insertBefore(placeholder,root);
  root.classList.remove('tf1305-inline-hidden');root.classList.add('tf1305-mounted-results');
  activeRoot=root;host.appendChild(root);
}
function restoreResults(){
  if(activeRoot){
    activeRoot.classList.remove('tf1305-mounted-results');activeRoot.classList.add('tf1305-inline-hidden');
    if(placeholder&&placeholder.parentNode)placeholder.parentNode.insertBefore(activeRoot,placeholder);
    if(placeholder&&placeholder.parentNode)placeholder.parentNode.removeChild(placeholder);
  }
  activeRoot=null;placeholder=null;
}
function resetNativeKeepingText(){
  if(!input)return;
  const shown=input.value;
  dispatchNative('');
  input.value=shown;
  hideInlineResults();
}
function openModalFor(query){
  buildModal();
  const q=document.getElementById('tfSearchQueryV1305');if(q)q.textContent='Resultados para “'+query+'”';
  const previousOverflow=document.body.style.overflow||'';modal.dataset.tfPrevOverflow=previousOverflow;document.body.style.overflow='hidden';
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');
}
function closeModal(){
  if(!modal)return;
  restoreResults();
  modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=modal.dataset.tfPrevOverflow||'';
  resetNativeKeepingText();
}
function submitSearch(){
  if(!input)return;
  const query=input.value.trim();if(!query)return;
  lastQuery=query;
  try{input.blur()}catch(_){}
  if(norm(query)==='SONIDO'){
    document.dispatchEvent(new CustomEvent('taskflow:search-submit',{detail:{query}}));
    return;
  }
  dispatchNative(query);
  requestAnimationFrame(()=>setTimeout(()=>{
    const root=findResultsRoot();
    mountResults(root);
    openModalFor(query);
  },50));
}
function clearSearch(){
  if(!input)return;
  if(modal&&modal.classList.contains('open'))closeModal();
  input.value='';dispatchNative('');lastQuery='';hideInlineResults();
  try{input.focus()}catch(_){}
}
function installControls(){
  input=document.getElementById('searchInput');if(!input)return false;
  container=input.closest('.search-container')||input.parentElement;if(!container)return false;
  try{input.type='text'}catch(_){}
  input.setAttribute('enterkeyhint','search');
  if(input.dataset.tf1305Bound!=='1'){
    input.dataset.tf1305Bound='1';
    input.addEventListener('input',e=>{
      if(allowNative)return;
      e.stopImmediatePropagation();
      hideInlineResults();
    },true);
    input.addEventListener('keydown',e=>{
      if(e.key==='Enter'){e.preventDefault();e.stopImmediatePropagation();submitSearch()}
    },true);
  }
  let actions=document.getElementById('tfSearchActionsV1305');
  if(!actions){
    actions=document.createElement('div');actions.id='tfSearchActionsV1305';actions.className='tf1305-search-actions';
    clearBtn=document.createElement('button');clearBtn.id='tfSearchClearV1305';clearBtn.type='button';clearBtn.className='tf1305-search-btn clear';clearBtn.setAttribute('aria-label','Borrar búsqueda');clearBtn.textContent='×';
    submitBtn=document.createElement('button');submitBtn.id='tfSearchSubmitV1305';submitBtn.type='button';submitBtn.className='tf1305-search-btn submit';submitBtn.setAttribute('aria-label','Enviar búsqueda');submitBtn.textContent='→';
    actions.append(clearBtn,submitBtn);container.appendChild(actions);
    clearBtn.addEventListener('click',clearSearch);submitBtn.addEventListener('click',submitSearch);
  }else{clearBtn=document.getElementById('tfSearchClearV1305');submitBtn=document.getElementById('tfSearchSubmitV1305')}
  const old=document.getElementById('clearSearch');if(old)old.style.display='none';
  hideInlineResults();return true;
}
function boot(){
  installStyle();buildModal();
  if(!installControls()){
    [150,500,1200,2500].forEach(ms=>setTimeout(installControls,ms));
  }
  [250,800,1600,3200].forEach(ms=>setTimeout(hideInlineResults,ms));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
