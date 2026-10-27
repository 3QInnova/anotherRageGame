# Localhost idle pressure and garbage collection

All twenty servers in the first Data Center now use the idle/deletion behavior playtested in Garbage Collection Day. Open **Menu → Data Centers → Localhost** and play normally, or enable practice to select any server. Stable IDs, existing clears, credit records, and the original fifteen-level playtest remain intact.

The shared allowance is still **16 seconds of accumulated idle time, then a 6-second warning**. Tiny forward steps reduce a little idle debt; sustained new progress reduces it faster. Warning expiry starts deletion behind the player. It does not cause an immediate loss. The edge starts 400 world pixels behind the warning position and advances at 145 pixels/second; rebuilt running paces vary from 235 to 292.

The top-center HUD, paper stamps, forward arrows, curling paper, cleanup countdown and falling fragments appear throughout Localhost. The mint eye and restrained amber tint remain. Existing cleanup, pressure and loss remark pools rotate across the center. Server 01 introduces the rule, the directory identifies cleanup as center-wide, and each Work order explains the safe-rest options.

The rebuilt long campaign has **150 cleanup stretches across twenty servers**, with 4–14 stretches per route. Named acts are separated by permanent maintenance bays. Every false-save recovery also has a protected left bank, so a required return to the repair tag cannot meet a deletion edge. Puzzle Box decks have their own exclusion; the adjacent hot sink is excluded from that protection. Server 18 has nine stretches, and the five-minute server 20 has fourteen.

The old short layouts (26 stretches total) remain in **More practice → Original Localhost**. Their original 1/2/3-stretch structure is covered explicitly by the archived fixtures. New campaign recipes and current route checks are in `campaign/long-localhost.json`, `campaign/long-campaign.js` and `tests/long-campaign.test.mjs`.

All bays occupy permanent floor outside authored hazards. Each is at least 150 pixels wide. Reaching a bay ends the preceding chase; the next stretch keeps a fresh allowance. Backtracking into a bay does not erase debt already accrued in the next stretch. Deleted floor remains deleted until retry or credit compaction.

Pause, phone backgrounding, menus and genuine armed traps that require waiting suspend the timer and deletion edge. This preserves the forecast and falling-notice counterplay in servers 11, 12, 14, 18 and elsewhere. Server 18 also pauses deletion throughout its protected Puzzle Box workbench. Its authored cleanup entry starts four clusters before the Puzzle Box with a six-second warning, with a following 400-pixel guide that locks when deletion begins; ordinary idle allowance elsewhere remains sixteen seconds. Ordinary committed entry receipts still require moving clear rather than waiting beneath them.

Routine random/stall compaction is disabled throughout Localhost while idle cleanup is active. Server 20 uses its fourteen cleanup stretches in place of its former forced context rewind. Credit exhaustion retains the quarter-route safe compaction, refills the remaining action budget and resets cleanup. Jump, Rewrite and leftward costs are unchanged; idle time does not spend credits.

## Sources and checks

- `campaign/long-localhost.json` / `long-campaign.js`: current explicit act sequences, repair banks, workbench exclusions and rest breaks.
- `campaign/localhost.json` / `encounters.js`: retained short comparison layouts.
- `campaign/idle-compute.js` and `pressure-feedback.js`: shared behavior already used by Garbage Collection Day.
- `campaign/runtime.js`: directory and Work order explanations.
- `tests/long-campaign.test.mjs`: current ordinary-input escapes of all 150 stretches, safe repair returns, protected long cooling and resource recovery.
- `tests/localhost-cleanup.test.mjs`: historical short comparisons, all 26 stretches, exact timing/contact, retry, Pause, required waits and minute-long rests.
- `tests/data-centers.test.mjs`: sequential campaign and practice clears across four seeds, saves and stable progression.

Rebuild with `python3 tools/build-mobile.py`. Run the above Node checks and `tests/localhost-cleanup-browser.test.mjs` with the project's Playwright browser path. Evidence is stored under `outputs/localhost-cleanup/`. Keep this work local; physical iPhone feel remains a human playtest step.

Historical verification, October 16, 2026: all 25 original stretches were escaped with zero deaths in the simulation, WebKit touch-handler replay and Chromium keyboard replay. Sequential campaign saves/reload, 20 credit-rewind recoveries, shared pressure and the 195,062-snapshot original-game parity check passed. Both native builds passed. The installed iOS simulator reached live deletion in server 01 and passed the broader audio/background/Resume smoke check. Xcode signing settings were preserved. See `outputs/localhost-cleanup/validation.json` for the consolidated record. Run the **App** scheme in Xcode to update your iPhone.

October 19, 2026: Localhost 18 adds one protected Puzzle Box bay, bringing the center to **26 cleanup stretches**. Node, WebKit touch and Chromium keyboard routes escape every stretch with zero deaths. Campaign progression, credit compaction recoveries and original PC/mobile parity also pass. The integrated build is installed and launched on William’s iPhone; see `outputs/local-host-puzzle/`.
