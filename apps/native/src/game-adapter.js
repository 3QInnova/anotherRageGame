// Injected inside the game's existing closure, in the native artifact only.
function installNativeUI(){
 window.addEventListener('exception:inactive',()=>pauseMobile('Paused while you were away.'));
 window.addEventListener('exception:active',()=>{if(mobilePaused)$('mobileMenu').hidden=false;});
 window.addEventListener('exception:back',()=>{
  if(state==='paywall'&&!mobilePaused){advancePaywall();return;}
  if(mobilePaused){if(mobileMenuView!=='play')setMobileMenu('play');else window.ExceptionNative?.minimize();return;}
  pauseMobile('Paused. Your progress is still here.');
 });
 const native=window.ExceptionNative?.health.native;
 if(native){
  document.documentElement.classList.add('native-app');
  const footer=$('mobileMenu').querySelector('.card > p:last-child');
  if(footer)footer.textContent='Local phone playtest · works offline.';
 }
 window.__EXCEPTION_NATIVE_TEST__={health:()=>window.ExceptionNative?.health??{native:false},paused:()=>mobilePaused};
}
