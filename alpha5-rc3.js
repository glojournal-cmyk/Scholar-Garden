
(() => {
'use strict';
const VERSION='V0.4.0 Alpha 5 RC4';

function safeJsonParse(raw,fallback=null){
  if(typeof raw!=='string')return fallback;
  try{return JSON.parse(raw)}catch{return fallback}
}
function storageHealth(){
  const issues=[];
  try{
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      if(!k||!k.startsWith('lux-'))continue;
      const raw=localStorage.getItem(k);
      if(raw && /^[\[{]/.test(raw.trim()) && safeJsonParse(raw,undefined)===undefined)issues.push(k);
    }
  }catch{issues.push('localStorage-unavailable')}
  return issues;
}
function normalizeHash(){
  if(!location.hash || location.hash==='#' || /^#\s+$/.test(location.hash)){
    history.replaceState(null,'','#home');
  }
}
function registerSW(){
  if(!('serviceWorker' in navigator)||!/^https?:$/.test(location.protocol))return;
  navigator.serviceWorker.register('./sw.js').then(reg=>{
    document.addEventListener('visibilitychange',()=>{
      if(document.visibilityState==='visible')reg.update().catch(()=>{});
    });
    reg.addEventListener('updatefound',()=>{
      const worker=reg.installing;
      if(!worker)return;
      worker.addEventListener('statechange',()=>{
        if(worker.state==='installed'&&navigator.serviceWorker.controller){
          document.documentElement.dataset.swUpdate='ready';
          window.dispatchEvent(new CustomEvent('scholargarden:update-ready'));
        }
      });
    });
  }).catch(err=>console.warn('[Alpha5 RC3] Service worker registration failed',err));
}
function boot(){
  normalizeHash();
  window.ScholarGardenRuntime={
    version:VERSION,
    storageHealth,
    activateUpdate:async()=>{
      const reg=await navigator.serviceWorker?.getRegistration?.();
      if(reg?.waiting){
        reg.waiting.postMessage({type:'SKIP_WAITING'});
        return true;
      }
      return false;
    }
  };
  window.addEventListener('unhandledrejection',e=>console.error('[Alpha5 RC3] Unhandled promise rejection:',e.reason));
  window.addEventListener('error',e=>console.error('[Alpha5 RC3] Runtime error:',e.error||e.message));
  registerSW();
  const issues=storageHealth();
  if(issues.length)console.warn('[Alpha5 RC3] Storage health issues:',issues);
}
document.addEventListener('DOMContentLoaded',boot);
})();
