import {readFileSync,writeFileSync,mkdirSync,cpSync,rmSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
const root=fileURLToPath(new URL('../../../',import.meta.url));
const app=resolve(root,'apps/native');
const config=JSON.parse(readFileSync(resolve(app,'config/production.json')));
const out=resolve(root,'outputs/app-store/production');
mkdirSync(out,{recursive:true});
const dest=resolve(out,'ios');rmSync(dest,{recursive:true,force:true});
cpSync(resolve(app,'ios'),dest,{recursive:true,filter:p=>!p.includes('/xcuserdata')});
cpSync(resolve(root,'assets/app-store/icon-1024.png'),resolve(dest,'App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png'));
const launch=resolve(dest,'App/App/Base.lproj/LaunchScreen.storyboard');
writeFileSync(launch,`<?xml version="1.0" encoding="UTF-8"?>
<document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="17132" targetRuntime="iOS.CocoaTouch" useAutolayout="YES" launchScreen="YES" useSafeAreas="YES" colorMatched="YES" initialViewController="vc">
<device id="retina4_7" orientation="landscape" appearance="light"/><dependencies><plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="17105"/><capability name="documents saved in the Xcode 8 format" minToolsVersion="8.0"/></dependencies>
<scenes><scene sceneID="scene"><objects><viewController id="vc" sceneMemberID="viewController"><view key="view" contentMode="scaleToFill" id="view"><rect key="frame" x="0" y="0" width="667" height="375"/><autoresizingMask key="autoresizingMask" widthSizable="YES" heightSizable="YES"/><color key="backgroundColor" red="0.08" green="0.18" blue="0.19" alpha="1" colorSpace="custom" customColorSpace="sRGB"/><subviews><label opaque="NO" userInteractionEnabled="NO" contentMode="left" text="EXCEPTION: HUMAN" textAlignment="center" translatesAutoresizingMaskIntoConstraints="NO" id="title"><rect key="frame" x="160" y="165" width="347" height="45"/><fontDescription key="fontDescription" type="boldSystem" pointSize="28"/><color key="textColor" red="0.94" green="0.91" blue="0.83" alpha="1" colorSpace="custom" customColorSpace="sRGB"/></label></subviews><constraints><constraint firstItem="title" firstAttribute="centerX" secondItem="view" secondAttribute="centerX" id="cx"/><constraint firstItem="title" firstAttribute="centerY" secondItem="view" secondAttribute="centerY" id="cy"/></constraints></view></viewController><placeholder placeholderIdentifier="IBFirstResponder" id="first" sceneMemberID="firstResponder"/></objects></scene></scenes></document>`);
rmSync(resolve(dest,'App/App/Assets.xcassets/Splash.imageset'),{recursive:true,force:true});
const packagePath=resolve(dest,'App/CapApp-SPM/Package.swift');
writeFileSync(packagePath,readFileSync(packagePath,'utf8').replaceAll('../../../.cache/',resolve(app,'.cache')+'/').replaceAll('../../../node_modules/',resolve(app,'node_modules')+'/'));
const capPath=resolve(dest,'App/App/capacitor.config.json');
const cap=JSON.parse(readFileSync(capPath));cap.appId=config.appId;cap.appName=config.appName;writeFileSync(capPath,JSON.stringify(cap,null,2)+'\n');
const script=`import plistlib,json,sys\np=sys.argv[1]\nc=json.loads(sys.argv[2])\nwith open(p,'rb') as f:d=plistlib.load(f)\nd['CFBundleDisplayName']=c['appName']\nd['EHLiveAdsEnabled']=False\nwith open(p,'wb') as f:plistlib.dump(d,f,sort_keys=False)\n`;
const result=spawnSync('python3',['-c',script,resolve(dest,'App/App/Info.plist'),JSON.stringify(config)],{stdio:'inherit'});if(result.status)process.exit(result.status);
writeFileSync(resolve(out,'Production.xcconfig'),`PRODUCT_BUNDLE_IDENTIFIER = ${config.appId}\nMARKETING_VERSION = ${config.version}\nCURRENT_PROJECT_VERSION = ${config.build}\nDEVELOPMENT_TEAM = ${config.team}\nCODE_SIGN_STYLE = Automatic\nTARGETED_DEVICE_FAMILY = 1\n`);
writeFileSync(resolve(out,'identity.json'),JSON.stringify(config,null,2)+'\n');
console.log('Prepared isolated production project: '+dest+'; local identity and saves unchanged.');
