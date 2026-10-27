// Failure copy follows the actual collision/support source, never the server title.
// Narration has no authority over trap state, timing, collision boxes or retries.
for(const [family,copy] of Object.entries(FAILURE_VOICE)){
 if(copy.remarks){LOSS_REMARKS[family]=copy.remarks;ALL_REMARK_POOLS[family]=copy.remarks}
 if(copy.lines)ALL_REMARK_POOLS[family]=copy.lines;
 if(copy.causes)ALL_REMARK_POOLS['cause-'+family]=copy.causes;
}
Object.assign(remarkCounts,loadRemarkCounts());
let lastFailure=null;
function failureFamily(id='',reason='',kind=null){
 id=String(id??'');
 if(kind&&kind!=='support'&&ALL_REMARK_POOLS[kind])return kind;
 if(id==='puzzle-shock')return 'puzzle-shock';
 if(id==='cooling-shock')return 'cooling-shock';
 if(id.startsWith('cooling-'))return 'cooling-loss';
 if(id.startsWith('presence-'))return 'presence-loss';
 if(id.startsWith('compute-'))return 'idle-loss';
 if(kind!=='support'){
  const scan=L.spikes.find(s=>s.id===id);if(scan)return scan.sky?'air-scan':'scan';
  if(L.blocks.some(b=>b.id===id))return 'policy';
  if(L.forecasts.some(f=>f.id===id||'predict-'+f.id===id))return 'forecast';
  if(L.secretPads.some(p=>p.id===id))return 'secret';
  if((L.walls??[]).some(b=>b.id===id)||L.wall?.id===id)return 'wall';
 }
 if(L.crumble.some(c=>c.id===id))return 'redaction';
 const gap=L.pits.find(p=>p.id===id);
 if(gap){
  if(gap.corrupt)return 'glass';
  const recovery=paperRecoveries().find(b=>b.x===gap.x);
  if(recovery&&!paperRepairActive(recovery.id))return 'recovery';
  if((gap.bridge||['null-b','null-d'].includes(id))&&!active('bridge',id))return 'bridge';
  return 'fall';
 }
 // These prefixes belong to the original fifteen-room vocabulary, not new IDs.
 if(id.startsWith('corrupt-'))return 'glass';
 if(id.startsWith('secret-'))return 'secret';
 if(id.startsWith('predict-'))return 'forecast';
 if(id.startsWith('wall-'))return 'wall';
 if(id.startsWith('policy-'))return 'policy';
 if(id.startsWith('flag-'))return 'scan';
 if(id.startsWith('redaction-'))return 'redaction';
 if(id.startsWith('commit-'))return /TIMEOUT|lease expired/.test(reason)?'deadline':kind==='support'?'fall':'commitment-loss';
 return kind==='support'?'fall':'unknown';
}
function failureReason(family,reason){return FAILURE_VOICE[family]?.causes?nextRemark('cause-'+family):reason}
window.__FAILURE_VOICE_TEST__={last:()=>lastFailure?{...lastFailure}:null,family:failureFamily,pools:()=>JSON.parse(JSON.stringify(LOSS_REMARKS))};
