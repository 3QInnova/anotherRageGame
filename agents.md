# Project guide for agents — EXCEPTION: HUMAN

## Project overview

This workspace, `anotherRageGame`, contains the initial design material and three self-contained browser prototypes for **EXCEPTION: HUMAN**, a rage platformer about an overconfident AI misclassifying reality. The player is an out-of-distribution human who survives the model's mistakes and temporarily rewrites objects to escape.

The latest supplied version is **V3: The Misclassification Update**. Use it as the starting reference for further work unless the user chooses another direction. Its distinguishing mechanic is that AI assertions affect physical space: deleted floors, lethal detection boxes, physical notifications, temporary bridges, and predicted locations that get purged.

The workspace contains HTML prototypes, Markdown notes, screenshots, a playtest archive, and local regression checks under `tests/`. A Python builder generates a separate iPhone browser layout from the PC gameplay source. A local Capacitor app under `apps/native/` packages the generated mobile game for iOS and Android; it has a pinned npm manifest/lockfile and native platform projects. There is no separate game-engine port. V2 discusses a possible Unity port; that is a proposal, not an implemented port or a confirmed engine choice.

## Resources and reading order

Read [full-screen mobile UI plan](MOBILE_UI_REDESIGN_PLAN.md) for the proposed full-window paper world, ghost thumb controls, contextual Rewrite, overlay pause menu, camera/eye alignment risks and implementation gates. This is a design plan only; the moving Jump button is explicitly deferred.

Read [Android and iPhone release plan](MOBILE_RELEASE_PLAN.md) for the recommended Capacitor device proof, shared-source migration, saves/lifecycle requirements, hardware gates, store requirements, and conditional Godot fallback. The first local Capacitor proof now exists; see [local phone testing](CAPACITOR_LOCAL_TESTING.md) for installation, build commands and the Android SDK prerequisite. The iOS simulator checks, Android debug APK build and native Android emulator checks passed; physical iPhone and Android testing remain pending. Keep the `feature/capacitor-mobile` work local: the user explicitly said not to publish to GitHub.

Read [Glass sightline test](GLASS_SIGHTLINE_TEST.md) for the separate practice-only glass lab, four-sided collisions, six optically revealed platforms, 56 remarks, and an ordinary-input completion route. The campaign stays at fifteen rooms.

Read [Six more long levels](SIX_MORE_LONG_LEVELS.md) for rooms 10–15, 72 new themed remarks, all nine long practice choices, and the current one-paywall-per-room cap, which survives retry and compaction.

Read [Fake AI paywalls](FAKE_AI_PAYWALLS.md) for eight AI credit/subscription scenarios, random scheduling, 32 new remarks, two-step free dismissal, frozen-world rules, and per-room interruption budgets. Only imaginary purchases are allowed; do not introduce actual billing or account changes. Billing state is `paywall`; focused trap fixtures disable random billing while full campaign and parity checks exercise it.

Read [Secret Git bounce](SECRET_GIT_BOUNCE.md) for twenty-four floor launchpads across all fifteen rooms, their overhead Git rejection blocks, 32 new loss remarks, jump avoidance, and rewind safety checks. Selected suspicious seams are now real traps; preserve safe decoys elsewhere.

Read [Long-level expansion](LONG_LEVEL_EXPANSION.md) for the feedback-driven addition of rooms eight and nine, direct practice selection, 20 new remarks, and nine-room verification. Room seven's base encounter sequence remains intact; the later secret-commit update adds two marked floor launchpads.

Read [Friends playtest](FRIENDS_PLAYTEST.md) for the separate public repository `3QInnova/exception-human`, with Pages publishing from `main` at the repository root and the account custom-domain URL `https://3qinnova.com/exception-human/`. The user approved public shared-link testing. Source landing page: `playtest/index.html`; builder: `tools/build-playtest.py`; upload folder: `outputs/friends-playtest/repository/`. GitHub connector writes return HTTP 403; browser publication succeeded through the signed-in Firefox session.

Read [iPhone playtest](IPHONE_PLAYTEST.md) for the separate landscape mobile artifact, same-Wi-Fi Safari test, controls, and rebuild instructions. The user explicitly requested that the PC game remain playable; its HTML was preserved byte-identically for this mobile layout work. [Mobile validation](outputs/mobile/VALIDATION.md) records WebKit checks, full campaign parity, and physical-device limits.

The source folder is spelled **`initalDemoDocs/`** on disk. Preserve that spelling when referencing paths.

Read [Game origins and player outcomes](GAME_ORIGINS_AND_PLAYER_OUTCOMES.md) for the earlier research and design history, the V1–V3 evolution, and proposed human playtest criteria. Its earlier-project links provide background, not additional V3 feature requirements.

Read [Researched gameplay additions](RESEARCHED_GAMEPLAY_ADDITIONS.md) for psychology and review evidence, six candidate mechanics, implementation status, and a proposed experiment order. Only candidate 3's forecast feedback is implemented; the other additions remain proposals.

Read [Forecast feedback validation](outputs/forecast-feedback/VALIDATION.md) for the implemented cues, reproducible checks, ordinary-input completion route, screenshots, and test limits.

Read [Object art direction](OBJECT_ART_DIRECTION.md) before changing visuals. The loose V3 now uses perforated document strips, rejection receipts, bound clauses, unbound references, a margin doodle, and a punched output tear. Its [object review sheet](outputs/object-redesign/object-gallery.png) is the current visual reference.

Read [Narrator guide](NARRATOR_GUIDE.md) before changing commentary. Snark is central to the requested replay appeal: retain a large authored library, avoid early repetition, preserve the reading pause, and expand remarks with new hazards.

Read [Fake AI character direction](FAKE_AI_CHARACTER_DIRECTION.md) for the implemented six-stage reactions to successful counterplay, 80 extra responses, and remaining proposals. Preserve the approved background. See [observer validation](outputs/observer/VALIDATION.md) for checks and previews.

Read [Conversation compaction](COMPACTION_DIRECTION.md) for the newly authorized gameplay interruption: a 15-second freeze with falling room fragments, safe random backward return, and trap reset. See [compaction validation](outputs/compaction/VALIDATION.md) for recovery checks.

Read [Tech jokes with simple controls](TECHNO_GEEK_DIRECTION.md) for implemented bad autocomplete and victory error logs. The purple dotted ghost is advisory and has no collision; real purge warnings take priority. Receipts survive retries and compaction, then clear on a full new run. See [tech feedback validation](outputs/tech-feedback/VALIDATION.md).

Read [Longer rooms and involved autocomplete](LEVEL_EXTENSION_DIRECTION.md) for the user-approved 30% extension of all five routes, horizontal camera, added final hazards, and successive walk/jump/wait guesses with disagreement chains.

Read [Certified Probably Safe](FLOOR_HINT_LEVEL.md) for the sixth level combining all five floor-deception ideas and its direct practice button. Preserve honest activation and learned markers. See [floor-level validation](outputs/floor-lies/VALIDATION.md).

Read [Context Window Exceeded](LONG_LEVEL_DIRECTION.md) for room seven: a 12,465-pixel route with twenty encounters, guaranteed compaction, safe rewinds, and its direct practice button. See [long-level validation](outputs/long-level/VALIDATION.md).

Read [False flags and shifting drops](FALSE_FLAG_DIRECTION.md) for the long level's three airborne fake-floor flags and three relocating receipts. Preserve fixed captured targets, truthful revised warnings, and compaction recovery. See [fake-flag validation](outputs/fake-flags/VALIDATION.md).

| Resource | Purpose |
| --- | --- |
| [Local native app](apps/native/package.json), [testing guide](CAPACITOR_LOCAL_TESTING.md) | Capacitor configuration, pinned plugins, iOS/Android projects, local asset builder, native pause/Back adapter and simulator checks. |
| [iPhone browser game](mobile/index.html) | Generated landscape layout with thumb controls, readable remarks, pause menu, rotation and background pause. |
| [Audio direction](AUDIO_DIRECTION.md) | Original procedural score, 22 named cues, Safari activation and lifecycle, preview WAVs, and browser evidence. |
| [Mobile layout source](mobile/layout.html), [mobile UI source](mobile/mobile-ui.js), [builder](tools/build-mobile.py) | Mobile presentation and lifecycle adapters; rebuild instead of editing generated HTML. The PC HTML supplies shared gameplay. |
| [V3 playable prototype](initalDemoDocs/Exception_Human_Misclassification_V3.html) | Latest implementation, including improved forecast feedback; fifteen scrolling rooms, semantic hazards, predictive purge, paper-world art, keyboard and touch input. Read first. |
| [V3 playtest pack](initalDemoDocs/EXCEPTION_HUMAN_V3_Playtest_Pack.zip) | Contains the V3 HTML, V3 design notes, overview screenshot, and forecast screenshot. Read its notes for the latest design rationale and remaining playtest questions. |
| [V3 forecast screenshot](initalDemoDocs/Exception_Human_V3_forecast.png) | Visual reference for room 3's telegraphed predictive purge and the observer's alarm state. |
| [V2 design notes](initalDemoDocs/EXCEPTION_HUMAN_V2_Design_Notes.md) | Explains the move from a maze to a trap runner, fairness rules, possible Unity systems, reported checks, and scope limits. |
| [V2 trap runner](initalDemoDocs/Exception_Human_Devils_Run.html) | Earlier five-room platformer using spikes, collapsing floors, falling audit panels, and temporary reclassification. Useful for mechanical comparison. |
| [V1 maze prototype](initalDemoDocs/Exception_Human_Prototype.html) | Original three-room top-down grid experiment; Space changes every object of a selected kind for four seconds. Historical reference, with different controls and rules. |

### Resources inside the V3 archive

- `EXCEPTION_HUMAN_V3_Design_Notes.md`: latest design goal, hazard mapping, room descriptions, reported validation, playtesting needs, and V4 candidates. This file is currently only inside the ZIP.
- `Exception_Human_Misclassification_V3.html`: original V3 snapshot. The loose HTML now includes forecast feedback changes, so the two versions differ. Preserve the ZIP as the original reference.
- `Exception_Human_Misclassification_V3_preview.png`: room 1 overview; currently only inside the ZIP. Treat the HTML as authoritative for current interface labels.
- `Exception_Human_V3_forecast.png`: byte-identical to the loose forecast screenshot when this guide was created.

Read the archived notes without unpacking the whole bundle:

```sh
unzip -p initalDemoDocs/EXCEPTION_HUMAN_V3_Playtest_Pack.zip EXCEPTION_HUMAN_V3_Design_Notes.md
```

## Gameplay and visual direction

- Keep the core actions simple: move, jump, and rewrite the nearest anomaly.
- Build frustration around readable surprises, timing, and learned counterplay. Hazard physics and trap triggers remain deterministic. The user explicitly authorized seeded random compaction timing and safe return-point selection; see the compaction direction for limits.
- Death pauses the room for a 15-second reading interval with a rotating, hazard-specific snarky remark and the actual failure reason. Two separate Space/Enter presses or two Continue taps skip it; key repeat does not count. This explicit user preference supersedes the initial 0.39-second retry. Learned trap markers survive room retries within the run; they are not a save system.
- Rewrites expire. `NULL → BRIDGE`, `WALL → AIR`, and `ART → EXIT` create short opportunities that the player must exploit.
- Preserve the final exit's one-time audit: the player must be able to restore exit authority with a later rewrite.
- Make the AI antagonist central to both behavior and presentation. Its authored dialogue is confidently wrong and blames the player.
- The loss library has 224 distinct lines, 32 per hazard family, including secret commits and corrupted data. Keep at least 30 per family. Each family exhausts its lines before repeating; cursors survive new runs and, where browser storage permits, reloads. Keep the game functional when storage is unavailable.
- Preserve V3's warm grid paper, document annotations, machine-vision eye, bracketed margin doodle, and objects built from paper and ink. Follow the object art direction instead of importing conventional platformer silhouettes. `reality.json` is an in-world label, not a file or backend dependency.
- The user explicitly approved the current background as a design staple. Keep its warm paper, grid, quiet annotations, restrained palette, and open space. Express the fake AI's frustration through the observer and its marks on the document. Its cosmetic escalation never changes physics or hazard rules; confirmed successful actions drive it, and retries retain composure while a full restart clears it.
- V3 draws detection boxes instead of traditional spikes. Extend its semantic hazard theme when adding content.

### V3 rooms

| Room | Main challenge |
| --- | --- |
| 1. Content Not Found | Jump a redaction and avoid a false-positive scan area. |
| 2. The Implied Bridge | Rewrite NULL into a temporary bridge, clear a redaction, and ignore the suggested exit. |
| 3. Predictive Policing | Jump a pit, avoid a physical notification, rewrite a wall, and bait the predictive purge. |
| 4. Terms Have Changed | Chain scanner, redaction, popup, and temporary bridge challenges. |
| 5. Exit Classification Error | Combine redaction, wall rewrite, prediction, scanner, and the JPG-exit audit before room six. |
| 6. Certified Probably Safe | Decoy approvals, safe warning seams, late corrections, misleading autocomplete, and petty edits beside truthful learned markers. |
| 7. Context Window Exceeded | Twenty encounters including fake floor flags with airborne fields and shifting drops, a guaranteed context-limit compaction, and safe rewind recovery. |
| 8. Cached Confidence | Twenty-four base encounters plus two Git launchpads in a denser walk/jump/bait sequence. |
| 9. Regression to the Mean | Twenty-eight base encounters plus two Git launchpads, four locked predictions, and a longer final gauntlet. |
| 10–15. Token Budget Overflow through Production Ready Probably | Six longer authored gauntlets, 32–40 base encounters each, forecasts, false flags, fixed/shifting drops, two secret launchpads each, and dedicated snark libraries. |

The predictive purge locks a target region using player position and movement direction, telegraphs it, then makes it lethal. Scanning is an approach cue; target capture still happens at the existing trigger. The eye aims at the locked region, which has brackets, a countdown, and a time bar. Surviving the complete purge briefly stamps the prediction as failed. Preserve the opportunity to bait the forecast and move away.

## Running the supplied demo

For the iPhone test, run `python3 tools/serve-iphone.py --port 8765` and open the Mac's Wi-Fi address on port 8765 in iPhone Safari. The server exposes only the mobile page. See the [playtest guide](IPHONE_PLAYTEST.md). Do not claim native mobile readiness from browser automation; physical acceptance is pending user feedback.

Open `initalDemoDocs/Exception_Human_Misclassification_V3.html` directly in a browser. No installation, build step, server, API key, or network connection is required by the prototype. On macOS, from the workspace root:

```sh
open initalDemoDocs/Exception_Human_Misclassification_V3.html
```

| Action | V2 / V3 keyboard | Touch / interface |
| --- | --- | --- |
| Move | A/D or Left/Right arrows | Left/right buttons |
| Jump | W, Up arrow, or Space | Jump button |
| Rewrite nearest anomaly | X | X / REWRITE in V3; X / LIE in V2 |
| Retry current room | R | Retry room button |
| Skip V3 loss reading screen | Space or Enter twice | Continue twice; Retry room also requires two clicks while reading |
| Start long-level practice | — | Practice long level button; unavailable during loss reading or compaction |
| Start floor-hint practice | — | Practice floor hints button; unavailable during loss reading or compaction |
| Restart after winning | R | Retry button |
| Toggle optional audio | Sound button | Sound button |

Touch controls appear for narrow viewports or coarse pointers. Audio starts off. V1 instead uses WASD/arrows for grid movement and Space to classify the tile ahead; it has no platforming jump.

## Implementation map

V2 and V3 embed HTML, CSS, and JavaScript in one file. Canvas 2D generates the art, and Web Audio generates an original optional score and layered effects. No external assets or libraries are loaded.

- `LEVELS`: data for rooms, pits, triggers, hazards, anomalies, rewrite ranges, and durations.
- `initRoom`, `die`, `nextRoom`: room lifecycle, death counters, learned markers, retries, and completion.
- `runFrame`: movement, coyote time, jump buffering, trap transitions, collisions, and exit checks.
- `updateCamera`: keeps the scrolling world bounded within the fixed viewport; room exits, final audit, and exit rewrite anchor include the authored extension.
- `frame`: runs simulation at a fixed 120 Hz and draws through `requestAnimationFrame` on a 960 × 540 canvas.
- `nearest`, `lie`, `active`: select anomalies and manage temporary rewrites.
- `platformList`, `cut`, `barrier`, `hitBarrier`: traversable geometry and temporary barriers.
- V3 `forecasts`, `drawForecast`, `noticeTop`, and hazard drawing functions: prediction, popup motion, and semantic presentation.
- `refreshHud`, `say`, `announce`: diagnostics, narrator captions, and event feed.
- `window.__EXCEPTION_TEST__`: console helpers for state inspection and smoke testing. Despite the source comment calling them read-only, `moveTo`, `jump`, `lie`, and `reset` mutate gameplay state. Teleporting with `moveTo` cannot demonstrate legitimate room completion.

Legacy array names remain in V3: `spikes` represents detection areas, `crumble` represents redactions, and `blocks` represents policy popups. Particle randomness is cosmetic. The explicitly requested compaction mechanic uses a separate seeded generator for its schedule and safe return selection; keep ordinary collision and hazard rules deterministic.

## Working guidance and validation

For native packaging changes, use `npm --prefix apps/native run sync`. Use `ios:build`, `ios:sim`, and `ios:test` for the dedicated iOS simulator; Android SDK 36 and Java 21 are installed in the ignored project cache; use `android:build` and `android:sim` for the dedicated Android emulator. Native assets are generated from the same source; do not edit platform copies. Framework caches, `www`, build outputs and signing keys are ignored. See [native validation](outputs/capacitor/VALIDATION.md). A simulator pass is not physical-device acceptance.

For mobile changes, rebuild with `python3 tools/build-mobile.py`, then run `node tests/mobile-parity.test.mjs` and the WebKit checks in `tests/mobile-browser.test.mjs`. Preserve authored gameplay, narrator libraries, and the approved paper background. Compare desktop checksums when making mobile-only changes. Keep app switching and portrait rotation paused until explicit Resume, and retain the full-remark reading pause. See [mobile validation](outputs/mobile/VALIDATION.md) for tooling paths and evidence.

Read the V3 implementation and archived V3 notes before changing gameplay. Use the V2 notes for background where V3 has not superseded them. Keep prototype history available for comparison; avoid silently applying V1 rules or V2 visuals to V3.

Maintain offline operation and deterministic physics, trap timing, and completion decisions. Compaction is the user-authorized exception for randomized interruptions and safe return placement, with a two-per-room cap and 30-second cooldown. Any future LLM should be an optional narrator with no authority over collisions or level solvability. Multiplayer, purchases, save services, procedural generation, combat, progression trees, level editors, and cutscenes are outside the documented initial scope. V4 ideas in the archive are candidates, not committed requirements.

For gameplay changes, check browser loading and script errors, movement and jumping, trap telegraphs and deaths, retry timing, learned markers, rewrite expiration, and final-exit recovery. Confirm all fifteen rooms remain reachable through ordinary inputs without teleporting or editing state. Exercise touch controls when changing input or layout, and compare visuals with the supplied screenshots when changing presentation.

The V2 and archived V3 notes report historical checks. Current forecast and loss-screen changes have separate Node and Chromium checks, including a saved zero-death input route through all nine rooms. Run `node tests/forecast-feedback.test.mjs`, `node tests/loss-remarks.test.mjs`, `node tests/observer.test.mjs`, `node tests/compaction.test.mjs`, `node tests/tech-feedback.test.mjs`, `node tests/level-extension.test.mjs`, `node tests/floor-lies.test.mjs`, `node tests/long-level.test.mjs`, `node tests/fake-flags.test.mjs`, `node tests/long-expansion.test.mjs`, `node tests/secret-bounce.test.mjs`, and `node tests/paywalls.test.mjs`; see [validation instructions](outputs/forecast-feedback/VALIDATION.md) for the optional browser tooling and evidence. These checks do not establish native mobile support, broad compatibility, accessibility, fun, or originality.

The next documented step is human playtesting: observe deaths and clear time per room, perceived fairness, understanding of X, willingness to retry or replay, and whether predictive purge is more engaging than the other hazards. V2 suggests 5–10 first-time players. Tune timing and readability before expanding content or undertaking an engine port.

When handing off work, identify changed files, explain the resulting behavior, state what was actually checked, and distinguish implemented features from proposals and untested assumptions. Update this guide's resource map and run instructions as the workspace evolves.
