(function(){
'use strict';
const LABEL={latin:'Latin',french:'French',biology:'Biology',chemistry:'Chemistry',physics:'Physics'};
const ICON={latin:'L',french:'F',biology:'B',chemistry:'C',physics:'P'};
let current={subject:'latin',track:'foundation',tab:'practice'};

function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function due(subject){
 if(subject==='latin')return Number(window.LatinModule?.dueCount?.())||0;
 if(subject==='french')return Number(window.FrenchModule?.dueCount?.())||0;
 return 0;
}
function weak(subject){
 if(subject==='latin')return Number(window.LatinModule?.weakCount?.())||0;
 if(subject==='french')return Number(window.FrenchModule?.weakCount?.())||0;
 return 0;
}
function latinMastery(){
 try{
  const s=window.LatinModule?.state?.();const vals=Object.values(s?.categoryCycles||{}).map(x=>x.completedPercent).filter(x=>Number.isFinite(x));
  if(!vals.length)return 'Building foundations';
  const secure=vals.filter(x=>x>=85).length;
  return secure?`${secure} area${secure===1?'':'s'} secure`:'Learning in progress';
 }catch{return 'Learning in progress'}
}
function frenchMastery(){
 try{
  const s=window.FrenchModule?.todayStats?.();
  return s?.loaded?'Learning in progress':'Preparing tools';
 }catch{return 'Learning in progress'}
}
function scienceCard(subject){
 const pack=window.ScholarScience?.get(subject);
 return `<article class="study-card">
   <div class="subject-orb">${ICON[subject]}</div><h3>${LABEL[subject]}</h3>
   <p>Current Year 9 revision notes are ready to learn topic by topic.</p>
   <div class="study-status"><span>${pack?.topics.length||0} learning topics</span><span>Learn available</span></div>
   <div class="card-action"><small>Practice waits for an approved bank</small><button class="primary" data-open-subject="${subject}" data-track="current">Learn</button></div>
 </article>`;
}
function unavailableCurrent(subject){
 return `<article class="study-card">
   <div class="subject-orb">${ICON[subject]}</div><h3>${LABEL[subject]}</h3>
   <p>Current Year 9 lessons are not available yet.</p>
   <div class="unavailable-note">Not available yet</div>
 </article>`;
}
function foundationCard(subject){
 if(subject==='biology'){
   return `<article class="study-card">
    <div class="subject-orb">${ICON[subject]}</div><h3>Biology</h3>
    <p>Year 8 Foundation Review uses the approved structured content pack.</p>
    <div class="unavailable-note">Foundation Biology practice is not available yet.</div>
   </article>`;
 }
 const d=due(subject),w=weak(subject);
 return `<article class="study-card">
   <div class="subject-orb">${ICON[subject]}</div><h3>${LABEL[subject]}</h3>
   <p>Year 8 Foundation Review for consolidation and scheduled recall.</p>
   <div class="study-status"><span>${d} due</span>${w?`<span>${w} to revisit</span>`:'<span>On track</span>'}</div>
   <div class="card-action"><small>${subject==='latin'?latinMastery():frenchMastery()}</small><button class="primary" data-open-subject="${subject}" data-track="foundation">Continue</button></div>
 </article>`;
}
function renderStudy(){
 const currentGrid=document.getElementById('currentStudyGrid'),foundationGrid=document.getElementById('foundationStudyGrid');
 if(!currentGrid||!foundationGrid)return;
 currentGrid.innerHTML=unavailableCurrent('latin')+unavailableCurrent('french')+scienceCard('biology')+scienceCard('chemistry')+scienceCard('physics');
 foundationGrid.innerHTML=foundationCard('latin')+foundationCard('french')+foundationCard('biology');
 document.querySelectorAll('[data-open-subject]').forEach(b=>b.onclick=()=>window.LuxApp.goSubject(b.dataset.openSubject,b.dataset.track));
}

function setHeader(subject,track){
 document.getElementById('subjectIcon').textContent=ICON[subject]||'?';
 document.getElementById('subjectTitle').textContent=LABEL[subject]||subject;
 const pill=document.getElementById('subjectTrack');
 pill.textContent=track==='current'?'Current · Year 9':'Foundation Review · Year 8';
 pill.className=`route-pill ${track==='current'?'current':'foundation'}`;
 document.getElementById('subjectSubtitle').textContent=
   track==='current'?'Learn the current course in a clear topic sequence.':'Consolidate prior learning with spaced review and focused practice.';
 const d=track==='foundation'?due(subject):0;
 document.getElementById('subjectDue').textContent=track==='foundation'&&['latin','french'].includes(subject)?`${d} due`:'Current learning';
 document.getElementById('subjectMastery').textContent=
   track==='foundation'&&subject==='latin'?latinMastery():
   track==='foundation'&&subject==='french'?frenchMastery():
   track==='current'&&window.ScholarScience?.get(subject)?'Learn available':'Not available yet';
 const c=document.getElementById('subjectContinue');
 const available=(track==='foundation'&&['latin','french'].includes(subject))||(track==='current'&&!!window.ScholarScience?.get(subject));
 c.disabled=!available;c.textContent=available?'Continue today':'Not available yet';
 c.onclick=available?()=>continueToday(subject,track):null;
}
function hideAllHosts(){
 document.getElementById('latinScreen').classList.add('hidden');
 document.getElementById('frenchScreen').classList.add('hidden');
 document.querySelectorAll('[data-subject-pane]').forEach(p=>p.classList.add('hidden'));
}
function unavailable(title,copy){
 return `<div class="unavailable-pane"><p class="eyebrow">NOT AVAILABLE YET</p><h2>${esc(title)}</h2><p>${esc(copy)}</p></div>`;
}
function renderScienceLearn(subject){
 const pack=window.ScholarScience?.get(subject),pane=document.getElementById('genericLearnPane');
 if(!pack){pane.innerHTML=unavailable('Current learning','Verified current content is not connected yet.');return}
 const topics=pack.topics;
 pane.innerHTML=`<div class="section-title"><div><p class="eyebrow">CURRENT YEAR 9</p><h2>${pack.subject} Learn</h2></div><span>${topics.length} topics</span></div>
 <div class="note-topic-list">${topics.map(t=>`<article class="note-topic">
   <p class="eyebrow">${esc(t.id)}</p><h3>${esc(t.title)}</h3><p>${esc(t.summary)}</p>
   <button class="secondary" data-open-science-topic="${esc(t.id)}">Open notes</button>
 </article>`).join('')}</div>`;
 pane.querySelectorAll('[data-open-science-topic]').forEach(b=>b.onclick=()=>showScienceTopic(subject,b.dataset.openScienceTopic));
}
function showScienceTopic(subject,id){
 const t=window.ScholarScience?.topic(subject,id),pane=document.getElementById('genericLearnPane');if(!t)return;
 const done=window.ScholarUX?.isScienceRead?.(id);
 pane.innerHTML=`<button class="back-link" id="backTopicList">← All ${esc(LABEL[subject])} topics</button>
 <article class="note-detail">
  <p class="eyebrow">${esc(id)} · CURRENT YEAR 9</p><h2>${esc(t.title)}</h2><p>${esc(t.summary)}</p>
  ${t.must?.length?`<h3>Must memorise</h3><ul>${t.must.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
  ${t.practical?`<h3>Practical / method</h3><p>${esc(t.practical)}</p>`:''}
  ${t.mistakes?.length?`<h3>Common mistakes</h3><ul>${t.mistakes.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
  ${t.extension?`<div class="extension-box"><b>Extension</b><br>${esc(t.extension)}</div>`:''}
  <div class="quiz-actions"><button class="primary" id="markTopicRead">${done?'Reviewed today ✓':'Finish notes'}</button></div>
 </article>`;
 document.getElementById('backTopicList').onclick=()=>renderScienceLearn(subject);
 document.getElementById('markTopicRead').onclick=()=>{window.ScholarUX.markScience(id);window.LuxApp.toast('Notes marked reviewed for today.');showScienceTopic(subject,id)};
 window.ScholarUX.touchSubject(subject);
}
function renderScienceOther(subject,tab){
 const pane=document.getElementById(`generic${tab[0].toUpperCase()+tab.slice(1)}Pane`);
 const copy={
  practice:'Practice is not available yet. Use Learn for now.',
  review:'Review is not available yet. Use Learn for now.',
  play:'Play is not available yet for this subject.',
  progress:'Formal topic progress will appear when Practice becomes available.'
 }[tab];
 pane.innerHTML=unavailable(`${LABEL[subject]} ${tab}`,copy);
}
function renderFoundationBio(tab){
 const pane=document.getElementById(`generic${tab[0].toUpperCase()+tab.slice(1)}Pane`);
 pane.innerHTML=unavailable(`Biology Foundation Review`,
  'Foundation Biology review is not available yet.');
}
function renderFoundationEngine(subject,tab){
 if(subject==='latin'){
   document.getElementById('latinScreen').classList.remove('hidden');
   const map={learn:'latinNotes',practice:'latinHome',play:'gamesHub',progress:'latinProgress'};
   if(tab==='review'){
     document.getElementById('latinScreen').classList.add('hidden');
     const p=document.getElementById('genericReviewPane');p.classList.remove('hidden');
     const d=due('latin'),w=weak('latin');
     p.innerHTML=`<div class="unavailable-pane"><p class="eyebrow">SPACED REVIEW</p><h2>${d?`${d} Latin review${d===1?'':'s'} due`:'Nothing due right now'}</h2><p>${w} item${w===1?'':'s'} remain in the review system. Due recall follows the existing 2-day → 7-day schedule.</p><button class="primary" id="latinDueStart" ${d?'':'disabled'}>Start due review</button></div>`;
     if(d)document.getElementById('latinDueStart').onclick=()=>{document.getElementById('genericReviewPane').classList.add('hidden');document.getElementById('latinScreen').classList.remove('hidden');window.LatinModule.startPractice('Mixed',7,true)};
   }else{
     if(tab==='play'&&window.GameV2)window.GameV2.openHub();else window.LatinModule.show(map[tab]||'latinHome');
   }
 }
 if(subject==='french'){
   document.getElementById('frenchScreen').classList.remove('hidden');
   const map={learn:'frenchVocab',practice:'frenchHome',play:'frenchSpelling',progress:'frenchProgress'};
   if(tab==='review'){
     document.getElementById('frenchScreen').classList.add('hidden');
     const p=document.getElementById('genericReviewPane');p.classList.remove('hidden');
     const d=due('french'),w=weak('french');
     p.innerHTML=`<div class="unavailable-pane"><p class="eyebrow">SPACED REVIEW</p><h2>${d?`${d} French review${d===1?'':'s'} due`:'Nothing due right now'}</h2><p>${w} item${w===1?'':'s'} currently need consolidation.</p><button class="primary" id="frenchDueStart" ${d?'':'disabled'}>Start due review</button></div>`;
     if(d)document.getElementById('frenchDueStart').onclick=async()=>{if(await window.FrenchModule.ensureData()){document.getElementById('genericReviewPane').classList.add('hidden');document.getElementById('frenchScreen').classList.remove('hidden');window.FrenchModule.startQuiz('all',7,true)}};
   }else{
     window.FrenchModule.show(map[tab]||'frenchHome');window.FrenchModule.ensureData();
   }
 }
 window.ScholarUX.touchSubject(subject);
}
function renderTab(tab){
 current.tab=tab;hideAllHosts();
 document.querySelectorAll('[data-subject-tab]').forEach(b=>b.classList.toggle('active',b.dataset.subjectTab===tab));
 const {subject,track}=current;
 if(track==='current'){
   const pane=document.getElementById(`generic${tab[0].toUpperCase()+tab.slice(1)}Pane`);pane.classList.remove('hidden');
   if(tab==='learn')renderScienceLearn(subject);else renderScienceOther(subject,tab);
 }else if(subject==='biology'){
   const pane=document.getElementById(`generic${tab[0].toUpperCase()+tab.slice(1)}Pane`);pane.classList.remove('hidden');renderFoundationBio(tab);
 }else renderFoundationEngine(subject,tab);
 const canonical=`#subject/${subject}${track==='foundation'&&subject==='biology'?'-foundation':''}/${tab}`;
 history.replaceState(null,'',canonical);
}
function continueToday(subject,track){
 if(track==='current'){renderTab('learn');return}
 const d=due(subject);
 if(d){renderTab('review');return}
 renderTab('practice');
}
function open(subject,track='current',tab){
 current={subject,track,tab:tab||((track==='foundation')?'practice':'learn')};
 setHeader(subject,track);renderTab(current.tab);
}
function parseRoute(hash){
 const raw=hash.replace(/^#/,'').split('/').filter(Boolean);
 if(raw[0]!=='subject')return null;
 let subject=raw[1]||'latin',track='current';
 if(subject.endsWith('-foundation')){subject=subject.replace(/-foundation$/,'');track='foundation'}
 else if(['latin','french'].includes(subject))track='foundation';
 const tab=['learn','practice','review','play','progress'].includes(raw[2])?raw[2]:undefined;
 return {subject,track,tab};
}
function bind(){
 document.querySelectorAll('[data-subject-tab]').forEach(b=>b.onclick=()=>renderTab(b.dataset.subjectTab));
}
window.SubjectHub=Object.freeze({renderStudy,open,parseRoute,renderTab,continueToday,showScienceTopic});
window.addEventListener('DOMContentLoaded',bind,{once:true});
})();