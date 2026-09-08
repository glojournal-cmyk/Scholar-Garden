
(() => {
'use strict';
function diversify(){
  const q=(s)=>document.querySelector(s);
  const quick=q('.a6-quick img');
  const cont=q('.a6-continue img');
  const hero=q('.a6-hero>img');
  if(hero) hero.src='./v04_home_hero.webp';
  if(cont) cont.src='./v04_alt_study_scene_03.webp';
  if(quick) quick.src='./v04_alt_study_scene_07.webp';

  const garden=q('.a6-garden img');
  if(garden) garden.src='./garden_02.webp';

  // Give Scholar screens different imagery where safe.
  const overview=q('#scholarOverviewImage');
  if(overview && !overview.dataset.l2Art){
    overview.src='./scholar_welcome.png';
    overview.dataset.l2Art='1';
  }
}
function boot(){
  document.documentElement.classList.add('a6-layout2');
  diversify();
}
document.addEventListener('DOMContentLoaded',boot);
document.addEventListener('alpha5:refresh',diversify);
})();
