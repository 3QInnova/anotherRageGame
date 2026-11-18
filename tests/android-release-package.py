"""Audit the actual signed Android artifacts, not only build configuration."""
from pathlib import Path
import hashlib,json,re,subprocess,zipfile
root=Path(__file__).resolve().parents[1]
out=root/'outputs/play-store'
cache=root/'apps/native/.cache/android-toolchain'
java=cache/'jdk/Contents/Home'
env=__import__('os').environ|{'JAVA_HOME':str(java),'PATH':str(java/'bin')+':'+__import__('os').environ['PATH']}
def run(*args):
    return subprocess.check_output([str(a) for a in args],env=env,text=True,stderr=subprocess.STDOUT)
apk=out/'EXCEPTION-HUMAN-1.0.0-1.apk';aab=out/'EXCEPTION-HUMAN-1.0.0-1.aab'
aapt=cache/'sdk/build-tools/36.0.0/aapt2'
badging=run(aapt,'dump','badging',apk)
assert "name='com.threeqinnova.exceptionhuman'" in badging
assert "versionCode='1' versionName='1.0.0'" in badging
assert "targetSdkVersion:'36'" in badging
assert 'application-debuggable' not in badging
manifest=run(aapt,'dump','xmltree',apk,'--file','AndroidManifest.xml')
assert re.search(r'android:allowBackup[^\n]*(?:false|0x0)\b',manifest)
assert re.search(r'android:usesCleartextTraffic[^\n]*(?:false|0x0)\b',manifest)
assert not re.search(r'android:(debuggable|testOnly)[^\n]*(?:true|0xffffffff)',manifest)
for permission in ['ACCESS_FINE_LOCATION','ACCESS_COARSE_LOCATION','READ_CONTACTS','CAMERA','RECORD_AUDIO','READ_EXTERNAL_STORAGE','WRITE_EXTERNAL_STORAGE']:
    assert permission not in badging,permission
ads=json.loads((root/'release/play-store/admob-android.json').read_text())
assert ads['appId'] in manifest
expected={n:(root/'apps/native/www'/n).read_bytes() for n in ['index.html','native-bridge.js']}
for artifact,prefix in [(apk,'assets/'),(aab,'base/assets/')]:
    with zipfile.ZipFile(artifact) as z:
        public=[n.removeprefix(prefix+'public/') for n in z.namelist() if n.startswith(prefix+'public/') and not n.endswith('/')]
        # Capacitor supplies its own cordova compatibility scripts in addition to game assets.
        assert set(public)<=set(expected)|{'cordova.js','cordova_plugins.js'},public
        for name,data in expected.items(): assert z.read(prefix+'public/'+name)==data
        config=json.loads(z.read(prefix+'capacitor.config.json'))
        assert config['appId']=='com.threeqinnova.exceptionhuman'
        assert config['android']['webContentsDebuggingEnabled'] is False
        assert config['loggingBehavior']=='none'
        assert not config.get('server',{}).get('url')
        assert not config.get('server',{}).get('allowNavigation')
        assert not any(n.endswith(('.map','.java','.keystore','.p12','.jks')) for n in z.namelist() if not n.startswith('BUNDLE-METADATA/'))
html=expected['index.html'].decode()
assert not re.search(r'__\w*TEST\w*__|__QA__|sourceMappingURL|#demo=|#cache=|#campaign=|campaignView-labs|campaignView-practice|playtestWelcome',html)
release=json.loads((root/'outputs/release/manifest.json').read_text())
assert release['campaignLevels']==['localhost-'+str(i).zfill(2) for i in range(1,21)]
assert release['challenges']==['forecast','recall','puzzle','glass']
build=(out/'production/android/app/build.gradle').read_text()
assert ads['bannerAdUnitId'] in build
assert "'LIVE_ADS', 'true'" in build
assert '3940256099942544' not in build
assert 'minifyEnabled true' in build and 'shrinkResources true' in build
assert 'Verified' in run(cache/'sdk/build-tools/36.0.0/apksigner','verify','--verbose',apk)
assert 'jar verified' in run(java/'bin/jarsigner','-verify',aab)
report={'applicationId':'com.threeqinnova.exceptionhuman','version':'1.0.0','versionCode':1,'campaignLevels':20,'approvedChallenges':4,'debuggable':False,'testHooks':False,'releaseMinification':True,'liveAdIds':True,'signedArtifacts':{p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [aab,apk]},'permissions':re.findall(r"uses-permission: name='([^']+)'",badging),'limitations':['No physical Android gameplay acceptance','AdMob store linking and readiness review pending','Play Data safety and listing submission pending']}
(out/'validation.json').write_text(json.dumps(report,indent=2)+'\n')
print('PASS Android release identity, signing, permissions, content allowlist, asset equality, live IDs, and disabled debugging.')
