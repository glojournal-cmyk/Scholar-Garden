
(() => {
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

function studyDashboard(){
 const screen=$('#studyScreen'); if(!screen || $('.a5-study-dashboard',screen)) return;
 const grid=$('#currentStudyGrid',screen)||$('#foundationStudyGrid',screen); if(!grid) return;
 const dash=document.createElement('section'); dash.className='a5-study-dashboard';
 dash.innerHTML=`
  <article class="a5-study-widget"><p class="eyebrow">OVERALL PROGRESS</p><h3>Your learning is growing</h3><p>Open a subject to see the real mastery and review state stored by the app.</p></article>
  <article class="a5-study-widget"><p class="eyebrow">TODAY'S GOALS</p><h3>Choose your next step</h3><div class="a5-goal-row"><span>○</span><span>Practise one focused topic</span></div><div class="a5-goal-row"><span>○</span><span>Review anything currently due</span></div></article>
  <article class="a5-study-widget"><p class="eyebrow">REVIEW</p><h3>Nothing invented here</h3><p>Due-review counts are shown inside the subject engines when real scheduling data is available.</p></article>`;
 grid.after(dash);
}

function gamesHero(){
 const hub=$('#gamesHub'); if(!hub || $('.a5-games-hero',hub)) return;
 const h=document.createElement('section');h.className='a5-games-hero';
 h.innerHTML=`<p class="eyebrow">DISCOVER · PRACTISE · PLAY · GROW</p><h2>Latin Games</h2><p>Build forms, arrange meaning, match vocabulary and uncover clues — all using the existing learning game engine.</p>`;
 hub.insertBefore(h,hub.firstChild);
}

function gamePanel(){
 const area=$('#gameArea'); if(!area || area.classList.contains('hidden')) return;
 if(!$('.a5-game-header',area)){
   const head=document.createElement('section');head.className='a5-game-header';
   head.innerHTML=`
    <div class="a5-game-stat"><b>Level</b><small id="a5GameLevel">Current</small></div>
    <div class="a5-game-stat"><b>Score</b><small id="a5GameScore">0</small></div>
    <div class="a5-game-stat"><b>Streak</b><small id="a5GameStreak">0</small></div>
    <div class="a5-game-stat"><b>Focus</b><small>Build the right form</small></div>`;
   area.insertBefore(head,area.firstChild);
 }
 const play=$('#gamePlay',area); if(play && !$('.a5-game-side',play)){
   const side=document.createElement('aside');side.className='a5-game-side';
   side.innerHTML=`<p class="eyebrow">GAME GOAL</p><h3>Strengthen the pattern</h3><p>Choose carefully, keep your streak alive, and use hints only when you need them.</p><hr><p><b>About this game</b><br>Short, focused play reinforces the same subject content without changing scoring or mastery rules.</p>`;
   play.appendChild(side);
 }
 syncGameStats();
}
function syncGameStats(){
 const map=[['#gameLevel','#a5GameLevel'],['#gamePoints','#a5GameScore'],['#gameStreak','#a5GameStreak']];
 map.forEach(([src,dst])=>{const s=$(src),d=$(dst);if(s&&d)d.textContent=s.textContent.trim()||d.textContent});
}

function collectionCount(){
 const pane=$('[data-scholar-pane="collection"]'); if(!pane) return;
 let badge=$('.a5-collection-count',pane);
 if(!badge){
   const filters=$('#collectionFilters',pane); if(!filters)return;
   badge=document.createElement('span');badge.className='a5-collection-count';filters.appendChild(badge);
 }
 const cards=$$('#collectionGrid > *',pane);
 const unlocked=cards.filter(c=>!/locked/i.test(c.textContent||'')).length;
 badge.textContent=`${unlocked} / ${Math.max(cards.length,unlocked)} collected`;
}

function achievementLower(){
 const pane=$('[data-scholar-pane="achievements"]'); if(!pane || $('.a5-achievement-lower',pane)) return;
 const grid=$('#medalGrid',pane); if(!grid)return;
 const earned=$$('.medal-card.earned',grid);
 const locked=$$('.medal-card:not(.earned)',grid);
 const recentNames=earned.slice(-3).reverse().map(c=>($('h3',c)?.textContent||'Achievement').trim());
 const nextNames=locked.slice(0,3).map(c=>($('h3',c)?.textContent||'Keep learning').trim());
 const row=(name,state)=>`<div class="a5-achievement-row"><span>${name}</span><span>${state}</span></div>`;
 const lower=document.createElement('section');lower.className='a5-achievement-lower';
 lower.innerHTML=`
  <article class="a5-achievement-list"><h3>Unlocked</h3>${recentNames.length?recentNames.map(n=>row(n,'Earned')).join(''):'<p>Complete real study milestones to unlock achievements.</p>'}</article>
  <article class="a5-achievement-list"><h3>Still to Discover</h3>${nextNames.length?nextNames.map(n=>row(n,'Locked')).join(''):'<p>All currently available achievements are unlocked.</p>'}</article>`;
 grid.after(lower);
}

function polishTouchTargets(){
 $$('button, .nav-link, [role="button"]').forEach(el=>{
   if(!el.style.minHeight) el.style.minHeight='40px';
 });
}

let scheduled=false;
function enhance(){
 if(scheduled)return;scheduled=true;
 requestAnimationFrame(()=>{scheduled=false;studyDashboard();gamesHero();gamePanel();collectionCount();achievementLower();syncGameStats();polishTouchTargets()});
}
document.addEventListener('DOMContentLoaded',enhance);
document.addEventListener('alpha5:refresh',enhance);
})();
