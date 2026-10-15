# EXCEPTION: HUMAN gameplay additions and research

Research checked October 13, 2026. These are candidates for testing against V3. The forecast feedback portion of candidate 3 is now implemented in the loose V3 HTML; the other additions remain proposals. Player appeal remains to be tested.

## Implementation status

| Idea | Status | Next decision |
| --- | --- | --- |
| 1 One active lie | Documented proposal | Compare two-object room versions before applying a global limit. |
| 2 Physical proof challenges | Documented proposal | Test one proof pad after forecast feedback is understood. |
| 3 Bait the observer with a clear lock | Forecast feedback implemented | Observe deliberate baiting and understanding of the locked region. New room layouts remain proposals. |
| 4 Optional impossible stamps | Documented proposal | Test one optional branch after a first clear. |
| 5 Approval that survives a retry | Documented proposal | Compare local persistence with a checkpoint where retries become tedious. |
| 6 Small declared policy changes | Documented proposal | Test two verified variants after fixed-room play succeeds. |

**The strongest direction is to give familiar actions more consequences.** Keep move, jump, and X, while making the player decide what to rewrite, when to commit, and how to make the observer's claim fail. Start with three experiments: one active lie, physical proof challenges, and a more readable prediction interaction.

The intended experience is: “I understand the rule, I have a plan, and I almost pulled it off.” Additional challenge should come from execution, tradeoffs, and combining learned rules. Every new rule needs an uncomplicated first encounter before appearing in a hazardous sequence.

## What the evidence supports

### Peer reviewed research

| Paper | Relevant finding | Application and limits |
| --- | --- | --- |
| Ryan, Rigby, and Przybylski, 2006, *The Motivational Pull of Video Games*, *Motivation and Emotion*, DOI 10.1007/s11031-006-9051-8. [Paper](https://selfdeterminationtheory.org/SDT/documents/2006_RyanRigbyPrzybylski_MandE.pdf) | Across four studies, perceived competence and autonomy related to enjoyment and motivation; intuitive controls also related to these experiences. | Test meaningful choices while preserving reliable movement. This does not establish that more choices, buttons, or difficulty automatically improve enjoyment. |
| Abuhamdeh, Csikszentmihalyi, and Jalal, 2015, *Enjoying the Possibility of Defeat*, *Motivation and Emotion*, DOI 10.1007/s11031-014-9425-2. [Publisher abstract](https://link.springer.com/article/10.1007/s11031-014-9425-2) | Two studies of competitive games found greater enjoyment with higher outcome uncertainty, mediated by suspense; participants also chose more suspenseful games over less suspenseful ones with higher perceived competence. | Create situations where execution can succeed or fail despite understood rules. This concerns competitive outcomes, not hidden lethal randomness in a single-player platformer. The accessible abstract and publisher notes support this summary; full subscription text was unavailable. |
| Gruber, Gelman, and Ranganath, 2014, *States of Curiosity Modulate Hippocampus-Dependent Learning via the Dopaminergic Circuit*, *Neuron*, DOI 10.1016/j.neuron.2014.08.060. [Accepted manuscript](https://escholarship.org/content/qt2zd605r7/qt2zd605r7_noSplash_442c2e267829848246b0ffc2e9beded1.pdf) | In trivia and memory experiments, high curiosity accompanied better memory for answers and some incidental information, including at a delayed test. | Give players a small question they can answer through play. The study does not measure game retention or establish that hidden mechanics improve a rage game. |
| McGraw and Warren, 2010, *Benign Violations*, *Psychological Science*, DOI 10.1177/0956797610376073. [Paper](https://leeds-faculty.colorado.edu/mcgrawp/pdf/mcgraw.warren.2010.pdf) | Five experiments concerning moral violations supported amusement when an event was perceived as both a violation and benign. | As a design analogy, make the machine's betrayal absurd while limiting its cost. This is indirect evidence; the experiments did not test platforming deaths or AI narration. |

A later critical review cautions against treating broad motivation theory as a plug-in recipe for successful games. Tyack and Mekler's 2024 article in *ACM Transactions on Computer-Human Interaction* examines shallow applications of self-determination theory in games research. That supports using these principles to form testable hypotheses, rather than declaring a mechanic scientifically validated. [Author manuscript abstract](https://arxiv.org/abs/2405.12639), [published article DOI](https://doi.org/10.1145/3673230)

### Recent reviews from established game publications

| Review | Useful observation | Design implication |
| --- | --- | --- |
| Steve Watts, *Big Hops*, GameSpot, January 13, 2026. [Review](https://www.gamespot.com/reviews/big-hops-review-the-years-first-great-game-is-mario-meets-breath-of-the-wild/1900-6418450/) | Praises movement options that connect naturally and flexible traversal tools; criticizes a more restrictive sequence. | A small action set can support experimentation when the world responds consistently. Allow some alternative solutions. |
| Steve Watts, *Blue Prince*, GameSpot, April 7, 2025. [Review](https://www.gamespot.com/reviews/blue-prince-review-an-intricate-layered-roguelike-puzzle/1900-6418355/) | Praises interlocking discoveries and knowledge that persists between runs; criticizes waiting for randomness to permit an already-known solution. | Preserve what players learn and avoid rerolling away the opportunity to apply it. |
| Shaun Prescott, *Animal Well*, PC Gamer, May 9, 2024. [Review](https://www.pcgamer.com/games/puzzle/animal-well-review/) | Describes ordinary tools gaining surprising additional uses and later discoveries making familiar areas interesting again; criticizes map readability. | Deepen an existing action before adding an unrelated subsystem. Discovery still needs readable presentation. |

These reviews are individual critical accounts, not controlled studies or proof of audience-wide preferences. They are useful comparisons for tool depth, discovery, and the cost of obscurity. Their genres differ from this prototype.

## Candidate additions

### 1 One active lie

**What the player sees:** “One rewrite at a time.” A bright outline identifies the object being kept in its rewritten state. Pressing X on a different highlighted object transfers the rewrite and restores the previous object.

**Example:** Rewrite a gap into a bridge, cross onto a stable landing, then rewrite the next barrier into air. An optional shortcut lets an experienced player transfer the rewrite while airborne. The bridge disappears immediately, making the shortcut a deliberate commitment.

**Why it adds depth:** The player chooses the order and moment of changes. The same button creates timing, routing, and resource tradeoffs without a currency meter or inventory. This is a competence-and-agency hypothesis, informed by the Ryan study and the flexible-tool examples in recent reviews.

**Important boundary:** Start in one experimental room. V3 currently permits simultaneous rewrite kinds, and bridge support is handled by specific gap IDs. Applying a global limit to the existing rooms could break their routes. Repeating X on the current object should simply refresh it, and its expiration must remain visible. Preserve a stable staging point and a completion route that does not require an unexplained midair transfer.

**Test:** Compare a two-object room with and without the limit. Look for deliberate transfer timing and alternative routes. Drop or revise it if players describe the mechanic as arbitrary deprivation, or cannot tell what will disappear.

### 2 Physical proof challenges

**What the player sees:** One short claim attached to a physical test: “NO HUMAN CAN REACH THIS PAD.” A landing pad and a little unfinished checkmark make the task visible.

**Example:** Bait the purge away from the pad, land there while the purge fires elsewhere, and earn a visible `DISPROVED` stamp. The model responds, “The successful human has been reclassified as equipment.” A local gate opens because the test has a counterexample.

**Why it adds depth:** The same jump now demonstrates something. Later challenges can ask players to cross with a particular object, use an expired-looking surface at the correct moment, or make a forecast miss. The player discovers a useful response and receives a visible acknowledgment of that response. This advances the project's established goal of proving the AI wrong.

**Important boundary:** The test must check an actual action, not award proof for collecting a token. Introduce it safely, keep claims short, and never require a long dialogue or typing. A missed test must rearm or allow an immediate reset. The model's sarcastic denial must not revoke genuine success.

**Test:** After a successful attempt, ask “What did you do?” and “What changed?” Players should describe the counterexample without being prompted to mention the AI. Compare satisfaction with an otherwise identical ordinary exit pad.

### 3 Bait the observer with a clear lock

**What the player sees:** The eye briefly scans, a ghost appears, and the target visibly locks. The player can stop, reverse, or jump away after the lock. A successful miss receives a brief failure mark on the ghost.

**Example:** Run toward the right edge to make the model forecast a target there; reverse after the lock and cross a lower opening while the purge attacks the empty region. A later room combines this familiar action with a temporary bridge.

**Why it adds depth:** Players control the setup as well as the escape. Difficulty comes from anticipating the observer and executing a response. The uncertainty study motivates testing suspense during a controllable contest; it does not justify a moving target that follows the player until impact.

**Important boundary:** V3 already has predictive purge. This candidate develops its readability and uses rather than claiming to invent it. Keep the locked target fixed until firing. Teach the interaction in open space before combining it with a rewrite deadline. Tune telegraph time from observation, not from a supposed universal reaction-time value.

**Test:** Record deliberate baiting separately from accidental survival. Compare the current forecast with clearer lock feedback. Keep the change if players understand the opportunity and use it again in another layout.

**Implemented feedback:** Approaching the trigger shows a scanning cue. At the existing trigger, the target locks immediately and stays fixed. A framed `TARGET LOCKED` warning, `MOVE OUT` countdown, solid corner brackets, and shrinking time bar mark the warning phase; `PURGE ACTIVE` marks the lethal phase. The eye aims at the locked region. Surviving the full purge displays `PREDICTION FAILED / HUMAN SURVIVED` for 1.15 seconds, accompanied by one short narrator response. The diagnostics announce phase changes without repeating the countdown to screen readers. Scanning is a visual approach cue, not an added simulation delay.

### 4 Optional impossible stamps

**What the player sees:** A small `IMPOSSIBLE` stamp on a clearly optional branch. Reaching it changes the label to `MODEL ERROR` and adds a mark to the finish screen.

**Example:** The ordinary route clears a room reliably. A side pad requires transferring a rewrite in midair while dodging the forecast. Both routes reach the same exit; the side pad recognizes extra mastery.

**Why it adds depth:** Players can choose a harder goal while less experienced players retain a finish. It gives returning players something beyond remembering trap locations and adds a reason to experiment with established mechanics.

**Important boundary:** Keep the exit available without the stamp. Begin with one stamp in one room, with no shop, stat boost, or progression tree. Make it unambiguous whether a mark survives retries or belongs to a single successful run; use run-based marks for the first experiment.

**Test:** Measure voluntary attempts after an initial clear. If players believe the optional stamp blocks progression, fix presentation. If it increases deaths without increasing chosen replay, it is merely another obstacle.

### 5 Approval that survives a retry

**What the player sees:** Successfully disproving a local claim stamps a small area `VERIFIED`. Its solved state survives deaths within that room and the current run.

**Example:** A proven bridge section remains available on later attempts, letting the player focus on a difficult purge beyond it. The model protests that the verification was “not representative,” but the useful route stays open.

**Why it adds depth:** A failed attempt can still contain progress. This may reduce repeated travel and make experimentation worthwhile. The Blue Prince comparison suggests a reason to test persistent progress, but does not establish that every puzzle should stay solved.

**Important boundary:** Keep it local and reset it on a new run. Do not make a death itself earn the approval. Compare persistent proof with an ordinary checkpoint: this mechanic must add satisfaction or meaning to justify its extra rules. It may reduce challenge, so use it where repetition is becoming tedious rather than throughout every room.

**Test:** Observe whether players try new solutions after earning approval and whether later attempts feel more focused. Remove it if replay becomes trivial or players no longer understand the room state.

### 6 Small declared policy changes

**What the player sees:** Before an optional replay, a single badge declares a changed rule, such as “SCANS MARK THE FLOOR” or “SCANS MARK THE AIR.” Symbols and geometry show the actual danger area.

**Example:** A familiar room has two authored versions. One purge is avoided by jumping; the other by staying low. The movement remains consistent, but the player must read the announced policy and apply a different response.

**Why it adds depth:** Knowledge transfers while the exact action changes. It creates replay variety without arbitrary controls or surprise deaths caused by invisible state changes.

**Important boundary:** This is a later experiment. Keep the main five-room sequence fixed initially. A selected variant remains unchanged through its retries. Start with two independently verified versions and one changing rule; do not combine every modifier or reroll on each death.

**Test:** After learning both versions, measure correct responses to the badge and voluntary replay. Drop the variant if familiarity provides no benefit, or if players must wait for luck to receive a beatable state.

## What to build first

| Priority | Experiment | Why this order |
| --- | --- | --- |
| First | Improve the existing forecast lock and visibly acknowledge a miss. | Tests the current defining mechanic with a small change and little new instruction. |
| Second | Add one physical proof pad using that forecast. | Tests whether the desired emotional payoff is stronger than ordinary survival. |
| Third | Build a separate two-object room with one active lie. | Tests deeper player choice without breaking the existing five rooms. |
| Next if useful | Add one optional impossible stamp. | Tests voluntary extra challenge after players understand the core rules. |
| Conditional | Add local approval persistence. | Addresses repetitive travel only where observation shows a need. |
| Later | Test two declared policy variants. | Adds repeat-run variety once fixed-room play earns voluntary retries. |

Do not add all six at once. Their individual value would become difficult to distinguish, and a new player would have too many states to track.

## One room that combines the strongest ideas

The eventual combined example is **Human Verification**, a compact room with a gap, a stable landing, a barrier, a forecast, and a proof pad.

1. Rewrite the gap and cross to stable ground.
2. Transfer the active lie to the barrier. The old bridge visibly returns to NULL.
3. Enter the observer's scan, wait for its target to lock, then reverse onto the proof pad while the forecast fires elsewhere.
4. The pad stamps the forecast `DISPROVED`; the exit opens and the observer gives one short denial.
5. An optional stamp rewards reaching the pad through a harder airborne transfer route.

Each part uses the same movement and X inputs. Challenge comes from the relationship between those actions. Teach the individual rules in separate rooms first. Room size, timings, and all routes still require implementation and verification; this is a design example.

## How to test appeal rather than merely difficulty

Use V3 as the baseline and compare one change at a time. For an early directional test, recruit roughly 12–20 players across different skill levels. Counterbalance the order of matched room versions to reduce the effect of learning the first one. Record player skill and which version they encountered first. A small test cannot establish a reliable population effect.

Collect deliberate counterplay, ability to explain the rule, accidental deaths, clear time, perceived control, satisfaction after success, and the choice to continue when stopping is allowed. Ask neutral questions after observation. For replay interest, include a free-choice opportunity before exposure to another version makes everyone familiar with the room.

More deaths count as useful added challenge only when understanding, successful adaptation, and willingness to continue remain strong. More play time may also mean confusion. A mechanic earns its place when players learn it, use it deliberately, find the resulting success satisfying, and choose another attempt or harder route.

Avoid increasing difficulty by adding unreliable movement, invisible expiration, punitive travel, mandatory collection, or unannounced rerolls. The model can be dishonest in its fiction while targeting highlights, collision cues, and actual completion feedback remain dependable.

## Project references

Use [Game origins and player outcomes](GAME_ORIGINS_AND_PLAYER_OUTCOMES.md) for the established goals, [V3](initalDemoDocs/Exception_Human_Misclassification_V3.html) for current behavior, and [agents.md](agents.md) for implementation guidance. Current X rewrites are timed by kind, forecasts lock targets from movement direction, and learned hazard markers survive retries. The candidates above extend those systems and must not be confused with existing functionality.
