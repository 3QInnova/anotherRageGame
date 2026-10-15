# Compaction validation

## Results

`node tests/compaction.test.mjs` verifies the 25-second stalled-progress trigger and scheduled surprise trigger, frozen player/trap/world state, blocked skip and retry inputs, exact 15-second restoration, clean trap and rewrite state, preserved death/attempt counts and observer state, cooldown, and two-per-room budget across retries. It also checks that multiple seeds select different eligible return points and that all 60 unique remarks rotate without early repetition.

Every authored return point was exercised through a real compaction reset and two seconds of resumed simulation with no death. The remainder of each of the five rooms was then completed from every return point using ordinary movement, jumps, rewrites, and waits, with zero deaths. These tests demonstrate authored recovery routes; they do not imply every input sequence is safe.

The existing forecast, loss-remark, and observer Node checks pass, including the normal zero-death route through all five rooms and all six observer stages.

Headless Chromium checks in `tests/compaction-browser.test.mjs` cover desktop and mobile rendering, frozen state, blocked keyboard/retry/touch input, trap restoration, resumed touch jump, all 60 remarks fitting a 390-pixel screen, and recovery through the shipping animation loop after the complete real-time pause. No page errors occurred. The existing browser regression suite also passes its five-room keyboard route, forecast phases, loss reading/skip, and pointer/touch behavior.

[Runtime results](runtime-results.json) and [browser results](browser-results.json) record the outcomes.

## Previews

[Initial freeze](freeze-desktop.png), [falling pixels](falling-pixels-desktop.png), [restored room](restored-desktop.png), and [mobile sequence](falling-pixels-mobile.png). Desktop falling-pixel and mobile screenshots were visually inspected. Preview fixtures force an interruption for inspection; stall and surprise triggers are tested separately.

## Commands

```sh
node tests/compaction.test.mjs
node tests/forecast-feedback.test.mjs
node tests/loss-remarks.test.mjs
node tests/observer.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/compaction-browser.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/browser.test.mjs
```

The browser scripts use the temporary Playwright installation described in the earlier [observer validation](../observer/VALIDATION.md). The game itself remains a self-contained offline HTML file.

## Limits

This is a browser prototype, not native-mobile or broad browser-compatibility validation. Simulation timing pauses in inactive tabs and may advance more slowly under severe rendering stalls. Random timings are selected within defined bounds; fixtures verify trigger boundaries and recovery rather than statistically characterizing frequency. Human playtests must establish whether a 15-second interruption is funny, too frequent, or too disruptive.
