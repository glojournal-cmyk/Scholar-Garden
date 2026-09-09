const V='scholars-garden-v0-4-0-alpha5-rf2-20260909';
const CORE=`${V}-core`,RUN=`${V}-runtime`;
const FILES=[
 './','./index.html',
 './styles.css?v=0.4.0-a5-rc4','./scholar-assets.css?v=0.4.0-a5-rc4','./latin-games.css?v=0.4.0-a5-rc4',
 './v04-visual.css?v=0.4.0-a5-rc4','./v04-ui-assets.css?v=0.4.0-a5-rc4','./v04-alpha3.css?v=0.4.0-a5-rc4','./v04-alpha4.css?v=0.4.0-a5-rc4','./v04-alpha4-1.css?v=0.4.0-a5-rc4',
 './v04-alpha5-parity.css?v=0.4.0-a5-rc4',
 './v04-rebuild-final.css?v=0.4.0-a5-rf2','./v04-rebuild-final.js?v=0.4.0-a5-rf2',
 './alpha5-parity.js?v=0.4.0-a5-rc4',
 './v04-alpha5-p1.css?v=0.4.0-a5-rc4',
 './alpha5-p1.js?v=0.4.0-a5-rc4',
 './v04-alpha5-p2.css?v=0.4.0-a5-rc4',
 './alpha5-p2.js?v=0.4.0-a5-rc4',
 './v04-alpha5-p3.css?v=0.4.0-a5-rc4',
 './alpha5-p3.js?v=0.4.0-a5-rc4',
 './v04-alpha5-p4.css?v=0.4.0-a5-rc4',
 './alpha5-p4.js?v=0.4.0-a5-rc4',
 './v04-alpha5-rc.css?v=0.4.0-a5-rc4',
 './alpha5-rc.js?v=0.4.0-a5-rc4',
 './alpha5-rc2.js?v=0.4.0-a5-rc4',
 './alpha5-rc3.js?v=0.4.0-a5-rc4',
 './manifest.webmanifest',
 './offline.html',
 './latin-question-bank.js?v=0.4.0-a5-rc4','./growth.js?v=0.4.0-a5-rc4','./latin-module.js?v=0.4.0-a5-rc4',
 './french-module.js?v=0.4.0-a5-rc4','./latin-games.js?v=0.4.0-a5-rc4','./science-notes.js?v=0.4.0-a5-rc4',
 './biology-y8.js?v=0.4.0-a5-rc4','./language-y8.js?v=0.4.0-a5-rc4',
 './daily-plan.js?v=0.4.0-a5-rc4','./scholar-assets.js?v=0.4.0-a5-rc4','./v04-art-config.js?v=0.4.0-a5-rc4',
 './avatar-layer-system.js?v=0.4.0-a5-rc4','./garden-growth.js?v=0.4.0-a5-rc4',
 './v04-visual.js?v=0.4.0-a5-rc4','./v04-ui-assets.js?v=0.4.0-a5-rc4',
 './subject-hub.js?v=0.4.0-a5-rc4','./scholar.js?v=0.4.0-a5-rc4','./app.js?v=0.4.0-a5-rc4',
 './mcp-reference-marker.mjs?v=0.4.0-a5-rc4','./mcp-runtime-index.json','./mcp-concept-index.json','./mcp-origin-map.json','./mcp-language-summary.json',
 './bio-y8-question-bank.json','./bio-y8-answer-bank.json','./bio-y8-concept-bank.json',
 './bio-y8-keyword-bank.json','./bio-y8-notes-by-topic.json','./bio-y8-diagram-specs.json',
 './scholar_idle.png','./garden_growth_01_seed.webp','./favicon_192.png','./favicon_512.png','./apple_touch_icon_180.png','./app_icon_maskable_512.png',
 './final_subject_latin.webp','./final_subject_french.webp','./final_subject_biology.webp','./final_subject_chemistry.webp','./final_subject_physics.webp','./final_game_forma.webp','./final_game_mosaic.webp','./final_game_verbum.webp','./final_game_manuscript.webp','./final_home_scholar.webp','./final_garden_main.webp','./final_garden_herb.webp','./final_garden_fountain.webp','./final_collection_inkpot.webp','./final_collection_desklamp.webp','./final_collection_studybooks.webp','./final_collection_ivy.webp','./final_collection_globe.webp','./final_collection_stylus.webp','./final_collection_waxtablet.webp','./final_collection_fountainpen.webp','./final_collection_lavender.webp','./final_collection_lexicon.webp','./final_collection_bench.webp','./final_collection_lantern.webp','./final_collection_compass.webp','./final_collection_pressed.webp','./final_collection_cat.webp','./final_medal_firststeps.webp','./final_medal_streak.webp','./final_medal_garden.webp','./final_medal_master.webp','./final_medal_latin.webp','./final_medal_french.webp','./final_scholar_crest.webp','./final_french_scholar.webp','./final_biology_scholar.webp'
,
 './rf2_garden_stage_1.webp',
 './rf2_garden_stage_2.webp',
 './rf2_garden_stage_3.webp',
 './rf2_garden_stage_4.webp',
 './rf2_garden_stage_5.webp',
 './rf2_garden_stage_6.webp',
 './rf2_garden_stage_7.webp',
 './rf2_garden_stage_8.webp',
 './rf2_garden_stage_9.webp',
 './rf2_garden_stage_10.webp',
 './rf2_subject_latin.webp',
 './rf2_subject_french.webp',
 './rf2_subject_biology.webp',
 './rf2_subject_chemistry.webp',
 './rf2_subject_physics.webp',
 './rf2_subject_english.webp',
 './rf2_progress_1.webp',
 './rf2_progress_2.webp',
 './rf2_progress_3.webp',
 './rf2_progress_4.webp',
 './rf2_progress_5.webp',
 './rf2_progress_6.webp',
 './rf2_progress_7.webp',
 './rf2_progress_8.webp',
 './rf2_progress_9.webp',
 './rf2_progress_10.webp',
 './rf2_ui_1.webp',
 './rf2_ui_2.webp',
 './rf2_ui_3.webp',
 './rf2_ui_4.webp',
 './rf2_ui_5.webp',
 './rf2_ui_6.webp',
 './rf2_ui_7.webp',
 './rf2_ui_8.webp',
 './rf2_ui_9.webp',
 './rf2_ui_10.webp',
 './rf2_state_1.webp',
 './rf2_state_2.webp',
 './rf2_state_3.webp',
 './rf2_state_4.webp',
 './rf2_state_5.webp',
 './rf2_state_6.webp',
 './rf2_state_7.webp',
 './rf2_state_8.webp',
 './rf2_state_9.webp',
 './rf2_state_10.webp',
 './rf2_object_desk_lamp.webp',
 './rf2_object_ink_pot.webp',
 './rf2_object_study_books.webp',
 './rf2_object_ivy_pot.webp',
 './rf2_object_globe.webp',
 './rf2_object_lexicon.webp',
 './rf2_object_fountain.webp',
 './rf2_object_rose_arch.webp',
 './rf2_object_study_table.webp',
 './rf2_object_bird_bath.webp'];

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
   }).catch(async()=>{
     const exact=await caches.match(req);
     if(exact)return exact;
     const shell=await caches.match('./index.html');
     if(shell)return shell;
     const offline=await caches.match('./offline.html');
     return offline||Response.error();
   }));
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
 if(event.data==='SKIP_WAITING'||event.data?.type==='SKIP_WAITING')self.skipWaiting();
});
