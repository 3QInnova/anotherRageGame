# Context Window Exceeded

The user requested a level long enough for conversation compaction to run at least once. **Context Window Exceeded** is now room seven in the [playable game](initalDemoDocs/Exception_Human_Misclassification_V3.html), with direct access through **Practice long level**.

## Playable length

The world is 12,600 canvas pixels wide, with a 12,465-pixel start-to-exit route. That is roughly eleven times the length of the current short rooms. At the unchanged walking speed of 265 pixels per second, the raw distance alone requires about 47 seconds, before rewinds, compaction pauses, deaths, or player hesitation.

Twenty spaced encounters mix ten timed redactions, four ordinary scanners, three airborne fields with fake floor flags, and three shifting receipt drops. See [false-flag direction](FALSE_FLAG_DIRECTION.md) for their warning and counterplay rules. Authored false floor claims, suspicious safe spans, autocomplete guesses, paper margins, and section labels maintain the established design. The horizontal camera keeps the objects at their usual readable size. No new controls are required.

## Guaranteed compaction

The context-limit checkpoint is at x=7,000. Crossing it while this room's compaction count is zero starts the existing **Compacting Conversation** sequence. This guarantee does not depend on rolling an early random timer or deliberately idling. If a stall has already caused a compaction, the checkpoint does not demand an additional one.

The interruption retains the 15-second freeze, falling snapshot fragments, authored compaction remarks, safe random backward placement, and trap/rewrite reset. The original two-compactions-per-room cap and 30-second protected interval after restoration remain intact. The normal surprise timer can produce a second interruption during a sufficiently long recovery. Once the budget is exhausted, the player can finish without another interruption.

Possible return positions are 55, 1,170, 2,410, 3,650, 4,890, 6,130, 6,750, 8,610, 10,470, and 12,330. Only positions behind the current player are eligible. All lie on authored safe floor after an encounter or before the first one. The player retains deaths, learned markers, dialogue rotation, victory receipts, and observer frustration according to the existing rules.

## Practice and campaign

The regular campaign now has seven rooms. Both practice buttons end their selected practice room rather than continuing into the next room or claiming the whole campaign was completed. **Practice long level** starts fresh gameplay in room seven, with honest practice completion text. Neither practice button bypasses a loss reading pause or compaction.

A read-only inspection clock, `roomElapsed`, counts simulated time within the room, including compaction. Unlike the resettable `sceneTime`, it remains monotonic across retries and compaction, allowing a real keyboard sequence to be replayed across resets. It has no authority over collisions or hazard timing. Automated campaign replays use a fixed compaction seed; normal play retains randomized per-run scheduling and returns.

## Verification

A five-seed Node check completed normal long-level practice runs with zero deaths and one or two actual compactions each. First compaction occurred at the checkpoint after about 26.2 simulated seconds of continuous movement. Recorded completion times ranged from roughly 63 to 118 seconds, depending on rewinds and whether a second compaction occurred. These are scripted-route times, not a forecast of human playtime.

All ten return positions have a zero-death recovery route. The complete seven-room campaign also clears through ordinary keyboard inputs with actual compaction, retaining the room-five exit audit, floor-deception level, loss reading controls, and existing physics.

The dedicated Chromium practice replay reached the checkpoint, froze and resumed, and cleared with zero deaths in about 70 simulated seconds. Mobile checks cover checkpoint rendering and touch recovery separately. See [validation](outputs/long-level/VALIDATION.md) and [compaction preview](outputs/long-level/falling-context.png).

Difficulty, patience, and whether the rewind feels funny require human playtesting. A long room with a guaranteed pause is now implemented; this does not establish its ideal pacing.

## Later floor-launchpad addition

The user subsequently requested real bounce traps on selected suspicious seams. Room seven now has two additional floor launchpads at x=600 and x=8040, alongside the original twenty encounters. Avoid them with ordinary jumps; standing on one launches the player into a Git rejection block. All five-seed and rewind recovery routes have been updated and pass. See [secret Git bounce](SECRET_GIT_BOUNCE.md).
