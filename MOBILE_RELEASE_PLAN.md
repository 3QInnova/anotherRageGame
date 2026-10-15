# Android and iPhone release plan

October 14, 2026. Planning document; no mobile app projects or store submissions have been created.

Build an installable, offline game for iPhone and Android using **Capacitor around the existing JavaScript game**. Keep the PC browser version. First prove the packaged game on real phones, then improve its architecture and mobile experience. Use Godot only if the device tests show that the web renderer cannot deliver reliable play after targeted fixes.

Capacitor supports Canvas games and existing JavaScript applications. Its iOS runtime uses WKWebView; this keeps our web rendering and physics inside an app package rather than converting them into a native game engine. This is the lowest-rewrite starting point for this particular project, not a performance guarantee. [Capacitor games](https://capacitorjs.com/docs/guides/games), [iOS runtime](https://capacitorjs.com/docs/ios).

## Why this fits the current game

The project already has fifteen campaign rooms, nine long-level practice options, a separate glass lab, authored snark, procedural music, and two-thumb controls. The user has confirmed the earlier iPhone Safari controls work. Current browser checks cover the campaign, touch/lifecycle behavior, and glass route; Android hardware and packaged apps still need testing.

The mobile game is approximately 144 KB of self-contained HTML, with no downloaded art, fonts, audio, or live AI dependency. A local package can preserve the approved paper world and run offline. Existing physics run at 120 fixed simulation steps per second. Rewriting the collision model now would put all of the validated trap timings and routes back into question.

| Route | What it preserves | Main cost or limitation | Decision |
| --- | --- | --- | --- |
| Capacitor with the current Canvas game | Rendering, physics, levels, dialogue, audio, web/PC builds | WebView performance, audio and lifecycle must pass physical-device tests | First choice; build a small proof before committing |
| Browser/PWA only | Existing shared-link distribution | Does not by itself deliver the requested pair of store app packages | Keep for quick feedback and PC play; optional installable web improvements later |
| Godot 2D | Content and game design can be transferred | Rendering, input, audio and physics need a port and repeat validation | Fallback if the first approach fails its device gates |
| Separate Swift and Kotlin games | Design and content | Two gameplay implementations to maintain | Poor fit for this small shared-code project |

Godot has documented iOS and Android export workflows, so it is a credible fallback. It is not an existing implementation in this repository. [Godot iOS export](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_ios.html), [Godot Android export](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_android.html).

## Stage 1 Prove the installed game

**Local implementation status (14 October 2026):** `feature/capacitor-mobile` now contains the bundled-asset Capacitor app, iOS/Android projects and native lifecycle/Back adapters. The iOS simulator build and native UI smoke test passed. Android SDK/Java are now installed locally and the debug APK and native Android emulator checks pass; physical-device acceptance remains open. Nothing was published. Follow [local testing instructions](CAPACITOR_LOCAL_TESTING.md).

**Estimated effort: 1–2 focused development days once devices and signing are available.**

Package the existing generated mobile HTML as local app assets, with minimal changes. Create an iOS project and an Android project, fix landscape presentation and safe areas, and install on the user's iPhone and a borrowed midrange Android phone. Test both platforms in this stage; an iPhone-only success is not the architecture decision.

Use the largest long level, compaction animation, simultaneous movement/jumping, music and the tracking-only glass lab as stress cases. Test cold launch in airplane mode, background/foreground transitions, and 20–30 minutes of sustained play. Record frame timing, missed/stuck input, audio delay, device warmth and battery use.

Proposed acceptance targets, measured rather than assumed:

- Aim for sustained 60 FPS on the selected baseline phones; on a 60 Hz display, target a 95th-percentile active-play frame interval at or below 20 ms, excluding intentional pauses and OS interruptions.
- No lost simultaneous touches or held movement after a finger releases, a system gesture, or a pause.
- Target visible input response below 100 ms in a recorded device check.
- The app pauses during interruptions; it never catches up by running a burst of lethal traps on return.
- Audio starts from Play/Resume, silences on backgrounding, and recovers without duplicated music or queued sound bursts.
- Glass clues remain legible and come only from the one player-tracking ray.

If these fail, first profile and fix the cause: redundant drawing/DOM updates, expensive effects, excess pixel resolution, or audio scheduling. Do not lower physics accuracy to mask rendering problems. If critical performance or audio problems remain after a bounded optimization pass, port one representative room and the glass collision lab to Godot and compare actual device results before porting the rest.

## Stage 2 Establish one maintainable game source

**Estimated effort: 2–4 days after the device proof.**

Today `tools/build-mobile.py` extracts the PC HTML script and applies text replacements for mobile behavior. It has served the prototype, but changes to source text can break that integration. Extract shared code in small steps, with the saved input routes as the regression baseline.

Proposed source layout:

```text
src/game/          physics, level data, hazards, narrator, audio
src/render/        paper-world drawing and optical clues
src/platform/      web/native lifecycle, saves, haptics, sharing
src/ui/            desktop and mobile menus, captions, controls
apps/native/       Capacitor configuration and iOS/Android projects
outputs/           generated browser and mobile release artifacts
```

Track the canonical sources, builders, tests and native projects in the existing `3QInnova/exception-human` game repository. Keep signing keys outside Git. Keep the existing Pages URL, publishing only the generated web artifact rather than the native working tree.

Preserve the standalone PC HTML and GitHub Pages build as generated outputs. Keep one physics implementation and one level library. Layout adapters choose camera framing, logical viewport, eye position and safe-area behavior. Native calls stay outside collision and trap decisions. Pin Capacitor and plugins in the package lockfile.

Separate **logical game coordinates from display pixels**. Current glass-eye and camera code sometimes reads `canvas.width`; increasing its backing resolution for a sharp phone display must not change the ray origin or world targeting. Keep the mobile logical viewport and transforms consistent, then scale the backing buffer separately. Start with a device-pixel-ratio cap of 2 and measure sharpness/performance.

Bundle the game locally and release it with the app. Do not point the production app at the GitHub Pages URL. Capacitor documents the external `server.url` setting as a live-reload development feature, not a production deployment method. [Capacitor configuration](https://capacitorjs.com/docs/config).

## Stage 3 Make it behave like a phone game

**Estimated effort: 3–5 days.**

Target phones first; tablet support needs its own layout and device acceptance. Keep landscape play, the warm paper background, visible two-thumb controls, readable snark and the 15-second loss reading interval with two-tap skip. Preserve compaction limits, one fake paywall per level across retries, and tracking-only glass clues. The glass lab remains separate from the campaign.

Add or finish these mobile behaviors:

1. **Home and settings:** Continue, New Run, level/practice selection, independent sound/music controls, optional haptics, and caption size. Preserve an explicit new-run confirmation when a saved run would be discarded.
2. **Comfortable controls:** adjustable control size/placement and a left-handed option. Use generous touch areas, keep them outside cutouts/home gestures, and test both landscape directions. Preserve long-press suppression and the browser version's working zoom behavior.
3. **Native lifecycle:** connect app foreground/background events to the existing pause/input/audio logic. Clear every held pointer on interruption. Android Back should follow the current dialog/menu state and never reset a level or bypass compaction as a side effect. [Capacitor App API](https://capacitorjs.com/docs/apis/app).
4. **Durable saves:** store settings, remark cursors, campaign progress and a versioned run snapshot. Save on meaningful transitions and pause, with debounced writes during play. A lightweight snapshot can use Capacitor Preferences; use a local file if snapshots grow large. The existing `localStorage` only persists remark rotation and is not a run-save system. [Preferences persistence guidance](https://capacitorjs.com/docs/apis/preferences).
5. **Audio and feedback:** retain the current score and effects first. Verify phone speakers, headphones, Bluetooth, mute settings and interruption recovery. Add small optional haptics for glass contact, loss and forecast lock. Do not vibrate continuously during compaction. Add a native audio implementation only if measured Web Audio behavior requires it.
6. **Sharing:** optionally share a snark/defeat card through the system share sheet. This is useful polish after performance and saves work; it is not a dependency for the first device build.

A run snapshot must retain room, practice state, traps, rewrites, timers, learned hazards, deaths, seeded interruption state, and interruption budgets. Resume frozen gameplay after an explicit Resume; time away from the app must not advance a trap or silently finish compaction. Persist the selected compaction return point and remaining reading/compaction time. Reconstruct visual fragments from saved state instead of trying to serialize Canvas images or audio nodes. On incompatible/corrupt saves, recover to the room start while retaining valid progress and budgets. Force-quitting must not grant another paywall or clear an already-counted compaction.

Preferences uses native storage on iOS/Android. Its iOS integration also needs the appropriate privacy-manifest declaration; follow the plugin's documented UserDefaults reason rather than adding permissions blindly. [Preferences privacy requirements](https://capacitorjs.com/docs/apis/preferences).

## Stage 4 Test on actual phones

**Estimated effort: 3–5 development days plus tester availability.**

| Device coverage | What it decides |
| --- | --- |
| User's iPhone; record model and OS | Whether the installed controls, audio, captions and optical clues feel right |
| Smaller/older supported iPhone | Minimum comfortable viewport and performance baseline |
| Borrowed midrange Android phone | Android WebView performance, audio and simultaneous touch behavior |
| Current Android phone, including gesture navigation | High-refresh displays, safe areas and Android Back/system gestures |

Use emulators/simulators to broaden layout and OS coverage, not to replace these device checks. Finalize the advertised minimum OS/device range after this evidence. Framework support floors are not promises that every old device will run the game comfortably.

Replay the existing campaign routes and glass route against packaged builds. Keep the 195,062-snapshot PC/mobile comparison as an existing baseline, not a claim that native packages already passed. Add save/restore tests during active traps, loss reading, fake billing and compaction. Check first launch offline, update over a saved run, rotation, screen lock, calls, app switching, low power mode, and a long warm-device session. New testers should discover move/jump/rewrite and understand that fake credits never cost money.

For beta distribution, use TestFlight for iPhone and Google Play testing tracks for Android. External TestFlight distribution involves Apple's beta review; direct Xcode installation is sufficient for the first owner-device proof. [TestFlight](https://developer.apple.com/testflight/).

## Stage 5 Prepare store releases

Begin account and tester setup early, in parallel with development. Use accounts owned by the intended publisher; a GitHub organization name does not establish an Apple/Google organization account. Confirm the app identifier and publisher name before creating store records. A candidate identifier is `com.threeqinnova.exceptionhuman`.

| Requirement | Current planning baseline |
| --- | --- |
| Capacitor toolchain | Current v8 documentation requires Node 22+, Xcode 26+ and Android Studio 2025.2.1+; lock versions at implementation. [Environment setup](https://capacitorjs.com/docs/getting-started/environment-setup) |
| Apple submission SDK | Since April 28, 2026, iOS uploads require the iOS 26 SDK or later. This is a build-SDK requirement, not a requirement that every player run iOS 26. [Apple SDK requirements](https://developer.apple.com/news/?id=ueeok6yw) |
| Google Play target | Since August 31, 2026, new phone apps/updates must target Android 16/API 36 or later. Target SDK and minimum supported Android version are different settings. [Android target requirement](https://developer.android.com/google/play/requirements/target-sdk) |
| Apple program | US$99 per year if a membership is needed. [Apple Developer Program](https://developer.apple.com/programs/) |
| Google Play registration | US$25 once if a developer account is needed. [Play Console registration](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en) |
| Conditional Android production gate | Personal accounts created after November 13, 2023 need at least 12 opted-in closed testers continuously for 14 days before applying for production access. This does not apply identically to every account type; check the actual account. [Google testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en) |

Prepare signed iOS archives and Android App Bundles, backed-up signing credentials, icons, actual gameplay screenshots, support contact, privacy policy, age/content ratings, accessibility information and accurate data disclosures. Inspect the final plugin set before claiming no data collection. The first beta should have no accounts, ad SDKs or real purchases. Commercial pricing can be decided after feedback; keep real commerce separate from the imaginary-credit jokes.

Apple's guideline 4.2 expects meaningful app content and functionality beyond a repackaged website. The offline game, full campaign, saves, polished controls and reliable app behavior are the product; using Capacitor does not itself secure approval. In review notes, explain the intentionally wrong AI, fake billing and 15-second compaction animation. Keep imaginary prices clearly fictional, retain the free dismissal, and avoid imitating a real system purchase dialog. This is a submission approach, not an assurance of acceptance. [Apple review guidelines](https://developer.apple.com/app-store/review/guidelines/).

## Readiness and first deliverable

Before implementation, local inspection found Node 26.7.0 and Xcode 27.0 installed. The default developer path currently selects Command Line Tools, so plain `xcodebuild` fails; selecting Xcode with a per-command `DEVELOPER_DIR` worked. Android Studio was not found in `/Applications`, and the usual `~/Library/Android/sdk` directory is absent. The subsequent authorized Capacitor implementation installed Java 21 and Android SDK/emulator tools in the ignored project cache; see the local testing guide for current commands. No global developer-directory or shell-profile changes were made.

The first implementation deliverable should be **one local-asset Capacitor build running the existing mobile game on the user's iPhone and a borrowed Android phone**, with a short performance/input/audio report and a proceed-or-port decision. Do this before a broad refactor, new levels, monetization or store artwork.

Allow roughly **10–18 focused development days** for the successful Capacitor route. Budget **4–8 calendar weeks** for device testing, tester scheduling, any applicable 14-day Google gate, account setup and store review. These are planning estimates; a Godot port or unresolved device issues would require a revised scope and schedule.
