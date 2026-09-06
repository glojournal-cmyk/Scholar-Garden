const V='scholars-garden-v0-3-4-1-critical-functional-fix-20260906';
const CORE=`${V}-core`,RUN=`${V}-runtime`;
const FILES=[
 './','./index.html','./styles.css?v=0.3.4.1.1','./latin-games.css?v=0.3.4.1.1','./manifest.webmanifest',
 './latin-question-bank.js?v=0.3.4.1.1','./growth.js?v=0.3.4.1.1','./latin-module.js?v=0.3.4.1.1',
 './french-module.js?v=0.3.4.1.1','./latin-games.js?v=0.3.4.1.1','./science-notes.js?v=0.3.4.1.1','./biology-y8.js?v=0.3.4.1.1','./language-y8.js?v=0.3.4.1.1','./mcp-reference-marker.mjs','./mcp-runtime-index.json','./mcp-concept-index.json','./mcp-origin-map.json','./mcp-language-summary.json',
 './bio-y8-question-bank.json','./bio-y8-answer-bank.json','./bio-y8-concept-bank.json','./bio-y8-keyword-bank.json','./bio-y8-notes-by-topic.json','./bio-y8-diagram-specs.json',
 './daily-plan.js?v=0.3.4.1.1','./subject-hub.js?v=0.3.4.1.1','./scholar.js?v=0.3.4.1.1','./app.js?v=0.3.4.1.1'
];
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
   const cache=await caches.open(CORE);
   for(const url of FILES){
     const req=new Request(url,{cache:'reload'});
     const res=await fetch(req);
     if(!res.ok)throw new Error(`Precache failed: ${url} ${res.status}`);
     await cache.put(req,res.clone());
   }
 })());
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
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(new Request(event.request,{cache:'reload'})).catch(()=>caches.match('./index.html')));
  return;
 }
 const image=event.request.destination==='image'||/\.(webp|png|jpe?g|svg)$/i.test(u.pathname);
 const frenchData=/\/French-Revision\/(question-bank|vocab-bank|writing-bank|notes-by-section|reference-marker)\.(json|js)$/i.test(u.pathname);
 const masterPackData=/\/(?:mcp-la-|mcp-fr-|mcp-latin-|mcp-french-|mcp-).+\.json$/i.test(u.pathname);
 if(image||frenchData||masterPackData){
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

self.addEventListener('message',event=>{if(event.data==='SKIP_WAITING')self.skipWaiting()});
