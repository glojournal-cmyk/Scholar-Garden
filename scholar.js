(function(){
'use strict';
const BLUEPRINT=[
 ['ink-pot','Scholar','Ink Pot','40 Scholar XP'],['desk-lamp','Scholar','Desk Lamp','3 study days'],
 ['study-books','Scholar','Study Books','250 Scholar XP'],['ivy-pot','Scholar','Ivy Pot','7 study days'],
 ['bronze-stylus','Latin','Bronze Stylus','120 Latin XP'],['wax-tablet','Latin','Wax Tablet','250 Latin XP'],
 ['fountain-pen','French','Fountain Pen','120 French XP'],['lavender-vase','French','Lavender Vase','250 French XP'],
 ['scholars-globe','Prestige','Scholar’s Globe','300 Latin + 300 French XP'],['golden-lexicon','Prestige','Golden Lexicon','1,500 Scholar XP']
];
const MEDALS=[
 ['first-steps','First Steps','Reach the first Scholar milestone.'],
 ['daily-disciplina','Daily Disciplina','Build a steady study habit.'],
 ['latin-scholar','Latin Scholar','Grow through Latin learning.'],
 ['french-scholar','French Scholar','Grow through French learning.'],
 ['polyglot','Polyglot Scholar','Build strength across both languages.']
];
const STARTER={
 hair:[['starter','Starter']],
 outfit:[['starter','Starter']],
 accessory:[['none','None']],
 hand:[['none','None']]
};
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function state(){return window.LuxGrowth.load()}
function save(s){window.LuxGrowth.save(s)}
function ensureWardrobe(s){
 s.wardrobe=s.wardrobe||{};
 if(!s.wardrobe.hair)s.wardrobe.hair='starter';
 if(!s.wardrobe.outfit)s.wardrobe.outfit='starter';
 if(!('accessory'in s.wardrobe))s.wardrobe.accessory=null;
 if(!('hand'in s.wardrobe))s.wardrobe.hand=null;
 return s;
}
function renderWardrobe(){
 const s=ensureWardrobe(state()),root=document.getElementById('wardrobeControls');if(!root)return;
 const groups=[
  ['hair','Hair',STARTER.hair],
  ['outfit','Outfit',STARTER.outfit],
  ['accessory','Accessories',STARTER.accessory],
  ['hand','Hand item / study item',STARTER.hand]
 ];
 root.innerHTML=groups.map(([key,label,opts])=>`<section class="wardrobe-group"><h3>${label}</h3><div class="wardrobe-options">${
  opts.map(([id,name])=>`<button data-wardrobe-key="${key}" data-wardrobe-value="${id}" class="${String(s.wardrobe[key]??'none')===id?'selected':''}">${name}</button>`).join('')
 }</div></section>`).join('');
 root.querySelectorAll('[data-wardrobe-key]').forEach(b=>b.onclick=()=>{
  const fresh=ensureWardrobe(state()),key=b.dataset.wardrobeKey,val=b.dataset.wardrobeValue;
  fresh.wardrobe[key]=(val==='none'?null:val);save(fresh);renderWardrobe();
 });
}
function renderCollection(){
 const s=state(),filter=document.querySelector('[data-collection-filter].active')?.dataset.collectionFilter||'All';
 const root=document.getElementById('collectionGrid');if(!root)return;
 root.innerHTML=BLUEPRINT.filter(x=>filter==='All'||x[1]===filter).map(x=>{
  const earned=!!s.collectibles?.[x[0]];
  return `<article class="collect-card ${earned?'earned':''}"><div class="collect-art">${earned?'✓':'◆'}</div><small>${esc(x[1])}</small><h3>${esc(x[2])}</h3><p>${earned?'Earned through study.':`Next step: ${esc(x[3])}`}</p></article>`;
 }).join('');
}
function renderAchievements(){
 const s=state(),root=document.getElementById('medalGrid');if(!root)return;
 root.innerHTML=MEDALS.map(([id,title,copy])=>`<article class="medal-card ${s.medals?.[id]?'earned':''}"><div>${s.medals?.[id]?'✓':'◉'}</div><b>${esc(title)}</b><small>${s.medals?.[id]?esc(copy):'Not earned yet'}</small></article>`).join('');
}
function openTab(tab='wardrobe'){
 document.querySelectorAll('[data-scholar-tab]').forEach(b=>b.classList.toggle('active',b.dataset.scholarTab===tab));
 document.querySelectorAll('[data-scholar-pane]').forEach(p=>p.classList.toggle('hidden',p.dataset.scholarPane!==tab));
 if(tab==='wardrobe')renderWardrobe();if(tab==='collection')renderCollection();if(tab==='achievements')renderAchievements();
 history.replaceState(null,'',`#scholar/${tab}`);
}
function bind(){
 document.querySelectorAll('[data-scholar-tab]').forEach(b=>b.onclick=()=>openTab(b.dataset.scholarTab));
 document.querySelectorAll('[data-collection-filter]').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('[data-collection-filter]').forEach(x=>x.classList.toggle('active',x===b));renderCollection();
 });
}
window.ScholarView=Object.freeze({openTab,renderWardrobe,renderCollection,renderAchievements,BLUEPRINT});
window.addEventListener('DOMContentLoaded',bind,{once:true});
})();