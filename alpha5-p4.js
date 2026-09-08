
(() => {
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

let deferredInstallPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e});

const newOutfits=[
 'Rose Academy Cardigan','Garden Athletics','Scholar Athletics','Midnight Track',
 'Noir Academy','Onyx Prefect','Midnight Atelier'
];

function badgeNewOutfits(){
 $$('.wardrobe-preview-card').forEach(card=>{
   const text=(card.textContent||'').trim();
   if(newOutfits.some(n=>text.includes(n)) && !$('.a5-outfit-new-badge',card)){
     const b=document.createElement('span');b.className='a5-outfit-new-badge';b.textContent='NEW';
     card.appendChild(b);
   }
 });
}

function markEquipped(){
 $$('.wardrobe-preview-card').forEach(c=>c.classList.remove('equipped'));
 const active=$('.wardrobe-preview-card [aria-pressed="true"],.wardrobe-preview-card button.active,.wardrobe-preview-card .equipped');
 if(active){
   const card=active.closest('.wardrobe-preview-card'); if(card)card.classList.add('equipped');
 }
}

function settingsFooter(){
 const box=$('.a5-settings'); if(!box || $('.a5-settings-footer',box)) return;
 const f=document.createElement('div');f.className='a5-settings-footer';
 f.innerHTML=`<button type="button" data-a5-install>Install App</button><button type="button" data-a5-reset>Reset Local Preferences</button>`;
 box.appendChild(f);
 const install=$('[data-a5-install]',f);
 install.onclick=async()=>{
   if(deferredInstallPrompt){
     deferredInstallPrompt.prompt();
     try{await deferredInstallPrompt.userChoice}catch{}
     deferredInstallPrompt=null;
     install.disabled=true;install.textContent='Install handled by browser';
     return;
   }
   install.textContent='Use your browser’s Add to Home Screen';
 };
 $('[data-a5-reset]',f).onclick=()=>{
   try{localStorage.removeItem('lux-alpha5-prefs')}catch{}
   location.reload();
 };
}

function polishSubjectArt(){
 const hero=$('#subjectHero')||$('.subject-hero');
 if(!hero)return;
 const img=$('img',hero); if(!img)return;
 const s=(location.hash||'').toLowerCase();
 if(s.includes('latin')) img.style.objectPosition='center 38%';
 else if(s.includes('french')) img.style.objectPosition='center 42%';
 else if(s.includes('biology')) img.style.objectPosition='center 36%';
}

function accessibility(){
 $$('button:not([aria-label])').forEach(btn=>{
   const t=(btn.textContent||'').trim();
   if(t && t.length<80) btn.setAttribute('aria-label',t);
 });
 $$('img:not([alt])').forEach(img=>img.setAttribute('alt',''));
}

let lock=false;
function enhance(){
 if(lock)return;lock=true;
 requestAnimationFrame(()=>{lock=false;badgeNewOutfits();markEquipped();settingsFooter();polishSubjectArt();accessibility()});
}

document.addEventListener('DOMContentLoaded',enhance);
document.addEventListener('alpha5:refresh',enhance);
})();
