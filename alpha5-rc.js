
(() => {
'use strict';
const requiredScreens=['homeScreen','studyScreen','subjectScreen','gardenScreen','scholarScreen'];
const alphaAssets=[
 'v04-alpha5-parity.css','alpha5-parity.js',
 'v04-alpha5-p1.css','alpha5-p1.js',
 'v04-alpha5-p2.css','alpha5-p2.js',
 'v04-alpha5-p3.css','alpha5-p3.js',
 'v04-alpha5-p4.css','alpha5-p4.js',
 'v04-alpha5-rc.css','alpha5-rc.js'
];

function onceRuntimeAudit(){
 if(document.documentElement.dataset.alpha5RcAudit)return;
 document.documentElement.dataset.alpha5RcAudit='1';

 const missing=requiredScreens.filter(id=>!document.getElementById(id));
 const duplicateIds=[...new Set([...document.querySelectorAll('[id]')].map(e=>e.id).filter((id,i,a)=>a.indexOf(id)!==i))];

 if(missing.length) console.warn('[Alpha5 RC] Missing required screens:',missing);
 if(duplicateIds.length) console.warn('[Alpha5 RC] Duplicate IDs detected:',duplicateIds);

 // Mark the shell for CSS/debugging without changing academic state.
 document.documentElement.classList.add('alpha5-rc');

 // Lazy-load decorative images where safe.
 document.querySelectorAll('img:not([loading])').forEach(img=>{
   if(!img.closest('.site-header,.top-header,.app-header') && !img.id?.toLowerCase().includes('hero')){
     img.loading='lazy';
   }
   if(!img.hasAttribute('decoding'))img.decoding='async';
 });

 window.Alpha5RC={
   version:'V0.4.0 Alpha5 RC1',
   requiredScreens:[...requiredScreens],
   presentationAssets:[...alphaAssets],
   audit(){return {missingScreens:missing.slice(),duplicateIds:duplicateIds.slice()}}
 };
}

document.addEventListener('DOMContentLoaded',onceRuntimeAudit);
})();
