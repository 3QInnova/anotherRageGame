# EXCEPTION: HUMAN origins and player outcomes

Prepared October 13, 2026.

**EXCEPTION: HUMAN should turn a surprising failure into a reason to try again, then reward the player for understanding and outsmarting an overconfident AI.** Its success depends on players feeling that their next attempt can be better. Deaths, insults, and difficult jumps support that experience; their quantity alone does not measure success.

The current reference is V3, a five-room browser platformer built around temporary reclassification and AI-themed hazards. The immediate goal is to establish that this loop feels responsive, surprising, understandable, funny, and worth repeating before expanding content or committing to a production engine.

## How the direction developed

### The earlier rage game research

In the October 2 discussion for the separate `MasterRageBait` project, the starting request was to research ten strong rage-game references and combine their useful characteristics into a mobile game. That research produced a design comparison, not a verified popularity ranking or a study of why every player enjoys the genre. Its central emotional sequence was an obvious goal, a confident attempt, an understandable betrayal, recovery, learned counterplay, and earned success. [Earlier research](../MasterRageBait/RAGE_GAME_RESEARCH_AND_CONCEPT.md)

The discussion then sharpened three requirements:

- **Beatable but surprising.** The user wanted unpredictable events that could end an attempt, while retaining a real path to completion.
- **A distinct identity.** The user repeatedly challenged ideas that merely combined familiar games.
- **An annoying AI with physical consequences.** The user preferred an AI that changes the playable world and confidently defends its mistakes.

The first tower-and-delivery concept was revised after an overlap review found familiar premises and an already-used working title. A temporary direction let players turn malfunctions into useful geometry. The later AI direction made that relationship more explicit: request a change, receive a confidently wrong patch, then survive or exploit the result. [Originality review](../MasterRageBait/ORIGINALITY_REVIEW.md), [AI direction](../MasterRageBait/AI_VIBE_CODING_DIRECTION.md)

The strongest personal motivation appeared in the earlier conversation: the user described the satisfaction of proving AI wrong. That led toward evidence, contradiction switches, and visible verification. The desired payoff was a player demonstrating that the machine's conclusion was wrong through an action in the world.

These records establish an earlier related design trail. They do not establish that every feature from that project became part of EXCEPTION: HUMAN. Request cards, token budgets, compaction, evidence sockets, and its charged-jump controls are background ideas, not requirements or implemented features in the current V3.

### V1 established the classification premise

The first supplied EXCEPTION: HUMAN prototype was a three-room top-down maze. The player asked the AI to identify a tile, and its mistaken answer temporarily changed every object of that type. Walls became doors, voids became bridges, safe tiles became holes, and an exit could become decorative art.

This established the core fiction: a machine's confident label determines how the world behaves, and the human can exploit the label. However, the V2 notes identify the first version's weakness as a maze with too few reaction challenges or costly surprises. The idea worked as a rule puzzle, but needed a stronger trap-runner rhythm. [V1 prototype](initalDemoDocs/Exception_Human_Prototype.html), [V2 notes](initalDemoDocs/EXCEPTION_HUMAN_V2_Design_Notes.md)

### V2 introduced the failure and mastery loop

V2 changed the game into five compact platforming rooms. A visible exit invites commitment; a floor disappears, spikes appear, or an audit panel drops. Death restarts the room after roughly 0.39 seconds of simulation time, and learned markers reveal hazards on later attempts. X temporarily creates a bridge, removes a barrier, or restores an exit.

This revision put the earlier research into playable form: few inputs, short attempts, bait-and-switch traps, near-win reversals, authored commentary, and a chance to improve immediately. Fixed triggers protect the player's ability to learn. The final exit audit fires once, allowing a subsequent rewrite to produce a real finish. [V2 prototype](initalDemoDocs/Exception_Human_Devils_Run.html), [V2 notes](initalDemoDocs/EXCEPTION_HUMAN_V2_Design_Notes.md)

### V3 gave the mechanics a coherent identity

V3 retained the platforming foundation but presented the world as a misclassified document. Collapsing ground became redaction, spikes became false-positive detection areas, falling blocks became physical policy popups, and pits became NULL references. A machine-vision eye observes a bracketed human on warm grid paper.

V3 also added predictive purge. The model locks a region ahead of the player's movement, shows its forecast, then makes that region lethal. The player can bait the prediction and move elsewhere. This creates a direct opportunity to disprove the model through movement, extending the identity beyond visual substitutions. [V3 prototype](initalDemoDocs/Exception_Human_Misclassification_V3.html), V3 design notes inside the [playtest pack](initalDemoDocs/EXCEPTION_HUMAN_V3_Playtest_Pack.zip)

The current loop is therefore: approach an apparently manageable route, encounter an AI mistake, survive or learn from failure, rewrite or evade the model's assertion, and escape. Its next challenge is to make that sequence enjoyable to people encountering it for the first time.

## What the rage game research contributes

The October 2 comparison covered ten references. The lessons below are design interpretations from that comparison, rather than causal findings about their audiences. References contribute principles; they do not require importing their controls, punishment, or complete feature sets. [Original comparison and source links](../MasterRageBait/RAGE_GAME_RESEARCH_AND_CONCEPT.md)

| Reference | Lesson retained | Application to EXCEPTION: HUMAN |
| --- | --- | --- |
| Getting Over It | Loss creates stakes; mastery gives progress meaning. | Make success feel earned while keeping introductory retries local. |
| Level Devil | An easy-looking route can betray expectations. | Stage readable AI mistakes near moments of commitment. |
| Jump King | Commitment makes timing consequential. | Give temporary rewrites meaningful timing windows without importing charge controls. |
| Geometry Dash | Timing, practice, and visible improvement support repetition. | Keep timing consistent and let players recognize better attempts. |
| TrapAdventure 2 | A surprise can become something the player outsmarts. | Ensure a discovered trap has understandable counterplay. |
| Super Meat Boy | Precise execution and escalating obstacle sequences sustain challenge. | Protect responsive movement and build compact sequences. |
| Pogostuck | Shared performance can give mastery a social purpose. | Test spectator comprehension; defer multiplayer infrastructure. |
| That Level Again | Familiar space can acquire a different solution. | Use classification changes to alter a room's meaning. |
| A Difficult Game About Climbing | The edge of safety creates tension. | Use expiring support and recoverable near misses deliberately. |
| The Impossible Game | Few inputs can support demanding timing. | Keep move, jump, and rewrite legible throughout the game. |

Current official descriptions reinforce several reference patterns: [Level Devil](https://poki.com/en/g/level-devil) describes deceptive paths and changing hazards; [Super Meat Boy](https://store.steampowered.com/app/40800/Super_Meat_Boy/) emphasizes reflex platforming and escalating difficulty; [Getting Over It](https://store.steampowered.com/app/240720/Getting_Over_It_with_Bennett_Foddy/) explicitly combines practice, commentary, progress loss, and a reward for mastery. These descriptions establish what those games offer, rather than why a particular feature caused their appeal.

### Why failure can still support enjoyment

Jesper Juul's account of game failure explains a useful paradox: players dislike failing yet pursue games that let them confront and overcome their inadequacy. Applied here, a failed attempt needs to preserve a credible route toward improvement. [The Art of Failure](https://jesperjuul.net/artoffailure/)

Ryan, Rigby, and Przybylski's four studies found associations between perceived competence and autonomy and game enjoyment; intuitive controls also related to these experiences. The implication for this project is to protect reliable inputs and meaningful counterplay. This research concerns games generally, rather than proving a formula for rage games. [The Motivational Pull of Video Games](https://selfdeterminationtheory.org/SDT/documents/2006_RyanRigbyPrzybylski_MandE.pdf)

The project's hypothesis is that players will accept brief frustration when they understand what happened, see something they can change, and want the satisfaction of beating the model. Humor and spectatorship may strengthen that loop, but both need observation with this game. A funny death clip and an enjoyable playing session are separate outcomes.

## Outcomes the game needs to achieve

### Reliable control under pressure

Players should quickly learn movement and jumping, then trust that inputs produce consistent results. The earlier conversation rejected having to fling the character everywhere and asked for crisp, immediate left/right response; that preference supports protecting the current straightforward movement rather than reviving an older control scheme.

Observe accidental inputs, jump failures, and what players blame after death. If several testers describe sticky movement, uncertain collisions, or touch problems, fix those before tuning trap difficulty. Essential cues must remain useful with sound off.

### Surprise followed by understanding

A first encounter should overturn an expectation. Afterward, the player should be able to identify the cause and propose a response: jump earlier, wait for the popup, rewrite closer to the crossing, or move out of a locked forecast.

Learned markers and visible state changes should turn surprise into useful information. Repeated deaths with no new understanding indicate a readability or timing problem. The V2 suggestion of a satisfying surprise every 5–10 seconds is a pacing hypothesis, not a required death rate. [V2 playtest guidance](initalDemoDocs/EXCEPTION_HUMAN_V2_Design_Notes.md)

### A voluntary next attempt

The player should want to continue after the first betrayal. Automatic respawning makes another attempt possible; it does not prove the player wanted one. Observe whether they resume movement, change their approach, and persist when they are free to stop.

Keep the gap between death and meaningful input short. Preserve already-cleared rooms. Avoid death-triggered ads, paid rescues, or other interruptions that would break the practice loop; this carries forward the earlier research's product hypothesis. [Earlier research](../MasterRageBait/RAGE_GAME_RESEARCH_AND_CONCEPT.md)

**Current user preference:** The user found the original remarks too fast to read and requested 10–15 seconds after a loss, with a couple of Space or Enter presses to skip. The current version therefore uses a 15-second reading pause with a two-press skip and a two-tap Continue button. Evaluate both reading comfort and how easily experienced players can resume; the earlier fast-retry recommendation must not override this accepted behavior.

### Progress through learning

The same player should improve at a repeated challenge. Improvement may appear as fewer deaths, faster traversal, better timing, or an earlier recognition of danger. Raw clear time alone can conceal players who advance through luck while remaining confused.

Every room needs a completion route through normal inputs, and that route must remain usable after a failure. An automated route establishes mechanical reachability; human performance establishes whether the route is discoverable and satisfying.

### The satisfaction of proving the AI wrong

The player should recognize a machine claim, perform a deliberate action, and see a contradictory result. Predictive purge already offers this structure: the model says where the human will be, the human changes course, and the purge misses. A successful rewrite similarly turns a machine-defined obstacle into an escape opportunity.

However, convincing the model to invent a bridge is different from demonstrating that its reasoning was wrong. To deliver the earlier emotional goal fully, contradiction needs to be visible. Test whether players describe their success as fooling or outsmarting the AI, and whether they remember the claim they defeated. A future verification reaction or evidence mechanic may strengthen this payoff; it is not implemented in V3.

### Humor that survives repetition

The AI's confidence should make its failures amusing. The physical consequence needs to be readable even if the caption is missed. Repeated lines should not become another delay or overwhelm the action.

Ask what players found funny after the session, without suggesting the AI as the answer. Distinguish amusement at a specific event from polite approval of the premise. A useful scene includes a claim, a consequence, player counterplay, and a visible payoff.

### A recognizable identity

Players should independently describe the game in terms of rewriting or defeating an AI's classifications. The paper world, observer, annotations, and semantic hazards should reinforce that description.

If players mainly describe a familiar trap platformer with AI dialogue, the distinctive mechanic has not landed. Strengthen the player's effect on classification and the consequences of being wrong before adding more conventional hazards. This tests recognizable identity; it does not establish worldwide uniqueness.

### An earned finish and a reason to replay

The final exit must produce a genuine end. The AI can contest the player once for comedy, but a successful counteraction must resolve the contest. Completion should let the player feel that their learning paid off.

After the win, offer a clear opportunity to stop or replay. Observe whether players choose another run for mastery, fewer deaths, experimentation, or another amusing interaction. The current death counter provides a potential goal; a replay feature by itself cannot establish replay interest.

### Readable moments for spectators

A short scene should communicate the apparent goal, betrayal, and outcome without a lengthy explanation. Show representative clips to people who have not played and ask them to explain what happened.

Spectator comprehension is a prerequisite for useful clips. Requests to share or challenge a friend are stronger evidence of interest than prompted statements that the game would be good for streaming. Viral reach remains an untested distribution hypothesis.

## The unresolved meaning of unpredictable

V3 has fixed, position-triggered traps. It can surprise an unfamiliar player, but a practiced player can memorize much of the sequence. Predictive purge varies its locked location with the player's movement, providing responsive counterplay without random deaths.

This meets the goal of learnable surprise more directly than the earlier ambition for unpredictable events across attempts. It does not yet establish lasting unpredictability on repeat runs. Make that distinction explicit when deciding what to build next.

First establish that the fixed five-room loop is enjoyable. If repeat play becomes rote, test a small set of authored alternatives. Hold a selected state stable during practice, communicate enough for a response or informed retry, and verify a completion route for every permitted combination. Adding variants should preserve mastery; arbitrary lethal randomness would undermine the improvement loop.

Request families and seeded builds from the earlier project offer one possible approach, not a commitment to import that system. New classification interactions may provide enough variety without it.

## How to judge the next playtest

Use ten first-time testers if practical, with both difficult-platformer fans and less experienced players, and record the groups separately. Explain controls but leave traps undisclosed. Give a consistent observation window and let participants stop freely. Ask about fairness, humor, and the AI after observing play so those questions do not coach their interpretation.

The following are **proposed prototype decision thresholds**, not industry benchmarks or achieved results. The voluntary retry, failure explanation, and replay thresholds carry forward the October 2 plan; the other numbers are starting targets for this version.

| Outcome | Evidence to collect | Starting decision threshold |
| --- | --- | --- |
| Controls are learnable | First successful movement and jump without coaching | At least 8 of 10 within 30 seconds. |
| Failure makes sense | Neutral explanation of the last death and intended response | At least 7 of 10 identify the cause and a plausible change. |
| Players choose to retry | Active attempts after the first surprise, without urging | At least 7 of 10 resume and make two further attempts. |
| Learning improves play | First five attempts compared with the next five at the same challenge, where available | A majority of eligible testers show better progress or execution; report early clears and quits separately. |
| Rewrite is understood | First required bridge rewrite without coaching | At least 7 of 10 who reach it use X successfully within three attempts. |
| The AI identity lands | Unprompted description after playing | At least 6 of 10 mention changing classifications or outsmarting the AI. |
| Proving the AI wrong feels rewarding | Recall of an actual contradiction or deliberate rewrite | At least 6 of 10 who experience one identify a specific satisfying action. |
| Winning invites replay | Choice after clearing, without a request to replay | At least half of clearers begin another run; report the number of clearers. |
| A clip communicates the joke | Explanation from five separate viewers unfamiliar with the game | At least 4 of 5 explain the cause and outcome. |

Measure actual death-to-input delay alongside the nominal 0.39-second reset, deaths and time per room, repeated failure points, clearers, quits, and positive or negative reactions to particular hazards. Count voluntary play separately from observation-session compliance. Small samples guide revisions; they do not establish retention or market demand.

For predictive purge, specifically record whether the player notices the locked region, changes direction or waits deliberately, and recognizes why they survived. Compare those observations with reactions to the redaction and scanner. This resolves whether the added mechanic delivers a stronger experience rather than merely a different visual.

## Development decisions that follow from the results

If players blame inputs, prioritize movement, collisions, and touch behavior. If they cannot explain deaths, improve telegraphs and cause-and-effect presentation. If they understand failures but stop trying, shorten repeated travel, tune difficulty, or strengthen the payoff. If they enjoy escaping but cannot describe the AI interaction, deepen reclassification and visible contradiction.

Expand rooms or test variants after the core loop earns voluntary retries. Undertake a native port once the chosen behavior is worth preserving, then validate that behavior on physical devices. A browser screenshot, touch buttons, or scripted completion does not settle mobile usability.

The V2 and V3 notes report browser checks and scripted completion of all five rooms. These establish reported prototype functionality, while the player outcomes above remain to be measured. The central acceptance question is whether people leave a failed attempt knowing what to try next, and leave a successful one feeling that they beat the model through their own actions.

## Source records

The current version history is supported by [V1](initalDemoDocs/Exception_Human_Prototype.html), [V2](initalDemoDocs/Exception_Human_Devils_Run.html), [V2 design notes](initalDemoDocs/EXCEPTION_HUMAN_V2_Design_Notes.md), [V3](initalDemoDocs/Exception_Human_Misclassification_V3.html), and the archived `EXCEPTION_HUMAN_V3_Design_Notes.md` in the [V3 playtest pack](initalDemoDocs/EXCEPTION_HUMAN_V3_Playtest_Pack.zip). See [agents.md](agents.md) for resource and implementation guidance.

Earlier project research is linked to the sibling `MasterRageBait` folder. Those links depend on this local workspace arrangement. Historical user preferences were checked against the October 2 local Codex conversation record, rather than a direct search of the complete ChatGPT account history. The current project's supplied notes establish V1–V3; the earlier discussion provides related motivation and design context.

The academic sources above add broader context about failure, competence, and agency. They were consulted for this document and should not be represented as part of the original October 2 research.
