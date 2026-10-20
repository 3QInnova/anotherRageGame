# Shifting paper backgrounds

Implemented locally, 15 October 2026, on `feature/fullscreen-mobile-ui`. The warm paper, restrained ink palette, grid, eye and margin doodle remain the visual identity. This changes desktop and mobile background presentation; authored level geometry and gameplay rules stay the same. Nothing is published.

## Behavior

Every loss, retry, New Run, level transition and compaction recovery creates a fresh paper composition. Changing levels or restarting never deliberately reuses the previous layout. A cosmetic revision counter survives reloads where local storage is available; a fresh session nonce and in-memory counter keep play functional when storage is blocked.

The grid shifts its starting phase and subtly varies its spacing. Faded registration rings, binder holes, file tabs and checksum watermarks appear at different locations. Three parallax depths make the document feel spatial as the player travels through a long room. Small, slow grid drift adds movement while playing; reduced-motion preference disables that drift. Pausing freezes it with the rest of the world.

Margin guides provide unreliable associations: some align with actual secret-launchpad or hazard positions, while other guides sit 86–230 world units ahead or behind. Their alignment cycles between accurate/ahead/behind on subsequent compositions. A guide that helped time a jump can be somewhere else next time—even after compaction. Sixteen quiet annotations include `[PROBABLY HERE]`, `[MAP CACHE]`, `[DO NOT MEMORIZE]`, `[CERTAINTY RELOCATED]` and `[RENDERED FROM MEMORY]`.

These marks stay faint and sit behind the physical world. They never alter a trap trigger, collision surface, jump, rewrite duration, learned marker, true drop target or interruption budget. They do not reveal hidden glass platforms; the single player-tracking eye ray remains their actual optical clue. The existing loss remarks and reading interval are preserved.

During a loss the new paper appears behind the reading overlay. The following retry gets another fresh composition. Compaction's captured old document falls away, then the restored room receives new landmarks. No random redraw occurs while the player is in the middle of a jump.

## Background narrator update

The margins now carry [544 authored background jokes](BACKGROUND_VOICE.md), including twelve for every room and progress-aware notes. The sixteen original quiet registration annotations remain as scenery. Background snark is a permanent requirement for future levels. Remarks also receive fresh horizontal positions and heights each composition. Progress eligibility uses recorded distances, while placement uses a separate cosmetic stream independent of hazards; a varying travel delay prevents an immediate milestone cue. Revealed remarks stay anchored while being read.

## Implementation

The self-contained PC source contains `resetBackdrop()` and `paintBackdrop()`. Mobile uses the same painter through `mobile/viewport.js`; its paused-frame cache includes the background revision. Both versions therefore share the feature without duplicating the generation rules.

Background generation uses its own seeded generator. It does not call `Math.random`, advance compaction/billing seeds or mutate level definitions. Landmarks are generated only on composition changes and culled outside the viewport during rendering. The warm paper fill is unchanged.

`window.__BACKDROP_TEST__.state()` exposes a read-only copy for inspection. Storage key: `exception-backdrop-revision-v1`. The stored revision is cosmetic metadata, not a campaign save.

## Validation and review

[Attempt one](outputs/dynamic-background/mobile-attempt-1.png) · [same position, next attempt](outputs/dynamic-background/mobile-attempt-2.png) · [third attempt](outputs/dynamic-background/mobile-attempt-3.png).

- `node tests/dynamic-background.test.mjs`: 180 distinct retry compositions, fresh reload, accurate/ahead/behind guide shifts, loss/retry/compaction rerolls, unchanged geometry, and no gameplay random draws from the renderer. The full fifteen-room input route matches the pre-feature `5898920` baseline across 195,062 gameplay snapshots, with zero deaths.
- `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/dynamic-background-browser.test.mjs`: actual PC/mobile images change per attempt, compaction restores fresh paper, reduced motion works, and a background revision invalidates the paused mobile framebuffer without advancing physics.
- Existing full-screen UI, PC/mobile parity, touch/lifecycle and glass-route checks remain required; see [validation](outputs/dynamic-background/VALIDATION.md) for completed build/native results.

The captures intentionally compare the same starting position under different compositions. They demonstrate presentation changes, not a human playthrough. Whether these cues tempt players into mistakes, preserve perceived fairness and make retries more fun remains a human playtest question.

Use `npm --prefix apps/native run android:sim` for the rebuilt local Android app. For iPhone, `npm --prefix apps/native run ios`, then select the App scheme, your device and signing team, and Run in Xcode. Native changes must be rebuilt and installed to appear on an already-installed phone; a Safari reload does not update the native app.
