# Background narrator validation

Local `feature/fullscreen-mobile-ui`; no publication or store upload.

## Content and behavior

`node tests/background-voice.test.mjs` passes:

- **304 distinct authored lines**, including **12 for each of all 16 rooms** (fifteen campaign levels plus the glass lab).
- Every line wraps to at most two 36-character lines in the selected monospace layout.
- Pools complete a full cycle before repeating. Cursors survive New Run and reload; redraws do not consume more lines. Denied storage still works in memory.
- “You didn't make it this far before.” appears after a previous best is exceeded. “Last time you failed earlier.” appears when the latest failure is passed without inventing a new best.
- Successful clears and manual restarts remove stale failed-attempt comparisons while retaining cosmetic best distances.
- Compaction comments implying lost distance require an actual rewind. Compaction at the initial spawn does not claim lost progress.

[Unit result](unit-results.json) · [full library](library.json).

## Browser evidence

`PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/background-voice-browser.test.mjs` passes in WebKit. It verifies visible room-specific notes, both requested progress lines, the Token Budget room theme, encountered-note history in the paused AI Log and frozen gameplay while reading. No page errors. [Result](browser-results.json).

[Room theme](level-01.png) · [new personal best](new-best.png) · [past the latest failure](last-time.png) · [Token Budget theme](tokens.png).

These progress screenshots are deliberately staged through test hooks to inspect presentation and selection. They are not presented as ordinary-input playthroughs.

The separate `tests/dynamic-background.test.mjs` comparison still matches **195,062** gameplay snapshots against the pre-background `5898920` baseline, across all fifteen campaign levels with zero deaths. `tests/mobile-parity.test.mjs` likewise matches PC and mobile. Narration changes do not consume gameplay randomness or change physics, geometry, trap triggers, interruption budgets or completion.

Existing full-screen UI checks (WebKit and Chromium), mobile WebKit touch/reading/lifecycle checks, shifting-background render/reduced-motion checks and the packaged native-adapter/zero-death glass route pass.

## Native builds and handoff

The Android Debug APK and unsigned iOS Simulator build succeed. Native Android and iOS smoke results and the current APK/source hashes are recorded in the [build/hash record](build-results.json), [Android native result](android-native-results.json) and [iPhone native result](native-ui-results.json). These checks exercise actual native WebViews, Play/Practice/glass, app switching, explicit Resume, and Android Back routing; humor and physical touch comfort remain human judgments.

The headless Android emulator started for testing is stopped afterward. Existing Xcode project/signing edits and prior simulator metadata are preserved. No physical phone was installed automatically.

Run `npm --prefix apps/native run ios`, then Run in Xcode to update the user's iPhone. For Android on the Mac, `npm --prefix apps/native run android:sim` starts the already-built app.

Permanent content rules and implementation details: [background voice](../../BACKGROUND_VOICE.md).
