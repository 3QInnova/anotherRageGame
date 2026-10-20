# Service Desk / Commitment Lab

Local prototype, October 16, 2026. Open **Menu → Data Centers → Try Commitment Lab · 4 encounters + Service Desk**. Desktop uses the same Data Centers button. This separate practice route requires no unlocks, banks no credits, and does not change campaign progress. The twenty Localhost servers and earlier Idle Compute trial remain available for comparison. Nothing is published.

## The four encounters

| Encounter | Trigger and response | Why waiting it out fails |
| --- | --- | --- |
| Spot Instance | Crossing the marked entry starts a 2.6-second lease. Run and jump the missing strip to permanent ground. | One lease covers the whole crossing. Steps never renew it; expiry removes support and ends the attempt. |
| Batch Execution | One entry starts a receipt dropping behind, a floor opening ahead, and a sweeping scanner. Run, jump, land, jump, leave. | The sequence runs independently of further input: floor opens at 0.55 seconds, receipt drops at 0.65, scanner activates at 1.45, whole crossing times out at 3.5. |
| Automatic Retry | Watch the warning and cross the scanner/receipt corridor during green cooldown. | The three-second cycle repeats: 0.8 warning, 0.8 active, 1.4 cooldown. Waiting never spends the trap. Passing retires it. |
| Live Migration | Ride three moving platforms across a 900-pixel corrupted gap and jump between them when reachable. | Each platform retires 4.5 seconds after first boarding. Leaving and returning cannot renew it. |

Entry lines, active countdowns, gold warning regions, red collision regions and platform timers are truthful. Batch's outlined scanner corridor contains the actual moving field. Purple autocomplete and background claims keep their existing unreliable behavior. A crossing deadline remains binding even if the player is airborne when it expires.

Green maintenance bays follow each encounter and allow indefinite rest. The next encounter waits for entry. Pause, the directory, phone backgrounding and portrait hold freeze simulation. Required warning/active waits before Automatic Retry freeze Service Desk evidence and its warning. Controls retain their immediate response.

## Service Desk presence check

The detector examines motion during active simulation, with no account, network or operating-system monitoring.

- A small burst lasts at most 0.24 seconds and moves more than zero but no more than 64 world pixels.
- A rolling twenty-second window needs eight such bursts spanning sixteen seconds and less than 140 pixels/second of new forward progress before opening **SERVICEDESK #404**.
- Bursts need not be regular. Varying tiny taps does not automatically escape detection.
- Floor-edge idle stamps grow into forward arrows and curling paper tabs as suspicion builds. An unfolding eviction slip and **6-second warning** mark the start of cleanup. At least 285 new forward pixels within the latest 1.5 active seconds clears it. Revisiting old ground and passive platform transport do not count.
- At warning expiry, **cleanup starts deleting the world behind the player**. It does not end the attempt. The edge begins 400 world pixels behind the warning position, moves at 145 pixels/second (the player runs at 265), and removes paper, scenery and floor. Only being caught by the edge causes an idle-related loss.
- Once active, cleanup continues until the next forward maintenance bay. Running buys distance; it cannot dismiss an active chase. The bay stops cleanup, clears presence evidence and permits indefinite rest. Deleted ground stays deleted until retry or compaction. Required Retry waits and Pause freeze the edge as well as the detector.
- Brief positioning taps, standing to study before entry, and rapid taps that make useful progress are allowed. Maintenance and actual trap waits are exempt. Pause does not manufacture tap events.

This is a tuned heuristic, not proof that every slow input strategy is detected. The timed encounters independently require commitment. Human testing should check false accusations and whether the warning gives enough time to understand and perform the recovery action.

## Top HUD and pressure feedback

Timers and encounter status now sit at the top center; credits sit at the top left. Idle pressure now prints an eviction notice into the paper world instead of changing the eye to red. A faint **INSTANCE IDLE** strip begins beside the player and spreads along visible solid ground. It becomes **MOVE ALONG →**, animated arrows and curled underside tabs. During the warning, a folded slip hangs below the floor with **CLEANUP IN …s**, changing to **CLEANUP IN PROGRESS** when deletion starts, with a tiny shredder eating scraps. Before cleanup starts, a useful forward run withdraws it, flattens the tabs and shows **EVICTION POSTPONED**. The observer remains mint during idle pressure and glances down. Actual forecast lock/purge cues retain their existing priority.

A restrained mint-to-amber HUD accent and at most 3.5% amber background wash add a slight color change, without flashing. The strip is clipped to surviving support and excluded from maintenance bays; it never alters the walking edge or collision geometry. The slip fits between mobile thumb controls. Protected waits hide idle paper without claiming a suspended ticket has been dismissed. Animation and countdowns freeze with Pause; retry and compaction remove stale paper.

Mobile narration sits below the top HUD and room identity moves into its small status line. The bottom center is free of gameplay HUD for the future advertising layout; this change adds no ad SDK or ad requests. Ghost controls stay in their corners. The four authored encounter deadlines and sweep timings are unchanged by this idle-grace adjustment.

## Credits, recovery and voice

Right remains free. Jump, successful Rewrite and left-distance costs are unchanged. Seven required jumps plus four spare credits fund the route. Both the ordinary-input and rapid-tap completion routes finish with four credits.

Credit exhaustion still causes the established 15-second compaction and safe quarter-route rewind. Five authored return points are on permanent ground outside timed hazards and the corrupted gap. Restore resets encounters and presence evidence and budgets the remaining jumps. Routine random/stall compaction is disabled in this lab. Loss keeps the 15-second reading interval and two distinct Continue/Space/Enter acknowledgments.

The lab adds **124 unique authored lines** (plus eighteen shared eviction-paper remarks): four six-line encounter pools, six crossing responses, eight Service Desk warnings, eight cleanup announcements, six dismissed-ticket responses, two thirty-line loss pools (including rewritten, deletion-specific Service Desk losses) and twelve background notes. Persistent rotation and randomized background placement remain. The background library now has 556 lines, including 37 room pools and the shared pools.

## Sources and verification

- `campaign/commitment-lab.js`: authored route, per-encounter state, support movement/collision, timers, presence detection, drawing and voice.
- `campaign/idle-compute.js`: shared deletion geometry, contact, protected waits and rendering.
- `campaign/pressure-feedback.js`: shared floor eviction stages, subtle tint, top HUD labels and eighteen persistent rotating remarks.
- `campaign/runtime.js`, `menu.html`, `menu.css`: direct practice access and responsive HUD.
- `campaign/credits-and-advice.js`: remaining-jump budgeting.
- Shared PC source: lifecycle, simulation, collisions and drawing hooks. Mobile/native assets use the existing builders.
- `tests/commitment-lab.test.mjs`: ordinary-input and rapid-tap wins, targeted hazard failures, repeated cycles, moving support/retirement, irregular creeping, deletion, recovery and a full chased win with a minute-long maintenance rest, pause/rest/wait exemptions, credit restore and rotation.
- `tests/commitment-lab-browser.test.mjs`: Chromium keyboard and WebKit touch-handler replay, pause, small phone layouts, visible deletion and a full chased win.

```sh
python3 tools/build-mobile.py
node tests/commitment-lab.test.mjs
node tests/pressure-feedback.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/commitment-lab-browser.test.mjs
```

Evidence: `outputs/commitment-lab/route.json`, `chased-route.json`, `results.json`, `browser-results.json` and screenshots. Full completion routes use normal controls; isolated failure/lifecycle fixtures explicitly position players. Existing campaign and original PC/mobile parity checks remain separate regressions. Automated success establishes reachable routes and tested behavior; physical-phone feel and enjoyment still require human playtesting.

To update an installed iPhone, run `npm --prefix apps/native run ios`, then Run the **App** scheme on your phone in Xcode. Existing installations do not receive local edits automatically. See [local phone testing](CAPACITOR_LOCAL_TESTING.md).
