# iPhone layout validation — October 13, 2026

## Nine-room update

The subsequent authorized gameplay expansion adds rooms eight and nine to both PC and mobile. The current source checksum is `ffdb53d47e27399683f283e47c6a371cb6789ef39cdda32114a803ab35fe1f31`; the older unchanged-PC checksum below records the mobile-layout-only milestone. The builder still leaves its PC input unchanged.

The expanded campaign matches across 58,849 active PC/mobile gameplay snapshots, with zero deaths and two compactions in each of rooms seven, eight, and nine. WebKit ordinary-input practice runs clear both new rooms in both layouts. Scrolling forecast captions remain within the visible game viewport. See [expansion evidence](../long-expansion/browser-results.json), [current parity](parity-results.json), and [level direction](../../LONG_LEVEL_EXPANSION.md). Human feedback on the new rooms remains pending.

The separate mobile artifact passed WebKit browser checks and gameplay parity checks. The user confirmed that it loads and plays on an iPhone, reported Safari long-press tools and zoom recovery problems, then confirmed the follow-up fixes work. This is user-reported physical verification, not an instrumented device performance measurement.

## Safari touch follow-up

Removed page-wide `touch-action: none`; the root and body now allow panning and pinch zoom through `manipulation`. Gameplay buttons retain `none` to reserve two-thumb input. Added selection/callout suppression and cancelable, non-passive touch handlers on gameplay controls, plus context-menu suppression. This follows [WebKit's touch guidance](https://webkit.org/blog/5610/more-responsive-tapping-on-ios/) and the documented [Safari long-press issue](https://bugs.webkit.org/show_bug.cgi?id=231161).

WebKit tests verify cancellation handlers and computed touch-action rules while continuing to exercise movement and jump. The iOS-only callout declaration is checked in source; desktop WebKit does not expose it as a computed property. Native Safari callout and pinch behavior were subsequently confirmed by the user's phone retest.

## Verified

- At the mobile-layout-only milestone, desktop source SHA-256 remained `bfc91fa8c9321394925fb1e383beb8adcad554e79f3e5ea3d49ae657c268f644`.
- 19,263 active simulation snapshots match the PC version, excluding camera and mobile pause/orientation fields. The saved ordinary-input route clears all seven rooms with zero deaths and two compactions.
- WebKit renders the actual served page and advances its animation loop without script errors.
- Landscape layouts fit at 844×390, 667×375, 568×320, and 844×280 without page overflow.
- Separate pointer IDs retain movement while another finger jumps; cancelling a pointer clears its hold. Real browser touch taps also activate controls. This does not replace physical multitouch testing.
- Pausing to read a remark exposes the full latest text and stops the simulation.
- Visibility loss and portrait rotation pause the simulation; returning requires explicit Resume.
- Loss freezes world time and retains the reading screen after ten seconds; two Continue taps retry. Compaction completes its 15-second sequence and restores play.

## Evidence and reproduction

[Browser results](browser-results.json), [gameplay parity](parity-results.json), and [desktop checksum](build.json) contain machine-readable results. Screenshots: [live landscape](iphone-live.png), [loss reading](iphone-loss.png), [compaction](iphone-compaction.png), [portrait prompt](iphone-rotate.png), and [small landscape](layout-568x320.png).

```sh
python3 tools/build-mobile.py
node tests/mobile-parity.test.mjs
```

The browser test needs Playwright with WebKit installed. In the current workspace environment, start the local server, then run:

```sh
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/mobile-browser.test.mjs
```

The browser test currently imports the temporary Playwright installation at `/private/tmp/exception-forecast-browser/node_modules/playwright/index.mjs` and uses the session's LAN URL. Update those references if reproducing on another Mac or network.

## Limits

WebKit desktop automation is evidence for layout and input logic, not physical iPhone Safari performance, screen cutout fit, audio behavior, or control comfort. No native iOS build, installation, offline home-screen behavior, or Android validation was performed. See [iPhone playtest instructions](../../IPHONE_PLAYTEST.md).

## Secret Git launchpad update

The later authorized trap update adds twelve launchpads across all nine rooms, with 32 new loss remarks. Current shared source checksum: `733c278ae802d0835ad63faaeb80866b8376e52d43ebdffcd9a860edfccaef55`. All nine rooms still clear through ordinary inputs, and 58,990 active PC/mobile snapshots match. New trap WebKit fixtures, long-practice browser routes, mobile lifecycle/input checks, and Chromium campaign/loss checks pass. See [secret-bounce checks](../secret-bounce/runtime-results.json), [browser evidence](../secret-bounce/browser-results.json), and [direction](../../SECRET_GIT_BOUNCE.md). Earlier checksum and count entries are prior release milestones.

## Fake AI billing update

Eight randomly scheduled fake AI paywalls and 32 rotating remarks are now included. Current source checksum: `3ff8a61112570533b3469ee41ad7b672a519232ee621b8ee9da8a96b060f4f09`. The nine-room route dismisses eleven actual scheduled dialogs with zero deaths. PC/mobile parity remains 58,990 snapshots, now including billing state and seed. WebKit checks cover all eight cards, both dismissal paths, small landscape screens, app-switch pause/resume, and zero network requests from pretend purchases. See [billing evidence](../paywalls/browser-results.json) and [direction](../../FAKE_AI_PAYWALLS.md). Physical iPhone feedback on these new dialogs remains pending.

## Original audio overhaul — October 13, 2026

Shared PC/mobile audio now has 22 layered cues and an original score with play, compaction, and fake billing arrangements. Separate music toggle; paused menus and background tabs stay silent. PC source SHA-256: `83692ad531f1e16e84d7e34d9d7574f80c4c4fa8f27a6270b14fb7347a97e9b9`. All 58,990 gameplay parity snapshots still match. Audio waveform and lifecycle checks passed in WebKit and Chromium; the existing mobile browser checks passed. See [audio validation](../audio/VALIDATION.md). Physical iPhone listening remains unverified.

## Six more long rooms — October 14, 2026

Shared gameplay now has fifteen rooms and nine long practice options. All six additions cleared in both WebKit layouts with no overflow or script errors. PC/mobile comparison: 195,062 snapshots, zero deaths. One-paywall budget applies to every room and survives retry/compaction. Source SHA-256: `422a31f59e1e096f137caab3382501226c1b810ea1e8036394c17c890839a97d`. Published commit `b3d2241ac47016f104ce073cffd49cd94430b5b1`; live WebKit practice selection passed for all six new rooms in both layouts.

## Glass sightline lab — October 14, 2026

Added a separate Menu practice button, four-sided glass collision, two observer rays and six hidden supports across a 1,080-pixel corruption gap. WebKit ordinary-input completion and ceiling/loss/retry checks passed in both layouts. Small phone layouts fit. The fifteen-room campaign still matches 195,062 PC/mobile snapshots. See [glass validation](../glass-test/VALIDATION.md). Physical hint readability remains unverified.

## Tracking-only glass clues

Removed the extra sweep; one eye line aims through the player and continues toward the lower page edge. Runtime optics verify each hidden support can interrupt that line from supported positions, in PC and mobile views. Waiting with the same position leaves the ray unchanged. The zero-death route and WebKit controls/retry/layout checks pass.
