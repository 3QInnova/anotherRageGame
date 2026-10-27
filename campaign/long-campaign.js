// Fixed act sequences and pace profiles are authored in long-localhost.json.
// Compilation lays out those exact pieces; no procedural or randomized campaign geometry.
const PAPER_ROUTE_CODES={F:'forecast',T:'ambush',L:'landing',R:'receipt',H:'handoff',V:'recovery',E:'entry',A:'sky',S:'scan',B:'timed',G:'secret',D:'redaction',Q:'shifting',J:'slalom',K:'stairs',P:'puzzle'};
const PAPER_ROUTE_END={forecast:405,ambush:405,landing:280,receipt:235,handoff:420,recovery:590,entry:260,sky:150,scan:140,timed:260,secret:150,redaction:160,shifting:235,slalom:650,stairs:655,puzzle:710};
function compileLongCampaign(catalog,recipes,voice,incidents){
 return recipes.map(recipe=>{
  const center=catalog.centers.find(c=>c.servers.some(s=>s.id===recipe.serverId)),server=center?.servers.find(s=>s.id===recipe.serverId);
  if(!center||server.status!=='playable')throw Error('Unmapped long campaign recipe '+recipe.serverId);
  let cursor=55,index=0;const beats=[],acts=[],bays=[];
  for(const [ai,act] of recipe.acts.entries()){
   const start=cursor;
   for(const code of act.sequence){
    const kind=PAPER_ROUTE_CODES[code];if(!kind)throw Error('Unknown route code '+code);
    const approach=['receipt','shifting'].includes(kind)?230:['handoff','timed','forecast','ambush','entry'].includes(kind)?160:kind==='puzzle'?180:140;
    const breath=recipe.breath[index%recipe.breath.length],x=cursor+approach+breath;
    const b={kind,x,act:ai};
    if(kind==='receipt')b.lift=[75,90,100][(index+server.number)%3];
    if(kind==='recovery')b.depth=[65,75,85][(ai+server.number)%3];
    if(kind==='shifting')b.delay=.65;
    if(kind==='puzzle')b.board=1;
    beats.push(b);cursor=x+PAPER_ROUTE_END[kind];index++;
   }
   acts.push({name:act.name,start,end:cursor});
   if(ai<recipe.acts.length-1){bays.push({start:cursor+45,end:cursor+285});cursor+=330}
  }
  const exit=cursor+250;
  const level=assemblePaperRoute(server.id,server.title.toUpperCase(),center.description,'Welcome to '+center.name+'. '+incidents[server.id].trouble,beats,{
   demo:false,rageLab:false,counterplay:true,campaignServer:true,centerId:center.id,centerNumber:center.number,serverNumber:server.number,
   role:server.role,incident:server.role==='incident',moveSpeed:recipe.moveSpeed,targetSeconds:recipe.targetSeconds,benchmarkSeconds:recipe.benchmarkSeconds,acts,
   exit,sectionLabel:center.stamp,sectionSpacing:2400,remarkPool:server.id,mcpTool:server.mcp?(server.number===10?'route.optimize':'human.contain'):null,
   voice:voice[server.id],incidentCard:{...incidents[server.id],notice:'Long route. Gold targets lock before purging. One temporary Rewrite at a time. Purple recall flags may drift or disappear.',counterplay:'Bait and retreat, use permanent paper before handing off a Rewrite, and recover from false save stamps. Green maintenance bays and Pause let you think.'},
   signs:acts.map((a,i)=>({x:a.start+80,text:(i+1)+' / '+a.name.toUpperCase()}))
  });
  level.routeBeats=beats;delete level.demoBeats;
  // Workbench decks are permanent exclusions; their heat sinks are never safe bays.
  // A return-to-repair encounter must never send the human back into an active deletion edge.
  bays.push(...level.betrayals.map(b=>({start:b.x-190,end:b.x-20})));
  bays.push(...(level.stations??[]).map(s=>({start:s.x,end:s.x+s.w})));
  const end=level.exit-140;bays.push({start:end,end:level.width});bays.sort((a,b)=>a.start-b.start);
  const zones=[];let begin=10;
  for(const b of bays){if(b.start<=begin)throw Error('Overlapping maintenance '+level.serverId);zones.push({start:begin,end:b.start});begin=b.end}
  level.idleCompute={zones,bays};
  if(recipe.warningBeforePuzzle){
   const at=beats.findIndex(b=>b.kind==='puzzle'),warning=beats[Math.max(0,at-4)].x-80,z=zones.find(z=>warning>=z.start&&warning<z.end);
   if(!z||level.stations[0].x-warning<1800)throw Error('Cooling chase needs a clear warned approach');z.warningAt=warning;z.followWarning=true;
  }
  if(recipe.markedCleanup)for(const ai of [1,3]){const a=acts[ai],z=zones.find(z=>a&&a.start+100>=z.start&&a.start+100<z.end);if(z){z.warningAt=a.start+100;z.followWarning=true}}
  level.returnPoints=[55,...bays.filter(b=>b.start<end&&!(level.stations??[]).some(s=>s.x===b.start)).map(b=>b.start+30)].filter(x=>!level.puzzleBoxEncounter||x<level.stations[0].x-80);
  return level;
 });
}
function campaignRouteTime(seconds){const n=Math.round(seconds);return Math.floor(n/60)+':'+String(n%60).padStart(2,'0')}
function campaignPaceLabel(speed){return speed<245?'measured pace':speed<265?'steady pace':speed<280?'brisk pace':'fast pace'}
