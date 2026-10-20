# Idle Compute / Cleanup Trial

Follow-up: human playtesting found that some tapping strategies still reach maintenance or the exit. The checks below cover particular routes, not every creeping strategy. [Commitment Lab](COMMITMENT_LAB.md) adds four authored encounters and the Service Desk detector in a separate directly accessible practice route. This room remains available for comparison.

Local implementation, October 16, 2026. This began as an authored experiment in **DC1 / Localhost server 15**, retaining stable server ID `localhost-15` and the catalog title **Incident: Prediction Outage**. Following successful Garbage Collection Day playtesting, idle cleanup now runs across all twenty Localhost servers; see [Localhost cleanup](LOCALHOST_CLEANUP.md). The original fifteen-level playtest remains separate. Nothing is published.

## How to play

Open **Menu → Data Centers → Try Idle Compute · DC1 / 15**. The direct button starts practice immediately, without needing campaign unlocks, and practice does not change saved campaign progress or bank credits. Normal sequential play also encounters the new behavior in server 15.

The work order is named **Idle Compute / Cleanup Trial**. It has two cleanup stretches, a green maintenance bay between them, and another maintenance area before the exit. Short pauses are allowed; continuous creeping eventually puts the player in front of an advancing deletion edge.

## What happens

1. **Running instance:** the small compute meter fills when the player makes too little new forward progress. Floor-edge idle stamps spread beside the player, then turn into forward arrows and curling underside tabs as pressure rises. At half-full the AI comments on the lack of useful work.
2. **Termination scheduled:** a full meter starts a clear 6-second warning. This warning commits cleanup for the section. A quick burst cannot cancel it.
3. **Cleanup active:** a red deletion edge advances from behind. Paper, grid and background text disappear into corrupted storage; paper fragments fall from the edge. Deleted floor is physically removed. Touching the edge loses with a concrete explanation and a rotating cleanup remark.
4. **Maintenance exclusion:** reaching the next green bay ends cleanup for that section and starts a fresh allowance for the next. The player can stay in the bay indefinitely. Cleanup does not enter the protected bay.
5. **Suspend instance:** Pause, the directory, phone backgrounding and portrait hold freeze simulation. Loss reading and compaction also freeze compute. The usual 15-second loss reading interval and two-press skip still apply.

Idle compute spends **no action credits**. Jump, Rewrite and leftward costs remain as approved. Action-credit exhaustion still compacts, rewinds to a safe landing, refills credits, clears deletion and gives a fresh compute grace period at the restored position.

Routine surprise/stall compaction is disabled throughout Localhost and in the separate idle practice levels so it cannot interrupt the chase, rescue a crawling strategy, or disturb the maintenance breather. The original playtest retains its normal compaction rules.

## Tuning and exploit resistance

Current values are deliberately centralized in `campaign/idle-compute.js`:

| Parameter | Trial value |
| --- | --- |
| Idle allowance | 16 seconds of accumulated unproductive time |
| Termination warning | 6 seconds |
| Meaningful forward work | 180 world pixels/second |
| Player running speed | 265 world pixels/second |
| Deletion speed | 145 world pixels/second |
| Initial deletion-edge distance | 400 world pixels behind the player at the warning |

During monitoring, each simulation step adds elapsed time and subtracts new forward distance divided by the work-rate target. Debt is clamped between zero and the allowance. Progress uses the section's furthest reached position: backtracking, wiggling, jumping in place and button spam cannot manufacture new work. Running reduces accumulated debt gradually; it does not bank unlimited future waiting time. These are game-world units, independent of screen size and frame rate.

Each section keeps its own state. Revisiting an old bay does not erase the next section's accrued debt or cancel its cleanup. Crossing a section's far boundary clears it. Previously deleted ground stays deleted until retry or compaction; it does not silently rebuild when the player reaches maintenance.

A real, armed forecast or ordinary receipt that requires waiting suspends both compute and deletion while the player waits nearby, outside its locked target. This exemption lasts only as long as the actual hazard. Dotted autocomplete, fake warnings and distant hazards do not pause compute.

## Commitment traps

Two existing receipts, near world positions 2010 and 4320, now use entry scans. Waiting outside their entry lines does not activate or consume them. Crossing the entry line captures a fixed drop column centered on the player and gives a **0.75-second warning**, followed by the normal descent. The real column and countdown remain visible and accurate. Moving right clears it without spending a jump credit; standing in it loses.

These are explicit escape decisions, so they do not receive the required-wait exemption. Their geometry and timing are deterministic. Safe compaction returns are beyond their landing areas. The normal completion controller now runs through these encounters instead of waiting underneath them.

## Voice and presentation

The existing paper world and ghost controls remain. This room adds a top-center compute meter, paper eviction warnings, a visible deletion edge, falling fragments, maintenance markings and an entry-scan label. The meter is hidden during blocking interruption screens. Credits sit at the top left; narration sits below the top HUD, leaving the bottom center clear for a future ad layout. The eye stays mint during idle pressure. A restrained amber floor strip and at most 3.5% amber background wash accompany the stamps, arrows and curling tabs. At termination scheduling, an unfolding paper slip reads **CLEANUP IN …s**, then **CLEANUP IN PROGRESS**, with a tiny animated shredder. It uses the actual cleanup clock, the same deletion consequence now used in the Service Desk lab. Before scheduling, sustained work can retract the warning and print **EVICTION POSTPONED**; after scheduling, reaching maintenance remains the escape. A run cannot falsely withdraw committed cleanup. Real forecast locks retain priority.

Paper effects use simulation time, freeze with Pause, hide for protected waits and reset on retry/compaction. Warning strips follow surviving floor geometry and skip maintenance bays. The walking surface never curls or moves; only decorative underside tabs do. The notice is kept between thumb controls on mobile. Eighteen additional rotating remarks cover idle paper, urgency and successful recovery; see `campaign/pressure-feedback.js`.

New remark pools contain **74 unique lines**: 12 notices, 12 warnings, 12 cleanup announcements, 8 maintenance responses and 30 loss remarks. They use the persistent narrator rotation system. The room's twelve background remarks also reflect idle instances, compute utilization and abandoned resources, with the existing randomized placement and reading behavior.

## Verification

```sh
python3 tools/build-mobile.py
node tests/idle-compute.test.mjs
node tests/data-centers.test.mjs
node tests/credits-and-advice.test.mjs
node tests/mobile-parity.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/idle-compute-browser.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/data-centers-browser.test.mjs
```

The targeted tests exercise brief stops, recovery through real forward progress, tiny bursts, left/right wiggling, jumping in place, very slow tapping, and an entire cautious input strategy that runs through jumps and entry receipts but creeps between them. They also verify a zero-death ordinary-input finish after cleanup has already started, a full minute in maintenance, both cleanup stretches, the committed receipt warning/escape window, credit-compaction recovery, frozen loss/pause/required waits, narrator rotation and unchanged action costs.

Browser checks replay the successful chased route in WebKit and Chromium, inspect warning/deletion screens at phone sizes down to 568×320 and toolbar height 280, and check direct practice access and pause. The full twenty-server replay and original fifteen-room PC/mobile parity remain regression checks. The native iOS smoke test also opens the trial, waits for termination scheduling, and pauses the instance.

Evidence is under `outputs/idle-compute/`. Automated success establishes solvability and the tested behavior. Physical-phone control feel, readability under pressure and whether the chase is funny enough remain human playtest questions. Start by trying one careful run and one deliberate creeping run on the same server.

## Source map

- `campaign/idle-compute.js`: compute state, deletion physics/rendering, HUD and voice.
- `campaign/localhost.json` and `campaign/encounters.js`: opt-in recipe, two sections, maintenance bays and entry receipts.
- `campaign/localhost-incidents.json` and `localhost-voice.json`: work order and room identity.
- `campaign/menu.html`, `menu.css`, `runtime.js`: direct practice launch and meter placement.
- Shared PC source: lifecycle, successful simulation updates, collision/trap and drawing hooks.
- `tools/build-campaign.py` / `tools/build-mobile.py`: offline shared PC/mobile/native build pipeline.
