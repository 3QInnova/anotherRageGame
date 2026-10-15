# Certified Probably Safe

The user requested a level combining all five floor-deception ideas. **Certified Probably Safe** is now room six in the loose [V3 game](initalDemoDocs/Exception_Human_Misclassification_V3.html). It follows the existing five extended rooms. The **Practice floor hints** button starts a fresh practice run directly in it, making the new work easy to inspect.

## All five elements

| Element | Implementation |
| --- | --- |
| Decoy approvals | Three genuinely solid spans carry the same `[ approved ]` label and underline used by the real redactions. The stamp alone cannot identify a trap. |
| Suspicious safe tiles | Two solid spans have messy seams, `[ allegedly unsafe ]`, and `CAUTION*` annotations. They never remove support or cause damage. |
| Late corrections | The three real redactions change to `[ approval revoked ]` when their fixed warning timer begins. The AI says, “Your safety certification has expired. Convenient timing.” Floor removal still follows the existing countdown and visible active cue. |
| Misleading jump advice | An authored WALK ghost predicts a location inside the first redaction; an authored JUMP ghost crosses the harmless suspicious span. A later WAIT suggestion complicates the approach to the final redaction. Purple autocomplete remains optional and has no collision. |
| Petty learned-marker edits | After a real redaction death, the AI strikes through its old approval and adds “Previously explained.” The honest red learned-trap marker stays visible. Retries and compaction retain it; a full new run clears run knowledge. |

The room has three timed redactions and one real rejection scanner. It uses the established paper-world objects, background, controls, and deterministic hazard timing. The world is 1,210 pixels wide; the start-to-exit distance is 1,085 pixels. It is authored at the current longer-room scale, rather than applying the earlier 30% extension a second time.

The floor's passive claims can lie. Actual activation cues, support geometry, and learned trap locations remain truthful. Brown false-warning seams are visually distinct from a real red active rejection box or removed floor. Existing forecast locks in other rooms retain priority over autocomplete.

## Autocomplete pacing

This room uses explicit WALK/JUMP/WAIT advice locations so the two requested misleading suggestions occur in their intended contexts. Its in-world result stamp lasts 0.4 seconds to allow the next authored suggestion to arrive at the harmless span during a continuous successful route. The separate narrator reaction and victory receipt remain readable until later successful events. Other rooms retain their 1.8-second result stamp. The 15-second loss reading pause and two-press/tap skip are unchanged.

## Retry and practice behavior

All room counters and completion labels now derive from the seven-room level list. The original room-five exit audit and timed exit rewrite remain intact; clearing it leads to room six. Completing the regular run reports seven escaped rooms after the new long room. Completing practice reports that the floor-hint practice was escaped, rather than claiming all six rooms were completed.

The practice button does not bypass a loss reading pause or an active compaction sequence. It starts fresh gameplay and knowledge while preserving the authored-dialogue cursors. Compaction has six authored safe return positions in this room: 55, 210, 425, 705, 875, and 1080. Each has a verified ordinary-input recovery route.

A small attribution fix retains the identity of a floor hole when the player first loses support. Previously, a moving player could drift beyond the hole before the death check, leaving no trap identity for the learned marker. This changes death attribution and knowledge feedback, not movement or collisions.

## Verification and review

See [validation](outputs/floor-lies/VALIDATION.md), [overview](outputs/floor-lies/level-six-overview.png), [needless jump advice](outputs/floor-lies/needless-jump-advice.png), and [petty edit with the learned marker](outputs/floor-lies/petty-edit-and-learned-marker.png).

All seven rooms have a saved ordinary-input zero-death completion route. The new level separately verifies every deception element and genuine death/retry learning. Human observation is still needed to tune hesitation, frustration, readability, and humor.

## Later authorized floor-trap update

The user requested that one suspicious seam in this room actually launch the player into a Git secret-scanning block. The x=444 seam now does that; the x=1050 suspicious seam remains a safe decoy. Normal jumps clear the launchpad. See [secret Git bounce](SECRET_GIT_BOUNCE.md) and the updated completion checks. Earlier descriptions of every hinted span being harmless record the previous version.
