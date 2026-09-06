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
function normalizeWardrobeState(){
 const s=ensureWardrobe(state());
 if(s.wardrobe.outfit==='starter'){
   s.wardrobe.outfit='school-uniform';
   save(s);
 }
 return s;
}
function renderAvatarCanvas(s){
 const img=document.getElementById('wardrobeScholarImage'),canvas=document.getElementById('avatarCanvas');
 if(!img||!canvas)return;
 const selected=window.ScholarAssets?.selectedOutfit?.()||window.ScholarAssets?.manifest?.outfits?.[0];
 if(selected){
   img.src=selected.asset;
   img.alt=`Scholar wearing ${selected.name}`;
   canvas.classList.add('has-scholar-art');
 }
}
function renderWardrobe(){
 const s=normalizeWardrobeState(),root=document.getElementById('wardrobeControls');if(!root)return;
 const g=window.LuxGrowth.snapshot(),items=window.ScholarAssets?.manifest?.outfits||[];
 const equipped=window.ScholarAssets?.normalizeOutfitId?.(s.wardrobe.outfit)||'school-uniform';
 renderAvatarCanvas(s);
 root.innerHTML=`<div class="wardrobe-gallery">${items.map(item=>{
   const unlocked=window.ScholarAssets.outfitUnlocked(item,g),selected=item.id===equipped;
   const requirement=window.ScholarAssets.unlockRequirement(item);
   return `<article class="wardrobe-preview-card ${unlocked?'unlocked':'locked'} ${selected?'selected':''}">
     <div class="wardrobe-art-wrap">
       <img src="${esc(item.asset)}" alt="${esc(item.name)}" loading="lazy" decoding="async">
       ${unlocked?'':`<span class="wardrobe-lock">Locked</span>`}
       ${selected?'<span class="wardrobe-selected">Equipped</span>':''}
     </div>
     <div class="wardrobe-card-copy">
       <h3>${esc(item.name)}</h3>
       <p>${unlocked?(selected?'Currently equipped.':'Unlocked through study.'):`Unlock: ${esc(requirement)}`}</p>
       <button class="${selected?'secondary':'primary'}" data-equip-outfit="${esc(item.id)}" ${unlocked&&!selected?'':'disabled'}>${selected?'Equipped':unlocked?'Equip':'Locked'}</button>
     </div>
   </article>`;
 }).join('')}</div>`;
 root.querySelectorAll('[data-equip-outfit]').forEach(b=>b.onclick=()=>{
   const item=items.find(x=>x.id===b.dataset.equipOutfit);
   const latest=window.LuxGrowth.snapshot();
   if(!item||!window.ScholarAssets.outfitUnlocked(item,latest))return;
   const fresh=ensureWardrobe(state());
   fresh.wardrobe.outfit=item.id;
   save(fresh);
   renderWardrobe();
   document.dispatchEvent(new CustomEvent('scholar:wardrobe-change',{detail:{outfit:item.id}}));
 });
}
function renderCollection(){
 const s=state(),filter=document.querySelector('[data-collection-filter].active')?.dataset.collectionFilter||'All';
 const root=document.getElementById('collectionGrid');if(!root)return;
 root.innerHTML=BLUEPRINT.filter(x=>filter==='All'||x[1]===filter).map(x=>{
  const earned=!!s.collectibles?.[x[0]],art=window.ScholarAssets?.rewardAsset?.(x[0]);
  return `<article class="collect-card ${earned?'earned':''}">
    <div class="collect-art ${art?'has-reward-art':''}">${art?`<img class="reward-interaction-art" src="${esc(art)}" alt="${esc(x[2])} reward interaction" loading="lazy" decoding="async">`:(earned?'✓':'◆')}</div>
    <small>${esc(x[1])}</small><h3>${esc(x[2])}</h3>
    <p>${earned?'Earned through study.':`Next step: ${esc(x[3])}`}</p>
  </article>`;
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
window.ScholarView=Object.freeze({openTab,renderWardrobe,renderAvatarCanvas,renderCollection,renderAchievements,BLUEPRINT});
window.addEventListener('DOMContentLoaded',bind,{once:true});
})();