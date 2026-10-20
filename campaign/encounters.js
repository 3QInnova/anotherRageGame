// Pure authored-content compiler. No random geometry, DOM, network or game-state access.
function compileDataCenterServers(catalog,recipes,voice,floor,incidents){
 return recipes.map(recipe=>{
  const center=catalog.centers.find(c=>c.servers.some(s=>s.id===recipe.serverId));
  const server=center?.servers.find(s=>s.id===recipe.serverId);
  if(!server||server.status!=='playable')throw Error('Unmapped playable server '+recipe.serverId);
  const level={title:server.title.toUpperCase(),serverId:server.id,centerId:center.id,centerNumber:center.number,serverNumber:server.number,
   role:server.role,incident:server.role==='incident',campaignServer:true,start:55,extension:0,longSession:true,
   compactionAt:recipe.compactionAt,sectionLabel:center.stamp,sectionSpacing:1600,remarkPool:server.id,
   floorLies:server.number>=3,pits:[],crumble:[],spikes:[],blocks:[],forecasts:[],anomalies:[],secretPads:[],floorHints:[],autocompleteHints:[],encounters:[],fake:null,
   mcpTool:recipe.mcpTool,intro:recipe.intro,voice:voice[server.id],incidentCard:incidents[server.id]};
  let x=300;
  for(const [i,kind] of recipe.sequence.entries()){
   if(i)x+=recipe.gaps[(i-1)%recipe.gaps.length];
   const id=server.id+'-'+i;
   const h={id,kind,x,w:kind==='puzzle-box'?600:['bridge'].includes(kind)?184:kind==='redaction'?72:kind==='secret'?54:kind.includes('drop')?59:kind==='wall'?32:kind==='forecast'?86:50,
    trigger:kind.includes('drop')?x-110:kind==='air-flag'?x-190:x-44,
    delay:kind==='shifting-drop'?.65:kind==='fixed-drop'?.4:kind==='air-flag'?.55:kind==='forecast'?.55:.22,
    sky:kind==='air-flag',shifting:kind==='shifting-drop',lead:110};
   const override=recipe.overrides?.[i]||{};
   for(const [key,value] of Object.entries(override)){
    if(key==='commit'&&typeof value==='boolean'&&kind.includes('drop')){h.commit=value;continue}
    if(!['w','delay','lead','duration'].includes(key)||!Number.isFinite(value)||value<=0)throw Error('Invalid encounter override '+id);
    h[key]=value;
   }
   if(h.commit)h.trigger=x;
   if(kind==='redaction')level.crumble.push(h);
   else if(['scan','air-flag'].includes(kind))level.spikes.push(h);
   else if(kind.includes('drop'))level.blocks.push(h);
   else if(kind==='forecast'){h.trigger=x;level.forecasts.push(h)}
   else if(kind==='bridge'){
    level.pits.push({id,x,w:h.w,bridge:true});
    level.anomalies.push({id:id+'-rewrite',kind:'bridge',x:x-34,y:floor-33,range:143,duration:h.duration??2.35});
   }else if(kind==='wall'){
    if(level.wall)throw Error('Use one wall per server until multi-seal physics is authored');
    level.wall={x,y:floor-138,w:32,h:138};
    level.anomalies.push({id:id+'-rewrite',kind:'wall',x:x+16,y:floor-69,range:145,duration:2.55});
   }else if(kind==='puzzle-box'){
    const board=recipe.puzzleBox?.board;if(!Number.isInteger(board)||board<0||board>2||level.stations)throw Error('Invalid campaign Puzzle Box '+id);
    level.puzzleBoxEncounter=true;level.stations=[{id:id+'-deck',x,w:240,y:floor-80,count:[3,4,5][board],puzzle:board,sink:{x:x+300,y:floor-80,w:300,h:80}}];
   }else if(kind==='secret')level.secretPads.push(h);
   else throw Error('Unknown encounter '+kind);
   level.encounters.push(h);
   level.autocompleteHints.push({id:'advice-'+id,trigger:h.trigger-15,mode:h.sky?'JUMP':kind==='redaction'?'WALK':['WAIT','WALK','JUMP'][i%3]});
   if(level.floorLies)level.floorHints.push({x:x+280,w:64,kind:i%3===1?'suspicious':'approved'});
  }
  level.exit=x+600;level.width=level.exit+100;level.originalExit=level.exit;
  if(recipe.idleCompute){
   const config=recipe.idleCompute,rests=config.restAfter??[],zones=[],bays=[];
   let start=10;const intervals=[];
   for(const index of rests){
    const previous=level.encounters[index],next=level.encounters[index+1];
    if(!previous||!next||index!==Math.floor(index))throw Error('Invalid maintenance break '+server.id);
    const restStart=previous.x+(config.clearance??220),restEnd=next.x-(config.approach??120);
    if(restEnd-restStart<150||restStart<previous.x+previous.w+60||restEnd>next.trigger-30)throw Error('Maintenance needs clear, permanent floor '+server.id);
    intervals.push({start:restStart,end:restEnd});
   }
   for(const station of level.stations??[])intervals.push({start:station.x,end:station.x+station.w});
   for(const bay of intervals.sort((a,b)=>a.start-b.start)){
    if(bay.start<=start)throw Error('Overlapping maintenance areas '+server.id);
    zones.push({start,end:bay.start});bays.push(bay);start=bay.end;
   }
   const end=level.exit-140;
   zones.push({start,end});bays.push({start:end,end:level.width});
   if(recipe.puzzleBox){
    const at=recipe.puzzleBox.warningAt,zone=zones.find(z=>at>=z.start&&at<z.end);
    if(!Number.isFinite(at)||!zone||level.stations[0].x-at<1800)throw Error('Puzzle chase needs a warned approach '+server.id);
    zone.warningAt=at;zone.followWarning=true;
   }
   level.idleCompute={zones,bays};
  }
  // The landing after each isolated encounter is authored outside every danger region.
  level.returnPoints=[level.start,...level.encounters.map(h=>h.x+Math.max(300,h.w+100))];
  if(level.compactionAt&&level.compactionAt>=level.exit-100)throw Error('Unreachable compaction marker');
  if(!level.incidentCard?.job||level.incidentCard.failures?.length<3)throw Error('Missing incident identity '+server.id);
  if(!level.voice||level.voice.length<12)throw Error('Missing authored voice for '+server.id);
  return level;
 });
}
