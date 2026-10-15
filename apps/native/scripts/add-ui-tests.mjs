import { createRequire } from 'node:module';
import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const require=createRequire(import.meta.url),xcode=require('xcode');
const dir=fileURLToPath(new URL('../ios/App/',import.meta.url)),file=dir+'App.xcodeproj/project.pbxproj',project=xcode.project(file);project.parseSync();
const first=project.getFirstTarget(),appId=first.uuid;
let entry=Object.entries(project.pbxNativeTargetSection()).find(([id,t])=>!id.endsWith('_comment')&&String(t.name).replaceAll('"','')==='NativeSmoke');
if(!entry){
 const t=project.addTarget('NativeSmoke','unit_test_bundle','NativeSmoke','com.threeqinnova.exceptionhuman.local.uitests');
 const id=t.uuid,target=t.pbxNativeTarget;target.productType='"com.apple.product-type.bundle.ui-testing"';
 // addTarget assumes app embedding; reverse that link for a proper UI-test runner dependency.
 const deps=project.hash.project.objects.PBXTargetDependency;
 first.firstTarget.dependencies=first.firstTarget.dependencies.filter(ref=>deps[ref.value]?.target!==id);
 project.addTargetDependency(id,[appId]);
 project.addBuildPhase(['NativeSmoke/NativeSmoke.swift'],'PBXSourcesBuildPhase','Sources',id);
 project.addBuildPhase([],'PBXFrameworksBuildPhase','Frameworks',id);
 project.addBuildPhase([],'PBXResourcesBuildPhase','Resources',id);
 const configs=project.pbxXCBuildConfigurationSection(),list=project.pbxXCConfigurationList()[target.buildConfigurationList];
 for(const ref of list.buildConfigurations){const b=configs[ref.value].buildSettings;delete b.INFOPLIST_FILE;Object.assign(b,{GENERATE_INFOPLIST_FILE:'YES',SWIFT_VERSION:'5.0',IPHONEOS_DEPLOYMENT_TARGET:'15.0',TARGETED_DEVICE_FAMILY:'1',TEST_TARGET_NAME:'App',CODE_SIGN_STYLE:'Automatic'});}
 project.addTargetAttribute('TestTargetID',appId,t);
 entry=[id,target];writeFileSync(file,project.writeSync());
}
const id=entry[0];mkdirSync(dir+'App.xcodeproj/xcshareddata/xcschemes',{recursive:true});
const ref=(target,name)=>`<BuildableReference BuildableIdentifier="primary" BlueprintIdentifier="${target}" BuildableName="${name}" BlueprintName="${name.replace(/\.(app|xctest)$/,'')}" ReferencedContainer="container:App.xcodeproj"/>`;
writeFileSync(dir+'App.xcodeproj/xcshareddata/xcschemes/NativeSmoke.xcscheme',`<?xml version="1.0" encoding="UTF-8"?>
<Scheme LastUpgradeVersion="2700" version="1.3"><BuildAction parallelizeBuildables="NO" buildImplicitDependencies="YES"><BuildActionEntries><BuildActionEntry buildForTesting="YES" buildForRunning="YES" buildForProfiling="NO" buildForArchiving="NO" buildForAnalyzing="YES">${ref(appId,'App.app')}</BuildActionEntry><BuildActionEntry buildForTesting="YES" buildForRunning="NO" buildForProfiling="NO" buildForArchiving="NO" buildForAnalyzing="NO">${ref(id,'NativeSmoke.xctest')}</BuildActionEntry></BuildActionEntries></BuildAction><TestAction buildConfiguration="Debug" selectedDebuggerIdentifier="Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier="Xcode.IDEFoundation.Launcher.LLDB" shouldUseLaunchSchemeArgsEnv="YES"><Testables><TestableReference skipped="NO">${ref(id,'NativeSmoke.xctest')}</TestableReference></Testables></TestAction><LaunchAction buildConfiguration="Debug" selectedDebuggerIdentifier="Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier="Xcode.IDEFoundation.Launcher.LLDB" launchStyle="0" useCustomWorkingDirectory="NO" ignoresPersistentStateOnLaunch="NO" debugDocumentVersioning="YES" debugServiceExtension="internal" allowLocationSimulation="YES"><BuildableProductRunnable runnableDebuggingMode="0">${ref(appId,'App.app')}</BuildableProductRunnable></LaunchAction><AnalyzeAction buildConfiguration="Debug"/></Scheme>\n`);
console.log('NativeSmoke UI-test scheme is ready.');
