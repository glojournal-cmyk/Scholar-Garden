
const V='scholars-garden-v0-3-0-20260906';
const CORE=`${V}-core`,RUN=`${V}-runtime`;
const FILES=[
 './','./index.html','./styles.css?v=0.3.0','./latin-games.css?v=0.3.0','./manifest.webmanifest',
 './latin-question-bank.js?v=0.3.0','./growth.js?v=0.3.0','./latin-module.js?v=0.3.0',
 './french-module.js?v=0.3.0','./latin-games.js?v=0.3.0','./app.js?v=0.3.0'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CORE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('scholars-garden-')&&![CORE,RUN].includes(k)).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const u=new URL(e.request.url);
 const image=e.request.destination==='image'||/\.(webp|png|jpe?g|svg)$/i.test(u.pathname);
 const frenchData=/\/French-Revision\/(question-bank|vocab-bank|writing-bank|notes-by-section|reference-marker)\.(json|js)$/i.test(u.pathname);
 if(image||frenchData){
  e.respondWith(caches.open(RUN).then(async c=>{const hit=await c.match(e.request);if(hit)return hit;try{const r=await fetch(e.request);if(r&&r.ok)c.put(e.request,r.clone());return r}catch(err){return hit||Response.error()}}));return;
 }
 e.respondWith(fetch(e.request).then(r=>{if(r&&r.ok)caches.open(RUN).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
