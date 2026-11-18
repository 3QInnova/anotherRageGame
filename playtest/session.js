const PLAYTEST_ROUTE=['localhost-01','localhost-02','localhost-03','lab-unreliable-recall'];
let playtestActive=false,playtestWelcomeOpen=!!PLAYTEST_ID,playtestFeedbackOpen=false,playtestData=null,playtestSaveAt=0,playtestPersistent=true;
function playtestPersist(){if(!playtestData)return;playtestData.updatedAt=new Date().toISOString();try{localStorage.setItem('exception-playtest-summary-v1',JSON.stringify(playtestData))}catch(_){playtestPersistent=false}}
function playtestEvent(type,extra={}){
 if(!playtestActive||!playtestData||!PLAYTEST_ROUTE.includes(L?.serverId))return;
 playtestData.events.push({type,level:L.serverId,activeSeconds:Math.round(playtestData.activeSeconds*100)/100,...extra});playtestData.events=playtestData.events.slice(-1500);playtestPersist();
}
function playtestInit(previousState,reason){if(previousState==='dead')playtestEvent('retry',{method:lossSkipPresses>=(L?.unlimitedActions?1:2)?'player':'automatic'});else if(reason==='retry'&&playtestActive)playtestEvent('restart')}
function playtestLevelStart(){if(playtestActive)playtestEvent('attempt',{attempt:attempts[room]??1})}
function advancePlaytest(dt){
 if(!playtestActive||!playtestData||!PLAYTEST_ROUTE.includes(L?.serverId))return;
 if(state==='play'){playtestData.activeSeconds+=dt;const ratio=Math.max(0,Math.min(1,(player.x-L.start)/(L.exit-L.start)));playtestData.progress[L.serverId]=Math.max(playtestData.progress[L.serverId]??0,ratio)}
 if(state==='dead'&&lossRevealDelay===0)playtestData.readingSeconds+=dt;
 playtestSaveAt+=dt;if(playtestSaveAt>=2){playtestSaveAt=0;playtestPersist()}
}
function playtestClear(level){if(!playtestActive||!PLAYTEST_ROUTE.includes(level.serverId))return;if(!playtestData.completed.includes(level.serverId))playtestData.completed.push(level.serverId);playtestEvent('clear',{credits:creditReceipt?.remaining??0});playtestPersist()}
function showPlaytestFeedback(){
 playtestFeedbackOpen=true;$('playtestFeedback').hidden=false;keys.clear();pressedKeys.clear();suspendSound();
 const feedback=playtestData?.feedback;if(feedback){$('playtestFun').value=String(feedback.fun);$('playtestFair').value=String(feedback.understoodFailures);$('playtestReplay').value=feedback.wouldReplay;$('playtestChange').value=feedback.change??''}
 $('playtestFeedbackStatus').textContent=playtestPersistent?(feedback?'Your saved feedback is shown below.':''):'This browser cannot save the session. Export before leaving.';$('playtestFun')?.focus?.();
}
function advancePlaytestReceipt(){
 if(!playtestActive||!playtestData)return false;
 if(PLAYTEST_ROUTE.every(id=>playtestData.completed.includes(id))){playtestData.status='complete';playtestPersist();showPlaytestFeedback();return true}
 if(PLAYTEST_ROUTE.slice(0,3).every(id=>playtestData.completed.includes(id))&&!playtestData.completed.includes(PLAYTEST_ROUTE[3])){startRageLab(PLAYTEST_ROUTE[3]);return true}
 return false;
}
function endPlaytestEarly(){if(!playtestData)return;playtestData.status='stopped';playtestPersist();resetRewardOverlays();showPlaytestFeedback()}
function playtestStart(){
 playtestWelcomeOpen=false;$('playtestWelcome').hidden=true;
 let old=null;try{old=JSON.parse(localStorage.getItem('exception-playtest-summary-v1')||'null')}catch(_){}
 playtestData=old?.version===1&&old.id===PLAYTEST_ID&&Array.isArray(old.events)&&Array.isArray(old.completed)&&old.progress&&Number.isFinite(old.activeSeconds)&&Number.isFinite(old.readingSeconds)?old:{version:1,id:PLAYTEST_ID,status:'in-progress',startedAt:new Date().toISOString(),activeSeconds:0,readingSeconds:0,progress:{},completed:[],events:[],feedback:null};
 playtestActive=true;playtestData.status='in-progress';playtestPersist();const next=PLAYTEST_ROUTE.find(id=>!playtestData.completed.includes(id));
 if(!next){playtestData.status='complete';playtestPersist();showPlaytestFeedback();return}
 if(next.startsWith('localhost'))startCampaignServer(next,false);else startRageLab(next);
}
function playtestInput(e){
 if(!playtestWelcomeOpen&&!playtestFeedbackOpen)return false;
 const root=$(playtestWelcomeOpen?'playtestWelcome':'playtestFeedback');
 if(e.code==='Tab'&&root?.querySelectorAll){const items=[...root.querySelectorAll('button,select,textarea,a')].filter(n=>n.getClientRects().length),first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first||!e.shiftKey&&document.activeElement===last){e.preventDefault();(e.shiftKey?last:first)?.focus()}}
 return true;
}
function installPlaytest(){
 if(PLAYTEST_ID){$('playtestWelcome').hidden=false;document.addEventListener('DOMContentLoaded',()=>{$('playtestStart')?.focus?.()})}
 if($('playtestEnd')){$('playtestEnd').hidden=!PLAYTEST_ID;$('playtestEnd').onclick=endPlaytestEarly}
 $('playtestStart').onclick=playtestStart;
 $('playtestSaveFeedback').onclick=()=>{
  if(!playtestData)return;const fun=Number($('playtestFun').value),fair=Number($('playtestFair').value),replay=$('playtestReplay').value;
  if(![1,2,3,4,5].includes(fun)||![1,2,3,4,5].includes(fair)||!['yes','maybe','no'].includes(replay)){$('playtestFeedbackStatus').textContent='Choose all three ratings, then save.';return}
  playtestData.feedback={fun,understoodFailures:fair,wouldReplay:replay,change:$('playtestChange').value.slice(0,500)};playtestPersist();$('playtestFeedbackStatus').textContent=playtestPersistent?'Saved locally. You can export this session below.':'Feedback is held for this session only. Export before leaving.';
 };
 $('playtestExport').onclick=()=>{if(!playtestData)return;const url=URL.createObjectURL(new Blob([JSON.stringify(playtestData,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='exception-human-playtest-'+PLAYTEST_ID+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
 window.__PLAYTEST_TEST__={id:()=>PLAYTEST_ID,data:()=>playtestData?JSON.parse(JSON.stringify(playtestData)):null,start:playtestStart};
}
