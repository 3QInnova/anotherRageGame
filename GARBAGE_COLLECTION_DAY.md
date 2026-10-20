# Garbage Collection Day

A standalone practice level for idle timing and world deletion. Open **Menu → Data Centers → Garbage Collection Day · Idle & deletion test**. It is available immediately and never changes campaign unlocks or banked credits. The existing twenty Localhost servers, Commitment Lab and original fifteen rooms remain available.

The route is 8,370 world pixels from spawn to exit. Three collection stretches have wide maintenance bays between them, with five clearly visible gaps to jump. The opening runway lets you watch the idle warning without simultaneously learning a trap. Random advisory flags, false drop markers and autocomplete guesses are quiet in this test; the paper background, moving landmarks and randomized snark remain.

## Try these runs

1. **Wait at the first sign.** The top HUD shows remaining idle allowance. After sixteen seconds of accumulated idle time, a six-second warning opens the floor notice. Cleanup then deletes the world behind you; the player remains alive. Start running before the edge catches you, jump the first gap, and reach green maintenance ground.
2. **Rest in maintenance.** The edge stops and the next stretch keeps a fresh allowance. Pause also freezes the simulation. You can take a full minute here.
3. **Creep into the next stretch.** Tiny advances reduce a little debt but do not restart the clock. Compare the warning with your stationary attempt. Once cleanup begins, run to the next green bay.
4. **Run the final stretch.** Sustained new forward progress reduces idle debt. A decisive run can finish without triggering cleanup. The test does not force a chase when the player is productive.

All three stretches use the shared tuning: **16 seconds idle allowance, 6 seconds warning, 400 world pixels of head start, deletion at 145 pixels/second versus running at 265**. Once cleanup starts, running buys distance; the next maintenance bay ends it. The timer itself never causes a loss. Touching the deletion edge or falling in a gap does.

| Stretch | Idle/deletion area | Protected rest bay | Visible gaps |
| --- | --- | --- | --- |
| Desk Clearance | 10–2200 | 2200–2700 | 1250–1330 |
| Archive Queue | 2700–5100 | 5100–5600 | 3500–3584, 4300–4392 |
| Permanent Delete | 5600–8300 | 8300–8900 | 6500–6584, 7400–7488 |

Spawn is at 380, with the exit at 8750. Five jumps plus four spare credits fund the route. Routine random/stall compaction is disabled by the shared idle-trial rule. Credit exhaustion still performs the established quarter-route safe rewind, clears cleanup and refills the remaining action budget. Retry and the victory Restart button return to this level.

Twenty-four new background remarks use the existing persistent rotation and randomized placement. Examples: “Facilities counts standing as clutter,” “The green bay has a union rep,” and “The cleaning crew brought a delete key.” Shared cleanup and loss pools supply event-specific remarks and the usual fifteen-second loss reading interval.

## Sources and validation

- `campaign/garbage-collection-day.js`: authored route, signs, launch, identity and twenty-four background remarks.
- `campaign/idle-compute.js`, `pressure-feedback.js`: existing debt, deletion, protection and paper warning system; this level adds a readable remaining-allowance caption.
- `campaign/menu.html`, `menu.css`, `runtime.js`: direct entry, practice isolation and same-level restart.
- `campaign/credits-and-advice.js`: optional quiet advisory setting for this test only.
- `tests/garbage-collection-day.test.mjs`: normal clear and three-chase clear through ordinary controls, exact timing, collision support removal, a minute-long maintenance rest, slow taps, pause/loss freeze, retry/restart, credit restore and campaign isolation.
- `tests/garbage-collection-day-browser.test.mjs`: desktop keyboard and iPhone WebKit touch-handler replay, screenshots, small landscape layouts and restart.
- NativeSmoke: installed iOS launch, warning, live cleanup and pause in this level.

```sh
python3 tools/build-mobile.py
node tests/garbage-collection-day.test.mjs
node tests/background-voice.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/garbage-collection-day-browser.test.mjs
```

Evidence lives in `outputs/garbage-collection-day/`. Automated clears demonstrate reachable routes and the tested behavior; physical-phone feel still needs playtesting. Everything remains local. Run the **App** scheme in Xcode to install the refreshed game on your iPhone.

Verified October 16, 2026: ordinary and three-chase clears passed in the simulation, WebKit touch handlers and Chromium keyboard controls. The installed iOS simulator opened this level, reached its warning and live deletion, and paused successfully. Local iOS and Android debug builds passed. See `outputs/garbage-collection-day/validation.json` for the consolidated checks. Physical-device acceptance remains pending.
