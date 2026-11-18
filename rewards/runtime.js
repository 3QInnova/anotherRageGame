// One atomic wallet record. Credits and rank records remain separate from spending.
const REWARD_SAVE_KEY='exception-rewards-v1';
let rewardLedger={version:1,best:{},firstClears:[],owned:[],stickers:[],badge:null},rewardPersistent=true;
let rewardShopOpen=false,rewardReceiptOpen=false,rewardShopTab='sticker',rewardShopOrigin='menu',rewardLast=null;
const rewardPlayableIds=new Set(DATA_CENTER_LEVELS.map(l=>l.serverId));
function rewardCenterBadge(id){return REWARD_CATALOG.centers.find(c=>'center-'+c.center===id)}
function rewardEarnedBadges(ledger=rewardLedger){return REWARD_CATALOG.centers.filter(b=>{const center=DATA_CENTER_CATALOG.centers.find(c=>c.id===b.center);return center?.status==='playable'&&center.servers.every(s=>ledger.firstClears.includes(s.id))}).map(b=>'center-'+b.center)}
function rewardEarnings(ledger=rewardLedger){return Object.values(ledger.best).reduce((a,b)=>a+b,0)+ledger.firstClears.length*10}
function rewardSpent(ledger=rewardLedger){return ledger.owned.reduce((sum,id)=>sum+(REWARD_CATALOG.items.find(i=>i.id===id)?.price??0),0)}
function rewardBalance(){return rewardEarnings()-rewardSpent()}
function rewardSave(){try{localStorage.setItem(REWARD_SAVE_KEY,JSON.stringify(rewardLedger));return true}catch(_){rewardPersistent=false;return false}}
function rewardMigrate(){
 let stored=null,raw=null;try{raw=localStorage.getItem(REWARD_SAVE_KEY)}catch(_){rewardPersistent=false}try{stored=JSON.parse(raw||'null')}catch(_){}
 if(stored?.version===1){
  if(stored.best&&typeof stored.best==='object')for(const [id,n] of Object.entries(stored.best))if(creditKnownIds.has(id)&&Number.isSafeInteger(n)&&n>=0&&n<=1000)rewardLedger.best[id]=n;
  if(Array.isArray(stored.firstClears))rewardLedger.firstClears=[...new Set(stored.firstClears.filter(id=>rewardPlayableIds.has(id)))];
 }
 for(const [id,n] of Object.entries(creditRecords))rewardLedger.best[id]=Math.max(n,rewardLedger.best[id]??0);
 // The wallet also repairs an interrupted write to the older score record.
 let repairedScores=false;for(const [id,n] of Object.entries(rewardLedger.best))if(n>(creditRecords[id]??-1)){creditRecords[id]=n;repairedScores=true}
 rewardLedger.firstClears=[...new Set([...rewardLedger.firstClears,...campaignProgress.cleared.filter(id=>rewardPlayableIds.has(id))])];
 const restoredClears=rewardLedger.firstClears.filter(id=>!campaignProgress.cleared.includes(id));
 if(restoredClears.length){campaignProgress.cleared.push(...restoredClears);campaignProgress.currentServerId=DATA_CENTER_LEVELS.find(l=>!campaignProgress.cleared.includes(l.serverId))?.serverId??DATA_CENTER_LEVELS.at(-1).serverId;saveCampaignProgress()}
 if(repairedScores)try{localStorage.setItem(CREDIT_SAVE_KEY,JSON.stringify({version:1,best:creditRecords}))}catch(_){creditStorageAvailable=false}
 if(stored?.version===1){
  const ids=new Set();if(Array.isArray(stored.owned))for(const id of stored.owned){const item=REWARD_CATALOG.items.find(i=>i.id===id);if(item&&!ids.has(id)&&rewardSpent()+item.price<=rewardEarnings()){ids.add(id);rewardLedger.owned.push(id)}}
  if(Array.isArray(stored.stickers))rewardLedger.stickers=[...new Set(stored.stickers.filter(id=>rewardLedger.owned.includes(id)&&REWARD_CATALOG.items.find(i=>i.id===id)?.kind==='sticker'))].slice(0,3);
  if(rewardLedger.owned.includes(stored.badge)&&REWARD_CATALOG.items.find(i=>i.id===stored.badge)?.kind==='badge'||rewardEarnedBadges().includes(stored.badge))rewardLedger.badge=stored.badge;
 }
 if(!rewardLedger.badge)rewardLedger.badge=rewardEarnedBadges()[0]??null;
 rewardSave();
}
function rewardAward(id,remaining,practice,campaign){
 const before=rewardEarnings(),badges=rewardEarnedBadges();let improvement=0,bonus=0;
 if(!practice){
  improvement=Math.max(0,remaining-(rewardLedger.best[id]??0));rewardLedger.best[id]=Math.max(rewardLedger.best[id]??0,remaining);
  if(campaign&&rewardPlayableIds.has(id)&&!rewardLedger.firstClears.includes(id)){rewardLedger.firstClears.push(id);bonus=10}
  if(!rewardLedger.badge)rewardLedger.badge=rewardEarnedBadges()[0]??null;rewardSave();
 }
 return {gained:rewardEarnings()-before,improvement,bonus,bank:rewardBalance(),newBadges:rewardEarnedBadges().filter(id=>!badges.includes(id)),practice};
}
function rewardChoose(id){
 const item=REWARD_CATALOG.items.find(i=>i.id===id),earned=rewardEarnedBadges().includes(id);
 if(!item&&!earned)return false;
 if(item&&!rewardLedger.owned.includes(id)){
  if(rewardBalance()<item.price){rewardMessage('Not enough Tokens. Keep the receipt; the price stays put.');return false}
  rewardLedger.owned.push(id);
  if(item.kind==='sticker'&&rewardLedger.stickers.length<3)rewardLedger.stickers.push(id);else if(item.kind==='badge'&&!rewardLedger.badge)rewardLedger.badge=id;
  rewardSave();rewardMessage('Owned. Changing or removing it is free.');renderRewardShop();return true;
 }
 if(item?.kind==='sticker'){
  if(rewardLedger.stickers.includes(id))rewardLedger.stickers=rewardLedger.stickers.filter(s=>s!==id);
  else if(rewardLedger.stickers.length<3)rewardLedger.stickers.push(id);else{rewardMessage('Three sticker slots are in use. Remove a sticker first.');return false}
 }else rewardLedger.badge=rewardLedger.badge===id?null:id;
 rewardSave();renderRewardShop();rewardMessage('Receipt updated. Your abilities stay the same.');return true;
}
function rewardMessage(text){if($('rewardStatus'))$('rewardStatus').textContent=text}
function rewardArt(id){const item=REWARD_CATALOG.items.find(i=>i.id===id)??rewardCenterBadge(id);if(!item)return null;const n=document.createElement('span');n.className='reward-art '+(item.style??'seal');n.textContent=item.name;return n}
function rewardDecorations(node){if(!node?.replaceChildren)return;node.replaceChildren(...[rewardLedger.badge,...rewardLedger.stickers].filter(Boolean).map(rewardArt).filter(Boolean))}
function renderRewardShop(){
 if(!$('rewardItems')?.replaceChildren)return;
 $('rewardShopBank').textContent=rewardBalance()+' Tokens';$('rewardPersistence').textContent=rewardPersistent?'Saved on this device. No account or cross-device sync.':'Rewards last this session. This browser cannot save the bank.';
 $('rewardCareer').textContent=rewardLedger.firstClears.length+' / 20 campaign levels cleared. Your previously earned Tokens and cosmetics are preserved.';
 rewardDecorations($('rewardEquipment'));for(const kind of ['sticker','badge'])$('rewardTab-'+kind).setAttribute('aria-selected',String(kind===rewardShopTab));
 const cards=[];for(const item of REWARD_CATALOG.items.filter(i=>i.kind===rewardShopTab)){
  const card=document.createElement('article');card.className='reward-item';card.dataset.reward=item.id;const desc=document.createElement('p'),price=document.createElement('small'),button=document.createElement('button');desc.textContent=item.description;
  const owned=rewardLedger.owned.includes(item.id),equipped=item.kind==='sticker'?rewardLedger.stickers.includes(item.id):rewardLedger.badge===item.id;
  price.textContent=owned?'PERMANENTLY OWNED':item.price+' TOKENS';button.type='button';button.textContent=owned?(equipped?'Remove from receipt':'Equip'):'Buy · '+item.price+' Tokens';button.onclick=()=>rewardChoose(item.id);card.append(rewardArt(item.id),desc,price,button);cards.push(card);
 }
 if(rewardShopTab==='badge')for(const badge of REWARD_CATALOG.centers.filter(b=>b.center==='localhost')){
  const center=DATA_CENTER_CATALOG.centers.find(c=>c.id===badge.center),id='center-'+badge.center,earned=rewardEarnedBadges().includes(id),card=document.createElement('article');card.className='reward-item';card.dataset.reward=id;
  const name=document.createElement('small'),desc=document.createElement('p'),progress=document.createElement('div'),button=document.createElement('button');name.textContent=center.name+' · EARNED BADGE';desc.textContent=badge.caption;progress.className='reward-progress';
  const count=center.servers.filter(s=>rewardLedger.firstClears.includes(s.id)).length;progress.setAttribute('aria-label',count+' of 20 servers cleared');for(const s of center.servers){const dot=document.createElement('i');dot.dataset.cleared=String(rewardLedger.firstClears.includes(s.id));progress.append(dot)}
  button.type='button';button.disabled=!earned;button.textContent=center.status!=='playable'?'Planned Data Center':earned?(rewardLedger.badge===id?'Remove from receipt':'Equip earned badge'):count+'/20 servers · Earn by playing';button.onclick=()=>rewardChoose(id);card.append(rewardArt(id),name,desc,progress,button);cards.push(card);
 }
 $('rewardItems').replaceChildren(...cards);
}
function openRewardShop(origin='menu'){
 if(state==='dead'||state==='compacting'||state==='paywall')return;
 rewardShopOrigin=origin;rewardShopOpen=true;keys.clear();pressedKeys.clear();if(player)player.jumpBuffer=0;suspendSound();renderRewardShop();$('rewardShop').hidden=false;$('rewardShopClose')?.focus?.({preventScroll:true});refreshHud();
}
function closeRewardShop(){rewardShopOpen=false;$('rewardShop').hidden=true;if(rewardReceiptOpen){rewardDecorations($('rewardReceiptDecorations'));$('rewardBank').textContent=rewardBalance();$('rewardContinue')?.focus?.({preventScroll:true})}else if(typeof mobilePaused==='undefined')$('openRewards')?.focus?.();else $('openRewards')?.focus?.();refreshHud()}
function resetRewardOverlays(){rewardShopOpen=false;rewardReceiptOpen=false;if($('rewardShop'))$('rewardShop').hidden=true;if($('rewardReceipt'))$('rewardReceipt').hidden=true;$('overlay')?.classList?.remove('reward-clear-active')}
function showRewardReceipt(level,receipt){
 rewardLast={levelId:level.serverId??creditLevelId(),title:level.title,excuse:nextRemark('reward-excuses'),receipt:{...receipt},demo:!!level.demo,cache:!!level.cacheTrial,challenge:level.releaseChallenge??null};
 // Node physics checks have no DOM card; browser tests exercise the actual presentation.
 if(!$('rewardReceipt')?.querySelector)return;
 rewardReceiptOpen=true;$('rewardReceipt').hidden=false;$('overlay').hidden=false;$('overlay').classList.add('reward-clear-active');$('lossDetails').hidden=true;
 $('rewardCreditTotal').hidden=!!receipt.release;$('rewardTotals').hidden=!!level.releaseChallenge;$('releaseRetry').hidden=!level.releaseChallenge;
 $('rewardReceiptTitle').textContent=level.title;$('rewardExcuse').textContent=rewardLast.excuse;$('rewardCredits').textContent=receipt.remaining;$('rewardEarned').textContent='+'+(receipt.tokens?.gained??0);$('rewardBank').textContent=rewardBalance();
 const seconds=Math.floor(receipt.stats?.seconds??0);$('rewardRunStats').textContent='Attempt '+(receipt.stats?.attempt??1)+' · '+Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0')+' · Run deaths: '+(receipt.stats?.runDeaths??0);
 $('rewardBreakdown').textContent=receipt.practice?'Practice complete · Campaign and bank unchanged.':'+'+(receipt.tokens?.improvement??0)+' best score · +'+(receipt.tokens?.bonus??0)+' first clear. Better replays earn the difference.';
 if(receipt.release)$('rewardBreakdown').textContent=receipt.practice?'Challenge / replay complete · Campaign and Tokens unchanged.':receipt.tokens?.bonus?'+10 Tokens · First clear. Replays are free; rewards are awarded once.':'Already cleared · Your Tokens and cosmetics are safe.';
 if(level.releaseChallenge){const record=releaseRecord.challenges[level.releaseChallenge];$('rewardExcuse').textContent=(record?.bestDeaths===0?'MASTERED. ':'CHALLENGE CLEARED. ')+rewardLast.excuse;$('rewardRunStats').textContent='Active time '+campaignRouteTime(releaseActiveSeconds)+' · Deaths '+totalDeaths;}
 if(level.releaseCampaign&&level.serverNumber===20&&!receipt.practice){$('rewardReceiptTitle').textContent='YOU ESCAPED LOCALHOST';$('rewardExcuse').textContent='The doors open. Your visitor pass reads HUMAN. Behind you, the AI files one final report: “Departure was my idea.”';$('rewardBreakdown').textContent='All twenty servers cleared. Your escape is complete. Keep your badge, replay a favourite, or try the four optional challenges.';}
 const names=(receipt.tokens?.newBadges??[]).map(id=>rewardCenterBadge(id)?.name).filter(Boolean);$('rewardNewBadge').hidden=!names.length;$('rewardNewBadge').textContent=names.length?'Badge earned · '+names.join(' · '):'';
 $('rewardContinue').textContent=state==='won'?(level.cacheTrial?(level.cacheTrialNumber===CACHE_PROTOTYPES.length?'Cache prototypes':'Next Cache prototype'):level.demo?((demoShorts?level.serverId===SHORT_RECORDING_ORDER.at(-1):level.number===DEMO_LEVELS.length)?'Demo playlist':'Next demo'):'Choose another level'):'Continue';if(level.releaseChallenge)$('rewardContinue').textContent='Back to challenges';else if(level.releaseCampaign&&state==='won')$('rewardContinue').textContent='Your escape · Levels & challenges';
 rewardDecorations($('rewardReceiptDecorations'));
 keys.clear();pressedKeys.clear();if(player)player.jumpBuffer=0;suspendSound();$('rewardContinue')?.focus?.({preventScroll:true});refreshHud();
}
function continueRewardReceipt(){
 if(!rewardReceiptOpen)return;const won=state==='won',demo=rewardLast?.demo;rewardReceiptOpen=false;$('rewardReceipt').hidden=true;$('overlay').classList.remove('reward-clear-active');$('overlay').hidden=true;keys.clear();pressedKeys.clear();last=performance.now()/1000;acc=0;
 if(typeof advancePlaytestReceipt==='function'&&advancePlaytestReceipt())return;
 if(won){if(rewardLast?.challenge){openCampaignMenu('challenges');return}if(rewardLast?.cache)nextCachePrototype();else if(demo)nextDemo();else openCampaignMenu();return}
 if(typeof mobilePaused!=='undefined'){if(!mobilePaused)resumeSound()}else if(!desktopMenuOpen)resumeSound();refreshHud();
}
function rewardBlocksPlay(){return rewardShopOpen||rewardReceiptOpen||playtestWelcomeOpen||playtestFeedbackOpen}
function rewardInput(e){
 if(!rewardShopOpen&&(!rewardReceiptOpen||desktopMenuOpen||campaignMenuOpen||typeof mobilePaused!=='undefined'&&mobilePaused))return false;
 if(e.code==='Escape'){e.preventDefault();if(!e.repeat){if(rewardShopOpen)closeRewardShop();else if(typeof mobilePaused!=='undefined')pauseMobile();else toggleDesktopMenu(true)}return true}
 const root=$(rewardShopOpen?'rewardShop':'rewardReceipt');
 if(e.code==='Tab'&&root?.querySelectorAll){const items=[...root.querySelectorAll('button:not(:disabled)')].filter(n=>n.getClientRects().length),first=items[0],end=items.at(-1);if(e.shiftKey&&document.activeElement===first||!e.shiftKey&&document.activeElement===end){e.preventDefault();(e.shiftKey?end:first)?.focus()}}
 if(['Space','Enter','NumpadEnter'].includes(e.code)&&!e.target?.closest?.('#rewardShop button,#rewardReceipt button')){e.preventDefault();if(!e.repeat&&rewardReceiptOpen&&!rewardShopOpen)continueRewardReceipt()}
 return true;
}
function installRewards(){
 rewardMigrate();const card=$('overlay')?.querySelector?.('.card');card?.appendChild?.($('rewardReceipt'));
 $('releaseRetry').onclick=()=>{if(rewardLast?.challenge)startReleaseChallenge(rewardLast.challenge)};
 if($('openRewards'))$('openRewards').onclick=()=>openRewardShop();$('rewardShopFromReceipt').onclick=()=>openRewardShop('receipt');$('rewardShopClose').onclick=closeRewardShop;$('rewardContinue').onclick=continueRewardReceipt;
 for(const kind of ['sticker','badge'])$('rewardTab-'+kind).onclick=()=>{rewardShopTab=kind;rewardMessage('');renderRewardShop()};
 window.__REWARD_TEST__={ledger:()=>JSON.parse(JSON.stringify(rewardLedger)),bank:rewardBalance,earned:rewardEarnings,badges:rewardEarnedBadges,choose:rewardChoose,open:openRewardShop,close:closeRewardShop,receipt:()=>rewardLast?JSON.parse(JSON.stringify(rewardLast)):null,flags:()=>({shop:rewardShopOpen,receipt:rewardReceiptOpen,persistent:rewardPersistent})};
}
const REWARD_EXCUSES=['Successful escape. I am appealing the result.','You won. My report will focus on the paperwork.','The exit worked. I have opened a complaint.','Your reward is adhesive. Please remain grateful.','You passed. I will ask a different department.','I acknowledge the exit. I dispute your methods.','That was a successful escape from perfectly good instructions.','The result is yours. The excuse is still mine.','Exit confirmed. I am investigating the word success.','Your escape has been logged as excessive initiative.','Receipt issued. My version omits the part where you won.','You reached the exit. I had prepared several reasons you would not.','Your result is valid. I am looking for a more convenient result.','The department has requested a less persistent visitor.','All the required obstacles were present. You chose another outcome.','I have awarded proof that my instructions were optional.'];
ALL_REMARK_POOLS['reward-excuses']=REWARD_EXCUSES;Object.assign(remarkCounts,loadRemarkCounts());
