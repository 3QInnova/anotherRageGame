# EXCEPTION: HUMAN — V2, Trap-Runner Revision

**Status:** Playable, offline, single-file HTML prototype; five rooms.  
**Purpose:** Correct the V1 prototype's main failure: it felt like a point-and-click maze with few reaction challenges or costly surprises.  
**Gameplay reference:** *Level Devil* and other bait-and-switch rage platformers for hidden traps, rapid retries, and near-win reversals. Our differentiator remains a confidently hallucinating AI, whose classifications the player can weaponize.

## The new 5-second hook

1. A deceptively easy platforming route invites the player toward a visible exit.
2. A hidden, position-triggered AI mistake changes the level in a dangerous way: floor drops, spikes materialize, or an overhead “audit” panel falls.
3. The player either reacts/jumps successfully, or fails and sees precisely what happened.
4. Death restarts the room after roughly 0.4 seconds. A remembered warning marker appears at the trap on the next attempt.
5. In subsequent rooms, **X** can turn a non-bridge into a bridge, a barrier into air, or an “artwork” exit into a real exit. The hallucinations expire.

### Inputs

| Action | Keyboard | Touch |
| --- | --- | --- |
| Move | A/D or ←/→ | Left/right buttons |
| Jump | W, ↑ or Space | Up button |
| Hallucinate nearest anomaly | X | X / LIE button |
| Retry room | R | Retry button |
| Optional audio | Sound button | Sound button |

Only three actions are required for the entire game: move, jump, manipulate AI.

## Five micro-rooms

| Room | First-time trap / joke | What mastery requires | AI mechanic |
| --- | --- | --- | --- |
| 1. Unreliable Surface | Perfectly normal floor vanishes; spikes emerge just after you commit | Time two jumps and learn their triggers | AI blames floor subscription |
| 2. Certified Bridge | Wide gap is missing, floor crumbles, first exit is a training decoy | Reclassify missing bridge, cross before expiry, leap crumbling floor, ignore fake exit | VOID → BRIDGE |
| 3. Door, Not Wall | Small pit; overhead audit panel drops; spikes emerge after bottleneck | Jump gap, hesitate to avoid falling panel, erase barrier, jump spikes | WALL → AIR |
| 4. Floor Privileges | Spike fakeout → crumbling run → falling audit → timed long crossing | Chain reactions without panicking; time a bridge under pressure | VOID → BRIDGE |
| 5. Exit Interview | Previous hazards combine; final exit turns out to be a painting | Solve several traps, reclassify wall, and reclassify the exit *after* it gets audited | WALL → AIR, ART → EXIT |

## Why this is more rage-bait than V1

- **Small number of predictable inputs:** frustration comes from deceptions and timing, not confusing controls.
- **Bait, consequence, payoff:** safe visual presentation hides a scripted trap; after one failure the danger is clear.
- **Visible near-misses:** spikes rise just before the character arrives; floor falls from under the player; the exit lies at the last moment.
- **Rapid re-entry:** no lives, currency, loading, or punishment beyond restarting the micro-room.
- **Narrative framing:** the AI expresses ridiculous confidence and blames the player instead of sounding like a generic tutorial.
- **Player agency:** the player can exploit the AI's mistakes with X, giving the game a systemic differentiator beyond traditional troll-platformers.
- **Fair by design:** trap locations and trigger conditions are fixed; no lethal random number generator is used. After dying to a trap, the player sees a persistent hint for that room.
- **Spectator hooks:** short deaths are comprehensible without explanations, and AI dialogue can turn deaths into quotes for clips.

## Core systems (minimal Unity build)

1. **CharacterController2D**: horizontal movement, jump with coyote time and jump buffering; simple collision surfaces.
2. **TrapTrigger**: proximity x-threshold, telegraph time, active interval, learned flag.
3. **FloorService**: union of ground segments minus gap segments and activated crumble zones.
4. **AIHallucination**: nearest-interactable command, semantic transform type, fixed expiry, dialogue lines.
5. **ExitAuthority**: visible door, single near-goal audit, player can restore temporary exit authority via hallucination.
6. **DeathAndRetry**: local respawn, death counter, persistent seen-trap flags for room, no asynchronous work.
7. **Narrator**: authored captions from event templates; optional future language model for cosmetics only.

The engine's physics, traps, and completion decisions must be **deterministic** even if a future LLM supplies jokes.

## Technical implementation details

- Canvas resolution: 960 × 540.
- 2D side-view; five single-screen rooms; movement, jump, timed collisions.
- Data-driven room definitions in a `LEVELS` array.
- Stable fixed-step simulation at 120 Hz; canvas drawing decoupled from simulation.
- A small conditional rule engine triggers hidden traps and reclassification.
- Touch controls for mobile, optional generated beeps, no network or dependencies.
- Death auto-resets around 390 ms after the failure; no progression loss across rooms.

## Validation performed

- Browser load and render in headless Chromium using in-page HTML injection; no JavaScript page errors reported.
- Death/respawn verified by running without jumping into the first trap.
- A deterministic Node simulation followed valid movement, jump, and hallucination inputs through **all five rooms**, completing without teleporting, editing the room state, or bypassing collisions.
- Fixed a final-exit logic bug discovered in automated traversal: reclassification previously got immediately overridden by the exit-audit logic. The audit now fires once, while a subsequent player command can restore the exit.

**Validation limitation:** Automated completion establishes reachability, not fun, difficulty balance, accessibility, or broad browser compatibility. Human playtesting is needed. The example timed input path is not shown to the player.

## Next playtest: what to measure

Test with 5–10 players who have never seen the rooms. Do not explain the traps. Record total deaths, time to clear each room, time from death to retry, where players feel cheated versus responsible, and whether they voluntarily replay. Change trap timing/visibility before adding more content. Target one satisfying surprise per 5–10 seconds; avoid consecutive deaths with no new information.

### Rejected scope (for now)

No LLM control of physics. No online multiplayer. No save service, purchases, procedural generation, combat, progression tree, level editor or story cutscenes. If this prototype is fun, a Unity port should initially replicate the five scenes *exactly*, then tune collisions and add VFX/SFX only after testers enjoy it.
