import './build.mjs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { prepareIOS } from './prepare-ios.mjs';
const app=fileURLToPath(new URL('../',import.meta.url));
const r=spawnSync(process.execPath,['node_modules/@capacitor/cli/bin/capacitor','sync'],{cwd:app,stdio:'inherit'});
if(r.status!==0)process.exit(r.status??1);
prepareIOS();
