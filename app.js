(function(){
'use strict';
let toastTimer;

function toast(msg){
 const t=document.getElementById('toast');if(!t)return;
 t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);
 toastTimer=setTimeout(()=>t.classList.remove('show'),2400);
}
function growth(){
 const g=window.LuxGrowth.snapshot();
 document.querySelectorAll('[data-growth="level"]').forEach(x=>x.textContent=g.level);
 document.querySelectorAll('[data-growth="xp"]').forEach(x=>x.textContent=g.into);
 document.querySelectorAll('[data-growth="next"]').forEach(x=>x.textContent=g.next);
 document.querySelectorAll('[data-growth-bar]').forEach(x=>x.style.width=`${Math.min(100,Math.round((g.into/Math.max(1,g.next))*100))}%`);
 return g;
}
function dateKey(d){return window.ScholarUX.day(d)}
function routeInfo(){
 let h=location.hash||'#home';
 const legacy={
  '#latin':'#subject/latin/practice','#french':'#subject/french/practice',
  '#collection':'#scholar/collection','#profile':'#scholar/wardrobe',
  '#games':'#subject/latin/play','#gamesHub':'#subject/latin/play'
 };
 if(legacy[h]){history.replaceState(null,'',legacy[h]);h=legacy[h]}
 const parts=h.replace(/^#/,'').split('/').filter(Boolean);
 if(!parts.length)return {screen:'home'};
 if(parts[0]==='subject')return {screen:'subject',subject:window.SubjectHub.parseRoute(h)};
 if(parts[0]==='scholar')return {screen:'scholar',tab:['wardrobe','collection','achievements'].includes(parts[1])?parts[1]:'wardrobe'};
 if(['home','study','garden'].includes(parts[0]))return {screen:parts[0]};
 return {screen:'home',redirect:true};
}
function showScreen(name){
 document.querySelectorAll('[data-route-screen]').forEach(s=>s.classList.toggle('hidden',s.dataset.routeScreen!==name));
 document.querySelectorAll('[data-global-route]').forEach(b=>b.classList.toggle('active',b.dataset.globalRoute===name));
}
function go(dest){
 const hash=dest.startsWith('#')?dest:`#${dest}`;
 if(location.hash===hash)render();else location.hash=hash;
}
function goSubject(subject,track='current',tab){
 let slug=subject;
 if(track==='foundation'&&subject==='biology')slug='biology-foundation';
 const defaultTab=tab||(track==='foundation'?'practice':'learn');
 go(`#subject/${slug}/${defaultTab}`);
}
function greeting(){
 const h=new Date().getHours();return h<12?'Good morning':h<18?'Good afternoon':'Good evening';
}
function renderWeek(){
 const root=document.getElementById('weekStrip');if(!root)return;
 const now=new Date();const days=[];
 for(let delta=-3;delta<=3;delta++){const d=new Date(now);d.setDate(now.getDate()+delta);days.push(d)}
 root.innerHTML=days.map(d=>{
   const k=dateKey(d),complete=window.DailyPlan.completedOn(k),today=k===dateKey(now);
   return `<div class="week-day ${complete?'complete ':''}${today?'today':''}"><span>${new Intl.DateTimeFormat('en-GB',{weekday:'short'}).format(d)}</span><strong>${d.getDate()}</strong><i aria-hidden="true"></i></div>`;
 }).join('');
}
function taskProgressText(t){
 if(t.kind==='science-learn')return t.progress.value?'Reviewed today':'Not started';
 if(t.reason==='Due review')return t.progress.value>=t.progress.target?'Complete':'Due now';
 return `${t.progress.value} / ${t.progress.target}`;
}
function renderToday(){
 const s=window.DailyPlan.status(),root=document.getElementById('todayList');
 document.getElementById('todayTaskCount').textContent=`${s.done} / ${s.total} complete`;
 document.getElementById('todayProgressText').textContent=`${s.done} / ${s.total} tasks complete`;
 document.getElementById('todayProgressBar').style.width=`${s.total?Math.round(s.done/s.total*100):0}%`;
 document.getElementById('dailyMinimum').textContent=window.DailyPlan.minimumText();
 root.innerHTML=s.tasks.map((t,i)=>`<article class="today-task ${t.reason==='Due review'?'is-due':''}">
   <div class="task-top"><span class="task-subject">${window.DailyPlan.displaySubject(t.subject).toUpperCase()}</span><span class="task-reason">${t.reason}</span></div>
   <h3>${t.title}</h3>
   <p>${i===0?'Start here. ':''}${t.reason==='Due review'?'This review is scheduled from earlier learning.':t.reason==='Current learning'?'Continue the verified Year 9 learning sequence.':'Keep prior learning fluent with a short mixed session.'}</p>
   <div class="task-meta"><span>~${t.minutes} min</span><span>${taskProgressText(t)}</span></div>
   <button class="primary" data-start-task="${t.id}">${t.progress.value>0&&t.progress.value<t.progress.target?'Continue':'Start'}</button>
 </article>`).join('');
 root.querySelectorAll('[data-start-task]').forEach(b=>b.onclick=()=>startTask(s.tasks.find(t=>t.id===b.dataset.startTask)));
}
async function startTask(t){
 if(!t)return;
 window.ScholarUX.touchSubject(t.subject);
 if(t.kind==='science-learn'){
   goSubject(t.subject,'current','learn');
   setTimeout(()=>window.SubjectHub.showScienceTopic(t.subject,t.topicId),0);
   return;
 }
 if(t.kind==='latin-due'){
   goSubject('latin','foundation','review');
   setTimeout(()=>window.LatinModule.startPractice('Mixed',7,true),0);return;
 }
 if(t.kind==='french-due'){
   goSubject('french','foundation','review');
   if(await window.FrenchModule.ensureData())setTimeout(()=>window.FrenchModule.startQuiz('all',7,true),0);
   return;
 }
 if(t.kind==='latin-weak'){
   goSubject('latin','foundation','practice');setTimeout(()=>window.LatinModule.startWeakPractice(7),0);return;
 }
 if(t.kind==='french-weak'){
   goSubject('french','foundation','practice');if(await window.FrenchModule.ensureData())setTimeout(()=>window.FrenchModule.startWeakPractice(7),0);return;
 }
 if(t.kind==='latin-practice'){
   goSubject('latin','foundation','practice');
   setTimeout(()=>window.LatinModule.startPractice('Mixed',15,false),0);return;
 }
 if(t.kind==='french-practice'){
   goSubject('french','foundation','practice');
   if(await window.FrenchModule.ensureData())setTimeout(()=>window.FrenchModule.startQuiz('all',15,false),0);
 }
}
function nextReward(g){
 const s=g.state,candidates=[
  ['Ink Pot',40,!!s.collectibles?.['ink-pot']],['Study Books',250,!!s.collectibles?.['study-books']],
  ['Golden Lexicon',1500,!!s.collectibles?.['golden-lexicon']]
 ];
 const next=candidates.find(x=>!x[2])||['Flourishing Garden',Math.max(g.total+100,g.total),false];
 return {name:next[0],need:next[1],left:Math.max(0,next[1]-g.total)};
}
function renderReward(){
 const g=growth(),r=nextReward(g);
 document.getElementById('nextRewardName').textContent=r.name;
 document.getElementById('nextRewardCopy').textContent=r.left?`${r.left} Scholar XP to unlock.`:'Unlocked through study.';
}
function renderContinue(){
 const recent=window.ScholarUX.load().recentSubjects;
 const fallback=['latin','french','biology'];
 const subjects=[...recent,...fallback].filter((x,i,a)=>a.indexOf(x)===i).slice(0,3);
 const root=document.getElementById('continueCards');
 root.innerHTML=subjects.map(s=>{
   const current=['biology','chemistry','physics'].includes(s),track=current?'current':'foundation';
   const label=window.DailyPlan.displaySubject(s);
   return `<button class="continue-card" data-cont-subject="${s}" data-cont-track="${track}"><span>${current?'CURRENT · YEAR 9':'FOUNDATION REVIEW'}</span><b>${label}</b><small>${current?'Continue Learn':'Practice · Review · Play'}</small></button>`;
 }).join('');
 root.querySelectorAll('[data-cont-subject]').forEach(b=>b.onclick=()=>goSubject(b.dataset.contSubject,b.dataset.contTrack));
}
function renderHome(){
 document.getElementById('homeGreeting').textContent=greeting();
 document.getElementById('homeDate').textContent=new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date());
 growth();renderWeek();renderToday();renderReward();renderContinue();
}
function gardenStageBounds(stage){return ({1:[0,400],2:[400,1000],3:[1000,2200],4:[2200,3200]})[stage]||[0,400]}
function renderGarden(){
 const g=growth(),bounds=gardenStageBounds(g.gardenStage),span=Math.max(1,bounds[1]-bounds[0]),pct=Math.max(0,Math.min(100,(g.total-bounds[0])/span*100));
 document.getElementById('gardenStageText').textContent=`Stage ${g.gardenStage}`;
 document.getElementById('gardenStageBar').style.width=`${pct}%`;
 document.getElementById('gardenNextLabel').textContent=g.gardenStage>=4?'Flourishing':`${Math.max(0,bounds[1]-g.total)} XP`;
 document.getElementById('gardenImage').src=g.gardenStage>=3?'garden_02.webp':'garden_01.webp';
 const r=nextReward(g);document.getElementById('gardenUnlockName').textContent=r.name;
 const s=g.state,events=[];
 Object.keys(s.collectibles||{}).forEach(id=>events.push({id,title:id.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),kind:'Collectible'}));
 Object.keys(s.medals||{}).forEach(id=>events.push({id,title:id.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),kind:'Achievement'}));
 document.getElementById('gardenRewards').innerHTML=(events.slice(-8).reverse().length?events.slice(-8).reverse():[{title:'Your first growth item is waiting',kind:'Keep studying'}]).map(e=>`<article class="collect-card earned"><div class="collect-art">✦</div><h3>${e.title}</h3><p>${e.kind}</p></article>`).join('');
}
function render(){
 const info=routeInfo();
 if(info.redirect){history.replaceState(null,'','#home');return render()}
 showScreen(info.screen);
 if(info.screen==='home')renderHome();
 else if(info.screen==='study'){growth();window.SubjectHub.renderStudy()}
 else if(info.screen==='subject'&&info.subject){growth();window.SubjectHub.open(info.subject.subject,info.subject.track,info.subject.tab)}
 else if(info.screen==='garden')renderGarden();
 else if(info.screen==='scholar'){growth();window.ScholarView.openTab(info.tab)}
 const ux=window.ScholarUX.load();ux.lastRoute=location.hash||'#home';window.ScholarUX.save(ux);
 window.scrollTo({top:0,behavior:'auto'});
}
async function init(){
 window.LuxApp={go,goSubject,toast,render,renderHome};
 window.LatinModule.init();window.FrenchModule.init();
 const frenchReady=window.FrenchModule.ensureData();
 document.querySelectorAll('[data-global-route]').forEach(b=>b.onclick=()=>go(b.dataset.globalRoute));
 document.querySelector('[data-brand-home]')?.addEventListener('click',()=>go('home'));
 document.getElementById('gardenExplore').onclick=()=>document.getElementById('gardenExplorePanel').classList.toggle('hidden');
 window.addEventListener('hashchange',render);
 document.addEventListener('lux:growth',()=>{growth();if(routeInfo().screen==='home')renderHome();if(routeInfo().screen==='garden')renderGarden()});
 document.addEventListener('lux:plan-change',()=>{if(routeInfo().screen==='home')renderHome()});
 await Promise.race([frenchReady,new Promise(resolve=>setTimeout(resolve,2200))]);
 render();
 if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js?v=0.3.0-reset').catch(()=>{});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();