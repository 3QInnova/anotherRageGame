// Release-only adapters. The authoring harness is never copied into the product.
function selectLevelCollection(useCampaign){rememberBackgroundVoice();campaignReceipt=null;campaignMode=useCampaign;LEVELS=DATA_CENTER_LEVELS;COMPACT_POINTS=DATA_CENTER_LEVELS.map(l=>l.returnPoints);GLASS_TEST_INDEX=-1;clockRoom=-1;keys.clear();pressedKeys.clear()}
function restartCampaignRun(){if(L.releaseChallenge){startReleaseChallenge(L.releaseChallenge);return}startCampaignServer(campaignPractice?L.serverId:DATA_CENTER_LEVELS[0].serverId,false)}
function installCampaignUI(){
 installVisitorArt();installRewards();installPuzzleBoxUI();$('stage').appendChild($('idleComputePanel'));
 if(typeof mobilePaused==='undefined'){
  $('desktopPause').onclick=()=>toggleDesktopMenu(true);$('desktopResume').onclick=()=>toggleDesktopMenu(false);installDesktopScreen();
  $('restart').addEventListener('click',()=>{if(state==='play')toggleDesktopMenu(false)});
 }
 $('openDataCenters').onclick=()=>openCampaignMenu();$('campaignClose').onclick=()=>closeCampaignMenu(false);
 $('campaignContinue').onclick=continueReleaseCampaign;$('campaignTab-campaign').onclick=()=>setCampaignView('campaign');
 $('campaignMenu').addEventListener('keydown',e=>{
  if(e.code==='Escape'){e.preventDefault();e.stopPropagation();if(campaignView!=='campaign')setCampaignView('campaign');else closeCampaignMenu(false)}
  if(e.code==='Tab'){const items=[...$('campaignMenu').querySelectorAll('button:not(:disabled)')].filter(n=>n.getClientRects().length),first=items[0],end=items.at(-1);if(e.shiftKey&&document.activeElement===first||!e.shiftKey&&document.activeElement===end){e.preventDefault();(e.shiftKey?end:first)?.focus()}}
 });renderCampaignMenu();installReleaseUI();
}
function installReleaseUI(){
 simplifyReleaseMenus();
 $('campaignTab-challenges').onclick=()=>{setCampaignView('challenges');renderCampaignMenu()};$('releaseCollection').onclick=()=>openRewardShop();
 for(const id of ['releaseChallengesButton','releaseMobileChallenges'])if($(id))$(id).onclick=()=>openCampaignMenu('challenges');
 document.addEventListener('DOMContentLoaded',()=>{releaseBooting=true;try{continueReleaseCampaign()}finally{releaseBooting=false}openCampaignMenu()});
}
function setCampaignView(view){campaignView=view==='challenges'?'challenges':'campaign';$('campaignTitle').textContent=campaignView==='campaign'?'Campaign':'Challenges';for(const name of ['campaign','challenges']){$('campaignView-'+name).hidden=name!==campaignView;$('campaignTab-'+name).setAttribute('aria-pressed',String(name===campaignView))}$('campaignMenu').querySelector('.campaign-card').scrollTop=0}
function resetCooling(){puzzleBoxOpenId=null;cooling=hasPuzzleBoxes()?resetPuzzleBoxCooling():null}
function coolingUseSwitch(){return hasPuzzleBoxes()?puzzleUseBox():false}
function coolingNumberKey(code){return hasPuzzleBoxes()?puzzleNumberKey(code):false}
function advanceCooling(dt){if(cooling)advancePuzzleBox(dt)}
function refreshCooling(){refreshPuzzleBox()}
function drawCooling(){drawPuzzleBoxWorld()}
function refreshCredits(){}
function spendCredit(){return state==='play'}
function chargeLeftDistance(){return true}
function creditBudget(){return 0}
function longEncounters(level=L){return [...(level.encounters??[]),...level.secretPads].sort((a,b)=>a.x-b.x)}
function refreshRageLab(){}
function finishRageLab(){}
function watchForPaywall(){return false}
function watchForCompaction(){return false}
function startCompaction(){return false}
function resetPaywallWatch(){}
function resetCompactWatch(){}
function finishCompaction(){}
function refreshCompaction(){}
function drawCompaction(){}
function advancePaywall(){}
function resetCommitment(){}
function advanceCommitment(){}
function refreshCommitment(){}
function drawCommitment(){}
function commitmentRetryWait(){return false}
function commitmentBay(){return false}
function commitmentPlatforms(parts){return parts}
function commitmentSupports(){return []}
function hitCommitmentSides(){}
function landOnCommitment(){return false}
function checkCommitment(){}
function recordPresenceAction(){}
function suspendPresenceInput(){}
function playtestEvent(){}
function playtestInit(){}
function playtestLevelStart(){}
function advancePlaytest(){}
function playtestClear(){}
function playtestInput(){return false}
function advancePlaytestReceipt(){return false}
function advanceCacheEcho(){}
function resetCacheEcho(){}
function drawCacheEcho(){}

function landOnMigration(){return false}
function tickPresence(){}
