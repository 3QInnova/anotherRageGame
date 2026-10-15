// Presentation and device lifecycle only; the desktop file is the gameplay source.
let mobilePaused=true,mobileMessageText='',mobileMessageMode='',mobileLandscape=window.innerWidth>window.innerHeight;
let mobileMenuView='play',mobileMessageAt=0,mobileRoomSeen=-1,mobileRoomAt=0;
const mobilePointers=new Map(),mobileHistory=[];
const defaultMobileControls={size:100,opacity:55,inset:14};
let mobileControls={...defaultMobileControls};
function mobileMessage(text,mode=''){
 mobileMessageMode=mode;
 if(mobileMessageText!==text){mobileMessageText=text;mobileMessageAt=performance.now();
  if(text){mobileHistory.unshift(text);mobileHistory.length=Math.min(30,mobileHistory.length);renderMobileHistory();}
 }
 $('mobileText').textContent=text;$('mobileDialogue').dataset.mode=mode;$('menuLatest').textContent=text;
}
function renderMobileHistory(){const list=$('aiHistory');if(!list.replaceChildren)return;list.replaceChildren(...mobileHistory.map(text=>{const item=document.createElement('li');item.textContent=text;return item}))}
function releaseMobileHolds(){mobilePointers.clear();keys.clear();document.querySelectorAll('#touch button').forEach(b=>b.classList.remove('held'))}
function clearMobileInput(){releaseMobileHolds();pressedKeys.clear();if(player)player.jumpBuffer=0;}
function setMobileMenu(view){
 mobileMenuView=view;
 for(const name of ['play','practice','controls','audio','log'])$('panel-'+name).hidden=name!==view;
 for(const tab of document.querySelectorAll('[data-menu-tab]')){const active=tab.dataset.menuTab===view;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;}
 $('newRunConfirm').hidden=true;
}
function pauseMobile(reason='Paused. The AI can wait.'){
 const wasPaused=mobilePaused;mobilePaused=true;clearMobileInput();
 $('menuTitle').textContent=reason;$('mobileResume').textContent='Resume';$('mobileMenu').hidden=false;
 if(!wasPaused)setMobileMenu('play');
 $('mobileApp').inert=true;suspendSound();syncMobileUI();
 if(!wasPaused)$('mobileResume').focus?.({preventScroll:true});
}
function resumeMobile(){
 if(window.innerHeight>window.innerWidth||document.hidden)return;
 clearMobileInput();mobilePaused=false;last=performance.now()/1000;acc=0;
 $('mobileMenu').hidden=true;$('mobileApp').inert=false;resumeSound();syncMobileUI();
 $('mobilePause').focus?.({preventScroll:true});
}
function syncMobileUI(){
 const feedback=forecastFeedback(),active=['scanning','locked','purge','missed'].includes(feedback.phase),target=nearest();
 const signal=state==='paywall'?'AI PAYWALL / FREE PLAN AVAILABLE':state==='compacting'?'COMPACTING / PLEASE WAIT':state==='dead'?'USER ERROR / READ AT YOUR LEISURE':state==='won'?'ESCAPED':active?feedback.text:autocomplete?.phase==='guess'?'AI GUESS: '+autocomplete.mode+' / OPTIONAL':L.glassTest?'GLASS LAB / BROKEN BEAM = SUPPORT':target?'REWRITE: '+target.kind.toUpperCase():'AI ONLINE / TRUST OPTIONAL';
 if($('mobileSignal').textContent!==signal)$('mobileSignal').textContent=signal;
 const blocked=state==='dead'||state==='compacting'||state==='paywall';
 $('mobileApp').dataset.blocked=String(mobilePaused||state!=='play');
 $('mobileWinRestart').hidden=state!=='won';
 for(const id of ['restart','floorPractice','glassPractice','longPractice','longLevelSelect','newRun','confirmNewRun'])$(id).disabled=blocked;
 $('glitch').disabled=!target||mobilePaused||state!=='play';$('glitch').classList.toggle?.('ready',!!target);
 $('mobileDialogue').dataset.quiet=String(!active&&!target&&mobileMessageMode!=='danger'&&performance.now()-mobileMessageAt>7000);
 if(room!==mobileRoomSeen){mobileRoomSeen=room;mobileRoomAt=performance.now();$('mobileRoomNotice').textContent=L.glassTest?'GLASS LAB':('ROOM '+String(room+1).padStart(2,'0'));}
 $('mobileRoomNotice').hidden=mobilePaused||state!=='play'||performance.now()-mobileRoomAt>4000;
}
function refreshHud(){refreshDesktopHud();syncMobileUI()}
function runFrame(dt){if(mobilePaused||document.hidden||window.innerHeight>window.innerWidth)return;runDesktopFrame(dt)}
function updateMobileOrientation(){
 const landscape=window.innerWidth>window.innerHeight;resizeMobileViewport();$('mobileRotate').hidden=landscape;
 if(landscape!==mobileLandscape){mobileLandscape=landscape;pauseMobile(landscape?'Rotated. Tap Resume when your thumbs are ready.':'Paused while rotating.');}
 if(!landscape)clearMobileInput();
}
function applyMobileControls(save=false){
 const values={size:[90,115],opacity:[35,100],inset:[10,30]};
 for(const [key,[lo,hi]] of Object.entries(values))mobileControls[key]=Math.max(lo,Math.min(hi,Number(mobileControls[key])||defaultMobileControls[key]));
 const root=document.documentElement;
 root?.style?.setProperty('--control-size',String(mobileControls.size/100));
 root?.style?.setProperty('--control-opacity',String(mobileControls.opacity/100));
 root?.style?.setProperty('--control-inset',mobileControls.inset+'px');
 for(const [key,id] of [['size','Size'],['opacity','Opacity'],['inset','Inset']]){$('control'+id).value=mobileControls[key];$('control'+id+'Value').textContent=mobileControls[key]+(key==='inset'?'px':'%');}
 resizeMobileViewport();
 if(save)try{localStorage.setItem('exception-mobile-controls-v1',JSON.stringify(mobileControls))}catch(_){}
}
function installMobileUI(){
 try{mobileControls={...defaultMobileControls,...JSON.parse(localStorage.getItem('exception-mobile-controls-v1')||'{}')}}catch(_){}
 applyMobileControls();setMobileMenu('play');$('mobileApp').inert=true;
 document.addEventListener('contextmenu',e=>{if(e.target.closest('button,#mobileApp'))e.preventDefault()});
 for(const b of document.querySelectorAll('#touch button')){b.addEventListener('touchstart',e=>e.preventDefault(),{passive:false});b.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});}
 $('mobilePause').onclick=()=>pauseMobile();$('mobileResume').onclick=resumeMobile;
 $('mobileWinRestart').onclick=()=>{initRoom(true);syncMobileUI()};
 for(const tab of document.querySelectorAll('[data-menu-tab]'))tab.onclick=()=>setMobileMenu(tab.dataset.menuTab);
 $('openPractice').onclick=()=>setMobileMenu('practice');$('practiceBack').onclick=()=>setMobileMenu('play');
 $('newRun').onclick=()=>{$('newRunConfirm').hidden=false;};$('cancelNewRun').onclick=()=>{$('newRunConfirm').hidden=true;};
 $('confirmNewRun').onclick=()=>{if(['dead','compacting','paywall'].includes(state))return;initRoom(true);resumeMobile()};
 for(const [key,id] of [['size','Size'],['opacity','Opacity'],['inset','Inset']])$('control'+id).addEventListener('input',e=>{mobileControls[key]=e.target.value;applyMobileControls(true)});
 $('highVisibility').onclick=()=>{mobileControls.opacity=100;applyMobileControls(true)};
 $('resetControls').onclick=()=>{mobileControls={...defaultMobileControls};applyMobileControls(true)};
 for(const id of ['restart','floorPractice','glassPractice','longPractice'])$(id).addEventListener('click',()=>{if(!['dead','compacting','paywall'].includes(state))resumeMobile()});
 for(const b of document.querySelectorAll('[data-hold]')){
  const key=b.dataset.hold;
  b.addEventListener('pointerdown',e=>{e.preventDefault();if(mobilePaused||state!=='play')return;mobilePointers.set(e.pointerId,key);keys.add(key);b.classList.add('held');try{b.setPointerCapture(e.pointerId)}catch(_){}});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,e=>{mobilePointers.delete(e.pointerId);if(![...mobilePointers.values()].includes(key)){keys.delete(key);b.classList.remove('held')}});
 }
 for(const [id,action] of [['touchjump',jump],['glitch',lie]]){
  const b=$(id);b.addEventListener('pointerdown',e=>{e.preventDefault();if(!mobilePaused&&state==='play'&&!b.disabled){b.classList.add('held');try{b.setPointerCapture(e.pointerId)}catch(_){}action();}});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>b.classList.remove('held'));
 }
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseMobile('Paused while you were away.');else if(mobilePaused)$('mobileMenu').hidden=false});
 window.addEventListener('blur',()=>pauseMobile('Paused while you were away.'));window.addEventListener('resize',updateMobileOrientation);window.addEventListener('orientationchange',updateMobileOrientation);
 $('mobileMenu').addEventListener('keydown',e=>{
  if(e.code==='Escape'){e.preventDefault();if(mobileMenuView!=='play')setMobileMenu('play');else resumeMobile();}
  if(e.code==='Tab'){
   const items=[...$('mobileMenu').querySelectorAll('button:not(:disabled),select,input,summary')].filter(el=>el.getClientRects().length);
   const first=items[0],last=items[items.length-1];if((e.shiftKey&&document.activeElement===first)||(!e.shiftKey&&document.activeElement===last)){e.preventDefault();(e.shiftKey?last:first)?.focus();}
  }
  if(e.target.matches?.('[role="tab"]')&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){
   const tabs=[...document.querySelectorAll('[data-menu-tab]')],index=tabs.indexOf(e.target),next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;e.preventDefault();setMobileMenu(tabs[next].dataset.menuTab);tabs[next].focus();
  }
 });
 const originalState=window.__EXCEPTION_TEST__.getState;window.__EXCEPTION_TEST__.getState=()=>({...originalState(),mobilePaused,landscape:mobileLandscape});
 window.__MOBILE_UI_TEST__={viewport:()=>({...mobileView}),menu:()=>mobileMenuView,history:()=>[...mobileHistory],paintCount:()=>mobilePaintCount};
 updateMobileOrientation();
}
