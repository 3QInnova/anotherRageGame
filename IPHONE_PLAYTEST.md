# EXCEPTION: HUMAN — iPhone playtest

The [PC game](initalDemoDocs/Exception_Human_Misclassification_V3.html) remains playable with keyboard controls. The separate [mobile game](mobile/index.html) shares its nine rooms, traps, snark, rewrites, and compaction rules. Mobile-only layout work preserved the original PC file; the subsequent authorized level expansion updates shared gameplay in both versions.

## Play on the iPhone

For this session, open **http://192.168.0.105:8765/** in Safari. Keep the Mac awake and both devices on the same Wi-Fi. Turn the phone sideways and tap **Play**. Refresh Safari to load subsequent changes.

- Hold the left/right buttons with your left thumb; tap Jump or X / Rewrite with your right thumb.
- Tap an AI remark to pause and read the full text. Resume when ready.
- Menu contains Retry, Floor hints, Long level, Sound, and AI receipts.
- Fake AI billing dialogs are dismissed by choosing the free plan and confirming. Pretend upgrades never charge anything.
- Losing freezes gameplay for 15 seconds. Two Continue taps skip the reading screen.
- Compaction still freezes gameplay for 15 seconds, animates falling fragments, resets traps, and returns the player to a safe earlier point.
- Rotating into portrait or leaving Safari pauses the game. Returning requires Resume; held inputs are cleared.

The warm paper background remains the visual staple. Controls sit beside the gameplay, while remarks and overlays use readable page text. The mobile canvas shows a closer view of the same world.

## Physical test checklist

1. Move and jump together using two thumbs; release or slide a finger off a control and check that movement stops.
2. Confirm the controls fit around Safari's toolbar and the phone's screen cutout.
3. Lose: read the remark and actual cause, then test two Continue taps.
4. Tap a remark: read it in the paused menu, then Resume.
5. Open Menu → Long level; reach compaction and check the freeze, animation, safe return, and reset traps.
6. Rotate the phone and switch away from Safari, then return: gameplay should remain paused until Resume.
7. If anything feels wrong, record the iPhone model, orientation, room, and what happened.

As of October 13, 2026, the user confirmed the game loads and plays on an iPhone. They reported long-press copy/paste tools and being unable to zoom back out. The follow-up build suppresses selection/callouts on gameplay controls and allows native pinch zoom over the canvas and menus; the user subsequently confirmed “That all works.” Automated WebKit checks are described in [validation](outputs/mobile/VALIDATION.md). This delivery is a Safari prototype; no native iOS package or Android test is included. See [friends playtest](FRIENDS_PLAYTEST.md) for the prepared public-sharing package.

After refreshing this follow-up build, hold movement and tap Jump together, then pinch in and out over the paper game view. Pinching on the gameplay buttons is reserved for game input. If the previous page remains stuck enlarged, close that Safari tab and open the URL in a fresh tab.

## Rebuild or restart the local test

From the project directory:

```sh
python3 tools/build-mobile.py
python3 tools/serve-iphone.py --port 8765
```

The server serves only the mobile game page, with no directory listing. If it is already running, use the existing server. Stop it with Ctrl+C when finished. The Mac's Wi-Fi address may change; find the current address with:

```sh
ipconfig getifaddr en0
```

Use `http://<that-address>:8765/` on the phone. If Safari cannot load it, check that the server is running and the Mac's firewall permits the local connection.

## Source ownership

The desktop HTML remains the gameplay source. Mobile presentation lives in [layout.html](mobile/layout.html) and [mobile-ui.js](mobile/mobile-ui.js). [build-mobile.py](tools/build-mobile.py) combines these with the desktop script to generate `mobile/index.html`; edit the sources and rebuild rather than editing the generated page. Run parity checks after changing the builder or shared gameplay.

## Audio update

Open Menu and enable Sound, then Resume. Music has a separate toggle if you want effects only. Pausing, rotating, or leaving Safari silences the game until Resume. Listen for the new jump lift, landing tap, layered impacts, original score, compaction glitches, and fake-paywall elevator melody. WebKit audio checks passed; physical iPhone loudness and speaker/headphone feel need a listening test.

## Glass sightline lab

Menu → Glass sightline test opens Transparent Excuses. Jump from beside visible glass ledges and use wall tops to cross the opening gap. At the corrupted-data sector, watch the eye beams: breaks briefly reveal the top edges of six hidden supports. The platforms remain solid between scans. This separate practice lab suppresses compaction and billing interruptions; loss reading and two-tap retry remain. The campaign stays at fifteen rooms. Physical iPhone hint readability still needs player feedback.

The automatic sweep has now been removed from the glass lab. Only the player-tracking line reveals support, continuing straight through the player to cross platforms underfoot. Moving or jumping changes its path; waiting does not scan for you.
