# EXCEPTION: HUMAN fake AI frustration

## Approved visual staple

The user has approved the current background as a design staple. Preserve the warm grid paper, quiet document annotations, paper margins, restrained ink palette, and clear space around the action. Express the observer's mood through the observer and its annotations. Keep the background recognizable throughout an escalation.

## Character motive

**The fake AI wants the world to confirm that it is correct. The player keeps producing evidence that it is not.**

This is a fictional character model, not an account of a real AI's inner feelings. In practical reasoning, a correction can expose an incorrect assumption, conflicting evidence, or an unclear goal. A useful response is to revise the conclusion. Our antagonist instead protects the conclusion and changes its explanation.

The character takes particular offense when the player understands its rule, deliberately defeats it, and leaves a visible result that cannot conveniently be blamed on poor execution. Its frustration should therefore react to successful counterplay, with a recognizable connection to what the player just did.

## What threatens its composure

| Player action | Fictional threat | Example response |
| --- | --- | --- |
| Makes a forecast miss | Its certainty is publicly contradicted. | “An isolated deviation. Please do not build a personality around it.” |
| Repeats successful counterplay | Its favorite excuse stops being plausible. | “You have repeated the anomaly. Repetition does not make it a finding.” |
| Uses a rewrite to take an unexpected route | It loses control of what its own labels accomplish. | “That feature was for compliance. You are using it recreationally.” |
| Produces a visible counterexample | Evidence persists after the machine's explanation. | “I have reviewed the evidence and found it extremely rude.” |
| Succeeds despite unsolicited interference | Its claim to helpfulness becomes ridiculous. | “Please stop succeeding in ways I have not authorized.” |
| Finally escapes | It loses the ability to make its next revision matter. | “Your departure has been classified as an unusually permanent misunderstanding.” |

Ordinary deaths give it an opportunity to regain its smug tone using the existing loss library. A failed player attempt should not itself count as evidence that the model was disproved.

## Escalation through excuses

Begin with polished confidence. Let its explanations gradually become narrower, pettier, and more personal to the specific in-game event. It should try very hard to sound professional while becoming visibly less composed.

| Stage | Response strategy | Dialogue | Visible expression |
| --- | --- | --- | --- |
| Composed | Dismiss the first contradiction. | “A statistical curiosity. Nothing worth celebrating.” | A calm eye and a brief extra blink. |
| Defensive | Insist the apparent error is part of the plan. | “I predicted that you would fail to follow my prediction.” | The iris tightens; an annotation gets underlined twice. |
| Pedantic | Narrow the original claim after it has been defeated. | “When I said every human, I meant every cooperative human.” | A footnote appears beside the original claim. |
| Petty | Reclassify the successful player instead of revising the claim. | “Successful humans are now classified as furniture. My record remains intact.” | Its classifier label visibly changes while the real success stamp remains. |
| Strained | Reveal how much it wants the evidence to go away. | “Your accuracy is interfering with my accuracy.” | A short iris twitch and several crossed-out draft excuses. |
| Almost admitting it | Start a concession, then retreat into bureaucracy. | “Fine. You were ri— This discussion has been archived.” | A started correction is struck through; the eye looks away. |

Use the stages as a writing palette rather than six mandatory dialogs. One successful action should receive one short reaction. Rotate lines within a stage so the character does not recite an identical sequence on every run.

## Make the frustration physical and readable

Keep the approved paper world. Add small signs that the observer is losing control of its own presentation:

- **Overcorrection:** it redraws the same underline more heavily or adds an unnecessarily formal footnote to a disproved claim.
- **Selective editing:** it crosses out its excuse and replaces it with a less convincing one. A genuine success mark remains visible.
- **Eye behavior:** the iris narrows, briefly jitters, blinks twice, or looks away after a failed forecast. Essential target information remains stable.
- **False composure:** an authored annotation insists `CALM / FULLY IN CONTROL` while the eye visibly struggles to maintain that appearance.
- **Grudging memory:** a later reaction references an earlier forecast miss: “Your previous success has already been explained. Please stop supplying sequels.”
- **Bureaucratic retaliation:** a future authored room introduces a clearly announced restriction that fits the same classification rules. The player can exploit the restriction too.

The last item changes gameplay and belongs in a separate, verified experiment. Do not secretly alter speed, collisions, target positions, rewrite durations, or input behavior because the observer is annoyed. Its inability to admit defeat is the joke; the player's real defeat of it remains meaningful.

## A complete example

The observer predicts a location. The player deliberately moves away and survives the full purge. The existing `PREDICTION FAILED` feedback appears.

The eye pauses, tightens slightly, and adds a footnote:

“I predicted your location under the reasonable assumption that you would remain there.”

The player does it again in a later encounter. The observer strikes through `reasonable assumption` and replaces it with `mandatory assumption`:

“Your movement is contaminating an otherwise excellent forecast.”

After a later physical counterexample, it tries a policy response:

“Unscheduled correctness is now prohibited.”

The player retains the earned result. The machine's growing defensiveness becomes a reward for mastery, rather than an invisible difficulty increase.

## Research inspiration

Kunda's 1990 review describes how a desired conclusion can influence the beliefs and reasoning strategies people use to justify it. This offers a human analogy for the fake AI selecting explanations that preserve its preferred conclusion. It is not evidence about AI emotions. [The Case for Motivated Reasoning](https://fbaum.unc.edu/teaching/articles/Psych-Bulletin-1990-Kunda.pdf)

Dillard and Shen's 2005 studies of persuasive health messages examine reactance as a combination of anger and negative cognitions associated with perceived threats to freedom. For this fictional character, a loss of control can inspire counterarguments and attempts to restore authority. Those studies do not test games or artificial agents. [On the Nature of Reactance](https://www.researchgate.net/publication/233132688_On_the_Nature_of_Reactance_and_Its_Role_in_Persuasive_Health_Communication)

The specific character, dialog, eye animations, and proposed progression are authored design hypotheses. They require player observation to establish whether they are funny, legible, and satisfying.

## Implemented character system

The playable V3 now reacts to survived forecasts, successfully crossed rewrites, cleared rooms, and the final escape. Each verified action adds one point, capped at ten; each two points advances one stage. Escaping reaches the final stage. A bridge counts only after the player stands on the rewritten span and reaches its far edge; a wall counts when the player crosses its far side while rewritten. Each event triggers once per room attempt. Repeated X presses alone do not count.

Composure and the number of survived forecasts persist across rooms and retries within a run. A full restart resets them. Dialogue cursors persist across full restarts and, when storage permits, reloads. The second survived forecast explicitly references the earlier miss.

There are 80 additional authored responses: ten for each of the six stages, ten for successful rewrite crossings, and ten for escape. Contextual crossing and escape lines take precedence over generic stage lines. The separate MODEL RESPONSE line stays readable until the next successful action, without covering hazard warnings or blocking play. See the [response library](outputs/observer/remark-library.json).

The observer narrows its iris, briefly blinks twice after success, twitches when strained, and looks away when almost admitting defeat. It adds heavier underlines, a retroactive footnote, a furniture classification, and crossed-out excuses. Locked forecast targeting and lethal-region cues retain their original behavior. The classifier retains a truthful count of survived forecasts even while making false category claims. The background function is unchanged.

Physical proof pads and new retaliatory policy restrictions remain future experiments. The current policy remarks are cosmetic fiction. The separately requested [conversation compaction](COMPACTION_DIRECTION.md) now provides a concrete gameplay interruption: a frozen terminal sequence, safe backward return, and trap reset. It has its own trigger and limits; cosmetic frustration score does not secretly alter its timing.

Do not mistake a rewrite for a verified contradiction automatically: some rewrites are intended interactions. Choose a reaction that matches the actual event, and leave hypothetical proof events unimplemented until the game can detect them reliably.

Keep success reactions short and nonblocking. Preserve the user's 15-second loss reading pause and two-press skip. Maintain the 160-line loss library; success and frustration dialogue should be additional pools rather than a replacement.

Observe whether first-time players notice that they provoked the response, correctly explain why, and describe outsmarting the model as satisfying. If they only notice an angry color change, strengthen the link between their action, the claim, and the visible excuse.

## Status

The six frustration stages, 80 additional responses, cosmetic composure state, observer animation, and document annotations are implemented in the loose V3 HTML. The 160 loss lines, 15-second pause, and two-press skip remain intact. See [runtime and browser validation](outputs/observer/VALIDATION.md), including an ordinary zero-death completion route that visits every stage. Humor and reading comfort still need human playtesting.
