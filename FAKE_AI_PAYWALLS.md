# Random fake AI paywalls

**Playtest setting:** Fake AI paywall popups are temporarily disabled in the shared PC/mobile/native game at the user’s request. New runs, retries and compaction keep them disabled. The implementation is retained for later review; dedicated billing fixtures explicitly enable it.


The user requested funny, frustrating paywall interruptions, specifically **AI-service excuses** such as running out of messages, adding credits, and expired subscriptions. Eight authored scenarios are implemented:

| Scenario | The AI's excuse |
| --- | --- |
| Message allowance exhausted | Movement and hesitation count as messages. |
| Subscription expired | Gravity renewed; the AI plan did not. |
| Context storage full | The model's explanation gets storage priority over progress. |
| AI rate limit exceeded | Too many successful requests; buy priority access to the same wrong model. |
| Premium reasoning required | Confidence is included; thinking is an add-on. |
| Model deprecated | The replacement reaches the same wrong conclusion faster. |
| Memory add-on expired | Trap memory is premium; remembering failures is complimentary. |
| Additional AI seat required | The player's two thumbs count as two users. |

All credits, upgrades, renewals, and purchases are imaginary. The game contains no billing SDK, checkout, payment form, or payment request. This does not call an AI service or change an account.

## Dismissal and snark

The overlay pauses the world. **Stay on the free plan** brings up a second, petty confirmation; **Continue without upgrading** resumes play. Enter, Space, or Escape follows that same two-step free path, with distinct-press/key-repeat protection. Clicking the pretend upgrade instead produces an absurd payment response, then the same free Continue button. Both choices preserve progress, deaths, learned markers, traps, rewrites, and character state.

There is no auto-dismiss timer: the player can read the offer and insult at their own pace. Held movement and buffered jumps clear so closing does not activate an accidental action. Movement needs a fresh press afterward. On iPhone, switching apps or rotating still pauses; Resume returns to the billing dialog that was open.

Thirty-two new rotating remarks bring the combined authored remark library to 424. Each offer and confirmation gets a stable remark until the next interaction. Example: “You have exceeded the number of times I can be wrong for free.” Offers draw from an eight-scenario bag without repeating until exhausted, and a new cycle avoids repeating the previous offer immediately. Remarks retain the existing storage-safe rotation.

## Random scheduling and bounds

A separate seeded random generator controls billing schedules and scenario choices. It does not consume the compaction generator. Each short room has a 65% scheduled-offer chance and a cap of one interruption per run. Long rooms schedule offers with a cap of two. Timing varies by an authored progress fraction and a random 10–22-second active-play threshold; eligibility starts after four seconds. After dismissal or compaction restoration, billing has a 20-second active-play cooldown.

The scheduler waits for grounded, stable floor, outside launchpads and nearby active collision regions, without an active rewrite or locked/purging forecast. It does not replace a loss, compaction, or victory. During billing, player physics, hazards, `sceneTime`, rewrite expiration, observer progression, and compaction scheduling freeze. `roomElapsed` remains a monotonic inspection clock for replaying input sequences across interruptions.

Retrying keeps the room's interruption budget; a full restart clears it. Practice and retry controls cannot skip the billing dialog. There is always a bounded free dismissal route. The approved paper background returns unchanged.

## Verification

[Runtime checks](outputs/paywalls/runtime-results.json) verify all eight scenarios, frozen world state, free and pretend-upgrade paths, key-repeat protection, released input, deferred unsafe scheduling, caps, cooldowns, preserved retry budgets, and 32 unique remarks.

The [full campaign route](outputs/paywalls/campaign-results.json) clears all nine rooms with zero deaths while dismissing **eleven actual scheduled paywalls**, plus the existing compactions. [PC/mobile parity](outputs/mobile/parity-results.json) compares the complete gameplay state, including billing state and seed. Long-room practice and every rewind recovery pass over five compaction seeds.

[WebKit checks](outputs/paywalls/browser-results.json) render and dismiss all eight cards in PC and iPhone layouts, exercise free and pretend-upgrade choices, check small landscape screens, and restore an open paywall after app-switch pause. Pretend purchases produce **zero network requests**. Chromium replays the nine-room campaign through actual paywalls; existing mobile input, loss, and rotation checks pass.

Focused older trap tests disable random billing to isolate their original mechanics; billing-enabled campaign, parity, long-practice, and dedicated paywall checks separately establish completion with the feature active. These checks do not establish whether the interruption frequency is ideal for friends.

Previews: [iPhone message limit](outputs/paywalls/iphone-messages.png), [iPhone pretend upgrade](outputs/paywalls/iphone-pretend-upgrade.png), [PC message limit](outputs/paywalls/pc-messages.png).

Run `node tests/paywalls.test.mjs`, `node tests/forecast-feedback.test.mjs`, and `node tests/mobile-parity.test.mjs`. Browser checks use `tests/paywalls-browser.test.mjs` with the existing temporary Playwright/WebKit setup. The public playtest remains [3qinnova.com/exception-human](https://3qinnova.com/exception-human/).

Published commit: `270eeda7c4cae48db3bd8b0329d21e308dcdd52c`. Pages deployment succeeded; all three public HTTPS pages match the tested package. See [deployment evidence](outputs/paywalls/deployment.json) and [live scheduled-offer check](outputs/paywalls/live-results.json).

## October 14 interruption reduction

The user reduced billing interruptions to at most once per level. `PAYWALL_LIMIT=1` now applies to short and long rooms, including all fifteen rooms. The budget survives retries and compaction; exhausted rooms are not rescheduled. Full restarts and a fresh practice run clear budgets. This supersedes all earlier two-popup long-level limits in this document.
