# Feedback labs and demo playlist

Implemented locally October 23, 2026. The first eight levels test proposals from [the rage-loop review](RAGE_LOOP_AND_POLISH_REVIEW.md). **09 · Unreliable Recall** combines them after the user's playtest feedback, with particular emphasis on Forecast Commitment. They do not replace Localhost servers or modify saved campaign clears and banked credits. Billing remains disabled.

## Open the levels

On desktop, open [the PC game](initalDemoDocs/Exception_Human_Misclassification_V3.html) and choose **Feedback labs · 9** in the playing toolbar. On iPhone, choose **Feedback labs · 9** from the Play menu. The shared directory also has a Feedback Labs tab. Scroll to **09 · Unreliable Recall** for the combined route.

Every route uses Move, Jump and Rewrite. Retry, R, automatic death recovery and the win screen's **Retry this lab** keep the selected lab. **Choose another lab** returns directly to the named chooser. The full 15-second loss reading interval and two distinct presses/taps to skip are preserved. Pause freezes all simulation timers. Original levels and the older comparison routes remain available through **More practice** and the original Practice menu.

For phone Safari on the same Wi-Fi, run `python3 tools/serve-iphone.py --port 8765` and open the Mac's Wi-Fi address on port 8765. The generated [mobile page](mobile/index.html) and Capacitor build contain the same gameplay. A browser pass or simulator installation does not establish physical iPhone touch/readability/audio acceptance.

## Local demo playlist

The user called Level 9 perfect and requested a collection to play and record for short videos. Eight new demo episodes build on that benchmark, with different encounter orders, readable reversals and the same drifting/forgetful recall flags. They are a separate collection; **Lab 09 · Unreliable Recall retains its authored route**. There are no unlock requirements. Select **Demos · 8** from the PC toolbar, mobile Play menu or directory, or use the local preview below.

| Demo | Title | Hook |
| --- | --- | --- |
| 01 | Do Not Move | Two bait/retreat crossings, with a landing review between them. |
| 02 | The Safe Landing | Brake after a jump, choose the receipt route, then avoid personally addressed delivery. |
| 03 | Your Exit Is Loading | Transfer a borrowed rewrite, beat the forecast, and refuse the exit department's final receipt. |
| 04 | Saved, Probably | Recover from the false save, then handle a landing, forecast and receipt. |
| 05 | Express Checkout | Waiting works for one receipt; the personal delivery requires leaving its locked column. Two raised shortcuts are available. |
| 06 | One More Signature | A short bridge lease, rewrite handoff and forecast, with an optional upper stamp. |
| 07 | Memory Not Found | Walk below the high field, jump the low one, then deal with delivery, landing and forecast. |
| 08 | The Final Final Test | A longer escalation: forecast, handoff, landing, recoverable save, receipt, forecast and final landing. |

Known-solution clears take roughly **10–27 seconds**, with 15 ordinary-input routes covering every receipt/stamp combination. First-time play and repeated attempts will take longer. Each demo has twelve unique background remarks; a separate 32-line demo loss pool retains the full 15-second reading pause and two-press/tap skip. The AI's initial claims can be wrong; the real activation cues, captured targets and collision geometry remain deterministic.

On a win, **Retry this demo** retains recall and increments the attempt count. **Next demo** starts the following episode with fresh recall; the last episode returns to the playlist. **New run** or selecting the episode again starts fresh memory. Practice scores never modify saved campaign clears or banked credits. Pause freezes every simulation timer. Credit exhaustion still safely rewinds/refills the same demo.

Build and serve only the three preview pages:

```sh
python3 tools/serve-demos.py --port 8766
```

Open **http://127.0.0.1:8766/** on this Mac. The server builds the preview automatically, serves only the playlist and two self-contained game pages, and sends `Cache-Control: no-store`. For a phone on the same Wi-Fi, explicitly bind to the LAN with `--host 0.0.0.0`, then use the Mac's Wi-Fi address. Packaged output stays ignored under `outputs/demo-playtest/site/`. The user selected **local preview first**; this work does not publish the demos or update the installed native app.

PC links open **Recording view**, which fills the browser viewport with the 16:9 playfield while preserving aspect ratio and hides the surrounding page chrome. This changes presentation only. **Esc** pauses and exposes **Exit recording view**, audio and controls. Use a separate screen recorder for footage; the game does not start a recording. Mobile links use the landscape thumb-control layout. Direct links use `#demo=<stable-id>` and optional `&record=1`; unknown IDs do not start a route.

Authored sources: [episodes, remarks and playlist behaviour](campaign/demo-levels.js), [preview template](playtest/demos.html), [packager](tools/build-demo-playtest.py), [restricted preview server](tools/serve-demos.py), plus the shared lab hooks, directory and UI styles. Reproduce the checks after building:

```sh
node tests/demo-levels.test.mjs
node tests/background-voice.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/demo-levels-browser.test.mjs
```

The browser check expects the preview server on port 8766 (override with `DEMO_PREVIEW_URL`). It replays all 15 routes with Chromium keyboard and WebKit touch input, checks player visibility on raised/lower paper, deep links, retry/next/playlist, first-death recall, two-tap loss skipping, pause, short menus and normal animation. It also checks that repository paths are unavailable through the preview server. Captures, route traces and results stay local in `outputs/demo-playtest/`.

## What each level tests

The route tips below reveal the intended answer. Try a level first if you want to judge its initial betrayal.

| Level | What to test | Route tip | Useful feedback |
| --- | --- | --- | --- |
| 01 · Forecast Commitment | A prediction and expiring support force a deliberate retreat. | Enter the forward shelf to capture the gold target, retreat to permanent paper, let the purge finish, then Rewrite and jump across. Jump the final low scan. | Did the death explain why waiting there was wrong? Could you read the fixed target and choose the retreat? |
| 02 · Landing Review | The obvious held-right jump overshoots its safe landing. | Jump the first low scan, release horizontal movement over the safe strip, land, then jump the redaction. | Did braking feel like a skill you could learn? Was the landing visible before you committed? |
| 03 · Cancellation Receipt | A cautious wait competes with a faster raised route. | Ground route: wait behind the notice until it clears. Upper route: jump onto the first raised paper, then jump again to the far paper during the notice sequence. | Did you notice both routes? Was the earlier crossing worth learning? |
| 04 · Rewrite Handoff | Only one object may keep its rewritten state. | Rewrite the bridge, reach the permanent midpoint, then Rewrite the wall. Handing off in the gap removes your support. | Could you tell which object would change and how long you had? |
| 05 · Autosave Betrayal | A recoverable fall creates a bounded setback. | The save stamp's floor deletes. The lower shelf catches you. Return left, jump onto the bank, Rewrite the repair tag, then cross and jump the remaining gap. Retreating before the fall is also valid. | Did you understand the attempt was still alive? Was the return trip funny, tense or simply tedious? |
| 06 · Confidence Review | Three fixed phases combine learned responses. | Bait/retreat/cross, time the second bridge, then brake into the safe landing and jump again. Permanent paper separates the phases. | Did the sequence build tension and feel coherent? Which phase needed clearer teaching? |
| 07 · Impossible Paperwork | A genuinely optional mastery branch. | The ground route reaches the exit without a stamp. For the stamp, climb the two raised papers and stay on the upper pad after the forecast misses. | Did the normal exit feel complete? Did you voluntarily want the extra challenge? |
| 08 · Almost Admitting It | Feedback for actual counterplay and the AI's excuses. | Beat the scan, cross the rewritten bridge and survive the forecast. Cancellation marks, cues and event-specific denials acknowledge the real outcomes. | Did success feel better acknowledged? Did the reactions interrupt play or arrive at the right time? |
| 09 · Unreliable Recall | A combined route with imperfect AI memory of actual deaths. | Bait/retreat/cross; brake into the landing; wait out the receipt or take its raised shortcut; cross then hand off the Rewrite to the wall; recover/repair the false autosave; bait a second forecast; optionally climb for the stamp; brake/land/jump to escape. | Do drifting or absent flags make the AI amusingly unreliable? Are you learning the actual route? Is the second forecast satisfying after everything else? |

## Unreliable Recall

This 4,725-pixel route has five sections with permanent paper between encounters. The opening reproduces the favourite bait/retreat crossing; another appears near the end. The other mechanics interact along the way, with a lower recovery shelf and an optional upper stamp. The AI responds to real successful actions, including catching a fall and repairing the floor. The ordinary route needs no stamp. Scripted clears take about 26 seconds with known answers; this is not a human difficulty estimate.

This flag behaviour is used in the combined lab and the eight demo episodes; the other eight feedback labs and campaign keep their original markers. A fresh run starts without recall flags. Dying to a real obstacle records that obstacle; the first retry after discovering it always shows a purple paper **AI FLAG?**. Its pole sits **30–80 world pixels ahead or behind** the remembered obstacle centre. On later attempts, each remembered obstacle independently has a **28% chance of being forgotten**. Remembering another obstacle does not erase earlier knowledge. Flags remain fixed while playing, drawing and paused; retry or resource compaction chooses a new advisory arrangement. **Retry this lab** after winning also retains knowledge. Reopening the lab in the chooser or confirming **New run** starts fresh memory. Recall is session-local, with no new save key.

These are AI guesses about where a failure happened. They replace exact earned markers in the combined lab and demos, following the user-approved Level 9 direction. The real floor, receipt, scan, captured forecast target and countdown keep their positions and timing. The original eight labs and campaign servers retain their accurate learned markers. Flag randomness uses its own generator and never changes physics or compaction randomness. Absence of a flag is not a promise of safety.

The optional stamp belongs to the current attempt and resets on retry. It never blocks an exit or grants banked credits. Rewrite Handoff tracks the selected object and deactivates the previous object; ordinary campaign rewrite behavior is preserved. Autosave Betrayal changes fictional paper geometry, not real save data.

New labs have no random routine compaction or cleanup meter competing with the mechanic under test. Action credits still apply, including leftward movement; authored reversal allowances are included in their budgets. Exhaustion triggers the existing 15-second resource compaction and safely resets the same lab at its beginning. Every route has spare credits in its verified completion route.

## UI changes

- The desktop has a compact status/narrator area and a complete playfield that fits at 1280×720, 1280×800 and 1280×900. **Menu · Esc** pauses play and opens controls, audio, work orders, observer responses and diagnostics. Practice/retry selections resume appropriately.
- The phone has an untruncated action cue separate from the short narrator caption. Each lab has its own named objective/status panel. Introductory text is not repeated in two overlays. The full remarks remain in the paused AI Log.
- Campaign starts with the current playable servers. Planned centers are under a disclosure. Feedback Labs and More Practice have their own sections; all older routes remain accessible.
- On native Android, Back returns from a directory subview to Campaign before closing the directory. The fixed thumb controls and deferred moving Jump button retain their existing status.

## Implementation and checks

Authored source: [levels, mechanics and remarks](campaign/rage-labs.js), [shared UI styles](campaign/rage-labs.css), [directory](campaign/menu.html), [runtime](campaign/runtime.js), and the shared core hooks in the PC game. The mobile builder regenerates mobile/native assets. The nine labs supply **120 unique background remarks** (24 for Unreliable Recall) and **32 rotating lab loss lines**, preserving the original libraries.

Rebuild and run the focused checks:

```sh
python3 tools/build-mobile.py
node tests/rage-labs.test.mjs
node tests/unreliable-recall.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/rage-labs-browser.test.mjs
```

The Node check verifies fourteen ordinary-input routes, including all four receipt/stamp combinations in Unreliable Recall. It also checks the naive failure cases, fixed captured targets, early transfer and expiration, solid paper sides/undersides, multiple successful landing/retreat timings, pause, same-lab retry, preservation of existing saves/rewards and all nine exhausted-credit recoveries. The recall check learns redaction, receipt and scan deaths, samples 128 attempts, and clears the combined route after a real death with four different recall seeds. Every physics/timing/credit/compaction snapshot matches between those seeds. Knowledge survives credit rewind and clears on a fresh lab run.

The WebKit/Chromium check replays all fourteen routes through touch handlers/keyboard events, checks short viewports and full first instructions, and separately exercises real-time movement and pause. Both browsers also collide with the receipt, use the two Continue taps, show the first flag and exercise 40 subsequent shifting/forgetting attempts. These input routes know the solutions; they establish reproducibility, not human difficulty or fun. The original fifteen-room PC/mobile route, twenty-server campaign, cleanup, cooling, credits, loss/observer/compaction, glass and audio checks are additional regression coverage. Captures and reports stay ignored under `outputs/`.

Native assets are generated with `npm --prefix apps/native run sync`; `ios:build` builds the simulator app. `NativeSmoke.testFeedbackLabsMenu` is a focused native chooser/launch check. Physical route completion, thumb comfort, visual clarity, listening and enjoyment still require the user's feedback.

For this delivery, the Android debug APK and iOS simulator build both passed. All eight labs opened in the focused native iOS UI test. The final simulator app was installed/launched, and its bundled page matches the native web build, iOS/Android platform copies and packaged APK byte for byte. See the ignored [native package hashes](outputs/rage-labs/native-package-hashes.json), [native chooser log](outputs/rage-labs/native-labs.log) and [browser results](outputs/rage-labs/browser-results.json).

At the user's request, the signed device build was installed and launched on **William’s iPhone** on October 23 using the user-confirmed development team **NM3KNV8248**. Debug and Release project settings now retain that team. Its bundled game matches the verified native web build byte for byte. Because iOS rejects upgrades across signing teams, the previous copy's local data was backed up, the app was replaced using the same bundle ID, and its saves/settings were restored before launch. All seven stored progress/settings entries were read back from the phone and matched the backup. The final build launches successfully; the earlier profile-trust error is resolved. The current profile expires October 18, 2027. The other paired phone was untouched, and nothing was published. Evidence stays ignored: [install](outputs/rage-labs/iphone-team-install.json), [launch](outputs/rage-labs/iphone-team-launch.json), [save verification](outputs/rage-labs/iphone-restored-saves-verified.json).

The subsequent **Unreliable Recall** update adds the ninth lab. All nine opened in the native simulator chooser test (one test, zero failures); the combined route and its recall behaviour passed WebKit touch and Chromium keyboard checks, including preserving knowledge when retrying after a win. The final signed build was installed and launched on William’s iPhone using the same confirmed team and bundle identity for an ordinary app update. Its running process was confirmed, and its bundled page matches the native web and simulator builds. Latest ignored evidence: [recall checks](outputs/unreliable-recall/results.json), [native chooser](outputs/unreliable-recall/native-labs.log), [package hashes](outputs/unreliable-recall/package-hashes.json), [iPhone install](outputs/unreliable-recall/iphone-install.json) and [launch](outputs/unreliable-recall/iphone-launch.json).

For feedback, identify the level name, what you expected, what happened, and whether the next attempt felt tempting. A rough 1–7 frustration/control/satisfaction rating is useful, but a description of the exact annoying or satisfying moment matters more.

## Twenty long campaign rebuilds

The user chose the twenty playable Localhost servers first. Their campaign layouts now use the combined Level 9 counterplay: forecasts require a committed bait and retreat, Rewrite handoffs use permanent landings, receipts offer safer waits or faster raised crossings, and false-save failures have repairable lower routes. Purple death-recall flags can drift/forget with the same rules as Lab 9. Fixed geometry and real warnings remain truthful. The nine labs and eight demos retain their original short layouts and routes.

[Campaign preview](http://127.0.0.1:8766/campaign.html) selects any of the twenty for isolated PC/phone practice. [Campaign design and measured times](DATA_CENTER_CAMPAIGN.md) records the 1:16 opening, roughly three-minute later routes and 5:02 finale. Current verification is in `tests/long-campaign*.mjs`; evidence stays ignored under `outputs/long-campaign/`. The rebuild was subsequently installed in place and launched on William’s iPhone with team NM3KNV8248; [device delivery evidence](CAPACITOR_LOCAL_TESTING.md#october-23-rebuilt-twenty-server-campaign-installed) remains local. Nothing was published.

## Test, recording and Cache follow-up

The [nearby-phone test hub and three-Short recording kit](PLAYTEST_AND_RECORDING.md) provide P1–P5 isolated sessions, JSON feedback exports/imports, observer notes and three curated Shorts. All lab/demo clears use the paper clear receipt; practice still banks zero Tokens.

Three Cache Management prototypes are separate from the nine Feedback Labs and eight demos: CACHE HIT, FLOOR MISS; STALE DELIVERY ADDRESS; REFRESH REQUIRED. Each has twelve themed remarks, a distinct speed/layout and a pale cached prior-attempt echo on retry. They leave campaign slots and banked rewards unchanged. Sources: `campaign/cache-prototypes.js`, `playtest/cache.html`; run `tests/cache-prototypes.test.mjs` then its browser check.
