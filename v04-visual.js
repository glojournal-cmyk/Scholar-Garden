
(()=>{
'use strict';

const SCENES=Object.freeze({
 home:'v04_home_hero.webp',
 study:'v04_study_hub_hero.webp',
 garden:'v04_garden_hero.webp',
 scholar:'v04_scholar_profile_hero.webp',
 subject:{
  latin:'v04_latin_subject_hero.webp',
  french:'v04_french_subject_hero.webp',
  biology:'v04_biology_subject_hero.webp',
  chemistry:'v04_chemistry_subject_hero.webp',
  physics:'v04_physics_subject_hero.webp'
 },
 tab:{
  latin:{learn:'v04_latin_learn_hero.webp',practice:'v04_latin_practice_hero.webp',progress:'v04_latin_progress_hero.webp',play:'v04_latin_games_hero.webp'},
  french:{learn:'v04_french_learn_hero.webp',practice:'v04_french_practice_hero.webp',progress:'v04_french_progress_hero.webp',play:'v04_french_subject_hero.webp'},
  biology:{learn:'v04_biology_learn_hero.webp',practice:'v04_biology_subject_hero.webp',progress:'v04_biology_progress_hero.webp',play:'v04_biology_subject_hero.webp'},
  chemistry:{learn:'v04_chemistry_subject_hero.webp',practice:'v04_chemistry_subject_hero.webp',progress:'v04_chemistry_subject_hero.webp',play:'v04_chemistry_subject_hero.webp'},
  physics:{learn:'v04_physics_subject_hero.webp',practice:'v04_physics_subject_hero.webp',progress:'v04_physics_subject_hero.webp',play:'v04_physics_subject_hero.webp'}
 }
});

const subjectNames=['latin','french','biology','chemistry','physics'];

function cssUrl(file){return `url("./${file}")`}
function setScreenHero(id,file){
 const el=document.getElementById(id);
 if(el&&file)el.style.setProperty('--v04-hero-image',cssUrl(file));
}
function detectStudyCards(){
 document.querySelectorAll('#studyScreen .study-card').forEach(card=>{
   const title=(card.querySelector('h3')?.textContent||'').trim().toLowerCase();
   const subject=subjectNames.find(s=>title.startsWith(s));
   if(!subject)return;
   card.dataset.v04Subject=subject;
   card.style.setProperty('--v04-card-image',cssUrl(SCENES.subject[subject]));
 });
}
function setYear(mode){
 const current=document.querySelector('#studyScreen .study-band:not(.foundation-band)');
 const foundation=document.querySelector('#studyScreen .foundation-band');
 if(current)current.classList.toggle('v04-year-hidden',mode!=='current');
 if(foundation)foundation.classList.toggle('v04-year-hidden',mode!=='foundation');
 document.querySelectorAll('[data-v04-year]').forEach(b=>{
   const active=b.dataset.v04Year===mode;
   b.classList.toggle('active',active);
   b.setAttribute('aria-pressed',String(active));
 });
 try{sessionStorage.setItem('scholarGardenV04StudyYear',mode)}catch{}
}
function home(){
 const el=document.getElementById('homeScreen');if(!el)return;
 el.dataset.v04='home';
 // Keep the dynamic Scholar full-render asset visible on Home so equipped outfits still matter.
 setScreenHero('homeScreen',SCENES.home);
}
function study(){
 const el=document.getElementById('studyScreen');if(!el)return;
 el.dataset.v04='study';
 setScreenHero('studyScreen',SCENES.study);
 detectStudyCards();
 let saved='current';try{saved=sessionStorage.getItem('scholarGardenV04StudyYear')||'current'}catch{}
 setYear(saved==='foundation'?'foundation':'current');
}
function subject(subject,track,tab='learn'){
 const el=document.getElementById('subjectScreen');if(!el)return;
 el.dataset.v04Subject=subject;
 el.dataset.v04Track=track;
 el.dataset.v04Tab=tab;
 const file=SCENES.tab[subject]?.[tab]||SCENES.subject[subject];
 if(file)el.style.setProperty('--v04-hero-image',cssUrl(file));
}
function garden(){
 const el=document.getElementById('gardenScreen');if(!el)return;
 el.dataset.v04='garden';
 // Academic/growth stage logic still controls #gardenImage; this background is decorative only.
 setScreenHero('gardenScreen',SCENES.garden);
}
function scholar(tab='wardrobe'){
 const el=document.getElementById('scholarScreen');if(!el)return;
 el.dataset.v04='scholar';el.dataset.v04ScholarTab=tab;
 setScreenHero('scholarScreen',SCENES.scholar);
}

document.addEventListener('click',e=>{
 const year=e.target.closest('[data-v04-year]');
 if(year){e.preventDefault();setYear(year.dataset.v04Year)}
});

window.V04Visual=Object.freeze({SCENES,home,study,subject,garden,scholar,setYear});
})();
