# Android release — EXCEPTION: HUMAN

Updated 2026-11-17 (America/Denver). Version 1.0.0 (code 1) is uploaded and submitted for United States production review. Play shows **Changes in review**, with automated pre-review checks running. Managed publishing is off: publication is automatic after approval. The game is not yet confirmed live.

## Deliverables

- Upload bundle: `../../outputs/play-store/EXCEPTION-HUMAN-1.0.0-1.aab`
- Installable release: `../../outputs/play-store/EXCEPTION-HUMAN-1.0.0-1.apk`
- Artifact audit: `../../outputs/play-store/validation.json`
- Public upload certificate: `../../outputs/play-store/upload-certificate.pem`
- Identity: `com.threeqinnova.exceptionhuman`, version 1.0.0, version code 1; min SDK 24, target SDK 36.

The Android release uses the shared sanitized campaign: 20 Localhost levels and the four approved Forecast, Recall, Puzzle and Glass challenges. Archived original routes, labs, demos, test hooks and level URL entry points are excluded. R8 optimization/resource shrinking are enabled. App debugging, WebView debugging in app configuration, backups and cleartext traffic are disabled. No private signing material is bundled. These controls do not make a client application impossible to reverse engineer.

## Ads and consent

Public live identifiers are recorded in `admob-android.json`. Google Mobile Ads 25.5.0 and UMP 4.0.0 are pinned. European consent/refusal/options and US opt-out messaging were published for this Android app in AdMob. The US message continues to cover the existing iOS app.

The native placement is fixed at 320 × 50 dp, bottom center, accounting for the WebView viewport, navigation bars and cutouts. It uses the existing shared 24px button exclusion checks. Menus, loss screens, privacy/legal panels, portrait orientation and background state hide it. JavaScript cannot choose coordinates, sizes or ad IDs. Ads require a successful consent update and `canRequestAds`; failures leave the game playable without ads. Requests use `npa=1`; publisher first-party ID is disabled before the first ad request. No location permission is requested. Privacy choices, user-initiated ad reporting and support email are accessible from the paused menu.

## Rebuild and signing

From `apps/native`, run `npm run android:release`. The script builds sanitized assets, copies an isolated Android project under ignored `outputs/play-store/production`, applies production identity/assets/live IDs, signs AAB/APK and runs the artifact audit. Local debug builds keep Google's sample ad IDs and the `.local` package.

The upload key and password are stored outside the repository in `~/.exception-human-signing/`, with directory/file permissions restricted. Back up this directory privately before relying on the release workflow. No off-device backup has been verified. Do not commit, upload, or share its password/private key. The public certificate is safe to supply to Play if required.

## Verification performed

- `python3 tests/android-release-package.py`: actual APK/AAB signatures, production identity, SDK, permissions, sanitized asset equality, release options, live IDs, absence of source maps/private keys/test hooks. The AAB includes Google's normal private-to-Play obfuscation mapping metadata; it is not installed in the APK.
- `node tests/release-package.test.mjs`: passed content allowlist, blocked level URLs, malformed saves, private-route exclusions, desktop and phone browser checks.
- `node tests/native-ads-browser.test.mjs` and `EXCEPTION_ADS_BROWSER=chromium node tests/native-ads-browser.test.mjs`: passed mocked native-ad success/offline states, privacy/report actions, menus, rotation, loss and interactive-control collision hiding in WebKit and Chromium.
- `node tests/banner-layout-browser.test.mjs`: 42 cases passed across WebKit/Chromium, safe areas and control sizes.
- Final signed APK installed and launched on the Android 36 emulator. Process remained running and AndroidRuntime crash log stayed empty after fixing SDK initialization order. `run-as` rejected the app as non-debuggable.
- The available emulator OS reports `ro.debuggable=1`, and exposes WebView inspection despite the app's disabled setting. Chromium deliberately overrides this on engineering OS builds. This emulator therefore does **not** prove absence of inspection on a stock retail device. See [Chromium SharedStatics](https://chromium.googlesource.com/chromium/src/+/930491ddf198e351de441a69f5555b9db5141863/android_webview/glue/java/src/com/android/webview/chromium/SharedStatics.java).
- Computer-use tooling could not attach to the emulator window; hands-on native controls, audible playback, live banner rendering, native consent forms and cutout positioning remain unverified. Browser simulations do not replace these checks.

## Release follow-up

1. Test the signed release on a physical Android phone: movement/jump/rewrite, timer/zap, saves, sound, pause/resume/Back, consent refusal/reopening, no-fill/offline, and banner separation from buttons. Use a Google-registered test device for advertising tests; do not click live ads.
2. Support/privacy update is published at `https://3qinnova.com/exception-human-info/` and verified byte-identical to the prepared page. Website commit: `dc0ee6d0e6284ffdf5b7b84aa28237e263e65b77`.
3. Play privacy, Data safety, Ads, Advertising ID, audience, IARC rating and other app-content declarations are saved. The overview reports no declarations requiring attention. Store category Action, support email and website are saved. See `disclosures.json`. Store assets and release notes are saved; the AAB is uploaded to the production track. The AAB, listing, disclosures and United States full rollout were submitted on November 17. Google review/publication remains pending.
4. Link the eventual supported store listing in AdMob and finish app readiness/app-ads.txt verification. Exact-package search on November 17 found no listing. The Android banner unit and public publisher app-ads.txt entry were verified. Live ID configuration does not establish ad-serving approval or fill.

For Data safety, review the actual SDK inventory against [Google's Android disclosure guide](https://developers.google.com/admob/android/privacy/play-data-disclosure). Non-personalized requests do not mean no data collection. The merged manifest includes AD_ID, AdServices identifiers/attribution/topics and network permissions; no camera, microphone, contacts or device-location permissions. Local game progress is not uploaded to the publisher. Support/ad reports are user-initiated. Do not copy Apple's tracking answers into Google Play without reviewing Android's identifiers and definitions.

## Submission evidence

- Production track: `4697392211637202442`, release 1, `1.0.0 — Escape Localhost`.
- Play artifact details: version 1 (1.0.0), API 24+, target SDK 36; download estimate 5.42 MB.
- Artifact audit and desktop/phone release-boundary checks passed again before submission.
- Country: United States only (including Play-defined associated locations).
- Google Play Games on PC opted out for initial mobile launch.
- Store icon and feature graphic declared AI-created; four screenshots are actual shared release-engine Chromium captures, not physical-device captures. Provenance: `outputs/play-store/listing/manifest.json`.
- User reported Android sound is now fine. The older audio test could not complete because its menu selector was hidden; this is not a new physical audio verification.
- Archive: `outputs/play-store/EXCEPTION-HUMAN-Android-1.0.0-release.zip` (AAB/APK, public certificate, listing assets, metadata; no private keys).
- Bundle SHA-256: `eef877c267d97fc71071ff8d15d87a67bfa8840fdc8720d8a69bca18044310d2`.
