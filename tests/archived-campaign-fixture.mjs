// Regression adapter for the retained SHORT Localhost comparison routes.
// Current long campaign coverage lives in long-campaign*.mjs and data-centers*.mjs.
import {readFileSync} from 'node:fs';
import {load,clear} from './data-centers.test.mjs';
const html=readFileSync(new URL('../initalDemoDocs/Exception_Human_Misclassification_V3.html',import.meta.url),'utf8');
export function archivedCampaign(source){
 const line='const DATA_CENTER_LEVELS=compileLongCampaign(DATA_CENTER_CATALOG,LONG_LOCALHOST_RECIPES,LONG_LOCALHOST_VOICE,LOCALHOST_INCIDENTS);';
 if(!source.includes(line))throw Error('Missing long campaign activation');
 return source.replace(line,'const DATA_CENTER_LEVELS=ORIGINAL_LOCALHOST_LEVELS;');
}
export function loadArchived(source=html,storage){return load(archivedCampaign(source),storage)}
export {clear};
