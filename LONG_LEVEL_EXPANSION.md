# More levels like room seven

Friend playtest feedback: **level 7 is hard, but fun**. The user requested more of that experience. This is useful feedback from the current group, not evidence that every player prefers the same difficulty.

The campaign now has nine rooms. The original room-seven encounter sequence, spacing, checkpoint, and rewind locations are unchanged. Two new long rooms mix the existing learned rules in different orders. The controls and approved paper background remain the same.

| Room | Route | Encounters | Main rhythm |
| --- | --- | --- | --- |
| 7. Context Window Exceeded | 12,465 px | 20 | Original long level and its regular alternating sequence. |
| 8. Cached Confidence | 12,365 px | 24 | More encounters within a similar distance; airborne flags alternate with real ground scans, redactions, and fixed/shifting receipts. |
| 9. Regression to the Mean | 14,665 px | 28 | A longer mixed gauntlet adding four fixed-target forecasts to the walk/jump/bait decisions. |

Room eight has six redactions, six airborne flags, five ground scans, four shifting drops, and three fixed drops. Room nine has seven redactions, six airborne flags, four scans, four shifting drops, three fixed drops, and four forecasts. Authored gap sequences vary between 420 and 580 pixels instead of repeating room seven's uniform 620-pixel spacing. No random lethal geometry or faster player physics were introduced.

## Learnable frustration

The player must switch between jumping a real floor hazard, walking underneath an aerial field, baiting a receipt, and letting a forecast expire outside its captured target. Optional autocomplete suggestions deliberately encourage the wrong habit at some encounters. Actual trap warnings and captured targets remain truthful.

Each new room guarantees a compaction if none has happened before its context checkpoint: x=6,600 in room eight and x=7,200 in room nine. The 15-second freeze, safe backward return, trap reset, two-per-room cap, and 30-second restoration cooldown remain intact. Every authored return position has a verified recovery route.

Long-room forecasts use world coordinates rather than the original short-room clamp. Their captured targets stay fixed, and their warning/countdown captions stay inside the scrolling viewport. A forecast whose complete encounter has already been passed is skipped after a reset, preventing an old prediction from spawning ahead of a restored player. The original short-room forecasts retain their old bounds.

Twenty new rotating long-session remarks bring the combined authored library to 360 lines. For example: “I changed the order. Your muscle memory did not receive the release notes.” These remarks appear at section crossings in the new rooms. Hazard remarks, loss reading, and compaction commentary retain their existing libraries and timing.

## Finding the new levels

The campaign proceeds from seven into eight and nine. For direct practice, choose the desired room in the long-level selector and press **Long level** on iPhone or **Practice selected long level** on PC. Practice ends the chosen room with honest practice-completion text. Loss and compaction cannot be bypassed by changing the selection or starting practice.

The [public playtest](https://3qinnova.com/exception-human/) is backed by [the separate repository](https://github.com/3QInnova/exception-human). See [friends playtest](FRIENDS_PLAYTEST.md) for packaging and deployment evidence.

## Checks and next feedback

Both new rooms cleared through ordinary inputs with zero deaths across five seeded compaction schedules. Every rewind position recovered with zero deaths. A saved input route clears all nine rooms; 58,849 active gameplay snapshots match between PC and mobile. The WebKit practice replays clear both new rooms in both layouts, with actual compaction and no script errors or phone overflow. Chromium campaign and mobile touch/loss/rotation checks also pass.

These are solvability and interface checks. The scripted WebKit practice routes took about 84 seconds for room eight and 100 seconds for room nine; these are not human completion-time predictions. Friends still need to assess whether the mixed rhythm feels as funny, readable, and replayable as room seven.

Evidence: [runtime checks](outputs/long-expansion/runtime-results.json), [browser checks](outputs/long-expansion/browser-results.json), [new-level practice routes](outputs/long-expansion/practice-routes.json), [phone compaction](outputs/long-expansion/iphone-room-9-compaction.png). Regression commands: `node tests/long-expansion.test.mjs`, `node tests/forecast-feedback.test.mjs`, `node tests/mobile-parity.test.mjs`, and the WebKit `tests/long-expansion-browser.test.mjs`.

## Later user-requested floor traps

The secret-commit update adds two bounce tiles to each long room, increasing total encounters to 22, 26, and 30 for rooms seven, eight, and nine. Their original base sequences remain intact. The current PC/mobile completion comparison covers 58,990 snapshots. See [secret Git bounce](SECRET_GIT_BOUNCE.md).
