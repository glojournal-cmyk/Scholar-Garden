
(() => {
'use strict';
const $=(s,r=document)=>r.querySelector(s);

function pct(){
  const bar=$('[data-growth-bar]');
  if(!bar)return 0;
  const raw=(bar.style.width||getComputedStyle(bar).width||'0').match(/[\d.]+/);
  return raw?Math.max(0,Math.min(100,Number(raw[0]))):0;
}
function growthText(sel,fallback){
  return ($(sel)?.textContent||fallback).trim();
}
function buildHome(){
  const screen=$('#homeScreen');
  if(!screen||$('.a6-home',screen))return;
  const wrap=document.createElement('section');
  wrap.className='a6-home';
  const level=growthText('[data-growth="level"]','1');
  const xp=growthText('[data-growth="xp"]','0');
  const next=growthText('[data-growth="next"]','100');
  wrap.innerHTML=`
    <header class="a6-home-title">
      <div>
        <p class="eyebrow">THE SCHOLAR'S GARDEN</p>
        <h1>Good morning,<span>Scholar</span></h1>
      </div>
      <p>“Knowledge is a garden that always grows.”<br>Small steps today, a brighter tomorrow.</p>
    </header>

    <article class="a6-hero">
      <img src="./v04_home_hero.webp" alt="">
      <div class="a6-hero-copy">
        <div><small>PICK UP WHERE YOU LEFT OFF</small><h2>Continue Studying</h2><p>Build your knowledge a little further today, using your real lesson and review state.</p></div>
        <button type="button" data-global-route="study">Continue →</button>
      </div>
    </article>

    <aside class="a6-side">
      <section class="a6-card a6-level">
        <div><small>SCHOLAR LEVEL</small><h3>Lv. <span data-a6-level>${level}</span></h3><div class="a6-meter"><i data-a6-xpbar></i></div><p><b data-a6-xp>${xp}</b> / <span data-a6-next>${next}</span> XP</p></div>
        <div class="badge">❧</div>
      </section>

      <section class="a6-card a6-journey">
        <small>TODAY'S JOURNEY</small><h3>One clear next step</h3>
        <ul>
          <li><span class="a6-dot">▣</span><b>Continue Latin practice</b><span>Study</span></li>
          <li><span class="a6-dot">✣</span><b>Review what is due</b><span>Review</span></li>
          <li><span class="a6-dot">❧</span><b>Tend to your garden</b><span>Garden</span></li>
        </ul>
      </section>

      <section class="a6-card a6-garden">
        <small>YOUR GARDEN</small><h3 data-a6-garden>Garden Stage</h3>
        <img src="./v04_garden_hero.webp" alt="">
        <button type="button" data-global-route="garden" aria-label="Open Garden">→</button>
      </section>

      <section class="a6-daily">
        <div class="a6-mini"><b data-a6-tasks>Today</b><span>Daily quest</span></div>
        <div class="a6-mini"><b data-a6-reward>Grow</b><span>Next reward</span></div>
      </section>
    </aside>

    <section class="a6-bottom">
      <article class="a6-continue">
        <img src="./v04_latin_learn_hero.webp" alt="">
        <div class="a6-panel-copy"><small>LEARN · GROW · DISCOVER</small><h3>Your next lesson</h3><p>Return to the subject you are already building.</p><button type="button" data-global-route="study">Open Study Hub</button></div>
      </article>
      <article class="a6-quick">
        <img src="./v04_latin_games_hero.webp" alt="">
        <div class="a6-panel-copy"><small>SHORT BREAK</small><h3>Quick Play</h3><p>Practise with a short learning game.</p><button type="button" data-global-route="study">Choose a game</button></div>
      </article>
    </section>`;
  screen.prepend(wrap);
  syncHome();
}
function syncHome(){
  const root=$('.a6-home'); if(!root)return;
  const level=growthText('[data-growth="level"]','1');
  const xp=growthText('[data-growth="xp"]','0');
  const next=growthText('[data-growth="next"]','100');
  $('[data-a6-level]',root).textContent=level;
  $('[data-a6-xp]',root).textContent=xp;
  $('[data-a6-next]',root).textContent=next;
  const denom=Math.max(1,Number(next)||100);
  $('[data-a6-xpbar]',root).style.width=`${Math.min(100,(Number(xp)||0)/denom*100)}%`;
  const garden=$('#homeGrowthStage')?.textContent?.trim()||$('#journeyGarden')?.textContent?.trim()||'Garden Stage';
  $('[data-a6-garden]',root).textContent=garden;
  const daily=$('#journeyDaily')?.textContent?.trim();
  if(daily)$('[data-a6-tasks]',root).textContent=daily;
  const reward=$('#journeyReward')?.textContent?.trim();
  if(reward)$('[data-a6-reward]',root).textContent=reward;
}
function studyFooter(){
  const screen=$('#studyScreen'); if(!screen||$('.a6-study-footer',screen))return;
  const f=document.createElement('section');f.className='a6-study-footer';
  f.innerHTML=`
   <article class="a6-card"><p class="eyebrow">DAILY GOALS</p><h3>Keep today's plan small</h3><p>Choose one subject, finish one focused activity, then review anything genuinely due.</p></article>
   <article class="a6-card"><p class="eyebrow">LEARNING STREAK</p><h3>Consistency over intensity</h3><p>Your real study history stays in the existing learning state; this panel does not invent a streak.</p></article>
   <article class="a6-card"><p class="eyebrow">UPCOMING REVIEW</p><h3>Use the subject engines</h3><p>Open a subject to see the actual due-review count calculated by the app.</p></article>`;
  screen.appendChild(f);
}
function navState(){
  const route=(location.hash||'#home').replace(/^#/,'').split('/')[0]||'home';
  document.querySelectorAll('.global-nav [data-global-route]').forEach(b=>{
    const active=b.dataset.globalRoute===route || (route==='subject'&&b.dataset.globalRoute==='study');
    b.classList.toggle('active',active);
    if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
  });
}
function boot(){
  document.documentElement.classList.add('a6-true-ui-rebuild');
  buildHome();studyFooter();navState();syncHome();
}
document.addEventListener('DOMContentLoaded',boot);
window.addEventListener('hashchange',navState);
document.addEventListener('alpha5:refresh',()=>{buildHome();studyFooter();navState();syncHome()});
})();
