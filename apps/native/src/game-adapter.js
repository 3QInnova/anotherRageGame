// Injected inside the game's existing closure, in the native artifact only.
function installNativeUI(){
 window.addEventListener('exception:inactive',()=>pauseMobile('Paused while you were away.'));
 window.addEventListener('exception:active',()=>{if(mobilePaused)$('mobileMenu').hidden=false;});
 window.addEventListener('exception:back',()=>{
  if(rewardShopOpen){closeRewardShop();return;}
  if(campaignMenuOpen){if(campaignView!=='campaign')setCampaignView('campaign');else closeCampaignMenu(false);return;}
  if(state==='paywall'&&!mobilePaused){advancePaywall();return;}
  if(mobilePaused){if(mobileMenuView!=='play')setMobileMenu('play');else window.ExceptionNative?.minimize();return;}
  pauseMobile('Paused. Your progress is still here.');
 });
 const native=window.ExceptionNative?.health.native;
 if(native){
  document.documentElement.classList.add('native-app');
  const footer=$('mobileMenu').querySelector('.card > p:last-child');
  if(footer)footer.textContent='Gameplay works offline. Ads require a connection.';
  installNativeAds();
  installNativeLegal();
 }
 window.__EXCEPTION_NATIVE_TEST__={health:()=>window.ExceptionNative?.health??{native:false},paused:()=>mobilePaused};
}

// Native-only UI shared by the iOS and Android ad bridges.
function installNativeAds(){
 const ads=window.ExceptionNative?.ads;if(!ads)return;
 document.documentElement.classList.add('native-ads');
 const style=document.createElement('style');
 style.textContent=`#nativeAdActions{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}#nativeAdActions button{min-height:44px;padding:8px 12px}#nativeAdsStatus{font-size:12px;color:#63716a}`;
 document.head.appendChild(style);
 const panel=document.createElement('div');panel.id='nativeAdActions';
 for(const [id,label,method]of [['nativeAdPrivacy','Ad privacy & info','privacy'],['nativeAdReport','Report an ad','report']]){
  const button=document.createElement('button');button.id=id;button.type='button';button.textContent=label;
  button.onclick=async()=>{pauseMobile('Paused for ad privacy.');button.disabled=true;try{await ads[method]()}catch(_){status.textContent='Unable to open ad options. Please try again.'}finally{button.disabled=false}};panel.appendChild(button);
 }
 const status=document.createElement('p');status.id='nativeAdsStatus';status.setAttribute('role','status');status.textContent='Checking ad privacy…';
 ($('menuSettings')||$('panel-play')).append(panel,status);
 window.addEventListener('exception:ad-pause',()=>pauseMobile('Paused while the ad or privacy dialog is open.'));
 window.addEventListener('exception:ad-status',event=>{status.textContent=event.detail?.status||'No ad available. You can keep playing.'});
 // Fail closed if any interactive UI enters the fixed banner allocation or its buffer.
 // Includes disabled buttons: they still occupy a visible control surface.
 const bannerConflictsWithControls=()=>{
  const slot=$('mobileBannerSlot'),r=slot?.getBoundingClientRect();
  if(!r||r.width!==320||r.height!==50||r.left<0||r.top<0||r.right>innerWidth||r.bottom>innerHeight)return true;
  for(const el of document.querySelectorAll('button,a[href],input,select,textarea,summary,[role="button"],[tabindex]:not([tabindex="-1"])')){
   if(!el.getClientRects().length)continue;
   const style=getComputedStyle(el);if(style.visibility==='hidden'||style.visibility==='collapse')continue;
   const b=el.getBoundingClientRect();
   if(b.width>0&&b.height>0&&b.left<r.right+24&&b.right>r.left-24&&b.top<r.bottom+24&&b.bottom>r.top-24)return true;
  }
  return false;
 };
 let last=null;
 const sync=()=>{const box=$('puzzleBoxPanel');const covered=document.hidden||mobilePaused||state!=='play'||campaignMenuOpen||rewardBlocksPlay()||innerWidth<=innerHeight||!!(box&&!box.hidden&&getComputedStyle(box).visibility!=='hidden')||!!document.querySelector('#nativeLegalDialog[open]')||bannerConflictsWithControls();if(covered!==last){last=covered;ads.presentation(covered).catch(()=>{last=null})}};
 const schedule=()=>sync();
 new MutationObserver(schedule).observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden','data-blocked','open','class','style'],childList:true});
 window.addEventListener('resize',schedule);document.addEventListener('visibilitychange',schedule);
 // Frame checks also catch animated/transformed controls and stylesheet-only changes.
 const checkFrame=()=>{sync();requestAnimationFrame(checkFrame)};requestAnimationFrame(checkFrame);
 sync();ads.prepare().then(result=>{if(result?.status)status.textContent=result.status}).catch(()=>{status.textContent='Ads unavailable. You can keep playing.'});
}

function installNativeLegal(){
 const content=/* LEGAL_CONTENT */ null;
 const actions=document.createElement('div');actions.id='nativeLegalActions';
 actions.style.cssText='display:flex;gap:8px;flex-wrap:wrap;margin-top:12px';
 const dialog=document.createElement('dialog');dialog.id='nativeLegalDialog';
 dialog.setAttribute('aria-label','Support and privacy');
 dialog.style.cssText='position:fixed;inset:10px;max-width:720px;width:calc(100% - 20px);max-height:calc(100% - 20px);overflow:auto;background:#eeeadd;color:#253a3c;padding:20px;border:2px solid #426d65;text-align:left';
 const close=document.createElement('button');close.textContent='Back to game menu';close.style.minHeight='44px';close.onclick=()=>dialog.close();
 const article=document.createElement('article');article.style.cssText='line-height:1.65;overflow-wrap:anywhere';
 dialog.append(close,article);document.body.append(dialog);
 for(const page of content.pages){
  const button=document.createElement('button');button.textContent=page.title;button.style.minHeight='44px';button.dataset.legal=page.id;
  button.onclick=()=>{pauseMobile('Paused.');article.replaceChildren();
   const add=(tag,text)=>{const el=document.createElement(tag);el.textContent=text;article.append(el)};
   add('h2',page.title);add('p','Last updated '+content.updated);add('p',page.intro);
   for(const section of page.sections){add('h3',section.title);for(const paragraph of section.paragraphs)add('p',paragraph)}
   if(window.ExceptionNative?.ads?.support){const email=document.createElement('button');email.textContent='Email support';email.style.minHeight='44px';email.onclick=async()=>{try{await window.ExceptionNative.ads.support()}catch(error){add('p',error.message||'Email '+content.email)}};article.append(email)}
   dialog.showModal();dialog.scrollTop=0;close.focus();
  };actions.append(button);
 }
 ($('menuSettings')||$('panel-play')).append(actions);
}
