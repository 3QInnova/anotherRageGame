# Sound direction — Unsupported Use Case

Replace all of the old single-oscillator beeps with an original procedural soundtrack and layered effects. Keep the approved paper world and all existing gameplay intact. Everything is synthesized locally using Web Audio; no external sound files, licensing dependency, AI service, or network request is required.

The sound palette combines soft synth plucks, low bass, filtered paper-like noise, mechanical percussion, and malfunctioning interface tones. It gives the fake AI a smug machine personality without constant shrill alarms. A separate music toggle allows effects-only play.

## Music

- **Play:** original eight-bar D-minor groove at 104 BPM, with bass, percussion, chord beds, melodic answers, and a quiet counterline in later rooms.
- **Compaction:** broken, descending notes and little data-shredding ticks throughout the interruption.
- **Fake AI paywall:** deliberately cheerful, awkward elevator melody while the AI tries to sell imaginary credits.
- **Loss / victory:** music fades away; the impact or completion cue plays, then the player can read in quiet.
- **Menu, background, rotation pause:** stop all voices and suspend audio. Resume starts a fresh scheduling window; missed beats never catch up in a burst.

## Effects

| Event | Sound |
| --- | --- |
| Jump | Rising springy synth lift with a short air/paper flick; three subtle pitch variants. |
| Glass contact | Short layered glass ring on head/side contact and a new hidden-platform landing. |
| Landing | Small low thud and paper tap. |
| Trap warning | Two restrained falling warning notes. |
| Forecast lock | Descending three-note capture cue with a low anchor. |
| Redacted floor | Filtered tearing noise and a falling buzz. |
| Scan activation | Sweeping scanner tone and static. |
| Falling popup | Low descending weight and impact texture. |
| Forecast purge | Rough delete sweep with filtered noise. |
| Secret launchpad | Exaggerated upward spring/glitch. |
| Loss / hit | Low impact, crunch, and a descending dissonant rejection. |
| Git-secret loss | Separate four-note commit rejection and heavy low hit. |
| Rewrite | Static flick followed by an ascending confirmation. |
| Denied rewrite / fake exit / audit | Two dry, dismissive rejection notes. |
| Survived forecast | Small upward acknowledgement. |
| Room clear | Four-note rising phrase. |
| Final / practice victory | Longer seven-note fanfare and soft noise flourish. |
| Compaction start | Stuttering system shutdown and falling low tone. |
| Compaction restore | Four-note restart phrase. |
| AI paywall opens | Cheerful sales jingle with an intentionally wrong final note. |
| Free-plan confirmation | Short downward acknowledgement. |
| Paywall dismissed | Rising free-plan restore cue. |
| Sound enabled | Small startup chord. |

## Controls and implementation

Sound starts **OFF**. Turn it on with the Sound button, found in Menu on iPhone. Music defaults to **ON** as a preference under the master Sound switch. Turn Music off to retain effects. The paused menu stays silent except when the player explicitly taps **Test / reconnect sound**. That button plays a short chime and reconnects the engine while gameplay remains paused. Sound and Music choices persist locally across reloads; restoring a preference does not autoplay.

The engine lives in the PC HTML's `makeAudioRig`, `renderCue`, `musicStep`, `soundCue`, and `tickAudio` functions. The mobile builder copies it into the iPhone artifact. Noise uses its own fixed seed; effect variation uses its own counter. Music scheduling follows `AudioContext.currentTime`, never gameplay time or gameplay random generators. Voice nodes disconnect after playback. A master compressor controls layered peaks. Mute clears queued voices immediately.

## Review and validation

Listen to [gameplay music](outputs/audio/play-music-preview.wav), [compaction music](outputs/audio/compacting-music-preview.wav), [paywall music](outputs/audio/paywall-music-preview.wav), and [all 23 effects](outputs/audio/effects-preview.wav). The effects montage follows the table order above, starting at 0.1 seconds with each cue 1.5 seconds apart.

Run:

```sh
python3 tools/build-mobile.py
python3 tools/build-playtest.py
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/audio-browser.test.mjs
node tests/mobile-parity.test.mjs
```

WebKit and Chromium, both PC and mobile layouts, rendered all 23 distinct nonzero effects without clipping and all three music arrangements. Browser tests exercised user-gesture activation, effects-only music muting, master mute, background suspension, resume, music state transitions, and sound toggling while the iPhone menu is paused. See [results](outputs/audio/browser-results.json).

The ordinary-input campaign still clears all nine rooms with zero deaths; 58,990 PC/mobile gameplay snapshots match. These are browser and waveform checks, not a listening approval or a physical iPhone speaker/headphone test. Listen on the actual iPhone before accepting loudness and timbre.

The glass lab update adds `glass-contact` as the 23rd cue. The current effects montage includes it immediately after jump.

## Installed iPhone audio fix — October 16, 2026

The user reported an installed iPhone app that stayed silent with Sound ON. Inspection found that the native app never configured `AVAudioSession`, and the shared Web Audio code discarded resume failures. These are verified implementation gaps; the exact cause on the physical phone is not remotely confirmed.

The app now configures `.playback` with `.mixWithOthers` at launch and scene activation. Apple documents that [playback audio continues with the Silent switch set to silent](https://developer.apple.com/documentation/avfaudio/avaudiosession/category-swift.struct/playback). Activation still follows explicit game/audio interaction; no background-audio entitlement was added. Supported web audio-session APIs are also set to playback before creating the context. The game still stops audio during pause/background.

Web Audio resumes now report errors, guard against late async callbacks, rebuild closed contexts, and restart the music scheduler. The explicit test/reconnect button creates a fresh context, plays a chime in the paused menu, verifies clock advancement, and suspends again if the game is still paused. Its visible status gives a recovery path instead of silently failing. Diagnostics are exposed by `window.__EXCEPTION_AUDIO__.status()`; native iOS session configuration is also recorded in `window.ExceptionNative.health.iosAudioSession`.

WebKit and Chromium checks pass all 23 effects, three music arrangements, independent music/master toggles, paused testing, reload persistence and recovery from an injected resume failure. Native iPhone Simulator XCTest verifies that the audio clock advances during the explicit sound test before play and after backgrounding. The app's native log reports `AVAudioSessionCategoryPlayback`. Gameplay checks preserve 195,062 PC/mobile snapshots and all twenty Localhost completion routes without paywalls. Both local native packages build; the existing Xcode project/signing edits remain intact.

[Audio fix results](outputs/audio/iphone-fix-results.json) · [native simulator result](outputs/audio/iphone-native-results.json).

To test on the physical iPhone, rebuild/install the App scheme from Xcode, open **Menu → Audio**, enable Sound and tap **Test / reconnect sound**. Then Resume and check Jump, an actual loss and Music. Also check after leaving and returning to the app. The Simulator proves native audio-session setup and engine behavior; physical speaker/headphone output remains a human acceptance check. Nothing was published or automatically installed onto a physical phone.

## PC controls: October 23

The PC's full-window paper layout keeps **Music · On/Off** and **Pause · Esc** in the upper-right corner, including recording view. The Music shortcut starts audio after its click when needed; turning music off leaves effects enabled. Pause → Audio contains separate Sound/Music switches and Test / reconnect sound. Menus and focus loss freeze gameplay and suspend voices; Resume is explicit. The saved `exception-audio-v1` settings still apply. The live-clock and paused test are covered by `tests/desktop-screen.test.mjs` and the existing four-browser/presentation audio suite.
