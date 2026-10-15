# Tech jokes with simple controls

Keep move, jump, and X as the only gameplay actions. Tech language belongs in the fake AI's claims and excuses; players should understand each interaction from its visible result without knowing programming.

## Implemented: bad autocomplete

A dotted purple human previews the AI's guess about the player's next movement. It appears while approaching an authored obstacle, once per eligible obstacle per room attempt, and remains fixed at the predicted location. The ghost has no collision, cannot move the player, and grants no movement ability. Its labels explicitly say `AI GUESS: WALK`, `JUMP`, or `WAIT`, and `DOTTED HUMAN = OPTIONAL`.

Successive guesses cycle through walking forward (0.65 seconds), jumping forward (0.5 seconds), and waiting in place (0.65 seconds). The jump target uses the existing jump and gravity constants and shows a curved dotted path. At each deadline, a horizontal difference of at least 48 pixels or a vertical difference of at least 30 pixels rejects the suggestion. Stopping, changing direction, jumping, or continuing forward can contradict the particular guess. Diagnostics track rejected guesses, the current consecutive disagreement chain, and the best chain. Following a suggestion, dying, or compaction breaks the current chain; cumulative results and best chain remain until a new run. A player who dies first earns no rejection; matching the position displays `SUGGESTION FOLLOWED` without claiming a failed prediction.

A rejection shows a short stamp, records an honest receipt, and provokes the observer with one of 20 additional authored remarks. This is cosmetic feedback for player agency, not a difficulty modifier. Real gold/red forecast locks and purges take visual priority: they suppress the ghost. The existing instructions explain the difference between the optional guess and the real lethal region.

Deaths clear the current ghost. Room retries and compaction resets permit a fresh suggestion; compaction freezes its clock before resetting it on restoration. Dialogue cursors retain the existing safe persistence behavior. The approved background drawing remains unchanged. All five rooms now have 30% more start-to-exit distance and a scrolling camera; see [longer rooms and autocomplete](LEVEL_EXTENSION_DIRECTION.md).

## Implemented: victory error logs

The `VICTORY ERROR LOG` panel records actual successful events while the model insists on blaming the user:

```text
#01 / ROOM 1 / AUTOCOMPLETE
EXPECTED: SUGGESTED MOVE → ACTUAL: DIFFERENT MOVE
BLAME: USER
```

| Verified event | AI expectation | Recorded result |
| --- | --- | --- |
| Survive the full forecast purge | HUMAN DELETED | HUMAN SURVIVED |
| Complete a rewritten crossing | COMPLIANCE | HUMAN CROSSED |
| Clear a room | FAILURE | ROOM CLEARED |
| Escape the last room | CONTAINMENT | HUMAN ESCAPED |
| Contradict an autocomplete guess | SUGGESTED MOVE | DIFFERENT MOVE |

The false expectation and blame are the joke. The result is truthful. One event produces one receipt per room attempt through the existing success deduplication. Logs do not count deaths, merely pressing X, or following the ghost as successful counterexamples.

The panel displays the latest three receipts, retains the latest eight in memory for console inspection, and counts all receipts in the run. Room changes, retries, deaths, and compaction preserve them. A full new run clears them. Receipt history is not written to browser storage; only authored-dialogue cursors persist there. The panel sits below the touch controls so a growing history cannot shift movement buttons during play.

## Additional dialogue

The autocomplete pool adds 20 authored responses, bringing the combined libraries to 340: 160 loss remarks, 80 stage/crossing/escape responses, 60 compaction remarks, 20 autocomplete reactions, and 20 false-flag/drop reactions. See the [autocomplete library](outputs/tech-feedback/autocomplete-remarks.json). Example: “The dotted human was considerably more cooperative.”

## Other discussed ideas

Optional unit-test challenges, garbage-collection sweeps, declared patch-note changes, and merge-conflict doors remain proposals. Their presence in the brainstorming conversation does not mean they exist in the current five-room game. The implementation here covers the recommended first two additions: victory logs and bad autocomplete.

## Validation

See [checks and previews](outputs/tech-feedback/VALIDATION.md). These additions are authored design choices; their humor and first-time readability still need human observation.

## Dedicated floor-deception level

Room six, [Certified Probably Safe](FLOOR_HINT_LEVEL.md), uses authored WALK/JUMP/WAIT advice locations to combine misleading walking advice and unnecessary jumping advice with false floor claims. Its brief result stamp allows the second suggestion to appear during a continuous route; narrator reactions and victory logs retain their existing reading behavior. The original five rooms keep their regular action cycle.
