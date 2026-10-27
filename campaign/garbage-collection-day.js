// A standalone practice route for comparing waiting, creeping and decisive movement.
const GARBAGE_COLLECTION_LEVEL={
 title:'GARBAGE COLLECTION DAY',serverId:'garbage-collection-day',centerId:'localhost',centerNumber:1,serverNumber:'GC',campaignServer:true,idleDeletionTrial:true,
 start:380,exit:8750,width:8900,longSession:true,sectionLabel:'FACILITIES / COLLECTION ROUTE',remarkPool:'garbage-collection-background',quietAdvisories:true,
 pits:[{id:'gc-gap-1',x:1250,w:80},{id:'gc-gap-2',x:3500,w:84},{id:'gc-gap-3',x:4300,w:92},{id:'gc-gap-4',x:6500,w:84},{id:'gc-gap-5',x:7400,w:88}],
 crumble:[],spikes:[],blocks:[],forecasts:[],anomalies:[],secretPads:[],floorHints:[],autocompleteHints:[],fake:null,
 idleCompute:{zones:[{start:10,end:2200},{start:2700,end:5100},{start:5600,end:8300}],bays:[{start:2200,end:2700},{start:5100,end:5600},{start:8300,end:8900}]},
 returnPoints:[380,1500,2360,2840,3750,4550,5260,5740,6760,7680,8500],
 intro:'Garbage Collection Day. Stand here to watch the idle warning, then outrun cleanup. Green bays stop deletion. Pause freezes everything.',
 incidentCard:{job:'Garbage Collection Day',trouble:'Facilities treats a quiet workspace as permission to shred it.',
  notice:'Idle floor stamps become a six-second cleanup warning. The world then disappears from the left.',
  remember:'Three collection stretches, five visible gaps, and protected green rest bays.',
  counterplay:'Try waiting at the start, creeping on the next stretch, and running on the last. Jump the visible gaps. Reach green maintenance ground to stop cleanup; Pause freezes its clock.',
  excuse:'Facilities claims you were sorted into the exit on purpose.',
  failures:['Facilities has filed your complaint under items found on the floor.','Your route was available when we last checked. We checked before cleanup.','The collection team would like you to move before becoming inventory.']}
};
function startGarbageCollectionDay(){
 if(campaignBlocked())return false;
 selectLevelCollection(true);LEVELS=[GARBAGE_COLLECTION_LEVEL];COMPACT_POINTS=[GARBAGE_COLLECTION_LEVEL.returnPoints];GLASS_TEST_INDEX=1;
 initRoom(true);campaignPractice=true;practiceMode=true;practiceRoom=0;closeCampaignMenu(true);refreshHud();
 if(typeof mobilePaused==='undefined')$('stage')?.scrollIntoView?.({block:'center'});
 return true;
}
function drawGarbageCollectionDay(){
 if(!L.idleDeletionTrial)return;
 const width=visibleWorldWidth();
 const signs=[
  {x:380,title:'01 / DESK CLEARANCE',detail:'WAIT HERE. FACILITIES WILL NOTICE.'},
  {x:2840,title:'02 / ARCHIVE QUEUE',detail:'TINY STEPS STILL USE THE SERVER.'},
  {x:5740,title:'03 / PERMANENT DELETE',detail:'USEFUL WORK KEEPS THE PAPER.'}
 ];
 for(const s of signs){
  if(s.x<cameraX-220||s.x>cameraX+width+220)continue;
  ctx.save();ctx.globalAlpha=.85;
  label(s.title,s.x,FLOOR-94,12,INK,'center');
  label(s.detail,s.x,FLOOR-76,9,'#667d6d','center');
  ctx.setLineDash([2,5]);dotline(s.x,FLOOR-64,s.x,FLOOR-12,'#8caa97');ctx.restore();
 }
}
const GARBAGE_COLLECTION_VOICE=[
 'Your desk is now a collection point.',
 'Please remove yourself before cleanup.',
 'The shredder has no undo button.',
 'Facilities counts standing as clutter.',
 'This floor is on the pickup schedule.',
 'Unused space includes your last step.',
 'We recycle paper. Confidence goes in landfill.',
 'Waiting rooms attract collectors.',
 'Keep your shoes out of the recycling.',
 'The green bay has a union rep.',
 'Your break area refused demolition.',
 'Moving forward is a valid appeal.',
 'The bin would like a word with your shoes.',
 'I booked cleanup before asking you.',
 'Please label all abandoned footsteps.',
 'You may keep the floor you are using.',
 'The cleaning crew brought a delete key.',
 'Nobody approved your standing desk.',
 'Five gaps. One very eager janitor.',
 'The exit is outside the collection zone.',
 'We found unused floor in your budget.',
 'A short walk prevents a long complaint.',
 'The paper has been warned about you.',
 'Your next step is still in stock.'
];
BACKGROUND_QUIPS.levels[GARBAGE_COLLECTION_LEVEL.title]=GARBAGE_COLLECTION_VOICE;
GARBAGE_COLLECTION_LEVEL.voice=GARBAGE_COLLECTION_VOICE;
ALL_REMARK_POOLS['garbage-collection-background']=GARBAGE_COLLECTION_VOICE;
ALL_REMARK_POOLS['garbage-collection-day-loss']=GARBAGE_COLLECTION_LEVEL.incidentCard.failures;
Object.assign(remarkCounts,loadRemarkCounts());
window.__GARBAGE_COLLECTION_TEST__={level:()=>JSON.parse(JSON.stringify(GARBAGE_COLLECTION_LEVEL))};
