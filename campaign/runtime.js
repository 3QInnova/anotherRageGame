// Campaign data is inlined by tools/build-campaign.py so file:// and native builds stay offline.
const ORIGINAL_LEVELS=LEVELS,ORIGINAL_COMPACT_POINTS=COMPACT_POINTS;
const DATA_CENTER_LEVELS=compileDataCenterServers(DATA_CENTER_CATALOG,LOCALHOST_RECIPES,LOCALHOST_VOICE,FLOOR,LOCALHOST_INCIDENTS);
const CAMPAIGN_PROGRESS_KEY='exception-data-centers-v1';
let campaignReceipt=null,campaignReportKey='';
let campaignMode=false,campaignPractice=false,campaignMenuOpen=false,campaignSelectedCenter='localhost';
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
 selectLevelCollection(true);initRoom(true);campaignPractice=practice;
 practiceMode=practice;practiceRoom=practice?index:-1;
 if(index!==0){room=index;clockRoom=-1;initRoom(false,'level')}else refreshHud();
 if(!practice){campaignProgress.currentServerId=id;saveCampaignProgress()}
 closeCampaignMenu(true);return true;
}
function recordCampaignClear(){
 if(!campaignMode||campaignPractice||!L.serverId)return;
 if(!campaignProgress.cleared.includes(L.serverId))campaignProgress.cleared.push(L.serverId);
 campaignProgress.currentServerId=DATA_CENTER_LEVELS[room+1]?.serverId||L.serverId;
 saveCampaignProgress();
}
function restartCampaignRun(){
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
 if(!L?.campaignServer||typeof mobileView!=='undefined')return;
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
 }else resumeSound();
}
function openCampaignMenu(){
 if(campaignBlocked())return;
 suspendPresenceInput();
 if(typeof mobilePaused!=='undefined')pauseMobile('Choose a Data Center.');
 rememberBackgroundVoice();campaignMenuOpen=true;keys.clear();pressedKeys.clear();suspendSound();refreshCooling();
 if(typeof mobilePaused!=='undefined')$('mobileMenu').hidden=true;
 $('campaignMenu').hidden=false;renderCampaignMenu();$('campaignClose')?.focus?.();
}
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
 $('campaignCenterStatus').textContent=selected.status==='playable'?'20 playable servers · Idle cleanup on every server · '+(practice?'Practice: any server; clears do not advance the campaign.':'Campaign: clear each server to connect the next.'):'Expansion blueprint · these servers are planned and cannot be played yet.';
 servers.replaceChildren(...selected.servers.map(server=>{
  const cleared=campaignProgress.cleared.includes(server.id),index=DATA_CENTER_LEVELS.findIndex(l=>l.serverId===server.id);
  const b=make('button',String(server.number).padStart(2,'0')+' · '+server.title+'\n'+(server.status!=='playable'?'PLANNED':cleared?'CLEARED':server.role==='incident'?(server.mcp?'MCP INCIDENT':'INCIDENT'):server.role.toUpperCase()));
  if(server.status==='playable')b.textContent+='\n'+LOCALHOST_INCIDENTS[server.id].job+(creditRecords[server.id]===undefined?'':'\nBest: '+creditRecords[server.id]+' credits');
  b.type='button';b.className='campaign-server'+(server.role==='incident'?' incident':'');
  b.disabled=server.status!=='playable'||(!practice&&!campaignUnlocked(index));
  b.onclick=()=>startCampaignServer(server.id,practice);return b;
 }));
 $('campaignContinue').textContent=campaignProgress.cleared.length===DATA_CENTER_LEVELS.length?'Replay connected servers':'Continue campaign';
}
function installCampaignUI(){
 installCoolingUI();installPuzzleBoxUI();$('campaignCoolingIncident').onclick=()=>startCampaignServer('localhost-18',true);
 $('stage')?.appendChild?.($('creditPanel'));
 $('stage')?.appendChild?.($('idleComputePanel'));
 $('stage')?.appendChild?.($('commitmentPanel'));
 $('campaignCommitmentTrial').onclick=startCommitmentTrial;
 $('campaignGarbageCollection').onclick=startGarbageCollectionDay;
 $('campaignIdleTrial').onclick=()=>startCampaignServer('localhost-15',true);
 if(!$('campaignWorlds')?.replaceChildren)return;
 $('openDataCenters').onclick=openCampaignMenu;$('campaignClose').onclick=()=>closeCampaignMenu(false);
 $('campaignContinue').onclick=()=>{
  let index=DATA_CENTER_LEVELS.findIndex(l=>l.serverId===campaignProgress.currentServerId);
  if(index<0||!campaignUnlocked(index))index=DATA_CENTER_LEVELS.findIndex((l,i)=>campaignUnlocked(i)&&!campaignProgress.cleared.includes(l.serverId));
  if(campaignProgress.cleared.length===DATA_CENTER_LEVELS.length||index<0)index=0;
  startCampaignServer(DATA_CENTER_LEVELS[index].serverId,false);
 };
 $('campaignPractice').onchange=renderCampaignMenu;
 $('campaignLegacy').onclick=()=>{if(campaignBlocked())return;selectLevelCollection(false);campaignPractice=false;initRoom(true);closeCampaignMenu(true)};
 $('campaignMenu').addEventListener('keydown',e=>{
  if(e.code==='Escape'){e.preventDefault();e.stopPropagation();closeCampaignMenu(false)}
  if(e.code==='Tab'){
   const items=[...$('campaignMenu').querySelectorAll('button:not(:disabled),input')].filter(n=>n.getClientRects().length);
   const first=items[0],end=items.at(-1);
   if((e.shiftKey&&document.activeElement===first)||(!e.shiftKey&&document.activeElement===end)){e.preventDefault();(e.shiftKey?end:first)?.focus()}
  }
 });
 renderCampaignMenu();
}
window.__DATA_CENTER_TEST__={catalog:()=>JSON.parse(JSON.stringify(DATA_CENTER_CATALOG)),levels:()=>JSON.parse(JSON.stringify(DATA_CENTER_LEVELS)),progress:()=>JSON.parse(JSON.stringify(campaignProgress)),receipt:()=>campaignReceipt?{...campaignReceipt}:null,mode:()=>({campaignMode,campaignPractice,campaignMenuOpen}),start:startCampaignServer,open:openCampaignMenu,close:closeCampaignMenu,legacy(){selectLevelCollection(false);campaignPractice=false;initRoom(true)}};
