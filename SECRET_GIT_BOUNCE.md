# Caution tile → secret committed to Git

The user requested that some suspicious floor tiles become real traps: stepping on one launches the player into a **COMMITTED A SECRET / TO GIT** block and causes a loss.

Twelve traps are implemented across all nine rooms: one in each of rooms 1–6 and two in each long room. Existing selected suspicious seams become launchpads in rooms 6–9; the earlier rooms receive matching caution seams on solid floor. Other safe decoys remain.

## Physical rule and counterplay

The tile remains solid. When a grounded player's center enters its marked interval, it applies an upward velocity of −960 px/s. Normal jumping remains −617 px/s. The overhead paper rejection block occupies y=236–280; the normal jump peaks with the player's head around y=295, safely below it. The forced bounce reaches the block, and a real rectangle collision causes the Git-specific loss.

No new action is required. Jump before stepping on the tile, clear its width, and land beyond it. Both approach directions have verified normal-jump avoidance. The normal-input campaign route avoids every launchpad with zero deaths. The existing bridge rewrite remains necessary before the room-four tile.

The tile displays the established caution zigzag and `[ allegedly unsafe ]` claim. On contact it changes to `[ AUTO-COMMIT ]`, draws upward marks, and flashes the Git rejection block. A death retains `BOUNCE → GIT` at the true floor location on retries. The loss screen shows the real failure cause separately from the rotating insult and retains the 15-second reading pause and two-press/tap skip.

| Room | Launchpad x positions | Count |
| --- | --- | --- |
| 1. Content Not Found | 748 | 1 |
| 2. The Implied Bridge | 160 | 1 |
| 3. Predictive Policing | 140 | 1 |
| 4. Terms Have Changed | 870 | 1 |
| 5. Exit Classification Error | 95 | 1 |
| 6. Certified Probably Safe | 444 | 1 |
| 7. Context Window Exceeded | 600, 8040 | 2 |
| 8. Cached Confidence | Selected suspicious hints after encounters 2 and 14 | 2 |
| 9. Regression to the Mean | Selected suspicious hints after encounters 2 and 20 | 2 |

The long-room positions derive directly from those authored hints; exact coordinates appear in [runtime results](outputs/secret-bounce/runtime-results.json). Original moving traps and forecasts retain their rules. The approved paper background and controls are preserved.

## Remarks and compaction

Thirty-two unique Git-specific loss lines bring the loss library to 192 and the combined authored library to 392. The new family rotates and persists using the existing safe storage logic. Examples: “The pre-commit hook has rejected your entire body.” and “You committed without reading the diff. The diff was vertical.”

Retries and compaction reset fired launchpads to idle. Every authored rewind position is outside every launchpad. Recovery routes through the short and long rooms now include the necessary jumps; none relies on disabling a trap or teleporting to finish.

## Verification

- [Node checks](outputs/secret-bounce/runtime-results.json): all twelve tiles launch and physically collide with the block; ordinary jumps clear each in either direction; loss freeze, two acknowledgments, learned markers, reset state, and safe rewind placement pass.
- [WebKit fixtures](outputs/secret-bounce/browser-results.json): caution, launch, block loss, retry, and safe normal jump render on PC and iPhone layouts without script errors or phone overflow. These isolated fixtures suppress unrelated traps and compaction to inspect this mechanic.
- Separately, ordinary-input runs clear all nine campaign rooms with zero deaths. Long practice runs pass across five compaction seeds and all rewind points. PC and mobile match across 58,990 active gameplay snapshots. Chromium campaign and WebKit mobile interaction checks pass.
- Previews: [iPhone launch](outputs/secret-bounce/iphone-launch.png), [iPhone Git loss](outputs/secret-bounce/iphone-git-loss.png), [PC caution](outputs/secret-bounce/pc-caution.png).

Run `node tests/secret-bounce.test.mjs`, `node tests/loss-remarks.test.mjs`, `node tests/forecast-feedback.test.mjs`, and `node tests/mobile-parity.test.mjs`. Browser checks use the existing temporary Playwright/WebKit setup via `tests/secret-bounce-browser.test.mjs`.

The [public playtest](https://3qinnova.com/exception-human/) includes both PC and iPhone versions. Human feedback on this new trap remains pending; solvability checks do not establish its ideal difficulty.

Published commit: `9b804169932a86f6adf52f780e26f95c885906b3`. Pages deployment succeeded, and all three public HTTPS game pages match the tested package. See [deployment evidence](outputs/secret-bounce/deployment.json).
