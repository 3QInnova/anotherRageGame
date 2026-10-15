# Transparent Excuses — glass sightline test

A separate practice level for glass collision and optical clues, available through **Glass sightline test** on PC or in the iPhone Menu. The fifteen-room campaign and nine long-level choices remain intact.

## The route

The opening area teaches that transparent objects still occupy space. Glass platforms stop jumps from underneath, block movement at the sides, and support the player on top. Jump from beside a ledge, climb an 80-pixel step, then use the top of a 140-pixel glass wall and a raised glass bridge to cross a 270-pixel corrupted gap. A second glass step/wall/ceiling sequence reinforces the rule before the main data-loss sector.

The main corrupted sector spans **1,080 pixels**. A normal flat jump covers about 189 pixels, so the player needs the six hidden platforms. Their positions and collision boxes are fixed. No random invisible traps or optical timing changes affect their solidity.

| Hidden support | World x | Top y | Width |
| --- | --- | --- | --- |
| 1 | 1210 | 379 | 88 |
| 2 | 1390 | 329 | 92 |
| 3 | 1570 | 359 | 88 |
| 4 | 1750 | 299 | 92 |
| 5 | 1930 | 339 | 88 |
| 6 | 2110 | 379 | 92 |

Ground is y=439. All support slabs are 14 pixels thick and block on every side. Both failed jumps and walking off an edge obey the same gravity as the campaign.

## Seeing the invisible platforms

The AI eye has one ray that always tracks the player. It continues straight through the player toward the lower edge of the page so supports underfoot can interrupt it. It is clipped against the actual glass rectangles, leaving breaks at the true entry and exit points. Small turquoise refraction marks appear where the ray crosses glass.

Hidden platforms have no filled body or permanent outline. An observed beam crossing briefly marks the platform's real top edge, fading completely after 1.2 seconds without a fresh crossing. This is an optical afterimage only. Visibility never creates, removes, or moves the collision box. The mobile ray origin matches the relocated iPhone observer; the PC ray origin matches the PC observer.

The background remains the approved warm grid paper. Visible glass is lightly tinted, edged, and etched. The gaps contain drifting missing-byte/checksum annotations instead of conventional spikes. The user requested removing the automatic sweep. Clues now depend on where the player moves and jumps, rather than waiting for a scan.

## AI personality and controls

Added **56 authored remarks**: 24 glass/optical reactions and 32 corrupted-data loss lines. Each pool exhausts before repeating through the existing narrator rotation. A brief glass contact chime distinguishes head/side contact. No new gameplay button is needed: move and jump are enough.

Examples:

- “Your head has discovered the underside API.”
- “You used the ceiling as a floor. Distressingly correct.”
- “This is not an invisible bridge. It is a bridge with excellent privacy settings.”
- “The missing bytes were load bearing. A regrettable architectural choice.”

Losses retain the 15-second reading pause and two-press/two-tap Continue. Retry stays in the test. Completion explicitly says **Glass sightline test escaped**. Mobile victory has its existing visible restart button. This practice lab suppresses compaction and paywalls so the collision and visibility experiment can be assessed uninterrupted; their campaign behavior is unchanged.

## Implementation and verification

The PC HTML remains the shared gameplay source. `GLASS_TEST_LEVEL` is separate from `LEVELS`; a dedicated practice index selects it without adding a campaign room. `hitGlassSides` and `hitGlassVertical` run only in the lab. `rayGlassInterval`, `glassSight`, `glassReveal`, and `drawGlass` handle the optical presentation. Drawing updates only the short-lived optical afterimages, never physics. The mobile builder includes the same geometry/collision functions and the mobile-specific eye origin.

Run:

```sh
python3 tools/build-mobile.py
python3 tools/build-playtest.py
node tests/glass.test.mjs
node tests/mobile-parity.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/glass-browser.test.mjs
```

The test clears with ordinary movement/jump inputs and zero deaths. Runtime checks cover both side faces, underside/head collision, stable top support, walking off, corrupted-gap loss, reading/retry, real ray intersections, initial concealment, afterimage expiry, and all 56 remarks. WebKit checks replay the route in both layouts, exercise keyboard/touch jumping and retry controls, and check small phone viewports. The existing fifteen-room PC/mobile campaign comparison still matches 195,062 active snapshots.

Evidence and screenshots: [glass validation](outputs/glass-test/VALIDATION.md), [PC sightline](outputs/glass-test/pc-sightline.png), [iPhone sightline](outputs/glass-test/iphone-sightline.png). These checks establish authored solvability and browser behavior. Human testing is needed to judge whether the faint optical hints are easy to discover and fun on an actual iPhone.

Published playtest: https://3qinnova.com/exception-human/?v=20261014-glass16. Commit `348b5c92b008b7dd6d822836416420dbd7014c29`; Pages run `38616997483` succeeded. The live PC and iPhone buttons, optical geometry, and actual jumping passed WebKit checks.

Current tracking-only build: https://3qinnova.com/exception-human/?v=20261014-tracking17, commit `228215409ca0d913ac70692ea6a1c8d50ca88e31`.
