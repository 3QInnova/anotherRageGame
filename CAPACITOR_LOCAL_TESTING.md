# Local Capacitor phone test

The current UI branch is `feature/fullscreen-mobile-ui`, created from `feature/capacitor-mobile` at `54b097f`. The original Capacitor branch remains available. Nothing has been pushed or published. The mobile browser and native apps share the full-screen UI. The desktop and mobile versions now also share [shifting paper backgrounds](DYNAMIC_BACKGROUND.md); gameplay geometry is preserved.

The current build also includes [556 authored background jokes](BACKGROUND_VOICE.md), with level-specific and progress-aware notes. Open the new [Commitment Lab](COMMITMENT_LAB.md) through **Menu → Data Centers → Try Commitment Lab · 4 encounters + Service Desk**. Rebuild/reinstall to update an existing phone installation.

The native app is **Exception Human Local**, bundle/package ID `com.threeqinnova.exceptionhuman.local`. It bundles all fifteen campaign rooms, the glass lab, remarks and procedural audio. There is no web server URL: once installed, it loads its game files locally, so your phone does not need the Mac's Wi-Fi connection.

## Test on your iPhone

From the repository root:

```sh
npm --prefix apps/native run ios
```

Dependencies are already installed on this Mac. On a fresh checkout, first run `npm --prefix apps/native ci`.

1. In the Xcode project that opens, select the **App** scheme. The separate **NativeSmoke** scheme is for automated simulator tests.
2. Connect and unlock your iPhone, trust the Mac if prompted, and select your iPhone as the run destination.
3. Select the **App** target → **Signing & Capabilities** → choose your Apple development team and enable automatic signing. No team was selected by these changes. A personal team can be used for your own development testing. See [Apple's signing guidance](https://help.apple.com/xcode/mac/current/en.lproj/dev60b6fbbc7.html).
4. Enable **Settings → Privacy & Security → Developer Mode** on the phone if Xcode requests it; follow the restart prompts. See [Apple's Developer Mode instructions](https://developer.apple.com/documentation/xcode/enabling-developer-mode-on-a-device/).
5. Press **Run** in Xcode. Open **Exception Human Local** in landscape and tap Play.

The project is [apps/native/ios/App/App.xcodeproj](apps/native/ios/App/App.xcodeproj). This is a local development install, with no TestFlight or store upload. The simulator `.app` built below cannot be installed on an actual iPhone; Xcode must build and sign the device version.

If Xcode reports a missing local Swift package after dependency installation, close the project, run `npm --prefix apps/native run sync`, then reopen it. If Xcode is installed somewhere other than `/Applications/Xcode.app`, set `DEVELOPER_DIR` to its `Contents/Developer` directory for the build scripts.

## Local simulator checks

```sh
npm --prefix apps/native run ios:build
npm --prefix apps/native run ios:sim
npm --prefix apps/native run ios:test
```

These commands build an unsigned simulator app, install it on a dedicated **Exception Human Local** simulator and run a native UI smoke test. They do not change the Mac's global Xcode selection or touch the other simulators. `ios:sim` reinstalls the most recently built app; rebuild after changing the source.

This Mac has working Xcode 27 command-line tools and an iOS simulator runtime, but no Simulator GUI app at Xcode's usual `Contents/Developer/Applications/Simulator.app` location. The backend installation and UI tests passed without that window. `ios:sim` opens the window automatically when the GUI is present. A full Xcode installation is needed for interactive simulator use.

Build: `outputs/capacitor/DerivedData/Build/Products/Debug-iphonesimulator/App.app`.

Logs, simulator ID, UI-test results and screenshots are under `outputs/capacitor/`. See [validation](outputs/capacitor/VALIDATION.md).

## Android — installed local toolchain

The Android toolchain is now installed on this Mac in `apps/native/.cache/android-toolchain/` (ignored by Git). It includes Temurin Java **21.0.12.1**, Google's ARM64 command-line tools **23.0**, SDK Platform **36**, Build-Tools **36.0.0**, Platform-Tools **37.0.1**, emulator **37.2.12**, and the Android 16/API 36 Google APIs ARM64 system image. Standard SDK licenses were accepted during the authorized installation. The toolchain is about 10 GB including emulator data and Gradle dependencies; it is local, removable build tooling.

The debug APK built successfully. From the repository root, no manual environment exports are required:

```sh
npm --prefix apps/native run android:build
npm --prefix apps/native run android:sim
```

The first command builds the APK; the second opens the dedicated **Exception_Human_Local** Pixel 7 emulator, installs the latest built APK and launches it. Rebuild before installing source changes. For automated checks without a window, use `npm --prefix apps/native run android:sim -- --headless`, then `npm --prefix apps/native run android:test`. These checks use the existing local Playwright installation documented in the validation file.

APK: `apps/native/android/app/build/outputs/apk/debug/app-debug.apk`. This is signed with a local development key, not a store release key.

To install on an authorized USB-debug-enabled Android phone, connect it and run:

```sh
apps/native/.cache/android-toolchain/sdk/platform-tools/adb devices
apps/native/.cache/android-toolchain/sdk/platform-tools/adb -s PHONE_SERIAL install -r apps/native/android/app/build/outputs/apk/debug/app-debug.apk
```

Replace `PHONE_SERIAL` with your phone's entry. The emulator uses serial `emulator-5556`; the native test script targets only that dedicated emulator. To stop it:

```sh
apps/native/.cache/android-toolchain/sdk/platform-tools/adb -s emulator-5556 emu kill
```

The build automatically selects the project-local Java/SDK/Gradle caches. Existing `JAVA_HOME`, `ANDROID_HOME` or `ANDROID_SDK_ROOT` settings take precedence; an ignored `apps/native/android/local.properties` can also specify `sdk.dir`. No global Java default or shell profile was changed. Android Studio was not installed: command-line builds and the emulator work without it. If you later want the IDE, install Android Studio and point its SDK location at this cache (or install your own SDK), set Gradle JDK to Java 21, then use `npm --prefix apps/native run android`.

For a fresh Mac, install Java 21 and Google's Android command-line tools or Android Studio, then SDK Platform 36, Build-Tools 36.0.0 and Platform-Tools. Set `JAVA_HOME` and `ANDROID_HOME` to those installations. Add `emulator` and `system-images;android-36;google_apis;arm64-v8a` for this Apple Silicon emulator. [Official Android SDK tools](https://developer.android.com/studio), [Temurin Java](https://adoptium.net/temurin/releases), [Capacitor environment setup](https://capacitorjs.com/docs/getting-started/environment-setup).

On Android, Back opens the pause menu; within a menu subview it returns to Play, and from the main paused Play panel it minimizes the app. During a fake paywall, Back follows the same two-step free dismissal. Back does not skip the compaction animation.

## What to try on the phone

- Hold move and jump together with two thumbs; check rewrite, both movement directions and screen-edge controls.
- Read a full loss remark; confirm two distinct Continue taps skip the reading pause.
- Open Pause → Practice → Long level, wait for compaction, and check that movement resumes after it finishes.
- Try Pause → Practice → Glass sightline test. Check that the single player-following eye beam reveals the platforms.
- Play audio after tapping Play; check phone speakers, headphones, screen lock and app switching.
- Switch to another app while holding a control. Return: the game should be paused, and the held control should be released. Resume explicitly.
- Relaunch the installed app in airplane mode to check offline use on real hardware.

Record phone model/OS, any clipped text or controls, audio failures and stutters. Simulator and browser checks do not establish physical-device performance or two-thumb comfort.

## Source and rebuild workflow

Edit shared gameplay in `initalDemoDocs/Exception_Human_Misclassification_V3.html`, mobile presentation in `mobile/layout.html` / `mobile/mobile-ui.js` and the shared mobile projection in `mobile/viewport.js`, and native-only behavior in `apps/native/src/`. Do not edit `apps/native/www/` or native copies of its files: they are generated.

`npm --prefix apps/native run sync` rebuilds the mobile HTML, bundles the native bridge and copies the local assets into both native projects. It then prepares the iOS framework cache. Run Xcode/Android Studio again to install the new app. `ios:build` and `android:build` perform their own asset rebuild and platform sync.

Capacitor and plugins are pinned in `apps/native/package-lock.json`. iOS uses Swift Package Manager. To avoid the framework download hang observed on this Mac, `prepare-ios.mjs` downloads the official Capacitor 8.5.3 binary frameworks, verifies their upstream SHA-256 checksums, and points the generated app/plugin package manifests at an ignored local cache. Use our `sync`/`ios:build` scripts after `npm ci`; plain `cap sync` can reset the package reference. Initial dependency/framework downloads require internet; the installed game does not. No framework binaries, signing keys or build caches belong in Git.

This is the first installed-app proof. App switching preserves the resident game and pauses it; force-quitting starts a fresh run. Durable campaign server-boundary saves now exist. Haptics, final icons/splash art, release signing, physical Android device validation and store submission remain future work. The approved background, gameplay, snark and PC controls are preserved. The mobile UI now fills the game surface with ghost controls and a paper pause overlay; see [UI validation](outputs/fullscreen-mobile/VALIDATION.md).

## Data Center campaign — October 16, 2026

The local app now offers **Data Centers · Campaign** in the pause menu. **Continue campaign** starts or resumes Localhost at a server boundary. Twenty Localhost servers are playable; nine additional centers contain 180 clearly marked planned entries. Use **Practice any playable server** for direct selection without unlocking campaign progress. **Original playtest** retains the original fifteen rooms and glass lab.

Rebuild and Run to update an installed app. Android: `npm --prefix apps/native run android:build`, then `npm --prefix apps/native run android:sim`. iPhone: `npm --prefix apps/native run ios`, then Run the App scheme on your connected iPhone in Xcode with your existing signing configuration. That October 16 validation did not automatically install a physical phone; see the October 19 update below. See [campaign guide](DATA_CENTER_CAMPAIGN.md) and [validation](outputs/data-centers/VALIDATION.md).

## Puzzle Box local test — October 17, 2026

After rebuilding/reinstalling, open **Menu → Data Centers → Puzzle Box · Visible signals & switches**. Jump onto the first maintenance deck to open the fixed circuit. Flip A/B/C, follow the visible bits through ANY/BOTH/ONE ONLY, and aim for FAN 1 / DECK 0. Preview is unpowered. TEST locks inputs and applies power; a live ground output shocks. The harness holds the player while the console is open. After SAFE TO CROSS, choose BACK TO DECK and continue toward two harder boxes. Pause always freezes the test. This practice route does not change campaign progress or bank credits. The old Thermal Support Ticket remains available.

Use `npm --prefix apps/native run ios:build`, `ios:sim` and `ios:test` for the simulator; run the **App** scheme on your connected iPhone to update the physical app. Use `android:build`, `android:sim` and `android:test` for the dedicated emulator. Browser checks and native evidence are recorded under `outputs/puzzle-box/`; physical-phone comfort/readability remain separate acceptance checks. Keep this branch local.

## Physical iPhone and integrated cooling test — October 19, 2026

Both the baseline Puzzle Box build and the completed Localhost 18 integration were built with the existing signing setup, installed and launched on **William’s iPhone**. The final menu-only update also installed successfully, but its automatic launch was denied because the phone had locked; unlock and open the app manually. The second connected phone was left untouched. Installation preserves the app identity and saved data. Device evidence is in `outputs/local-host-puzzle/iphone-initial-install.json` and `iphone-final-install.json`; it proves installation/launch, not human gameplay acceptance.

Open **Menu → Data Centers → Try Localhost 18 · Cooling Incident** in the installed app. This direct practice shortcut leaves campaign clears and banked credits alone. Try the opening rewrites/traps, cross the marked cleanup entry, outrun deletion through two jumping decisions, and jump onto the maintenance deck. The four-switch Puzzle Box is protected and free to operate; TEST a FAN 1 / DECK 0 circuit, wait for SAFE TO CROSS, close the console and jump across the cooled sink. Three final obstacles lead to the exit. Practice Restart repeats this same server. Normal campaign entry still records clears and advances to 19.

Check chase readability, two-thumb comfort, circuit text, sound and the transition back to movement. Browser route completion and native installation do not replace that phone playtest. Keep all work local.
