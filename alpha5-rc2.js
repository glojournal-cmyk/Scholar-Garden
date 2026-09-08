
(() => {
'use strict';
let queued=false;
function refresh(){
 if(queued)return;
 queued=true;
 requestAnimationFrame(()=>{
   queued=false;
   document.dispatchEvent(new CustomEvent('alpha5:refresh'));
 });
}
document.addEventListener('DOMContentLoaded',()=>{
 const root=document.querySelector('.main-stage')||document.body;
 new MutationObserver(refresh).observe(root,{
   subtree:true,childList:true,attributes:true,attributeFilter:['class','aria-pressed']
 });
 window.addEventListener('hashchange',()=>setTimeout(refresh,20));
 document.addEventListener('click',()=>setTimeout(refresh,30),true);
 refresh();
});
})();
