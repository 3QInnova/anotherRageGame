# Floor-deception level validation

`node tests/floor-lies.test.mjs` verifies all five requested elements: safe spans sharing approval stamps with traps; physically solid suspicious seams; approval revocation during a real armed warning interval; deliberately wrong WALK and needless JUMP suggestions appearing along a normal successful route; and a genuine redaction death producing both the AI's petty edit and a truthful learned marker on retry. It also checks direct practice access, zero-death practice completion, and the truthful practice victory text.

`node tests/forecast-feedback.test.mjs` now records an ordinary-input route through all six rooms with zero deaths. The room-five exit audit remains recoverable before progressing to room six. The existing loss-remark, observer, tech-feedback, and level-extension checks pass. Compaction checks cover every authored return point in all six rooms, including zero-death recovery through the remainder of the new level.

Headless Chromium in `tests/floor-lies-browser.test.mjs` verifies actual keyboard walking/jumping, both misleading suggestions, the armed approval correction, a genuine death and two-press retry, retained learned identity, the practice button on desktop/mobile, narrow-screen overflow, and touch jumping. There were no page errors. The existing browser suite also replays the six-room zero-death route and checks forecast phases, live animation, loss reading/skip, and pointer/touch input.

[Runtime results](runtime-results.json) and [browser results](browser-results.json) record the dedicated checks.

## Previews

[Overview](level-six-overview.png), [bad walking advice](bad-walking-advice.png), [approval revoked](approval-revoked.png), [needless jump advice](needless-jump-advice.png), [petty edit and learned marker](petty-edit-and-learned-marker.png), and [mobile view](level-six-mobile.png). The needless-jump and petty-edit captures were visually inspected. These previews use the actual active hazards and ordinary controls; the dedicated level is reached through the practice button or an isolated room-start fixture.

## Reproduce

```sh
node tests/floor-lies.test.mjs
node tests/forecast-feedback.test.mjs
node tests/compaction.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/floor-lies-browser.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/browser.test.mjs
```

Browser tooling uses the temporary Playwright installation described in [observer validation](../observer/VALIDATION.md). The game remains a self-contained offline HTML file.

## Limits

This verifies a local browser prototype and authored completion routes, not native mobile support, broad browser compatibility, or every possible input sequence. Player observation must establish whether the misleading floor claims cause satisfying doubt and whether the real warnings remain legible. The short in-world autocomplete result stamp in this room is a pacing choice; its narration and receipts stay separately readable.
