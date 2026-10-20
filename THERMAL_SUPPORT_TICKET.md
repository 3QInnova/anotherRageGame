# Thermal Support Ticket and Puzzle Box

## Localhost 18: Emergency Cooling Approval

The campaign server **18 · Dependencies Disagree** now combines the mechanics into one complete encounter. Open **Menu → Data Centers → Try Localhost 18 · Cooling Incident** for isolated practice, or reach server 18 in the normal campaign. Its stable ID, existing clears and best-credit records remain intact; the directory still contains twenty playable servers.

The route is: forecast → temporary bridge → wall → airborne flag → marked cleanup entry → redaction and scanner during the chase → protected Puzzle Box → cooled heat sink → falling notice, scanner and redaction → exit. The cleanup entry at x2300 starts a truthful six-second warning even during a fast run. Its guide follows 400 pixels behind during that warning, then locks into an advancing deletion edge at expiry. Running beats its 145-pixel/second speed. Other rooms retain their usual sixteen-second idle allowance plus six-second warning.

A single raised workbench at x4300 uses the four-input **SHARED RESPONSIBILITY** board: FAN = `(A OR B) AND (C XOR D)`; DECK = `A AND D`. One safe configuration is A ON, B OFF, C ON, D OFF. The console says **1/1**. Existing preview, TEST, cooling, harness, free actions and frozen deletion apply. The maintenance bay covers the deck footprint, not the hot sink. The sink remains a physical obstacle until cooling succeeds; the final three hazards follow it. Normal campaign completion banks remaining credits and advances to server 19. Practice banks nothing and Restart returns to server 18. Credit exhaustion rewinds before the workbench, resets the box and refills enough to replay it.

Sources: the `puzzle-box` encounter compiler in `campaign/encounters.js`, server 18's recipe/incident/background pools, and shared Puzzle Box/thermal adapters. Use `puzzleBoxEncounter` for campaign mechanics; reserve `puzzleBoxTrial` for standalone identity and restart behavior. Checks: `tests/cooling-incident.test.mjs` and its WebKit/Chromium browser test; artifacts are under `outputs/local-host-puzzle/`. The older three-box practice route remains available. Verified October 19: the ordinary route and forced-chase route clear with zero deaths; WebKit touch and Chromium keyboard routes also clear. Protected minute-long rests, unsafe previews, powered shocks, Pause, two-press loss dismissal, four phone control sizes plus the short 844×280 layout, credit rewind, practice restart and saved advancement to 19 pass. The integrated build is installed and launched on William’s iPhone; physical playtest acceptance remains open. See `outputs/local-host-puzzle/iphone-final-install.json` and `browser-results.json`.

## Comparison level: Puzzle Box

Open **Menu → Data Centers → Puzzle Box · Visible signals & switches**. “Black Box” is reserved for later. The older rotating-chip Thermal Support Ticket remains available separately.

Puzzle Box has three maintenance stations with **3, 4 and 5 ON/OFF input switches**, feeding **3, 4 and 6 fixed gates**. The entire actual circuit is visible. **ANY (OR)** passes either high input, **BOTH (AND)** requires both high, and **ONE ONLY (XOR)** requires exactly one high. Wires have direction arrows, simulation-driven signal pulses, ON/OFF states and input/output indicators. Real shared branches have junction dots; unrelated crossings have clearance gaps. Tap a gate to inspect its actual inputs/output and highlight its incoming paths. The diagram comes directly from the evaluated netlist; there are no hidden rotating backplane contacts.

The target is always **FAN = 1, DECK = 0**. Flip the large A–E buttons (keyboard **1–5**) and trace the result. Preview is unpowered: a displayed DECK 1 cannot shock the player, and a displayed FAN 1 cannot cool the sink. **TEST CIRCUIT / Enter** powers the chosen configuration and locks the inputs for a 1.5-second visible test. A high deck output electrocutes; a safe circuit with the fan OFF returns to editing with a snarky remark. A safe fan-ON result runs the motor, cools the sink over 2.5 seconds and latches **SAFE TO CROSS**. Then choose **BACK TO DECK / Escape**. **X / OPEN BOX** reopens the console while on a deck.

An arriving player automatically opens an unfinished box after landing. The maintenance harness holds the player still while the box is open, avoiding fights with tiny controls while tracing wires. All deck actions remain free, and idle debt and active deletion freeze. Pause freezes test/cooling/pulses too. Outside the workbench, ordinary movement, breeze, heat and the fall/reset rule remain. Leaving an unfinished deck resets its inputs; solved boxes stay cool. Credit exhaustion outside still compacts safely. The practice level never unlocks campaign progress or banks credits, and Retry/Restart returns to Puzzle Box.

The first board teaches ONE ONLY plus BOTH, the second adds ANY and a shared dangerous input, and the third combines two shared ground branches. There are respectively **2, 4 and 5 safe solutions**. The independent oracle checks every one of the **56 input configurations**, including the source/pin mapping of every wire. The level adds **76 unique remarks**, including **16 background notes and 30 shock losses**; shared backgrounds now total **620 unique lines across 40 room pools**. Preserve randomized placement, persistent pool rotation and the fifteen-second loss reading pause.

Sources: `campaign/puzzle-box.js`, shared thermal physics in `campaign/thermal-support.js`, menu/HUD/runtime adapters and the V3 source. Build with `python3 tools/build-mobile.py`. Checks: `node tests/puzzle-box.test.mjs` and `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/puzzle-box-browser.test.mjs`. Current artifacts are under `outputs/puzzle-box/`. Verified October 17, 2026: all 56 circuit states matched the independent oracle; normal and active-cleanup routes cleared all three boxes with zero deaths and four credits left. WebKit/Chromium passed real input/inspection controls, live-test faults, pause/retry, keyboard focus and five phone layouts. Both native builds and installs passed; iOS opened Puzzle Box and passed the broader smoke test. The installed Android WebView reached the deck, inspected the live preview and solved the first box using its controls. Native full-level completion and physical-phone acceptance remain unverified. Build-asset hashes match; existing signing is preserved. Consolidated evidence: `outputs/puzzle-box/validation.json`. Native rebuild/install instructions remain in `CAPACITOR_LOCAL_TESTING.md`; physical-device readability and fun need human playtesting.

## Original rotating-chip comparison level

Open **Menu → Data Centers → Thermal Support Ticket · Cooling & logic gates**. This separate practice level contains three stations with **3, 6 and 10 real Boolean logic gates**, raised switch decks, reversible fans and wide heat sinks. It does not bank credits or unlock campaign servers. Everything remains local.

The user's October 17 correction replaces the pipe-piece implementation with electrical logic ICs. OR, XOR, NOR, AND, NAND and XNOR retain their actual truth-table behavior. Rotating an IC changes its backplane contacts; it never changes the gate into a different type.

## Select first, rotate second

1. Jump onto a raised switch deck.
2. Tap a labeled **U# gate** in the control panel or on the paper circuit. Its gold border matches the paper highlight; the top-center HUD and inspector name the selected gate. **Selection never changes the circuit.**
3. Press the separate **ROTATE U# ↻** button to turn that exact gate clockwise. The ghost action button also says **ROTATE U#**. The same gate stays selected after every rotation.

Before selecting, Rotate is disabled and the ghost action reads **PICK GATE**. There is no automatic advance to another gate. Each selection target and Rotate control is at least 44 screen pixels. On desktop, **1–9 and 0 select U1–U10**, and **X rotates the selection**. Enter activates a focused gate/Rotate button; Space remains Jump.

The inspector shows **input A, input B, computed output Q, destination EN/GND, the gate's plain-language rule, and the next turn's result**. Its preview evaluates the entire circuit, so it can warn that a changed upstream signal would cause a fault at a different gate. Preview and selection alone have no electrical effect.

## Electrical behavior

| Gate | Output Q = 1 when… |
| --- | --- |
| OR | Either input is 1 |
| XOR | The inputs differ |
| NOR | Both inputs are 0 |
| AND | Both inputs are 1 |
| NAND | The inputs are not both 1 |
| XNOR | The inputs match |

The gate symbols have two input pins and one output, with the extra XOR arc and inversion bubbles for NOR/NAND/XNOR. Labels remain upright while the package rotates. High signals are mint, with moving golden pulses; low signals stay muted. A high output connected to GND is red. The circuit board, backplane, ground rail, fan driver and heat-sink fins keep the paper-and-ink art style.

Four authored contact pairs surround each IC. A turn connects its inputs to **VCC (1), GND (0), P (the preceding gate's enable), or !P (its inverse)**. The first gate's P is 1. A socket orientation connects Q either to the gate's **EN** line or to **GND**. A ground-directed Q does not enable the next gate. Every gate must supply a high EN before the fan driver reverses the motor. The fan therefore depends on actual Boolean outputs and preceding signals, rather than matching adjacent pipe ends.

The three boards each have one safe solution. A separate truth-table oracle checks every gate's actual inputs and output in all **64, 4,096 and 1,048,576 rotation configurations**. It also verifies all six standalone truth tables. Safe solutions require all enables high and no ground fault. Get the gates into a valid configuration, balance on the deck, and allow **2.5 simulation seconds** for cooling. **SAFE TO CROSS** then latches the circuit so leaving toward the sink does not undo the solution; rotation is disabled after cooling.

## Ground bus: the platform is part of the circuit

A gate driving **Q = 1 into GND** energizes the rail wired into the platform. A low output directed at GND is harmless until the inputs change and make it high. An upstream edit can change downstream inputs, so inspect the whole-circuit preview.

A live fault sparks on the platform and replaces the top-center selection title with **GROUND FAULT** and an actual countdown. There are **0.65 simulation seconds** to rotate the circuit clear. Correcting it immediately clears the fault clock. Leaving it live electrocutes the player, with the concrete cause shown separately from a rotating snarky remark.

Thirty unique shock remarks exhaust their pool before repeating and retain their cursor across reloads. Examples include “You routed power to ground. Ground was wearing your shoes.” and “Congratulations. You are now the shortest path in the circuit.” Electrocution keeps the fifteen-second reading pause and two distinct Continue/Space/Enter acknowledgments. Pause freezes the fault clock. The observer's eye remains mint.

## Wind, heat and protected decks

Unsolved fans blow left at **36 world pixels/second**, against a running speed of 265. Counter the breeze while choosing and turning gates. After cooling, the push drops to 10 pixels/second.

Leaving an unfinished deck restores its initial gate rotations, full heat, and unselected state. Falling onto the ordinary lower floor is recoverable. Touching a hot sink burns the player. Its 300-pixel width prevents a normal jump from bypassing it; it has real top, side and underside collisions.

On a raised deck, including jumps directly above its footprint:

- **Idle debt and an active deletion edge freeze**, retaining their current values.
- **Jump, Rewrite/rotation and leftward movement use no credits.**
- Wind, logic, current animation, cooling and ground faults remain active.
- **Pause freezes everything**, hides the controls and releases movement inputs.

The lower floor is outside that protection. Leaving resumes ordinary idle and credit rules. Credit exhaustion outside still performs the safe quarter-route rewind/refill. Routine compaction remains disabled in this idle-enabled level.

Mobile places the gate panel on the right and its inspector to the left, above the player and thumb controls. The thermal camera follows the raised decks. All gates are visible together, including the ten-gate board on short landscape screens. Ordinary levels retain their normal framing.

## Voice, sources and checks

The level keeps **116 unique authored remarks**: 24 background notes, 6 introductions, 8 rotation reactions, 6 cooling responses, 12 resets, 30 burn losses and 30 shock losses. Copy now describes real gate rules, enables and selection, removing pipe/elbow instructions. The shared background library remains **620 unique lines across 40 room pools**.

Main source: `campaign/thermal-support.js`. Controls and HUD: `campaign/menu.html`, `menu.css`, `idle-compute.js`, `credits-and-advice.js`, `runtime.js`. Shared physics/keyboard hooks: the V3 HTML source. Mobile: `mobile/mobile-ui.js` and `mobile/viewport.js`. Rebuild with `python3 tools/build-mobile.py`; do not edit generated copies.

Run `node tests/thermal-support.test.mjs` and, with the project's Playwright browser path, `node tests/thermal-support-browser.test.mjs`. The Node check verifies the exhaustive Boolean oracle, explicit selection, fixed selection after rotation, signal coupling, ordinary/chased clears, wind balancing, free actions, frozen idle/deletion, reset, burns, ground-fault rescue/death, reading interval, pause, rewind, practice isolation and restart. WebKit and Chromium replay the clear with touch/keyboard controls, separately test paper/control-panel selection and rotation, and check small layouts, current animation, fault/death/retry, pause and restart. Evidence and current validation are under `outputs/thermal-support/`.

The local iOS and Android apps must be rebuilt and installed after source changes. Run the **App** scheme in Xcode for your connected iPhone, using the existing signing setup. Browser and simulator checks do not establish physical-phone comfort or puzzle clarity; those remain human playtest questions.

Verified October 17, 2026: all six truth tables and all 1,052,736 board configurations matched the independent oracle. Ordinary and active-cleanup routes cleared all stations with zero deaths and four credits left. WebKit/Chromium passed real selection, persistent rotation, paper hit selection, named ghost controls, keyboard activation, five landscape sizes, faults, pause and retry. Campaign/cleanup/credit/background/original-game regressions passed. Both native builds and installs passed; iOS launch/audio/background smoke passed. The installed Android WebView reached the deck through movement inputs and verified selection-only taps plus free, persistent U3 rotation using the named ghost button. Native full-circuit completion and physical-phone acceptance remain unverified. Compiled iOS and Android APK assets match the refreshed bundle; existing signing is preserved. Details: `outputs/thermal-support/validation.json`.
