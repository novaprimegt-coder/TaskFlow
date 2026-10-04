(function(){
'use strict';
if(window.__tfV13054Bridge)return;window.__tfV13054Bridge=true;
function addCss(){if(document.getElementById('tfV13051ProfileCss'))return;const l=document.createElement('link');l.id='tfV13051ProfileCss';l.rel='stylesheet';l.href='./taskflow-v13051-profile-compact.css?v=13051-20261004';document.head.appendChild(l)}
function addScript(id,src){if(document.getElementById(id))return;const s=document.createElement('script');s.id=id;s.src=src;s.async=false;document.body.appendChild(s)}
function boot(){addCss();addScript('tfV13051ProfileJs','./taskflow-v13051-profile-compact.js?v=13051-20261004');addScript('tfV13053SearchStabilityJs','./taskflow-v13053-search-stability.js?v=13053-20261004');addScript('tfV13053VisualPolishJs','./taskflow-v13053-visual-polish.js?v=13053-20261004');addScript('tfV13054SearchCompleteJs','./taskflow-v13054-search-complete.js?v=13054-20261004')}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();