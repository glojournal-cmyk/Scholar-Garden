
(() => {
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const META={
 latin:{label:'Latin',lesson:'./v04_latin_learn_hero.webp',practice:'./v04_latin_practice_hero.webp',progress:'./v04_latin_progress_hero.webp'},
 french:{label:'French',lesson:'./v04_french_learn_hero.webp',practice:'./v04_french_practice_hero.webp',progress:'./v04_french_progress_hero.webp'},
 biology:{label:'Biology',lesson:'./v04_biology_learn_hero.webp',practice:'./v04_biology_subject_hero.webp',progress:'./v04_biology_progress_hero.webp'}
};
function subject(){
 const p=(location.hash||'').replace(/^#/,'').split('/').filter(Boolean);
 return p[0]==='subject'?(p[1]||'latin').replace(/-foundation$/,''):null
}
function meta(){return META[subject()]||META.latin}

function lessonBanner(){
 const pane=$('#genericLearnPane'); if(!pane)return;
 const note=$('.note-detail',pane);
 if(!note){$('.a5-lesson-banner',pane)?.remove();return}
 if($('.a5-lesson-banner',pane))return;
 const m=meta(),title=$('h2',note)?.textContent||`${m.label} lesson`;
 const b=document.createElement('section');b.className='a5-lesson-banner';b.style.setProperty('--a5-banner',`url("${m.lesson}")`);
 b.innerHTML=`<p class="eyebrow">DISCOVER · PRACTISE · UNDERSTAND</p><h2>${safe(title)}</h2><p>Read the explanation, notice the pattern, study the worked examples, then check your understanding.</p><div class="a5-lesson-tabs"><span>Explanation</span><span>Examples</span><span>Common Mistakes</span><span>Check Yourself</span></div>`;
 pane.insertBefore(b,pane.firstChild);
}
function practiceTopline(){
 const pane=$('#genericPracticePane');if(!pane)return;
 const quiz=$('.quiz-card',pane);if(!quiz){$('.a5-practice-topline',pane)?.remove();return}
 if($('.a5-practice-topline',pane))return;
 const label=$('.quiz-top span',quiz)?.textContent||`${meta().label} practice`;
 const progress=$('.quiz-top b',quiz)?.textContent||'1 / 8';
 const top=document.createElement('section');top.className='a5-practice-topline';
 top.innerHTML=`<div class="a5-practice-chip"><b>Topic Practice</b><small>${safe(label)}</small></div><div class="a5-practice-chip"><b>Session</b><small>${safe(progress)} questions</small></div><div class="a5-practice-chip"><b>Weakness Review</b><small>Target gaps when needed</small></div><div class="a5-practice-chip"><b>Due Review</b><small>Keep knowledge fresh</small></div>`;
 pane.insertBefore(top,pane.firstChild);
}
function enrichFeedback(root){
 const fb=$('.feedback',root);if(!fb||fb.dataset.a5P2)return;fb.dataset.a5P2='1';
 const good=fb.classList.contains('good'),h=$('h3',fb);
 if(h&&good&&!/^Well done/i.test(h.textContent))h.textContent='Well done! '+h.textContent.replace(/^Correct\s*\/?\s*met\.?/i,'You got it right.');
 const copy=[...fb.children].filter(x=>x.tagName==='P').map(x=>x.textContent.trim()).filter(Boolean);
 const exp=document.createElement('div');exp.className='a5-feedback-explain';
 exp.innerHTML=`<article class="a5-feedback-card"><b>${good?'Why it works':'Review point'}</b><p>${safe(copy[0]|| (good?'Your answer matches the accepted pattern for this item.':'Review the model answer and try this concept again.'))}</p></article><article class="a5-feedback-card"><b>Remember</b><p>${safe(copy[1]||'Mistakes and successful recall both feed the spaced-review journey.')}</p></article>`;
 const btn=$('button',fb);fb.insertBefore(exp,btn||null);
}
function feedback(){
 ['#bioFeedback','#mcpFeedback','#latinQuizBox','#frenchQuizBox'].forEach(sel=>{const root=$(sel);if(root)enrichFeedback(root)});
}

function progressHero(){
 const pane=$('#genericProgressPane');if(!pane)return;
 const content=pane.children.length;if(!content){$('.a5-progress-hero',pane)?.remove();return}
 if($('.a5-progress-hero',pane))return;
 const m=meta(), h=document.createElement('section');h.className='a5-progress-hero';h.style.setProperty('--a5-progress-art',`url("${m.progress}")`);
 h.innerHTML=`<p class="eyebrow">${safe(m.label.toUpperCase())} PROGRESS</p><h2>See how your knowledge is growing.</h2><p>Mastery, recent work and due review stay connected to the real academic state already stored by the app.</p>`;
 pane.insertBefore(h,pane.firstChild);
}
function engineProgressHero(){
 [['#latinProgress','Latin','./v04_latin_progress_hero.webp'],['#frenchProgress','French','./v04_french_progress_hero.webp']].forEach(([sel,label,art])=>{
  const pane=$(sel);if(!pane||pane.classList.contains('hidden')||$('.a5-progress-hero',pane))return;
  const h=document.createElement('section');h.className='a5-progress-hero';h.style.setProperty('--a5-progress-art',`url("${art}")`);
  h.innerHTML=`<p class="eyebrow">${label.toUpperCase()} PROGRESS</p><h2>Progress looks good on you.</h2><p>Review real topic mastery and keep the next step focused.</p>`;
  pane.insertBefore(h,pane.firstChild);
 });
}

function writing(){
 const section=$('#frenchWriting');if(!section||section.classList.contains('hidden'))return;
 const existing=$('.writing-grid',section);if(!existing||existing.dataset.a5P2)return;existing.dataset.a5P2='1';
 const tasks=$('#frenchWritingTasks'),editor=$('#frenchWritingEditor');if(!tasks||!editor)return;
 const shell=document.createElement('div');shell.className='a5-writing-shell';
 const left=document.createElement('aside');left.className='a5-writing-side left';
 const editorHost=document.createElement('main');editorHost.id='a5WritingEditorHost';
 const right=document.createElement('aside');right.className='a5-writing-side right';
 existing.parentNode.insertBefore(shell,existing);existing.remove();
 left.appendChild(tasks);editorHost.appendChild(editor);
 left.insertAdjacentHTML('beforeend',`<article class="a5-writing-card"><h3>Success Criteria</h3><ul><li>Answer the prompt fully.</li><li>Use a range of vocabulary.</li><li>Give at least one opinion and reason.</li><li>Check agreements and spelling.</li></ul></article>`);
 right.innerHTML=`<article class="a5-writing-card"><h3>Useful Phrases</h3><ul><li>Il y a …</li><li>On peut …</li><li>J’aime … parce que …</li><li>Dans ma ville …</li></ul></article><article class="a5-writing-card"><h3>Connective Words</h3><ul><li>et — and</li><li>mais — but</li><li>aussi — also</li><li>cependant — however</li><li>donc — so</li></ul></article>`;
 shell.append(left,editorHost,right);
}
function biologyScience(){
 if(subject()!=='biology')return;
 const pane=$('#genericPracticePane');if(!pane||!$('.quiz-card',pane)||$('.a5-bio-science-card',pane))return;
 const rail=$('.a5-practice-rail',pane);if(!rail)return;
 const c=document.createElement('article');c.className='a5-bio-science-card';
 c.innerHTML=`<p class="eyebrow">BIOLOGY PRACTICE</p><h3>Think like a scientist.</h3><p>Observe carefully, name the evidence, and connect structure to function before checking your answer.</p>`;
 rail.appendChild(c);
}
let busy=false;
function enhance(){
 if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;lessonBanner();practiceTopline();feedback();progressHero();engineProgressHero();writing();biologyScience()})
}
document.addEventListener('DOMContentLoaded',enhance);
document.addEventListener('alpha5:refresh',enhance);
})();
