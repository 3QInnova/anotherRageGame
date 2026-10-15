import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { existsSync,readFileSync } from 'node:fs';
const app = fileURLToPath(new URL('../', import.meta.url));
const local = existsSync(app+'android/local.properties')
 ? readFileSync(app+'android/local.properties','utf8').match(/^sdk.dir=(.+)$/m)?.[1]?.trim().replace(/\\(.)/g, '$1') : null;
const toolchain = app + '.cache/android-toolchain';
const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || local || (existsSync(toolchain+'/sdk') ? toolchain+'/sdk' : process.env.HOME + '/Library/Android/sdk');
const javaHome = process.env.JAVA_HOME || (existsSync(toolchain+'/jdk/Contents/Home') ? toolchain+'/jdk/Contents/Home' : undefined);
if (!existsSync(sdk + '/platforms/android-36/android.jar')) {
 console.error('Android SDK 36 is not installed. In Android Studio > SDK Manager install Android SDK Platform 36 and Build-Tools 36.0.0. Then set ANDROID_HOME or create android/local.properties with sdk.dir=<SDK path>. See CAPACITOR_LOCAL_TESTING.md.');
 process.exit(1);
}
const env = { ...process.env, ANDROID_HOME: sdk, ...(javaHome ? { JAVA_HOME: javaHome } : {}), GRADLE_USER_HOME: process.env.GRADLE_USER_HOME || toolchain+'/gradle', ANDROID_USER_HOME: process.env.ANDROID_USER_HOME || toolchain+'/user', PATH: (javaHome ? javaHome+'/bin:' : '') + process.env.PATH };
const java = spawnSync('java', ['-version'], { env, encoding:'utf8' });
const major = Number((java.stderr + java.stdout).match(/version \"(\d+)/)?.[1] || 0);
if (java.status !== 0 || major < 21) { console.error('Java 21 is required. Set JAVA_HOME to Android Studio.app/Contents/jbr/Contents/Home (or your JDK 21).'); process.exit(1); }
for (const args of [['scripts/build.mjs'], ['node_modules/@capacitor/cli/bin/capacitor','sync','android']]) {
 const r = spawnSync(process.execPath, args, { cwd: app, env, stdio:'inherit' });if(r.status!==0)process.exit(r.status??1);
}
const r = spawnSync('./gradlew', ['assembleDebug'], { cwd: app+'android', env, stdio:'inherit' });process.exit(r.status??1);
