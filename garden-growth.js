
(function(){
'use strict';

/*
 Optional V0.4 garden-growth art runtime.
 Stage rules remain owned by LuxGrowth; this module only selects presentation art.
 It stays disabled until the four supplied transparent PNGs are integrated.
*/
const CONTRACT=Object.freeze({
  available:false,
  stages:Object.freeze({
    1:'garden_growth_01_seed.png',
    2:'garden_growth_02_young.png',
    3:'garden_growth_03_budding.png',
    4:'garden_growth_04_bloom.png'
  })
});
function config(){
  const o=window.ScholarGardenGrowthConfig;
  return o&&typeof o==='object'?{...CONTRACT,...o,stages:o.stages||CONTRACT.stages}:CONTRACT;
}
function stage(){
  try{return Math.max(1,Math.min(4,Number(window.LuxGrowth?.snapshot?.().gardenStage)||1))}catch{return 1}
}
function artForStage(n=stage()){
  const c=config();
  return c.available?c.stages[Math.max(1,Math.min(4,Number(n)||1))]||null:null;
}
function render(){
  const slot=document.getElementById('gardenGrowthSpecimen');
  if(!slot)return false;
  const src=artForStage();
  if(!src){
    slot.hidden=true;
    slot.innerHTML='';
    return false;
  }
  const n=stage();
  slot.hidden=false;
  slot.innerHTML=`<img src="${src}" alt="Garden growth stage ${n}" decoding="async"><div><small>GROWTH SPECIMEN</small><strong>Stage ${n}</strong></div>`;
  return true;
}
document.addEventListener('lux:growth',render);
window.addEventListener('DOMContentLoaded',render,{once:true});
window.ScholarGardenGrowth=Object.freeze({CONTRACT,stage,artForStage,render});
})();
