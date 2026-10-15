// Presentation and device lifecycle only; the desktop file is the gameplay source.
let mobilePaused=true,mobileMessageText='',mobileMessageMode='',mobileLandscape=window.innerWidth>window.innerHeight;
const mobilePointers=new Map();
function mobileMessage(text,mode=''){mobileMessageText=text;mobileMessageMode=mode;const el=document.getElementById('mobileText');if(el.textContent!==text)el.textContent=text;document.getElementById('mobileDialogue').dataset.mode=mode;document.getElementById('menuLatest').textContent=text}
function releaseMobileHolds(){mobilePointers.clear();keys.clear();document.querySelectorAll('[data-hold]').forEach(b=>b.classList.remove('held'))}
function clearMobileInput(){mobilePointers.clear();keys.clear();pressedKeys.clear();if(player)player.jumpBuffer=0;document.querySelectorAll('[data-hold]').forEach(b=>b.classList.remove('held'))}
function pauseMobile(reason='Paused. The AI can wait.'){mobilePaused=true;clearMobileInput();$('menuTitle').textContent=reason;$('mobileResume').textContent='Resume';$('mobileMenu').hidden=false;suspendSound()}
function resumeMobile(){if(window.innerHeight>window.innerWidth||document.hidden)return;clearMobileInput();mobilePaused=false;last=performance.now()/1000;acc=0;$('mobileMenu').hidden=true;resumeSound()}
function syncMobileUI(){
 const feedback=forecastFeedback(),active=['scanning','locked','purge','missed'].includes(feedback.phase);const signal=state==='paywall'?'AI PAYWALL / FREE PLAN AVAILABLE':state==='compacting'?'COMPACTING / PLEASE WAIT':state==='dead'?'USER ERROR / READ AT YOUR LEISURE':state==='won'?'ESCAPED':active?feedback.text:autocomplete?.phase==='guess'?'AI GUESS: '+autocomplete.mode+' / OPTIONAL':L.glassTest?'GLASS LAB / BROKEN BEAM = SUPPORT':nearest()?'REWRITE: '+nearest().kind.toUpperCase()+' / TAP X':'MOVE · JUMP · REWRITE';
 if($('mobileSignal').textContent!==signal)$('mobileSignal').textContent=signal;
 $('mobileWinRestart').hidden=state!=='won';for(const id of ['restart','floorPractice','glassPractice','longPractice','longLevelSelect'])$(id).disabled=state==='dead'||state==='compacting'||state==='paywall';
}
function refreshHud(){refreshDesktopHud();syncMobileUI()}
function runFrame(dt){if(mobilePaused||document.hidden||window.innerHeight>window.innerWidth)return;runDesktopFrame(dt)}
function draw(){ctx.save();ctx.translate(0,-150);drawDesktop();ctx.restore()}
function updateMobileOrientation(){const landscape=window.innerWidth>window.innerHeight;$('mobileRotate').hidden=landscape;if(landscape!==mobileLandscape){mobileLandscape=landscape;pauseMobile(landscape?'Rotated. Tap Resume when your thumbs are ready.':'Paused while rotating.')}if(!landscape)clearMobileInput()}
function installMobileUI(){
 // Safari long-press UI must not take over held gameplay controls.
 // Keep native pinch zoom available elsewhere, including the canvas and menus.
 document.addEventListener('contextmenu',e=>{if(e.target.closest('button,#mobileApp'))e.preventDefault()});
 for(const b of document.querySelectorAll('#touch button')){
  b.addEventListener('touchstart',e=>e.preventDefault(),{passive:false});
  b.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
 }
 $('mobilePause').onclick=()=>pauseMobile();$('mobileDialogue').onclick=()=>pauseMobile('Paused. Read the AI at your own pace.');$('mobileDialogue').addEventListener('keydown',e=>{if(e.code==='Enter'||e.code==='Space'){e.preventDefault();e.stopPropagation();pauseMobile('Paused. Read the AI at your own pace.')}});$('mobileResume').onclick=resumeMobile;
 $('mobileWinRestart').onclick=()=>{initRoom(true);syncMobileUI()};
 for(const id of ['restart','floorPractice','glassPractice','longPractice'])$(id).addEventListener('click',()=>{if(state!=='dead'&&state!=='compacting'&&state!=='paywall')resumeMobile()});
 for(const b of document.querySelectorAll('[data-hold]')){
  const key=b.dataset.hold;
  b.addEventListener('pointerdown',e=>{e.preventDefault();if(mobilePaused||state!=='play')return;mobilePointers.set(e.pointerId,key);keys.add(key);b.classList.add('held');try{b.setPointerCapture(e.pointerId)}catch(_){}});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,e=>{mobilePointers.delete(e.pointerId);if(![...mobilePointers.values()].includes(key)){keys.delete(key);b.classList.remove('held')}});
 }
 $('touchjump').addEventListener('pointerdown',e=>{e.preventDefault();if(!mobilePaused)jump()});$('glitch').addEventListener('pointerdown',e=>{e.preventDefault();if(!mobilePaused)lie()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseMobile('Paused while you were away.');else if(mobilePaused)$('mobileMenu').hidden=false});
 window.addEventListener('blur',()=>pauseMobile('Paused while you were away.'));window.addEventListener('resize',updateMobileOrientation);window.addEventListener('orientationchange',updateMobileOrientation);
 const originalState=window.__EXCEPTION_TEST__.getState;window.__EXCEPTION_TEST__.getState=()=>({...originalState(),mobilePaused,landscape:mobileLandscape});
 updateMobileOrientation();
}
