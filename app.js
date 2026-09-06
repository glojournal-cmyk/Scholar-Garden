
(function(){
'use strict';
const ROUTES=new Set(['home','latin','french','garden','collection','profile']);
let toastTimer,activeTimer=null,lastActiveTick=Date.now(),sealAnnounced=false;

function route(){const r=location.hash.replace(/^#/,'');return ROUTES.has(r)?r:'home'}
function go(r){r=ROUTES.has(r)?r:'home';if(location.hash!==`#${r}`)location.hash=r;else render()}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2400)}
function ymd(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function prettyDate(d=new Date()){return new Intl.DateTimeFormat('en-GB',{weekday:'long',day:'numeric',month:'long'}).format(d)}
function growth(){
 const g=window.LuxGrowth.snapshot();
 document.querySelectorAll('[data-growth="level"]').forEach(x=>x.textContent=g.level);
 document.querySelectorAll('[data-growth="xp"]').forEach(x=>x.textContent=g.into);
 document.querySelectorAll('[data-growth="next"]').forEach(x=>x.textContent=g.next);
 document.querySelectorAll('[data-growth="medals"]').forEach(x=>x.textContent=g.medalCount);
 document.querySelectorAll('[data-growth="items"]').forEach(x=>x.textContent=g.collectibleCount);
 document.querySelectorAll('[data-growth="days"]').forEach(x=>x.textContent=g.studyDays);
 document.querySelectorAll('[data-growth="garden"]').forEach(x=>x.textContent=g.gardenStage);
 document.querySelectorAll('[data-growth-bar]').forEach(x=>x.style.width=`${Math.min(100,Math.round(g.into/g.next*100))}%`);
 return g;
}
function latinToday(){try{return window.LatinModule?.todayStats?.()||{answers:0,correct:0,translation:0,due:0}}catch{return{answers:0,correct:0,translation:0,due:0}}}
function frenchToday(){try{return window.FrenchModule?.todayStats?.()||{answers:0,correct:0,writing:0,spelling:0,due:0,loaded:false}}catch{return{answers:0,correct:0,writing:0,spelling:0,due:0,loaded:false}}}

function todayTasks(){
 const l=latinToday(),f=frenchToday(),active=Math.floor(window.LuxGrowth.activeSecondsFor()/60);
 const production=(l.translation||0)+(f.writing||0);
 return [
  {id:'active',title:'20 active study minutes',detail:`${active} / 20 minutes`,done:active>=20,progress:Math.min(1,active/20),action:'latin',label:'Study'},
  {id:'latin-practice',title:'Latin · 10 meaningful questions',detail:`${l.answers||0} / 10 answered today`,done:(l.answers||0)>=10,progress:Math.min(1,(l.answers||0)/10),action:'latin',label:'Open Latin'},
  {id:'latin-review',title:'Latin · clear due review',detail:(l.due||0)>0?`${l.due} review item${l.due===1?'':'s'} still due`:'All due Latin review cleared',done:(l.due||0)===0,progress:(l.due||0)===0?1:0,action:'latin',label:'Review'},
  {id:'french-practice',title:'French · 10 meaningful questions',detail:`${f.answers||0} / 10 answered today${f.loaded?'':' · loading content'}`,done:(f.answers||0)>=10,progress:Math.min(1,(f.answers||0)/10),action:'french',label:'Open French'},
  {id:'spelling',title:'Spelling · 5 independent attempts',detail:`${f.spelling||0} / 5 French spellings today`,done:(f.spelling||0)>=5,progress:Math.min(1,(f.spelling||0)/5),action:'french',label:'Spell'},
  {id:'production',title:'Production · write or translate',detail:`${production} / 1 Latin translation or French writing task`,done:production>=1,progress:Math.min(1,production),action:production?'home':'french',label:production?'Done':'Write'}
 ];
}
function maybeSeal(tasks){
 const complete=tasks.every(t=>t.done),k=window.LuxGrowth.day(),status=window.LuxGrowth.dayStatus(k);
 if(complete&&!status.seal){
   const r=window.LuxGrowth.claimDailySeal(k);
   if(r.awarded>0&&!sealAnnounced){sealAnnounced=true;toast(`Daily Seal earned · +${r.awarded} Scholar XP`)}
 }
 return window.LuxGrowth.dayStatus(k).seal;
}
function renderQuestBoard(){
 const tasks=todayTasks(),seal=maybeSeal(tasks),done=tasks.filter(t=>t.done).length,active=Math.floor(window.LuxGrowth.activeSecondsFor()/60);
 document.getElementById('todayDate').textContent=prettyDate();
 document.getElementById('questDone').textContent=`${done} / ${tasks.length} tasks`;
 document.getElementById('activeTimeLabel').textContent=`${active} / 20 active min`;
 document.getElementById('questProgressBar').style.width=`${Math.round(done/tasks.length*100)}%`;
 document.getElementById('questSummary').textContent=seal?'Daily minimum complete — your garden has grown today.':done===0?'Start with one small task. You do not need to do everything at once.':`${tasks.length-done} minimum task${tasks.length-done===1?'':'s'} still to go.`;
 const badge=document.getElementById('dailySealBadge');badge.textContent=seal?'Daily Seal ✓':'Daily Seal ○';badge.classList.toggle('earned',seal);
 document.getElementById('dailyQuestList').innerHTML=tasks.map(t=>`<article class="quest-item ${t.done?'complete':''}">
   <span class="quest-check">${t.done?'✓':'○'}</span>
   <div><h3>${t.title}</h3><p>${t.detail}</p><div class="quest-mini-progress"><i style="width:${Math.round(t.progress*100)}%"></i></div></div>
   <button class="quest-go" data-quest-action="${t.action}" data-task="${t.id}">${t.done?'Review':t.label} →</button>
 </article>`).join('');
 document.querySelectorAll('[data-quest-action]').forEach(b=>b.onclick=()=>{
   const a=b.dataset.questAction,task=b.dataset.task;
   if(a==='latin'){go('latin');if(task==='latin-review')setTimeout(()=>window.LatinModule?.startPractice?.('Mixed',20,true),80)}
   else if(a==='french'){go('french');setTimeout(()=>{if(task==='spelling')document.querySelector('#frenchScreen [data-french-view="frenchSpelling"]')?.click();else if(task==='production')document.querySelector('#frenchScreen [data-french-view="frenchWriting"]')?.click()},100)}
 });
 return {tasks,seal,done};
}
function renderWeek(){
 const box=document.getElementById('weekCalendar');if(!box)return;
 const now=new Date(),monday=new Date(now),dow=(now.getDay()+6)%7;monday.setDate(now.getDate()-dow);
 const rows=[];
 for(let i=0;i<7;i++){const d=new Date(monday);d.setDate(monday.getDate()+i);const k=ymd(d),s=window.LuxGrowth.dayStatus(k);rows.push({d,k,s,today:k===ymd(now)})}
 box.innerHTML=rows.map(x=>`<div class="day-cell ${x.today?'today ':''}${x.s.seal?'sealed':x.s.study?'partial':''}">
  <span class="dow">${new Intl.DateTimeFormat('en-GB',{weekday:'short'}).format(x.d)}</span><b>${x.d.getDate()}</b><i>${x.s.seal?'✓':x.s.study?'•':'○'}</i>
 </div>`).join('');
}
function nextGardenCopy(g){
 if(g.gardenStage===1)return g.total<400?`${Math.max(0,400-g.total)} XP until Garden Stage 2.`:'Garden Stage 2 is ready.';
 if(g.gardenStage===2)return `${Math.max(0,1000-g.total)} XP until Garden Stage 3.`;
 if(g.gardenStage===3)return `${Math.max(0,2200-g.total)} XP until Garden Stage 4.`;
 return 'Your flourishing garden keeps collecting learning rewards.';
}
function renderRecentRewards(){
 const s=window.LuxGrowth.load(),events=[];
 Object.entries(s.dailySeals||{}).forEach(([k,v])=>events.push({at:v.earnedAt||k,title:'Daily Seal',sub:k,icon:'✓'}));
 Object.entries(s.collectibles||{}).forEach(([id,v])=>events.push({at:v.earnedAt||'',title:id.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),sub:'Collectible unlocked',icon:'◆'}));
 Object.entries(s.medals||{}).forEach(([id,v])=>events.push({at:v.earnedAt||'',title:id.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),sub:'Medal earned',icon:'◉'}));
 events.sort((a,b)=>String(b.at).localeCompare(String(a.at)));
 const picked=events.slice(0,4);
 document.getElementById('recentRewards').innerHTML=(picked.length?picked:[
  {title:'First collectible waiting',sub:'Study to unlock your first item.',icon:'◆'},
  {title:'Daily Seal',sub:'Complete today’s minimum quest.',icon:'○'}
 ]).map(e=>`<article class="recent-reward"><div class="reward-icon">${e.icon}</div><b>${e.title}</b><small>${e.sub}</small></article>`).join('');
}
function renderHome(){
 const g=growth(),q=renderQuestBoard();renderWeek();renderRecentRewards();
 const l=latinToday(),f=frenchToday();
 document.getElementById('latinHomeStatus').textContent=`${l.answers||0} answered today · ${l.due||0} due`;
 document.getElementById('frenchHomeStatus').textContent=`${f.answers||0} answered · ${f.spelling||0} spelling${f.loaded?'':' · loading'}`;
 document.getElementById('nextGardenReward').textContent=nextGardenCopy(g);
 document.getElementById('gardenHomeMessage').textContent=q.seal?'Today’s Daily Seal is earned. Your study trail is complete for today.':`Complete ${6-q.done} more minimum task${6-q.done===1?'':'s'} to earn today’s seal.`;
 document.getElementById('homeGardenImage').src=g.gardenStage>=3?'garden_02.webp':'garden_01.webp';
}

const BLUEPRINT=[['ink-pot','Scholar','Ink Pot','40 Scholar XP'],['desk-lamp','Scholar','Desk Lamp','3 study days'],['study-books','Scholar','Study Books','250 Scholar XP'],['ivy-pot','Scholar','Ivy Pot','7 study days'],['bronze-stylus','Latin','Bronze Stylus','120 Latin XP'],['wax-tablet','Latin','Wax Tablet','250 Latin XP'],['fountain-pen','French','Fountain Pen','120 French XP'],['lavender-vase','French','Lavender Vase','250 French XP'],['scholars-globe','Prestige','Scholar’s Globe','300 Latin + 300 French XP'],['golden-lexicon','Prestige','Golden Lexicon','1,500 Scholar XP']];
function renderCollection(){
 growth();const s=window.LuxGrowth.load(),filter=document.querySelector('[data-collection-filter].active')?.dataset.collectionFilter||'All';
 document.getElementById('collectionGrid').innerHTML=BLUEPRINT.filter(x=>filter==='All'||x[1]===filter).map(x=>{const earned=!!s.collectibles[x[0]];return `<article class="collect-card ${earned?'earned':''}"><div class="collect-art"><span>${earned?'✓':'◆'}</span></div><small>${x[1]}</small><h3>${x[2]}</h3><p>${earned?'Earned through learning.':`Unlock: ${x[3]}`}</p></article>`}).join('');
 const medals=[['first-steps','First Steps'],['daily-disciplina','Daily Disciplina'],['latin-scholar','Latin Scholar'],['french-scholar','French Scholar'],['polyglot','Polyglot Scholar']];
 document.getElementById('medalGrid').innerHTML=medals.map(m=>`<article class="medal-card ${s.medals[m[0]]?'earned':''}"><div>◉</div><b>${m[1]}</b><small>${s.medals[m[0]]?'Earned':'Locked'}</small></article>`).join('');
}
function renderGarden(){const g=growth(),img=document.getElementById('gardenImage');img.src=g.gardenStage>=3?'garden_02.webp':'garden_01.webp';document.getElementById('gardenStageText').textContent=`Stage ${g.gardenStage}`}
function render(){
 const r=route();document.querySelectorAll('[data-screen]').forEach(x=>x.classList.toggle('hidden',x.dataset.screen!==r));document.querySelectorAll('[data-route]').forEach(x=>x.classList.toggle('active',x.dataset.route===r));window.scrollTo(0,0);
 if(r==='home')renderHome();if(r==='garden')renderGarden();if(r==='collection')renderCollection();if(r==='latin')window.LatinModule?.renderHome();if(r==='french')window.FrenchModule?.ensureData();
}
function trackActive(){
 if(activeTimer)return;lastActiveTick=Date.now();
 activeTimer=setInterval(()=>{
   const now=Date.now(),delta=Math.min(20,Math.max(0,(now-lastActiveTick)/1000));lastActiveTick=now;
   if(document.visibilityState==='visible'&&!document.hidden&&route()!=='profile'&&delta>0){
     window.LuxGrowth.addActiveSeconds(delta);
     if(route()==='home')renderHome();
   }
 },15000);
}
function init(){
 window.LuxApp={go,toast,renderHome,renderCollection,renderGarden};
 document.addEventListener('click',e=>{const r=e.target.closest('[data-route]');if(r){e.preventDefault();go(r.dataset.route)}const l=e.target.closest('[data-locked]');if(l)toast(`${l.dataset.locked} is coming later.`);const f=e.target.closest('[data-collection-filter]');if(f){document.querySelectorAll('[data-collection-filter]').forEach(x=>x.classList.toggle('active',x===f));renderCollection()}});
 window.addEventListener('hashchange',render);document.addEventListener('lux:growth',()=>{growth();if(route()==='home')renderHome()});document.addEventListener('visibilitychange',()=>{lastActiveTick=Date.now()});
 window.LatinModule.init();window.FrenchModule.init();render();growth();trackActive();
 if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js?v=0.3.0').catch(console.warn);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
