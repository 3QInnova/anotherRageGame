// Responsive PC presentation. Fixed world physics continue using W/H and the shared simulation.
const desktopView={enabled:false,width:W,height:H,top:0,eyeX:785,eyeY:173,pixelWidth:W,pixelHeight:H};
let desktopMenuView='play',desktopLastSpeech='';const desktopHistory=[];
function visibleWorldWidth(){return typeof mobileView!=='undefined'?mobileView.width:desktopView.enabled?desktopView.width:W}
function visibleWorldHeight(){return typeof mobileView!=='undefined'?mobileView.height:desktopView.enabled?desktopView.height:H}
function visibleWorldTop(){return typeof mobileView!=='undefined'?mobileView.top:desktopView.enabled?desktopView.top:0}
function viewEye(){return typeof mobileView!=='undefined'?{x:mobileView.eyeX,y:mobileView.eyeY}:desktopView.enabled?{x:desktopView.eyeX,y:desktopView.eyeY}:{x:785,y:173}}
function actionPrompt(){
 const keyboard=typeof mobilePaused==='undefined',key=keyboard?'X':'Rewrite';
 if(puzzleIsOpen()&&L.releaseCampaign)return 'A · FAN ON   B · DECK OFF   TEST CIRCUIT';
 if(puzzleIsOpen())return keyboard?'1–5 · Inputs   Enter · TEST   Esc · Back to deck':'Tap inputs · TEST CIRCUIT · Back to deck';
 const deck=coolingProtectedStation();if(deck){if(hasPuzzleBoxes())return key+' · Open Puzzle Box';if(!deck.solved)return keyboard?'1–0 · Select gate   X · Rotate selected gate':'Tap a gate · ROTATE selected gate'}
 const a=nearest();if(a)return key+' · '+(a.kind==='repair'?'Repair the floor':a.kind==='wall'?'Rewrite wall → air':a.kind==='bridge'?'Rewrite gap → bridge':'Restore exit');
 return keyboard?'A / D · Move    Space · Jump    X · Rewrite nearby':'Move · Jump · Rewrite the nearest glowing tag';
}
function setDesktopMenu(view){
 desktopMenuView=view;
 for(const name of ['play','practice','controls','audio','log'])$('desktopPanel-'+name).hidden=name!==view;
 for(const tab of document.querySelectorAll('[data-desktop-tab]')){const active=tab.dataset.desktopTab===view;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1}
 $('desktopNewRunConfirm').hidden=true;
}
function protectedGuideLayout(){
 const panel=typeof mobilePaused==='undefined'?$('message'):$('mobileDialogue');if(!panel?.getBoundingClientRect)return;
 const prompt=actionPrompt();for(const id of ['coolingAction','puzzleActionGuide'])if($(id)&&$(id).textContent!==prompt)$(id).textContent=prompt;
 const guides=[typeof mobilePaused==='undefined'?$('desktopGuide'):$('mobileObjective'),$('labHud'),$('idleComputePanel'),$('commitmentPanel'),$('coolingPanel')].filter(el=>el&&!el.hidden&&el.getBoundingClientRect().height);
 const bottom=Math.max(typeof mobilePaused==='undefined'?82:88,...guides.map(el=>el.getBoundingClientRect().bottom+10));
 if(panel.style.top!==bottom+'px')panel.style.top=bottom+'px';
 // Narrator asides yield to the player and the action guide. Full text remains in the pause log.
 const r=panel.getBoundingClientRect(),game=canvas.getBoundingClientRect(),scale=game.height/visibleWorldHeight();
 const px=game.left+(player.x-cameraX)*scale,py=game.top+(player.y-visibleWorldTop())*scale;
 const coversPlayer=r.left<px+PW*scale+8&&r.right>px-8&&r.top<py+PH*scale+8&&r.bottom>py-8;
 panel.style.visibility=(coversPlayer||r.bottom>game.bottom-70||guides.some(g=>{const b=g.getBoundingClientRect();return r.left<b.right&&r.right>b.left&&r.top<b.bottom&&r.bottom>b.top}))?'hidden':'';
}
function resizeDesktopScreen(){
 const b=canvas.getBoundingClientRect();desktopView.width=H*b.width/Math.max(1,b.height);desktopView.height=H;
 const rise=L&&(L.rageLab||L.counterplay||L.puzzleBoxEncounter||L.coolingTrial)?Math.min(110,Math.max(0,FLOOR-player.y-PH-40)*.85):0;
 const down=L&&(L.betrayal||L.betrayals?.length)?Math.min(90,Math.max(0,player.y+PH-FLOOR)):0;
 desktopView.top=FLOOR-H*.72-rise+down;const header=$('desktopHeader').getBoundingClientRect();desktopView.eyeX=Math.min(desktopView.width*.78,(header.left-90)*H/Math.max(1,b.height));desktopView.eyeY=desktopView.top+125;
 const dpr=Math.min(2,window.devicePixelRatio||1),w=Math.round(b.width*dpr),h=Math.round(b.height*dpr);
 if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}desktopView.pixelWidth=w;desktopView.pixelHeight=h;
}
function syncDesktopScreen(){
 if(!desktopView.enabled)return;
 const playing=state==='play'&&!desktopMenuOpen&&!campaignMenuOpen&&!rewardBlocksPlay();
 $('desktopGuide').hidden=!playing||!!L.rageLab||puzzleIsOpen()||!!(L.coolingTrial&&coolingProtectedStation());$('message').hidden=!playing;
 const a=actionPrompt();if($('desktopAction').textContent!==a)$('desktopAction').textContent=a;
 if($('labHudAction')&&$('labHudAction').textContent!==a)$('labHudAction').textContent=a;
 if($('desktopLatest').textContent!==speech)$('desktopLatest').textContent=speech;
 if(speech&&desktopLastSpeech!==speech){desktopLastSpeech=speech;desktopHistory.unshift(speech);desktopHistory.length=Math.min(30,desktopHistory.length);$('desktopHistory')?.replaceChildren(...desktopHistory.map(text=>{const li=document.createElement('li');li.textContent=text;return li}))}
 const on=sound&&musicEnabled,button=$('desktopMusic');button.textContent='Music · '+(on?'On':'Off');button.setAttribute('aria-pressed',String(on));
 protectedGuideLayout();
}
function installDesktopScreen(){
 if(typeof mobilePaused!=='undefined'||!document.body?.classList||!$('desktopApp'))return;
 desktopView.enabled=true;
 const scene=draw,hud=refreshHud;
 draw=()=>{resizeDesktopScreen();ctx.save();if(state==='compacting'){ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);drawCompaction()}else{const scale=canvas.height/H;ctx.setTransform(scale,0,0,scale,0,0);ctx.translate(0,-desktopView.top);scene()}ctx.restore()};
 refreshHud=()=>{hud();syncDesktopScreen()};
 for(const b of document.querySelectorAll('[data-desktop-tab]'))b.onclick=()=>setDesktopMenu(b.dataset.desktopTab);
 $('desktopPractice').onclick=()=>setDesktopMenu('practice');$('desktopPracticeBack').onclick=()=>setDesktopMenu('play');
 $('desktopNewRun').onclick=()=>{$('desktopNewRunConfirm').hidden=false};$('desktopCancelNewRun').onclick=()=>{$('desktopNewRunConfirm').hidden=true};
 $('desktopConfirmNewRun').onclick=()=>{if(campaignBlocked())return;restartCampaignRun();toggleDesktopMenu(false)};
 $('desktopMusic').onclick=()=>{if(!sound||!musicEnabled){sound=true;musicEnabled=true}else musicEnabled=false;saveAudioSettings();refreshAudioControls();if(sound&&!desktopMenuOpen)resumeSound();syncDesktopScreen()};
 $('desktopMenu').addEventListener('keydown',e=>{if(e.code==='Escape'&&desktopMenuView!=='play'){e.preventDefault();e.stopPropagation();setDesktopMenu('play')}});
 window.addEventListener('blur',()=>{if(!campaignMenuOpen)toggleDesktopMenu(true)});document.addEventListener('visibilitychange',()=>{if(document.hidden&&!campaignMenuOpen)toggleDesktopMenu(true)});
 window.__DESKTOP_UI_TEST__={viewport:()=>({...desktopView}),menu:()=>desktopMenuView,action:actionPrompt};
}
