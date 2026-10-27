# EXCEPTION: HUMAN object art direction

Updated October 23, 2026. Implemented in the shared PC/mobile [V3 prototype](initalDemoDocs/Exception_Human_Misclassification_V3.html).

## Visual identity

**Approved design staple:** The user explicitly approved the current background. Preserve the warm grid paper, quiet annotations, document margins, restrained palette, and open space around gameplay. Character reactions and new hazards should build on this background rather than replace it.

The playable world is a document whose assertions have physical consequences. Its objects use paper cuts, perforations, typed clauses, binding braces, censor ink, rejection receipts, and editorial tags. The user selected **02 · Visitor Error** from the October 23 character concepts: a paper human in a torn visitor-pass coat, a short censor strip, crooked hair, gold lanyard, ID photo and heavy ink shoes. The machine observer remains the large vision eye.

## Visitor Error character and sprites

The main PC/phone Play menu and local demo/campaign landing pages now feature the selected character. The large transparent paper illustration is an authored source asset at `assets/visitor-error/visitor-error-hero.png`, created with the built-in imagegen tool using the chosen concept as reference; its exact generation prompt is preserved beside it in `hero.prompt.txt`. It is artwork consumed by the game, not a generated test capture. Builders inline it once per offline game page, and all menu instances share that data URI. No remote image load is required.

Gameplay uses a deliberately simpler Canvas sprite interpretation in `characters/visitor-error.js`. Its paper coat, black censor strip and gold lanyard carry the identity at actual game scale. A cached transparent atlas contains **27 frames**: eight idle frames (two foot taps and a blink after 1.2 seconds stationary), eight running frames (alternating planted/lifted feet, arm swing, coat/lanyard movement), three jump poses (rise, apex, fall), and eight loss frames (the person breaks into ink squares and binary/hex byte fragments over 0.8 seconds). Facing mirrors the sprite. Tracking brackets remain separate from the clothes.

The user's animation correction replaces the subtle original arm motion with eight authored opposing-arm strides: bent elbows, visible hands travelling ahead of and behind the body, and the near arm drawn over the coat. Jump poses raise both hands on takeoff, spread arms/knees/feet at the apex, and extend the arms for balance while descending. Keep enough limb motion outside the torso to read at game size. The local [animation review](http://127.0.0.1:8766/character.html), generated from `characters/preview.html`, shows the exact runtime frames at game size and enlarged, with Pause and facing controls. This is an isolated art preview and does not advance gameplay or saves.

The physical player remains **24 × 34** world pixels. Artwork is drawn on a 32 × 44 frame with transparent padding and feet anchored to the same ground contact; its pose never changes collisions, jumps, speeds, triggers or credits. The byte burst plays immediately in the world on loss. The Continue card stays hidden for two seconds after death, then starts the full fifteen-second reading interval. Early keyboard/touch/Retry acknowledgements are ignored. The burst never repeats on the card; falls below the viewport anchor it near the visible floor without moving the physical body. Pause/background freezes both the burst and the delay, and retry clears them. The two distinct Continue presses/taps are preserved. Cosmetic sprite math does not consume gameplay or compaction randomness.

Sources: `characters/menu-mascot.html`, `characters/visitor-error.css`, `characters/visitor-error.js`, the hero asset and `tools/build-campaign.py` / `build-mobile.py` / `build-demo-playtest.py`. Change these sources and regenerate; do not hand-edit native platform copies. `tests/visitor-error-browser.test.mjs` exercises visible art, actual movement/jump pose changes, idle taps, byte loss, Pause, two-tap recovery and offline loading on Chromium/WebKit desktop and WebKit phone. It also exports a portable transparent atlas, per-animation strips and manifest under ignored `outputs/visitor-error/`. Browser checks do not establish physical-phone visual acceptance.

```sh
python3 tools/build-demo-playtest.py
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/visitor-error-browser.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/desktop-screen.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/failure-voice-browser.test.mjs
node tests/mobile-parity.test.mjs
node tests/long-campaign.test.mjs
```

The visual comparison used the [Level Devil listing and gallery](https://poki.com/en/g/level-devil), including its public [room screenshot](https://img.poki-cdn.com/518a82e77f462ce36d475d67d7fdbdea/c/level-devil-level-3.png). That reference shows a small black figure, broad solid terrain, a rectangular pit, and a conventional exit door. The previous V3 had a different palette and document annotations, but retained some familiar terrain and character silhouettes. This pass changes object construction and negative space as well as labels.

## Implemented object changes

| Object | New construction and behavior cues |
| --- | --- |
| Traversable ground | Thin perforated document strips with a torn lower edge, open paper beneath them, and a clear continuous top surface. |
| Human | Visitor Error: outlined paper face and torn visitor-pass coat, short censor strip, gold lanyard/ID, animated ink limbs, and separate machine-vision brackets. |
| NULL gap | Two unbound braces, a question mark, and a broken reference curve inside an actual break in the document strip. |
| Temporary bridge | A stitched assertion spanning the break; `support := true;` reinforces the fabricated support. |
| Redaction | A clause gets deleted; censor ink and falling glyphs mark the missing strip. A dashed boundary distinguishes absent support. |
| Classifier hazard | A rejection field with scan brackets and moving censor marks, with a large `REJECT` label when lethal. |
| Falling policy object | A folded, torn rejection receipt with a 403 stamp, denial seal, and barcode-like marks. |
| Solid barrier | A pale clause stack bound by tall mathematical braces, marked as a type seal. |
| Rewrite target | A folded editorial tag tied to TYPE, NULL, or IMAGE, with a question mark or a rewritten state. |
| Exit | An irregular punched tear crossed by a handwritten output arrow. |
| Misclassified exit | A pinned, tilted illustration with its arrow crossed out and a JPG label. |
| Forecast | The existing fixed ghost target and clear lock countdown remain the observer's prediction, visually separate from ordinary objects. |

All objects are generated by the project's Canvas code. No competitor graphics, downloaded textures, font assets, or image-generation dependencies are included. The public reference screenshot was used for comparison only and was not added to the game.

## Background variation update — 15 October 2026

The user has authorized [shifting background compositions](DYNAMIC_BACKGROUND.md). Keep the same paper, ink, grid and annotation identity, but vary their registration and faint landmarks on loss, restart, new level and compaction recovery. Decorative guides may form unreliable associations with hazards; actual support edges, learned marks, captured targets and activation cues remain unchanged.

## Rules for future additions

- Design an object around a machine action or document operation, and make that meaning visible in its silhouette.
- Use shape, motion, labels, and boundary marks together. Essential collision information must not depend on color alone.
- Keep support surfaces visible, missing references visibly broken, and lethal regions bounded.
- Give rewritten states a readable change in construction, not just a tint.
- Avoid introducing terrain slabs, conventional doors, coins, spikes, saws, crates, or a black pixel protagonist as the default visual vocabulary.
- Preserve the observer, margin doodle, warm paper, and annotation style as a coherent family.
- Describe the work as independently authored and differentiated from reviewed references. A targeted comparison cannot establish that no similar visual exists anywhere.

## Review and validation

Inspect the [object review sheet](outputs/object-redesign/object-gallery.png), [room 1](outputs/object-redesign/room-1.png), [room 2](outputs/object-redesign/room-2.png), [room 3](outputs/object-redesign/room-3.png), [room 5](outputs/object-redesign/room-5.png), and [narrow-screen room 3](outputs/object-redesign/room-3-mobile.png).

The review sheet and room captures deliberately stage object states to inspect their construction. They are visual fixtures, not evidence that those exact arrangements arose through a legitimate playthrough.

Node regression checks and headless Chromium keyboard replay still clear all five rooms with zero deaths. Forecast state checks, live animation, retry, pointer movement/release, touch jump/rewrite, and narrow-screen overflow checks passed for this visual revision, with no page script errors. During the visual pass, a source comparison confirmed that room definitions, movement, collisions, timing, and input handlers matched the pre-redesign version exactly. A visual bridge now explicitly uses the same eligible gap IDs as collision support. Later loss-screen timing changes are documented separately in the forecast validation notes.

Run the existing checks using the instructions in [forecast validation](outputs/forecast-feedback/VALIDATION.md). Regenerate the art captures with `node tools/render-object-review.mjs`, setting `PLAYWRIGHT_MODULE` and `PLAYWRIGHT_BROWSERS_PATH` for a local Playwright installation when needed.

Readability during real play, perceived distinctiveness, and physical phone usability still need human observation. The original ZIP and initial screenshots remain historical references; the loose V3 and current captures show the redesigned objects.
