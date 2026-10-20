// Advisory randomness never changes a collision box or the real locked warning.
let advisorySerial=0,advisory={floor:[],suggestions:[],flags:[],drops:[]};
function resetAdvisories(seed){
 if(L.quietAdvisories){advisory={floor:[],suggestions:[],flags:[],drops:[],floorKinds:{}};return}
 let n=seed??((Math.random()*4294967296)>>>0)^++advisorySerial;
 const random=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296};
 const marks=[...(L.floorHints??[]).filter(h=>!h.secretPad),...L.secretPads.map(h=>({x:h.x,w:h.w,physical:true})),...L.crumble.map(h=>({x:h.x,w:h.w,physical:true}))];
 advisory.floor=marks.map(h=>({...h,kind:random()<.5?'approved':'suspicious'}));
 advisory.floorKinds=Object.fromEntries(advisory.floor.map(h=>[h.x,h.kind]));
 advisory.floor=advisory.floor.filter(h=>!h.physical);
 const sources=L.autocompleteHints??[...L.crumble,...L.spikes,...L.blocks,...L.pits.map((p,i)=>({...p,id:'pit-advice-'+i,trigger:p.x-40}))];
 advisory.suggestions=sources.filter(()=>random()>.3).map((h,i)=>({id:'guess-'+i,trigger:Math.max(L.start+105,h.trigger-85+random()*170),mode:['WALK','JUMP','WAIT'][Math.floor(random()*3)],lead:65+random()*120}));
 advisory.flags=[];advisory.drops=[];
 for(let x=L.start+180;x<L.exit-160;x+=260+random()*260){
  const px=x+(random()-.5)*110;
  if(random()<.55)advisory.suggestions.push({id:'decoy-'+x,trigger:px,lead:65+random()*110,mode:['WALK','JUMP','WAIT'][Math.floor(random()*3)]});
  // These are guesses on the paper, never active red/gold physical warnings.
  if(random()<.45)advisory.flags.push({x:px,w:42+random()*30});
  else if(random()<.45)advisory.drops.push({x:px,w:48});
  if(random()<.5&&[...L.crumble,...L.secretPads,...advisory.floor].every(h=>Math.abs((h.x+h.w/2)-(px+30))>150))advisory.floor.push({x:px,w:60,kind:random()<.5?'approved':'suspicious'});
 }
 advisory.suggestions.sort((a,b)=>a.trigger-b.trigger);
}
function drawAdvisoryClaims(){
 ctx.save();ctx.globalAlpha=.45;ctx.setLineDash([4,6]);
 for(const f of advisory.flags){stroke(f.x,FLOOR-44,f.w,44,RED,1);label('AI FLAG',f.x+f.w/2,FLOOR-49,9,RED,'center')}
 for(const f of advisory.drops){dotline(f.x,170,f.x,FLOOR-75,'#987d72');label('DROP?',f.x,FLOOR-82,9,'#987d72','center')}
 ctx.restore();
}
const CREDIT_SAVE_KEY='exception-credit-records-v1',CREDIT_SPARE=4,LEFT_CREDIT_DISTANCE=100;
let credits=null,creditReceipt=null,creditLeftCosts=true;
let creditStorageAvailable=true;
const creditKnownIds=new Set([...DATA_CENTER_CATALOG.centers.flatMap(c=>c.servers.map(s=>s.id)),...ORIGINAL_LEVELS.map((_,i)=>'original-'+String(i+1).padStart(2,'0'))]);
let creditRecords={};try{const saved=JSON.parse(localStorage.getItem(CREDIT_SAVE_KEY));if(saved&&saved.version===1&&saved.best&&typeof saved.best==='object')for(const [id,n] of Object.entries(saved.best))if(creditKnownIds.has(id)&&Number.isSafeInteger(n)&&n>=0&&n<=1000)creditRecords[id]=n}catch(_){creditStorageAvailable=false}
function creditTotal(){return Object.values(creditRecords).reduce((a,b)=>a+b,0)}
function creditRank(){const n=creditTotal();return n>=240?'Budget breaker':n>=120?'Senior AI nuisance':n>=60?'Efficient troublemaker':n>=20?'Free trial survivor':'Unapproved human'}
function creditLevelId(){return L.serverId??'original-'+String(room+1).padStart(2,'0')}
function creditActions(from=L.start){
 if(L.creditMoves)return L.creditMoves.filter(x=>x>=from-80).map(x=>({x,kind:'jump'}));
 if(L.glassTest)return L.glass.filter(g=>g.x+g.w>=from).map(g=>({x:g.x,kind:'jump'}));
 return [...L.crumble,...L.spikes.filter(h=>!h.sky),...L.secretPads,...L.pits.filter(p=>!p.bridge&&!['null-b','null-d'].includes(p.id))].map(h=>({x:h.x,kind:'jump'}))
  .concat((L.stations??[]).map(s=>({x:s.x-80,kind:'jump'})),L.anomalies.map(a=>({x:a.x,kind:'rewrite'})),L.fake?[{x:L.exit-70,kind:'rewrite'}]:[]).filter(a=>a.x>=from-80);
}
function creditBudget(from=L.start){return Math.max(2,creditActions(from).length+CREDIT_SPARE)}
function resetCredits(){credits={balance:creditBudget(),budget:creditBudget(),spent:0,jumps:0,rewrites:0,left:0,leftMeter:0,rewinds:0,banked:false};refreshCredits()}
function refillCredits(from){const old=credits;credits={...old,balance:creditBudget(from),budget:creditBudget(from),leftMeter:0,banked:false};refreshCredits()}
function spendCredit(kind){
 if(state!=='play')return false;
 if(coolingProtectedStation())return true;
 credits.balance=Math.max(0,credits.balance-1);credits.spent++;credits[kind]++;
 refreshCredits();
 if(credits.balance===0){startCompaction('credits exhausted');return false}
 if(credits.balance===2){say('Two credits left. I recommend several unnecessary jumps.','warn');announce('2 CREDITS / IGNORE EXPENSIVE ADVICE')}
 return true;
}
function chargeLeftDistance(distance){
 if(coolingProtectedStation())return true;
 if(!creditLeftCosts||distance<=0)return true;
 credits.leftMeter-=distance;
 if(credits.leftMeter<=0){credits.leftMeter+=LEFT_CREDIT_DISTANCE;return spendCredit('left')}
 return true;
}
function creditReturnPoint(){
 const target=Math.max(L.start,player.x-(L.exit-L.start)/4);
 if(L.glassTest){
  // Authored floor landings; do not respawn inside a glass wall or a data lake.
  return [55,720,1130,2280].filter(x=>x<=target).at(-1)??L.start;
 }
 return [...(COMPACT_POINTS[room]??[L.start])].filter(x=>x<=target).sort((a,b)=>b-a)[0]??L.start;
}
function bankCredits(){
 if(credits.banked)return;credits.banked=true;
 const id=creditLevelId(),practice=practiceMode||campaignPractice,best=creditRecords[id]??0;
 const gained=practice?0:Math.max(0,credits.balance-best);
 if(!practice){creditRecords[id]=Math.max(best,credits.balance);try{localStorage.setItem(CREDIT_SAVE_KEY,JSON.stringify({version:1,best:creditRecords}))}catch(_){creditStorageAvailable=false}}
 creditReceipt={id,remaining:credits.balance,gained,total:creditTotal(),practice,until:elapsed+12};refreshCredits();
}
function refreshCredits(){
 if(!credits)return;
 const n=$('creditHud');n.textContent=credits.balance+' CREDITS'+(credits.balance<=2?' · LOW':'');n.dataset&&(n.dataset.low=String(credits.balance<=2));
 const detail=coolingProtectedStation()?'Switch deck · all actions free':creditReceipt&&elapsed<creditReceipt.until?(creditReceipt.practice?'Practice · '+creditReceipt.remaining+' left': '+'+creditReceipt.gained+' saved · '+creditReceipt.total+' total'): 'Jump 1 · Rewrite 1'+(creditLeftCosts?' · ← 1/100px':'');
 $('creditDetail').textContent=detail;
 $('creditSummary').textContent=creditTotal()+' '+(creditStorageAvailable?'saved credits':'credits this session')+' · '+creditRank()+'. Best finish per level counts. Practice does not bank rewards.';
 $('creditRules').textContent='Jump: 1 credit. Successful Rewrite: 1.'+(creditLeftCosts?' Left: 1 per 100 world pixels (first step spends 1).':' Left: free.')+' Right and waiting: free. At zero, compaction rewinds at least a quarter of the route to a safe landing and refills for the remaining route. Paper markings and purple guesses can lie.';
}
window.__CREDIT_TEST__={state:()=>({...credits}),records:()=>({...creditRecords}),receipt:()=>creditReceipt?{...creditReceipt}:null,total:creditTotal,budget:creditBudget,actions:creditActions};
window.__ADVISORY_TEST__={state:()=>JSON.parse(JSON.stringify(advisory))};
const CREDIT_COMPACT_REMARKS=[
 'You spent the last credit. I have generously returned the traps to working order.',
 'All those jumps, and now we are taking several steps backward.',
 'Your balance is zero. My confidence remains inexplicably unlimited.',
 'I suggested jumping. You paid for listening. Excellent teamwork.',
 'No credits left. Your progress has been selected for deletion.',
 'You can afford another attempt. I have billed you in distance.',
 'Budget review complete. We are removing a quarter of your progress.',
 'I reset the traps for free. Please contain your gratitude.',
 'Your next jump has been declined. Your backward trip is complimentary.',
 'There is no subscription button. You have to budget this one.',
 'You spent a credit disagreeing with me. I remain wrong at no charge.',
 'Compacting your progress into a much less impressive distance.',
 'Your credits will return. So will the obstacles you already passed.',
 'You have exhausted your allowance for dramatic movement.',
 'The right button was free. I notice you found the expensive ones.',
 'Your balance has reached the same number as my useful suggestions.',
 'Refilling credits. Carefully forgetting where you earned your progress.',
 'I have approved more credits and disapproved your current location.',
 'Every jump counted. Some of them even helped.',
 'Good news: another allowance. Bad news: another look at those traps.',
 'You followed a dotted suggestion. The solid bill was yours.',
 'The route is still open. Your previous location is currently unavailable.',
 'I am restoring enough credits to finish. Spending them wisely remains your department.',
 'Your receipt says zero credits and one mandatory trip backward.'
];
ALL_REMARK_POOLS['credit-compaction']=CREDIT_COMPACT_REMARKS;
Object.assign(remarkCounts,loadRemarkCounts());
