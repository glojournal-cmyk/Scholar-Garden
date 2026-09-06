
(function(){
'use strict';
const ROUTES=new Set(['home','latin','french','garden','collection','profile']);
let toastTimer;
function route(){const r=location.hash.replace(/^#/,'');return ROUTES.has(r)?r:'home'}
function go(r){r=ROUTES.has(r)?r:'home';if(location.hash!==`#${r}`)location.hash=r;else render()}
function render(){
 const r=route();document.querySelectorAll('[data-screen]').forEach(x=>x.classList.toggle('hidden',x.dataset.screen!==r));
 document.querySelectorAll('[data-route]').forEach(x=>x.classList.toggle('active',x.dataset.route===r));window.scrollTo(0,0);
 if(r==='home')renderHome();if(r==='garden')renderGarden();if(r==='collection')renderCollection();if(r==='latin')window.LatinModule?.renderHome();if(r==='french')window.FrenchModule?.ensureData();
}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2300)}
function growth(){
 const g=window.LuxGrowth.snapshot();document.querySelectorAll('[data-growth="level"]').forEach(x=>x.textContent=g.level);
 document.querySelectorAll('[data-growth="xp"]').forEach(x=>x.textContent=g.into);document.querySelectorAll('[data-growth="next"]').forEach(x=>x.textContent=g.next);
 document.querySelectorAll('[data-growth="medals"]').forEach(x=>x.textContent=g.medalCount);document.querySelectorAll('[data-growth="items"]').forEach(x=>x.textContent=g.collectibleCount);
 document.querySelectorAll('[data-growth="days"]').forEach(x=>x.textContent=g.studyDays);document.querySelectorAll('[data-growth="garden"]').forEach(x=>x.textContent=g.gardenStage);
 document.querySelectorAll('[data-growth-bar]').forEach(x=>x.style.width=`${Math.min(100,Math.round(g.into/g.next*100))}%`);
}
function renderHome(){
 growth();const latinDue=window.LatinModule?.dueCount?.()||0,frenchDue=window.FrenchModule?.dueCount?.()||0;
 document.getElementById('homePlan').innerHTML=`<button class="plan-row" data-route="latin"><i></i><span><b>Latin</b><small>${latinDue} due reviews · category practice ready</small></span><strong>Open →</strong></button>
 <button class="plan-row" data-route="french"><i></i><span><b>French</b><small>${frenchDue} due reviews · vocabulary, writing & spelling</small></span><strong>Open →</strong></button>
 <div class="plan-row locked-row"><i></i><span><b>Biology</b><small>Coming later</small></span><strong>Locked</strong></div>
 <div class="plan-row locked-row"><i></i><span><b>Chemistry</b><small>Coming later</small></span><strong>Locked</strong></div>`;
 document.querySelectorAll('#homePlan [data-route]').forEach(b=>b.onclick=()=>go(b.dataset.route));
}
const BLUEPRINT=[
 ['ink-pot','Scholar','Ink Pot','40 Scholar XP'],['desk-lamp','Scholar','Desk Lamp','3 study days'],['study-books','Scholar','Study Books','250 Scholar XP'],['ivy-pot','Scholar','Ivy Pot','7 study days'],
 ['bronze-stylus','Latin','Bronze Stylus','120 Latin XP'],['wax-tablet','Latin','Wax Tablet','250 Latin XP'],['fountain-pen','French','Fountain Pen','120 French XP'],['lavender-vase','French','Lavender Vase','250 French XP'],
 ['scholars-globe','Prestige','Scholar’s Globe','300 Latin + 300 French XP'],['golden-lexicon','Prestige','Golden Lexicon','1,500 Scholar XP']
];
function renderCollection(){
 growth();const s=window.LuxGrowth.load(),filter=document.querySelector('[data-collection-filter].active')?.dataset.collectionFilter||'All';
 document.getElementById('collectionGrid').innerHTML=BLUEPRINT.filter(x=>filter==='All'||x[1]===filter).map(x=>{const earned=!!s.collectibles[x[0]];return `<article class="collect-card ${earned?'earned':''}"><div class="collect-art"><span>${earned?'✓':'◆'}</span></div><small>${x[1]}</small><h3>${x[2]}</h3><p>${earned?'Earned through learning.':`Unlock: ${x[3]}`}</p></article>`}).join('');
 const medals=[['first-steps','First Steps'],['daily-disciplina','Daily Disciplina'],['latin-scholar','Latin Scholar'],['french-scholar','French Scholar'],['polyglot','Polyglot Scholar']];
 document.getElementById('medalGrid').innerHTML=medals.map(m=>`<article class="medal-card ${s.medals[m[0]]?'earned':''}"><div>◉</div><b>${m[1]}</b><small>${s.medals[m[0]]?'Earned':'Locked'}</small></article>`).join('');
}
function renderGarden(){
 growth();const g=window.LuxGrowth.snapshot(),img=document.getElementById('gardenImage');
 img.src=g.gardenStage>=3?'garden_02.webp':'garden_01.webp';document.getElementById('gardenStageText').textContent=`Stage ${g.gardenStage}`;
}
function init(){
 window.LuxApp={go,toast,renderHome,renderCollection,renderGarden};
 document.addEventListener('click',e=>{const r=e.target.closest('[data-route]');if(r){e.preventDefault();go(r.dataset.route)}const l=e.target.closest('[data-locked]');if(l)toast(`${l.dataset.locked} is coming later.`);const f=e.target.closest('[data-collection-filter]');if(f){document.querySelectorAll('[data-collection-filter]').forEach(x=>x.classList.toggle('active',x===f));renderCollection()}});
 window.addEventListener('hashchange',render);document.addEventListener('lux:growth',()=>{growth();renderHome()});
 window.LatinModule.init();window.FrenchModule.init();render();growth();
 if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js?v=0.2.0').catch(console.warn);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
