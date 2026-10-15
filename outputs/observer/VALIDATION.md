# Fake AI frustration validation

The loose [V3 game](../../initalDemoDocs/Exception_Human_Misclassification_V3.html) now implements six cosmetic frustration stages and 80 additional authored lines. Successful actions provoke the observer without changing physics, hazards, rewrite durations, or earned results. The approved background remains intact.

## Checks performed

- `node tests/forecast-feedback.test.mjs`: both forecasts retain fixed targets, readable phases, honest survival feedback, collision deaths, and retry recovery; ordinary inputs clear all five rooms with zero deaths.
- `node tests/loss-remarks.test.mjs`: all 160 loss remarks, rotation, storage fallback, 15-second reading interval, frozen gameplay, and two-distinct-press/tap skip pass.
- `node tests/observer.test.mjs`: the ordinary completion route visits all six stages, records two survived forecasts, and preserves the final win. A real rewritten bridge crossing earns one response; X spam and deaths do not. Retries retain composure, full restart resets it, and all 80 unique responses rotate without early repetition and retain cursors across simulated reloads. Denied storage remains safe.
- `tests/browser.test.mjs` with headless Chromium: real keyboard completion route, forecast rendering, live animation loop, keyboard and pointer/touch controls, loss-card reading and skip behavior, and no script errors.
- `tests/observer-browser.test.mjs` with headless Chromium: six stage previews; all 80 response lines fit at a 390-pixel viewport without horizontal overflow or movement of the playfield between lines; no script errors.
- A one-off comparison against the pre-change HTML at `/private/tmp/exception-before-frustration.html` compared 4,948 frames along the ordinary completion route. Every gameplay snapshot matched after removing the newly added observer state. The `background` function was byte-identical. This comparison is snapshot evidence; the temporary baseline is not a portable test dependency.

[Runtime results](runtime-results.json), [browser results](browser-results.json), and [baseline comparison](baseline-comparison.json) record the outcomes. The exported [response library](remark-library.json) contains the 80 additional lines; the HTML remains the authoritative runtime source.

## Visual review

[Composed](stage-0.png), [defensive](stage-1.png), [pedantic](stage-2.png), [petty](stage-3.png), [strained](stage-4.png), [almost admitting](stage-5.png), and [narrow-screen preview](mobile-stage-5.png).

These stage screenshots use cosmetic fixtures in room one for comparison. Normal input progression through every stage is checked separately. The almost-admitting desktop and narrow previews were visually inspected.

## Reproducing browser checks

The temporary tooling used in this workspace is Playwright at `/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs` and Chromium installed beneath `/private/tmp/exception-forecast-browsers`:

```sh
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/browser.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/observer-browser.test.mjs
```

Those temporary packages may need reinstalling on a fresh machine. They are development tooling; the game has no external runtime dependency.

## Limits

This validates a local browser prototype, not native mobile support or broad browser compatibility. Storage continuity uses a simulated storage implementation in Node; real file-URL storage availability varies by browser. The full completion route does not exhaust every input sequence. Whether the reactions are funny, satisfying, and comfortable to read requires human playtesting. Physical proof pads and gameplay-changing retaliatory rules remain proposals.
