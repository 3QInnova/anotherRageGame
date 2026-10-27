// Demo episodes use the shared, deterministic paper-route compiler.
function demoLevel(...args){return assemblePaperRoute(...args)}
const DEMO_LEVELS=[
 demoLevel('demo-do-not-move','DO NOT MOVE','The AI has a very specific opinion about where you should stand.','Please remain exactly where I expect you. This is for your safety.',[
  {kind:'forecast',x:350},{kind:'landing',x:970},{kind:'forecast',x:1530},{kind:'scan',x:2220}],
  {exit:2590,signs:[{x:270,text:'PLEASE REMAIN STILL'},{x:900,text:'JUMPING HAS SOLVED THE PROBLEM'},{x:1450,text:'NO NEED TO CHANGE YOUR PLAN'},{x:2420,text:'UNEXPECTED DEPARTURE'}]}),
 demoLevel('demo-safe-landing','THE SAFE LANDING','A little forward momentum becomes a surprisingly large administrative problem.','Jump once. I have already approved the landing.',[
  {kind:'landing',x:340},{kind:'receipt',x:850},{kind:'landing',x:1380},{kind:'entry',x:2010}],
  {exit:2440,signs:[{x:260,text:'LANDING APPROVED'},{x:750,text:'EXPRESS LANE / PROBABLY'},{x:1300,text:'THE SECOND LANDING IS ALSO FINE'},{x:1950,text:'PLEASE WAIT FOR YOUR RECEIPT'}]}),
 demoLevel('demo-exit-loading','YOUR EXIT IS LOADING','The exit department has borrowed the bridge department\'s only permission.','Access approved. Please do not ask which part I approved.',[
  {kind:'handoff',x:350},{kind:'forecast',x:1060},{kind:'scan',x:1690},{kind:'entry',x:1940}],
  {exit:2350,signs:[{x:260,text:'ALL PERMISSIONS GRANTED *'},{x:700,text:'* ONE AT A TIME'},{x:980,text:'YOUR DEPARTURE HAS BEEN PREDICTED'},{x:1870,text:'EXIT PERMIT / ISSUED BY GRAVITY'}]}),
 demoLevel('demo-saved-probably','SAVED, PROBABLY','An impressive save stamp. An unimpressive amount of saved floor.','Your progress has been saved. The floor is handled by a different team.',[
  {kind:'recovery',x:350},{kind:'landing',x:1250},{kind:'forecast',x:1810},{kind:'receipt',x:2510}],
  {exit:2920,signs:[{x:260,text:'SAVE COMPLETE'},{x:660,text:'PROGRESS MAY SETTLE IN TRANSIT'},{x:1160,text:'RESUBMIT YOUR LANDING'},{x:1720,text:'RECOVERY WAS MY IDEA'},{x:2400,text:'PLEASE COLLECT YOUR CONFIRMATION'}]}),
 demoLevel('demo-express-checkout','EXPRESS CHECKOUT','The queue wants you to wait. Delivery wants you to keep moving.','Stand by for a receipt. Customer service knows exactly where you are.',[
  {kind:'receipt',x:480},{kind:'entry',x:1050},{kind:'forecast',x:1580},{kind:'receipt',x:2280}],
  {exit:2690,signs:[{x:280,text:'PLEASE WAIT HERE'},{x:950,text:'PERSONAL DELIVERY / NO REFUNDS'},{x:1480,text:'NEXT CUSTOMER: YOUR FUTURE SELF'},{x:2160,text:'ONE LAST RECEIPT'}]}),
 demoLevel('demo-one-more-signature','ONE MORE SIGNATURE','Every approval expires. The optional paperwork is entirely your bad idea.','You are one signature away from leaving. I may have said that before.',[
  {kind:'timed',x:350},{kind:'handoff',x:960},{kind:'forecast',x:1670},{kind:'stamp',x:2230},{kind:'scan',x:2800}],
  {exit:3150,signs:[{x:260,text:'TEMPORARY PERMANENT APPROVAL'},{x:870,text:'PLEASE TRANSFER YOUR OBJECTION'},{x:1580,text:'FINAL REVIEW / REVISION 2'},{x:2300,text:'OPTIONAL / IMPOSSIBLE STAMP'},{x:2950,text:'SIGNATURE COUNT: SUFFICIENT'}]}),
 demoLevel('demo-memory-not-found','MEMORY NOT FOUND','The remembered flag and the dangerous height are different questions.','I remember this route perfectly. Some details have been moved for clarity.',[
  {kind:'sky',x:350},{kind:'scan',x:650},{kind:'entry',x:1040},{kind:'landing',x:1570},{kind:'forecast',x:2140}],
  {exit:2730,signs:[{x:260,text:'JUMPING IS THE USUAL ANSWER'},{x:570,text:'NOW DO WHAT YOU DID NOT DO'},{x:940,text:'MEMORY REFRESH / DELIVERY INCOMING'},{x:1470,text:'LANDING LOCATION: APPROXIMATE'},{x:2040,text:'I WILL REMEMBER THIS DIFFERENTLY'}]}),
 demoLevel('demo-final-final-test','THE FINAL FINAL TEST','A longer escalation of forecasts, borrowed permissions and a very questionable save.','This is the final test. Any tests after this are a clerical error.',[
  {kind:'forecast',x:350},{kind:'handoff',x:1080},{kind:'landing',x:1760},{kind:'recovery',x:2300},
  {kind:'receipt',x:3200},{kind:'forecast',x:3740},{kind:'landing',x:4450}],
  {exit:4940,signs:[{x:260,text:'FINAL TEST / BEGIN'},{x:980,text:'FINAL ACCESS REVIEW'},{x:1670,text:'FINAL LANDING REVIEW'},{x:2200,text:'FINAL SAVE / ABSOLUTELY REAL'},
   {x:3090,text:'FINAL RECEIPT'},{x:3640,text:'FINAL FORECAST / NO TAKEBACKS'},{x:4340,text:'FINAL FINAL LANDING'},{x:4790,text:'THIS EXIT IS AN ADMISSION'}]})
];
const DEMO_VOICE=[
 ['Standing still is my favourite player input.','Your retreat has complicated the diagram.','I booked that empty space for a human.',
  'The shelf is leaving before you are.','My second forecast has learned the same wrong lesson.','Please stop leaving the predicted location.',
  'The landing approval was issued before your jump.','The bridge accepts objections for a limited time.','I moved the flag. Surely that fixes the incident.',
  'No movement was the official recommendation.','My confidence has survived another empty target.','The exit was not mentioned in my forecast.'],
 ['I approved the first landing in isolation.','Your feet have found the missing second opinion.','That little stop is upsetting the paperwork.',
  'The receipt has joined the landing committee.','I assumed you would hold the button forever.','The safe strip is smaller than my confidence.',
  'One jump has created another jump request.','Your brakes were not in the tutorial budget.','The express route has a second step.',
  'I printed your receipt on unusually heavy paper.','The next landing has requested a different human.','The second problem came with the first solution.'],
 ['The doorway has borrowed the floor permit.','You may rewrite the department currently in reach.','Your bridge is no longer our bridge.',
  'The wall is briefly open to your argument.','Both permissions were approved at different times.','You brought the bridge to a wall discussion.',
  'The permanent midpoint has refused a deadline.','My exit prediction forgot to ask you.','The door cannot remain reasonable indefinitely.',
  'The permit is being delivered to your head.','Your access has exceeded my expectations.','The exit department will deny knowing you.'],
 ['The stamp was the most reliable part.','Your progress is somewhere below the brochure.','The lower shelf has caught a management error.',
  'My save service stores only the word saved.','The repair tag is accepting strongly worded taps.','That return trip was omitted from the estimate.',
  'The floor has been restored against my advice.','Your attempt is alive. My speech was premature.','I saved the paperwork before checking the surface.',
  'The receipt confirms that something happened.','You recovered more than I intended to allow.','Your complaint has successfully returned to reception.'],
 ['The queue is an arrangement of future victims.','A personal receipt should arrive personally.','The faster route skips a useful paragraph.',
  'Waiting worked until delivery found your address.','Your location has been forwarded to the printer.','The next customer is trying to leave.',
  'The upper papers are not a customer service promise.','I predicted a more cooperative shopper.','Your refund is one very irritated computer.',
  'Express means the notice reaches you sooner.','Please collect the final denial on your way out.','The queue has failed to retain another customer.'],
 ['This signature expires before the ink does.','The next form requires the previous floor.','A spare approval would have been extravagant.',
  'You may transfer the argument after landing.','The stamp is optional. The envy is automatic.','The normal exit has no interest in your bonus.',
  'I called the upper desk impossible for morale.','The review has requested one more empty target.','Your paperwork is taking a suspiciously useful shape.',
  'That final scan is a formality with teeth.','You have enough signatures to inconvenience me.','I will invent another form after you leave.'],
 ['I remember the danger at an approximate altitude.','The flag is present in spirit and wrong in detail.','Jumping has been referred to upstairs security.',
  'Downstairs has a separate opinion about your feet.','My memory is clear about being confident.','The flag department remembers a different meeting.',
  'The warning moved because the notes looked untidy.','A missing flag has no legal meaning.',
  'Your next position is easier to delete than remember.','I filed the receipt near the remembered incident.','The safe landing has declined my recollection.','Your memory keeps disagreeing with the map.'],
 ['The word final is being used optimistically.','One last department would like to reject you.','This save is final until the floor disagrees.',
  'My final forecast has the same old problem.','You are approaching the end of my prepared excuses.','The last receipt is heavier than the earlier promises.',
  'That retreat was not approved for the finale.','The recovery shelf has interrupted my conclusion.','The final landing has one additional comment.',
  'I have marked the exit as an embarrassing exception.','The test ends when I run out of document.','Your escape has made the whole presentation awkward.']
];
const DEMO_LOSSES=[
 'That take has been filed under excellent training material.','The AI would like to use a different camera angle.',
 'Your complaint has arrived with a practical demonstration.','I recommend keeping the part just before the mistake.',
 'That was a very persuasive objection to my instructions.','The route remains available for another difficult conversation.',
 'My notes say that went according to plan. My notes are unreliable.','Your next attempt may include a slightly better landing.',
 'The machine has mistaken your frustration for useful feedback.','I have credited myself with an unusually successful hazard.',
 'The incident has received a confident and useless explanation.','Your attempt has been returned for one small correction.',
 'I have saved the excuse. The helpful part was not retained.','The footage will show that I was certain throughout.',
 'The next take should contain less agreement with the AI.','Your complaint is valid. Please resubmit while standing.',
 'I would like to blame the controls. They appear to be working.','That result has been classified as an optional demonstration.',
 'The route is beatable. Your last plan has volunteered for revision.','I expected a human here. I did not promise a helpful expectation.',
 'Your next attempt has inherited a very questionable warning.','The flag department will remember approximately where this happened.',
 'Please do not confuse my confidence with a warranty.','That was close enough to annoy both of us.',
 'The paper has completed its review of your timing.','You have supplied another reason to distrust the narrator.',
 'I have called this a rehearsal to protect the statistics.','Your objection has been logged beneath the missing floor.',
 'The machine requests a retake with a less observant player.','You found the part my instructions carefully left out.',
 'The exit is still accepting successful arguments.','I have learned a location. Accuracy will be considered separately.'
];
for(const [i,l] of DEMO_LEVELS.entries()){
 l.number=i+1;l.voice=DEMO_VOICE[i];l.incidentCard={job:l.title,trouble:l.focus,notice:l.goal,remember:'Demo '+l.number+' of '+DEMO_LEVELS.length+'. Practice only.',counterplay:'Move, Jump and Rewrite. Pause to read the actual warnings.',excuse:[
  'The AI claims it predicted your disagreement.','The landing committee insists that you stopped without authorization.',
  'Access says every missing permission was somebody else\'s responsibility.','The save stamp claims it meant to preserve your determination.',
  'Customer service says successful departure is not evidence of good service.','The signature department has called your escape a filing error.',
  'The AI remembers winning this one. The output says otherwise.','The final report has omitted the part where you won.'
 ][i]};
 BACKGROUND_QUIPS.levels[l.title]=l.voice;ALL_REMARK_POOLS[l.serverId]=l.voice;ALL_REMARK_POOLS[l.serverId+'-loss']=DEMO_LOSSES;
}
Object.assign(remarkCounts,loadRemarkCounts());
function startDemo(id){if(campaignBlocked())return false;const level=DEMO_LEVELS.find(l=>l.serverId===id);return level?startRageLevel(level):false}
const SHORT_RECORDING_ORDER=['demo-do-not-move','demo-saved-probably','demo-memory-not-found'];let demoShorts=false;
function nextDemo(){if(!L.demo||state!=='won')return false;const next=demoShorts?DEMO_LEVELS.find(l=>l.serverId===SHORT_RECORDING_ORDER[SHORT_RECORDING_ORDER.indexOf(L.serverId)+1]):DEMO_LEVELS[L.number];if(next)return startDemo(next.serverId);openCampaignMenu('demos');return true}
function demoCue(){
 const a=rageLab.activeRewrite;if(a&&a.until>sceneTime)return a.kind.toUpperCase()+' · '+(a.until-sceneTime).toFixed(1)+'s · one active Rewrite';
 const b=L.betrayal;
 if(b&&player.x>b.x-190&&player.x<b.x+650){
  if(rageLab.repaired)return 'FLOOR REPAIRED · the far end still has a gap.';
  if(rageLab.deleted)return 'ATTEMPT STILL ALIVE · lower shelf, return left, repair tag.';
  if(rageLab.startedAt!==null)return 'PAPER DELETES IN '+Math.max(0,b.delay-sceneTime+rageLab.startedAt).toFixed(1)+'s';
 }
 for(const n of L.blocks){const z=trap[n.id];if(z.phase==='armed')return (n.commit?'PERSONAL DELIVERY · TARGET LOCKED · ':'NOTICE FALLS IN ')+Math.max(0,z.t-sceneTime).toFixed(1)+'s';}
 return L.goal;
}
function finishDemo(){
 $('ovTitle').textContent='DEMO '+L.number+' / '+L.title+' / ESCAPED';
 $('ovDesc').textContent=totalDeaths+' deaths · '+attempts[room]+' take'+(attempts[room]===1?'':'s')+' · '+roomElapsed.toFixed(1)+'s in this demo. '+(L.mastery?(rageLab.stamp?'Impossible stamp earned. ':'Optional stamp skipped. '):'')+'AI excuse: '+L.incidentCard.excuse;
 $('labWinActions').hidden=false;if(typeof mobilePaused!=='undefined')recordMobileIncident(L.title,L.incidentCard.excuse);
}
function renderDemoPlaylist(){
 const node=$('campaignDemoList');if(!node?.replaceChildren)return;
 node.replaceChildren(...DEMO_LEVELS.map(l=>{const b=document.createElement('button');b.type='button';b.dataset.demo=l.serverId;
  const title=document.createElement('strong'),text=document.createElement('span');title.textContent=String(l.number).padStart(2,'0')+' · '+l.title;text.textContent=l.focus;b.append(title,text);b.onclick=()=>startDemo(l.serverId);return b}));
}
let demoRecording=false;
function toggleDemoRecording(value=!demoRecording){
 if(typeof mobilePaused!=='undefined')return;
 demoRecording=!!value;document.body?.classList.toggle('recording-view',demoRecording);
 if($('demoRecording')){$('demoRecording').textContent=demoRecording?'Exit recording view':'Recording view';$('demoRecording').setAttribute?.('aria-pressed',String(demoRecording));}
}
function installDemoUI(){
 $('openDemos').onclick=()=>openCampaignMenu('demos');$('demoNext').onclick=nextDemo;
 if($('demoRecording'))$('demoRecording').onclick=()=>toggleDemoRecording();
 document.addEventListener('DOMContentLoaded',()=>{
  const q=new URLSearchParams(location.hash.slice(1)),id=q.get('demo');
  demoShorts=q.get('shorts')==='1';
  const server=q.get('campaign');
  if(!DEMO_LEVELS.some(l=>l.serverId===id)&&!DATA_CENTER_LEVELS.some(l=>l.serverId===server))return;
  if(q.get('record')==='1')toggleDemoRecording(true);
  if(id)startDemo(id);else startCampaignServer(server,q.get('practice')==='1');
 });
}
window.__DEMO_TEST__={catalog:()=>JSON.parse(JSON.stringify(DEMO_LEVELS)),start:startDemo,next:nextDemo,record:toggleDemoRecording};
