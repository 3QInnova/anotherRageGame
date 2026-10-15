import { spawnSync } from 'node:child_process';
import { prepareIOS } from './prepare-ios.mjs';
import { fileURLToPath } from 'node:url';
import { mkdirSync, openSync, closeSync, readFileSync } from 'node:fs';
const app = fileURLToPath(new URL('../', import.meta.url));
const root = fileURLToPath(new URL('../../../', import.meta.url));
const env = { ...process.env, DEVELOPER_DIR: process.env.DEVELOPER_DIR || '/Applications/Xcode.app/Contents/Developer' };
for (const args of [['scripts/build.mjs'], ['node_modules/@capacitor/cli/bin/capacitor', 'sync', 'ios']]) {
  const r = spawnSync(process.execPath, args, { cwd: app, env, stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
}
prepareIOS();
mkdirSync(root + 'outputs/capacitor', { recursive: true });
const log = root + 'outputs/capacitor/ios-build.log', fd = openSync(log, 'w');
console.log('Building iOS simulator app. Log: ' + log);
const result = spawnSync('xcodebuild', ['-project', 'ios/App/App.xcodeproj', '-scheme', 'App', '-configuration', 'Debug', '-destination', 'generic/platform=iOS Simulator', '-derivedDataPath', root + 'outputs/capacitor/DerivedData', '-clonedSourcePackagesDirPath', root + 'outputs/capacitor/SourcePackages', 'CODE_SIGNING_ALLOWED=NO', 'build'], { cwd: app, env, stdio: ['ignore', fd, fd] });
closeSync(fd);
if (result.status !== 0) { console.error(readFileSync(log, 'utf8').split('\n').slice(-65).join('\n')); process.exit(result.status ?? 1); }
console.log('Built ' + root + 'outputs/capacitor/DerivedData/Build/Products/Debug-iphonesimulator/App.app');
