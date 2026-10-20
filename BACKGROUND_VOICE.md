# The margins are a character

[Puzzle Box](THERMAL_SUPPORT_TICKET.md) adds sixteen signal/switch notes, bringing the current library to 620 unique lines and 40 room pools. Thermal Support Ticket previously added twenty-four cooling/circuit notes. Garbage Collection Day previously added twenty-four and Commitment Lab twelve. Earlier counts below describe the original background-voice delivery.

Background commentary is a permanent EXCEPTION: HUMAN design staple, per the user's feedback. Every future level should be fun to read as well as frustrating to traverse. Keep the approved paper, grid and dimensional landmarks; let the AI leave increasingly personal notes on the document.

## Implemented library

**544 distinct authored background jokes**, in addition to the existing quiet registration stamps:

| Pool | Count | Purpose |
| --- | ---: | --- |
| Level-specific | 432 | Twelve lines for each of the fifteen original levels, the glass lab and twenty Localhost servers. |
| General | 32 | The paper, margins, thumbs, scenery and the AI's confidence. |
| Beyond previous best | 16 | Newly reached ground, including “You didn't make it this far before.” |
| Beyond last failure | 16 | Passing the most recent failed attempt, including “Last time you failed earlier.” |
| Near previous failure | 16 | Recognizing the area where the previous attempt ended. |
| Returning through familiar ground | 16 | Teasing another trip through already traversed scenery. |
| Compaction rewind | 16 | Reacting to a real backward return after the AI summarizes progress. |

[Complete authored library](outputs/background-voice/library.json) · [new-best example](outputs/background-voice/new-best.png) · [previous-failure example](outputs/background-voice/last-time.png) · [level-themed example](outputs/background-voice/tokens.png).

Examples of the room voice:

- Implied Bridge: “Please cross before the bridge changes its mind.”
- Predictive Policing: “Your next position has already disappointed me.”
- Cached Confidence: “The same answer is faster the second time wrong.”
- Token Budget Overflow: “Please fall in fewer syllables.”
- Merge Conflict Resolution: “Both branches blamed you independently.”
- Transparent Excuses: “The support is invisible. The smugness is well lit.”

The Data Center campaign adds 240 authored lines for its twenty Localhost servers. Original remarks are preserved; see [campaign structure](DATA_CENTER_CAMPAIGN.md).

## How it appears

Short two-line notes are printed into the paper as world landmarks. The first room note introduces its theme; later notes mix theme, general and relevant retry contexts. Each composition randomizes note positions, heights and spacing. Recorded progress controls whether a remark is eligible, never its paper location: after a varying travel delay, the remark appears at an independently chosen screen position and anchors there for the attempt. Repeated failures at the same obstacle cannot turn remarks into fixed jump markers. Loss, retry, New Run, level changes and compaction all refresh the layout. Notes keep their text while visible; redrawing does not consume a new joke. Nearby theme notes yield to a progress note instead of piling text on top of it.

The lettering is larger and darker than the decorative stamps, placed below the live caption and away from the thumb controls and eye. Physical objects and hazard cues draw over the background. The comments add no buttons, popups, waits or collision changes. On mobile, encountered lines also enter the paused **AI Log** as `Margin / …` so they can be reread.

Each pool rotates without repeating until it is exhausted. Cursors survive New Run, retries, compaction and reload where storage is available. Unseen offscreen notes do not consume lines. Storage failures fall back to in-memory rotation.

## The AI remembers the appropriate embarrassment

Cosmetic records retain the farthest observed position per room and the relevant failed-attempt position. New-best claims use the previous best captured at attempt start. A weaker latest failure and an older stronger attempt are separate: passing the latest failure does not incorrectly claim an all-time best. Successful clears and manual restarts clear the stale failure comparison; the best-distance record remains.

Compaction notes that imply lost distance require an actual backward return. A compaction at the untouched starting point does not claim the player used to be farther ahead. Records save on meaningful transitions, displayed notes, pause/background and page exit; they are not written every physics tick.

Storage key: `exception-background-voice-v1`. These are local in-game distances and joke cursors, not a resumable run snapshot. Clearing storage clears this cosmetic memory. Nothing requires an AI service or a network connection.

## Required for every future level

1. Add **at least twelve unique, authored, room-specific background jokes** under the new level title in `BACKGROUND_QUIPS.levels`. The regression test enumerates the actual campaign and glass room and fails if a pool is missing or too small.
2. Write to the room's mechanic and vocabulary. Do not fill the quota by swapping a noun into the same sentence twelve times.
3. Preserve the shared progress/return/compaction voice. Let the AI acknowledge what happened and interpret it with absurd confidence, evasive reasoning and petty disappointment.
4. Keep lines at most two wrapped lines of 36 characters at the current 12px monospace style. Test real mobile rendering, not just the character count.
5. Rotate on encounter, keep a note stable while reading it, and preserve cursors on restart. Add contextual categories when a new mechanic creates a new kind of embarrassment.
6. Never pin failure or progress remarks to death/trap coordinates or a fixed offset from them. Randomize the layout on each attempt and compaction, but keep notes stable while being read.
7. Keep physical truths readable: collisions, learned marks, warning targets, budgets and completion remain independent of these remarks. A snarky note cannot revoke an earned success.

This requirement is also recorded in [the narrator guide](NARRATOR_GUIDE.md) and [agent guidance](agents.md).

## Checks and limits

`node tests/background-voice.test.mjs` checks all 544 lines for uniqueness, full rotation cycles, two-line wrapping, complete level coverage, persistence, factual progress contexts, real rewind conditions, stable redraws, 24 distinct repeated-failure layouts, placement independent of failure coordinates, randomized reveal delays and denied-storage fallback.

`tests/background-voice-browser.test.mjs` renders both requested lines, a room-specific joke and AI Log history in WebKit. Its progress scenes intentionally position the player to inspect the artwork; they are not ordinary-input completion evidence. The separate baseline replay still proves unchanged gameplay through all fifteen rooms.

See [validation](outputs/background-voice/VALIDATION.md) for the current native builds and regressions. Human judgments of joke quality, reading comfort and replay appeal remain playtest feedback.
