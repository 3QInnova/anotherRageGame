// Authored, isolated feedback routes. All timers use the fixed simulation clock.
function rageLevel(id,title,focus,goal,props){
 return {title,serverId:id,rageLab:true,focus,goal,start:55,exit:1200,width:1320,longSession:true,quietAdvisories:true,
  sectionLabel:'FEEDBACK LAB / TRY ANOTHER APPROACH',remarkPool:id,
  pits:[],crumble:[],spikes:[],blocks:[],forecasts:[],anomalies:[],secretPads:[],floorHints:[],autocompleteHints:[],supports:[],fake:null,
  returnPoints:[55],intro:goal,...props};
}
const RAGE_LAB_LEVELS=[
 rageLevel('lab-forecast-commitment','FORECAST COMMITMENT','Bait, retreat, then rewrite the crossing.','Bait the gold target. Retreat onto solid paper. Rewrite, then cross.',{
  crumble:[{id:'lab-forecast-strip',x:350,w:135,trigger:390,delay:.75}],
  forecasts:[{id:'lab-forecast',x:390,trigger:390,w:120,lead:150,delay:.65}],
  pits:[{id:'lab-forecast-bridge',x:505,w:235,bridge:true}],
  anomalies:[{id:'lab-forecast-rewrite',kind:'bridge',x:470,y:FLOOR-33,range:190,duration:2.65}],
  spikes:[{id:'lab-forecast-scan',x:900,w:62,trigger:850,delay:.24}],requiredLeft:2,
  signs:[{x:260,text:'PERMANENT RETREAT'},{x:410,text:'FORWARD SHELF / .75s LEASE'},{x:625,text:'REWRITE AFTER THE MISS'}]}),
 rageLevel('lab-landing-review','LANDING REVIEW','Release movement during a jump, then jump again.','Jump the low scan. Release Right over the safe landing. Jump the redaction.',{
  exit:1120,width:1240,
  spikes:[{id:'lab-landing-scan',x:370,w:54,trigger:320,delay:.22},{id:'lab-landing-scan-2',x:840,w:58,trigger:790,delay:.22}],
  crumble:[{id:'lab-landing-redaction',x:500,w:125,trigger:430,delay:.4}],
  signs:[{x:458,text:'SAFE LANDING / BRAKE IN AIR'},{x:562,text:'LANDING UNDER REVIEW'}]}),
 rageLevel('lab-cancellation-receipt','CANCELLATION RECEIPT','Wait safely below, or jump across the upper route.','Wait behind the receipt, or use the raised paper for an earlier crossing.',{
  exit:1080,width:1200,receiptChoice:'lab-cancel-notice',
  blocks:[{id:'lab-cancel-notice',x:480,w:64,trigger:310,delay:.55}],
  supports:[{id:'lab-cancel-step',x:360,y:FLOOR-90,w:90,h:14},{id:'lab-cancel-landing',x:565,y:FLOOR-90,w:110,h:14}],
  signs:[{x:245,text:'GROUND ROUTE / WAIT HERE'},{x:405,text:'UPPER ROUTE / JUMP AGAIN'},{x:620,text:'EARLY CROSSING'}]}),
 rageLevel('lab-rewrite-handoff','REWRITE HANDOFF','Transfer one rewrite from the bridge to the wall.','One rewrite at a time. Cross the bridge, land, then rewrite the wall.',{
  exit:1060,width:1180,handoff:true,
  pits:[{id:'lab-handoff-gap',x:320,w:240,bridge:true}],
  wall:{id:'lab-handoff-wall',x:640,y:FLOOR-138,w:32,h:138},
  anomalies:[{id:'lab-handoff-bridge',objectId:'lab-handoff-gap',kind:'bridge',x:278,y:FLOOR-33,range:145,duration:2.6},
   {id:'lab-handoff-seal',objectId:'lab-handoff-wall',kind:'wall',x:656,y:FLOOR-69,range:150,duration:2.2}],
  spikes:[{id:'lab-handoff-scan',x:850,w:54,trigger:800,delay:.22}],
  signs:[{x:430,text:'ONE ACTIVE REWRITE'},{x:597,text:'PERMANENT MIDPOINT'},{x:715,text:'NEXT / TRANSFER THE REWRITE'}]}),
 rageLevel('lab-autosave-betrayal','AUTOSAVE BETRAYAL','Recover from a fall without losing the attempt.','The save stamp lies. Lower paper catches you. Return left and Rewrite to repair.',{
  exit:1190,width:1310,betrayal:{trigger:435,delay:.8,x:360,w:440},requiredLeft:5,
  pits:[{id:'lab-autosave-pit',x:360,w:540}],
  supports:[{id:'lab-autosave-catch',x:330,y:FLOOR+70,w:390,h:14}],
  anomalies:[{id:'lab-autosave-reset',kind:'repair',x:285,y:FLOOR-33,range:150,duration:999}],
  creditMoves:[340,750,340],
  signs:[{x:290,text:'REPAIR / X AFTER DELETION'},{x:530,text:'SAVED SUCCESSFULLY *'},{x:660,text:'* THE STAMP SAVED NOTHING'}]}),
 rageLevel('lab-confidence-review','CONFIDENCE REVIEW','Three fixed phases, each using a different learned response.','Three phases: bait and retreat, time the bridge, then control the landing.',{
  exit:2030,width:2150,review:true,requiredLeft:2,
  crumble:[{id:'lab-review-strip',x:350,w:135,trigger:390,delay:.75},{id:'lab-review-landing',x:1690,w:125,trigger:1620,delay:.4}],
  forecasts:[{id:'lab-review-forecast',x:390,trigger:390,w:120,lead:150,delay:.65}],
  pits:[{id:'lab-review-first-gap',x:505,w:235,bridge:true},{id:'lab-review-passage',x:1000,w:240,bridge:true}],
  anomalies:[{id:'lab-review-first-rewrite',kind:'bridge',x:470,y:FLOOR-33,range:190,duration:2.65},
   {id:'lab-review-passage-rewrite',kind:'bridge',x:966,y:FLOOR-33,range:145,duration:1.55}],
  spikes:[{id:'lab-review-scan',x:1560,w:54,trigger:1510,delay:.22}],
  signs:[{x:260,text:'1 / OUTSMART THE FORECAST'},{x:860,text:'BREATH POINT / PERMANENT PAPER'},{x:1110,text:'2 / TIMED PASSAGE'},{x:1400,text:'BREATH POINT / PLAN THE LANDING'},{x:1648,text:'3 / BRAKE, LAND, JUMP'}]}),
 rageLevel('lab-impossible-paperwork','IMPOSSIBLE PAPERWORK','Choose a harder branch for an optional stamp on this attempt.','The floor route reaches the exit. Climb the optional papers for the IMPOSSIBLE stamp.',{
  exit:1620,width:1740,mastery:true,
  spikes:[{id:'lab-paperwork-scan',x:360,w:58,trigger:310,delay:.22}],
  pits:[{id:'lab-paperwork-bridge',x:640,w:220,bridge:true}],
  anomalies:[{id:'lab-paperwork-rewrite',kind:'bridge',x:606,y:FLOOR-33,range:145,duration:2.3}],
  forecasts:[{id:'lab-paperwork-forecast',x:980,trigger:980,w:110,lead:150,delay:.65}],
  supports:[{id:'lab-paperwork-step',x:900,y:FLOOR-80,w:100,h:14},{id:'lab-paperwork-stamp',x:1100,y:FLOOR-130,w:120,h:14}],
  signs:[{x:950,text:'OPTIONAL / CLIMB FOR THE STAMP'},{x:1330,text:'NORMAL EXIT / STAMP NOT REQUIRED'}]}),
 rageLevel('lab-almost-admitting-it','ALMOST ADMITTING IT','See the AI acknowledge actual counterplay and deny the result.','Beat the scan, rewrite the bridge, and survive the forecast. Watch the AI make excuses.',{
  exit:1550,width:1670,showcase:true,
  spikes:[{id:'lab-admit-scan',x:340,w:60,trigger:290,delay:.22}],
  pits:[{id:'lab-admit-bridge',x:660,w:230,bridge:true}],
  anomalies:[{id:'lab-admit-rewrite',kind:'bridge',x:626,y:FLOOR-33,range:145,duration:2.3}],
  forecasts:[{id:'lab-admit-forecast',x:1100,trigger:1100,w:110,lead:145,delay:.65}],
  signs:[{x:260,text:'1 / REJECT THE SCAN'},{x:745,text:'2 / MAKE THE CLAIM WORK'},{x:1110,text:'3 / LEAVE THE FORECAST EMPTY'}]}),
 rageLevel('lab-unreliable-recall','UNRELIABLE RECALL','The combined route. The AI remembers your deaths in approximately the wrong place.','Bait, retreat, Rewrite. AI flags on later attempts can drift or go missing.',{
  exit:4780,width:4900,combined:true,unreliableFlags:true,handoff:true,showcase:true,mastery:true,requiredLeft:11,
  receiptChoice:'recall-receipt',stampTarget:{supportId:'recall-stamp',forecastId:'recall-last-forecast'},
  betrayal:{trigger:2655,delay:.8,x:2580,w:440},
  crumble:[{id:'recall-first-strip',x:350,w:135,trigger:390,delay:.75},
   {id:'recall-first-landing',x:1100,w:125,trigger:1030,delay:.4},
   {id:'recall-last-strip',x:3500,w:135,trigger:3540,delay:.75},
   {id:'recall-last-landing',x:4430,w:125,trigger:4360,delay:.4}],
  forecasts:[{id:'recall-first-forecast',x:390,trigger:390,w:120,lead:150,delay:.65},
   {id:'recall-last-forecast',x:3540,trigger:3540,w:120,lead:150,delay:.65}],
  pits:[{id:'recall-first-bridge',x:505,w:235,bridge:true},{id:'recall-handoff-bridge',x:1800,w:240,bridge:true},
   {id:'recall-save-pit',x:2580,w:540},{id:'recall-last-bridge',x:3655,w:235,bridge:true}],
  spikes:[{id:'recall-first-scan',x:970,w:54,trigger:920,delay:.22},{id:'recall-last-scan',x:4300,w:54,trigger:4250,delay:.22}],
  blocks:[{id:'recall-receipt',x:1430,w:64,trigger:1260,delay:.55}],
  wall:{id:'recall-handoff-wall',x:2120,y:FLOOR-138,w:32,h:138},
  anomalies:[{id:'recall-first-rewrite',objectId:'recall-first-bridge',kind:'bridge',x:470,y:FLOOR-33,range:190,duration:2.65},
   {id:'recall-handoff-rewrite',objectId:'recall-handoff-bridge',kind:'bridge',x:1758,y:FLOOR-33,range:145,duration:2.6},
   {id:'recall-wall-rewrite',objectId:'recall-handoff-wall',kind:'wall',x:2136,y:FLOOR-69,range:150,duration:2.2},
   {id:'recall-repair',kind:'repair',x:2505,y:FLOOR-33,range:150,duration:999},
   {id:'recall-last-rewrite',objectId:'recall-last-bridge',kind:'bridge',x:3620,y:FLOOR-33,range:190,duration:2.65}],
  supports:[{id:'recall-receipt-step',x:1310,y:FLOOR-90,w:90,h:14},{id:'recall-receipt-landing',x:1515,y:FLOOR-90,w:110,h:14},
   {id:'recall-catch',x:2550,y:FLOOR+70,w:390,h:14},{id:'recall-stamp-step',x:3935,y:FLOOR-80,w:100,h:14},
   {id:'recall-stamp',x:4135,y:FLOOR-130,w:120,h:14}],
  signs:[{x:240,text:'1 / BAIT. RETREAT. DISAGREE.'},{x:830,text:'2 / THE LANDING IS ALSO A TRAP'},
   {x:1325,text:'WAIT BELOW / OR JUMP AGAIN ABOVE'},{x:1680,text:'3 / ONE REWRITE. TWO JOBS.'},
   {x:2075,text:'LAND HERE / THEN REWRITE WALL'},{x:2410,text:'4 / SAVED SUCCESSFULLY *'},
   {x:2775,text:'* YOU MAY NEED TO RETURN LEFT'},{x:3320,text:'5 / IT STILL THINKS YOU WILL STAY'},
   {x:4060,text:'OPTIONAL / IMPOSSIBLE STAMP'},{x:4610,text:'YOUR EXIT. MY ADMINISTRATIVE ERROR.'}]})
];
const RAGE_LAB_VOICE=[
 ['The shelf has a very short contract.','Your forecast has reserved empty space.','The retreat was not in my plan.','I charged the left arrow for dissent.','Solid paper is a good place to gloat.','The bridge is held up by your objection.','That gold box is my best bad guess.','The floor lease excludes hesitation.','Please stand where I predicted.','I deleted the shelf, not the problem.','You may return after my mistake clears.','Your escape has damaged my forecast.'],
 ['I reviewed your landing before you did.','Holding Right is a bold reading strategy.','The safe strip is accepting small stops.','Your second jump needs a first landing.','I placed a problem after the solution.','Panic has excellent forward momentum.','Your thumb may release its argument.','The landing has declined your arrival.','I assumed you would keep going.','Two jumps. One deeply offended scanner.','That little stop was not authorized.','The paper beyond the scan has opinions.'],
 ['This notice was printed on heavy paper.','The upper route was not for customers.','You may wait while the receipt settles.','The urgent message has missed its reader.','I sent this notification by gravity.','The polite route takes its time.','Your shortcut has skipped my paragraph.','The receipt has a physical attachment.','Please read the column from outside it.','I expected you on the ground floor.','The paper stairs were for decoration.','Your early arrival has upset the queue.'],
 ['One rewrite. Two things to argue with.','The midpoint is not a subscription.','Your bridge has returned to being air.','Do finish standing before transferring.','I bound the wall to a bad assumption.','Your first lie cannot hold both jobs.','The wall is temporarily reconsidering.','The bridge disliked being replaced.','Stable paper makes a useful witness.','Your transfer has invalidated my wall.','A second target is not a second budget.','Please hand off after leaving the gap.'],
 ['The stamp saved a picture of success.','Actual progress was not included.','The lower shelf has caught my mistake.','I filed your fall as a small detour.','Your complaint must return to reception.','Repair is left of the bad decision.','The saved floor has failed to load.','I kept the ink and lost the support.','That return trip is on my paperwork.','The repair tag accepts one objection.','The missing strip has been reinstated.','Please do not audit the save stamp.'],
 ['My second plan is equally confident.','Three phases. No useful conclusions.','The breath point has refused deletion.','I have escalated to another bad idea.','The next bridge expires on schedule.','Your landing will receive a review.','I changed tactics, not the evidence.','That first miss was preliminary.','The second department is also wrong.','Your third objection has been logged.','The final review has no honest ending.','I am running out of fresh excuses.'],
 ['The stamp is optional. My envy is not.','The ordinary exit accepts ordinary feet.','You climbed extra paperwork voluntarily.','No stamp is required to leave this job.','The upper desk has no extra salary.','I called it impossible before testing.','The gold box cannot reach that shelf.','This branch is entirely your idea.','The normal route is still open.','Your bonus is a very annoyed computer.','I printed the stamp to discourage you.','Extra effort has created extra evidence.'],
 ['The scanner has requested a new excuse.','I saw that. I will explain it badly.','Your bridge crossing has been disputed.','The forecast is blaming empty paper.','I almost said you did a good job.','That cancellation mark was accurate.','My next excuse is still rendering.','You have supplied inconvenient evidence.','Please stop making the controls work.','The result remains valid despite me.','I acknowledge receipt, not defeat.','You won. I am appealing the wording.'],
 ['I remember the incident. The address is less certain.','My flag is near the truth. That should count.',
  'The warning moved. The problem did not.','I forgot a flag to keep the document tidy.',
  'Your retreat keeps ruining a perfectly good prediction.','I saved the stamp. I misplaced the floor.',
  'The next department also remembers this differently.','The receipt has asked me to forget its involvement.',
  'I placed the flag from memory. Please admire the confidence.','A missing flag is not a safety certificate.',
  'The bridge contract still excludes long speeches.','The upper desk remains optional and smug.',
  'My memory has excellent approximate accuracy.','I marked somewhere in the general embarrassment.',
  'The flag department has taken an unscheduled break.','The lower shelf was not in my victory speech.',
  'Your second jump has complicated my report.','The wall has forgotten being a bridge problem.',
  'Please remain available for another wrong forecast.','The ordinary exit accepts unstamped complaints.',
  'I have moved the warning to protect my reputation.','My notes are confident about the wrong few inches.',
  'Your feet may be a better source than my flags.','This entire route was supposed to improve my statistics.']
];
const RAGE_LAB_LOSSES=[
 'The review found a human in the wrong place.', 'Your attempt has been returned with comments.',
 'I approved the plan. Gravity reviewed the details.', 'The route remains open to a better argument.',
 'Your next attempt may include the part you just learned.', 'The paper has submitted a complaint about your feet.',
 'I have marked your objection as a practical example.', 'Your explanation arrived after your landing.',
 'The warning was real. My confidence was the optional part.', 'The machine has mistaken a setback for a victory.',
 'Your timing has been referred to another department.', 'I recommend trying the useful part slightly differently.',
 'The incident report contains a very familiar human.', 'Your route needs one small and annoyingly important correction.',
 'The next attempt has inherited this valuable mistake.', 'I have filed your previous plan under evidence.',
 'The floor has rejected your latest interpretation.', 'Your appeal needs a more supported location.',
 'I supplied a problem. You supplied an impressive example.', 'The review is complete. Your route is not.',
 'Please resubmit from the beginning of this experiment.', 'My excuse has arrived before your successful attempt.',
 'Your last decision has become training material.', 'I am calling that a successful demonstration of the hazard.',
 'The paper trail ends somewhere below your expectations.', 'The machine would like to claim responsibility for this.',
 'Your attempt was nearly compatible with the instructions.', 'I have retained the warning and rejected the outcome.',
 'This result has been classified as further practice.', 'Your complaint is valid. Your position was less convincing.',
 'The next version of your plan may contain a landing.', 'I have learned nothing. You have better options.'
];
for(const [i,level] of RAGE_LAB_LEVELS.entries()){
 level.number=i+1;level.voice=RAGE_LAB_VOICE[i];
 level.incidentCard={job:level.title,trouble:level.focus,notice:level.goal,remember:'Feedback lab '+(i+1)+' of '+RAGE_LAB_LEVELS.length+'. Practice only.',counterplay:level.goal,
  excuse:['The forecast says your retreat was its idea.','The landing department denies arranging the second problem.','The receipt insists you read it while passing.','The wall says it was always a doorway.','The save stamp has declined to save this conversation.','The review has concluded that all three departments were correct.','The impossible stamp has been reclassified as routine paperwork.','The AI admits the result and disputes the word defeated.','The AI remembers winning. The exit has supplied contrary evidence.'][i]};
 BACKGROUND_QUIPS.levels[level.title]=level.voice;ALL_REMARK_POOLS[level.serverId]=level.voice;ALL_REMARK_POOLS[level.serverId+'-loss']=RAGE_LAB_LOSSES;
}
Object.assign(remarkCounts,loadRemarkCounts());
let rageLab=null;
function isPaperRoute(){return !!(L.rageLab||L.counterplay)}
function paperRecoveries(){return L.betrayals??(L.betrayal?[L.betrayal]:[])}
function paperRecoveryState(b){return L.betrayals?rageLab.recoveries[b.id]:rageLab}
function paperRecoveryFor(a){return paperRecoveries().find(b=>b.id===a.objectId)??L.betrayal}
function paperRepairActive(id){const b=paperRecoveries().find(b=>b.id===id)??L.betrayal;return !!(b&&rageLab&&paperRecoveryState(b).repaired)}
// A separate cosmetic generator: recalling a death never changes a trap or compaction seed.
let rageRecall=null,rageRecallSeed=1;
function recallRandom(){rageRecallSeed=(Math.imul(rageRecallSeed,1664525)+1013904223)>>>0;return rageRecallSeed/4294967296}
function resetRageRecall(full,reason){
 if(!L.unreliableFlags){rageRecall=null;return}
 if(full||rageRecall?.levelId!==L.serverId){rageRecall={levelId:L.serverId,known:[],flags:[],revision:0};rageRecallSeed=(Math.random()*4294967296)>>>0}
 rageRecall.flags=[];rageRecall.revision++;
 for(const note of rageRecall.known){
  // The first retry after discovering a hazard always shows a flag. Later recall can fail.
  const show=!note.shown||recallRandom()>=.28;
  if(!show)continue;
  const offset=(recallRandom()<.5?-1:1)*(30+recallRandom()*50);
  rageRecall.flags.push({id:note.id,x:Math.max(L.start+25,Math.min(L.exit-25,note.x+offset)),offset});note.shown=true;
 }
}
function rememberRageHazard(id){
 if(!L.unreliableFlags||!rageRecall)return false;
 const hazard=[...L.crumble,...L.spikes,...L.blocks,...L.pits,...L.forecasts,...(L.walls??[])].find(o=>o.id===id||'predict-'+o.id===id)
  ??(id==='wall-'+room?L.wall:null);
 if(!hazard)return true;
 const z=trap[hazard.id],x=(z?.x??hazard.x)+hazard.w/2;
 const note=rageRecall.known.find(n=>n.id===hazard.id);
 if(note){note.x=x;note.hits++}else rageRecall.known.push({id:hazard.id,x,hits:1,shown:false});
 return true;
}
function drawRageRecall(){
 if(!rageRecall)return;
 for(const f of rageRecall.flags){
  if(!paperInView(f))continue;
  const y=FLOOR-66;
  ctx.save();ctx.strokeStyle='#82698c';ctx.fillStyle='#f1e6ef';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(f.x,FLOOR-2);ctx.lineTo(f.x,y);ctx.lineTo(f.x+53,y+2);ctx.lineTo(f.x+45,y+14);ctx.lineTo(f.x+53,y+27);ctx.lineTo(f.x,y+25);ctx.fill();ctx.stroke();
  label('AI FLAG?',f.x+26,y+17,9,'#745681','center');ctx.setLineDash([2,4]);dotline(f.x-8,FLOOR-2,f.x+8,FLOOR-2,'#82698c');ctx.restore();
 }
}
function startRageLab(id){
 if(campaignBlocked())return false;
 const level=RAGE_LAB_LEVELS.find(l=>l.serverId===id);if(!level)return false;
 return startRageLevel(level);
}
function startRageLevel(level){
 selectLevelCollection(false);LEVELS=[level];COMPACT_POINTS=[level.returnPoints];GLASS_TEST_INDEX=1;
 initRoom(true);campaignPractice=true;practiceMode=true;practiceRoom=0;closeCampaignMenu(true);refreshHud();
 if(typeof mobilePaused==='undefined')$('stage')?.scrollIntoView?.({block:'center'});
 return true;
}
function resetRageLab(full=false,reason='retry'){resetRageRecall(full,reason);resetCacheEcho(full);rageLab=isPaperRoute()?{events:[],activeRewrite:null,feedback:null,startedAt:null,deleted:false,repaired:false,caught:false,stamp:false,earlyCrossing:false,previousX:L.start,recoveries:Object.fromEntries((L.betrayals??[]).map(b=>[b.id,{startedAt:null,deleted:false,repaired:false,caught:false}]))}:null;refreshRageLab()}
function rageTargetAvailable(a){if(a.kind!=='repair')return true;const b=paperRecoveryFor(a),r=b&&rageLab?paperRecoveryState(b):null;return !!(r?.deleted&&!r.repaired)}
function rageRewriteActive(kind,id){
 const a=rageLab?.activeRewrite;
 return !!(a&&a.kind===kind&&a.until>sceneTime&&(!id||a.id===id||a.objectId===id));
}
function rageRewrite(a){
 if(!isPaperRoute()||(!L.handoff&&a.kind!=='repair'))return false;
 if(!spendCredit('rewrites'))return true;
 if(a.kind==='repair'){
  const b=paperRecoveryFor(a);paperRecoveryState(b).repaired=true;labRecord(L.betrayals?'repair-'+b.id:'repair','FLOOR REPAIRED / SAVED FOR REAL','rewrite');
  say('The floor is repaired. Jump from its far end across the remaining gap.','warn');return true;
 }
 glitch={};glitch[a.kind]=sceneTime+a.duration;
 rageLab.activeRewrite={id:a.id,objectId:a.objectId,kind:a.kind,until:sceneTime+a.duration};
 soundCue('rewrite');addBurst(a.x,a.y,CYAN,10);
 say(nextRemark(a.kind==='wall'?'rewrite-wall':'rewrite-bridge'),'warn');return true;
}
function labRecord(id,text,cue='survived'){
 if(!rageLab||rageLab.events.some(e=>e.id===id))return;
 rageLab.events.push({id,text,time:sceneTime});rageLab.feedback={text,until:sceneTime+2.1};soundCue(cue);
 if(L.showcase){
  if(id.startsWith('scan-'))reactToSuccess('lab',id);
  const event=id.startsWith('scan-')?'scan':id.startsWith('bridge-')?'bridge':id.startsWith('caught')?'caught':id.startsWith('repair')?'repair':id==='stamp'?'stamp':id==='receipt-crossing'?'receipt':'forecast';
  observer.response=nextRemark('event-'+event);
  refreshObserver();say(observer.response);
 }
 announce(text);
}
function advanceRageLab(){
 if(!rageLab)return;
 for(const b of paperRecoveries()){const r=paperRecoveryState(b);if(r.repaired)continue;
  if(L.counterplay&&r.startedAt===null&&player.x>b.x+b.w+100){r.startedAt=-1;r.deleted=true;continue}
  if(r.startedAt===null&&player.x+PW/2>=b.trigger){r.startedAt=sceneTime;say('SAVE STAMP INVALID. Paper deletion in '+b.delay.toFixed(1)+' seconds. Lower return shelf below.','warn');soundCue('warning')}
  if(r.startedAt!==null&&sceneTime-r.startedAt>=b.delay)r.deleted=true;
 }
}
function rageSupports(){
 if(!isPaperRoute())return [];
 return [...L.supports,...paperRecoveries().filter(b=>{const r=paperRecoveryState(b);return !r.deleted||r.repaired}).map(b=>({id:b.id??'lab-autosave-paper',x:b.x,y:FLOOR,w:b.w,h:12}))];
}
function hitRageSides(oldX){
 for(const g of rageSupports()){
  if(player.y+PH<=g.y+.001||player.y>=g.y+g.h-.001)continue;
  if(player.vx>0&&oldX+PW<=g.x+.001&&player.x+PW>g.x)player.x=g.x-PW;
  else if(player.vx<0&&oldX>=g.x+g.w-.001&&player.x<g.x+g.w)player.x=g.x+g.w;
 }
}
function landOnRageSupport(oldY){
 let support=null,ceiling=null;
 for(const g of rageSupports()){
  if(player.x+PW<=g.x+.001||player.x>=g.x+g.w-.001)continue;
  if(player.vy>=0&&oldY+PH<=g.y+.001&&player.y+PH>=g.y&&(!support||g.y<support.y))support=g;
  if(player.vy<0&&oldY>=g.y+g.h-.001&&player.y<=g.y+g.h&&(!ceiling||g.y+g.h>ceiling.y+ceiling.h))ceiling=g;
 }
 if(ceiling){player.y=ceiling.y+ceiling.h;player.vy=0;player.coyote=0;player.jumpBuffer=0}
 if(support){player.y=support.y-PH;player.vy=0;return true}return false;
}
function checkRageLab(){
 if(!rageLab)return;
 for(const f of L.forecasts)if(trap[f.id].phase==='done'&&trap[f.id].resultUntil)labRecord('miss-'+f.id,'PREDICTION CANCELLED / HUMAN STILL HERE');
 for(const s of L.spikes)if(player.x>s.x+s.w+10&&player.grounded&&trap[s.id].phase==='on')labRecord('scan-'+s.id,'SCAN REJECTED / LANDING ACCEPTED');
 for(const p of L.pits.filter(p=>p.bridge))if(rageLab.previousX<p.x+p.w&&player.x>=p.x+p.w&&active('bridge',p.id))labRecord('bridge-'+p.id,'ASSERTION HELD / CROSSING COMPLETE');
 for(const b of paperRecoveries()){const r=paperRecoveryState(b);if(player.grounded&&player.y+PH>FLOOR+40&&player.x+PW>b.x-40&&player.x<b.x+b.w&&!r.caught){r.caught=true;labRecord(L.betrayals?'caught-'+b.id:'caught','ATTEMPT STILL ALIVE / RETURN LEFT');say('The lower shelf caught you. Jump back onto the left bank, then Rewrite the repair tag.','warn')}}
 const receipt=L.blocks.find(b=>b.id===L.receiptChoice);
 if(receipt&&player.x>receipt.x+receipt.w&&!rageLab.events.some(e=>e.id==='receipt-crossing')){
  rageLab.earlyCrossing=trap[receipt.id].phase!=='done';labRecord('receipt-crossing',rageLab.earlyCrossing?'EARLY CROSSING / RECEIPT SKIPPED':'CAUTIOUS CROSSING / RECEIPT CLEARED');
 }
 const stamp=rageStampSupport();
 if(L.mastery&&!rageLab.stamp&&player.grounded&&Math.abs(player.y+PH-stamp.y)<.1&&player.x+PW>stamp.x&&player.x<stamp.x+stamp.w&&trap[L.stampTarget?.forecastId??L.forecasts[0].id].phase==='done'){
  rageLab.stamp=true;labRecord('stamp','IMPOSSIBLE STAMP / EARNED','clear');say('You climbed the optional paperwork. I will call that a filing error.');
 }
 rageLab.previousX=player.x;
}
function rageStampSupport(){return L.mastery?(L.supports.find(p=>p.id===L.stampTarget?.supportId)??L.supports[1]):null}
function finishRageLab(){
 if(!L.rageLab||!rageLab)return;
 if(L.demo){finishDemo();return}
 $('ovTitle').textContent=L.title+' / COMPLETE';
 const bonus=L.mastery?' Optional stamp: '+(rageLab.stamp?'EARNED.':'skipped; the exit still counts.'):
  L.serverId==='lab-cancellation-receipt'?' Route: '+(rageLab.earlyCrossing?'early upper crossing.':'cautious ground crossing.'):
  L.betrayal?' Recovery: '+(rageLab.caught?'lower shelf used.':'fall avoided.') : '';
 $('ovDesc').textContent=L.focus+' '+totalDeaths+' deaths. '+credits.balance+' credits left.'+bonus+' AI excuse: '+L.incidentCard.excuse;
 $('labWinActions').hidden=false;
 if(typeof mobilePaused!=='undefined')recordMobileIncident(L.title,L.incidentCard.excuse);
}
function rageLabCue(){
 if(!rageLab)return '';
 const forecast=forecastFeedback();if(['locked','purge'].includes(forecast.phase))return forecast.text;
 if(L.demo)return demoCue();
 if(L.combined){
  const a=rageLab.activeRewrite,live=a&&a.until>sceneTime?a.kind.toUpperCase()+' · '+(a.until-sceneTime).toFixed(1)+'s · ':'';
  if(player.x<800)return live+'1/5 · Bait, retreat, then cross.';
  if(player.x<1650)return '2/5 · Brake into the landing. Receipt: wait below or jump again above.';
  if(player.x<2350)return live+'3/5 · Cross, land, then transfer Rewrite to the wall.';
  if(player.x<3250){if(rageLab.repaired)return '4/5 · REPAIRED. Jump the remaining gap from the far end.';if(rageLab.deleted)return '4/5 · ATTEMPT ALIVE. Return left and Rewrite the repair tag.';if(rageLab.startedAt!==null)return 'PAPER DELETES IN '+Math.max(0,L.betrayal.delay-sceneTime+rageLab.startedAt).toFixed(1)+'s';return '4/5 · The save stamp lies. Lower paper catches you.';}
  return live+(player.x<3950?'5/5 · Bait and retreat again.':rageLab.stamp?'STAMP EARNED · Brake, land, jump. Exit ahead.':'Optional upper stamp. Then brake, land, jump to the exit.');
 }
 if(L.betrayal){if(rageLab.repaired)return 'REPAIRED / jump the final gap from the far end.';if(rageLab.deleted)return 'RETURN LEFT / jump up, then Rewrite the repair tag.';if(rageLab.startedAt!==null)return 'PAPER DELETES IN '+Math.max(0,L.betrayal.delay-sceneTime+rageLab.startedAt).toFixed(1)+'s';}
 if(L.handoff){const a=rageLab.activeRewrite;return a&&a.until>sceneTime?a.kind.toUpperCase()+' · '+(a.until-sceneTime).toFixed(1)+'s · one active rewrite':L.goal;}
 const liveBridge=active('bridge')?'BRIDGE · '+Math.max(0,glitch.bridge-sceneTime).toFixed(1)+'s · cross before it expires':null;
 if(L.review)return liveBridge??(player.x<800?'PHASE 1 / bait, retreat, cross':player.x<1400?'PHASE 2 / time the temporary passage':'PHASE 3 / brake, land, jump');
 if(liveBridge)return liveBridge;
 if(L.mastery)return rageLab.stamp?'STAMP EARNED / the exit is ahead':'Optional upper stamp · floor route also wins.';
 return L.goal;
}
function refreshRageLab(){
 if($('labWinActions'))$('labWinActions').hidden=!L?.rageLab||state!=='won';
 if($('demoNext'))$('demoNext').hidden=!L?.demo||state!=='won';
 if($('labRetry'))$('labRetry').textContent=L?.cacheTrial?'Retry this prototype':L?.demo?'Retry this demo':'Retry this lab';
 if($('labChoose'))$('labChoose').textContent=L?.cacheTrial?'Cache prototypes':L?.demo?'Demo playlist':'Choose another lab';
 const panel=$('labHud');if(!panel)return;panel.hidden=!L?.rageLab||state!=='play'||campaignMenuOpen||desktopMenuOpen||(typeof mobilePaused!=='undefined'&&mobilePaused);
 if(!L?.rageLab)return;
 $('labHudTitle').textContent=(L.cacheTrial?'CACHE ':L.demo?'DEMO ':'TEST ')+L.number+'/'+(L.cacheTrial?CACHE_PROTOTYPES.length:L.demo?DEMO_LEVELS.length:RAGE_LAB_LEVELS.length)+' · '+L.title;
 $('labHudCue').textContent=rageLabCue();if($('labHudAction'))$('labHudAction').textContent=actionPrompt();
 $('labHudResult').textContent=rageLab?.feedback&&sceneTime<rageLab.feedback.until?rageLab.feedback.text:L.demo?'TAKE '+attempts[room]+' · '+roomElapsed.toFixed(1)+'s · AI FLAGS MAY LIE':L.unreliableFlags?'AI FLAGS MAY DRIFT OR GO MISSING':'';
 if($('demoNext'))$('demoNext').textContent=L.demo&&L.number===DEMO_LEVELS.length?'Back to playlist':'Next demo →';
 if($('labWinActions'))$('labWinActions').hidden=state!=='won';
}
function drawRageLab(){
 if(!rageLab)return;
 for(const p of rageSupports()){
  if(!paperInView(p))continue;
  rect(p.x,p.y,p.w,p.h,'#f7f2e5');stroke(p.x,p.y,p.w,p.h,'#6b8d7c',1.5);
  ctx.setLineDash([4,4]);dotline(p.x+4,p.y+5,p.x+p.w-4,p.y+5,'#9fae9c');ctx.setLineDash([]);
  if(paperRecoveries().length&&p.y>FLOOR)label('RETURN LEFT / THIS ATTEMPT IS STILL ALIVE',p.x+p.w/2,p.y+23,9,CYAN,'center');
 }
 for(const [i,s] of (L.signs??[]).entries())if(paperInView(s,250))label(s.text,s.x,FLOOR-172-(i%2)*25,10,INK,'center');
 for(const b of paperRecoveries()){
  if(!paperInView(b))continue;
  const r=paperRecoveryState(b),color=r.repaired?MINT:r.deleted?RED:GOLD;
  stroke(b.x,FLOOR-7,b.w,13,color,2);
  label(r.repaired?'FLOOR REPAIRED':r.deleted?'SAVE STAMP DID NOT SAVE FLOOR':'SAVED SUCCESSFULLY *',b.x+b.w/2,FLOOR-20,11,color,'center');
 }
 if(L.mastery){
  const p=rageStampSupport();stroke(p.x-2,p.y-40,p.w+4,34,rageLab.stamp?MINT:GOLD,2);
  label(rageLab.stamp?'EARNED':'IMPOSSIBLE',p.x+p.w/2,p.y-18,12,rageLab.stamp?MINT:GOLD,'center');
 }
 drawRageRecall();
 if(rageLab.feedback&&sceneTime<rageLab.feedback.until&&typeof mobileView==='undefined'){
  const x=Math.max(cameraX+155,Math.min(cameraX+(visibleWorldWidth())-155,player.x+30));
  ctx.save();ctx.globalAlpha=Math.min(1,(rageLab.feedback.until-sceneTime)*2);rect(x-150,FLOOR-230,300,26,'#e3eddc');stroke(x-150,FLOOR-230,300,26,MINT,1);label(rageLab.feedback.text,x,FLOOR-212,10,INK,'center');ctx.restore();
 }
}
function renderRageLabs(){
 const node=$('campaignLabList');if(!node?.replaceChildren)return;
 node.replaceChildren(...RAGE_LAB_LEVELS.map(level=>{const b=document.createElement('button');b.type='button';b.dataset.lab=level.serverId;
  const name=document.createElement('strong'),detail=document.createElement('span');name.textContent=String(level.number).padStart(2,'0')+' · '+level.title;detail.textContent=level.focus;b.append(name,detail);b.onclick=()=>startRageLab(level.serverId);return b}));
}
window.__RAGE_LAB_TEST__={catalog:()=>JSON.parse(JSON.stringify(RAGE_LAB_LEVELS)),state:()=>rageLab?JSON.parse(JSON.stringify(rageLab)):null,recall:()=>rageRecall?JSON.parse(JSON.stringify(rageRecall)):null,seedRecall:n=>{rageRecallSeed=n>>>0},start:startRageLab};
