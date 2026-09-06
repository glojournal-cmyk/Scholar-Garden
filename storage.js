
export const SCHOLAR_STATE_KEY='luxScholarGardenV1';
export const freshState=()=>({version:1,xp:0,level:1,medals:{},collectibles:{},wardrobe:{hair:'starter',outfit:'starter',accessory:null},garden:{stage:1,equipped:[]},claims:{},eventCounts:{},history:[],studyDates:{},subjects:{latin:{},french:{}}});
export function load(){try{const v=JSON.parse(localStorage.getItem(SCHOLAR_STATE_KEY)||'null');return v&&typeof v==='object'?{...freshState(),...v}:freshState()}catch{return freshState()}}
export const save=s=>localStorage.setItem(SCHOLAR_STATE_KEY,JSON.stringify(s));
export function localDay(d=new Date()){return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
export function legacyLatin(){try{return JSON.parse(localStorage.getItem('latinSummerV8State')||'null')}catch{return null}}
