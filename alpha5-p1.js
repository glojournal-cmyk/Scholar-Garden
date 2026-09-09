
(() => {
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const safe=(s)=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function homeIntro(){
 const screen=$('#homeScreen'); if(!screen || $('.a5-home-intro',screen)) return;
 const wrap=document.createElement('section');
 wrap.className='a5-home-intro';
 wrap.innerHTML=`
   <article class="a5-home-intro-copy">
     <p class="eyebrow">THE SCHOLAR'S GARDEN</p>
     <h1>Good morning, Scholar</h1>
     <p>Small steps today, a brighter tomorrow. Continue one focused lesson, review what is due, and let your garden grow with you.</p>
   </article>
   <aside class="a5-home-quote"><div><blockquote>“Knowledge is a garden that always grows.”</blockquote><small>— LUX ET LABOR</small></div></aside>`;
 const first=screen.firstElementChild;
 screen.insertBefore(wrap,first);
}

function readGarden(){
 const stage=$('#gardenStageText')?.textContent?.trim()||'Stage 1';
 const level=$('[data-growth="level"]')?.textContent?.trim()||'1';
 const next=$('#gardenUnlockName')?.textContent?.trim()||'Next unlock';
 const nextLabel=$('#gardenNextLabel')?.textContent?.trim()||'Keep studying';
 return {stage,level,next,nextLabel};
}
function gardenParity(){
 const screen=$('#gardenScreen'); if(!screen)return;
 let summary=$('.a5-garden-summary',screen);
 if(!summary){
  summary=document.createElement('section');summary.className='a5-garden-summary';
  const world=$('.garden-world',screen); world?.after(summary);
 }
 const g=readGarden();
 summary.innerHTML=`
  <article class="a5-garden-card"><div><p class="eyebrow">CURRENT STAGE</p><h3>${safe(g.stage)}</h3><p>A peaceful place where steady study takes root.</p></div><div class="a5-progress-line"><i style="width:62%"></i></div></article>
  <article class="a5-garden-card"><div><p class="eyebrow">SCHOLAR LEVEL</p><h3>Lv. ${safe(g.level)}</h3><p>Your garden grows alongside your learning journey.</p></div><div class="a5-progress-line"><i style="width:64%"></i></div></article>
  <article class="a5-garden-card next"><div><p class="eyebrow">NEXT UNLOCK</p><h3>${safe(g.next)}</h3><p>${safe(g.nextLabel)} until the next visual reward.</p></div></article>`;
 if(!$('.a5-garden-panels',screen)){
  const panels=document.createElement('section');panels.className='a5-garden-panels';
  panels.innerHTML=`
   <article class="a5-garden-panel">
    <p class="eyebrow">YOUR GARDEN COLLECTION</p><h2>Objects you've unlocked</h2>
    <div class="a5-garden-collection">
      <div class="a5-garden-token"><img src="./reward_interaction_plant.png" alt=""><b>Potted Herb</b></div>
      <div class="a5-garden-token"><img src="./reward_interaction_book_stack.png" alt=""><b>Bookshelf</b></div>
      <div class="a5-garden-token"><img src="./reward_interaction_ink_pot.png" alt=""><b>Ink Pot</b></div>
      <div class="a5-garden-token"><img src="./reward_interaction_classical_ornament.png" alt=""><b>Ornament</b></div>
    </div>
   </article>
   <article class="a5-garden-panel">
    <p class="eyebrow">DAILY GARDEN TASKS</p><h2>Tend your garden</h2>
    <div class="a5-garden-task"><span>○</span><span>Complete a study session</span><b>Study</b></div>
    <div class="a5-garden-task"><span>○</span><span>Review due questions</span><b>Review</b></div>
    <div class="a5-garden-task"><span>○</span><span>Explore a garden object</span><b>Explore</b></div>
    <button type="button" class="primary" data-garden-open style="margin-top:14px">Tend Garden</button>
   </article>`;
  screen.appendChild(panels);
  $('[data-garden-open]',panels).onclick=()=>$('#gardenExplore')?.click();
 }
}

function scholarSummary(){
 const screen=$('#scholarScreen');if(!screen)return;
 const pane=$('[data-scholar-pane="overview"]',screen);if(!pane||$('.a5-scholar-summary',pane))return;
 const el=document.createElement('section');el.className='a5-scholar-summary';
 el.innerHTML=`
  <article class="a5-scholar-hero">
    <p class="eyebrow">YOUR SCHOLAR</p>
    <h2>Dress, collect, achieve, and grow.</h2>
    <p>The same Scholar accompanies every lesson. Build a wardrobe, gather keepsakes, unlock achievements and watch your garden flourish.</p>
  </article>
  <article class="a5-scholar-level">
    <p class="eyebrow">SCHOLAR LEVEL</p>
    <strong>Lv. <span data-a5-level>1</span></strong>
    <p>A brighter you, one lesson at a time.</p>
    <div class="a5-progress-line"><i style="width:64%"></i></div>
  </article>`;
 pane.insertBefore(el,pane.firstChild);
}
function syncScholarLevel(){
 const src=$('[data-growth="level"]')?.textContent||'1';
 const dst=$('[data-a5-level]'); if(dst)dst.textContent=src;
}

function wardrobeFilters(){
 const pane=$('[data-scholar-pane="wardrobe"]');const panel=$('.wardrobe-panel',pane);
 if(!pane||!panel||$('.a5-wardrobe-filters',panel))return;
 const f=document.createElement('div');f.className='a5-wardrobe-filters';
 f.innerHTML=`<button class="active" data-a5-outfit="all">All</button><button data-a5-outfit="academy">Academy</button><button data-a5-outfit="athletics">Athletics</button><button data-a5-outfit="prestige">Prestige</button>`;
 panel.insertBefore(f,$('#wardrobeControls'));
 $$('[data-a5-outfit]',f).forEach(btn=>btn.onclick=()=>{
   $$('[data-a5-outfit]',f).forEach(x=>x.classList.toggle('active',x===btn));
   const type=btn.dataset.a5Outfit;
   $$('.wardrobe-preview-card',$('#wardrobeControls')).forEach(card=>{
     const text=(card.textContent||'').toLowerCase();
     const show=type==='all'||(type==='athletics'&&/athletics|track/.test(text))||(type==='prestige'&&/prestige|prefect|midnight atelier|noir/.test(text))||(type==='academy'&&!/athletics|track|prestige|prefect|midnight atelier/.test(text));
     card.style.display=show?'':'none';
   });
 });
}

function collectionFeature(){
 const pane=$('[data-scholar-pane="collection"]');if(!pane||$('.a5-collection-feature',pane))return;
 const f=document.createElement('article');f.className='a5-collection-feature';
 f.innerHTML=`<img src="./reward_interaction_proud_book.png" alt="Featured collection"><div><p class="eyebrow">FEATURED COLLECTION</p><h2>The Garden Within</h2><p>A quiet collection of study keepsakes, books and garden objects. Every unlock tells a small story of progress.</p><button class="primary" type="button" data-a5-view-collection>View Collection</button></div>`;
 pane.insertBefore(f,pane.firstChild);
 $('[data-a5-view-collection]',f).onclick=()=>document.querySelector('[data-collection-filter="All"]')?.click();
}
function achievementSummary(){
 const pane=$('[data-scholar-pane="achievements"]');if(!pane||$('.a5-achievement-head',pane))return;
 const h=document.createElement('section');h.className='a5-achievement-head';
 h.innerHTML=`<article class="a5-achievement-stat"><p class="eyebrow">ACHIEVEMENTS UNLOCKED</p><strong data-a5-ach-count>0</strong><p>Celebrate every step of your learning journey.</p></article><article class="a5-achievement-stat"><p class="eyebrow">NEXT MILESTONE</p><strong>Scholar II</strong><p>Keep learning to reveal your next milestone.</p><div class="a5-progress-line"><i style="width:68%"></i></div></article>`;
 pane.insertBefore(h,pane.firstChild);
}
function syncAchievementCount(){
 const cards=$$('#medalGrid .medal-card.earned');
 const el=$('[data-a5-ach-count]'); if(el)el.textContent=`${cards.length} / ${Math.max(cards.length,12)}`;
}

const PREF_KEY='lux-alpha5-prefs';
function prefs(){
 try{return JSON.parse(localStorage.getItem(PREF_KEY)||'{}')}catch{return{}}
}
function savePrefs(v){localStorage.setItem(PREF_KEY,JSON.stringify(v))}
function profileSettings(){
 const pane=$('[data-scholar-pane="profile"]');if(!pane||$('.a5-settings',pane))return;
 const box=document.createElement('section');box.className='a5-settings';
 box.innerHTML=`
   <h2>Settings</h2>
   <div class="a5-setting-row"><div class="a5-setting-copy"><b>Sound Effects</b><small>Play gentle sounds for interactions.</small></div><button class="a5-switch" data-a5-pref="sound" aria-label="Toggle sound effects"></button></div>
   <div class="a5-setting-row"><div class="a5-setting-copy"><b>Gentle Music</b><small>Background music while you study.</small></div><button class="a5-switch" data-a5-pref="music" aria-label="Toggle gentle music"></button></div>
   <div class="a5-setting-row"><div class="a5-setting-copy"><b>Notifications</b><small>Show in-app study reminders.</small></div><button class="a5-switch" data-a5-pref="notifications" aria-label="Toggle notifications"></button></div>
   <div class="a5-setting-row"><div class="a5-setting-copy"><b>Due Review Alerts</b><small>Remind you when review cards become due.</small></div><button class="a5-switch" data-a5-pref="dueAlerts" aria-label="Toggle due review alerts"></button></div>
   <div class="a5-setting-row"><div class="a5-setting-copy"><b>Reduced Motion</b><small>Minimise decorative motion effects.</small></div><button class="a5-switch" data-a5-pref="reducedMotion" aria-label="Toggle reduced motion"></button></div>
   <div class="a5-setting-row"><div class="a5-setting-copy"><b>Theme</b><small>Choose the presentation style for this browser.</small></div><select class="a5-theme-select" data-a5-theme><option>Light (Ivory)</option><option>Quiet Garden</option></select></div>`;
 pane.appendChild(box);
 const p=Object.assign({sound:true,music:true,notifications:true,dueAlerts:true,reducedMotion:false,theme:'Light (Ivory)'},prefs());
 $$('[data-a5-pref]',box).forEach(btn=>{
   const k=btn.dataset.a5Pref;btn.classList.toggle('on',!!p[k]);btn.setAttribute('aria-pressed',String(!!p[k]));
   btn.onclick=()=>{p[k]=!p[k];btn.classList.toggle('on',p[k]);btn.setAttribute('aria-pressed',String(p[k]));savePrefs(p);document.documentElement.classList.toggle('a5-reduced-motion',!!p.reducedMotion)}
 });
 const sel=$('[data-a5-theme]',box);sel.value=p.theme;sel.onchange=()=>{p.theme=sel.value;savePrefs(p)};
 document.documentElement.classList.toggle('a5-reduced-motion',!!p.reducedMotion);
}

function enhance(){
 wardrobeFilters();collectionFeature();profileSettings();
}
document.addEventListener('DOMContentLoaded',enhance);
document.addEventListener('alpha5:refresh',enhance);
})();
