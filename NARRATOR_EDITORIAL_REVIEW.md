# Narrator clarity pass

Reviewed locally on October 16, 2026. Current PC, mobile and native sources share the revised copy. Nothing published.

## Editorial direction

Snark should be understood on the first reading. Start with something the player can recognize: a floor disappearing, a scanner rejecting them, a notice falling, a rewrite expiring, a bad suggestion, or the AI refusing to admit a mistake. A technical reference should make that situation funnier, not require an explanation before the joke works.

The pass revises **523 distinct strings** across the original narrator, background notes, Localhost voice and incident cards, introductions, scenery stamps and retained disabled billing copy. All active pools were read, including the shared and level-specific background pools. The exported inventory contains 1,460 entries, including reused pool entries and offer metadata; it is not a claim of 1,460 unique jokes.

## Examples

| Before | After |
| --- | --- |
| The seal has confused authority with thickness. | The wall says NO. Rewrite says AIR. |
| Your solution is idempotent. My resentment is accumulating. | Your plan keeps working. My excuses are running out faster than your retries. |
| Your landing token has an unfortunate scope. | Your landing permission excludes useful destinations. |
| Your feet have approved a speculative dependency. | Empty space was cheaper. You insisted on support. |
| Your trajectory has been forwarded to enforcement. | I have sent your expected location to the delete team. |
| All five rooms? That is an excessive number of counterexamples. | You reached the exit? That is an excessive response to my instructions. |
| The door returned to being an opinion with thickness. | The doorway works occasionally. Management considers that sufficient. |

## Context corrections

- Shared successful-rewrite responses now work for either a bridge or a wall, without claiming the player crossed a particular object.
- Shared glass-contact comments do not assume every contact was a head bump or a successful landing.
- Air-flag warnings describe the revised field without announcing that the player has already jumped into it.
- Localhost loss pools refer to the room's disaster broadly enough to fit its different hazards. The actual failure reason remains separate and truthful.
- Background room notes do not announce a particular successful action before the player has performed it.
- Removed the stale five-room escape count.
- The user's two favorite progress lines remain unchanged: “You didn't make it this far before.” and “Last time you failed earlier.” Their eligibility still uses actual recorded progress.

## Preserved behavior

The library remains large: **544 unique background lines**, twelve per playable room pool; **224 original hazard loss lines**; **60 Localhost-specific loss lines**; and the existing success, compaction, autocomplete, glass and other libraries. Pool lengths/order and cursor keys are preserved, so updating the words does not restart rotation or remove variety.

The loss reading pause, skip controls, gameplay, geometry, trap timing, audio fix, saved progression and randomized background-note placement retain their existing behavior. Paywalls stay disabled.

## Validation

Content/behavior checks pass for background uniqueness and two-line wrapping, original loss rotation and persistence, observer reactions, compaction and safe return routes, glass collisions and optical clues, and all twenty Localhost routes. PC/mobile parity matches 195,062 original-campaign snapshots. Mobile WebKit and desktop Chromium checks pass progress remarks, AI Log, work orders and the full new campaign replay. Both native packages are rebuilt; this wording-only pass does not claim a new physical-device listening or humor acceptance result.

[Complete revision record](outputs/narrator/editorial-review.json) · [reviewed runtime library](outputs/narrator/reviewed-library.json).

## Rules for future comments

1. Identify the visible object, understandable situation or actual event behind the joke.
2. Prefer everyday wording. Keep technical references when the game shows what they mean.
3. Avoid several layers of metaphor in one sentence. A floor, a policy and a deadline can make one joke; they do not need a theory of authority too.
4. Keep backgrounds readable in two short lines and retain ample unique authored remarks.
5. Treat shared pools as shared: no wall-specific result in a bridge response, no head-bump claim on a landing, and no invented prior failure.
6. Keep hints and actual failure reasons readable even when the AI's excuse is dishonest.
7. Read each new line aloud. If explaining it takes longer than reading it, rewrite it.
