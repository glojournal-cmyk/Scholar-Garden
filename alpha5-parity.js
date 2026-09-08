
(() => {
'use strict';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

const SUBJECT_META={
 latin:{label:'Latin',hero:'./v04_latin_subject_hero.webp',quote:'Non scholae sed vitae discimus.'},
 french:{label:'French',hero:'./v04_french_subject_hero.webp',quote:'Une autre langue, une autre façon de voir le monde.'},
 biology:{label:'Biology',hero:'./v04_biology_subject_hero.webp',quote:'In every leaf, a lesson.'},
 chemistry:{label:'Chemistry',hero:'./v04_chemistry_subject_hero.webp',quote:'From elements to a brighter tomorrow.'},
 physics:{label:'Physics',hero:'./v04_physics_subject_hero.webp',quote:'Curiosity moves the world.'}
};
const TAB_COPY={
 learn:['Learn','Explore lessons, vocabulary and culture.'],
 practice:['Practise','Build your skills with targeted exercises.'],
 play:['Play','Make learning feel like play.'],
 progress:['Progress','See how far you have grown.']
};

function currentSubject(){
 const parts=(location.hash||'').replace(/^#/,'').split('/').filter(Boolean);
 if(parts[0]!=='subject')return null;
 return (parts[1]||'latin').replace(/-foundation$/,'');
}
function currentTab(){
 const parts=(location.hash||'').replace(/^#/,'').split('/').filter(Boolean);
 return ['learn','practice','play','progress'].includes(parts[2])?parts[2]:'learn';
}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function addNavTools(){
 const nav=$('.global-nav'); if(!nav || $('.a5-nav-tools',nav))return;
 const tools=document.createElement('div');
 tools.className='a5-nav-tools';
 tools.innerHTML=`
  <button type="button" aria-label="Search" title="Search">⌕</button>
  <button type="button" aria-label="Notifications" title="Notifications">♢</button>
  <button type="button" class="a5-avatar" data-global-route="scholar" aria-label="Open Scholar">
    <img src="./scholar_idle.png" alt="">
  </button>`;
 tools.querySelector('[aria-label="Search"]').onclick=()=>window.LuxApp?.toast?.('Search is coming in the next study tools pass.');
 tools.querySelector('[aria-label="Notifications"]').onclick=()=>window.LuxApp?.toast?.('No new study notifications.');
 nav.appendChild(tools);
}

function addStudyDashboard(){
 const screen=$('#studyScreen'); if(!screen || $('.a5-study-dashboard',screen))return;
 const dash=document.createElement('section');
 dash.className='a5-study-dashboard';
 dash.setAttribute('aria-label','Study overview');
 dash.innerHTML=`
  <article class="a5-dashboard-card">
    <p class="eyebrow">OVERALL PROGRESS</p>
    <h3>Your learning is growing</h3>
    <div class="a5-progress-line"><i></i></div>
    <div class="a5-mini-list">
      <div><span>Latin foundation</span><b>Keep going</b></div>
      <div><span>French foundation</span><b>Review due</b></div>
      <div><span>Biology</span><b>Explore</b></div>
    </div>
  </article>
  <article class="a5-dashboard-card">
    <p class="eyebrow">TODAY'S GOALS</p>
    <h3>Small steps, steady progress</h3>
    <div class="a5-mini-list">
      <div><span>✓ Complete a practice set</span></div>
      <div><span>○ Review due questions</span></div>
      <div><span>○ Learn one new topic</span></div>
    </div>
  </article>
  <article class="a5-dashboard-card a5-reco">
    <p class="eyebrow">RECOMMENDED</p>
    <h3>Continue where you left off</h3>
    <p>Return to a focused subject session and strengthen one area at a time.</p>
    <button class="primary" type="button" data-a5-recommend>Open Latin</button>
  </article>`;
 dash.querySelector('[data-a5-recommend]').onclick=()=>{location.hash='#subject/latin/practice'};
 const foundation=$('.foundation-band',screen);
 if(foundation)screen.insertBefore(dash,foundation);
 else screen.appendChild(dash);
}

function syncSubjectHero(){
 const subject=currentSubject(); if(!subject)return;
 const meta=SUBJECT_META[subject]||SUBJECT_META.latin;
 const header=$('.subject-hub-header');
 if(header)header.style.setProperty('--a5-subject-hero',`url("${meta.hero}")`);
 const screen=$('#subjectScreen');
 if(screen)screen.dataset.a5Subject=subject;
}
function addSubjectActions(){
 const screen=$('#subjectScreen'),tabs=$('.subject-tabs',screen);
 if(!screen||!tabs)return;
 let wrap=$('.a5-subject-actions',screen);
 if(!wrap){
   wrap=document.createElement('div');wrap.className='a5-subject-actions';
   wrap.innerHTML=Object.entries(TAB_COPY).map(([tab,[title,copy]])=>`
    <button type="button" class="a5-subject-action" data-a5-subject-tab="${tab}">
      <strong>${title}</strong><small>${copy}</small>
    </button>`).join('');
   screen.insertBefore(wrap,tabs);
   $$('[data-a5-subject-tab]',wrap).forEach(b=>b.onclick=()=>{
     const subject=currentSubject()||'latin';
     const raw=(location.hash||'').split('/')[1]||subject;
     location.hash=`#subject/${raw}/${b.dataset.a5SubjectTab}`;
   });
 }
 const tab=currentTab();
 $$('[data-a5-subject-tab]',wrap).forEach(b=>b.classList.toggle('active',b.dataset.a5SubjectTab===tab));
 syncSubjectHero();
}

function enhanceLesson(){
 const pane=$('#genericLearnPane'); if(!pane)return;
 const note=$('.note-detail',pane);
 if(!note){
   pane.classList.remove('a5-lesson-workspace');
   $('.a5-lesson-rail',pane)?.remove();
   return;
 }
 pane.classList.add('a5-lesson-workspace');
 if($('.a5-lesson-rail',pane))return;
 const subject=currentSubject()||'latin';
 const meta=SUBJECT_META[subject]||SUBJECT_META.latin;
 const title=$('h2',note)?.textContent||`${meta.label} lesson`;
 const points=$$('li',note).slice(0,4).map(x=>x.textContent.trim()).filter(Boolean);
 const rail=document.createElement('aside');
 rail.className='a5-lesson-rail';
 rail.innerHTML=`
   <img src="${meta.hero}" alt="">
   <div class="a5-lesson-rail-body">
     <p class="eyebrow">MUST REMEMBER</p>
     <h3>${esc(title)}</h3>
     <ul class="a5-remember">
       ${(points.length?points:['Read the examples carefully.','Notice the pattern before practising.','Review mistakes as part of learning.']).map(x=>`<li>✓ ${esc(x)}</li>`).join('')}
     </ul>
     <p class="profile-note">“${esc(meta.quote)}”</p>
   </div>`;
 pane.appendChild(rail);
}

function parseProgressText(text){
 const m=String(text||'').match(/(\d+)\s*\/\s*(\d+)/);
 if(!m)return {n:1,total:8,pct:12.5};
 const n=Number(m[1]), total=Math.max(1,Number(m[2]));
 return {n,total,pct:Math.min(100,Math.round(n/total*100))};
}
function enhancePractice(){
 const pane=$('#genericPracticePane');if(!pane)return;
 const quiz=$('.quiz-card',pane);
 if(!quiz){
   pane.classList.remove('a5-practice-workspace');
   $('.a5-practice-rail',pane)?.remove();
   return;
 }
 pane.classList.add('a5-practice-workspace');
 if($('.a5-practice-rail',pane))return;
 const subject=currentSubject()||'latin';
 const meta=SUBJECT_META[subject]||SUBJECT_META.latin;
 const progress=parseProgressText($('.quiz-top b',quiz)?.textContent);
 const topic=$('.quiz-top span',quiz)?.textContent?.split('·')[0]?.trim()||'Current topic';
 const rail=document.createElement('aside');
 rail.className='a5-practice-rail';
 rail.innerHTML=`
  <p class="eyebrow">PRACTICE SESSION</p>
  <h3>${esc(meta.label)} Session</h3>
  <div class="a5-ring" style="--a5-ring:${progress.pct}%"><span>${progress.n} / ${progress.total}</span></div>
  <div class="a5-practice-meta">
    <div><span>Questions</span><b>${progress.n} / ${progress.total}</b></div>
    <div><span>Current topic</span><b>${esc(topic)}</b></div>
    <div><span>Mode</span><b>Focused practice</b></div>
  </div>
  <p class="profile-note" style="margin-top:16px">Progress, not perfection. Every answer strengthens the next step.</p>`;
 pane.appendChild(rail);
}
function enhanceFeedback(){
 const fb=$('#mcpFeedback .feedback');
 if(!fb || fb.dataset.a5Enhanced)return;
 fb.dataset.a5Enhanced='true';
 const heading=$('h3',fb);
 if(heading && /correct/i.test(heading.textContent)){
   heading.textContent='Well done — '+heading.textContent;
 }
}

let scheduled=false;
function enhance(){
 if(scheduled)return;
 scheduled=true;
 requestAnimationFrame(()=>{
   scheduled=false;
   addNavTools();
   addStudyDashboard();
   addSubjectActions();
   enhanceLesson();
   enhancePractice();
   enhanceFeedback();
 });
}
document.addEventListener('DOMContentLoaded',enhance);
document.addEventListener('alpha5:refresh',enhance);
})();
