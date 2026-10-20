# Action credits and unreliable AI advice

Implemented locally on `feature/fullscreen-mobile-ui` in the shared PC/mobile game. No GitHub publishing, real payments, account system or billing popup is involved.

## Player rules

- A successful jump costs **1 credit**. Buffered presses that cannot jump are free. Automatic secret-tile launches are free.
- A valid Rewrite costs **1 credit**, including another Rewrite while a temporary change is already active. A press with no nearby target is free.
- Moving left costs **1 credit per 100 world pixels**. The first actual step left spends the first credit; stopping and tapping do not restart that meter. Pushing against a wall is free. The user explicitly confirmed that leftward movement should cost credits.
- Moving right and waiting are free. Pause menus freeze the world and spending.
- Spending the last credit immediately freezes the world for the existing **15-second compaction**. That final action is interrupted. The return point is the closest authored safe landing at or before a position **25% of the whole route behind the player**, clamped to the start. Sparse landings can produce a larger setback.
- Compaction resets traps and temporary rewrites, rerolls advisory markings and scenery, and refills a budget for the remaining route. Credit exhaustion can compact even after the routine two-compaction limit. It does not add a death or a new attempt.
- Other compactions also refill for their new position, so a surprise rewind does not leave the player with a budget sized for the old position. A credit rewind satisfies the long-level requirement to compact at least once.
- Ordinary death or Retry starts a fresh attempt with the full level budget. New run preserves saved credit records.

The budget counts authored jump obstacles and Rewrite opportunities ahead of the return point, plus **four spare credits**. Glass uses its authored platform sequence. It is a conservative route allowance, not a proven mathematical minimum: some hazards can be waited out, and one jump can sometimes cover multiple obstacles. Every original route, the glass route and all twenty Localhost routes remain completable with ordinary inputs. Human playtesting should tune the four-credit margin and the 100-pixel leftward meter.

The [Idle Compute trial](IDLE_COMPUTE_TRIAL.md) in DC1/server 15 adds a separate consequence for prolonged slow progress: deletion approaches from behind. Waiting still spends no action credits.

## Reward loop

Credits left at the exit are the level's score. Only improvements over that level's saved best add to the permanent total. Example: a best of 4 followed by a finish with 6 adds 2; another finish with 6 adds 0. Practice shows a score without banking it. Original levels and campaign servers have separate stable record IDs.

The total unlocks visible rank titles: Unapproved human, Free trial survivor (20), Efficient troublemaker (60), Senior AI nuisance (120) and Budget breaker (240). These are status rewards; movement strength and collision rules stay consistent. The top-left credit chip shows the balance, low-credit warning and twelve-second reward receipt. Timers sit at the top center, leaving the bottom center clear for a future ad layout. Data Centers shows total/rank, rules and each server's best score.

Records use device-local `exception-credit-records-v1` storage independently of campaign progress. Invalid records are ignored. If storage is unavailable, play and session scoring still work and the directory says credits are for this session. Unfinished balances are not restored after closing the game.

## Unreliable advice

Every attempt and compaction gets a fresh advisory composition. Floor approval/caution stamps vary, including the idle secret-pad claim. Extra floor seams, AI flags and drop claims can be harmless false alarms. Cosmetic seams avoid stacking text over authored physical floor labels.

Autocomplete independently varies the suggested WALK/JUMP/WAIT action, trigger position and lead distance. Some genuine hazard-adjacent offers are omitted; some offers appear in ordinary areas. An appearance no longer reliably means a hidden scanner is just ahead. Each offered dotted prediction stays fixed while the player reads it, and the followed/rejected result still reflects the actual move.

Advisory randomness does not mutate geometry or use the compaction PRNG. Red/gold active scans, locked purge locations, active drop targets, glass collisions and earned learned markers retain their actual meanings. Purple advice is optional. This keeps failures attributable to choosing dubious advice while preserving readable actual danger.

Twenty-four additional credit-exhaustion remarks rotate through the compaction screen. Existing loss/background libraries and reading times are preserved.

## Sources and verification

- `campaign/credits-and-advice.js`: advisory generation, action accounting, safe credit return points, budgets, records, ranks and HUD.
- `campaign/menu.html`, `menu.css`, `runtime.js`: shared in-game chip and score directory.
- PC gameplay source: hooks for actual jumps, Rewrites, left displacement, clear rewards and compaction.
- `tools/build-mobile.py`: builds the campaign module into the PC artifact and regenerates mobile; native packaging uses that same mobile artifact.

Run:

```sh
python3 tools/build-mobile.py
node tests/credits-and-advice.test.mjs
node tests/data-centers.test.mjs
node tests/mobile-parity.test.mjs
node tests/compaction.test.mjs
node tests/glass.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/credits-browser.test.mjs
```

Verification covers action costs and blocked input, all twenty forced resource rewinds followed by ordinary-input completion, safe resource returns in all fifteen original levels and glass, reward persistence/replay protection/practice isolation/storage errors, advisory variation without geometry mutations, and 195,062 matching original-route PC/mobile snapshots. WebKit and Chromium exercise real jump input through exhaustion and refill, the score menu, and the mobile chip with maximum control settings. Existing campaign, compaction, glass, narrator, observer and mobile layout checks also pass.

Local preview evidence: `outputs/credits/`. Native simulator/debug builds are local packages; physical iPhone listening, controls and the new budget's fun factor still need human acceptance.
