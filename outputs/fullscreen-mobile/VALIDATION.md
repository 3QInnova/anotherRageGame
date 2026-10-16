# Full-screen mobile UI — implementation and validation

Historical UI-pass evidence. The later [dynamic-background change](../../DYNAMIC_BACKGROUND.md) intentionally updates desktop and mobile background art; consult its validation for current hashes/builds.

15 October 2026. Local branch `feature/fullscreen-mobile-ui`, created from `feature/capacitor-mobile` at `54b097f`. No push, web publication or store upload.

## Implemented

- The paper world fills the mobile WebView. Removed the external header, dialogue footer and control columns.
- Translucent left/right controls and a larger fixed Jump overlay the lower paper margin. A stable secondary Rewrite control dims when no anomaly is in range. Press states remain visible around the finger.
- One mobile projection handles uniform scaling, horizontal camera bounds, eye origin, glass optics and forecast captions at different aspect ratios. DPR is capped at 2. Walking surface composition accounts for the control rectangles. The seeded compaction fragment grid is retained; its snapshot is mapped into the new screen.
- The classifier dashboard moved out of the canvas. The eye, paper grid, margin annotations, semantic objects and authored hazards remain.
- A paper pause card contains Play, Controls, Audio and AI Log views. Practice is a submenu; New Run requires an explicit second action. The full latest remark and a bounded history of 30 recent narrator messages are available while paused.
- Size, outline visibility and edge-inset settings persist locally, with High Visibility and Reset Layout. Storage failure does not prevent playing. Fixed button positions only; left-handed layouts, free placement and hostile Jump movement remain deferred.
- Loss still gives 15 seconds to read and requires two distinct Continue taps to skip. Compaction and fake billing keep their existing timings and budgets. Pause freezes the underlying state, clears held input and blocks actions behind the card. Identical paused world frames reuse the framebuffer.
- Android Back returns from a menu subview to Play before minimizing from the main pause panel. Native background handling uses both the early pause event and app-state changes.
- Added an explicit shared iOS App scheme and fixed CRLF parsing when reusing the dedicated Android emulator.

## Checks

- `node tests/mobile-parity.test.mjs`: **195,062** active gameplay snapshots match PC across fifteen rooms, with zero deaths and actual compaction.
- `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/fullscreen-mobile.test.mjs`: passed in WebKit and Chromium. Checks full-screen bounds and actual projected floor pixels, 568×320 / 667×375 / 844×390 / 956×440 / 844×280 layouts, control bounds, persistent settings, frozen menus, cached paused rendering, eye/beam alignment above and below 640 logical width, forecast caption clamping, loss skip, frozen compaction and the paywall budget. [Results](browser-results.json).
- `tests/mobile-browser.test.mjs`: WebKit touch movement/jump, independent pointer IDs and cancellation, Safari long-press guards, background/rotation pause, reading interval, compaction and small layouts pass. The live-render check now uses a local file instead of requiring the old LAN server.
- `tests/capacitor-browser.test.mjs`: local assets, lifecycle adapter, Back/paywall behavior, frozen compaction and ordinary-input glass completion with zero deaths pass.
- Android Debug APK and unsigned iOS Simulator builds succeed. [Android native result](android-native-results.json), [iPhone native result](native-ui-results.json), and [build/APK record](build-results.json) are copied alongside this file. Those checks cover real native bridge registration, app switching and explicit Resume, Practice/glass selection, and Android Back routing. Full logs and build caches are ignored by Git.
- PC source SHA-256 remains `b3f520dda12487980d67a8c198fc1631f26bf7bd810121e3c137fce5e3ddd490`; the PC HTML is byte-identical to the branch base.

## Review

[Gameplay, 844×390](play-844x390.png) · [pause menu](menu.png) · [control settings](controls.png) · [glass lab](glass.png) · [installed Android app](android-glass.png).

Browser captures are actual rendered pages. The ordinary-input replay demonstrates completion; staged loss/billing/compaction fixtures separately exercise overlays and are not presented as natural playthroughs.

Physical iPhone/Android comfort, real simultaneous thumbs, cutouts and system gestures, audio interruptions, battery/heat and sustained frame pacing remain human/device acceptance tasks. The native Android safe-area startup warnings noted in the prior Capacitor validation are not treated as a physical-device layout pass. Keyboard mapping in the Android emulator remains deferred, as the user requested.

## Play this version

```sh
npm --prefix apps/native run android:sim
```

The new APK is already built. To rebuild after changes, first run `npm --prefix apps/native run android:build`. The dedicated emulator was already running when this work began, so it is left running with the updated app after verification.

For iPhone: `npm --prefix apps/native run ios`, select the App scheme, your signing team and the connected iPhone, then Run. No physical-device installation or team selection was performed here. See [local testing guide](../../CAPACITOR_LOCAL_TESTING.md).

Edit `mobile/layout.html`, `mobile/mobile-ui.js`, `mobile/viewport.js` and `tools/build-mobile.py`; regenerate mobile/native outputs. PC HTML remains the gameplay source.
