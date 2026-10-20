# EXCEPTION: HUMAN narrator library

The snarky narrator is a central part of the user's intended replay appeal. Maintain a substantial authored library alongside every hazard family. Current player appeal is a design goal; the remark count alone does not establish it.

## Background comments are a permanent staple

The user explicitly singled out “You didn't make it this far before” and “Last time you failed earlier” as central to the game's appeal. The [background voice](BACKGROUND_VOICE.md) now supplies 544 distinct authored lines, including twelve for every current level and the glass lab. **Every future level must add at least twelve unique themed background jokes**, alongside the shared progress-aware and compaction commentary. Keep encountered notes in the mobile AI Log and preserve per-pool rotation across retries and New Run.

Counts in the earlier sections below describe those historical narrator updates; the background library is separately enumerated and verified in `tests/background-voice.test.mjs`.

## Original loss library

The playable HTML contains **160 distinct loss remarks**, with **32 per hazard family**:

| Family | Example |
| --- | --- |
| Falling and missing support | “The floor is now serverless. So are your feet.” |
| Classifier rejection | “The rejection is automatic. The smugness is handcrafted.” |
| Policy receipts | “That was a pop-under. It places the user under the popup.” |
| Forecasts | “I offered a preview. You purchased the full experience.” |
| Expired walls | “You were through the door emotionally. The rest of you needed to hurry.” |

The complete [remark library](outputs/narrator/remark-library.json) is exported for editorial review. `LOSS_REMARKS` in the [playable HTML](initalDemoDocs/Exception_Human_Misclassification_V3.html) remains the runtime source, keeping the game self-contained and offline.

## Selection and replay behavior

Each family has its own cursor. The narrator works through all 32 lines in that family before wrapping, so repeated failure at one obstacle does not immediately recycle a handful of jokes. Starting a new run preserves the cursor. Where browser storage is available, cursors also survive closing or reloading the game. Denied storage or malformed stored data falls back to safe in-memory rotation.

This stores only remark cursors, not gameplay progress or personal information. Dialogue selection does not alter physics, traps, timing, or completion.

Loss remarks retain the 15-second reading pause and two-press Space/Enter or two-tap Continue skip. The actual failure reason remains separate from the model's self-serving explanation.

## Editorial rules

Read the [narrator clarity pass](NARRATOR_EDITORIAL_REVIEW.md). Anchor jokes in visible objects or actual events, use everyday wording, and avoid layered abstract metaphors. Shared pools must fit every event that can select them; warnings must not announce a mistake before the player makes it. Keep level counts out of reusable remarks.

- Maintain at least 30 distinct lines per existing hazard family. The regression check enforces that floor; extend the library when adding new hazards.
- Write complete jokes tied to the event, rather than swapping adjectives into one template.
- Aim for one or two short sentences. The current library is checked against the narrow-screen loss card.
- Give the model absurd confidence, evasive reasoning, bureaucratic excuses, selective statistics, and an allergy to admitting fault.
- Make the humor about the fictional machine, its world, and the player's in-game decisions.
- Preserve successful counterplay. A snarky denial cannot undo a player's win or conceal the real collision reason.
- Keep the library authored. No AI API call or network dependency is needed for fresh remarks.
- Do not reset the library when restarting the run, and do not shorten the reading pause to increase retry speed.

## Verification

`node tests/loss-remarks.test.mjs` checks unique content, at least 30 lines per family, complete cycles without early repetition, continuity across new runs and simulated reloads, and denied/corrupt storage fallback. It also retains the reading-time and skip checks.

The browser check renders all 160 remarks at a 390-pixel viewport and confirms that every line fits the loss card without internal scrolling. See the [longest-line capture](outputs/forecast-feedback/longest-remark-mobile.png) and [browser results](outputs/forecast-feedback/browser-results.json). Browser storage persistence is tested through a simulated storage implementation; the actual local-file storage behavior depends on the browser. Human reading comfort and humor still need playtesting.

## Success and frustration responses

The implemented observer adds 80 authored lines, bringing the combined loss and success library to 240. Each of the six frustration stages has ten lines; successful rewritten crossings and escapes each have ten contextual lines. The [additional library](outputs/observer/remark-library.json) is exported for review.

Successful crossings, survived forecasts, room clears, and the final escape update a separate MODEL RESPONSE line. It stays visible until the next successful event, without delaying gameplay or replacing hazard warnings. Generic lines follow the cosmetic frustration stage; rewrite and escape lines match their actual event. The second survived forecast references the earlier miss. Cursors use the same safe persistence mechanism as loss remarks, with independent keys per pool. A full restart clears composure but retains dialogue rotation.

Keep the 160 loss lines and their reading pause intact. New success pools supplement them. Do not reward X spam with a reaction or represent an intended rewrite press as proof of a failed prediction. See [character direction](FAKE_AI_CHARACTER_DIRECTION.md) and [observer validation](outputs/observer/VALIDATION.md).

## Compaction remarks

The requested [conversation compaction](COMPACTION_DIRECTION.md) adds 60 rotating authored remarks in `COMPACTION_REMARKS`, for 340 total lines across all libraries. This pool has its own persisted cursor. Its terminal remains visible through the full 15-second interruption; the ordinary loss reading pause and its skip controls stay separate. Compaction can reset the current room's traps and return position, as explicitly requested, but cannot undo a completed room or erase the observer's recorded frustration.

## Bad autocomplete and victory logs

Twenty additional lines in `AUTOCOMPLETE_REMARKS` react to a player visibly contradicting the dotted ghost's fixed suggestion. Following a suggestion or dying before its deadline earns no rejection remark. Each pool rotates independently and uses the same safe cursor persistence. The current combined library has 340 authored lines.

The separate victory-log panel records the truthful result of a successful action alongside the model's self-serving expectation and blame. It survives deaths, retries, and compaction within the run; a full restart clears its in-memory history. See [tech direction](TECHNO_GEEK_DIRECTION.md), [additional remarks](outputs/tech-feedback/autocomplete-remarks.json), and [validation](outputs/tech-feedback/VALIDATION.md).

Autocomplete now cycles through walk, jump, and wait suggestions and can make multiple guesses per attempt. Each verified rejection still earns one authored remark and receipt. Disagreement chains provide visible feedback for consecutive contradictions; best-chain and cumulative counts survive losses and compaction. See [extension direction](LEVEL_EXTENSION_DIRECTION.md). The total authored library remains 340 lines.

## False flags and shifting drops

Twenty additional lines in `MISDIRECTION_REMARKS` introduce the long level's airborne flags and relocating receipts: ten per variant. Each pool rotates independently through the existing safe persistence mechanism. Combined libraries now contain 340 authored lines. These warning reactions supplement the 160 loss remarks; the actual loss reason and 15-second reading pause remain separate. See [direction](FALSE_FLAG_DIRECTION.md) and [additional library](outputs/fake-flags/remark-library.json).

## Secret commits

The secret-commit bounce mechanic adds a sixth loss family with 32 unique Git remarks. The current loss library has 192 lines and the combined authored library has 392. Keep the real Git failure reason separate from the insult. See [trap direction](SECRET_GIT_BOUNCE.md).

## AI billing interruptions

Thirty-two new billing remarks accompany eight fake AI paywalls. The combined authored library now has 424 remarks; loss remarks remain 192. Offers and confirmations freeze the world and wait for explicit free-plan dismissal. See [fake AI paywalls](FAKE_AI_PAYWALLS.md).

## Data Center campaign

Localhost adds 240 authored background lines across twenty servers, bringing the shared background library to 544 unique lines. New server recipes and voice live in `campaign/`. Keep at least twelve distinct authored jokes per playable server and preserve randomized placement, truthful progress eligibility and reading stability. See [Data Center campaign](DATA_CENTER_CAMPAIGN.md).

### Localhost disaster voice

The workplace-disaster playtest adds sixty server-specific loss remarks and twenty escape excuses in `campaign/localhost-incidents.json`. Two losses in three use the current server’s rotating incident pool; the third retains the existing hazard-specific narrator. Keep the actual failure reason and full reading interval. Escape excuses require a real clear, appear in a quiet 12-second paper receipt and enter mobile AI Log; practice/final completion also displays the relevant excuse. See [Localhost playtest](LOCALHOST_PLAYTEST.md).

## Thermal logic-gate remarks

[Thermal Support Ticket](THERMAL_SUPPORT_TICKET.md) now uses actual Boolean logic ICs. Gate selection is separate from rotation; describe truth tables, enables and real electrical faults. Do not refer to elbows, pipe pieces or automatic selection advances. Keep its thirty distinct burn remarks and thirty distinct electrocution remarks separate. The `cooling-shock` pool is selected only for live ground-bus electrocution; it must not fall back to a generic server excuse. All 116 level lines are unique, including twenty-four background notes. Preserve persistent rotation and the full loss reading interval.

## Puzzle Box remarks

The separate fixed-wire Puzzle Box practice level adds 76 authored remarks: 16 backgrounds, 8 input changes, 4 arrivals, 8 harmless failed tests, 6 successes, 4 resets and 30 shock losses. Copy must distinguish unpowered preview from a deliberate live TEST. Ground preview alone never electrocutes; use the shock pool only for a powered DECK 1. Inputs are switches; gates never rotate. Keep the large persistent loss pools, explicit failure cause and reading interval. “Black Box” remains reserved for a later mechanic. See [Puzzle Box](THERMAL_SUPPORT_TICKET.md).
