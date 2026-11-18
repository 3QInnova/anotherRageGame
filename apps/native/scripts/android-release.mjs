import {spawnSync} from 'node:child_process';
import {existsSync,mkdirSync,readFileSync,writeFileSync,cpSync,rmSync,chmodSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';
import {homedir} from 'node:os';
import path from 'node:path';
const app=fileURLToPath(new URL('../',import.meta.url)),root=path.resolve(app,'../..');
const out=path.join(root,'outputs/play-store'),dest=path.join(out,'production/android');
const cache=app+'.cache/android-toolchain',sdk=process.env.ANDROID_HOME||cache+'/sdk',java=process.env.JAVA_HOME||cache+'/jdk/Contents/Home';
const privateDir=path.join(homedir(),'.exception-human-signing');
mkdirSync(privateDir,{recursive:true,mode:0o700});
const passFile=privateDir+'/upload-password',key=privateDir+'/upload.p12';
if(!existsSync(passFile)){if(existsSync(key))throw Error('Existing key needs its password.');writeFileSync(passFile,randomBytes(32).toString('base64url'),{mode:0o600});}
const env={...process.env,JAVA_HOME:java,ANDROID_HOME:sdk,ANDROID_USER_HOME:cache+'/user',GRADLE_USER_HOME:cache+'/gradle',PATH:java+'/bin:'+process.env.PATH,EXCEPTION_UPLOAD_PASSWORD:readFileSync(passFile,'utf8').trim(),EXCEPTION_UPLOAD_KEY:key};
function run(cmd,args,cwd=app){const r=spawnSync(cmd,args,{cwd,env,stdio:'inherit'});if(r.status!==0)throw Error(cmd+' failed: '+r.status);}
if(!existsSync(key)){run(java+'/bin/keytool',['-genkeypair','-keystore',key,'-storetype','PKCS12','-storepass:env','EXCEPTION_UPLOAD_PASSWORD','-alias','exception-human-upload','-keyalg','RSA','-keysize','4096','-validity','10000','-dname','CN=3QInnova LLC, O=3QInnova LLC, C=US']);chmodSync(key,0o600);}
run(process.execPath,['scripts/build.mjs']);
run(process.execPath,['node_modules/@capacitor/cli/bin/capacitor','sync','android']);
rmSync(dest,{recursive:true,force:true});mkdirSync(dest,{recursive:true});
cpSync(app+'android',dest,{recursive:true,filter:p=>!p.split(path.sep).some(s=>['build','.gradle'].includes(s))});
const edit=(p,fn)=>writeFileSync(dest+'/'+p,fn(readFileSync(dest+'/'+p,'utf8')));
writeFileSync(dest+'/local.properties','sdk.dir='+sdk+'\n');
edit('capacitor.settings.gradle',s=>s.replaceAll("'../node_modules/", "'"+app+"node_modules/"));
const ads=JSON.parse(readFileSync(root+'/release/play-store/admob-android.json','utf8'));
edit('app/build.gradle',s=>s.replace('applicationId "com.threeqinnova.exceptionhuman.local"','applicationId "com.threeqinnova.exceptionhuman"').replace('versionName "1.0"','versionName "1.0.0"').replace('ca-app-pub-3940256099942544~3347511713',ads.appId).replace('ca-app-pub-3940256099942544/6300978111',ads.bannerAdUnitId).replace("'LIVE_ADS', 'false'","'LIVE_ADS', 'true'").replace('    buildTypes {',`    signingConfigs {
        production {
            storeFile file(System.getenv('EXCEPTION_UPLOAD_KEY'))
            storePassword System.getenv('EXCEPTION_UPLOAD_PASSWORD')
            keyAlias 'exception-human-upload'
            keyPassword System.getenv('EXCEPTION_UPLOAD_PASSWORD')
        }
    }
    buildTypes {`).replace('minifyEnabled false',"minifyEnabled true\n            shrinkResources true\n            debuggable false\n            signingConfig signingConfigs.production").replace('proguard-android.txt','proguard-android-optimize.txt'));
edit('app/src/main/AndroidManifest.xml',s=>s.replace('android:allowBackup="true"','android:allowBackup="false" android:usesCleartextTraffic="false"').replace('android:name=".MainActivity"','android:name="com.threeqinnova.exceptionhuman.local.MainActivity"'));
edit('app/src/main/res/values/strings.xml',s=>s.replaceAll('Exception Human Local','EXCEPTION: HUMAN').replaceAll('com.threeqinnova.exceptionhuman.local','com.threeqinnova.exceptionhuman'));
edit('app/src/main/assets/capacitor.config.json',s=>{const c=JSON.parse(s);c.appId='com.threeqinnova.exceptionhuman';c.appName='EXCEPTION: HUMAN';c.android.webContentsDebuggingEnabled=false;c.loggingBehavior='none';return JSON.stringify(c,null,2);});
// Explicit retention of the registered native bridge under R8; no development interface.
edit('app/proguard-rules.pro',s=>s+'\n-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }\n');
const res=dest+'/app/src/main/res';
for(const [density,size] of Object.entries({mdpi:48,hdpi:72,xhdpi:96,xxhdpi:144,xxxhdpi:192})){
 for(const name of ['ic_launcher','ic_launcher_round','ic_launcher_foreground'])run('/usr/bin/sips',['-z',String(size),String(size),root+'/assets/app-store/icon-1024.png','--out',res+'/mipmap-'+density+'/'+name+'.png']);
}
rmSync(res+'/mipmap-anydpi-v26',{recursive:true,force:true});
edit('app/src/main/res/values/styles.xml',s=>s.replace('<item name="android:background">@drawable/splash</item>','<item name="windowSplashScreenBackground">#f1e8d3</item>\n        <item name="windowSplashScreenAnimatedIcon">@mipmap/ic_launcher</item>\n        <item name="postSplashScreenTheme">@style/AppTheme.NoActionBar</item>'));
run('./gradlew',['bundleRelease','assembleRelease'],dest);
mkdirSync(out,{recursive:true});
for(const [src,name] of [['bundle/release/app-release.aab','EXCEPTION-HUMAN-1.0.0-1.aab'],['apk/release/app-release.apk','EXCEPTION-HUMAN-1.0.0-1.apk']])cpSync(dest+'/app/build/outputs/'+src,out+'/'+name);
run(java+'/bin/keytool',['-exportcert','-rfc','-keystore',key,'-storepass:env','EXCEPTION_UPLOAD_PASSWORD','-alias','exception-human-upload','-file',out+'/upload-certificate.pem']);
run('python3',[root+'/tests/android-release-package.py'],root);
console.log('Signed Android release saved to '+out+'. Keep '+privateDir+' backed up privately.');
