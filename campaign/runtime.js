// Campaign data is inlined by tools/build-campaign.py so file:// and native builds stay offline.
const ORIGINAL_LEVELS=LEVELS,ORIGINAL_COMPACT_POINTS=COMPACT_POINTS;
const ORIGINAL_LOCALHOST_LEVELS=compileDataCenterServers(DATA_CENTER_CATALOG,LOCALHOST_RECIPES,LOCALHOST_VOICE,FLOOR,LOCALHOST_INCIDENTS);
const DATA_CENTER_LEVELS=compileLongCampaign(DATA_CENTER_CATALOG,LONG_LOCALHOST_RECIPES,LONG_LOCALHOST_VOICE,LOCALHOST_INCIDENTS);
const CAMPAIGN_PROGRESS_KEY='exception-data-centers-v1';
let campaignReceipt=null,campaignReportKey='';
let campaignMode=false,campaignPractice=false,campaignMenuOpen=false,campaignSelectedCenter='localhost';
let campaignView='campaign',desktopMenuOpen=false;
let campaignProgress={schemaVersion:1,cleared:[],currentServerId:'localhost-01'};
try{
 const stored=JSON.parse(localStorage.getItem(CAMPAIGN_PROGRESS_KEY)||'null');
 if(stored?.schemaVersion===1){
  const ids=new Set(DATA_CENTER_LEVELS.map(l=>l.serverId));
  campaignProgress.cleared=[...new Set(Array.isArray(stored.cleared)?stored.cleared.filter(id=>ids.has(id)):[])];
  if(ids.has(stored.currentServerId))campaignProgress.currentServerId=stored.currentServerId;
 }
}catch(_){}
for(const level of DATA_CENTER_LEVELS){
 BACKGROUND_QUIPS.levels[level.title]=level.voice;
 ALL_REMARK_POOLS[level.serverId]=level.voice;
 ALL_REMARK_POOLS[level.serverId+'-loss']=level.incidentCard.failures;
}
// Campaign pools are registered after the original narrator loads its cursors.
Object.assign(remarkCounts,loadRemarkCounts());
function recordCampaignOutcome(){
 if(!L?.campaignServer)return;
 const card=L.incidentCard;campaignReceipt={serverId:L.serverId,text:card.excuse,remaining:12};
 announce('INCIDENT SURVIVED / '+card.job+' / AI EXCUSE: '+card.excuse);
 if(typeof recordMobileIncident==='function')recordMobileIncident(card.job,card.excuse);
}
function tickCampaignIncident(dt){
 if(campaignReceipt&&L.campaignServer&&state==='play'){
  campaignReceipt.remaining-=dt;if(campaignReceipt.remaining<=0)campaignReceipt=null;
 }
}
function syncCampaignIncidentUI(){
 const card=L?.incidentCard,key=card?L.serverId+'/'+(campaignReceipt?.serverId||''):'none';
 if(key===campaignReportKey)return;campaignReportKey=key;$('incidentReport').hidden=!card;
 if(!card)return;
 $('incidentJob').textContent='Work order · '+card.job;
 $('incidentTrouble').textContent=card.trouble;
 $('incidentNotice').textContent='Watch for: '+card.notice;
 $('incidentCounterplay').textContent='If you are stuck: '+card.counterplay+(L.idleCompute?' Idle cleanup: short stops are covered; green maintenance bays and Pause suspend the timer.':'');
 $('incidentExcuse').textContent=campaignReceipt?'Last incident / AI excuse: '+campaignReceipt.text:'';
}
function saveCampaignProgress(){try{localStorage.setItem(CAMPAIGN_PROGRESS_KEY,JSON.stringify(campaignProgress))}catch(_){}}
function campaignBlocked(){return ['dead','compacting','paywall'].includes(state)}
function campaignUnlocked(index){return index===0||campaignProgress.cleared.includes(DATA_CENTER_LEVELS[index-1]?.serverId)}
function selectLevelCollection(useCampaign){
 rememberBackgroundVoice();campaignReceipt=null;campaignMode=useCampaign;
 LEVELS=useCampaign?DATA_CENTER_LEVELS:ORIGINAL_LEVELS;
 COMPACT_POINTS=useCampaign?DATA_CENTER_LEVELS.map(l=>l.returnPoints):ORIGINAL_COMPACT_POINTS;
 GLASS_TEST_INDEX=LEVELS.length;clockRoom=-1;
 keys.clear();pressedKeys.clear();
}
function startCampaignServer(id,practice=false){
 if(campaignBlocked())return false;
 const index=DATA_CENTER_LEVELS.findIndex(l=>l.serverId===id);
 if(index<0||(!practice&&!campaignUnlocked(index)))return false;
 for(const level of DATA_CENTER_LEVELS)BACKGROUND_QUIPS.levels[level.title]=level.voice;
 selectLevelCollection(true);initRoom(true);campaignPractice=practice;
 practiceMode=practice;practiceRoom=practice?index:-1;
 if(index!==0){room=index;clockRoom=-1;initRoom(false,'level')}else refreshHud();
 if(!practice){campaignProgress.currentServerId=id;saveCampaignProgress()}
 closeCampaignMenu(true);return true;
}
function startOriginalLocalhost(id){
 if(campaignBlocked())return false;const old=ORIGINAL_LOCALHOST_LEVELS.find(l=>l.serverId===id);if(!old)return false;
 const level={...old,originalLocalhost:true,remarkPool:'archive-'+old.serverId};
 BACKGROUND_QUIPS.levels[level.title]=old.voice;ALL_REMARK_POOLS[level.remarkPool]=old.voice;
 selectLevelCollection(false);LEVELS=ORIGINAL_LOCALHOST_LEVELS.map(l=>({...l,originalLocalhost:true,remarkPool:'archive-'+l.serverId}));COMPACT_POINTS=LEVELS.map(l=>l.returnPoints);GLASS_TEST_INDEX=LEVELS.length;
 initRoom(true);room=LEVELS.findIndex(l=>l.serverId===id);clockRoom=-1;initRoom(false,'level');campaignPractice=true;practiceMode=true;practiceRoom=room;closeCampaignMenu(true);return true;
}
function recordCampaignClear(){
 if(!campaignMode||campaignPractice||!L.serverId)return;
 if(!campaignProgress.cleared.includes(L.serverId))campaignProgress.cleared.push(L.serverId);
 campaignProgress.currentServerId=DATA_CENTER_LEVELS[room+1]?.serverId||L.serverId;
 saveCampaignProgress();
}
function restartCampaignRun(){
 if(L.originalLocalhost){startOriginalLocalhost(L.serverId);return}
 if(L.rageLab){if(L.demo)startDemo(L.serverId);else startRageLab(L.serverId);return}
 if(L.puzzleBoxTrial){startPuzzleBox();return}
 if(L.coolingTrial){startCoolingTest();return}
 if(L.idleDeletionTrial){startGarbageCollectionDay();return}
 if(L.commitmentTrial){startCommitmentTrial();return}
 if(!campaignMode){initRoom(true);return}
 if(campaignPractice){startCampaignServer(L.serverId,true);return}
 startCampaignServer(DATA_CENTER_LEVELS[0].serverId,false);
}
function campaignServerLabel(){return L?.campaignServer?`DC ${String(L.centerNumber).padStart(2,'0')} / SERVER ${String(L.serverNumber).padStart(2,'0')} / ${L.incident?'INCIDENT':DATA_CENTER_CATALOG.centers.find(c=>c.id===L.centerId).name.toUpperCase()}`:''}
function paintCampaignIdentity(width,top){
 if(!L?.campaignServer||typeof mobileView!=='undefined'||desktopView.enabled)return;
 top+=28;
 const center=DATA_CENTER_CATALOG.centers.find(c=>c.id===L.centerId);
 ctx.save();ctx.globalAlpha=.8;
 label(campaignServerLabel(),18,top+103,10,center.accent,'left','normal');
 label('WORK ORDER / '+L.incidentCard.job.toUpperCase(),18,top+120,10,center.accent,'left','normal');
 if(L.mcpTool)label('TOOL / '+L.mcpTool+' / RESULT: UNHELPFUL',18,top+136,9,center.accent,'left','normal');
 if(campaignReceipt&&state==='play'){
  const y=top+(L.mcpTool?154:138),lines=backgroundQuipLines(campaignReceipt.text);
  rect(12,y,284,24+lines.length*16,'#f7f2e5');stroke(12,y,284,24+lines.length*16,'#c3cbbc',1);
  label('PREVIOUS INCIDENT / AI EXCUSE',20,y+13,9,center.accent,'left','normal');
  lines.forEach((line,i)=>label(line,20,y+30+i*16,12,INK,'left','normal'));
 }

 ctx.restore();
}
function closeCampaignMenu(play=false){
 suspendPresenceInput();
 campaignMenuOpen=false;const node=$('campaignMenu');if(node)node.hidden=true;refreshCooling();
 keys.clear();pressedKeys.clear();last=typeof performance!=='undefined'?performance.now()/1000:0;acc=0;
 if(typeof mobilePaused!=='undefined'){
  if(play)resumeMobile();else if(mobilePaused){$('mobileMenu').hidden=false;$('mobileApp').inert=true;$('openDataCenters')?.focus?.();}
 }else if(!desktopMenuOpen)resumeSound();
}
function openCampaignMenu(view='campaign'){
 if(campaignBlocked())return;
 if(typeof view!=='string')view='campaign';
 if(desktopMenuOpen){desktopMenuOpen=false;$('desktopMenu').hidden=true}
 suspendPresenceInput();
 if(typeof mobilePaused!=='undefined')pauseMobile('Choose a Data Center.');
 rememberBackgroundVoice();campaignMenuOpen=true;keys.clear();pressedKeys.clear();suspendSound();refreshCooling();
 if(typeof mobilePaused!=='undefined')$('mobileMenu').hidden=true;
 $('campaignMenu').hidden=false;setCampaignView(view);renderCampaignMenu();$('campaignClose')?.focus?.();
}
function setCampaignView(view){
 campaignView=['campaign','demos','labs','practice'].includes(view)?view:'campaign';
 const card=$('campaignMenu')?.querySelector?.('.campaign-card');if(card)card.scrollTop=0;
 for(const name of ['campaign','demos','labs','practice']){
  const panel=$('campaignView-'+name);if(panel)panel.hidden=name!==campaignView;
  const tab=$('campaignTab-'+name);tab?.setAttribute?.('aria-pressed',String(name===campaignView));
 }
}
function toggleDesktopMenu(open=!desktopMenuOpen){
 if(typeof mobilePaused!=='undefined'||campaignMenuOpen)return;
 desktopMenuOpen=open;const menu=$('desktopMenu');if(menu)menu.hidden=!open;
 keys.clear();pressedKeys.clear();if(player)player.jumpBuffer=0;
 last=typeof performance!=='undefined'?performance.now()/1000:0;acc=0;
 if(open){if(desktopView.enabled)setDesktopMenu('play');suspendSound();$('desktopResume')?.focus?.({preventScroll:true})}else{resumeSound();$('desktopPause')?.focus?.({preventScroll:true})}
 refreshHud();
}
function playCue(){
 if(L.rageLab)return rageLabCue();
 const f=forecastFeedback();if(['locked','purge'].includes(f.phase))return f.text;
 if(puzzleIsOpen())return 'Preview safely. TEST applies power: FAN 1 / DECK 0.';
 const live=Object.entries(glitch).filter(([,until])=>until>sceneTime);if(live.length)return live.map(([kind,until])=>kind.toUpperCase()+' · '+(until-sceneTime).toFixed(1)+'s').join(' / ');
 const a=nearest();if(a)return 'Rewrite '+a.kind.toUpperCase()+' · '+(typeof mobilePaused==='undefined'?'X':'tap Rewrite');
 if(L.counterplay){
  for(const b of paperRecoveries()){const r=paperRecoveryState(b);if(r.caught&&!r.repaired&&Math.abs(player.x-b.x)<650)return 'Still alive. Return left, jump to the bank, then Rewrite REPAIR.'}
  const act=L.acts.filter(a=>player.x>=a.start).at(-1);return (act?.name??'Localhost')+' · '+campaignRouteTime(roomElapsed)+' / ~'+campaignRouteTime(L.benchmarkSeconds)+' clean run. Purple flags may lie.';
 }
 if(L.serverId==='localhost-01')return 'Jump the opening ahead. Green bays and Pause are safe.';
 if(L.puzzleBoxEncounter)return 'Reach the maintenance deck. Open Puzzle Box with Rewrite.';
 if(L.campaignServer)return L.incidentCard.notice;
 return 'Move · Jump · Rewrite the nearest glowing object.';
}
function refreshPlayCue(){const node=$('playCue'),text=playCue();if(node&&node.textContent!==text)node.textContent=text}
function renderCampaignMenu(){
 const worlds=$('campaignWorlds'),servers=$('campaignServers');if(!worlds?.replaceChildren)return;
 const make=(tag,text,cls)=>{const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n};
 const selected=DATA_CENTER_CATALOG.centers.find(c=>c.id===campaignSelectedCenter)||DATA_CENTER_CATALOG.centers[0];
 const practice=!!$('campaignPractice').checked;
 worlds.replaceChildren(...DATA_CENTER_CATALOG.centers.map(center=>{
  const b=make('button',String(center.number).padStart(2,'0')+' · '+center.name+'\n'+(center.status==='playable'?center.servers.filter(s=>campaignProgress.cleared.includes(s.id)).length+'/20 servers cleared':'20 servers · planned'));
  b.type='button';b.style.borderLeftColor=center.accent;b.setAttribute('aria-pressed',String(center.id===selected.id));
  b.onclick=()=>{campaignSelectedCenter=center.id;renderCampaignMenu()};return b;
 }));
 $('campaignCenterName').textContent=selected.name;$('campaignCenterDescription').textContent=selected.description;
 $('campaignCenterQuote').textContent='“'+selected.transfer+'”';
 $('campaignCenterStatus').textContent=selected.status==='playable'?'20 rebuilt routes · about 1–3 minutes, five-minute finale · '+(practice?'Practice: any server; clears do not advance the campaign.':'Campaign: clear each server to connect the next.'):'Expansion blueprint · these servers are planned and cannot be played yet.';
 servers.replaceChildren(...selected.servers.map(server=>{
  const cleared=campaignProgress.cleared.includes(server.id),index=DATA_CENTER_LEVELS.findIndex(l=>l.serverId===server.id);
  const b=make('button',String(server.number).padStart(2,'0')+' · '+server.title+'\n'+(server.status!=='playable'?'PLANNED':cleared?'CLEARED':server.role==='incident'?(server.mcp?'MCP INCIDENT':'INCIDENT'):server.role.toUpperCase()));
  if(server.status==='playable')b.textContent+='\n'+LOCALHOST_INCIDENTS[server.id].job+(creditRecords[server.id]===undefined?'':'\nBest: '+creditRecords[server.id]+' credits');
  const level=DATA_CENTER_LEVELS[index];if(level?.counterplay)b.textContent+='\n'+campaignRouteTime(level.benchmarkSeconds??level.targetSeconds)+' clean route · '+campaignPaceLabel(level.moveSpeed);
  b.type='button';b.className='campaign-server'+(server.role==='incident'?' incident':'');
  b.disabled=server.status!=='playable'||(!practice&&!campaignUnlocked(index));
  b.onclick=()=>startCampaignServer(server.id,practice);return b;
 }));
 $('campaignContinue').textContent=campaignProgress.cleared.length===DATA_CENTER_LEVELS.length?'Replay Localhost':campaignProgress.cleared.length?'Continue Localhost':'Start Localhost';
 renderRageLabs();renderDemoPlaylist();
}
function installCampaignUI(){
 installVisitorArt();
 installRewards();
 installPlaytest();
 installCachePrototypes();
 installDemoUI();
 installCoolingUI();installPuzzleBoxUI();$('campaignCoolingIncident').onclick=()=>startCampaignServer('localhost-18',true);
 $('stage')?.appendChild?.($('creditPanel'));
 $('stage')?.appendChild?.($('idleComputePanel'));
 $('stage')?.appendChild?.($('commitmentPanel'));
 $('stage')?.appendChild?.($('labHud'));
 $('overlay')?.querySelector?.('.card')?.appendChild?.($('labWinActions'));
 $('labRetry').onclick=()=>{if(L.rageLab)initRoom(false);else restartCampaignRun();if(typeof mobilePaused!=='undefined')resumeMobile()};
 $('labChoose').onclick=()=>openCampaignMenu(L.cacheTrial?'practice':L.demo?'demos':'labs');
 if($('openRageLabs'))$('openRageLabs').onclick=()=>openCampaignMenu('labs');
 if(typeof mobilePaused==='undefined'&&$('desktopMenu')?.querySelectorAll){
  $('desktopBrowseCampaign').onclick=()=>openCampaignMenu();$('desktopPause').onclick=()=>toggleDesktopMenu(true);$('desktopResume').onclick=()=>toggleDesktopMenu(false);installDesktopScreen();
  for(const id of ['restart','floorPractice','glassPractice','longPractice'])$(id).addEventListener('click',()=>{if(state==='play')toggleDesktopMenu(false)});
  $('desktopMenu').addEventListener('keydown',e=>{if(e.code==='Tab'){
   const items=[...$('desktopMenu').querySelectorAll('button:not(:disabled),input,select,summary')].filter(n=>n.getClientRects().length),first=items[0],end=items.at(-1);
   if((e.shiftKey&&document.activeElement===first)||(!e.shiftKey&&document.activeElement===end)){e.preventDefault();(e.shiftKey?end:first)?.focus()}
  }});
 }
 $('campaignCommitmentTrial').onclick=startCommitmentTrial;
 $('campaignGarbageCollection').onclick=startGarbageCollectionDay;
 $('campaignIdleTrial').onclick=()=>startOriginalLocalhost('localhost-15');
 $('campaignOriginalCooling').onclick=()=>startOriginalLocalhost('localhost-18');
 $('campaignOriginalLocalhost').onclick=()=>startOriginalLocalhost($('originalLocalhostSelect').value);
 if(!$('campaignWorlds')?.replaceChildren)return;
 $('openDataCenters').onclick=openCampaignMenu;$('campaignClose').onclick=()=>closeCampaignMenu(false);
 $('campaignContinue').onclick=()=>{
  let index=DATA_CENTER_LEVELS.findIndex(l=>l.serverId===campaignProgress.currentServerId);
  if(index<0||!campaignUnlocked(index))index=DATA_CENTER_LEVELS.findIndex((l,i)=>campaignUnlocked(i)&&!campaignProgress.cleared.includes(l.serverId));
  if(campaignProgress.cleared.length===DATA_CENTER_LEVELS.length||index<0)index=0;
  startCampaignServer(DATA_CENTER_LEVELS[index].serverId,false);
 };
 $('campaignPractice').onchange=renderCampaignMenu;
 for(const name of ['campaign','demos','labs','practice'])$('campaignTab-'+name).onclick=()=>setCampaignView(name);
 $('campaignLegacy').onclick=()=>{if(campaignBlocked())return;selectLevelCollection(false);campaignPractice=false;initRoom(true);closeCampaignMenu(true)};
 $('campaignMenu').addEventListener('keydown',e=>{
  if(e.code==='Escape'){e.preventDefault();e.stopPropagation();if(campaignView!=='campaign')setCampaignView('campaign');else closeCampaignMenu(false)}
  if(e.code==='Tab'){
   const items=[...$('campaignMenu').querySelectorAll('button:not(:disabled),input')].filter(n=>n.getClientRects().length);
   const first=items[0],end=items.at(-1);
   if((e.shiftKey&&document.activeElement===first)||(!e.shiftKey&&document.activeElement===end)){e.preventDefault();(e.shiftKey?end:first)?.focus()}
  }
 });
 renderCampaignMenu();
}
window.__DATA_CENTER_TEST__={catalog:()=>JSON.parse(JSON.stringify(DATA_CENTER_CATALOG)),levels:()=>JSON.parse(JSON.stringify(DATA_CENTER_LEVELS)),progress:()=>JSON.parse(JSON.stringify(campaignProgress)),receipt:()=>campaignReceipt?{...campaignReceipt}:null,mode:()=>({campaignMode,campaignPractice,campaignMenuOpen}),start:startCampaignServer,archive:startOriginalLocalhost,open:openCampaignMenu,close:closeCampaignMenu,legacy(){selectLevelCollection(false);campaignPractice=false;initRoom(true)}};
