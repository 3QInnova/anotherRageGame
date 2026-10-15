# Six more long levels — October 14, 2026

The campaign now contains fifteen rooms, including nine long levels. The six additions follow the feedback that room seven was hard but fun. They keep the existing move, jump, and rewrite controls, original audio, paper world, honest revised hazard warnings, and long reading pause after losing.

| Room | Name | Authored encounters | Rhythm |
| --- | --- | --- | --- |
| 10 | Token Budget Overflow | 32 + 2 Git bounce tiles | Redactions and grounded scans lead into airborne flags, falling receipts, and locked forecasts. |
| 11 | Merge Conflict Resolution | 33 + 2 Git bounce tiles | Alternating shifting receipts and overhead accusations break up floor jumps and prediction baiting. |
| 12 | Hallucination Pipeline | 36 + 2 Git bounce tiles | Fake floor flags frequently tempt a bad jump; true scans and forecasts punish blindly following the previous answer. |
| 13 | Permission Denied by Default | 34 + 2 Git bounce tiles | Grounded scans, fixed drops, and forecasts repeatedly change which action is safe. |
| 14 | Infinite Retry Policy | 40 + 2 Git bounce tiles | The largest encounter count, with redaction/drop chains and recurring forecasts. |
| 15 | Production Ready Probably | 39 + 2 Git bounce tiles | A final mixed gauntlet combining all six base encounter types. |

These are fixed authored sequences with different gap patterns, not random lethal geometry. Every room is longer than the existing long routes, has its own introduction and margin labels, and guarantees compaction at x=7,600 if no earlier compaction has occurred. Existing compaction limits, safe backward return positions, trap resets, and recovery cooldown remain intact. Two marked caution tiles in each new level launch a grounded player toward a Git-secret rejection block; ordinary jumping avoids them.

## Plenty of snark

Each new room adds twelve unique themed remarks, for **72 new rotating comments**, in addition to six introductions and the existing hazard, death, observer, compaction, and autocomplete libraries. Themes cover token accounting, Git merges, invented facts, permission systems, retries, and dubious production readiness. New section remarks appear every 1,800 pixels; every third section also draws from the general long-level pool. Each theme exhausts its lines before repeating, using the existing persistent narrator rotation. Compaction does not reset remark cursors.

Examples:

- “Your survival has consumed tokens I had earmarked for being right.”
- “I rebased your progress onto an earlier disappointment.”
- “Your survival contradicts six papers currently being imagined.”
- “I applied least privilege. You now have the least floor.”
- “Retrying the same mistake is inefficient unless I do it.”
- “The smoke test passed. The smoke is now a supported feature.”

## Reduced paywall interruptions

The user's request to remove repeated paywall interruptions and limit them to once a level supersedes the earlier two-per-long-room budget. **Every room now permits at most one paywall per run.** Closing it, dying, retrying the room, or having progress compacted cannot allow a second popup in that room. Exhausted rooms do not even schedule another offer. Starting a full new run resets budgets; direct practice starts a fresh practice run. The two-step free-plan dismissal remains one popup occurrence, and all credit/payment actions remain fictional.

## Practice and checks

PC and iPhone Menu selectors offer all nine long levels, rooms 7–15. The campaign proceeds through all fifteen automatically; practice completes only the selected room.

Run `node tests/six-long-levels.test.mjs`, `node tests/paywalls.test.mjs`, `node tests/forecast-feedback.test.mjs`, and `node tests/mobile-parity.test.mjs`. WebKit checks: `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/six-long-levels-browser.test.mjs`. Browser automation demonstrates solvability and interface behavior; human testers still need to assess frustration, readability, and replay appeal.

All six rooms cleared with zero deaths over five seeds and every safe rewind position. All fifteen campaign rooms clear, and 195,062 PC/iPhone snapshots match. All six practice routes also cleared in WebKit in both layouts with exactly one paywall each, actual compaction, and no overflow or script errors.

Evidence is stored under [outputs/six-long-levels](outputs/six-long-levels/). Public playtest: https://3qinnova.com/exception-human/.

Published October 14, 2026: commit `b3d2241ac47016f104ce073cffd49cd94430b5b1`, successful Pages run `38614451187`. All three live page files match the tested package, and both PC/iPhone practice menus load each new level. Refresh the landing page to use `v=20261014-levels15`.
