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
function reviewDateSet(){
 const dates=new Set();
 try{(window.LatinModule?.reviewDates?.()||[]).forEach(x=>dates.add(x))}catch{}
 try{(window.FrenchModule?.reviewDates?.()||[]).forEach(x=>dates.add(x))}catch{}
 return dates;
}
function renderWeek(){
 const root=document.getElementById('weekStrip');if(!root)return;
 const now=new Date(),todayKey=dateKey(now),due=reviewDateSet(),days=[];
 for(let delta=-3;delta<=3;delta++){const d=new Date(now);d.setDate(now.getDate()+delta);days.push(d)}
 root.innerHTML=days.map(d=>{
   const k=dateKey(d),complete=window.DailyPlan.completedOn(k),today=k===todayKey,future=d>now,dueReview=due.has(k);
   return `<div class="week-day ${complete?'complete ':''}${today?'today ':''}${future?'future ':''}${!complete&&!future&&!today?'no-study ':''}${dueReview?'review-due':''}" title="${dueReview?'Review due · ':''}${complete?'Study complete':'Learning day'}">
    <span>${new Intl.DateTimeFormat('en-GB',{weekday:'short'}).format(d)}</span><strong>${d.getDate()}</strong><i aria-hidden="true"></i>
   </div>`;
 }).join('');
}
function taskProgressText(t){
 if(t.kind==='science-learn')return t.progress.value?'Reviewed today':'1 topic';
 if(t.kind==='latin-game'||t.kind==='french-game')return t.progress.value?'Round complete':'1 round';
 if(t.reason==='Due review')return t.progress.value>=t.progress.target?'Complete':`${t.target} questions`;
 return `${t.progress.value} / ${t.progress.target}`;
}
function displayTaskTitle(t){
 const title=String(t?.title||'');
 if(title==='Repair weak Latin')return 'Latin Boost';
 if(title==='Repair weak French')return 'French Boost';
 return title;
}
function taskDescription(t){
 if(t.reason==='Due review')return 'Scheduled recall from earlier learning.';
 if(t.reason==='Weak area')return 'A short boost chosen from items that need more confidence.';
 if(t.reason==='Current learning')return 'Continue the verified Year 9 learning sequence.';
 if(t.reason==='Game')return 'A short real learning game. Scholar XP is separate from mastery.';
 return 'A focused foundation session to keep earlier learning fluent.';
}
function taskButtonLabel(t){
 if(t.progress.value>=t.progress.target)return 'Review';
 if(t.progress.value>0)return 'Continue';
 return t.reason==='Game'?'Play':'Start';
}
function renderToday(){
 const s=window.DailyPlan.status();
 document.getElementById('todayProgressText').textContent=`${s.done} / ${s.total} tasks complete`;
 document.getElementById('todayProgressBar').style.width=`${s.total?Math.round(s.done/s.total*100):0}%`;
 const main=s.tasks.find(t=>t.progress.value<t.progress.target)||s.tasks[0];
 const secondary=s.tasks.filter(t=>!main||t.id!==main.id);
 const mainRoot=document.getElementById('mainQuest'),secondaryRoot=document.getElementById('secondaryTasks');
 if(!main){mainRoot.innerHTML='<p>Nothing scheduled today.</p>';secondaryRoot.innerHTML='';return}
 mainRoot.classList.toggle('complete',main.progress.value>=main.progress.target);
 mainRoot.innerHTML=`<div>
   <div class="quest-kicker"><span>TODAY'S MAIN QUEST</span><span class="reason">${main.reason}</span></div>
   <h3>${window.DailyPlan.displaySubject(main.subject)} · ${displayTaskTitle(main)}</h3>
   <p>${taskDescription(main)}</p>
   <div class="quest-meta"><span>~${main.minutes} min</span><span>${taskProgressText(main)}</span></div>
  </div>
  <button class="primary" data-start-main="${main.id}">${taskButtonLabel(main)}</button>`;
 secondaryRoot.innerHTML=secondary.map(t=>`<article class="secondary-task">
   <div><small>${window.DailyPlan.displaySubject(t.subject).toUpperCase()} · ${t.reason}</small><h3>${displayTaskTitle(t)}</h3><p>${taskProgressText(t)} · ~${t.minutes} min</p></div>
   <button class="secondary" data-start-secondary="${t.id}">${taskButtonLabel(t)}</button>
  </article>`).join('');
 mainRoot.querySelector('[data-start-main]')?.addEventListener('click',()=>startTask(main));
 secondaryRoot.querySelectorAll('[data-start-secondary]').forEach(b=>b.onclick=()=>startTask(s.tasks.find(t=>t.id===b.dataset.startSecondary)));
}
async function startQuickGame(subject,gameId){
 window.ScholarUX.touchSubject(subject);
 if(subject==='latin'){
   goSubject('latin','foundation','play');
   setTimeout(()=>window.GameV2?.start?.(gameId),100);
   return;
 }
 if(subject==='french'){
   goSubject('french','foundation','play');
   const ok=await window.FrenchModule.ensureData();
   if(ok)setTimeout(()=>{
     document.getElementById('genericPlayPane')?.classList.add('hidden');
     document.getElementById('frenchScreen')?.classList.remove('hidden');
     window.FrenchModule.show('frenchSpelling');window.FrenchModule.startSpelling();
   },100);
 }
}
async function startTask(t){
 if(!t)return;
 window.ScholarUX.touchSubject(t.subject);
 if(t.kind==='science-learn'){
   goSubject(t.subject,'current','learn');
   setTimeout(()=>window.SubjectHub.showScienceTopic(t.subject,t.topicId),0);return;
 }
 if(t.kind==='latin-game'){return startQuickGame('latin',t.gameId||'verbum')}
 if(t.kind==='french-game'){return startQuickGame('french',t.gameId||'atelier-spelling')}
 if(t.kind==='latin-due'){
   goSubject('latin','foundation','practice');setTimeout(()=>window.LatinModule.startPractice('Mixed',7,true),80);return;
 }
 if(t.kind==='french-due'){
   goSubject('french','foundation','practice');
   if(await window.FrenchModule.ensureData())setTimeout(()=>window.FrenchModule.startQuiz('all',7,true),80);return;
 }
 if(t.kind==='biology-due'){
   goSubject('biology','foundation','practice');
   if(await window.BiologyY8.ensureData())setTimeout(()=>window.BiologyY8.startPractice('due',7,'all'),80);return;
 }
 if(t.kind==='latin-weak'){
   goSubject('latin','foundation','practice');setTimeout(()=>window.LatinModule.startWeakPractice(7),80);return;
 }
 if(t.kind==='french-weak'){
   goSubject('french','foundation','practice');
   if(await window.FrenchModule.ensureData())setTimeout(()=>window.FrenchModule.startWeakPractice(7),80);return;
 }
 if(t.kind==='biology-weak'){
   goSubject('biology','foundation','practice');
   if(await window.BiologyY8.ensureData())setTimeout(()=>window.BiologyY8.startPractice('weak',7,'all'),80);return;
 }
 if(t.kind==='latin-practice'){
   goSubject('latin','foundation','practice');setTimeout(()=>window.LatinModule.startPractice('Mixed',15,false),80);return;
 }
 if(t.kind==='french-practice'){
   goSubject('french','foundation','practice');
   if(await window.FrenchModule.ensureData())setTimeout(()=>window.FrenchModule.startQuiz('all',15,false),80);
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
let lastCollectibleCount=null;
function renderReward(animate=false){
 const g=growth(),r=nextReward(g),card=document.getElementById('nextRewardCard');
 document.getElementById('nextRewardName').textContent=r.name;
 document.getElementById('nextRewardCopy').textContent=r.left?`${r.left} XP to unlock`:'Unlocked through study';
 document.getElementById('nextRewardArt').dataset.rewardName=r.name.toLowerCase().replace(/\s+/g,'-');
 const pct=r.need?Math.min(100,Math.round(g.total/r.need*100)):100;
 document.getElementById('nextRewardBar').style.width=`${pct}%`;
 if(lastCollectibleCount===null)lastCollectibleCount=g.collectibleCount;
 if(animate&&g.collectibleCount>lastCollectibleCount){
   card.classList.remove('just-unlocked');void card.offsetWidth;card.classList.add('just-unlocked');
   setTimeout(()=>card.classList.remove('just-unlocked'),900);
 }
 lastCollectibleCount=g.collectibleCount;
}
function renderQuickPlay(){
 const root=document.getElementById('quickPlayGrid'),drawer=document.getElementById('allGamesDrawer');
 const recommended=[
  {subject:'latin',id:'verbum',icon:'V',name:'Verbum Match',copy:'Quick vocabulary and grammar connections',time:'~3 min'},
  {subject:'french',id:'atelier-spelling',icon:'F',name:'Spelling Sprint',copy:'Exact French recall with accents',time:'~3 min'}
 ];
 root.innerHTML=recommended.map(g=>`<article class="quick-play-card" data-subject="${g.subject}">
   <div class="quick-play-icon">${g.icon}</div><div><small>${g.subject.toUpperCase()}</small><strong>${g.name}</strong><em>${g.copy} · ${g.time}</em></div>
   <button class="primary" data-quick-game="${g.id}" data-game-subject="${g.subject}">Play</button>
  </article>`).join('');
 root.querySelectorAll('[data-quick-game]').forEach(b=>b.onclick=()=>startQuickGame(b.dataset.gameSubject,b.dataset.quickGame));
 const all=[
  ['latin','forma','Forma Forge','Build and repair Latin forms'],
  ['latin','mosaic','Sentence Mosaic','Build valid Latin sentences'],
  ['latin','verbum','Verbum Match','Vocabulary and grammar connections'],
  ['latin','manuscript','Manuscript Mystery','Inspect and restore Latin'],
  ['french','atelier-spelling','Atelier d’Orthographe','French spelling recall']
 ];
 drawer.innerHTML=`<div class="all-games-grid">${all.map(g=>`<button class="all-game-button" data-all-game="${g[1]}" data-game-subject="${g[0]}"><strong>${g[2]}</strong><small>${g[0][0].toUpperCase()+g[0].slice(1)} · ${g[3]}</small></button>`).join('')}</div>`;
 drawer.querySelectorAll('[data-all-game]').forEach(b=>b.onclick=()=>startQuickGame(b.dataset.gameSubject,b.dataset.allGame));
}
function renderContinue(){
 const root=document.getElementById('continueCards'),todayPlan=window.DailyPlan.plan();
 const latinDue=Number(window.LatinModule?.dueCount?.())||0;
 const frenchDue=Number(window.FrenchModule?.dueCount?.())||0;
 const bioTask=todayPlan.find(t=>t.subject==='biology'&&t.topicId);
 const bioTopic=bioTask?window.ScholarScience?.topic('biology',bioTask.topicId):window.ScholarScience?.get('biology')?.topics?.[0];
 const cards=[
  {subject:'latin',track:'foundation',label:'Latin',micro:'FOUNDATION REVIEW',detail:latinDue?`${latinDue} review${latinDue===1?'':'s'} due`:'Ready for focused practice',cta:'Continue Latin'},
  {subject:'french',track:'foundation',label:'French',micro:'FOUNDATION REVIEW',detail:frenchDue?`${frenchDue} review${frenchDue===1?'':'s'} due`:'Ready for focused practice',cta:'Continue French'},
  {subject:'biology',track:'current',label:'Biology',micro:'CURRENT · YEAR 9',detail:bioTopic?`Current topic: ${bioTopic.id} · ${bioTopic.title}`:'Continue Year 9 Learn',cta:'Continue Biology'}
 ];
 root.innerHTML=cards.map(c=>`<button class="continue-card" data-subject="${c.subject}" data-cont-subject="${c.subject}" data-cont-track="${c.track}">
   <div class="subject-mini-icon">${c.label[0]}</div><span>${c.micro}</span><b>${c.label}</b><small>${c.detail}</small><u class="continue-cta">${c.cta} →</u>
  </button>`).join('');
 root.querySelectorAll('[data-cont-subject]').forEach(b=>b.onclick=()=>goSubject(b.dataset.contSubject,b.dataset.contTrack));
}
function learnerGreeting(){
 let name='';
 try{name=String(window.LuxGrowth?.load?.().profile?.displayName||window.ScholarUX?.load?.().displayName||'').trim()}catch{}
 return name?`${greeting()}, ${name}`:greeting();
}
function renderHome(){
 document.getElementById('homeGreeting').textContent=learnerGreeting();
 document.getElementById('homeDate').textContent=new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date());
 growth();renderWeek();renderToday();renderQuickPlay();renderReward();renderContinue();
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
 const biologyReady=window.BiologyY8.ensureData();
 document.querySelectorAll('[data-global-route]').forEach(b=>b.onclick=()=>go(b.dataset.globalRoute));
 document.querySelector('[data-brand-home]')?.addEventListener('click',()=>go('home'));
 document.getElementById('gardenExplore').onclick=()=>document.getElementById('gardenExplorePanel').classList.toggle('hidden');
 document.getElementById('seeAllGames').onclick=()=>document.getElementById('allGamesDrawer').classList.toggle('hidden');
 window.addEventListener('hashchange',render);
 document.addEventListener('lux:growth',()=>{
  const before=lastCollectibleCount,after=window.LuxGrowth.snapshot().collectibleCount;
  growth();
  if(routeInfo().screen==='home'){
    renderHome();
    if(before!==null&&after>before){
      const card=document.getElementById('nextRewardCard');
      card.classList.remove('just-unlocked');void card.offsetWidth;card.classList.add('just-unlocked');
      setTimeout(()=>card.classList.remove('just-unlocked'),900);
    }
  }
  if(routeInfo().screen==='garden')renderGarden();
});
 document.addEventListener('lux:plan-change',()=>{if(routeInfo().screen==='home')renderHome()});
 await Promise.race([Promise.allSettled([frenchReady,biologyReady]),new Promise(resolve=>setTimeout(resolve,2400))]);
 render();
 if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js?v=0.3.1').catch(()=>{});
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();