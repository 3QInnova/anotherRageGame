import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { build } from 'esbuild';
const app = fileURLToPath(new URL('../', import.meta.url));
const root = fileURLToPath(new URL('../../../', import.meta.url));
const child = spawnSync('python3', ['tools/build-mobile.py'], { cwd: root, stdio: 'inherit' });
if (child.status !== 0) process.exit(child.status ?? 1);
const html = await readFile(new URL('../../../mobile/index.html', import.meta.url), 'utf8');
const adapter = await readFile(new URL('../src/game-adapter.js', import.meta.url), 'utf8');
const boot = 'installMobileUI();initRoom(true);requestAnimationFrame(frame);';
if (!html.includes(boot)) throw Error('Mobile bootstrap changed; review native adapter injection.');
const page = html
  .replace('<title>EXCEPTION: HUMAN — iPhone</title>', '<title>EXCEPTION: HUMAN — Local Phone Build</title>')
  .replace('</style>', '#mobileMenu{z-index:80}.native-app #mobileApp{height:100vh;height:100dvh}</style>')
  .replace('<script>', '<script src="native-bridge.js"></script>\n<script>')
  .replace(boot, adapter + '\ninstallMobileUI();initRoom(true);installNativeUI();requestAnimationFrame(frame);');
await mkdir(new URL('../www/', import.meta.url), { recursive: true });
await writeFile(new URL('../www/index.html', import.meta.url), page);
await build({ entryPoints: [app + 'src/bridge.js'], outfile: app + 'www/native-bridge.js', bundle: true, format: 'iife', target: ['safari15', 'chrome110'], minify: false });
await mkdir(new URL('../../../outputs/capacitor/', import.meta.url), { recursive: true });
const sha = text => createHash('sha256').update(text).digest('hex');
const desktop = await readFile(new URL('../../../initalDemoDocs/Exception_Human_Misclassification_V3.html', import.meta.url));
await writeFile(new URL('../../../outputs/capacitor/build.json', import.meta.url), JSON.stringify({ appId: 'com.threeqinnova.exceptionhuman.local', desktopSha256: sha(desktop), mobileSourceSha256: sha(html), nativePageSha256: sha(page), offlineAssets: ['index.html', 'native-bridge.js'], remoteServer: false }, null, 2) + '\n');
console.log('Built local Capacitor assets from the shared mobile game.');
