# False flags and shifting drops

The user requested fake red AI flags that bait a jump into a real aerial hazard, plus falling traps that move ahead of a moving player. These variants are implemented in room seven, **Context Window Exceeded**, available through **Practice long level** in the [game](initalDemoDocs/Exception_Human_Misclassification_V3.html).

The twenty encounters now comprise ten redactions, four ordinary ground scanners, three airborne flag traps, and three shifting receipt drops. The other six rooms retain their existing hazard behavior.

## Fake floor flag, real aerial rejection

At x=2240, 5960, and 9680, a faded red ground flag is only the AI's original claim. It has no collider. The actual rejection field is overhead, spanning y=283–355, while a standing human occupies y=405–439. Walking underneath is safe; a habitual jump over the floor claim enters the real field.

Approaching within 190 pixels of the flag triggers a 0.55-second warning. The overhead field appears in its true location with gold brackets before turning red and lethal. The ground claim is then labeled `STALE CLAIM`; the actual field says `RELOCATED FLAG`. A learned marker identifies the overhead location after a genuine death. Rendering and collision share `scanRect`, so the active box is also the physical hazard boundary.

The earlier warning gives the player time to notice the revised field and choose to stay on the ground. An unusually early jump can also land before reaching it. The authored trick rewards learning rather than changing the player's jump physics.

## Falling receipts that relocate ahead

At authored claim positions x=3480, 7200, and 10920, a rejection receipt captures a revised horizontal destination when the player approaches. If the player is moving, it projects 230 pixels ahead in that movement direction, then bounds the result within 170 pixels of the authored location. A stationary player retains the original location.

The receipt slides toward the captured destination during a 0.65-second warning. A dashed gold travel column, `DROP TARGET LOCKED`, and countdown show the revised position; a faded outline labels the old floor claim. Once captured, the destination remains fixed even if the player reverses direction. When active, the moving paper receipt itself is lethal. The travel column describes its path, not a permanently lethal wall.

The normal drop/retraction cycle remains 1.35 seconds. Baiting the destination, stopping outside it, waiting for retraction, and crossing is a verified route. The old claim does not collide. Rendering uses the interpolated horizontal position during the nonlethal warning and the captured position thereafter; active collision uses that same captured position.

A reset does not allow a receipt whose original claim has already been passed to summon a new trap ahead of the returned player. Such a passed shifting receipt is marked done. This preserves the authored compaction return routes and prevents old traps from pursuing indefinitely after a reset. Ordinary fixed receipts in earlier rooms remain unchanged.

## Remarks and presentation

Two new rotating pools add ten remarks each for airborne flags and shifted drops, bringing the combined authored library to 340. They use the existing safe persistence mechanism. Examples:

- “The floor flag was decorative. The air flag has tenure.”
- “You moved forward. I have forwarded the problem.”

The exported [remark library](outputs/fake-flags/remark-library.json) contains the exact runtime lines. The HTML remains authoritative. Controls, background, loss reading pause, compaction guarantee, cap, and cooldown remain intact.

## Verification

See [validation](outputs/fake-flags/VALIDATION.md), [airborne field](outputs/fake-flags/actual-air-flag.png), and [shifting target](outputs/fake-flags/receipt-target-shifting.png). Tests verify safe decoys, lethal actual fields, direction-sensitive but fixed captured targets, visible warning motion, counterplay, and retained learned identity. All seven rooms still have an ordinary-input zero-death route, and the long room's five-seed and all-return-point recovery checks pass with actual compaction.

Human playtesting must establish whether the revised warnings are legible and the deception feels satisfying. These are authored deterministic variants, not unbounded homing hazards or random invisible collision changes.
