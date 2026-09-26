(function(){
'use strict';
if(window.__tfV126RoutineTight)return;window.__tfV126RoutineTight=true;

const STYLE_ID='tfV126RoutineTightStyle';
const ROUTINE_SCROLL='.v96-mentalist-scroll,.v97-routine-scroll';

function installStyle(){
 if(document.getElementById(STYLE_ID))return;
 const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
.v96-mentalist-scroll,.v97-routine-scroll{
 height:auto!important;min-height:0!important;max-height:calc(100dvh - 190px)!important;
 flex:0 1 auto!important;margin-bottom:0!important;padding-bottom:10px!important;
 overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;
 overscroll-behavior-y:contain!important;touch-action:pan-y!important;align-content:start!important;
}
.v96-mentalist-scroll>:last-child,.v97-routine-scroll>:last-child{margin-bottom:0!important}
.window-container.open:not(.rank-modal){padding-bottom:max(106px,calc(82px + env(safe-area-inset-bottom)))!important;scroll-padding-bottom:max(106px,calc(82px + env(safe-area-inset-bottom)))!important}
.window-container.open:not(.rank-modal)>.window-content{margin-bottom:0!important;min-height:0!important;height:auto!important;padding-bottom:10px!important}
#tf503020Overlay.tf503020-overlay.open{overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;overscroll-behavior-y:contain!important;padding-bottom:max(106px,calc(82px + env(safe-area-inset-bottom)))!important;scroll-padding-bottom:max(106px,calc(82px + env(safe-area-inset-bottom)))!important}
#tf503020Overlay .tf503020-shell{height:auto!important;min-height:0!important;max-height:none!important;margin-bottom:0!important}
#tf503020Overlay .tf503020-content{height:auto!important;min-height:0!important;margin-bottom:0!important;padding-bottom:10px!important}
`;
 document.head.appendChild(s);
}

function visibleLeafBottom(scroll){
 const sr=scroll.getBoundingClientRect();
 let bottom=0;
 for(const el of scroll.querySelectorAll('*')){
  if(el.children.length)continue;
  const tag=el.tagName;
  if(tag==='PATH'||tag==='SVG'||tag==='DEFS'||tag==='STYLE'||tag==='SCRIPT')continue;
  const cs=getComputedStyle(el);
  if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0)continue;
  if(cs.position==='fixed'||cs.position==='absolute')continue;
  const r=el.getBoundingClientRect();
  if(r.width<1||r.height<1)continue;
  const b=r.bottom-sr.top+scroll.scrollTop;
  if(b>bottom)bottom=b;
 }
 return bottom;
}

function shrinkAncestors(scroll){
 let p=scroll.parentElement,depth=0;
 while(p&&p!==document.body&&depth<6){
  const r=p.getBoundingClientRect(),cs=getComputedStyle(p);
  const full=cs.position==='fixed'&&r.width>=innerWidth*.92&&r.height>=innerHeight*.82;
  if(full)break;
  p.style.setProperty('height','auto','important');
  p.style.setProperty('min-height','0','important');
  p.style.setProperty('margin-bottom','0','important');
  if(cs.display.includes('flex'))p.style.setProperty('flex','0 1 auto','important');
  p=p.parentElement;depth++;
 }
}

function compactOne(scroll){
 if(!scroll||!scroll.isConnected)return;
 shrinkAncestors(scroll);
 scroll.style.setProperty('height','auto','important');
 scroll.style.setProperty('min-height','0','important');
 scroll.style.setProperty('margin-bottom','0','important');
 scroll.style.setProperty('padding-bottom','10px','important');
 const maxH=Math.max(240,innerHeight-190);
 scroll.style.setProperty('max-height',maxH+'px','important');
 const used=visibleLeafBottom(scroll);
 if(used>0){
  const wanted=Math.ceil(Math.max(120,Math.min(used+12,maxH)));
  scroll.style.setProperty('height',wanted+'px','important');
 }
}

function compactAll(){
 installStyle();
 document.querySelectorAll(ROUTINE_SCROLL).forEach(compactOne);
 const fifty=document.getElementById('tf503020Overlay');
 if(fifty){
  fifty.style.setProperty('padding-bottom','max(106px,calc(82px + env(safe-area-inset-bottom)))','important');
  fifty.style.setProperty('scroll-padding-bottom','max(106px,calc(82px + env(safe-area-inset-bottom)))','important');
 }
}

function schedule(){requestAnimationFrame(compactAll);setTimeout(compactAll,80);setTimeout(compactAll,220)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
document.addEventListener('click',schedule,{capture:true,passive:true});
window.addEventListener('resize',schedule,{passive:true});
})();
