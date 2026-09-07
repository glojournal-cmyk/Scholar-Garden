const V='scholars-garden-v0-4-0-alpha3-avatar-garden-runtime-20260907';
const CORE=`${V}-core`,RUN=`${V}-runtime`;
const FILES=[
 './','./index.html',
 './styles.css?v=0.4.0-a3','./scholar-assets.css?v=0.4.0-a3','./latin-games.css?v=0.4.0-a3',
 './v04-visual.css?v=0.4.0-a3','./v04-ui-assets.css?v=0.4.0-a3','./v04-alpha3.css?v=0.4.0-a3',
 './manifest.webmanifest',
 './latin-question-bank.js?v=0.4.0-a3','./growth.js?v=0.4.0-a3','./latin-module.js?v=0.4.0-a3',
 './french-module.js?v=0.4.0-a3','./latin-games.js?v=0.4.0-a3','./science-notes.js?v=0.4.0-a3',
 './biology-y8.js?v=0.4.0-a3','./language-y8.js?v=0.4.0-a3',
 './daily-plan.js?v=0.4.0-a3','./scholar-assets.js?v=0.4.0-a3','./v04-art-config.js?v=0.4.0-a3',
 './avatar-layer-system.js?v=0.4.0-a3','./garden-growth.js?v=0.4.0-a3',
 './v04-visual.js?v=0.4.0-a3','./v04-ui-assets.js?v=0.4.0-a3',
 './subject-hub.js?v=0.4.0-a3','./scholar.js?v=0.4.0-a3','./app.js?v=0.4.0-a3',
 './mcp-reference-marker.mjs','./mcp-runtime-index.json','./mcp-concept-index.json','./mcp-origin-map.json','./mcp-language-summary.json',
 './bio-y8-question-bank.json','./bio-y8-answer-bank.json','./bio-y8-concept-bank.json',
 './bio-y8-keyword-bank.json','./bio-y8-notes-by-topic.json','./bio-y8-diagram-specs.json',
 './scholar_idle.png','./favicon_192.png','./favicon_512.png','./apple_touch_icon_180.png','./app_icon_maskable_512.png'
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
 event.waitUntil((async()=>{
   const keys=await caches.keys();
   await Promise.all(keys.filter(k=>k.startsWith('scholars-garden-')&&![CORE,RUN].includes(k)).map(k=>caches.delete(k)));
   await self.clients.claim();
 })());
});

self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const req=event.request;
 const u=new URL(req.url);
 const sameOrigin=u.origin===self.location.origin;
 const isNavigation=req.mode==='navigate';
 const isScript=req.destination==='script'||/\.(?:js|mjs)$/i.test(u.pathname);
 const isJson=/\.json$/i.test(u.pathname);
 const isStyle=req.destination==='style'||/\.css$/i.test(u.pathname);
 const isImage=req.destination==='image'||/\.(?:webp|png|jpe?g|svg)$/i.test(u.pathname);

 if(isNavigation){
   event.respondWith(fetch(new Request(req,{cache:'reload'})).then(res=>{
     if(res.ok)caches.open(RUN).then(c=>c.put('./index.html',res.clone()));
     return res;
   }).catch(()=>caches.match('./index.html').then(hit=>hit||Response.error())));
   return;
 }

 // Exact-resource policy: JS / modules / JSON / CSS NEVER fall back to index.html.
 if(sameOrigin&&(isScript||isJson||isStyle)){
   event.respondWith(fetch(req).then(res=>{
     if(!res.ok)throw new Error(`HTTP ${res.status} for ${u.pathname}`);
     caches.open(RUN).then(c=>c.put(req,res.clone()));
     return res;
   }).catch(async()=>{
     const exact=await caches.match(req);
     return exact||Response.error();
   }));
   return;
 }

 if(isImage){
   event.respondWith(caches.open(RUN).then(async cache=>{
     const hit=await cache.match(req);
     try{
       const res=await fetch(req);
       if(res&&res.ok)cache.put(req,res.clone());
       return res;
     }catch(err){
       return hit||Response.error();
     }
   }));
   return;
 }

 event.respondWith(fetch(req).then(res=>{
   if(res&&res.ok)caches.open(RUN).then(c=>c.put(req,res.clone()));
   return res;
 }).catch(async()=>{
   const exact=await caches.match(req);
   return exact||Response.error();
 }));
});

self.addEventListener('message',event=>{
 if(event.data==='SKIP_WAITING')self.skipWaiting();
});
