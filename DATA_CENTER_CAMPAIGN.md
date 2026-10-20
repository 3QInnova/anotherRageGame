# Data Center campaign

**Playtest setting:** Fake AI paywall popups are temporarily disabled in the shared PC/mobile/native game at the user’s request. New runs, retries and compaction keep them disabled. The implementation is retained for later review; dedicated billing fixtures explicitly enable it.


Implemented locally on `feature/fullscreen-mobile-ui`, October 16, 2026. Nothing is published.

The campaign structure is **Data Center → server → incident**. The AI transfers a difficult human to supposedly more competent departments. Data Centers are worlds, servers are individual levels, and every fifth server is a longer incident. Fictional MCP tools frame selected incidents without requiring technical knowledge, typing, a connection, or an actual MCP service.

## Workplace-disaster playtest update

Localhost now uses twenty [workplace-disaster identity cards](LOCALHOST_PLAYTEST.md), physical encounter variations, sixty server-specific loss remarks and twenty escape excuses. Its identity is overconfident onboarding. Surviving the broken systems is the objective; formal disproof is optional narrative flavor rather than a required interaction. Existing server IDs/progress are retained.

[Idle pressure and garbage collection](LOCALHOST_CLEANUP.md) now run across all twenty Localhost servers: 16 seconds of idle allowance, a 6-second warning, then deletion behind the player. Longer routes have intermediate maintenance bays. Required trap waits and Pause suspend pressure.

Server **18 · Dependencies Disagree** now integrates traps, a marked six-second cleanup chase, the protected four-input Puzzle Box, a physical cooled crossing and a final escape. Its direct **Try Localhost 18 · Cooling Incident** shortcut opens practice without changing saved progression. See [Puzzle Box integration](THERMAL_SUPPORT_TICKET.md). Normal campaign completion still advances to 19 and banks remaining credits; practice Restart stays in 18.

## What is playable

**Localhost has twenty authored routes: fifteen focused servers, four longer chapter incidents and the extended cooling encounter in server 18.** Two incidents use fictional tool framing, and each server has twelve background remarks (240 total). Its twenty routes have automated ordinary-input completion evidence; fun, pacing, readability and physical-device comfort still need human acceptance.

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
| Orientation | 01–05 | A single redaction, then scan fields, combinations, and an eight-encounter incident. |
| Access | 06–10 | Temporary bridge rewrite, wall rewrite, the secret-commit seam, a mixed route, and `route.optimize` returning unhelpful advice. |
| Prediction | 11–15 | One baitable forecast, falling notices, airborne false flags, shifting drops, then a two-stretch cleanup incident. |
| Disconnect | 16–20 | Revisit rewrites, combine security hazards, cross dependencies, complete an exit interview, then escape `human.contain`. |

The fictional tool name describes an encounter's framing. The real challenge is its authored physical sequence, not a popup or a tool command. Server 10's tool recommends an impossible attitude; server 20's containment result is contradicted by actually reaching the exit. Future tools can use the same approach.

Localhost's idle cleanup supersedes its routine/forced compaction. Credit exhaustion still performs a safe quarter-route rewind and refills the remaining budget. Returns are authored beyond forecasts' stale-trigger regions as well as outside pits and contact hazards. The full loss reading interval remains, and paywalls stay disabled for testing. The original playtest retains its own compaction rules.

## Authoring and offline build

New campaign content is separated from the original single-file prototype:

| File | Responsibility |
| --- | --- |
| [data-centers.json](campaign/data-centers.json) | Stable center/server IDs, titles, role, availability, accent, stamp and transfer voice. |
| [localhost.json](campaign/localhost.json) | Twenty explicit encounter sequences, spacing, introductions, idle-cleanup breaks, Puzzle Box station selection and tool identities. |
| [localhost-incidents.json](campaign/localhost-incidents.json) | Twenty incident cards, optional hints, sixty loss lines and twenty escape excuses. |
| [localhost-voice.json](campaign/localhost-voice.json) | Twelve distinct authored background lines per new server; 240 additional unique lines. |
| [encounters.js](campaign/encounters.js) | Pure reusable compiler for deterministic encounter components and safe return points. |
| [runtime.js](campaign/runtime.js) | Collection switching, progression, directory behavior, practice and save handling. |
| [menu.html](campaign/menu.html), [menu.css](campaign/menu.css) | Shared desktop/mobile directory and planned-world previews. |
| [build-campaign.py](tools/build-campaign.py) | Embeds content/modules/menu into marked regions of the offline desktop artifact. |

Run `python3 tools/build-mobile.py`. It first rebuilds campaign content, then produces the mobile artifact. Native build commands use this same pipeline. Generated campaign blocks in the desktop HTML and all of `mobile/index.html` should be rebuilt from their sources. Core gameplay still lives in the desktop HTML; this is a content-system extraction, not a full engine rewrite.

Every active server needs an authored recipe and at least twelve room-specific jokes. The builder rejects duplicate IDs and catalog/recipe availability mismatches. The existing shared background library now contains **620 unique lines** across 40 playable room pools, including the original game and glass lab. Preserve independent cosmetic placement randomness, stable notes during reading, actual progress eligibility and AI Log history.

To extend the campaign, author and verify the next center's geometry, voice and signature mechanic before marking its entries playable. Extend the recipe input and voice sources in the campaign builder, keeping stable IDs. The compiler locates centers by server ID. Center-completion presentation and transfer pacing should receive a dedicated review when the second center becomes playable.

## Saves and controls

`exception-data-centers-v1` stores completed stable server IDs and the current server ID on this device. Retries, compaction, practice, switching to the original game and starting a fresh attempt do not erase clears. No exact player position, trap phase, cross-device account or cloud save is implied. Storage denial falls back to memory; malformed records are sanitized. Existing original-game remark and background storage keys remain separate.

The desktop directory freezes simulation and releases held input. Mobile opens it through the existing paused menu; closing it returns to that menu until explicit Resume. Choosing a server explicitly starts play. Android Back closes the directory to the pause menu before existing submenu/minimize routing. Death reading, compaction and billing cannot be bypassed by opening the directory.

## Acceptance before the next center

Play Localhost on an iPhone and observe whether the twenty-server arc teaches the controls, whether short rooms feel short, and whether incidents feel like a payoff. Ask players to explain prediction baiting and rewrite expiry in their own words. Track deaths per server and voluntary retries; passing an automated route does not establish appeal or broad fairness.

Build the next center around one tested signature interaction and its counterplay. Keep sixteen focused servers and four incidents per center, avoid copying a route with only a new title, and introduce new components safely before combining them. Moving the Jump button remains deferred.
