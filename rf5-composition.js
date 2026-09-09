
(()=>{
'use strict';
const ART={
  chemistry:{
    learn:'rf5_chemistry_practical.webp',
    practice:'rf5_chemistry_practice.webp',
    play:'rf5_chemistry_lab.webp',
    progress:'rf5_chemistry_reaction.webp'
  },
  physics:{
    learn:'rf5_physics_motion.webp',
    practice:'rf5_physics_practice.webp',
    play:'rf5_physics_night.webp',
    progress:'rf5_physics_observatory.webp'
  }
};
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];

function subjectKey(card){
  const h=(q('h3',card)?.textContent||'').trim().toLowerCase();
  return ['latin','french','biology','chemistry','physics','english'].find(x=>h.startsWith(x))||'';
}
function decorateStudy(){
  qa('#studyScreen .study-card').forEach(card=>{
    if(q('img.rf4-study-art',card))return;
    const key=subjectKey(card);if(!key)return;
    const fallback={
      latin:'rf2_subject_latin.webp',french:'rf2_subject_french.webp',biology:'rf2_subject_biology.webp',
      chemistry:'rf5_chemistry_practical.webp',physics:'rf5_physics_observatory.webp',english:'rf2_subject_english.webp'
    }[key];
    if(!fallback)return;
    const img=document.createElement('img');img.className='rf4-study-art';img.alt='';img.loading='lazy';img.decoding='async';img.src=`./${fallback}`;
    card.prepend(img);
  });
  // Foundation science should use the Year 8-specific supplied scenes.
  qa('#foundationStudyGrid .study-card').forEach(card=>{
    const key=subjectKey(card),img=q('img.rf4-study-art',card);
    const src=key==='chemistry'?'./rf5_chemistry_practical.webp':key==='physics'?'./rf5_physics_observatory.webp':'';
    if(src&&img)img.src=src;
  });
}
function syncSubject(){
  const screen=q('#subjectScreen'),fig=q('.rf4-subject-art',screen),img=q('img',fig);
  if(!screen||!fig||!img)return;
  const subject=(screen.dataset.v04Subject||'').toLowerCase();
  const tab=(screen.dataset.v04Tab||'learn').toLowerCase();
  const track=(screen.dataset.v04Track||'current').toLowerCase();
  if(track==='foundation'&&ART[subject]){
    const src=`./${ART[subject][tab]||ART[subject].learn}`;
    if(img.getAttribute('src')!==src)img.src=src;
    img.alt=`${subject[0].toUpperCase()+subject.slice(1)} Year 8 revision illustration`;
    const cap=q('figcaption b',fig);
    if(cap)cap.textContent={
      learn:'Revision library',
      practice:'Retrieve · apply · repair',
      play:'Explore the science',
      progress:'Evidence and mastery'
    }[tab]||'Year 8 Foundation Review';
  }
}
function wardrobeNote(){
  const note=q('#scholarScreen .avatar-note');
  if(note)note.textContent='Complete Scholar portrait. Headless source images are shown only as labelled garment plates, never as the character portrait.';
}
function refresh(){
  decorateStudy();
  syncSubject();
  wardrobeNote();
}
document.addEventListener('DOMContentLoaded',()=>{
  refresh();setTimeout(refresh,120);setTimeout(refresh,700);
  const subject=q('#subjectScreen');
  if(subject&&window.MutationObserver){
    new MutationObserver(refresh).observe(subject,{attributes:true,attributeFilter:['data-v04-subject','data-v04-track','data-v04-tab']});
  }
},{once:true});
document.addEventListener('click',()=>setTimeout(refresh,0));
document.addEventListener('lux:growth',()=>setTimeout(refresh,0));
window.RF5Composition=Object.freeze({refresh});
})();
