# Glass sightline test validation

PC source SHA-256: `24e16a82e01f78696d00c86e2d38ecf599f087da92d16b74706658f51807d8a6`.

- Practice-only test; fifteen campaign rooms remain unchanged.
- Ordinary-input completion through both visible-glass climbs and all six invisible platforms: zero deaths.
- 1,080-pixel data hole versus approximately 189-pixel normal flat jump range.
- Side collisions in both directions, underside/head stop, stable top support, and falling off passed.
- Hidden supports remain solid independently of the rays; real ray/rectangle clipping and initial concealment/1.2-second expiry checked.
- Corruption loss, 15-second reading, and two-press retry back into the lab passed.
- 56 unique remarks and no-early-repeat rotation checked.
- PC/iPhone campaign parity: 195,062 active snapshots still match.

See `runtime-results.json`, `browser-results.json`, `completion-route.json`, and PC/iPhone screenshots. Physical iPhone optical-hint readability remains a human playtest question.

WebKit replay passed in PC and iPhone layouts, including actual keyboard/touch ceiling collision, visible victory restart, two-tap loss retry, practice disabled during loss, and small phone layouts. Audio checks passed in WebKit and Chromium for all 23 distinct cues and all music arrangements. Publication commit: `348b5c92b008b7dd6d822836416420dbd7014c29`; Pages run `38616997483` succeeded. All three live files match the tested package. Live WebKit PC/iPhone checks passed for practice selection, six hidden supports, two optical rays, and actual keyboard/touch jumps. Landing and campaign checks also passed.

## Player-tracking ray only

Removed the automatic sweep. The one ray aims exactly through the player and continues straight toward the lower page edge. Waiting with the same position does not change it. All six supports can interrupt it from supported player positions in both viewport layouts; the ordinary-input route still clears with zero deaths. Optical fade, glass collision, keyboard/touch play, loss/retry and small-phone checks pass. Source SHA-256: `b3f520dda12487980d67a8c198fc1631f26bf7bd810121e3c137fce5e3ddd490`.

Tracking-only update published: `228215409ca0d913ac70692ea6a1c8d50ca88e31`, Pages run `38639762836`. All three live files match the tested package. Live PC/iPhone checks verify a single optical ray, the practice button, and actual keyboard/touch jumping.
