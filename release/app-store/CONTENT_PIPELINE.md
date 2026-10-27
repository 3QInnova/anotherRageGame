# EXCEPTION HUMAN downloadable content pipeline

October 25, 2026. Proposed implementation specification supporting the [App Store deployment plan](../../APP_STORE_DEPLOYMENT_PLAN.md). The client, schema, publisher, and hosted environments described here still need to be built.

Keep game code inside the reviewed app. Download authored data and media that the installed runtime already understands. Keep a complete Localhost campaign bundled so play never depends on a successful connection.

## What can change through content

| Requested change | Permitted format in this design | Requires an app update when |
| --- | --- | --- |
| Levels | Geometry, ordered encounter definitions, parameters within validated ranges, stable IDs, descriptions, required mechanics | A new collision rule, hazard implementation, input action, runtime interpreter, or native capability is needed |
| Badges and stickers | ID, plain-text name/caption, raster artwork, fixed price or an allowlisted earned condition | A new earning rule or purchase mechanism requires code |
| Commentary | Authored plain-text pools with causal/event tags and stable line IDs | A new event detector, runtime AI service, or different presentation behavior is needed |
| Backgrounds | Approved raster layers, palette choices, bounded parallax parameters, optional cosmetic composition data | A new renderer, shader, interaction, or gameplay-affecting effect is needed |
| Sounds and music | Licensed audio files and bounded parameters for the shipped audio system | A new synthesis algorithm, decoder, audio session capability, or interaction is needed |
| Seasons | Featured dates, included pack IDs, themed assets, allowlisted challenge and reward conditions | A new mode, monetization model, online competition, or age-sensitive capability is needed |
| Safety controls | Stop a content rollout or lower optional download activity | A switch would activate an undocumented feature or change platform permissions |

The release boundary is governed by the [Apple constraints in the main plan](../../APP_STORE_DEPLOYMENT_PLAN.md#apple-constraints-that-shape-the-design). A data pack must not become a general-purpose programming language. No executable expressions, downloaded JS/HTML/CSS, `eval`, remote module imports, event-handler strings, native plugin payloads, arbitrary shader code, or script-bearing SVGs.

The banner has one permanent bottom-center allocation in app code. Packs, release manifests, seasons, and remote configuration contain no advertising placement, dimensions, format, visibility rules, or control-layout overrides. Content updates cannot move, enlarge, or reclaim that space.

## Runtime changes in the repository

Refactor in small steps, preserving current behavior before adding network delivery:

1. Define content types and a bounded mechanic registry from the existing route pieces and encounter implementations. Keep the current level compiler as a trusted publishing tool where useful.
2. Convert Localhost's recipe, voice, reward, and background references into a schema that can load from either bundled files or verified downloaded files. Existing JavaScript helpers stay in the binary/tooling, not in the pack.
3. Publish fully expanded level geometry where that makes validation simpler. If recipes remain, accept only fixed mechanic IDs and typed numeric parameters; do not accept source code or open-ended conditions.
4. Put content selection behind a small `ContentRepository` interface. Provide bundled, local-test, and downloaded implementations. The simulation receives an immutable selected level, not a database client.
5. Separate active campaign content from archived comparison fixtures. Preserve existing IDs, reward eligibility, campaign saves, practice isolation, physical warnings, and cosmetic random streams.
6. Add a native file-cache interface for verified packs and a durable save adapter. Do not use WKWebView cache or localStorage as the only production copy of irreplaceable rewards.
7. Keep `tools/build-campaign.py`, `tools/build-mobile.py`, and native build scripts producing the browser and installed variants. Never patch generated HTML by hand.

Likely implementation locations are a shared `content/` module, `tools/content/` publishing tools, source schemas under `content/schemas/`, and native content/storage adapters under `apps/native/`. Choose the final layout during implementation after inspecting dependencies.

## Content records and identity

Maintain permanent IDs for centers, servers, packs, media, badges, commentary lines, and seasons. Never use an array index or an asset filename as an ownership ID. Never recycle an ID for a different level.

| Record | Minimum fields |
| --- | --- |
| Release | ID, schema version, runtime contract, compatible build range, content revision, creation time, pack list, key ID, signature |
| Pack | ID, version, category, dependencies, file list, expected total bytes, SHA-256 hashes, required mechanics |
| Level | Existing server ID, level version, center/chapter/order, title, geometry or bounded recipe, exit/returns, voice pool IDs, reward eligibility |
| Voice pool | Pool ID, causal family/event, stable line IDs, plain text, locale, age/editorial tags |
| Badge | Existing or new badge ID, earned/style classification, raster asset ID, condition enum and threshold or fixed Token price |
| Season | Season ID, theme, featured start/end in UTC, included packs, entry requirements, reward IDs, archive behavior |
| Channel assignment | Channel, increasing deployment sequence, release ID, rollout percentage, effective time, publisher, reason |

For compatibility, record both the pack version and the runtime contract that interprets it. A version number alone does not prove an old client can load a new mechanic. Unknown required mechanics reject a pack; unknown optional decoration may use an explicitly defined fallback.

Use a **signed release manifest**, not just hashes. Hashes detect corruption; a signature tied to an app-bundled public key authenticates who published the content. Use a reviewed signature implementation and keep private publishing keys outside the app, source repository, and general editor credentials. Specify canonical bytes and key rotation before implementation.

A manifest should identify immutable files, not contain arbitrary filesystem locations. Reject traversal, external redirect chains, unexpected hosts, undeclared files, MIME mismatches, oversized images/audio, archive bombs, and excessive object counts. Prefer separately hashed files over compressed archives for the first implementation if this removes extraction risk.

## Supabase service design

Use separate staging and production projects. Keep editor/publishing records in an unexposed schema, and private draft assets in a private bucket. Copy only approved immutable objects into the published-content bucket. A public bucket is for genuinely public, free released content; possession of an obscure URL must not be the draft access control.

The game can read a signed channel manifest and public immutable files without a player account or a privileged SDK key. Avoid adding a player auth session solely to download free content. Serve the small channel pointer through a cacheable public endpoint or signed static object; keep the database and administrative writes behind server/operator authorization.

Proposed tables are `content_packs`, `content_versions`, `assets`, `releases`, `release_packs`, `channel_assignments`, and `publish_audit`. Add `seasons` and editorial references only when the first pilot needs them. Tables describe published artifacts; they do not turn the database into the active game loop.

Security requirements:

- No service-role key, secret key, database password, or publishing private key in the phone, browser bundle, or content pack.
- Enable RLS in every exposed schema and grant only the operations actually needed. Keep drafts and audit records inaccessible to public clients.
- Give editors draft rights; give the publisher promotion rights. Keep release approval and promotion auditable even when the owner fills both roles.
- If authenticated administration is added, authorize from controlled roles/app metadata, not user-editable metadata. Restrict privileged functions and avoid publicly callable definer functions.
- Validate storage permissions, exposed grants, API routes, and advisor findings in staging. Test actual public reads and denied public writes.

Supabase requires explicit grants and RLS as separate controls. Its announced Data API exposure change is scheduled to apply to all existing projects on **October 30, 2026**; design for deliberate exposure rather than automatic table access. [API security](https://supabase.com/docs/guides/api/securing-your-api), [exposure change](https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically), [Storage access](https://supabase.com/docs/guides/storage/security/access-control).

Use immutable version/hash paths with long cache lifetimes for files. Give the small channel pointer a short freshness policy and conditional fetching. Do not overwrite a published `latest.json` level or replace media under a long-cached URL. Supabase Storage provides CDN delivery, with Smart CDN available on Pro and above. [Smart CDN](https://supabase.com/docs/guides/storage/cdn/smart-cdn).

The publishing tool should use a currently supported, pinned Node runtime and locked dependencies. Supabase's client libraries dropped Node 20 support in June 2026; choose Node 22 or later if using those libraries. [Runtime support change](https://supabase.com/changelog/45715-deprecation-notice-dropping-support-for-node-js-20).

## Phone download and activation flow

1. Start immediately using the bundled or last verified installed content. A network check must not delay Play.
2. Fetch the channel pointer opportunistically from a menu, with a timeout, backoff, and conditional request. A failed check is quiet unless the player explicitly requested a download.
3. Verify the signed manifest, compatible build/runtime contract, dependencies, expected size, storage budget, and channel. Reject incompatible content with a readable message and retain the current catalog.
4. Show optional pack size and a download action. Respect a Wi-Fi-only preference and cancellation. Do not silently download a large season on cellular.
5. Download to temporary app storage with bounded concurrency. Verify each file, then validate all level/content constraints. Partial downloads are never visible as installed content.
6. Commit the complete pack and dependency set atomically. Preserve the previous working release and a local journal for recovery after termination.
7. Activate only at the main menu or between levels after the player finishes the current receipt. Pin each attempt to its selected content revision; never change geometry, warnings, commentary text, or reward prices during an attempt.
8. Offer the new content in the library and record the active content version in diagnostics. Retain a route back to bundled Localhost.

Proposed starting budgets are a manifest under 256 KiB, a typical chapter under 10 MB, an ordinary media pack under 25 MB, and a 250 MB optional cache. Measure and revise these product limits before freezing the schema; they are not platform limits. Cap decoded image dimensions, voice text length, simultaneous objects, and audio buffer memory independently of compressed file size.

The system can evict re-downloadable cache files. Pin active dependencies and retained save/reward references, detect missing files, and fall back or re-download safely. Keep saves in durable application storage, separate from the cache. Offer clear download removal controls that explain what remains owned.

## Publishing lifecycle

Use **draft → automated validation → human editorial and route review → staging → internal TestFlight → external beta when warranted → production**. Each promotion selects the same immutable artifact; do not rebuild content between the tested pack and its promotion.

Start with a local command that produces a validation report and a human-readable diff: levels changed, geometry changes, added/removed lines, reward changes, media sizes, required runtime, and age/editorial assessment. The owner approves that concrete release before production promotion. Routine future publishing authority can be delegated explicitly later.

Validation must cover:

- Schema/types/bounds; unique IDs; dependency closure; compatible mechanics; media hashes/decoding; file budget; signature verification; provenance and licenses.
- Ordinary-input completion and safe rewind points; stable timers; pause; cleanup waits; cooling and Puzzle Box safety; no reward leakage from practice.
- Save compatibility, badge prerequisites, reward idempotency, and a clear path through each new chapter.
- At least 12 themed background lines per future level; at least 24 for a full new campaign server where the authoring budget permits; retain at least 30 lines in each shared causal loss family.
- Commentary truthfulness by causal family, independent cursors, readable card lengths, randomized cosmetic placement, and truthful active hazard cues.
- Real iPhone touch, framing, readability, audio, and perceived fairness. A scripted clear alone does not pass human review.

For routine expansion, release to an explicitly selected beta channel, then a small production cohort, then increase exposure after reviewing errors and support. Use a local random installation cohort value solely for rollout, without sending it as an advertising identity. Cohorting must not obscure features from App Review; provide the reviewer access to every shipped pack and describe the rollout.

## Rollback and old clients

Use an increasing **deployment sequence** independently from the content version. To roll back, publish a newly signed deployment pointing to a previously verified release. Clients can reject replayed older deployments while still accepting an intentional rollback. Do not implement anti-rollback by forbidding all earlier content versions.

Keep the bundled campaign, current verified release, and prior verified release available. Quarantine a failed activation, back off further attempts, and provide a support diagnostic. Never erase cleared servers, owned cosmetics, or the wallet when rolling back a pack. Removing an unsafe level from new selection must not silently remove earned items.

Support older clients with the last compatible release and an optional update notice. A pack that needs a new mechanic waits for the reviewed runtime update. Do not make a backend outage or an expired season into a forced-update wall for the bundled game.

Keep the beta and production configurations separate. Public/TestFlight clients must not receive private editor assets or draft database credentials. A client-side channel flag is not authorization to read unpublished material. Store app-build and content-release identifiers together in reports.

## Saves and rewards

Retain existing server and badge IDs and the `exception-rewards-v1` migration semantics. Introduce a durable native save record with schema/version checks, atomic replacement, a previous-good snapshot, and recovery diagnostics. Test migration twice and interrupted migration, not just a clean install.

The existing `.local` app and a new production bundle ID have separate containers. Add a deliberate export/import path for the owner's test progress if it is to be retained; the production app cannot simply read the other app's sandbox. Export contains progress/settings, never credentials. Validate imports and preserve a pre-import backup. Without a future account backup or a retained export, do not promise recovery after uninstall or transfer to another device.

For content updates, retain the historical reward definition used for an already credited clear or purchase. Track level/version for diagnostics while awarding first-clear bonuses against the permanent server ID. Replaying a rebalanced server cannot duplicate the existing first-clear bonus. Existing owned cosmetics remain owned after price changes or delisting.

At launch, local rewards are a player convenience, not a secure global economy. No cash purchases, competitive leaderboard, or cross-device wallet relies on trusting a client-edited balance. If accounts or competition are added later, design server-side award validation and conflict resolution before enabling them. Cloud backup is a separate feature, not an automatic consequence of choosing Supabase.

## Seasons and time

Use UTC timestamps for the featured schedule. A season is a spotlight on content, not a demand to log in every day. Offer three to five authored challenges, a restrained paper theme, a sound variation, and a commemorative earned badge. The gameplay remains based on supported mechanics.

Retain earned badges and downloaded playable content in an archive after the featured window. Offline devices use the last verified schedule; an inaccurate device clock must not erase rewards or interrupt a run. Treat season eligibility as casual/local until a server-authoritative system is explicitly introduced. Avoid streak penalties, paid expiring passes, and random reward boxes.

## Operations and recovery

Measure manifest availability, signature/validation failures, content activation errors, CDN bytes, cache hit rate, ad availability, and support complaints separately. An unavailable ad network is not a failed level download. An editor should be able to stop a content rollout without changing game code.

Proposed operational targets are a bad-release decision within 15 minutes when someone is on duty, restoration of the previous channel assignment within 30 minutes, and daily checks during the launch window. These are staffing targets, not a claim of round-the-clock coverage. Cached offline clients receive the correction when they reconnect.

Back up the publishing database, source content, published objects, signed manifests, and key recovery material under separate controls. Supabase database backups do **not** include Storage file contents. Test restoration of an actual release into staging before launch. [Supabase backup scope](https://supabase.com/docs/guides/platform/backups).

## Acceptance demonstration

On one unchanged TestFlight binary, deliver a small permanent incident using existing mechanics, a new earned cosmetic with a supported condition, a replacement commentary pool, a paper-background variant, a sound variant, and a seasonal featured card. Keep ordinary practice/lab/demo rewards isolated. Demonstrate that the app also:

- Starts offline with all bundled Localhost levels.
- Rejects a corrupted file, forged signature, incompatible mechanic, and excessive download.
- Survives force termination during download and during activation.
- Keeps a running attempt fixed while an update becomes available.
- Rolls back through a newly signed deployment while preserving clears, Tokens, and cosmetics.
- Re-downloads an evicted optional pack and leaves durable saves intact.
- Works when Supabase is unavailable and when no ads can be requested.

Store the recorded build/content IDs and results under ignored `outputs/app-store/content/`. This exercise is required before describing future content delivery as ready.
