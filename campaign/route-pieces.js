// Fixed, authored episodes. These helpers assemble paper encounters; they never roll geometry.
function assemblePaperRoute(id,title,hook,claim,beats,props={}){
 const l=rageLevel(id,title,hook,claim,{demo:true,unreliableFlags:true,handoff:true,showcase:true,
  sectionLabel:'DEMO / THE AI INSISTS THIS IS FINE',demoBeats:beats,requiredLeft:4,...props});
 if(l.counterplay){l.walls=[];l.betrayals=[];l.creditExtraActions=[]}
 for(const [i,b] of beats.entries()){
  const x=b.x,p=id+'-'+i;b.id=p;
  const bridge=(at,w,duration,range=145)=>{
   const objectId=p+'-bridge';l.pits.push({id:objectId,x:at,w,bridge:true});
   l.anomalies.push({id:p+'-rewrite',objectId,kind:'bridge',x:at-34,y:FLOOR-33,range,duration});
  };
  if(b.kind==='forecast'||b.kind==='ambush'){
   l.crumble.push({id:p+'-strip',x,w:135,trigger:x+40,delay:.75});
   l.forecasts.push({id:p+'-forecast',x:x+40,trigger:x+40,w:120,lead:150,delay:.65});
   bridge(x+155,235,2.65,190);l.anomalies.at(-1).x=x+120;l.requiredLeft+=2;
   if(b.kind==='ambush')l.blocks.push({id:p+'-intercept',x:x+90,w:70,trigger:x+40,delay:.6,commit:true,counterplayWait:true});
  }
  if(b.kind==='landing'){
   l.spikes.push({id:p+'-scan',x,w:54,trigger:x-50,delay:.22});
   l.crumble.push({id:p+'-redaction',x:x+130,w:125,trigger:x+60,delay:.4});
  }
  if(b.kind==='receipt'||b.kind==='shifting'){
   l.blocks.push({id:p+'-notice',x,w:64,trigger:x-170,delay:b.delay??.55,shifting:b.kind==='shifting'});
   if(b.kind==='receipt')l.supports.push({id:p+'-step',x:x-120,y:FLOOR-(b.lift??90),w:90,h:14},{id:p+'-landing',x:x+85,y:FLOOR-(b.lift??90),w:110,h:14});
   if(l.counterplay&&b.kind==='receipt')l.creditExtraActions.push({x,kind:'jump'},{x:x+130,kind:'jump'});
   l.receiptChoice??=p+'-notice';
  }
  if(b.kind==='handoff'){
   bridge(x,240,2.6);l.anomalies.at(-1).x=x-42;
   const wall={id:p+'-wall',x:x+320,y:FLOOR-138,w:32,h:138};
   if(l.counterplay)l.walls.push(wall);else l.wall=wall;
   l.anomalies.push({id:p+'-seal',objectId:wall.id,kind:'wall',x:x+336,y:FLOOR-69,range:150,duration:2.2});
  }
  if(b.kind==='recovery'){
   const recovery={id:p+'-save',trigger:x+75,delay:.8,x,w:440};l.requiredLeft+=5;
   if(l.counterplay){l.betrayals.push(recovery);l.creditExtraActions.push({x:x-10,kind:'jump'})}else l.betrayal=recovery;
   l.pits.push({id:p+'-save-pit',x,w:540});l.supports.push({id:p+'-catch',x:x-30,y:FLOOR+(b.depth??70),w:390,h:14});
   l.anomalies.push({id:p+'-repair',objectId:recovery.id,kind:'repair',x:x-75,y:FLOOR-33,range:150,duration:999});
  }
  if(b.kind==='entry')l.blocks.push({id:p+'-entry',x:x+60,w:70,trigger:x,delay:.65,commit:true});
  if(b.kind==='sky')l.spikes.push({id:p+'-air',x,w:78,trigger:x-50,delay:.22,sky:true});
  if(b.kind==='scan')l.spikes.push({id:p+'-scan',x,w:60,trigger:x-50,delay:.22});
  if(b.kind==='timed')bridge(x,220,1.55);
  if(b.kind==='redaction')l.crumble.push({id:p+'-redaction',x,w:96,trigger:x-44,delay:.26});
  if(b.kind==='secret')l.secretPads.push({id:p+'-secret',x,w:54,trigger:x,delay:0});
  if(b.kind==='stairs'){
   l.pits.push({id:p+'-stair-gap',x,w:600});
   l.supports.push({id:p+'-stair-1',x:x+15,y:FLOOR-65,w:100,h:14},{id:p+'-stair-2',x:x+190,y:FLOOR-100,w:110,h:14},{id:p+'-stair-3',x:x+380,y:FLOOR-60,w:110,h:14});
   if(l.counterplay)l.creditExtraActions.push(...[x+95,x+235,x+455].map(at=>({x:at,kind:'jump'})));
  }
  if(b.kind==='slalom'){
   l.spikes.push({id:p+'-low-1',x,w:54,trigger:x-50,delay:.22},{id:p+'-high',x:x+260,w:78,trigger:x+210,delay:.22,sky:true},{id:p+'-low-2',x:x+500,w:54,trigger:x+450,delay:.22});
  }
  if(b.kind==='puzzle'){
   l.puzzleBoxEncounter=true;l.stations??=[];
   l.stations.push({id:p+'-deck',x,w:240,y:FLOOR-80,count:[3,4,5,2][b.board??1],puzzle:b.board??1,sink:{x:x+300,y:FLOOR-80,w:300,h:80}});
  }
  if(b.kind==='stamp'){
   l.mastery=true;l.stampTarget={supportId:p+'-stamp',forecastId:l.forecasts.at(-1).id};
   l.supports.push({id:p+'-step',x,y:FLOOR-80,w:100,h:14},{id:p+'-stamp',x:x+200,y:FLOOR-130,w:120,h:14});
  }
 }
 l.exit=props.exit;l.width=l.exit+120;return l;
}
