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

## Token Bank, stickers and Data Center badges

**Implemented locally, October 23, 2026.** PC, generated mobile and packaged native assets share the reward implementation. This local build has not been installed on a physical phone. Saves remain device-local.

### Earning and spending

Keep **Credits** as the allowance inside a level. At a successful exit, convert the newly banked score into **Tokens**, which buy permanent cosmetics. Tokens never refill the next attempt's Credits.

- First campaign clear: **10 Tokens for finishing**, plus **1 Token per remaining Credit**. The completion reward makes a difficult, low-credit finish count too. Deaths before that finish do not reduce either reward.
- Replay: earn only the improvement over the saved best remaining Credits. A first finish with 7 left earns 17 Tokens; a later finish with 12 earns another 5. Matching that best earns 0. Explain this on the receipt before the player chooses to replay.
- Preserve existing eligibility: non-practice original playtest clears also convert improvements over their separate saved bests, as they do today. The new 10-Token first-clear bonus belongs to campaign servers. Practice, labs, demos and archived comparisons remain reward-isolated.
- A purchase permanently unlocks an item. Equipping, changing or removing an owned item is free. Show the item, exact price and **Buy · N Tokens** button together; owned items say **Equip**.
- Keep lifetime earnings/best scores separate from the spendable balance. Spending Tokens must not demote the existing rank titles or erase a record. No reward is confiscated on death, compaction or New run.

Carry the existing saved-credit total into Tokens **1:1**, and award the first-clear bonus for each already-cleared campaign server once. Existing players should see their current progress recognized without replaying it. A previously completed Data Center also grants its badge on migration. Keep this migration and each purchase in one durable reward save so reopening the game cannot duplicate a reward or charge twice. Current storage is device/browser-local; this does not imply PC/iPhone sync.

The starter prices below are implemented; human feedback should guide tuning. The current known-solution Localhost route finishes with 17 Credits in server 1 and 578 across all twenty servers: 27 Tokens on that first clear and 778 across the center with completion bonuses. Those automated routes are economy references, not expected human scores. The twenty completion bonuses alone provide 200 Tokens; the earned center badge never depends on efficiency or purchases. A 10-Token starter sticker guarantees an affordable first purchase after the first campaign clear. Measure actual first-purchase timing before expanding the catalog.

### Small store: Sticker Desk

Open **Rewards / Sticker Desk** from the paused Play menu or **Sticker Desk** on the level-clear receipt. The screen has a visible **Token Bank** and two choices: **Stickers** and **Badges**. Purchases have no effect on collision, speed, action budgets or next-run assistance. Everything is visible at a fixed price; use no random packs, expiring offers or real-money purchases.

The small implemented catalog has three stickers and two purchasable style badges, **200 Tokens total**:

| Sticker text | Tokens | Paper treatment |
| --- | ---: | --- |
| 100% CONFIDENT. 0% CORRECT. | 10 | Crooked confidence stamp |
| I READ THE WARNING. IT LIED. | 20 | Dashed amber caution label |
| WORKS ON MY MACHINE. ALLEGEDLY. | 30 | Folded support-ticket label |


| Purchasable style badge | Tokens | AI description |
| --- | ---: | --- |
| CERTIFIED INCONVENIENCE | 60 | We reviewed your complaint. Unfortunately, you were correct. |
| PLEASE ESCALATE ME | 80 | Your next department has been warned. |

Owned cosmetics decorate the player's paper **clear receipt** and paused reward collection. Equip **one badge and up to three stickers** in fixed slots. This gives recordings a recognizable end card without putting decoration over hazards, action guides or the observer during play. Use the existing warm paper, muted ink, perforations and hand corrections; badges should look like reluctant office certifications. The store inventory and balances are always truthful, even when the AI's caption is snarky.

### Earned Data Center badges

Award a center badge for **all twenty real campaign server clears**, irrespective of deaths, time or remaining Credits. A practice clear does not qualify. Show twenty small server checks on the badge card; the final one gets a short **Badge earned** stamp on the clear receipt. The player chooses Continue normally, without another forced reading interval.

These ten badges are **earned only** and cannot be purchased. Label store style badges and earned center badges clearly. Only Localhost is currently playable; the other nine badge cards must say **Planned Data Center** until their actual campaigns exist.

| Data Center | Earned badge | AI caption |
| --- | --- | --- |
| Localhost | PASSED DESPITE TRAINING | You were supposed to quit during onboarding. |
| Cache Management | STILL WRONG, NOW CACHED | We saved the mistake. You walked around it. |
| Prediction Services | NOT IN THE FORECAST | Your escape falls outside our preferred results. |
| Permission Control | UNAUTHORIZED SUCCESS | We denied the request. You left anyway. |
| Garbage Collection | DELETION REQUEST DENIED | We deleted everything except the problem. You. |
| Merge Conflict | BOTH SIDES BLAME ME | Two departments finally agree on something. |
| Context Storage | TOO STUBBORN TO FORGET | We removed the details. You kept going. |
| Transparency Division | I SAW THROUGH THAT | The walls were clear. Our instructions weren't. |
| Billing Infrastructure | UNPROFITABLE CUSTOMER | You reached the exit without upgrading. Accounting is furious. |
| Production | KNOWN ISSUE: HUMAN | We shipped it. You escaped it. QA has questions. |

The emotional beat is a reluctant admission: the AI awards paperwork proving the player survived its mistakes. Put the accomplishment first, then the joke. Example: **Server cleared → 17 Credits converted + 10 first-clear Tokens → Bank: 27 → Continue / Rewards**. AI caption: “Your reward is adhesive. Please remain grateful.” Sixteen success remarks rotate using the narrator's persistent pool cursors. The receipt also shows the attempt number, attempt time and run death count. Intermediate campaign receipts freeze the next server until Continue; there is no extra forced reading interval.

### Implementation and validation

Use a small versioned local reward record, existing stable level/center IDs and the current clear hooks. Preserve the existing credit records, campaign progress and rank thresholds. The atomic `exception-rewards-v1` record stores credited per-level bests, first clears, owned IDs and equipment. Earned and spent totals are derived from those records and fixed prices; validate prices and ownership rather than trusting interface text. If storage cannot persist, say **Rewards last this session** before a purchase. Never imply account backup or cross-device ownership.

`rewards/catalog.json`, `rewards/runtime.js`, `rewards/ui.html` and `rewards/style.css` supply the shared implementation; the campaign builder inlines them. `tests/rewards.test.mjs` checks first clear, improved/equal/worse replay, duplicate banking, practice isolation, migration twice, purchases/equipment/reload, insufficient funds, malformed/unavailable storage, interrupted legacy writes and all-twenty badge eligibility. `tests/rewards-browser.test.mjs` replays the actual first campaign server into a frozen receipt, buys and equips an item, checks planned badge locks, reloads and exercises desktop Chromium/WebKit and short phone WebKit layouts. Full campaign browser checks acknowledge intermediate receipts through the Continue control.

Evidence is local under `outputs/rewards/`. Installed-app migration, physical touch/readability, price satisfaction and whether the badges are funny still need human feedback. The new P1–P5 nearby-phone test uses isolated saves; it does not spend the owner's Tokens. See [playtests and recording](PLAYTEST_AND_RECORDING.md).

## Unreliable advice

Every attempt and compaction gets a fresh advisory composition. Floor approval/caution stamps vary, including the idle secret-pad claim. Extra floor seams, AI flags and drop claims can be harmless false alarms. Cosmetic seams avoid stacking text over authored physical floor labels.

Autocomplete independently varies the suggested WALK/JUMP/WAIT action, trigger position and lead distance. Some genuine hazard-adjacent offers are omitted; some offers appear in ordinary areas. An appearance no longer reliably means a hidden scanner is just ahead. Each offered dotted prediction stays fixed while the player reads it, and the followed/rejected result still reflects the actual move.

Advisory randomness does not mutate geometry or use the compaction PRNG. Red/gold active scans, locked purge locations, active drop targets, glass collisions and earned learned markers retain their actual meanings. Purple advice is optional. This keeps failures attributable to choosing dubious advice while preserving readable actual danger. The user has since explicitly requested one exception: [Lab 09 · Unreliable Recall](FEEDBACK_LABS.md) replaces its earned markers with drifting, sometimes omitted AI flags after real deaths. Its actual active hazards stay accurate; the eight demo episodes now reuse that user-approved behaviour. Other original levels and campaign servers keep their exact markers.

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
