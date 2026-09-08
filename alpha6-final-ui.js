
(() => {
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

const SUBJECTS={
 latin:{hero:'./v04_latin_subject_hero.webp',learn:'./v04_latin_learn_hero.webp',practice:'./v04_latin_practice_hero.webp',progress:'./v04_latin_progress_hero.webp',play:'./v04_latin_games_hero.webp',label:'Latin',copy:'Read, practise and recognise patterns through focused sessions.'},
 french:{hero:'./v04_french_subject_hero.webp',learn:'./v04_french_learn_hero.webp',practice:'./v04_french_practice_hero.webp',progress:'./v04_french_progress_hero.webp',play:'./v04_french_writing_hero.webp',label:'French',copy:'Build vocabulary, accuracy, writing and spelling through separate learning modes.'},
 biology:{hero:'./v04_biology_subject_hero.webp',learn:'./v04_biology_learn_hero.webp',practice:'./v04_alt_study_scene_05.webp',progress:'./v04_biology_progress_hero.webp',play:'./study_biology_book.png',label:'Biology',copy:'Connect explanations, questions and progress without changing the academic engine.'},
 chemistry:{hero:'./v04_chemistry_subject_hero.webp',learn:'./v04_alt_study_scene_06.webp',practice:'./study_worksheet.png',progress:'./v04_alt_study_scene_02.webp',play:'./study_book_stack.png',label:'Chemistry',copy:'Keep concepts, practice and review visually distinct while preserving real state.'},
 physics:{hero:'./v04_physics_subject_hero.webp',learn:'./v04_alt_study_scene_08.webp',practice:'./study_pen_and_book.png',progress:'./v04_alt_study_scene_09.webp',play:'./study_flashcards.png',label:'Physics',copy:'Move from explanation to practice with a clearer, calmer workspace.'}
};
const STUDY_ART=[
 './v04_latin_subject_hero.webp',
 './v04_french_subject_hero.webp',
 './v04_biology_subject_hero.webp',
 './v04_chemistry_subject_hero.webp',
 './v04_physics_subject_hero.webp',
 './v04_alt_study_scene_01.webp',
 './v04_alt_study_scene_04.webp',
 './v04_alt_study_scene_06.webp'
];

function subjectKey(){
 const title=($('#subjectTitle')?.textContent||'').toLowerCase();
 return Object.keys(SUBJECTS).find(k=>title.includes(k)) || 'latin';
}
function activeMode(){
 const b=$('.subject-tabs button.active,.subject-tabs button[aria-selected="true"]');
 const t=(b?.textContent||'learn').toLowerCase();
 if(t.includes('pract'))return'practice';
 if(t.includes('progress'))return'progress';
 if(t.includes('play')||t.includes('game'))return'play';
 return'learn';
}
function diversifyHome(){
 const map=[
  ['.a6-hero>img','./v04_home_hero.webp'],
  ['.a6-continue img','./v04_alt_study_scene_03.webp'],
  ['.a6-quick img','./v04_alt_study_scene_07.webp'],
  ['.a6-garden img','./garden_02.webp']
 ];
 map.forEach(([s,src])=>{const el=$(s);if(el&&el.getAttribute('src')!==src)el.src=src});
}
function decorateStudy(){
 const cards=$$('#studyScreen .study-grid > *');
 cards.forEach((card,i)=>{
   card.dataset.a6Art='1';
   card.style.setProperty('--a6-card-art',`url("${STUDY_ART[i%STUDY_ART.length]}")`);
 });
}
function subjectStrip(){
 const screen=$('#subjectScreen'); if(!screen)return;
 const k=subjectKey(), meta=SUBJECTS[k], mode=activeMode();
 const header=$('.subject-hub-header',screen);
 if(header) header.style.setProperty('--a6-subject-art',`url("${meta.hero}")`);
 let strip=$('.a6-subject-strip',screen);
 if(!strip){
   strip=document.createElement('section');strip.className='a6-subject-strip';
   const content=$('#subjectContent',screen);
   if(content) content.before(strip);
 }
 if(strip){
   const art=meta[mode]||meta.learn;
   const modeLabel=mode==='practice'?'Practice':mode==='progress'?'Progress':mode==='play'?'Play':'Learn';
   strip.innerHTML=`
    <article class="a6-subject-strip-card">
      <img src="${art}" alt="">
      <div class="a6-subject-strip-copy"><small>${meta.label.toUpperCase()} · ${modeLabel.toUpperCase()}</small><h3>${modeLabel} with a clear focus</h3><p>${meta.copy}</p></div>
    </article>
    <article class="a6-subject-strip-mini"><p class="eyebrow">ACADEMIC STATE</p><h3>Your real progress stays authoritative</h3><p>Mastery, due review, answers and XP continue to come from the existing subject engine.</p></article>`;
 }
}
function scholarArt(){
 const img=$('#scholarOverviewImage');
 if(img && !img.closest('.avatar-canvas')) img.src='./scholar_welcome.png';
}
function gardenArt(){
 const img=$('#gardenImage');
 if(img && !img.src.includes('garden_growth_')) img.style.objectPosition='center 48%';
}
function polish(){
 document.documentElement.classList.add('a6-final-ui');
 diversifyHome();decorateStudy();subjectStrip();scholarArt();gardenArt();
}
document.addEventListener('DOMContentLoaded',polish);
document.addEventListener('alpha5:refresh',polish);
window.addEventListener('hashchange',()=>setTimeout(polish,0));
})();
