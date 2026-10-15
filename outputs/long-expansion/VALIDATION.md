# Long-room expansion verification

Rooms eight and nine have ordinary-input zero-death practice routes across seeds 1, 7, 42, 424242, and 987654321, with one or two compactions each. Every authored return point has a tested zero-death recovery route. Fixtures establish checkpoint fallback, target capture, and skipped passed forecasts; normal-input runs separately establish completion without teleporting or trap edits.

[Runtime results](runtime-results.json) include seed timings and all return-point recoveries. [Practice routes](practice-routes.json) contain keyboard inputs with monotonic simulation timestamps. [Browser results](browser-results.json) record WebKit PC and iPhone layout runs. [Full campaign parity](../mobile/parity-results.json) compares 58,849 snapshots across all nine rooms, excluding presentation-only camera, pause, and orientation fields.

The original room-seven authored level and encounter literal is identical to the [pre-expansion snapshot](before-expansion.html). The existing background implementation is preserved. The new rooms add authored sequences and 20 rotating section remarks, without changing movement or jump constants.

The browser check selects each new room through its actual practice selector, replays the saved ordinary inputs, observes compaction, and verifies zero-death completion. It records actual forecast label draw calls and checks their positions within the PC and iPhone canvas bounds. [iPhone locked forecast](iphone-room-9-forecast.png), [iPhone compaction](iphone-room-9-compaction.png), [PC start](pc-room-8-start.png), and [iPhone completion](iphone-room-9-clear.png) provide visual evidence.

Forecast, original long room, fake-flag, loss-reading, observer, compaction, autocomplete, original extension, and floor-deception Node checks passed. Chromium completed the expanded campaign; WebKit verified touch handling, pause/rotation, loss hold, and compaction recovery. Browser automation does not establish enjoyment or physical iPhone performance for the new levels. Friend playtest feedback remains the next acceptance step.
