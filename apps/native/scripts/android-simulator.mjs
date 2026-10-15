import {spawn,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {existsSync,mkdirSync,openSync,closeSync,writeFileSync} from 'node:fs';
const app=fileURLToPath(new URL('../',import.meta.url)),root=fileURLToPath(new URL('../../../',import.meta.url));
const cache=app+'.cache/android-toolchain';
const sdk=process.env.ANDROID_HOME||cache+'/sdk',java=process.env.JAVA_HOME||cache+'/jdk/Contents/Home';
const env={...process.env,JAVA_HOME:java,ANDROID_HOME:sdk,ANDROID_USER_HOME:cache+'/user',ANDROID_AVD_HOME:cache+'/avd',PATH:java+'/bin:'+process.env.PATH};
const apk=app+'android/app/build/outputs/apk/debug/app-debug.apk',name='Exception_Human_Local',serial='emulator-5556';
const run=(file,args,extra={})=>{const r=spawnSync(file,args,{env,encoding:'utf8',...extra});if(r.status!==0)throw Error(r.stderr||r.stdout||'Failed: '+file);return r.stdout.trim()};
if(!existsSync(apk))throw Error('Run npm run android:build first.');
if(!existsSync(sdk+'/emulator/emulator')||!existsSync(sdk+'/system-images/android-36/google_apis/arm64-v8a/package.xml'))throw Error('Install the Android emulator and Android 36 Google APIs ARM64 system image first. See CAPACITOR_LOCAL_TESTING.md.');
mkdirSync(cache+'/avd',{recursive:true});mkdirSync(root+'outputs/capacitor',{recursive:true});
if(!existsSync(cache+'/avd/'+name+'.ini'))run(sdk+'/cmdline-tools/latest/bin/avdmanager',['create','avd','-n',name,'-k','system-images;android-36;google_apis;arm64-v8a','-d','pixel_7','-p',cache+'/avd/'+name+'.avd'],{input:'no\n'});
const adb=(...args)=>run(sdk+'/platform-tools/adb',['-s',serial,...args]);
const devices=run(sdk+'/platform-tools/adb',['devices']);
if(devices.includes(serial)){
 if(adb('emu','avd','name').split('\n')[0]!==name)throw Error('Emulator port 5556 belongs to another AVD; stop that emulator or choose a different port in this script.');
}else{
 const log=root+'outputs/capacitor/android-emulator.log',fd=openSync(log,'a');
 const args=['-avd',name,'-port','5556','-no-snapshot','-no-boot-anim','-gpu','swiftshader','-memory','2048'];
 if(process.argv.includes('--headless'))args.push('-no-window');
 const child=spawn(sdk+'/emulator/emulator',args,{env,detached:true,stdio:['ignore',fd,fd]});child.unref();closeSync(fd);
 console.log('Booting dedicated Android emulator. Log: '+log);
}
let ready=false;
for(let n=0;n<180;n++){
 const r=spawnSync(sdk+'/platform-tools/adb',['-s',serial,'shell','getprop','sys.boot_completed'],{env,encoding:'utf8',timeout:3000});
 if(r.stdout?.trim()==='1'){ready=true;break;}
 await new Promise(resolve=>setTimeout(resolve,1000));
}
if(!ready)throw Error('Emulator did not boot; inspect outputs/capacitor/android-emulator.log.');
adb('shell','input','keyevent','KEYCODE_WAKEUP');adb('shell','wm','dismiss-keyguard');
adb('install','-r',apk);
adb('shell','am','start','-n','com.threeqinnova.exceptionhuman.local/.MainActivity');
writeFileSync(root+'outputs/capacitor/android-simulator.json',JSON.stringify({name,serial,sdk,apk,headless:process.argv.includes('--headless')},null,2)+'\n');
console.log('Installed and launched on '+name+' ('+serial+').');
console.log('Stop only this emulator: '+sdk+'/platform-tools/adb -s '+serial+' emu kill');
