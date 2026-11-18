# Data Center campaign

## November 17 — Escape Localhost release edit

Implemented locally on `feature/escape-localhost-release` following the mobile-director review. The public game now presents one complete twenty-level campaign in four chapters; future-center blueprints and historical demos/labs stay out of its menus. Existing IDs, clears, Tokens and owned cosmetics are retained. First clears award ten Tokens, while replays and optional challenges do not award currency.

Levels 1–5 teach scanners, missing support, temporary bridges, high/low readings and receipt routes. Levels 6–10 develop handoffs, repairs and secret seams. Forecast counterplay and unreliable recall enter at 11; later levels retain sustained authored combinations. All campaign movement uses 265 px/s. Action costs and compaction are disabled in release play, and cleanup appears only as an announced encounter in 15, 18 and 20. The twenty revised routes have about 44.7 minutes of known-solution traversal; a 2–3-hour human first playthrough is still a test target.

Campaign cooling uses two labeled inputs: A powers FAN, B powers DECK. The full three-board Puzzle Box is an optional challenge, alongside newly curated Forecast Commitment / Unreliable Recall routes and Glass Sightline. Each challenge tracks best active time and fewest deaths independently; a deathless finish marks mastery. They remain isolated from campaign progression and currency.

The finale has a real midpoint checkpoint that persists on this device and restores after retry/reload. Its final door audit can be corrected again if Rewrite expires. The closing receipt resolves the escape and grants PASSED DESPITE TRAINING; it does not promise another world. Release deaths show the two-second byte burst, then allow one deliberate Retry whenever the player is ready. Older fixtures keep their historical loss timing.

Validation completed for the release edit: twenty campaign routes and cautious alternatives; all four challenge routes; forty-eight browser route replays across desktop Chromium and phone WebKit; fixed-banner layout checks across forty-two viewport/control combinations; checkpoint retry/reload and final-door expiry recovery; fixed first-clear rewards, legacy ownership migration and challenge isolation; 195,062 original PC/mobile parity snapshots. Fresh-player pacing, physical touch comfort and installed-device listening remain unverified.

Release packaging audit: `tools/build-release.mjs` now bakes only the twenty campaign routes and four approved challenges. Archived geometry, future-center catalogs, developer globals, test controls and level URL selectors are removed from public desktop/mobile/native files. Private authoring and QA fixtures remain under development sources and ignored output folders. The default preview serves only the three release pages; use `--development` explicitly for archives. Native web debugging/logging are disabled, production assets are minified without source maps, and the offline content policy rejects network connections. Local progress and cosmetic balances are still editable on an owner's device; this is not a cheat-proof or security-certification claim.

Packaging validation: public desktop/phone UI, death/retry, malformed-save handling, ignored level hashes, private-path 404s, native asset parity and release allowlists passed. All 48 compiled-engine route replays and 42 banner-layout cases passed. An unsigned iOS simulator **Release** build succeeded; no new device installation or publication was performed. The banner remains a 320 × 50 bottom-center placeholder with 24-pixel inactive clearance, not an integrated advertising SDK.

Sources: `campaign/release.js`, `long-localhost.json`, `long-campaign.js`, shared runtime and existing UI/builders. Use the release validation commands at the top of `agents.md`. This update is built locally, with browser/simulation evidence under ignored `outputs/release/`; it does not establish physical-device acceptance or publication. The older sections below document development history and are superseded where they conflict.


**Playtest setting:** Fake AI paywall popups are temporarily disabled in the shared PC/mobile/native game at the user’s request. New runs, retries and compaction keep them disabled. The implementation is retained for later review; dedicated billing fixtures explicitly enable it.


Implemented locally on `feature/fullscreen-mobile-ui`, October 16, 2026. Nothing is published.

The campaign structure is **Data Center → server → incident**. The AI transfers a difficult human to supposedly more competent departments. Data Centers are worlds, servers are individual levels, and every fifth server is a longer incident. Fictional MCP tools frame selected incidents without requiring technical knowledge, typing, a connection, or an actual MCP service.

## October 23: twenty long Localhost rebuilds

The user chose **the twenty playable Localhost servers first**. All twenty campaign routes now use the Level 9 counterplay model: bait and retreat from locked forecasts; use permanent ground for one-object Rewrite handoffs; choose a receipt wait or a harder raised shortcut; recover from false-save stamps using a lower shelf and a repair tag. Fixed authored act sequences combine those interactions with redactions, entry-triggered notices, shifting deliveries, secret-commit seams, high/low scans and three-step paper paths. Localhost keeps its onboarding departments, green registration ink, forms, grid paper and observer. The other nine centers remain disabled plans.

There are **905 authored encounter clusters**, twenty pace profiles (235–292 px/s), and three to five named acts per route. Geometry, collisions and activation timers remain deterministic. Purple death-recall flags use the user-approved Level 9 exception: first discovery is flagged next attempt, later recall can omit a note (28%) or displace it 30–80 pixels in either direction. Real locked targets and active warnings remain accurate. Ordinary marker behavior outside these rebuilt routes/labs/demos is unchanged.

Times below are **measured zero-death simulation runs using known solutions and the receipt shortcuts**, excluding death-reading and Pause. They are pacing benchmarks, not first-time player predictions. Early servers take about 1–2 minutes, later servers approach three minutes, and the Localhost finale takes five. Cautious ground routes also clear. The user still needs to judge how frustrating and satisfying the longer loops feel.

| Server | Route identity | Clean time | Pace (px/s) |
| --- | --- | --- | --- |
| 01 · Hello Unrecognized World | Reception → Access review → First disconnect | 1:16 | 235 |
| 02 · Floor Not Included | Missing floor → Facilities intake → Footing review | 1:26 | 246 |
| 03 · False Positive Welcome | Visitor classification → Security disagreement → False positives | 1:34 | 239 |
| 04 · Onboarding Exceptions | Form exceptions → Orientation defects → Administrative appeal | 1:44 | 254 |
| 05 · Incident: Tutorial Denied | Reception incident → Workplace response → Conflicting training → Tutorial containment | 1:58 | 249 |
| 06 · Bridge by Assertion | Borrowed support → Contract extension → Temporary confidence → Facilities exit | 2:08 | 261 |
| 07 · Access Is a Suggestion | Access applications → Sealed correspondence → Renewal denied → Doorway dispute | 2:12 | 244 |
| 08 · Pre-Commit Orientation | Secret orientation → Training assessment → Commit review → Security certification | 2:15 | 269 |
| 09 · Terms of Passage | Terms apply → Conflicting clauses → Approval windows → Final conditions | 2:23 | 256 |
| 10 · Incident: Permission to Leave | Optimizer intake → Unhelpful routing → Department escalation → Permission incident | 2:23 | 275 |
| 11 · A Confident Forecast | Attendance forecast → Forecast refinement → Expected objections → Statistical correction | 2:33 | 248 |
| 12 · Notification Delivery | Inbox backlog → Personal delivery → Address correction → Delivery incident | 2:33 | 280 |
| 13 · Airborne Assumptions | Upstairs security → Downstairs security → Altitude dispute → Joint assessment | 2:41 | 263 |
| 14 · Optimization Side Effects | Address optimizer → Revised directions → Customer relocation → Optimization incident | 2:43 | 284 |
| 15 · Incident: Prediction Outage | Instance monitoring → First sweep → Maintenance response → Second sweep | 2:58 | 255 |
| 16 · Readable Interfaces | Short leases → Expiring support → Renewal window → Infrastructure incident | 2:54 | 289 |
| 17 · Security Training Failed | Security refresher → Mandatory retraining → Repeat assessment → Certification incident | 3:01 | 267 |
| 18 · Dependencies Disagree | Dependency intake → Cleanup response → Emergency cooling → Dependency resolution | 3:00 | 276 |
| 19 · Exit Interview | Exit questionnaire → Facilities interview → Counterexample review → Final interview | 2:56 | 292 |
| 20 · Incident: Localhost Escaped | Containment begins → Training escalation → Cooling escalation → Containment failure → Last administrative objection | 5:02 | 277 |

Open the local [campaign preview](http://127.0.0.1:8766/campaign.html). Its PC/phone practice buttons select any rebuilt server without unlocking campaign progress or banking credits. Start campaign plays sequentially with existing stable IDs and saves. `python3 tools/serve-demos.py --port 8766` rebuilds and serves the packaged preview. PC recording view is optional; Escape → Campaign & practice keeps the chooser reachable.

The short twenty-server campaign remains in **Campaign → More practice → Original Localhost**; short server 18 also has an **Original Cooling Incident · Short 18** button. These are isolated comparisons, including same-server Restart. The original fifteen-room playtest, nine labs and eight demos remain available. The rebuilt campaign was subsequently synced, signed with team NM3KNV8248, installed in place and launched on William’s iPhone on October 23. Native assets match the verified build; physical playtesting remains separate. See [device delivery](CAPACITOR_LOCAL_TESTING.md#october-23-rebuilt-twenty-server-campaign-installed).

Current checks: `node tests/long-campaign.test.mjs` (fast/cautious routes, all **150 cleanup stretches**, timing, protected repairs, real death recall, long cooling/Pause/faults and puzzle rewinds); `node tests/data-centers.test.mjs` (sequential saved progression, four seeds, storage fallback, practice isolation); `node tests/credits-and-advice.test.mjs` (all twenty resource rewinds and ordinary-input recovery); `tests/long-campaign-browser.test.mjs` (all twenty Chromium keyboard / WebKit touch clears and mobile framing) and `tests/data-centers-browser.test.mjs` (campaign/save/menu workflow). Evidence is local under `outputs/long-campaign/` and `outputs/data-centers/`. The historical cooling/cleanup/idle suites explicitly use `tests/archived-campaign-fixture.mjs` to cover the retained short comparisons.

## Workplace-disaster playtest update

Localhost now uses twenty [workplace-disaster identity cards](LOCALHOST_PLAYTEST.md), physical encounter variations, sixty server-specific loss remarks and twenty escape excuses. Its identity is overconfident onboarding. Surviving the broken systems is the objective; formal disproof is optional narrative flavor rather than a required interaction. Existing server IDs/progress are retained.

[Idle pressure and garbage collection](LOCALHOST_CLEANUP.md) now run across all twenty Localhost servers: 16 seconds of idle allowance, a 6-second warning, then deletion behind the player. Longer routes have intermediate maintenance bays. Required trap waits and Pause suspend pressure.

Server **18 · Dependencies Disagree** now integrates traps, a marked six-second cleanup chase, the protected four-input Puzzle Box, a physical cooled crossing and a final escape. Its direct **Try Localhost 18 · Cooling Incident** shortcut opens practice without changing saved progression. See [Puzzle Box integration](THERMAL_SUPPORT_TICKET.md). Normal campaign completion still advances to 19 and banks remaining credits; practice Restart stays in 18.

## What is playable

**Localhost has twenty rebuilt long routes**, including four incident identities and integrated cooling in 18 and 20. Each server has twenty-four background remarks (480 total). Its twenty routes have automated ordinary-input completion evidence; fun, pacing, readability and physical-device comfort still need human acceptance.

The other **nine Data Centers and 180 servers are named, organized blueprints**, clearly marked **Planned** in the game and disabled. They do not contain completed layouts. This follows the approved sequence of establishing one full twenty-level center before mass-producing the remaining campaign. The original fifteen-room game and separate glass lab remain playable under **Original playtest**.

Open **Data Centers · Campaign** from the desktop controls or mobile pause menu. **Continue campaign** starts the saved server from its beginning. Normal campaign mode connects servers sequentially; **Practice any playable server** permits direct selection without recording campaign clears. Planned content remains unavailable in practice.

[All 200 server slots](campaign/CATALOG.md) · [current validation](outputs/data-centers/VALIDATION.md).

## Network directory

| Center | Visual and narrative vocabulary | Signature direction | Status |
| --- | --- | --- | --- |
| Localhost | Green registration ink, boot forms, orientation tickets | Teach jump, rewrite, prediction baiting and readable false claims | 20 playable |
| Cache Management | Olive stamps, faded revisions, cached receipts | Stale signs, unreliable scenery and misleading echoes | 20 planned |
| Prediction Services | Muted violet, forecast forms, probability stamps | Fixed target baiting and autocomplete disagreements | 20 planned |
| Permission Control | Ochre ink, access forms, restrictive seals | Temporary rewrite access and explicit expiration windows | 20 planned |
| Garbage Collection | Moss ink, disposal forms, reclaim stamps | Authored dissolving-floor escape sequences | 20 planned |
| Merge Conflict | Dusty rose, conflicting document layers | Branching routes and contradictory processes | 20 planned |
| Context Storage | Slate blue, summaries, redacted transcripts | Compaction and safe authored rewinds | 20 planned |
| Transparency Division | Turquoise ink, glass, broken sightlines | Four-sided glass and optically revealed support | 20 planned |
| Billing Infrastructure | Brass ink, invoices, token accounting | Physical billing jokes; at most one fake paywall per server | 20 planned |
| Production | Rust ink, release forms, failure reports | Combined mechanics and final containment incidents | 20 planned |

Warm paper, restrained ink, grid, tracking eye and snark remain common to every center. Palette changes are accents, not replacement backgrounds. Later centers' unique architecture, audio variations and additional mechanics are design directions, not shipped features. The existing audio remains in Localhost.

## Rhythm and first-center progression

Four five-server chapters use **teach → develop → twist → remix → incident**. The roles describe pacing, not a requirement to invent a new control every chapter. Stable landings between encounters provide breathing room and allow deliberate counterplay.

| Chapter | Servers | Teaching and escalation |
| --- | --- | --- |
| Orientation | 01–05 | Reception, missing support, security disagreements and orientation incidents; 25–34 clusters per route. |
| Access | 06–10 | Temporary bridge rewrite, wall rewrite, the secret-commit seam, a mixed route, and `route.optimize` returning unhelpful advice. |
| Prediction | 11–15 | Attendance forecasts, delivery choices, high/low security and cleanup; 39–54 clusters per route. |
| Disconnect | 16–20 | Revisit rewrites, combine security hazards, cross dependencies, complete an exit interview, then escape `human.contain`. |

The fictional tool name describes an encounter's framing. The real challenge is its authored physical sequence, not a popup or a tool command. Server 10's tool recommends an impossible attitude; server 20's containment result is contradicted by actually reaching the exit. Future tools can use the same approach.

Localhost's idle cleanup supersedes its routine/forced compaction. Credit exhaustion still performs a safe quarter-route rewind and refills the remaining budget. Returns are authored beyond forecasts' stale-trigger regions as well as outside pits and contact hazards. The full loss reading interval remains, and paywalls stay disabled for testing. The original playtest retains its own compaction rules.

## Authoring and offline build

New campaign content is separated from the original single-file prototype:

| File | Responsibility |
| --- | --- |
| [data-centers.json](campaign/data-centers.json) | Stable center/server IDs, titles, role, availability, accent, stamp and transfer voice. |
| [long-localhost.json](campaign/long-localhost.json), [long-campaign.js](campaign/long-campaign.js) | Active twenty-route act sequences, pace, duration targets, measured benchmarks, safe maintenance and marked chases. |
| [route-pieces.js](campaign/route-pieces.js) | Shared deterministic paper encounter clusters for campaign and demos. |
| [localhost.json](campaign/localhost.json) | Retained short campaign comparison recipes. |
| [localhost-incidents.json](campaign/localhost-incidents.json) | Twenty incident cards, optional hints, sixty loss lines and twenty escape excuses. |
| [long-localhost-voice.json](campaign/long-localhost-voice.json) | Twenty-four lines per active server. The original twelve-line pools remain in `localhost-voice.json` for short comparisons. |
| [encounters.js](campaign/encounters.js) | Pure reusable compiler for deterministic encounter components and safe return points. |
| [runtime.js](campaign/runtime.js) | Collection switching, progression, directory behavior, practice and save handling. |
| [menu.html](campaign/menu.html), [menu.css](campaign/menu.css) | Shared desktop/mobile directory and planned-world previews. |
| [build-campaign.py](tools/build-campaign.py) | Embeds content/modules/menu into marked regions of the offline desktop artifact. |

Run `python3 tools/build-mobile.py`. It first rebuilds campaign content, then produces the mobile artifact. Native build commands use this same pipeline. Generated campaign blocks in the desktop HTML and all of `mobile/index.html` should be rebuilt from their sources. Core gameplay still lives in the desktop HTML; this is a content-system extraction, not a full engine rewrite.

Every active server needs an authored recipe and at least twelve room-specific jokes. The builder rejects duplicate IDs and catalog/recipe availability mismatches. The existing shared background library now contains **1,112 unique lines** across 60 active room pools, including the original game and glass lab. Preserve independent cosmetic placement randomness, stable notes during reading, actual progress eligibility and AI Log history.

To extend the campaign, author and verify the next center's geometry, voice and signature mechanic before marking its entries playable. Extend the recipe input and voice sources in the campaign builder, keeping stable IDs. The compiler locates centers by server ID. Center-completion presentation and transfer pacing should receive a dedicated review when the second center becomes playable.

## Saves and controls

`exception-data-centers-v1` stores completed stable server IDs and the current server ID on this device. Retries, compaction, practice, switching to the original game and starting a fresh attempt do not erase clears. No exact player position, trap phase, cross-device account or cloud save is implied. Storage denial falls back to memory; malformed records are sanitized. Existing original-game remark and background storage keys remain separate.

The desktop directory freezes simulation and releases held input. Mobile opens it through the existing paused menu; closing it returns to that menu until explicit Resume. Choosing a server explicitly starts play. Android Back closes the directory to the pause menu before existing submenu/minimize routing. Death reading, compaction and billing cannot be bypassed by opening the directory.

## Acceptance before the next center

Play Localhost on an iPhone and observe whether the twenty-server arc teaches the controls, whether early routes fit the 1–2 minute goal, later routes approach three minutes, and the five-minute finale earns its length. Ask players to explain prediction baiting and rewrite expiry in their own words. Track deaths per server and voluntary retries; passing an automated route does not establish appeal or broad fairness.

Build the next center around one tested signature interaction and its counterplay. Keep sixteen focused servers and four incidents per center, avoid copying a route with only a new title, and introduce new components safely before combining them. Moving the Jump button remains deferred.

## Clear receipts and the next expansion

Every campaign clear now pauses on a paper receipt with attempt time/deaths, leftover Credits, Tokens gained, the spendable bank and rotating AI excuses. Continue starts the next server. First clears add 10 Tokens once; improved best scores add only their difference. The paused Rewards menu opens the Sticker Desk. All twenty Localhost clears earn PASSED DESPITE TRAINING. See [reward rules](CREDITS_AND_UNRELIABLE_HINTS.md#token-bank-stickers-and-data-center-badges).

Three separate [Cache practice prototypes](PLAYTEST_AND_RECORDING.md#cache-prototypes) test stale instructions and a pale prior-attempt echo, with different layouts and speeds. These do not unlock the twenty planned Cache campaign slots. The nearby-phone P1–P5 flow uses isolated saves and first-three-servers → Lab 9.
