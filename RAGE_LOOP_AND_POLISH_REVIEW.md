# EXCEPTION: HUMAN — rage loop and polish review

October 23, 2026. Reviewed local source at `6827ac7` on `feature/fullscreen-mobile-ui`, with the artifact-policy changes described below. **This document proposes gameplay changes; it does not implement them.** No commit, push, publication, store submission or native installation was performed for this review.

**Implementation update, October 23:** The user subsequently authorized all eight experiments and the UI work. They are now implemented as separate [Feedback Labs](FEEDBACK_LABS.md), with named launch choices, ordinary-input routes, touch/keyboard checks and compact desktop/phone UI. The original audit and reasoning below describe the baseline reviewed before that implementation. The per-server campaign redesigns remain directions to evaluate after feedback; the labs preserve the campaign's IDs and saves.

## Recommendation

Make the AI force the player to reconsider a habit, then let the player execute a satisfying answer. Build short, authored sequences around baiting a prediction, committing to a temporary rewrite, and handling the consequence of the escape. Keep the difficulty high. Invest first in three memorable sequences and clearer presentation before adding another center or more long corridors.

The desired retry has a specific reason: “I jumped too early; next time I bait the scan, hold my nerve, then jump.” Death should create a new plan or sharpen execution. Once the player knows a sequence, clearing it should feel like outplaying the same obnoxious machine.

Preserve the warm paper world, simple movement/jump/X controls, observer reactions, extensive snark, truthful collision cues and learned marks. Preserve the user-approved 15-second reading interval and two distinct presses/taps to skip. Keep fake billing disabled. Keep server IDs, saved progress, practice isolation and protected puzzle/rest areas intact.

## What was actually examined

- The current V3 gameplay and archived V3 design notes; campaign recipes/compiler/runtime; credits, advisory claims and cleanup; mobile layout/input/viewport code; the Localhost 18/Puzzle Box design and checks.
- The earlier [research proposals](RESEARCHED_GAMEPLAY_ADDITIONS.md), [workplace direction](LOCALHOST_PLAYTEST.md), [narrator review](NARRATOR_EDITORIAL_REVIEW.md), [art direction](OBJECT_ART_DIRECTION.md) and project guide. The earlier research's five-room framing is historical; this review addresses the current 20-server campaign plus the retained original 15-room playtest.
- Fresh Node route/regression checks and fresh WebKit/Chromium campaign and Cooling Incident checks. Inspected the newly generated desktop/phone campaign, directory, work-order and puzzle captures.
- Primary research papers, author manuscripts and official game/developer pages linked below. No new participant study or physical-device playtest was conducted.

The campaign contains **101 authored encounter entries**. There are **81 successive encounter spacings**, ranging from **400 to 1,140 world pixels**. Normal horizontal speed is 265 pixels/second; an empty 500-pixel interval alone takes about 1.89 seconds. The compiler explicitly authors safe landings after isolated encounters. This is a useful teaching foundation; later rooms need more relationships between those encounters.

The existing input helper cleared all 20 servers with zero deaths in **272.18 simulated seconds** on seed 424242. Its saved route has **zero leftward key presses** and 17 Rewrite presses. All ten forecasts are handled by approaching their trigger, stopping outside the captured region, waiting for completion, then proceeding. That is a valid strategy and a concrete opportunity to deepen later forecast encounters.

These are routes with knowledge of hazard coordinates and timings. The helper also solves Puzzle Box with its Boolean oracle. Its times are **neither human clear times nor an estimate of a first-time player's difficulty**. They demonstrate existence of a solution, not enjoyment, comfortable touch play, natural puzzle discovery or a robust range of successful inputs. [Local audit data](outputs/rage-design-review/runtime-audit.json), [input route](outputs/data-centers/campaign-route.json).

## Psychological evidence and its design implications

The research supports hypotheses about player experience. It does not provide a universal death rate, reaction-time target or retention recipe. Applications in the final column are this review's design inferences.

| Evidence | Finding and limit | Application to this game |
| --- | --- | --- |
| Ryan, Rigby & Przybylski (2006), four studies, [The Motivational Pull of Video Games](https://selfdeterminationtheory.org/SDT/documents/2006_RyanRigbyPrzybylski_MandE.pdf) | Perceived competence and autonomy related to enjoyment and motivation; intuitive controls related to these experiences. These results do not establish the ideal difficulty of a rage platformer. | Let the player feel increasingly capable while the tasks remain nasty. Keep input dependable and offer meaningful timing or route decisions. |
| Juul (2009), prototype player studies, [Fear of Failing?](https://jesperjuul.net/text/fearoffailing/) | Failure can prompt reinterpretation and richer strategy; perceived responsibility was associated with more favorable judgments. Limited prototypes and recruited samples constrain generalization. | A surprising death should reveal something the player can act on next time. Inspect whether players can identify a different response. |
| Abuhamdeh, Csikszentmihalyi & Jalal (2015; online 2014), [Enjoying the Possibility of Defeat](https://link.springer.com/article/10.1007/s11031-014-9425-2) | Two competitive-game studies linked outcome uncertainty to enjoyment through suspense, including a replay-choice measure. Reviewed the publisher abstract, not subscription full text. | Seek uncertainty about whether execution will succeed. This is not evidence for randomized lethal geometry or moving a target after lock. |
| Ballou & Deterding (2023), [I Just Wanted to Get It Over and Done With](https://selfdeterminationtheory.org/wp-content/uploads/2024/01/2023_BallouDeterding_IJustWanted.pdf) | Twelve interviews generated a model connecting expectation violations, need frustration and changes to play or quitting. Qualitative accounts do not quantify a causal retention effect. | Genre fans expect setbacks; persistent loss of agency or pointless repetition can still exhaust them. Separate delightfully hostile fiction from unreliable operation. |
| Inzlicht, Shenhav & Olivola (2018), review, [The Effort Paradox](https://static1.squarespace.com/static/56e19a6d04426223be32a8b9/t/5a8ef195e4966bdcfc7b0ccd/1519317401282/InzlichtShenhavOlivola_TiCS_2018.pdf) | Effort can be costly and also valued. This synthesis is not a trial of game length, setbacks or reward schedules. | Preserve earned triumph. Ask whether repeated work exercises skill or simply consumes time; those are different design costs. |
| McGraw & Warren (2010), five experiments, [Benign Violations](https://leeds-faculty.colorado.edu/mcgrawp/pdf/mcgraw.warren.2010.pdf) | Moral-violation studies found amusement when violations were also perceived as benign. Transfer to platforming humor is indirect. | Make the AI's sabotage absurd and the failure understandable. Let its denial follow a real success without undoing that success. |
| Tyack & Mekler (2024), [Self-Determination Theory and HCI Games Research](https://arxiv.org/abs/2405.12639) | Their analysis includes 259 HCI games papers and critiques shallow uses of motivation theory. | Use the research to choose experiments, then test this audience. Calling an obstacle “competence supporting” does not validate it. |

The working experience loop is: **expectation → betrayal → understandable failure → revised plan → difficult execution → visible victory over the AI → chosen next challenge**. The first betrayal can be outrageous. The second attempt must provide evidence that knowledge and control matter.

Evaluate voluntary replay and satisfaction alongside frustration. Longer sessions can mean confusion, and fast retries can mean an irritating interface. Neither alone establishes that players are having fun. A near miss should reflect the actual geometry and progress, consistent with the existing truthful progress remarks.

## Genre references worth studying

This is a selective comparison of useful design models, not a claim to rank the best games or explain their commercial success. Official descriptions establish the mechanics; the lessons are this review's interpretation.

| Reference | Relevant model | What to apply here |
| --- | --- | --- |
| [Level Devil](https://store.steampowered.com/app/3242750/Level_Devil/) | Authored platforming surprises and an overtly antagonistic comic identity. | Make the apparent solution itself an interesting setup. Author a second consequence after an obvious escape. Use original document operations and layouts. |
| [Jump King](https://store.steampowered.com/app/1061090/Jump_King/) | Charged jumps, commitment after takeoff and substantial falls. | Make the player choose a moment and live with it. In this game's existing physics, create commitment with a visible deadline or route choice rather than changing jump controls globally. |
| [Getting Over It](https://store.steampowered.com/app/240720/Getting_Over_It_with_Bennett_Foddy/) | A small input vocabulary supports difficult movement, large setbacks and commentary. | Reuse a mechanic deeply and give failure a recognizable antagonist. This does not establish that every Localhost death should erase the campaign. |
| [Super Meat Boy](https://store.steampowered.com/app/40800/Super_Meat_Boy/) | Direct precision platforming across distinct challenges and rising difficulty. | Give each sequence a strong physical identity and make practiced execution satisfying. Keep the project's explicitly requested reading/skip behavior. |

EXCEPTION: HUMAN's strongest differentiator is **the machine's assertion becoming physical, then being exploited by the human**. More generic moving obstacles would dilute that identity unless their document operation creates a distinct decision.

## Findings, ranked

| Priority | Current evidence | Proposed improvement |
| --- | --- | --- |
| 1 | The zero-death route waits out every forecast without reversing. The target is correctly fixed after capture. | Retain the simple introduction, then add one authored forecast sequence where the initial staging spot becomes unusable through another visibly warned operation. Make the player deliberately bait and leave the target. |
| 1 | Most recipes sequence isolated hazards across ample permanent floor. | Build a few compact two/three-beat interactions. A jump should influence the next landing or rewrite decision. Preserve recovery space between sequences. |
| 1 | The phone's two-line narrator truncates the opening introduction before its final instruction. At 844×390, the directory initially presents numerous comparison/practice buttons before the server list. | Give the current action its own compact, untruncated cue. Put Start/Continue and current server first; place comparison labs within Practice. Preserve access to every lab and full remarks in the paused AI Log. |
| 2 | In the known route, server 12 spends 6.68 of 16.14 seconds stationary on the ground; server 14 spends 5.10 of 14.64 seconds that way. | Give notice waits a timing/routing decision. Keep safe waiting as a teaching strategy, then provide an earned faster crossing or an authored movement requirement in later combinations. |
| 2 | Reversal spends a credit on the first leftward step and again by distance; the budget estimator counts jumps/rewrites, with four spare credits. | When authoring reversal challenges, explicitly budget required left travel. Verify exploratory corrections do not repeatedly trigger resource rewinds before the player can learn the main trick. Preserve shared credit rules while testing an isolated comparison. |
| 2 | Server 18 adds a substantial circuit task inside a platforming route; the automatic solver bypasses comprehension entirely. | Test the protected puzzle as a deliberate change of pace. Measure the cost of solving it again after a later death before proposing any local persistence. Preserve the current reset in the baseline. |
| 2 | The desktop capture at 1280×900 has a tall narrator/status region above the game; the full canvas extends below that initial viewport. | Compact the playing HUD and move full diagnostics/work orders into an overlay. Fit the entire world viewport and essential controls without an initial scroll. |
| 3 | Many overlapping progress, guess, credit, cleanup and narrative signals are present. | Prioritize active lethal warning, Rewrite state, then commentary. Retain the large libraries and rotating backgrounds, with enough quiet space to read the current danger. |

Grounded stationary time includes legitimate required waits and puzzle cooling; it is not all wasted time. The percentages flag rooms to observe, not instructions to delete every pause. Current screenshots and automated layout checks cannot establish physical readability or thumb comfort.

## Concrete obstacle rebuilds

Every idea below is **PROPOSED**. Initial durations and geometry must be authored in an isolated practice fixture, then checked in simulation, real-time browser play and physical iPhone play. Existing protected waits must remain protected; do not simply remove their cleanup exemptions to create urgency.

### 1. Forecast trap with an escape commitment — first prototype

**Setup:** A permanent staging shelf faces a small, visible landing beside a temporary bridge. Approaching the shelf's edge captures a forecast on the next landing. A separate redaction strip under the forward staging position has its own clear warning.

**The nasty moment:** Continuing right enters the captured target; stopping at the forward position eventually loses support. The player must choose where to bait, retreat onto the permanent part of the shelf, then Rewrite and cross after the purge. A tighter replay branch permits a correctly timed crossing during the sequence.

**What makes winning satisfying:** The eye attacks empty paper while the player uses the error to open a traversal window. Give the miss a brief visible cancellation stamp and an event-specific denial.

**Solvability requirements:** The permanent retreat area must stay outside the purge and redaction. Keep the captured box fixed. Reset/rearm the sequence after a miss without leaving an unusable bridge. Teach target capture independently before combining it with support loss. Test standing still, running through, jumping over, retreating early and the intended bait route; recognize valid alternate solutions.

### 2. Landing review — punish the obvious panic jump

**Setup:** An already learned floor scanner encourages jumping. The broad landing beyond it contains two visibly distinct strips: a short safe strip and a later redaction whose warning starts on approach.

**The nasty moment:** Holding right through the whole jump lands the player in the later redaction. Releasing horizontal movement after clearing the scan lands on the safe strip; the player must then time the next crossing.

**Payoff and bounds:** The AI's failed scan is followed by a visibly authored review of the landing. Preserve current in-air control. Reveal both support edges before takeoff at phone widths. Keep at least one tested interval of successful takeoff/release times; avoid a single-frame landing solution.

### 3. Cancellation receipt — a wait becomes a choice

**Setup:** A physical notice has two marked routes around its footprint. The cautious path waits behind the impact column. The faster path crosses a raised, visible support during a telegraphed phase.

**The nasty moment:** Reflexively rushing after the first warning gets crushed; waiting until the notice withdraws works, but costs route time. Experienced players can learn the earlier safe crossing.

**Payoff and bounds:** The notice is an obstacle with mass and a usable relationship to surrounding geometry, rather than a countdown to watch. In the first version it need not become a new moving platform; reuse fixed supports. The safe route stays viable with cleanup paused during the required wait. Verify the actual falling silhouette matches the collision box.

### 4. Rewrite handoff — one room, one explicit rule

**Setup:** Two rewrite targets and a permanent midpoint. A clearly declared local rule allows one active rewrite at a time. The player crosses a bridge, then transfers Rewrite to an exit barrier.

**The nasty moment:** Transferring too early withdraws the bridge under the player. Delaying too long loses the crossing opportunity. An optional airborne transfer can be the harder replay route.

**Payoff and bounds:** X becomes a timing decision without adding buttons. This develops the existing unimplemented “one active lie” proposal. It requires object-specific rewrite state and targeting work; do not impose the limit globally. A permanent midpoint supports an ordinary solution and recovery. Current `glitch[a.kind]` activation is shared by kind, and the compiler currently permits only one wall per server; neither is a ready implementation for this design.

### 5. Autosave betrayal — a bounded recoverable setback

**Setup:** A clearly fictional `SAVED SUCCESSFULLY` stamp marks a short section, while the actual permanent floor beneath it is visibly perforated. Approaching starts an honest physical deletion warning.

**The nasty moment:** The apparent celebration is followed by a route change. Failure drops the player onto a lower return strip and loses a short, authored stretch instead of always causing death.

**Payoff and bounds:** A save-themed joke becomes a physical recovery challenge and gives the player a chance to rescue a mistake. Never alter real save files or revoke a recorded server clear. The lower strip needs explicit support, safe camera framing, a way back up and a bounded exit; this is new geometry, not a copy change. Prototype after the first three rebuilds.

### 6. Confidence review — a sequence instead of a health bar

**Setup:** A short incident combines a forecast, a timed passage and a landing review, with a permanent breath point between phases. The eye grows visibly more defensive after each successful escape.

**The nasty moment:** The AI tries a different authored tactic after being beaten. Repeating the first response without reading the next warning fails.

**Payoff and bounds:** The climax is the AI running out of competent excuses. Drive progression from actual survival/crossing events. Keep the sequence fixed across retries; do not secretly adapt lethal rules based on player history. Later phases should combine known rules rather than introduce several new ones at once. No requirement to convert ordinary servers into formal proof gates.

### 7. Impossible paperwork — chosen replay challenge

**Setup:** After a first clear, offer a clearly optional harder route through an existing sequence. A paper stamp recognizes a clean bait, a tighter landing or a complete chain.

**The nasty moment:** The normal exit is close, but the player voluntarily risks a harder flourish.

**Payoff and bounds:** Show actual time, deaths or achieved counterplay and the observer's response. Start with one run-local stamp, with no new currency, shop or progression tree. Keep it independent of campaign unlocks and banked credits. This extends an existing proposal; optional stamps are not implemented now.

### 8. The machine almost admits it — success polish

**Setup:** A meaningful successful action gets a short paper cancellation mark, a recognizable audio cue and one grounded reaction.

**The nasty moment:** The AI starts to concede, then invents an excuse. The game still records the real win.

**Payoff and bounds:** Strengthen the existing observer and victory receipts rather than adding another scoreboard. Distinguish deliberate action outcomes where observable; simply surviving outside a purge should not claim an elaborate maneuver. Preserve reading access and audio preferences. Keep celebration outside active danger and avoid adding mandatory delays to every obstacle.

## Per-server direction

Times below are the verified helper's simulated clear times, rounded to one decimal. They are provided to compare authored scope, not prescribe human performance. Preserve all IDs and unlock relationships. Changes to early rooms should be small; full rebuilds start in separate practice comparisons.

| Server | Encounters / known route | Recommended role or change |
| --- | --- | --- |
| 01 | 1 / 3.1s | Keep a crisp first betrayal: opening redaction, an understandable loss, and a clear retry. Fix the truncated phone instruction before adding mechanics. |
| 02 | 2 / 5.1s | Contrast missing support with an active scanner. Make the learned responses visibly different. |
| 03 | 3 / 7.6s | First anti-jump lesson: the airborne field must make “stay low” discoverable. Preserve the real revised boundary. |
| 04 | 4 / 8.9s | First rhythmic combination of low/high decisions; introduce a landing review only after those rules are understood. |
| 05 | 8 / 17.8s | First compact incident: two related sequences with the existing maintenance break between them. Cut empty approach travel before increasing encounter count. |
| 06 | 1 / 3.1s | Keep the first required Rewrite clean and readable. Teach expiration and a recoverable reset before demanding a fast handoff. |
| 07 | 3 / 7.4s | Make barrier release affect the approach to the next scan. Preserve an obvious staging point. |
| 08 | 3 / 7.4s | Teach the Git seam betrayal with an honest learned marker, then require landing beyond it after a bridge. |
| 09 | 3 / 7.5s | Candidate for a bridge/barrier timing comparison once object-specific rewrite state exists; keep the baseline until its alternate route passes. |
| 10 | 10 / 22.2s | Make Route Optimizer's bad recommendation visibly set up a genuine route decision. Build a recognizable midpoint and final combination. |
| 11 | 1 / 4.3s | Retain the isolated forecast introduction. Observe deliberate baiting before forcing a commitment. |
| 12 | 4 / 16.1s | First notice-route rebuild. Replace one serial wait with a choice between a cautious crossing and a learned faster line. |
| 13 | 5 / 11.1s | Best first landing-review comparison: transform alternating fields into a short movement pattern. Keep launch and landing visible together. |
| 14 | 4 / 14.6s | Best first forecast commitment comparison. Use the shifting receipt's existing locked-target behavior, with a safe staging/rearm area. |
| 15 | 12 / 30.5s | Preserve live cleanup and committed receipts. Combine learned decisions into two distinct chase phrases; do not add another unrelated meter. |
| 16 | 3 / 7.6s | Three deadlines currently use the same basic rewrite-and-cross response. Give them different commitment points or landing choices, while preserving expiration visibility. |
| 17 | 4 / 11.1s | Place an authored landing decision after the first seam; ensure the later notice cannot silently hide the second real seam. |
| 18 | 10 / 32.8s | Preserve traps → warned chase → protected four-input Puzzle Box → cooling → escape. Test circuit comprehension and post-puzzle replay cost separately before changing persistence or adding pressure. |
| 19 | 6 / 16.1s | A short confidence test combining already learned choices. Add no new lethal rule this close to the finale. |
| 20 | 14 / 37.9s | Build three authored phases around existing maintenance breaks and a final visible AI concession. Each phase should demand a different learned response. |

For the original long rooms, audit repeated travel and compaction separately from Localhost cleanup. The current original campaign's 15-second compaction and its reset rules are established behavior. Prototype a shorter replay path or local solved-state persistence only where observation demonstrates stale repetition; do not silently apply checkpoints or remove compaction throughout the game.

## Presentation and feel work

1. **Make the current decision readable.** Give an active purge its locked boundary/countdown; a rewrite its exact target/state/expiration; a physical notice its impact column. Put actionable information before long introductory copy. Keep misleading decorative claims stylistically distinct from active warnings.
2. **Fit the playfield.** Compact the desktop header. On phones, reserve the thumb regions and test a full launch/landing view with real fingers covering the screen. The fixed Jump button remains fixed; its moving version is explicitly deferred.
3. **Simplify the first menu choice.** Lead with Start/Continue, then Practice and settings. Put comparison labs and mapped expansions behind clear secondary navigation. Preserve every current route and planned-status distinction.
4. **Rehearse the failure beat.** Preserve the full reading pause, actual cause, rotating joke and two-press skip. Check whether a new player discovers the skip and whether a held jump causes an accidental retry. Keep the AI Log available for reading later.
5. **Let success register.** Use existing miss/crossing/clear signals to drive small paper reactions and audio. Avoid a second message replacing the payoff immediately. The large remark libraries should have editorial timing, not all speak at once.
6. **Tune from contact and input evidence.** Preserve the existing 90ms coyote time and 130ms jump buffer as the baseline. Investigate unwanted jumps, misses, collision silhouettes and camera behavior before changing gravity or speed. Device listening, latency and touch acceptance need physical checks.

## Build order and acceptance criteria

These are project decisions and proposed experiment gates, not thresholds established by psychology. Avoid changing multiple systems in the same comparison.

| Step | Concrete deliverable | Evidence needed before applying to the campaign |
| --- | --- | --- |
| 0 — completed here | Capture policy, tracked-capture cleanup and this review. | Ignore checks and local-file preservation; no history rewrite. |
| 1 | Compact phone instruction and campaign/practice navigation; fit desktop playfield. | Real-time browser checks at relevant desktop/phone sizes; all menu routes remain accessible; physical iPhone observation of the first minute. |
| 2 | Separate forecast commitment version based on server 14. | Fixed target and truthful warnings; repeatable ordinary-input clear; intended and alternate strategies tested; players can explain the choice after a loss. |
| 3 | Separate landing-review version based on server 13. | Nonzero windows of successful inputs; visible landing; reliable touch and keyboard execution; repeated failures lead to different attempts. |
| 4 | One notice-route rebuild based on server 12; strengthen success feedback. | Cautious route remains viable; practiced route offers a meaningful skill advantage; satisfaction and voluntary replay improve directionally. |
| 5 | Integrate the successful versions into stable server IDs, then reshape incidents 10/15/20. | Full campaign/practice/save/credit/cleanup regressions, rebuilt mobile parity and human comparisons. Recompute action budgets and safe rewind points. |
| Later | Rewrite handoff, recoverable setback and optional mastery route. | Each earns its complexity in isolation. Do not bundle all three into the initial experiment. |

## Playtest the reason to retry

Start with 12–20 participants for directional observation, intentionally including rage-platformer fans and less experienced players. Report those groups separately. Use matched baseline/rebuilt rooms and counterbalance order. Familiarity carries over between versions, so also inspect the first-exposure results; this small study cannot establish a population retention effect.

Give equal time and compensation regardless of whether someone stops. After exposure, offer an unprompted choice to replay, try a harder branch, move on or finish. Avoid coaching a struggling player into the solution while counting their next attempt as spontaneous discovery.

Record these outcomes per sequence:

| Measure | What it helps distinguish |
| --- | --- |
| First death, actual cause, and player's explanation | A readable surprise versus unexplained punishment. |
| What changes on the next two attempts | Learning a rule versus repeating an action without a plan. |
| Deliberate bait/escape or rewrite timing, observed in input/position history | Using the signature mechanic versus surviving by waiting or accident. |
| Best progress, clear time, repeated already-mastered travel and forced-wait time | Escalating challenge versus stale repetition. |
| Frustration, perceived control and satisfaction after a clear, each on a simple 1–7 item | A hard, gratifying sequence versus an annoying one. These are lightweight project ratings, not a validated psychometric scale. |
| Free-choice replay/harder-route selection and the stated reason to stop | Chosen engagement versus time spent because the session demands it. |
| Touch errors, hidden targets, inability to read a warning, audio recovery | Presentation/input failure versus intended challenge. |

A useful early gate is that most participants in the intended audience can explain the rule after one or two failures and visibly alter their next attempt. A successful rebuild should preserve or raise frustration while increasing control/satisfaction and chosen replay. Treat that as a directional design goal; publish counts, individual trajectories and counterexamples rather than a small-sample “retention lift.” Stop and revise an encounter if it lacks a robust ordinary-input solution or routinely hides the actionable cue.

If later testing asks whether players return on another day, measure that separately with a voluntary follow-up. Same-session retry is not day-one retention. Local observer notes are enough for the first study; optional local JSON event export can come later, without introducing an account service or network dependency.

## Engineering boundaries for redesign

- Author recipes and shared modules, then rebuild with `python3 tools/build-mobile.py`; never hand-edit generated campaign/native copies. Keep original prototypes and the ZIP intact.
- For combined hazards, test all active-phase overlaps, required waits, reset/rearm states and a practical range of input timings. An oracle-perfect route is the starting check. Add boundary cases for late jumps, early reversals, Rewrite expiration, repeated X and pause/resume at each phase.
- Build an ordinary-input solution with sufficient credits for every required jump, rewrite and reversal. Test extra failed experiments and exhausted-credit compaction. Revalidate safe return geometry and a solvable reset on both sides of every new combination.
- Preserve 16+6 cleanup timing outside authored exceptions, the 400-pixel guide/head start, maintenance bays and protected hazard/puzzle waits. Keep the Puzzle Box hot sink outside its safe deck. Revalidate Localhost 18 compaction returning before a reset box.
- Current rewrite timers are shared by kind and `nearest()` selects by horizontal distance. Object-specific handoffs or vertical targeting require explicit changes and compatibility checks. Do not assume adding another object to JSON creates independent state.
- Keep cosmetic/advisory randomness separate from collision rules and captured lethal targets. A clever fixed second trap is different from secretly changing the solution after a death.
- Preserve at least twelve themed background remarks for every new practice/campaign level and the existing nonrepeating loss pools. Review new lines against the actual triggering event. New mechanics need matching remarks, not generic insult volume.
- Run campaign, cleanup, credits and affected mechanic checks; original 15-room reachability and PC/mobile parity; then WebKit/Chromium input/layout checks. Native simulator execution and physical iPhone completion/readability/audio are separate gates when packaging a changed game.

## Verification and repository changes from this review

Passed in this review:

- `node tests/data-centers.test.mjs`: 20 Localhost routes across four seeds, saved progression, practice isolation, disabled paywalls and safe return points.
- `node tests/forecast-feedback.test.mjs`: locked-target behavior and the original fifteen-room ordinary-input completion route.
- `node tests/loss-remarks.test.mjs`: 15-second reading, two distinct skip inputs, held-key guard, touch acknowledgments and persistent remark rotation.
- `node tests/cooling-incident.test.mjs` and `node tests/credits-and-advice.test.mjs`: integrated server 18, cleanup/puzzle/credit recovery and shared resource rules.
- With `PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers`, `tests/data-centers-browser.test.mjs` and `tests/cooling-incident-browser.test.mjs`: WebKit/Chromium campaign replays, save/reload/menu checks and integrated cooling route, touch handlers, layouts, pause and restart. The suites instrument time and use scripted inputs; these are not physical-device or human-play results.
- Sixteen positive/negative ignore checks covering captures, nested test reports, native binaries, Play Store evidence, native artwork and retained fixtures/archive. `git ls-files -ci --exclude-standard` is empty after cleanup. The loose forecast screenshot's SHA-256 was identical before/after removing it from the index.

Changed `.gitignore`; added [artifact policy](ARTIFACT_POLICY.md) and the [Play Store evidence README](release/play-store/evidence/README.md); updated `agents.md` to point to both policies and this review. Removed tracking of one loose historical screenshot while preserving it locally and preserving the original supplied ZIP. Existing native icons/splashes remain source assets. The deletion is staged by `git rm --cached`; other edits are local and uncommitted. No repository history was rewritten.

Generated evidence remains ignored under `outputs/rage-design-review/`, `outputs/data-centers/`, `outputs/local-host-puzzle/` and the existing suites' output folders. This review does not establish that any proposed obstacle is implemented, harder, funnier, physically comfortable or better at retaining players.
