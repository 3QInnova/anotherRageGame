# Forecast feedback implementation and validation

Checked October 13, 2026.

## Implemented behavior

The loose [V3 prototype](../../initalDemoDocs/Exception_Human_Misclassification_V3.html) now shows scanning before the existing forecast trigger, a fixed target with solid corner brackets, a framed `TARGET LOCKED` warning, a two-decimal countdown, and a shrinking time bar. The observer points at the locked region. The lethal phase reads `PURGE ACTIVE / KEEP CLEAR`. Surviving the complete purge displays `PREDICTION FAILED / HUMAN SURVIVED` for 1.15 seconds and triggers one short narrator response.

The diagnostics expose phase changes through a polite live region; countdown updates remain on the canvas. Scanning adds no simulation delay. Forecast trigger positions, target selection, warning durations, lethal rectangles, active durations, movement, and room geometry retain their previous values. No additional mechanic from the six-idea document was implemented.

The original playtest ZIP and screenshots remain historical references. Its HTML differs from the updated loose prototype.

## Readable loss remarks

The user requested a longer loss screen because the previous 0.39-second reset made remarks unreadable. The room now pauses for a 15-second reading interval. The expanded library contains 160 distinct authored remarks, 32 each for falling, classifier rejection, policy receipts, forecasts, and expired walls. Each family exhausts its lines before repeating, and cursors survive new runs. Browser storage permits continuity across reloads; denied or malformed storage falls back safely. The overlay shows the remark prominently, the actual failure reason beneath it, and an auto-retry countdown.

Two separate Space, Enter, or numpad Enter presses skip the screen. The Continue button provides a two-tap touch equivalent, and Retry room also requires two acknowledgments while the screen is showing. Holding a key or sending duplicate keydowns does not count twice. The final skip is consumed so it cannot also jump. R, X, movement, and the jump controls do not dismiss or overwrite a loss remark. World time and hazard states remain frozen while reading; learned markers and death counts survive the retry.

`tests/loss-remarks.test.mjs` verifies the full 15 seconds at the fixed simulation step, persistence past ten seconds, auto-retry, frozen gameplay, skip inputs, held-key protection, touch/retry acknowledgments, and remark rotation. Browser checks trigger a normal floor death, verify persistence and keyboard skipping, confirm that the loss card fits at a 390-pixel viewport, and exercise two-tap touch skipping. Desktop and narrow-screen loss screenshots were visually inspected. Real-world reading comfort and screen-reader behavior remain untested.

The library checks also verify uniqueness, at least 30 lines per family, complete cycles without early repetition, new-run continuity, simulated reload continuity, and denied/corrupt storage fallback. Chromium renders all 160 remarks at a 390-pixel viewport and confirms that each fits without internal card scrolling.

## Checks completed

- Node checks exercise both room 3 and room 5 forecasts: approaching scan, target capture, target immobility after movement, warning and purge labels, acknowledgment after survival, lethal contact without a false survival message, result expiry, and reset after death or manual retry.
- A normal-input simulation clears all five rooms with zero deaths. It uses movement, jump, X, and waits, without teleporting, changing geometry, or disabling hazards. Its recorded actions are saved in [completion-route.json](completion-route.json).
- Headless Chromium replays that route through actual keyboard event handlers, using deterministic simulation stepping, and reaches the final win with zero deaths.
- Chromium captures scanning, locked, purging, and survived phases, exercises the live animation loop and retry button, and checks a 390-pixel viewport for horizontal overflow. Pointer movement/release and touchscreen jump/rewrite checks pass.
- No browser page script errors were reported. See [browser-results.json](browser-results.json).
- Desktop and narrow-screen screenshots were visually inspected. Capture fixtures isolate the forecast by placing the player in room 3 and disabling unrelated hazards; these fixtures demonstrate rendering, not legitimate traversal. The separate completion route establishes traversal.

## Reproduce

No third-party dependency is required for the Node checks:

```sh
node tests/forecast-feedback.test.mjs
node tests/loss-remarks.test.mjs
```

The optional browser check uses Playwright installed separately. Set `PLAYWRIGHT_MODULE` to its ESM entry point and `PLAYWRIGHT_BROWSERS_PATH` to its browser installation directory as needed. The validation run used temporary tooling under `/private/tmp`; the game itself remains dependency-free.

```sh
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs \
PLAYWRIGHT_BROWSERS_PATH=/path/to/playwright-browsers \
node tests/browser.test.mjs
```

Run the Node check first to generate the completion route. Browser captures and result JSON are regenerated by the browser check.

## Captures

- [Scanning](scanning-desktop.png)
- [Locked target](locked-desktop.png)
- [Active purge](purge-desktop.png)
- [Survived prediction](missed-desktop.png)
- [Narrow-screen lock](locked-mobile.png)
- [All rooms cleared](all-rooms-cleared.png)
- [Desktop loss remark](loss-desktop.png)
- [Narrow-screen loss remark](loss-mobile.png)
- [Longest remark on a narrow screen](longest-remark-mobile.png)

## Validation limits

The connected Browser runtime was unavailable. A Firefox headless attempt did not produce a capture; the completed rendering and input checks use a temporary Chromium installation.

These are local prototype checks, including synthetic browser inputs and instrumented simulation stepping. They do not establish physical phone behavior, screen-reader usability, human reaction timing, or player comprehension and enjoyment. A successful survival stamp identifies that the purge completed without killing the player; it cannot distinguish deliberate baiting from accidental survival.
