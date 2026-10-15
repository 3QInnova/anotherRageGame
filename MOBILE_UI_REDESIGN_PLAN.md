# Full-screen mobile UI plan

15 October 2026 · first implementation now lives locally on `feature/fullscreen-mobile-ui`, branched from `feature/capacitor-mobile` at `54b097f`. Full-screen rendering, fixed ghost controls, contextual Rewrite, overlay menu views and saved size/visibility/inset preferences are implemented. See [implementation and validation](outputs/fullscreen-mobile/VALIDATION.md). Left-handed layouts, free placement and moving Jump remain deferred. PC gameplay and the published friends build stay as they are.

The mobile game should feel like a playable document covering the phone. Controls float on the paper; the AI annotates it; settings open over the frozen world. The warm paper, grid, eye, margin doodle, authored traps and snark remain the identity.

[Proposed gameplay and pause layout](outputs/mobile-ui-plan/fullscreen-layout.svg) · [current Android game screenshot](outputs/capacitor/android-glass-lab.png)

## What the current UI gets right—and what is limiting it

Review covered `mobile/layout.html`, `mobile/mobile-ui.js`, `tools/build-mobile.py`, the native adapter, and the installed-app screenshots/tests documented in `outputs/capacitor/VALIDATION.md`.

- Multi-pointer movement, a distinct jump action, long-press suppression and explicit Resume are good foundations. Keep them.
- `#mobileApp` reserves 108px for movement, 116px for actions, 44px for a header and 88px for dialogue, plus padding/gaps. Those permanent panels squeeze the actual world into the center. The visual hierarchy favors the dashboard over the game.
- The 640×360 canvas uses `object-fit:contain`. Making its surrounding element full-screen alone would leave unused space or tempt us to crop important geometry. This needs a camera/composition pass as well as CSS.
- Mobile rendering currently translates the PC drawing upward by 150 world units, rewrites a few camera expressions, and hardcodes the eye position. `glassSight()` also infers the mobile eye from canvas width ≤640. A wider mobile canvas would break that assumption unless drawing and glass clues share one explicit viewport definition.
- The pause menu already freezes the game and contains practice, sound and diagnostics. Its long, scrolling collection can become a clearer menu rather than starting from scratch.
- Large external Jump/Rewrite buttons read like browser controls. The header, counters and large permanent dialogue panel compete with traps and the eye.
- Snark is a feature, not expendable UI. Removing its panel must preserve the full authored remarks and the 15-second loss-reading pause.

The user's Android emulator feedback is positive. Keyboard mapping is deferred; touch UI is this pass. Simulator checks do not replace physical phone testing.

## The new play screen

One full-screen game surface, with no external control columns, header row or footer. Extend the approved paper background to the window edges. Keep interactive controls and important labels inside safe areas, beyond camera cutouts, rounded corners and system gestures.

| Element | Proposed behavior |
| --- | --- |
| Left/right | Two separate translucent buttons at lower left, over the paper. Start with familiar arrows, rounded ink outlines and a faint paper/ink fill. Avoid a joystick or invisible movement zones in the first version. |
| Jump | One larger translucent button at lower right, with a simple upward glyph. Keep its position fixed during this redesign. |
| Rewrite | A smaller secondary control above/inboard of Jump. It remains available during gameplay because bridging gaps and changing barriers require it. Keep its reserved position stable; dim it without a valid target and highlight it when a rewrite is possible. Never relocate Jump when Rewrite appears. |
| Pause | One small, clearly tappable pause icon in the upper safe corner. It opens the overlay and releases every held input. |
| AI voice | A compact paper annotation near the top, clear of the eye. Brief ambient remarks can occupy two lines; the full latest remark and history are available in the paused AI log. Critical forecast/target cues take priority. |
| Room/deaths | Show briefly on room entry and include in the pause menu. No permanent title/counter bar. Optional minimal HUD can be a setting later if playtests need it. |
| Eye and beam | Stay part of the world. Preserve the single player-tracking glass ray and keep it out of caption/control regions. |

Controls should look ghosted without becoming difficult to find. Starting visual trials: 12–20% fill, 45–65% outline opacity, and a readable ink glyph; increase the outline/glow on press. These are tuning proposals, not validated contrast values. Offer opacity and size adjustment, with a high-visibility preset. Keep the screen behind the buttons visible.

Start movement hit areas around 64–76 CSS pixels each and Jump around 80–96, with explicit spacing and no overlap. Check physical size on devices: CSS pixels are not a universal conversion to native points/dp. Apple recommends at least 44×44 pt for frequently used game controls and visible press feedback; Android recommends at least 48×48 dp. Our targets should exceed those floors after device verification. [Apple game controls](https://developer.apple.com/design/human-interface-guidelines/game-controls), [Android touch targets](https://support.google.com/accessibility/android/answer/7101858).

Do not make a giant invisible hitbox that steals touches from another control or the menu. Movement must retain independent pointer IDs. Test sliding between arrows, opposing directions, two fingers on one direction, releasing outside a button, system interruptions and pointer cancellation. Choose and document a predictable opposing-input rule; release/cancel must never leave movement held. Touching empty scenery should not jump or open a menu.

## Composition: bigger world, readable hazards

Use a single mobile viewport model: scale, world-to-screen transform, visible world bounds, safe rectangles and eye origin. Rendering, camera clamping, forecast captions, autocomplete labels, compaction snapshots and the glass optical ray must use it consistently. Physics and authored trap positions remain in their existing world units.

Proposed first prototype:

1. Fill the window with paper and draw the world with uniform scaling. Never stretch the player or crop the screen with `object-fit:cover`.
2. Place the ground around 65–72% of usable screen height, leaving a lower paper margin for thumbs. This margin belongs to the game surface, not an external controls panel. Keep jump apexes and falling hazards visible.
3. Keep the player roughly 35–42% from the left during forward travel, with substantial look-ahead. Test this against the existing view before choosing a value; more visible terrain changes how early traps are seen even when physics is identical.
4. On wider phones, reveal additional world/background horizontally, at a legible scale. On short screens, prioritize the existing jump/trap envelope; fall back to a contained gameplay view inside the full paper surface if necessary. Do not promise edge-to-edge terrain at the expense of readable traps.
5. Treat thumb coverage as an occlusion area. Check the floor ahead of the player, launchpad seams, predicted drop rectangles and glass supports under real thumbs. Transparent buttons alone do not solve finger occlusion.

For example, at the current 360-unit mobile view height, floor `439−150=289` sits around 80% down the visible view. The new lower thumb margin needs an intentional vertical composition adjustment and a matching eye placement, not simply moving the DOM buttons inward.

Apple also recommends a full-bleed game interface and accounting for safe areas. [Apple layout guidance](https://developer.apple.com/design/human-interface-guidelines/layout).

## Pause menu: a useful overlay, not another dashboard

Dim the frozen paper world and open a restrained document card. The world stays visible behind it. Use the game's paper/ink language with the AI's annotations; avoid a generic console settings screen.

- **Play:** large Resume; Retry Room; Practice; New Run. Practice opens a separate list of the fifteen rooms and the glass lab, rather than stacking every choice onto the first screen. Confirm New Run before discarding an active run.
- **Controls:** size, opacity, safe-area inset and a simple left-handed preset. Include Reset Layout. Validate preset collision/overlap before adding free dragging. Store these preferences locally; handle unavailable storage safely.
- **Audio:** separate Sound and Music switches reflecting the actual audio state. Preserve tap-to-activate audio and background silence.
- **AI log:** full latest remark, recent remarks, receipts and collapsible diagnostics. Logging happens when a remark changes, not every render frame; keep a bounded recent history.

Show a usable Play panel immediately; switch to other panels without resuming. Resume is explicit. Tapping the dimmed background does not resume accidentally. Android Back from a submenu returns to the main pause panel; from the main pause panel, retain the current minimize behavior. Provide accessible names, visible focus and sensible dialog focus restoration.

## Loss, compaction and fake billing

Treat these as mutually exclusive overlays on the same full-screen surface, with explicit priority and input routing. Keep the existing state machine and interruption budgets.

| State | UI and input |
| --- | --- |
| Normal play | Movement, Jump, Rewrite and Pause available. |
| Pause/settings | Gameplay input cleared and timers frozen; no touch leaks into the world. |
| Loss | Snark is the hero: large complete remark, actual failure reason, optional hint, visible countdown and Continue. Preserve 15 seconds and two distinct Continue taps to skip. The first tap changes the button text so the requirement is understandable. |
| Compaction | Terminal and falling fragments occupy the game surface. Hide/disable gameplay controls; preserve the full freeze, safe rewind and reset behavior. Pausing must freeze compaction too. |
| Fake paywall | Keep clearly fictional AI billing, the free two-step dismissal and at-most-once-per-room budget across retries. Controls cannot activate behind it. |
| Victory | Readable error receipt, Next/Replay options as appropriate; no stale held movement. |

Pause opened over a loss, compaction or paywall must return to that exact state. Practice/Retry remain unavailable where current rules prohibit them. Do not let the new menu create a free compaction skip or a fresh paywall allowance.

Ambient captions can fade after a readable dwell time, but do not silently truncate critical instructions. Keep longer text available in the paused log. The loss screen retains the user's full reading interval regardless of ambient caption timing. Avoid an always-tappable caption across the playfield; reading history should be an intentional menu action.

## The future moving Jump button

Reserve this as a later authored AI intervention, as requested. First establish a comfortable fixed layout. Keep user-calibrated positions separate from temporary AI offsets so Retry, pause, rotation and a new session have defined reset behavior.

For a later experiment, test a clearly signaled small move after release, during a safe setup beat, rather than during an already-held touch. Define movement limits, one valid destination, an intervention budget, and stable-control accessibility mode. The visible button and actual hit target must move together. The joke should be attributable to the AI; otherwise we will be measuring whether the controls seem broken. No control sabotage ships in this UI pass.

## Implementation order

| Pass | Deliverable and decision gate |
| --- | --- |
| 1. Full-screen layout proof | Change the mobile layout and viewport adapter; place fixed ghost controls over the paper; preserve accessible Rewrite and the existing pause flow. Compare normal rooms, predictive purge, long levels and glass at several aspect ratios before choosing camera defaults. |
| 2. Overlay/state cleanup | Build the tabbed pause card and practice browser; prioritize captions; make loss/compaction/paywall layers explicit. Preserve all reading pauses, budgets and native lifecycle behavior. |
| 3. Comfort and character | Add control presets/opacity/size, local settings persistence, press feedback and first-use hints. Keep the paper/ink identity; introduce only brief cosmetic AI reactions. |
| 4. Device acceptance | Rebuild native apps, run regressions, then test on the user's iPhone and the local Android emulator. A borrowed physical Android remains a separate gate. Tune with missed-touch and obstruction observations. |

Implementation primarily touches `mobile/layout.html`, `mobile/mobile-ui.js`, `tools/build-mobile.py`, and native-only adapters as needed. Regenerate `mobile/index.html` and `apps/native/www/`; never hand-edit those outputs. Prefer extracting an explicit viewport helper over adding more string replacements to the builder. Keep PC source bytes unchanged for this mobile UI pass; if a reusable drawing hook requires a shared-source edit, isolate it and demonstrate identical PC rendering/gameplay.

## Acceptance and playtest plan

- No permanent external UI rails; all options open over the game. Ghost controls and Pause remain reachable in both landscape directions.
- Check 568×320, 667×375, 844×390, 956×440 and the Android emulator's actual CSS viewport, plus a short Safari viewport with browser chrome. Validate safe areas on real iPhone hardware; test text-size settings and a high-visibility control preset.
- In the glass lab, confirm the drawn eye and optical ray agree at every aspect ratio, including widths above 640. No sweeping beam returns. Four-sided collision and the ordinary-input route still work.
- Re-run PC/mobile gameplay parity across fifteen rooms, the ordinary-input glass route, native iOS/Android lifecycle and Back checks, loss reading/skip checks, compaction and one-paywall budgets. Update UI selectors and screenshot tests where intentionally changed; do not change physics to make a replay pass.
- On a physical phone, ask a new player to move, jump while moving, rewrite a gap and find Pause without coaching. Record discovery time, missed taps, accidental actions and obscured hazards. Compare with the current build using the same short route; proposed goals are immediate discovery, no stuck input and fewer UI-related misses, not a fabricated usability score.
- Run the long level through compaction and a full loss-reading cycle. Read the actual longest remarks; check every overlay at the smallest height. Play for 20–30 minutes to assess comfort and stutter.
- Keep active UI transforms/light effects cheap; measure on-device rendering rather than introducing continuous blur behind controls. Avoid reflowing control geometry while a pointer is held.

The first implementation milestone is a full-screen build with fixed ghost movement/Jump, contextual Rewrite, compact AI captions and the existing pause menu moved into the new composition. Prove that feel on the iPhone before expanding settings or experimenting with hostile controls.
