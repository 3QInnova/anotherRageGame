import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { existsSync, writeFileSync } from 'node:fs';
const root = fileURLToPath(new URL('../../../', import.meta.url));
const env = { ...process.env, DEVELOPER_DIR: process.env.DEVELOPER_DIR || '/Applications/Xcode.app/Contents/Developer' };
const app = root + 'outputs/capacitor/DerivedData/Build/Products/Debug-iphonesimulator/App.app';
if (!existsSync(app)) throw Error('Run npm run ios:build first.');
const sim = (...args) => execFileSync('xcrun', ['simctl', ...args], { env, encoding: 'utf8' }).trim();
const devices = JSON.parse(sim('list', 'devices', 'available', '-j'));
let device = Object.values(devices.devices).flat().find(d => d.name === 'Exception Human Local');
if (!device) {
  const runtime = JSON.parse(sim('list', 'runtimes', '-j')).runtimes.filter(r => r.isAvailable && r.identifier.includes('.iOS-')).sort((a,b) => b.version.localeCompare(a.version, undefined, { numeric:true }))[0];
  if (!runtime) throw Error('Install an iOS simulator runtime in Xcode Settings > Components.');
  const udid = sim('create', 'Exception Human Local', 'com.apple.CoreSimulator.SimDeviceType.iPhone-17-Pro-Max', runtime.identifier);
  device = { udid, state: 'Shutdown' };
}
if (device.state !== 'Booted') sim('boot', device.udid);
sim('bootstatus', device.udid, '-b');
sim('install', device.udid, app);
sim('launch', device.udid, 'com.threeqinnova.exceptionhuman.local');
writeFileSync(root + 'outputs/capacitor/simulator.json', JSON.stringify({ name: 'Exception Human Local', udid: device.udid, bundleId: 'com.threeqinnova.exceptionhuman.local', app }, null, 2) + '\n');
console.log('Installed and launched on the dedicated simulator: ' + device.udid);

const gui = env.DEVELOPER_DIR + '/Applications/Simulator.app';
if (existsSync(gui)) execFileSync('open', ['-a', gui, '--args', '-CurrentDeviceUDID', device.udid], { env });
else console.log('Simulator GUI is not installed at ' + gui + '. The backend is running; ios:test can still use it.');
