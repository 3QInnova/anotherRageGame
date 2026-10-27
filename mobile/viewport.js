// One presentation model for the camera, eye, optical clues and framebuffer.
// World units and collision geometry remain in the PC source.
const mobileView={width:866,height:400,top:159,eyeX:675,eyeY:284,pixelWidth:866,pixelHeight:400,leftGuard:0,rightGuard:0};
function resizeMobileViewport(){
 layoutMobileBannerControls();
 const bounds=canvas.getBoundingClientRect?.();
 const width=bounds?.width||window.innerWidth||844,height=bounds?.height||window.innerHeight||390;
 mobileView.width=mobileView.height*width/Math.max(1,height);
 // Lower buttons set the floor. Upper side buttons get a horizontal camera guard,
 // so a stacked Rewrite does not force the whole playfield into the top half.
 const pads=[$('touchjump'),document.querySelector?.('[data-hold="right"]')].map(el=>el?.getBoundingClientRect?.().top).filter(Number.isFinite);
 const floorPixels=Math.max(height*.32,Math.min(height*.7,...pads.map(y=>y-(bounds?.top||0)-12)));
 mobileView.leftGuard=0;mobileView.rightGuard=0;
 for(const button of document.querySelectorAll('#touch button')){
  const r=button.getBoundingClientRect?.();if(!r||r.top-(bounds?.top||0)>=floorPixels)continue;
  if(r.left+(r.width/2)<width/2)mobileView.leftGuard=Math.max(mobileView.leftGuard,r.right-(bounds?.left||0)+12);
  else mobileView.rightGuard=Math.max(mobileView.rightGuard,width-(r.left-(bounds?.left||0))+12);
 }
 mobileView.leftGuard*=mobileView.height/height;mobileView.rightGuard*=mobileView.height/height;
 mobileView.top=FLOOR-mobileView.height*floorPixels/height;mobileView.floorTop=mobileView.top;
 mobileView.eyeX=mobileView.width*.78;mobileView.eyeY=mobileView.top+125;
 const ratio=Math.min(2,window.devicePixelRatio||1);
 mobileView.pixelWidth=Math.round(width*ratio);mobileView.pixelHeight=Math.round(height*ratio);
 if(canvas.width!==mobileView.pixelWidth||canvas.height!==mobileView.pixelHeight){canvas.width=mobileView.pixelWidth;canvas.height=mobileView.pixelHeight;}
 layoutMobileCoolingControls();
}
function updateCamera(){cameraX=mobileView.consolePlayerX!=null?player.x-mobileView.consolePlayerX:Math.max(-mobileView.leftGuard,Math.min(Math.max(0,L.width-mobileView.width+mobileView.rightGuard),player.x-mobileView.width*.39))}
let mobilePaintKey='',mobilePaintCount=0;
function draw(){
 // Follow the raised thermal decks so their switch panel never covers the balancing player.
 const labRise=(L.rageLab||L.counterplay)&&L.supports.some(p=>p.y<FLOOR)?Math.min(110,Math.max(0,FLOOR-player.y-PH-40)*.85):0;
 mobileView.top=(mobileView.floorTop??mobileView.top)-((L.coolingTrial||L.puzzleBoxEncounter)?Math.min(96,Math.max(0,FLOOR-player.y-PH)*(L.counterplay?.85:1.2)):labRise)+((L.betrayal||L.betrayals?.length)?Math.min(80,Math.max(0,player.y+PH-FLOOR)):0);
 if(mobileView.consoleHeadBelow!=null){
  const game=canvas.getBoundingClientRect(),scale=game.height/mobileView.height,banner=$('mobileBannerSlot').getBoundingClientRect();
  const head=Math.min(mobileView.consoleHeadBelow,banner.top-game.top-PH*scale-4);
  if((player.y-mobileView.top)*scale<head)mobileView.top=player.y-head/scale;
 }
 mobileView.eyeY=mobileView.top+125;
 const key=[backdrop?.revision,room,sceneTime,observerTime,state,player?.x,player?.y,observer?.stage,mobileView.top,mobileView.width,mobileView.pixelWidth,mobileView.pixelHeight].join('/');
 if(mobilePaused&&key===mobilePaintKey)return;
 mobilePaintKey=key;mobilePaintCount++;
 ctx.save();
 if(state==='compacting'){
  // Preserve the original fragment grid and its seeded random sequence.
  ctx.setTransform(mobileView.pixelWidth/W,0,0,mobileView.pixelHeight/H,0,0);drawCompaction();
 }else{
  ctx.setTransform(mobileView.pixelWidth/mobileView.width,0,0,mobileView.pixelHeight/mobileView.height,0,0);
  ctx.translate(0,-mobileView.top);drawDesktop();
 }
 ctx.restore();
}
function background(t){paintBackdrop(t,mobileView.width,mobileView.top,mobileView.height)}
