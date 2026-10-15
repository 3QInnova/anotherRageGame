# Autocomplete and victory-log validation

`node tests/tech-feedback.test.mjs` checks all three walk/jump/wait modes, an honestly followed real jump, disagreement-chain growth/reset, and a fixed ghost target, honest followed/rejected/death outcomes, one receipt per rejection, real purge-warning priority, receipt preservation through death/retry/compaction, new-run clearing, bounded history, and rotation/reload/denied-storage behavior for all 20 unique autocomplete remarks. The current 30%-longer five-room input route clears with zero deaths and records the real final escape.

All existing Node checks passed: forecasts, 160 loss remarks and reading controls, observer stages, and compaction triggers/reset/recovery from every authored return point.

Headless Chromium in `tests/tech-feedback-browser.test.mjs` checks real keyboard and pointer input, ghost and rejection rendering, the normal five-room zero-death route, visible escape receipts, all 20 response lines fitting at a 390-pixel viewport, no horizontal overflow, and no page errors. It also captures each extended room during ordinary keyboard progression and renders all three suggestion modes. The existing browser and compaction browser suites also passed their forecast, loss reading, pointer/touch, live-animation, and restoration checks. The final receipt placement below touch controls was verified in the dedicated tech-feedback browser check.

Before the level extension, a one-off comparison with `/private/tmp/exception-before-tech.html` checked 4,948 frames along the ordinary completion route. With identical random seeds, all gameplay snapshots matched after excluding observer, autocomplete, and receipt state. The `background` drawing function remained byte-identical. This comparison and its JSON are historical evidence for the earlier autocomplete pass; they do not compare the current longer rooms. The temporary baseline is not a portable test fixture.

[Runtime results](runtime-results.json), [browser results](browser-results.json), and [baseline comparison](baseline-comparison.json) record the outcomes.

`node tests/level-extension.test.mjs` checks all five 30% distance increases within rounding, added encounters, camera bounds and player visibility, and aligned final-exit audit/rewrite positions. See [length results](level-length-results.json) and [extension direction](../../LEVEL_EXTENSION_DIRECTION.md). Every compaction return point remains completable through the extended room with ordinary inputs and zero deaths.

## Previews

[Autocomplete ghost](autocomplete-ghost.png), [rejected suggestion](suggestion-rejected.png), [completed-run victory logs](victory-logs.png), and [mobile receipt](mobile-receipt.png). Desktop ghost and mobile receipt previews were visually inspected. New captures include [walk](guess-walk.png), [jump](guess-jump.png), [wait](guess-wait.png), and scrolling rooms [1](extended-room-1.png), [2](extended-room-2.png), [3](extended-room-3.png), [4](extended-room-4.png), and [5](extended-room-5.png). Room five was visually inspected and an annotation overlap corrected. Isolated ghost previews use disabled unrelated hazards for inspection; the full completion route uses ordinary inputs and active hazards.

## Reproduce

```sh
node tests/tech-feedback.test.mjs
node tests/level-extension.test.mjs
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/tech-feedback-browser.test.mjs
```

The browser script uses the same temporary Playwright installation described in [observer validation](../observer/VALIDATION.md). The playable HTML has no runtime package or network dependency.

## Limits

This is local prototype evidence, not native-mobile or broad compatibility validation. The ghost is a simple fixed extrapolation, not an AI model or a guide to safe movement. Fixtures test outcome boundaries; the completion route does not cover every input sequence. Human playtests should check whether newcomers distinguish purple guesses from actual purge warnings and find the receipts rewarding rather than distracting.
