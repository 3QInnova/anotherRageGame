# Conversation compaction

The user requested an annoying fake-AI interruption that freezes the room, announces **Compacting Conversation**, drops pixels and objects off the screen, then forgets the player's location and resets traps. This is implemented in the loose [V3 game](initalDemoDocs/Exception_Human_Misclassification_V3.html).

## Trigger and timing

Compaction starts after 25 seconds of active play without advancing at least another 24 pixels beyond the attempt's furthest tracked position. Walking backward and forward over the same ground does not count as new progress.

A second trigger schedules an unsolicited optimization between 35 and 60 seconds into an attempt, even if the player is still making progress. The first eligible trigger starts the sequence. Death reading and compaction do not advance these gameplay timers. Short successful attempts usually avoid compaction.

The interruption lasts 15 seconds of active animation time. Gameplay freezes: the player, hazards, world clock, and rewrite expiration stop advancing. The terminal shows a monospaced computer heading, blinking block cursor, rotating snark, phase text, segmented progress bar, and countdown. Snapshot tiles from the actual room break apart, rotate, and fall away, followed by drifting pixel debris. The familiar paper background returns with the room.

Space, Enter, X, R, the retry button, and touch actions cannot skip the interruption. This is separate from the existing loss screen, which still supports the two-press/tap skip.

## Reset and return

After the pause, the player returns to a randomly selected authored safe floor position behind their current position. Candidates are at least 48 pixels behind, with the room start as a fallback when the player has barely moved. These are constrained return positions, not arbitrary coordinates that could land inside a pit or wall.

| Room | Possible return positions, canvas x |
| --- | --- |
| Content Not Found | 56, 170, 400, 650 |
| The Implied Bridge | 55, 300, 600 |
| Predictive Policing | 50, 210, 550, 640 |
| Terms Have Changed | 55, 315, 490, 620 |
| Exit Classification Error | 55, 160, 335, 480, 720 |
| Certified Probably Safe | 55, 210, 425, 705, 875, 1080 |
| Context Window Exceeded | 55, 1170, 2410, 3650, 4890, 6130, 6750, 8610, 10470, 12330 |

Traps return to their idle states, temporary rewrites clear, fake exits reappear, and the final exit audit resets. Hazards behind the returned player can trigger again on subsequent simulation steps; their usual telegraphs, delays, and collision rules still apply. The player returns grounded and movement input clears.

Compaction does not add a death or an attempt, undo a completed room, erase learned hazard markers, or reset the observer's frustration and survived-forecast count. Dialogue rotation persists.

There are at most two compactions per room per run, with 30 seconds of active play protected after each return. Retrying the room does not replenish that budget. Starting a new run clears it. A per-run seeded random generator handles the schedule, return selection, and fragment variation; ordinary hazard physics remain deterministic. The seed and compaction state are exposed by the existing console inspection hook for debugging.

## Additional snark

Sixty distinct authored compaction remarks bring the combined library to 340 lines: 160 loss remarks, 80 stage/crossing/escape responses, 60 compaction remarks, 20 autocomplete reactions, and 20 false-flag/drop reactions. Compaction has an independent cursor and uses the same safe persistence mechanism. Examples:

- “Important context retained: I was right. Everything else has been optimized.”
- “I remembered your mistakes. Your successes exceeded the context window.”
- “I am not undoing your progress. I am aggressively paraphrasing it.”
- “The traps have requested a fresh start. Their request was approved.”

## Validation and tuning

See [validation and previews](outputs/compaction/VALIDATION.md). Timing and frequency are initial design choices that still need human playtesting. To experience the normal stalled-progress trigger, remain at a safe room-start position for about 25 seconds of active play.

## Guaranteed long-level encounter

Room seven, [Context Window Exceeded](LONG_LEVEL_DIRECTION.md), is long enough for normal compaction scheduling and also has a guaranteed checkpoint at x=7000. If the room has not compacted yet, crossing it starts the existing sequence. The cap and cooldown remain intact, and an earlier stall compaction satisfies the guarantee. A direct practice button makes the long room available immediately.
