(function(){
'use strict';
if(window.__tfV13051Bridge)return;window.__tfV13051Bridge=true;
function addCss(){if(document.getElementById('tfV13051ProfileCss'))return;const l=document.createElement('link');l.id='tfV13051ProfileCss';l.rel='stylesheet';l.href='./taskflow-v13051-profile-compact.css?v=13051-20261004';document.head.appendChild(l)}
function addScript(id,src){if(document.getElementById(id))return;const s=document.createElement('script');s.id=id;s.src=src;s.async=false;document.body.appendChild(s)}
function boot(){addCss();addScript('tfV13051ProfileJs','./taskflow-v13051-profile-compact.js?v=13051-20261004');addScript('tfV13051SearchJs','./taskflow-v13051-search-modal.js?v=13051-20261004')}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();