
(()=>{
'use strict';
const COLLECTION_ART={
 'ink-pot':'rf2_object_ink_pot.webp','desk-lamp':'rf2_object_desk_lamp.webp',
 'study-books':'rf2_object_study_books.webp','ivy-pot':'rf2_object_ivy_pot.webp',
 'bronze-stylus':'final_collection_stylus.webp','wax-tablet':'final_collection_waxtablet.webp',
 'fountain-pen':'final_collection_fountainpen.webp','lavender-vase':'final_collection_lavender.webp',
 'scholars-globe':'rf2_object_globe.webp','golden-lexicon':'rf2_object_lexicon.webp'
};
const MEDAL_ART={
 'first-steps':'final_medal_firststeps.webp','daily-disciplina':'final_medal_streak.webp',
 'latin-scholar':'final_medal_latin.webp','french-scholar':'final_medal_french.webp',
 'polyglot':'final_medal_master.webp'
};
const GAME_ART={
 forma:'final_game_forma.webp',mosaic:'final_game_mosaic.webp',
 verbum:'final_game_verbum.webp',manuscript:'final_game_manuscript.webp'
};
const SUBJECT_ART={
 latin:'rf2_subject_latin.webp',french:'rf2_subject_french.webp',
 biology:'rf2_subject_biology.webp',chemistry:'rf2_subject_chemistry.webp',physics:'rf2_subject_physics.webp',english:'rf2_subject_english.webp'
};
function q(s,r=document){return r.querySelector(s)}
function qa(s,r=document){return [...r.querySelectorAll(s)]}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function installWelcome(){
 const home=q('#homeScreen'); if(!home||q('.lr-welcome',home))return;
 const greeting=q('#homeGreeting')?.textContent||'Welcome, Scholar';
 const date=q('#homeDate')?.textContent||'';
 const wrap=document.createElement('header');
 wrap.className='lr-welcome';
 wrap.innerHTML=`<div><p class="eyebrow">LUX ET LABOR</p><h1 data-lr-greeting>${esc(greeting)}, Scholar</h1><p data-lr-date>${esc(date)}</p></div>
 <button type="button" class="secondary" data-global-route="study">Open Study Hub</button>`;
 home.prepend(wrap);
}
function syncWelcome(){
 const el=q('[data-lr-greeting]'),src=q('#homeGreeting');
 if(el&&src){
   const raw=src.textContent.trim();
   el.textContent=/Scholar/i.test(raw)?raw:`${raw}, Scholar`;
 }
 const d=q('[data-lr-date]'),sd=q('#homeDate');if(d&&sd)d.textContent=sd.textContent;
}
function makeJourneyInteractive(){
 const main=q('#mainQuest');
 ['daily','reward'].forEach(kind=>{
  const old=q(`[data-journey="${kind}"]`); if(!old||old.tagName==='BUTTON')return;
  const b=document.createElement('button'); b.type='button';b.className=old.className;b.dataset.journey=kind;b.innerHTML=old.innerHTML;
  b.onclick=()=>{
   if(kind==='daily')main?.scrollIntoView({behavior:'smooth',block:'center'});
   else location.hash='#scholar/collection';
  };
  old.replaceWith(b);
 });
}
function fixGameArt(){
 qa('#gamesHub [data-gamev2-start]').forEach(card=>{
   const id=card.dataset.gamev2Start, img=q('img',card); if(img&&GAME_ART[id])img.src=`./${GAME_ART[id]}`;
 });
}
function fixStudyArt(){
 qa('#studyScreen .study-card').forEach(card=>{
   const name=(q('h3',card)?.textContent||'').trim().toLowerCase();
   const key=Object.keys(SUBJECT_ART).find(k=>name.startsWith(k));
   const img=q('img',card);if(key&&img)img.src=`./${SUBJECT_ART[key]}`;
 });
}
function decorateCollection(){
 qa('#collectionGrid .collect-card').forEach(card=>{
   const title=q('h3',card)?.textContent.trim()||'';
   const entry=Object.entries(COLLECTION_ART).find(([id])=>id.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())===title.replace('’',"'"));
   let file=entry?.[1];
   if(!file){
     const normalized=title.toLowerCase().replace(/[’']/g,'').replace(/\s+/g,'-');
     file=COLLECTION_ART[normalized]||COLLECTION_ART[normalized.replace('scholars','scholars')];
   }
   const art=q('.collect-art',card);
   if(file&&art){
     art.innerHTML=`<img src="./${file}" alt="${esc(title)}" loading="lazy" decoding="async">`;
     card.dataset.lrAsset=file;
   }
   card.tabIndex=0;card.setAttribute('role','button');
   card.setAttribute('aria-label',`View ${title}`);
 });
}
function decorateAchievements(){
 qa('#medalGrid .medal-card').forEach(card=>{
   const title=q('b',card)?.textContent.trim()||'';
   const id={
    'First Steps':'first-steps','Daily Disciplina':'daily-disciplina','Latin Scholar':'latin-scholar',
    'French Scholar':'french-scholar','Polyglot Scholar':'polyglot'
   }[title];
   const img=q('img',card);if(id&&img&&MEDAL_ART[id])img.src=`./${MEDAL_ART[id]}`;
 });
}
function installDialog(){
 if(q('#lrAssetDialog'))return;
 const d=document.createElement('dialog');d.id='lrAssetDialog';d.className='lr-asset-dialog';
 d.innerHTML='<div class="lr-dialog-grid"><img alt=""><div class="lr-dialog-copy"><p class="eyebrow">COLLECTION</p><h2></h2><p></p><button type="button" class="secondary">Close</button></div></div>';
 document.body.appendChild(d);
 q('button',d).onclick=()=>d.close();
 d.addEventListener('click',e=>{if(e.target===d)d.close()});
}
function openCollection(card){
 const d=q('#lrAssetDialog');if(!d)return;
 const title=q('h3',card)?.textContent||'Collection item', copy=q('p',card)?.textContent||'';
 const img=q('.collect-art img',card);
 q('h2',d).textContent=title;q('.lr-dialog-copy>p:not(.eyebrow)',d).textContent=copy;
 const di=q('img',d);di.src=img?.src||'./final_scholar_crest.webp';di.alt=title;
 d.showModal();
}
function bindCollection(){
 document.addEventListener('click',e=>{const c=e.target.closest('#collectionGrid .collect-card');if(c)openCollection(c)});
 document.addEventListener('keydown',e=>{const c=e.target.closest?.('#collectionGrid .collect-card');if(c&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openCollection(c)}});
}
function updateBrand(){
 const img=q('.brand-mark img');if(img){img.src='./final_scholar_crest.webp';img.alt=''}
}
function decorateQuickPlay(){
 qa('#quickPlayGrid [data-quick-game]').forEach(btn=>{
   const card=btn.closest('.quick-play-card'),icon=q('.quick-play-icon',card);if(!card||!icon)return;
   const id=btn.dataset.quickGame;
   const file=GAME_ART[id] || (btn.dataset.gameSubject==='french'?'final_subject_french.webp':null);
   if(file)icon.style.backgroundImage=`url("./${file}")`;
 });
}
function syncGardenArt(){
 let stage=1;try{stage=Number(window.LuxGrowth?.snapshot?.().gardenStage)||1}catch{}
 const img=q('#gardenImage');if(img){
   const safeStage=Math.max(1,Math.min(10,Math.floor(stage)));
   img.src=`./rf2_garden_stage_${safeStage}.webp`;
   img.alt=`Scholar's Garden — stage ${safeStage}`;
 }
}
function installGardenCollection(){
 const screen=q('#gardenScreen');if(!screen)return;
 let section=q('.lr-garden-collection',screen);
 if(!section){
   section=document.createElement('section');section.className='lr-garden-collection';
   const world=q('.garden-world',screen);world?.after(section);
 }
 let state={};try{state=window.LuxGrowth?.load?.()||{}}catch{}
 const items=[
   ['ink-pot','Ink Pot','rf2_object_ink_pot.webp'],
   ['study-books','Study Books','rf2_object_study_books.webp'],
   ['ivy-pot','Ivy Pot','rf2_object_ivy_pot.webp'],
   ['scholars-globe',"Scholar’s Globe",'rf2_object_globe.webp']
 ];
 section.innerHTML=`<div class="section-title"><div><p class="eyebrow">GARDEN COLLECTION</p><h2>Objects grown through study</h2></div><button type="button" class="text-button" data-lr-open-collection>View all</button></div>
 <div class="lr-garden-grid">${items.map(([id,name,file])=>{const earned=!!state.collectibles?.[id];return `<button type="button" class="lr-garden-object" data-lr-garden-item="${id}"><img src="./${file}" alt="${esc(name)}"><span><b>${esc(name)}</b><small>${earned?'Unlocked':'Locked'}</small></span></button>`}).join('')}</div>`;
 q('[data-lr-open-collection]',section).onclick=()=>location.hash='#scholar/collection';
 qa('[data-lr-garden-item]',section).forEach(b=>b.onclick=()=>location.hash='#scholar/collection');
}

const RF3_SUBJECT_VISUALS={
 french:{
  learn:'rf3_french_lesson.webp',
  practice:'rf3_french_practice.webp',
  play:'rf3_french_vocab.webp',
  progress:'rf3_french_mastery.webp'
 },
 biology:{
  learn:'rf3_biology_lesson.webp',
  practice:'rf3_biology_practice.webp',
  play:'rf3_biology_microscopy.webp',
  progress:'rf3_biology_mastery.webp'
 }
};
function installRF3Home(){
 const home=q('#homeScreen'); if(!home)return;
 let hero=q('.rf3-home-hero',home);
 if(!hero){
  hero=document.createElement('section'); hero.className='rf3-home-hero';
  hero.innerHTML=`<div class="rf3-home-copy">
    <p class="eyebrow">LUX ET LABOR · THE SCHOLAR'S GARDEN</p>
    <h1 data-rf3-home-greeting>Welcome, Scholar</h1>
    <p class="rf3-home-date" data-rf3-home-date></p>
    <p class="rf3-home-lede">One thoughtful session at a time. Continue your learning and let the garden grow with your real study progress.</p>
    <div class="rf3-home-actions">
      <button type="button" class="primary" data-global-route="study">Continue studying</button>
      <button type="button" class="secondary light" data-global-route="garden">Visit the Garden</button>
    </div>
    <div class="rf3-home-live">
      <span><small>SCHOLAR LEVEL</small><b>Lv <i data-growth="level">1</i></b></span>
      <span><small>SCHOLAR XP</small><b><i data-growth="xp">0</i> XP</b></span>
    </div>
  </div>`;
  const overview=q('.v04-home-overview',home);
  overview?.before(hero);
 }
 const greet=q('#homeGreeting')?.textContent?.trim()||'Welcome';
 q('[data-rf3-home-greeting]',hero).textContent=/Scholar/i.test(greet)?greet:`${greet}, Scholar`;
 q('[data-rf3-home-date]',hero).textContent=q('#homeDate')?.textContent||'';
 try{
   const s=window.LuxGrowth?.snapshot?.();
   if(s){
     const lv=q('[data-growth="level"]',hero); const xp=q('[data-growth="xp"]',hero);
     if(lv)lv.textContent=s.level??1;
     if(xp)xp.textContent=s.xp??0;
   }
 }catch{}
}
function installRF3SubjectHero(){
 const screen=q('#subjectScreen');if(!screen)return;
 const art=q('.rf4-subject-art',screen);if(!art)return;
 const subject=screen.dataset.v04Subject||q('#subjectTitle')?.textContent?.trim().toLowerCase()||'';
 const tab=screen.dataset.v04Tab||'learn';
 const file=RF3_SUBJECT_VISUALS[subject]?.[tab]||SUBJECT_ART[subject];
 const img=q('img',art),cap=q('figcaption b',art);
 if(file&&img){
   img.src=`./${file}`;
   img.alt=`${subject ? subject[0].toUpperCase()+subject.slice(1) : 'Subject'} study illustration`;
   if(cap)cap.textContent=tab==='progress'?'Progress and mastery':tab==='practice'?'Practice with purpose':tab==='play'?'Explore and apply':'Learn through clear ideas';
   art.hidden=false;
 }else art.hidden=true;
}
function installRF3SubjectGallery(){
 const study=q('#studyScreen');if(!study)return;
 q('.v04-study-hero-copy p:not(.eyebrow)',study)?.classList.add('rf3-study-intro');
}
function cleanPrototypeCopy(){
 qa('.character-art-label').forEach(el=>el.remove());
 const note=q('.avatar-note'); if(note) note.textContent='Choose a complete Scholar appearance. Styles become available through study.';
 const page=q('#scholarScreen .page-title p:last-child'); if(page) page.textContent='Your character, wardrobe, collection and achievements — shaped by your study journey.';
}

function refresh(){
 makeJourneyInteractive();fixGameArt();fixStudyArt();decorateCollection();decorateAchievements();decorateQuickPlay();syncGardenArt();installGardenCollection();installRF3SubjectHero();installRF3SubjectGallery();cleanPrototypeCopy();
}
window.addEventListener('DOMContentLoaded',()=>{
 updateBrand();installDialog();bindCollection();refresh();
 setTimeout(refresh,100);setTimeout(refresh,700);
},{once:true});
window.addEventListener('hashchange',()=>setTimeout(refresh,80));
document.addEventListener('alpha5:refresh',()=>setTimeout(refresh,0));
document.addEventListener('lux:growth',()=>setTimeout(refresh,0));
document.addEventListener('scholar:tab-open',()=>setTimeout(refresh,0));
const subjectScreen=q('#subjectScreen');
if(subjectScreen)new MutationObserver(()=>installRF3SubjectHero()).observe(subjectScreen,{attributes:true,attributeFilter:['data-v04-subject','data-v04-tab','data-v04-track']});
})();
