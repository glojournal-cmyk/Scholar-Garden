
const routes=new Set(['home','latin','french','garden','collection','profile','diagnostics']);
export const route=()=>routes.has(location.hash.slice(1))?location.hash.slice(1):'home';
export function go(r){r=routes.has(r)?r:'home';if(location.hash!==`#${r}`)location.hash=r;else render(r)}
export function render(r=route()){document.querySelectorAll('[data-screen]').forEach(x=>x.classList.toggle('hidden',x.dataset.screen!==r));document.querySelectorAll('[data-route]').forEach(x=>x.classList.toggle('active',x.dataset.route===r));window.scrollTo(0,0);document.dispatchEvent(new CustomEvent('lux:route',{detail:{route:r}}))}
