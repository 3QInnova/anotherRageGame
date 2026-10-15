# Long-level validation

## Checks

`node tests/long-level.test.mjs` starts through the actual practice-button handler and completes the long room using movement and jumps. Across seeds 1, 7, 42, 424242, and 987654321, every run cleared with zero deaths and one or two compactions. It checks the full 15-second freeze, unchanged player/trap/world-clock state during the pause, exact return placement, fresh trap states, the cap, blocked practice-button skipping, and honest practice victory text. A separate fixture disables the surprise schedule and verifies that crossing the context-limit checkpoint still compacts. Every authored return position has a zero-death recovery route.

`tests/forecast-feedback.test.mjs` regenerates the normal seven-room completion route, including at least one compaction in room seven. Existing observer and tech-feedback checks replay it and pass. Loss reading, floor-deception, six earlier rooms' compaction returns, and original five-room extension checks also pass.

Headless Chromium in `tests/long-level-browser.test.mjs` replays the recorded practice route using real keyboard events. It reaches compaction through ordinary gameplay, confirms the frozen state, captures restoration, and finishes with zero deaths and one compaction. A mobile checkpoint fixture independently checks the terminal layout, no horizontal overflow, and resumed touch jumping. No page errors occurred. The existing browser suite replays the complete seven-room campaign and retains its forecast, loss, live-animation, and pointer/touch checks.

[Runtime results](runtime-results.json), [browser results](browser-results.json), and the seeded [practice input route](practice-route.json) record the evidence. The campaign input route remains under [forecast feedback](../forecast-feedback/completion-route.json). Recorded inputs use `roomElapsed` so timestamps remain monotonic through a compaction reset; they are simulated 120 Hz frame counts.

## Visuals

[Start](long-level-start.png), [guaranteed compaction](guaranteed-compaction.png), [falling context](falling-context.png), [restored room](restored-long-level.png), [completion](long-level-cleared.png), and [mobile compaction](long-compaction-mobile.png). The desktop falling-context and mobile captures were visually inspected. Section labels were moved into the lower paper margin after review to keep the observer area clear.

## Reproduce

```sh
node tests/long-level.test.mjs
node tests/forecast-feedback.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/long-level-browser.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/browser.test.mjs
```

Browser tooling uses the temporary Playwright installation described in [observer validation](../observer/VALIDATION.md). The game is still self-contained and offline.

## Limits

Five seeds are sampled, not exhaustive random-state coverage. The checkpoint guarantee is separately tested without depending on randomness. Completion times describe scripted runs; real players may take longer, die, or trigger compaction while idle. The desktop keyboard route validates reachability; the mobile fixture validates rendering and recovery rather than a complete touch-only run. These checks do not establish native-mobile readiness, broad browser compatibility, or human enjoyment.
