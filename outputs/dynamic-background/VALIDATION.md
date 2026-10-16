# Shifting background validation

15 October 2026 · local `feature/fullscreen-mobile-ui` · no publication.

## Passed

- `node tests/dynamic-background.test.mjs`: 180 unique retry patterns, 12 fresh New Runs, fresh reload, storage-denied fallback, loss/retry/compaction recovery changes, accurate/ahead/behind guides, unchanged geometry and isolated cosmetic randomness. **195,062** snapshots match the pre-feature `5898920` gameplay baseline across all fifteen rooms, with zero deaths. [Unit result](unit-results.json).
- `node tests/mobile-parity.test.mjs`: 195,062 active PC/mobile gameplay snapshots match, including compaction, with zero deaths.
- `node tests/glass.test.mjs`: ordinary-input zero-death glass completion; four-sided collision, corruption-gap loss/retry, exact eye-ray intersections and remarks pass.
- WebKit rendered three distinct desktop attempts and three distinct mobile attempts. Loss, retry and compaction produce fresh paper; reduced motion produces a static background layer; normal motion adds slight drift. A reroll while paused invalidates the mobile framebuffer without advancing gameplay. [Browser result](browser-results.json).
- Existing `fullscreen-mobile`, `mobile-browser` and `capacitor-browser` browser checks pass: five UI sizes, actual floor projection, control settings, pointer release, pause/rotation, the 15-second reading interval/two-tap skip, interruption budgets, local assets and ordinary-input glass completion. Browser commands use `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers` and the existing local Playwright package.
- `node tests/compaction.test.mjs` and `node tests/paywalls.test.mjs` pass, including authored safe return points, ordinary-input room completion, trap reset, cooldowns and per-room caps.
- Android Debug APK and unsigned iOS Simulator builds succeed. Android native offline launch, movement, background freeze, released input, Back routing through Controls and main pause, and the glass lab pass. iOS native Play, Practice/glass, background and explicit Resume pass. [Android result](android-native-results.json), [iOS result](native-ui-results.json), [build/hash record](build-results.json), [installed Android screenshot](android-native.png).

## Visual comparison

[Mobile attempt 1](mobile-attempt-1.png) · [attempt 2](mobile-attempt-2.png) · [attempt 3](mobile-attempt-3.png).

[PC attempt 1](pc-attempt-1.png) · [attempt 2](pc-attempt-2.png) · [attempt 3](pc-attempt-3.png).

All captures use the same starting position per platform, intentionally isolating the background changes. Actual foreground floor, trap and character geometry remain fixed. The screenshots are review fixtures, not claims of a human playthrough.

The desktop source hash intentionally changes because this feature applies to PC background art too; unchanged gameplay is established by the baseline snapshot comparison. The mobile builder continues to leave its input PC source untouched when generating outputs.

## Limits and handoff

No physical-phone installation, comfort/performance acceptance or human reaction study was performed. The effect on landmark-based timing and retry enjoyment remains a playtest question. The Android emulator started for this check is stopped afterward so `npm --prefix apps/native run android:sim` can open it interactively. Existing Xcode project/signing edits and the prior simulator metadata were preserved.

Full design and installation steps: [shifting paper backgrounds](../../DYNAMIC_BACKGROUND.md).
