# Nearby-phone playtests, recording kit and Cache prototypes

Implemented locally October 23, 2026. These tools prepare real tests and recordings; the automated checks are not human playtests or authentic reaction takes. Nothing is published or uploaded.

## Five nearby phones

Run from the repository root:

```sh
python3 tools/prepare-phone-playtest.py
python3 tools/serve-demos.py --host 0.0.0.0 --port 8766 --no-build
```

The preparation command finds the Mac's current Wi-Fi address, builds the offline shared game and creates six locally generated, decode-verified QR images: the hub plus P1–P5. Open the printed `/playtest.html` link on the Mac and scan one participant QR per fresh player. Keep the Mac awake and all phones on the same Wi-Fi. Regenerate when its IP changes. QR images and `outputs/playtest/lan.json` stay ignored. The server exposes a fixed allowlist of packaged pages, QR images and reference videos, not the repository.

The welcome asks the participant to opt into local anonymous level times, progress, deaths and retries. The route is Localhost 1 → 2 → 3 → Lab 9, Unreliable Recall. Allow twenty minutes; stopping is always allowed through Pause → End playtest. Say “Try to escape. You can stop whenever you want.” Observe without coaching unless the interface breaks; record any help. The hub has five observation cards and JSON/CSV exports. Note laughs, hesitation, repeated mistakes, voluntary retries and where people stop. Ask about fun, understanding failures, willingness to replay and one change.

Each participant's browser storage uses `exception-playtest-Pn:` prefixes. It is separate from the owner's normal campaign, reward wallet and narrator rotation. Test sessions save only on that phone/browser. At the end, save feedback and export its JSON, share the file to the Mac (for example AirDrop), and import it on the hub. There is no automatic result synchronization. Test telemetry starts after Start, excludes pause/menus/receipts, and records loss reading separately, beginning when the card appears after the two-second byte-loss intro. A reset clears only that participant's prefixed saves. Observations remain anonymous P1–P5; no microphone, camera, account, names or remote analytics are used.

Sources: `playtest/storage.js`, `session.js`, `session-ui.html`, `session.css`, `test-hub.html`, `tools/prepare-phone-playtest.py`, `tools/make-playtest-qr.swift`. Node physics fixtures and browser checks use disposable synthetic data; never count them among the five actual players.

## Three Shorts

Open `/shorts.html` for shot plans and a three-demo playlist:

| Demo | Setup | Counterplay to capture |
| --- | --- | --- |
| DO NOT MOVE | The AI says to stand still; the forecast commits while the shelf deletes. | Bait, retreat, Rewrite, cross. |
| SAVED, PROBABLY | A save stamp deletes its floor; a lower shelf keeps the attempt alive. | Return left, jump to the repair bank, Rewrite, recover. |
| MEMORY NOT FOUND | A panic jump hits the airborne scanner; a later AI flag drifts. | Walk under the high scan, jump the low scan, outplay the forecast. |

The kit opens the actual demos, preserves Pause/Audio/guide access, and offers a local browser screen recorder with optional microphone off by default and game audio when the browser provides it. Game and microphone tracks are mixed into one recording track. The person recording must choose a screen/tab and grant browser access. Stop saves locally and releases media tracks; the preview/download stays available. Phones can use their device screen recorder; on iPhone, Control Center → Screen Recording. On macOS, Shift–Command–5 is another option. Capture the full horizontal game so warnings are readable. Keep the real reaction, the revised plan and the final receipt. Honest reactions and final publishing require the user's own takes.

`tools/record-short-references.mjs` generates clearly labeled automated references from ordinary keyboard inputs: one real naive failure, two separate retry acknowledgements, a successful route and an escape receipt. It records no microphone or human reaction. Playwright supplies WebM capture; local ffmpeg creates a 1080×1920 MP4 with the full game centered on a warm paper slate. These ignored files live in `outputs/shorts/` and are linked from the kit. They are editing references, not evidence of a first-time player's experience. The three selected episodes use `&shorts=1`; the ordinary eight-demo playlist remains intact.

## Cache prototypes

Open `/cache.html` or Pause → Campaign & practice → More practice. Each route is separate, short and practice-only; the full Cache Management Data Center stays planned.

| Prototype | Speed | Route idea |
| --- | ---: | --- |
| CACHE HIT, FLOOR MISS | 244 px/s | Stale signs suggest the wrong movement; high/low scans lead into a forecast and permission handoff. |
| STALE DELIVERY ADDRESS | 278 px/s | A locked personal delivery makes the previous waiting spot dangerous, followed by landing review, receipt and forecast. |
| REFRESH REQUIRED | 262 px/s | Borrowed permission and a false save lead into a longer recovery/forecast/landing sequence. |

On retry, a pale cached copy replays part of the previous movement with a small offset and time lead. It is advisory, has no collision and is labeled CACHED COPY. Active gold/red warnings retain truthful positions/timing. Geometry, triggers and solvability remain deterministic. Pause freezes the echo; a fresh selection clears it. Each prototype adds twelve distinct background remarks. Same-level retry and credit rewind remain safe, and no prototype changes campaign progress or Token Bank earnings.

## Verification and boundaries

```sh
node tests/rewards.test.mjs
node tests/cache-prototypes.test.mjs
node tests/background-voice.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/rewards-browser.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/playtest-session-browser.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/cache-prototypes-browser.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/shorts-recorder-browser.test.mjs
```

Generate the existing Localhost and Lab input routes with `tests/long-campaign.test.mjs` and `tests/rage-labs.test.mjs` before the session browser check on a clean checkout. Run the preview server for the hub/import/recorder checks. The browser tests cover WebKit phone touch handlers and Chromium keyboard routes, save isolation, consent, complete/early-stop flow, feedback exports/imports, quoted CSV, clear receipts, cosmetic purchases and replay persistence. The recorder uses synthetic canvas media to validate controls and cleanup. QR codes are decoded locally after generation. Generated evidence stays ignored under `outputs/`.

Physical phone Safari reachability/touch/audio, five fresh people, willingness to retry, cosmetic satisfaction, authentic reaction footage and final Shorts are human acceptance work. Native assets can be synced from the same source; an asset sync does not mean the installed iPhone app has been updated.
