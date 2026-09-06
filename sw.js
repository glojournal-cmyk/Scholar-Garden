const V='scholars-garden-v0-3-ux-reset-20260906';
const CORE=`${V}-core`,RUN=`${V}-runtime`;
const FILES=[
 './','./index.html','./styles.css?v=0.3.0-reset','./latin-games.css?v=0.3.0-reset','./manifest.webmanifest',
 './latin-question-bank.js?v=0.3.0-reset','./growth.js?v=0.3.0-reset','./latin-module.js?v=0.3.0-reset',
 './french-module.js?v=0.3.0-reset','./latin-games.js?v=0.3.0-reset','./science-notes.js?v=0.3.0-reset',
 './daily-plan.js?v=0.3.0-reset','./subject-hub.js?v=0.3.0-reset','./scholar.js?v=0.3.0-reset','./app.js?v=0.3.0-reset'
];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CORE).then(cache=>cache.addAll(FILES)));
 self.skipWaiting();
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(
  keys.filter(k=>k.startsWith('scholars-garden-')&&![CORE,RUN].includes(k)).map(k=>caches.delete(k))
 )));
 self.clients.claim();
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const u=new URL(event.request.url);
 const image=event.request.destination==='image'||/\.(webp|png|jpe?g|svg)$/i.test(u.pathname);
 const frenchData=/\/French-Revision\/(question-bank|vocab-bank|writing-bank|notes-by-section|reference-marker)\.(json|js)$/i.test(u.pathname);
 if(image||frenchData){
  event.respondWith(caches.open(RUN).then(async cache=>{
   const hit=await cache.match(event.request);
   try{
    const response=await fetch(event.request);
    if(response&&response.ok)cache.put(event.request,response.clone());
    return response;
   }catch(err){return hit||Response.error()}
  }));
  return;
 }
 event.respondWith(fetch(event.request).then(response=>{
  if(response&&response.ok)caches.open(RUN).then(cache=>cache.put(event.request,response.clone()));
  return response;
 }).catch(()=>caches.match(event.request).then(hit=>hit||caches.match('./index.html'))));
});
