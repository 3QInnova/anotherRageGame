# Local Capacitor validation — 14 October 2026

Branch: `feature/capacitor-mobile`, starting commit `c99ec99`. Local work only; no push, GitHub publication, store upload or physical-device installation was performed. No global developer-directory setting was changed. The user subsequently authorized Android toolchain installation; Java 21, SDK 36, build tools and an ARM64 Android emulator are installed in the ignored project cache. Android Studio was not installed.

## Passed

- Xcode 27.0 built the Debug iOS Simulator app successfully with signing disabled. Build command: `npm --prefix apps/native run ios:build`; log retained locally in `ios-build.log` (ignored by Git).
- Installed and launched `com.threeqinnova.exceptionhuman.local` on the dedicated **Exception Human Local** iPhone 17 Pro Max simulator running iOS 27. The Simulator GUI app is missing at its standard location on this Mac; the simulator backend and XCTest worked.
- `npm --prefix apps/native run ios:test`: native XCTest passed. It launched the actual bundled WKWebView app, checked the native-only menu text, tapped Play, opened the glass lab, sent the app to the home screen, reactivated it, verified Resume was required, resumed, and reopened Menu. See [native result](native-ui-results.json); the full `.xcresult` and logs remain local, ignored by Git.
- `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/capacitor-browser.test.mjs`: WebKit loaded bundled assets with zero remote requests and no page errors. Synthetic native events froze physics, released held input and preserved compaction. Android Back routing dismissed fake billing through its free flow; the one-per-room billing budget remained intact. The ordinary-input glass route cleared with zero deaths. See [browser result](browser-results.json). Synthetic Back events are not Android hardware validation.
- `node tests/mobile-parity.test.mjs`: **195,062** active gameplay snapshots matched PC across all fifteen rooms, including actual compaction, with zero deaths. This compares shared gameplay and does not establish native phone performance.
- The desktop HTML, mobile layout/UI sources and generated mobile HTML have no changes relative to the branch base. [Build manifest](build.json) records desktop SHA-256 `b3f520dda12487980d67a8c198fc1631f26bf7bd810121e3c137fce5e3ddd490` and mobile SHA-256 `223530f519ec2e9cde2c3cb62e1ea5bfa79b9bc33313eca5fd3ac5ee8dcaf724`.

The [simulator screenshot](iphone-simulator.png) shows the actual installed glass lab paused after returning from the background. The XCTest result includes a playing glass-lab screenshot attachment.

## Remaining hardware/toolchain checks

`npm --prefix apps/native run android:build` now succeeds: Gradle 8.14.3 built the debug APK in 49 seconds. `apksigner verify` passed with the local Android Debug certificate. Package metadata confirms the local bundle ID, minimum SDK 24 and target SDK 36. [Build/toolchain record](android-build.json).

`npm --prefix apps/native run android:sim -- --headless` created and booted the dedicated Pixel 7 **Exception_Human_Local** emulator running Android 16, using Apple's Hypervisor.Framework. `npm --prefix apps/native run android:test` passed against the installed Android WebView app: cold launch with airplane mode/Wi-Fi disabled and **no active default network**, native plugin registration, movement, background physics freeze, held-input release, Resume, real Android Back opening pause, second Back minimizing, and the glass lab. Networking was restored after testing. [Native Android result](android-native-results.json), [playing screenshot](android-glass-lab.png).

The Android test uses the existing Playwright package at `/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs` through a temporary ADB-forwarded WebView DevTools connection. It uses `noDefaults` for WebView compatibility and timer polling while background animation frames are suspended. Button/movement input is automated; Back and Home are actual emulator key events. This is not physical two-thumb validation. `navigator.onLine` remained true despite the operating system having no active network, so the offline assertion uses Android's connectivity service instead.

Android startup logs include two nonfatal Capacitor safe-area CSS injection warnings before the document exists; the game renders and the native plugin health reports no errors. Screen-edge layout still needs physical-device acceptance. Build/emulator logs are retained locally and ignored by Git. The test emulator is stopped after verification; `android:sim` will boot it interactively for the user.

Physical iPhone signing and installation, physical Android installation, touch comfort, audio interruptions, hardware airplane-mode launch and warm-device frame pacing remain untested. No run snapshot/force-quit persistence or final store artwork was added in this first proof.

Use [local testing instructions](../../CAPACITOR_LOCAL_TESTING.md) for the exact iPhone and Android steps.
