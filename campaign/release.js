// Escape Localhost: bundled release rules, progress and public navigation.
const RELEASE_CHAPTERS=['The AI is wrong','Exploit the mistake','Make it commit','Escape containment'];
let releaseBooting=false;
const RELEASE_SAVE_KEY='exception-localhost-release-v1';
let releaseRecord={version:1,checkpoints:{},challenges:{}},releasePersistent=true,releaseActiveSeconds=0;
try{
 const saved=JSON.parse(localStorage.getItem(RELEASE_SAVE_KEY)||'null');
 if(saved?.version===1){
  for(const level of DATA_CENTER_LEVELS){const n=saved.checkpoints?.[level.serverId];if(Number.isInteger(n)&&n>=0&&n<level.releaseCheckpoints.length)releaseRecord.checkpoints[level.serverId]=n;}
  for(const id of ['forecast','recall','puzzle','glass']){const r=saved.challenges?.[id];if(r&&Number.isFinite(r.bestSeconds)&&r.bestSeconds>0&&Number.isInteger(r.bestDeaths)&&r.bestDeaths>=0)releaseRecord.challenges[id]={bestSeconds:r.bestSeconds,bestDeaths:r.bestDeaths};}
 }
}catch(_){releasePersistent=false}
function saveRelease(){try{localStorage.setItem(RELEASE_SAVE_KEY,JSON.stringify(releaseRecord));releasePersistent=true}catch(_){releasePersistent=false}}
function releaseRoute(id,title,sequence,voiceKey,goal,unreliableFlags=false){
 let cursor=160;const beats=sequence.split(' ').map(code=>{const kind=PAPER_ROUTE_CODES[code],x=cursor+260;cursor=x+PAPER_ROUTE_END[kind];return {kind,x}});
 const level=assemblePaperRoute('challenge-'+id,title,goal,goal,beats,{demo:false,rageLab:false,counterplay:true,releaseChallenge:id,unlimitedActions:true,unreliableFlags,quietAdvisories:true,moveSpeed:265,exit:cursor+300,sectionLabel:'OPTIONAL CHALLENGE',remarkPool:voiceKey,releaseGoal:goal,acts:[{start:0,name:title}],returnPoints:[55]});
 level.routeBeats=beats;return level;
}
const RELEASE_CHALLENGES=[
 {id:'forecast',name:'Forecast Commitment',goal:'Bait every forecast and escape. Mastery: finish without a death.',level:releaseRoute('forecast','FORECAST COMMITMENT','F L F H T R F B T L F H F T','lab-forecast-commitment','Lock the gold target. Retreat, wait for the purge, then Rewrite and cross.')},
 {id:'recall',name:'Unreliable Recall',goal:'Finish despite drifting AI flags. Mastery: finish without a death.',level:releaseRoute('recall','UNRELIABLE RECALL','F V L H R T V B F L R H V T F R L H','lab-unreliable-recall','Purple memory can drift or vanish. Watch the actual gold and red warnings.',true)},
 {id:'puzzle',name:'Puzzle Box',goal:'Cool all three decks. Mastery: finish without a death.',level:{...PUZZLE_BOX_LEVEL,releaseChallenge:'puzzle',unlimitedActions:true,moveSpeed:265,idleCompute:null}},
 {id:'glass',name:'Glass Sightline',goal:'Find the hidden supports and escape. Mastery: finish without a death.',level:{...GLASS_TEST_LEVEL,releaseChallenge:'glass',unlimitedActions:true,moveSpeed:265}}
];
function startReleaseChallenge(id){
 if(campaignBlocked())return false;
 const challenge=RELEASE_CHALLENGES.find(c=>c.id===id);if(!challenge)return false;
 releaseActiveSeconds=0;return startRageLevel(challenge.level);
}
function releaseRoomReady(full,reason){
 if(!L.unlimitedActions)return;
 if(full||reason==='level')releaseActiveSeconds=0;
 const index=releaseRecord.checkpoints[L.serverId];
 if(L.releaseCampaign&&!campaignPractice&&Number.isInteger(index)){
  const x=L.releaseCheckpoints[index];if(Number.isFinite(x)){player.x=x;resetIdleCompute(x);updateCamera();}
 }
 if(L.releaseCampaign){$('room').textContent=String(L.serverNumber).padStart(2,'0')+' / 20';}
}
function advanceRelease(dt){
 if(!L.unlimitedActions||state!=='play')return;
 releaseActiveSeconds+=dt;
 if(!L.releaseCampaign||campaignPractice||!player.grounded)return;
 for(const [i,x] of L.releaseCheckpoints.entries())if(player.x>=x&&player.x<x+180&&player.y===FLOOR-PH&&(releaseRecord.checkpoints[L.serverId]??-1)<i){
  releaseRecord.checkpoints[L.serverId]=i;saveRelease();say(releasePersistent?'Checkpoint saved. I object to how permanent that sounds.':'Checkpoint reached. Storage is unavailable; this checkpoint lasts this session.');announce('CHECKPOINT / FINAL APPROACH');
 }
}
function recordReleaseClear(){
 if(L.releaseCampaign&&!campaignPractice){delete releaseRecord.checkpoints[L.serverId];saveRelease();}
 if(L.releaseChallenge){
  const old=releaseRecord.challenges[L.releaseChallenge];
  releaseRecord.challenges[L.releaseChallenge]={bestSeconds:Math.min(old?.bestSeconds??Infinity,releaseActiveSeconds),bestDeaths:Math.min(old?.bestDeaths??Infinity,totalDeaths)};saveRelease();
 }
}
function continueReleaseCampaign(){
 let index=DATA_CENTER_LEVELS.findIndex(l=>l.serverId===campaignProgress.currentServerId);
 if(index<0||!campaignUnlocked(index))index=DATA_CENTER_LEVELS.findIndex((l,i)=>campaignUnlocked(i)&&!campaignProgress.cleared.includes(l.serverId));
 if(index<0)index=0;startCampaignServer(DATA_CENTER_LEVELS[index].serverId,false);
}
function renderCampaignMenu(){
 const servers=$('campaignServers');if(!servers?.replaceChildren)return;
 const make=(tag,text,cls)=>{const el=document.createElement(tag);el.textContent=text;if(cls)el.className=cls;return el};
 $('campaignCenterName').textContent='Escape Localhost';
 $('campaignCenterDescription').textContent='One human. Twenty servers. An AI that refuses to admit you belong here.';
 $('campaignCenterQuote').textContent='“Your exit request has been denied. Again.”';
 $('campaignCenterStatus').textContent=campaignProgress.cleared.length+' / 20 cleared · '+(campaignPersistent?'Saved on this device':'Progress lasts this session')+' · Play offline';
 const grid=make('div','', 'release-levels');
 for(let i=0;i<DATA_CENTER_LEVELS.length;i++){
  if(!campaignUnlocked(i))continue;
  const level=DATA_CENTER_LEVELS[i],server=DATA_CENTER_CATALOG.centers[0].servers[i],cleared=campaignProgress.cleared.includes(level.serverId);
  const b=make('button',String(i+1).padStart(2,'0')+' · '+server.title+(cleared?' ✓':''),'campaign-server');
  b.type='button';b.dataset.server=level.serverId;b.setAttribute('aria-label',b.textContent+(cleared?' · Completed':''));b.onclick=()=>startCampaignServer(level.serverId,false);grid.append(b);
 }
 servers.replaceChildren(grid);
 $('campaignCenterStatus').hidden=campaignPersistent;
 $('campaignCenterStatus').textContent='Progress cannot be saved on this device.';
 const all=campaignProgress.cleared.length===20;
 $('campaignContinue').textContent=all?'Replay campaign':campaignProgress.cleared.length?'Continue escape':'Start escape';
 $('campaignContinue').onclick=continueReleaseCampaign;
 const list=$('releaseChallenges');if(list?.replaceChildren)list.replaceChildren(...RELEASE_CHALLENGES.map(c=>{
  const card=make('article','', 'release-challenge'),b=make('button',c.name),record=releaseRecord.challenges[c.id];b.type='button';b.dataset.challenge=c.id;b.onclick=()=>startReleaseChallenge(c.id);
  card.append(b,make('p',c.goal),make('small',record?(record.bestDeaths===0?'MASTERED':'CLEARED')+' · Best time '+campaignRouteTime(record.bestSeconds)+' · Fewest deaths '+record.bestDeaths:'Optional · Campaign progress and Tokens unchanged'));return card;
 }));
}
function setCampaignView(view){
 campaignView=view==='challenges'?'challenges':'campaign';$('campaignTitle').textContent=campaignView==='campaign'?'Campaign':'Challenges';
 for(const name of ['campaign','demos','labs','practice'])$('campaignView-'+name).hidden=name!==campaignView;
 $('campaignView-challenges').hidden=campaignView!=='challenges';
 for(const name of ['campaign','challenges'])$('campaignTab-'+name)?.setAttribute?.('aria-pressed',String(name===campaignView));
 const card=$('campaignMenu')?.querySelector?.('.campaign-card');if(card)card.scrollTop=0;
}
function installReleaseUI(){
 simplifyReleaseMenus();
 if(!$('campaignServers')?.replaceChildren)return;
 $('campaignTab-challenges').onclick=()=>{setCampaignView('challenges');renderCampaignMenu()};
 $('releaseCollection').onclick=()=>openRewardShop();
 for(const id of ['releaseChallengesButton','releaseMobileChallenges'])if($(id))$(id).onclick=()=>openCampaignMenu('challenges');
 document.addEventListener('DOMContentLoaded',()=>{
  const q=new URLSearchParams(location.hash.slice(1));
  if(q.has('challenge')){startReleaseChallenge(q.get('challenge'));return;}
  if(['campaign','demo','cache','playtest','shorts'].some(k=>q.has(k)))return;
  releaseBooting=true;try{continueReleaseCampaign()}finally{releaseBooting=false}openCampaignMenu();
 });
}
window.__RELEASE_TEST__={challenges:()=>RELEASE_CHALLENGES.map(c=>({id:c.id,name:c.name,goal:c.goal})),startChallenge:startReleaseChallenge,record:()=>JSON.parse(JSON.stringify(releaseRecord)),activeSeconds:()=>releaseActiveSeconds,persistent:()=>releasePersistent};

function releaseLesson(){
 if(!L.releaseCampaign||L.serverNumber>5)return L.releaseGoal;
 const beat=L.routeBeats.find(b=>player.x<b.x+PAPER_ROUTE_END[b.kind]);
 return ({scan:'Red low scanner ahead. Jump over it.',redaction:'The marked floor can disappear. Jump across the strip.',timed:'Glowing gap ahead. Rewrite creates a temporary bridge.',sky:'High scanner ahead. Stay on the floor beneath it.',landing:'Jump the low scan. Land on solid paper, then jump again.',receipt:'Receipt ahead. Wait behind its gold target, or use the raised paper.'})[beat?.kind]??'The exit is ahead. Your progress saves when you clear the level.';
}

function simplifyReleaseMenus(){
 if(!$('mobileMenu')||$('menuSettings'))return;
 const card=$('mobileMenu').querySelector('.card');
 const details=(id,label)=>{const d=document.createElement('details');d.id=id;const summary=document.createElement('summary');summary.textContent=label;d.append(summary);return d};
 const settings=details('menuSettings','Settings & help'),extras=details('menuExtras','Extras');
 extras.append($('releaseMobileChallenges'),$('openRewards'));
 $('panel-play').append(extras);
 settings.append($('menuTabs'),$('panel-controls'),$('panel-audio'),$('panel-log'));
 card.append(settings);
 settings.addEventListener('toggle',()=>{if(!settings.open)setMobileMenu('play')});
 $('openDataCenters').textContent='Campaign';$('restart').textContent='Retry';
 $('menuBrand').textContent='Paused';
}
