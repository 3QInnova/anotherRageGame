# Longer rooms and involved autocomplete

The user confirmed that all five levels should become 30% longer. The loose [V3 game](initalDemoDocs/Exception_Human_Misclassification_V3.html) now extends each start-to-exit distance by 30%, rounded to the nearest canvas pixel. This measures playable horizontal distance, not completion time.

| Room | Previous distance | Current distance | Added challenge |
| --- | ---: | ---: | --- |
| Content Not Found | 833 px | 1,083 px | Another timed redaction |
| The Implied Bridge | 840 px | 1,092 px | Another rejection scanner |
| Predictive Policing | 845 px | 1,099 px | Another timed redaction |
| Terms Have Changed | 842 px | 1,095 px | Another rejection scanner |
| Exit Classification Error | 834 px | 1,084 px | Another timed redaction before the exit audit |

The original encounter positions, jump physics, and rewrite durations remain intact. Each room gains an authored final section with a real hazard, additional autocomplete opportunities, and its exit farther right. The final exit's rewrite anchor and one-time audit move together. Restoring exit authority after the audit remains possible with X.

The canvas stays 960 × 540. A bounded horizontal camera follows the player while the paper background, observer, and header retain their approved presentation. World objects retain their original size. The header reports route progress; the new section is marked as an appendix below the floor.

## More involved autocomplete

Autocomplete can now issue multiple guesses per attempt, one per eligible obstacle rather than one per room. Each offered guess advances a readable cycle:

1. **WALK:** predicts continued forward walking for 0.65 seconds.
2. **JUMP:** predicts a forward jump, with a curved dotted path and a 0.5-second target position derived from the same jump/gravity constants as the player.
3. **WAIT:** predicts staying at the current position for 0.65 seconds.

Targets stay fixed after being drawn. A guess is contradicted when the deadline finds the player at least 48 pixels away horizontally or 30 vertically. The AI acknowledges a matching jump or wait as followed; it cannot claim every action was a rejection. Only one guess appears at a time, and its result lasts 1.8 seconds. Real locked/purging forecast cues suppress autocomplete.

Diagnostics show the current action guess, or the number rejected, current disagreement chain, and best chain in the run. Consecutive contradictions build the chain; following a suggestion, dying, or compaction breaks the current chain. The best chain and cumulative counts survive those events and room changes. A full restart resets them. Existing authored reactions and victory receipts reward rejection without adding a button, changing collisions, or creating a mandatory objective.

These are deterministic authored suggestions rather than a learning model. The richer behavior comes from varying the claimed action and letting the player build a sequence of visible counterexamples.

## Verification

- All five extended rooms clear through ordinary inputs with zero deaths in Node and Chromium.
- Every authored compaction return point has a zero-death recovery route through the extended room.
- Separate checks verify walk/jump/wait outcomes, honest matching-jump feedback, chain growth/reset, fixed targets, and receipt continuity.
- Camera bounds, 30% distance growth within rounding, added hazards, and final-exit audit/anchor alignment are checked in `tests/level-extension.test.mjs`.
- Existing loss reading, skip controls, forecast cues, observer stages, and compaction checks pass.

See [length measurements](outputs/tech-feedback/level-length-results.json), [updated validation](outputs/tech-feedback/VALIDATION.md), [jump-guess preview](outputs/tech-feedback/guess-jump.png), and [room-five scrolling preview](outputs/tech-feedback/extended-room-5.png).

Human playtesting is still needed to tune autocomplete frequency, whether the chain feels rewarding, and whether the added distance has the desired pacing. This implementation does not claim a 30% increase in playtime or difficulty.
