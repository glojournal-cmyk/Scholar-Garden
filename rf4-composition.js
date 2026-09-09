
(()=>{
'use strict';
const SUBJECT_ART={
 latin:'rf2_subject_latin.webp',
 french:'rf2_subject_french.webp',
 biology:'rf2_subject_biology.webp',
 chemistry:'rf2_subject_chemistry.webp',
 physics:'rf2_subject_physics.webp',
 english:'rf2_subject_english.webp'
};
const SUBJECT_VISUALS={
 french:{learn:'rf3_french_lesson.webp',practice:'rf3_french_practice.webp',play:'rf3_french_vocab.webp',progress:'rf3_french_mastery.webp'},
 biology:{learn:'rf3_biology_lesson.webp',practice:'rf3_biology_practice.webp',play:'rf3_biology_microscopy.webp',progress:'rf3_biology_mastery.webp'}
};
const q=(s,r=document)=>r.querySelector(s);
const qa=(s,r=document)=>[...r.querySelectorAll(s)];

function subjectKey(card){
 const t=(q('h3',card)?.textContent||'').trim().toLowerCase();
 return Object.keys(SUBJECT_ART).find(k=>t.startsWith(k))||'';
}
function decorateStudy(){
 qa('#studyScreen .study-card').forEach(card=>{
   const key=subjectKey(card);
   if(!key||q('.rf4-study-art',card))return;
   const img=document.createElement('img');
   img.className='rf4-study-art';
   img.alt='';
   img.loading='lazy';
   img.decoding='async';
   img.src=`./${SUBJECT_ART[key]}`;
   card.prepend(img);
   card.dataset.rf4Subject=key;
 });
}
function syncSubjectArt(){
 const screen=q('#subjectScreen'),fig=q('.rf4-subject-art',screen);
 if(!screen||!fig)return;
 const subject=(screen.dataset.v04Subject||q('#subjectTitle',screen)?.textContent||'').trim().toLowerCase();
 const tab=screen.dataset.v04Tab||qa('[data-subject-tab].active',screen)[0]?.dataset.subjectTab||'learn';
 const file=SUBJECT_VISUALS[subject]?.[tab]||SUBJECT_ART[subject];
 const img=q('img',fig),caption=q('figcaption b',fig);
 if(!file){fig.hidden=true;return}
 fig.hidden=false;
 if(img&&img.getAttribute('src')!==`./${file}`)img.src=`./${file}`;
 if(img)img.alt=`${subject ? subject[0].toUpperCase()+subject.slice(1) : 'Subject'} study illustration`;
 if(caption)caption.textContent={
   learn:'Learn through clear ideas',
   practice:'Practice with purpose',
   play:'Explore and apply',
   progress:'Progress and mastery'
 }[tab]||'Learn through clear ideas';
}
function polishHome(){
 const g=q('#homeGreeting');
 if(g){
   const raw=g.textContent.trim();
   if(raw&&!/Scholar/i.test(raw))g.textContent=`${raw}, Scholar`;
 }
}
function refresh(){
 decorateStudy();
 syncSubjectArt();
 polishHome();
}
window.addEventListener('DOMContentLoaded',()=>{
 refresh();
 setTimeout(refresh,120);
 setTimeout(refresh,700);
},{once:true});
window.addEventListener('hashchange',()=>setTimeout(refresh,80));
document.addEventListener('alpha5:refresh',()=>setTimeout(refresh,20));
document.addEventListener('scholar:tab-open',()=>setTimeout(refresh,20));
const subject=q('#subjectScreen');
if(subject)new MutationObserver(syncSubjectArt).observe(subject,{attributes:true,attributeFilter:['data-v04-subject','data-v04-tab','data-v04-track']});
const study=q('#studyScreen');
if(study)new MutationObserver(decorateStudy).observe(study,{childList:true,subtree:true});
})();
