(function(){
'use strict';
if(window.__tfV126RoutineTight)return;window.__tfV126RoutineTight=true;

const STYLE_ID='tfV126RoutineTightStyle';
const ROUTINE_SCROLL='.v96-mentalist-scroll,.v97-routine-scroll';
const AD_SAFE=96;

function installStyle(){
 if(document.getElementById(STYLE_ID))return;
 const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
.v96-mentalist-scroll,.v97-routine-scroll{
 height:auto!important;min-height:0!important;max-height:none!important;
 flex:0 1 auto!important;margin-bottom:0!important;padding-bottom:6px!important;
 overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;
 overscroll-behavior-y:contain!important;touch-action:pan-y!important;align-content:start!important;
}
.v96-mentalist-scroll>:last-child,.v97-routine-scroll>:last-child{margin-bottom:0!important}
.tf126-routine-overlay{
 bottom:96px!important;height:auto!important;max-height:none!important;
 padding-bottom:0!important;scroll-padding-bottom:0!important;
 align-items:flex-start!important;
}
.tf126-routine-content{
 margin-bottom:0!important;padding-bottom:0!important;
 min-height:0!important;height:auto!important;max-height:none!important;
}
#tf503020Overlay.tf503020-overlay.open{
 top:0!important;bottom:96px!important;height:auto!important;max-height:none!important;
 overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;
 touch-action:pan-y!important;overscroll-behavior-y:contain!important;
 padding-bottom:0!important;scroll-padding-bottom:0!important;
}
#tf503020Overlay .tf503020-shell{
 height:auto!important;min-height:0!important;max-height:none!important;margin-bottom:0!important;
}
#tf503020Overlay .tf503020-content{
 height:auto!important;min-height:0!important;margin-bottom:0!important;padding-bottom:6px!important;
}
@media(max-width:680px){
 .tf126-routine-overlay{bottom:96px!important}
 #tf503020Overlay.tf503020-overlay.open{bottom:96px!important}
}
`;
 document.head.appendChild(s);
}

function tag(scroll){
 const overlay=scroll.closest('.window-container,.mentalist-modal,.routine-modal');
 if(overlay)overlay.classList.add('tf126-routine-overlay');
 const content=scroll.closest('.window-content');
 if(content)content.classList.add('tf126-routine-content');
 return overlay;
}

function compactOne(scroll){
 if(!scroll||!scroll.isConnected)return;
 tag(scroll);
 scroll.style.setProperty('height','auto','important');
 scroll.style.setProperty('min-height','0','important');
 scroll.style.setProperty('max-height','none','important');
 scroll.style.setProperty('margin-bottom','0','important');
 scroll.style.setProperty('padding-bottom','6px','important');

 const top=scroll.getBoundingClientRect().top;
 const available=Math.max(220,Math.floor(innerHeight-AD_SAFE-top-6));
 const needed=Math.max(1,Math.ceil(scroll.scrollHeight));
 const wanted=Math.min(needed,available);
 scroll.style.setProperty('height',wanted+'px','important');
 scroll.style.setProperty('max-height',available+'px','important');
 scroll.style.setProperty('overflow-y',needed>available?'auto':'visible','important');
}

function compactAll(){
 installStyle();
 document.querySelectorAll(ROUTINE_SCROLL).forEach(compactOne);
 const fifty=document.getElementById('tf503020Overlay');
 if(fifty){
  fifty.style.setProperty('bottom',AD_SAFE+'px','important');
  fifty.style.setProperty('height','auto','important');
  fifty.style.setProperty('max-height','none','important');
  fifty.style.setProperty('padding-bottom','0','important');
  fifty.style.setProperty('scroll-padding-bottom','0','important');
 }
}

function schedule(){
 requestAnimationFrame(compactAll);
 setTimeout(compactAll,60);
 setTimeout(compactAll,180);
 setTimeout(compactAll,360);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
document.addEventListener('click',schedule,{capture:true,passive:true});
window.addEventListener('resize',schedule,{passive:true});
})();
