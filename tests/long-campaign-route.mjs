import assert from 'node:assert/strict';
// Known-answer routes use only the ordinary movement/Jump/Rewrite/Puzzle Box inputs.
// The observer peeks avoid serializing hundreds of distant traps on every fixed tick.
export function clearLongCampaign(g,{fast=true,from=null,chaseZones=false}={}){
 const l=g.check.level(),start=g.frame(),room=g.check.peek().room,markers=[],held=new Set(),chased=new Set(),noted=new Set();
 const s=()=>g.check.peek(),key=(code,down=true)=>{if(down)held.add(code);else held.delete(code);g.key(code,down)},tap=code=>{key(code);key(code,false)},mark=name=>markers.push({name,frame:g.frame()-start});
 function step(){g.check.step();assert(g.frame()-start<(chaseZones?120000:60000),'Bounded long route '+l.serverId);assert(['play','won'].includes(s().state),l.serverId+' / '+s().player.x.toFixed(1)+' / '+g.nodes.get('lossReason').textContent);
  const m=s().idle;for(const [j,z] of (m?.zones??[]).entries())if(['warning','cleanup'].includes(z.phase)&&!noted.has(j+'-'+z.phase)){noted.add(j+'-'+z.phase);mark('zone-'+j+'-'+z.phase)}
 }
 function tick(){
  const m=s().idle,z=m?.zones[m.zone],p=s().player;
  if(chaseZones&&z?.phase==='monitoring'&&!chased.has(m.zone)&&p.grounded&&p.y<450&&!m.waiting&&![...l.pits,...l.crumble,...l.spikes,...l.blocks,...(l.walls??[])].some(h=>p.x+24>h.x-25&&p.x<h.x+h.w+25)){
   chased.add(m.zone);const resume=[...held];for(const k of resume)key(k,false);let n=0;
   while(z.phase!=='cleanup'){step();assert(++n<2642,'Cleanup warning expires')}
   for(const k of resume)key(k);
  }
  step();
 }
 function until(p){let n=0;while(!p()){tick();assert(++n<4000,'Bounded interaction '+l.serverId)}}
 function walk(x){const left=s().player.x>x,code=left?'KeyA':'KeyD';key(code);until(()=>left?s().player.x<=x:s().player.x>=x);key(code,false)}
 function jumpTo(x){tap('Space');walk(x);until(()=>s().player.grounded)}
 function jump(x,end){walk(x);jumpTo(end)}
 for(const [i,b] of l.routeBeats.entries()){
  if(from!==null?i<from:b.x+({forecast:405,ambush:405,landing:280,receipt:235,handoff:420,recovery:590,entry:260,sky:150,scan:140,timed:260,secret:150,redaction:160,shifting:235,slalom:650,stairs:655,puzzle:710}[b.kind])<s().player.x)continue;
  const x=b.x,p=b.id;
  if(b.kind==='forecast'||b.kind==='ambush'){
   walk(x+34);if(s().trap[p+'-forecast'].phase==='idle'){key('KeyD');until(()=>s().trap[p+'-forecast'].phase==='armed');key('KeyD',false)}
   mark(i+'-locked');walk(x-50);mark(i+'-retreat');until(()=>s().trap[p+'-forecast'].phase==='done'&&(b.kind!=='ambush'||s().trap[p+'-intercept'].phase==='done'));tap('KeyX');walk(x-40);jumpTo(x+405);
  }
  if(b.kind==='landing'){jump(x-50,x+80);mark(i+'-landing');jump(x+90,x+280)}
  if(b.kind==='receipt'||b.kind==='shifting'){
   if(fast&&b.kind==='receipt'){jump(x-190,x-80);until(()=>s().trap[p+'-notice'].phase==='on'&&s().sceneTime-s().trap[p+'-notice'].t>=.17);jumpTo(x+130);walk(x+235);until(()=>s().player.grounded)}
   else{walk(x-170);until(()=>s().trap[p+'-notice'].phase==='done');walk(x+235)}
  }
  if(b.kind==='handoff'){walk(x-65);tap('KeyX');walk(x+255);mark(i+'-midpoint');tap('KeyX');walk(x+420)}
  if(b.kind==='recovery'){
   walk(x+140);until(()=>s().paper.recoveries[p+'-save'].caught);mark(i+'-caught');walk(x-10);jumpTo(x-110);tap('KeyX');mark(i+'-repaired');walk(x+390);jumpTo(x+590);
  }
  if(b.kind==='entry'){walk(x-12);walk(x+260)}
  if(b.kind==='sky')walk(x+150);
  if(b.kind==='scan')jump(x-50,x+140);
  if(b.kind==='timed'){walk(x-55);tap('KeyX');walk(x+260)}
  if(b.kind==='redaction')jump(x-50,x+160);
  if(b.kind==='secret')jump(x-50,x+150);
  if(b.kind==='slalom'){jump(x-50,x+140);walk(x+410);jump(x+450,x+650)}
  if(b.kind==='stairs'){jump(x-50,x+65);walk(x+95);jumpTo(x+235);jumpTo(x+425);walk(x+455);jumpTo(x+655);mark(i+'-raised-route')}
  if(b.kind==='puzzle'){
   walk(x-80);tap('Space');key('KeyD');until(()=>g.puzzle.open());key('KeyD',false);mark(i+'-puzzle');
   const box=g.puzzle.state().find(box=>box.id===g.puzzle.open());let solution;
   for(let bits=0;bits<2**box.board.count;bits++){const inputs=Array.from({length:box.board.count},(_,j)=>!!(bits&(1<<j))),v=g.puzzle.evaluate(box.board,inputs);if(v.fan&&!v.ground){solution=inputs;break}}
   assert(solution);for(let j=0;j<solution.length;j++)if(box.bits[j]!==solution[j])tap('Digit'+(j+1));tap('Enter');until(()=>g.puzzle.state().find(z=>z.id===box.id).solved);tap('Escape');
   walk(x+198);tap('Space');walk(x+670);until(()=>s().player.grounded);
  }
 }
 key('KeyD');until(()=>s().state==='won'||s().room!==room);key('KeyD',false);mark('escaped');
 assert.equal(g.state().deaths,0);const remaining=s().room===room?s().credits.balance:s().receipt.remaining;assert(remaining>0,l.serverId+' needs spare credits');
 return {id:l.serverId,fast,cleanupZones:chased.size,seconds:(g.frame()-start)/120,frames:g.frame()-start,markers,credits:remaining,events:g.route.filter(e=>e.frame>=start).map(e=>({...e,frame:e.frame-start}))};
}
