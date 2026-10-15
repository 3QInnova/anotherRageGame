import { mkdirSync, existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const app = fileURLToPath(new URL('../', import.meta.url));
const cache = app + '.cache/capacitor-swift-pm';
// Official Capacitor 8.5.3 release checksums, from its upstream Package.swift.
const artifacts = {
 Capacitor:'9316f568444411d362dcb4d1946e7572d4aef5d690c122ff6f1cb8a44a920c9f',
 Cordova:'bdcd8eab2d62a077efd76c3c8b9629e65ae7043c1462289a1e55de9be19bbf1f'
};
export function prepareIOS(){
 mkdirSync(cache,{recursive:true});
 for(const [name,checksum] of Object.entries(artifacts)){
  const zip=cache+'/'+name+'.xcframework.zip';
  if(!existsSync(zip)||createHash('sha256').update(readFileSync(zip)).digest('hex')!==checksum){
   console.log('Caching official '+name+' 8.5.3 framework...');
   const r=spawnSync('curl',['--fail','--location','--retry','2','--silent','--show-error','--output',zip,'https://github.com/ionic-team/capacitor-swift-pm/releases/download/8.5.3/'+name+'.xcframework.zip'],{stdio:'inherit'});
   if(r.status!==0)throw Error('Framework download failed: '+name);
  }
  if(createHash('sha256').update(readFileSync(zip)).digest('hex')!==checksum)throw Error('Official framework checksum mismatch: '+name);
  if(!existsSync(cache+'/'+name+'.xcframework/Info.plist')){
   rmSync(cache+'/'+name+'.xcframework',{recursive:true,force:true});
   const r=spawnSync('unzip',['-q','-o',zip,'-d',cache],{stdio:'inherit'});if(r.status!==0)throw Error('Framework extraction failed');
  }
 }
 writeFileSync(cache+'/Package.swift',`// swift-tools-version:5.9
import PackageDescription
let package = Package(name: "capacitor-swift-pm", products: [.library(name: "Capacitor", targets: ["Capacitor"]), .library(name: "Cordova", targets: ["Cordova"])], targets: [.binaryTarget(name: "Capacitor", path: "Capacitor.xcframework"), .binaryTarget(name: "Cordova", path: "Cordova.xcframework")])\n`);
 // Point the generated app package and the two plugin manifests at the verified local framework.
 // cap sync/npm ci may regenerate these; this preparation step is idempotent.
 for(const file of ['ios/App/CapApp-SPM/Package.swift','node_modules/@capacitor/app/Package.swift','node_modules/@capacitor/status-bar/Package.swift']){
  const path=app+file,s=readFileSync(path,'utf8');
  const result=s.replace(/\.package\(url: "https:\/\/github.com\/ionic-team\/capacitor-swift-pm.git", (?:exact|from): "[^"]+"\)/g,'.package(path: "../../../.cache/capacitor-swift-pm")');
  writeFileSync(path,result);
 }
 console.log('iOS uses checksum-verified local frameworks; subsequent native builds work offline.');
}
