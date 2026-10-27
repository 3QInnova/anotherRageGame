# EXCEPTION HUMAN TestFlight and App Store checklist

October 25, 2026. Working checklist for the [deployment plan](../../APP_STORE_DEPLOYMENT_PLAN.md). Items are initially unchecked because this planning pass does not perform the release work. Keep evidence under ignored `outputs/app-store/`, with app build and content release identifiers.

## Milestone A production identity

- [ ] Verify active Apple Developer Program membership, team `NM3KNV8248`, accepted agreements, appropriate App Store Connect roles, and distribution access.
- [ ] Check availability and ownership of the proposed production bundle ID `com.threeqinnova.exceptionhuman` and final display name **EXCEPTION: HUMAN**. The ID is a proposal until registered.
- [ ] Keep the local bundle `com.threeqinnova.exceptionhuman.local` as a separate development flavor. Use the production bundle ID consistently for release TestFlight and the eventual store app.
- [ ] Register the App ID and create the iOS App Store Connect record, primary language, SKU, and owner-approved seller information.
- [ ] Establish one version source, such as marketing 1.0.0 and a strictly increasing build number, and synchronize generated native metadata.
- [ ] Confirm minimum iOS and supported device families after checking selected Capacitor/ad SDK requirements; do not silently raise the current iOS 15 floor.
- [ ] Manage Mac and Vision Pro availability explicitly. Include iPad compatibility checks if the iPhone build is available there.
- [ ] Add a versioned export/import path or preserve a documented local-app backup before migrating the owner's progress. Separate bundle IDs cannot directly share app containers.

## Milestone B release configuration and local archive

- [ ] Add explicit development, beta, and production configurations, with fixed backend environment selection and no Mac-hosted runtime URL.
- [ ] Keep fake billing disabled; omit its interaction code/UI from the production payload while retaining its source and dedicated fixtures.
- [ ] Exclude development dashboards, automated recording, playtest instrumentation, arbitrary evaluation interfaces, and unused private test routes from the release artifact.
- [ ] Verify all included features are documented and exposed through intended menus; a release flag cannot conceal future functionality.
- [ ] Set production branding, icons, launch screen, bundle display name, privacy/support navigation, and final offline text. Remove Local/playtest labels from the public experience.
- [ ] Build shared sources and sync iOS through the supported builders; do not edit generated HTML or copied native web assets.
- [ ] Audit dependencies, license notices, source assets, commentary, fonts, sounds, and rights to ship them.
- [ ] Add the app-owned privacy manifest as needed and validate aggregated SDK manifests, required-reason APIs, signatures, and the archive privacy report.
- [ ] Review capabilities and entitlements; enable only features actually used. Verify there is no unnecessary background audio mode or invasive permission.
- [ ] Verify signing and Release optimization, inspect the embedded configuration, and archive a device build using a distribution-appropriate workflow.
- [ ] Validate the archive with Xcode. Save dSYMs, dependency lockfiles, build/source hashes, resolved SDK versions, export settings, and validation output.
- [ ] Determine final encryption/export answers for the whole binary, including HTTPS and signed content support.

Use the installed Xcode explicitly without changing global tool selection:

```sh
DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer xcodebuild -version
DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer xcrun --sdk iphoneos --show-sdk-version
python3 tools/build-mobile.py
npm --prefix apps/native run sync
```

These existing commands rebuild/sync local assets. They do not create the proposed production flavor, distribution profile, archive workflow, or upload. Discover actual archive/export options after the release configuration exists; do not treat a simulator build as an uploadable app.

## Milestone C first internal TestFlight

- [ ] Run current campaign, save/reward, loss, UI, audio, and parity regressions relevant to the packaged source.
- [ ] Install the exact candidate on a physical iPhone and perform a basic touch, pause, audio, save, and offline test before upload.
- [ ] Upload the reviewed archive to App Store Connect using Xcode Organizer or Transporter; retain the upload receipt and processing result.
- [ ] Resolve processing warnings and export compliance, and confirm the correct version/build appears as eligible for testing.
- [ ] Add the owner and a small group of actual team members as internal testers with the proper roles. Do not grant broad account roles just to make a friend an internal tester.
- [ ] Provide What to Test instructions, feedback contact, known limits, and the bundled campaign scope. No live-ad or content-service readiness claim at this first milestone.
- [ ] Install through TestFlight on the owner's iPhone, then verify first clear, retry, two-input loss skip, background/foreground, audio reconnect, and saved progress after termination.
- [ ] Record the device, OS, TestFlight build, content revision, and actual observed result. Installation is not acceptance of all twenty levels.

Apple supports up to 100 internal team testers and 10,000 external testers. External testing uses Beta App Review, with the first external build requiring approval; later builds may also require review. Builds are testable for up to 90 days. Use normal App Store distribution eligibility when creating a candidate intended to progress beyond internal-only testing. [TestFlight](https://developer.apple.com/testflight/), [TestFlight workflow and expiry](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/).

## Milestone D content and advertising beta

- [ ] Provision separate staging/production content environments only after the selected project, recurring cost, and publication authority are established.
- [ ] Implement the [content contract](CONTENT_PIPELINE.md), bounded validator, file cache, signature verification, publisher, and rollback flow.
- [ ] Demonstrate a level, badge, commentary, background, sound, and seasonal update on the same installed binary.
- [ ] Prove offline first launch and fallback; test bad hashes/signatures, low disk, incompatible mechanics, download interruption, activation interruption, and old clients.
- [ ] Verify public clients can read published content and cannot read private drafts or write release records.
- [ ] Restore both database records and actual Storage objects in staging; record the recovery procedure.
- [ ] Integrate the pinned native ad SDK and consent SDK, the fixed 320 × 50 bottom-center banner allocation during gameplay/menus/clear receipts, privacy options, and inappropriate-ad reporting.
- [ ] Validate targeting transparency inside the app and the exact tracking/data-collection behavior of the chosen SDK configuration.
- [ ] Use test ad units/devices for beta integration. Confirm no live ad clicking, forced impressions, or retries used to generate traffic.
- [ ] Verify the AdMob publisher account, business identity, required tax/payout setup, content filters, and store-linking plan. Keep private financial details outside the repository.
- [ ] Keep the ad rail separated from touch targets and safe areas. Prove no button moves under an active touch when an ad fills or disappears.
- [ ] Test no fill, offline consent, refusal, privacy reset, leaving through an ad, return-to-pause, and physical audio recovery.
- [ ] Verify the placement and presentation rules are compiled into the app; content packs and remote configuration contain no ad-layout controls.
- [ ] Verify the same banner rectangle stays reserved across levels, menus, receipts, no fill, consent outcomes, and downloaded updates. Protected overlays must not put controls into that rectangle or move it.
- [ ] Verify movement, Rewrite, Jump, Continue, and circuit controls retain an inactive buffer from the banner on supported screen sizes and saved control settings.
- [ ] Publish the support/privacy pages and developer website; prepare root `app-ads.txt` with the actual provider-issued publisher entry.
- [ ] Complete the privacy inventory, retention/deletion decisions, SDK disclosure review, age/audience review, and ad content filters.

## Milestone E external player beta

- [ ] Create email-invited US tester groups: an initial 10 to 20 players, then roughly 50 to 200 when reliability permits. These are proposed cohort sizes, not recruitment already completed.
- [ ] Complete TestFlight Beta App Review information and submit the candidate for external testing. Keep backend content accessible to reviewers.
- [ ] Tell testers whether this build uses test ads and which content channel it receives. Do not mix private unfinished levels into public production content.
- [ ] Conduct at least 10 observed fresh-player sessions; cover all 20 servers across human testers and include smallest-screen, older-supported-device, and modern-device sessions.
- [ ] Run a 30-minute sustained-play profile and interruption tests; inspect crash, hang, memory, heat, input, and audio behavior.
- [ ] Verify native save migration, reward idempotency, season archive behavior, and retained ownership across content changes.
- [ ] Triage feedback into blockers, readability/control issues, fairness/pacing, commentary, and optional improvements. Fix blockers before adding more levels.
- [ ] Meet the main plan's technical/fun gates and record the sample size behind any reliability or retention claim.

## Milestone F store candidate

- [ ] Freeze the launch content release and choose the production SDK configuration and actual ad unit IDs.
- [ ] If beta used sample ad IDs or other beta-only settings, build and validate a new production candidate. Retest those differences on registered test devices; do not assume the earlier beta covers them.
- [ ] TestFlight the final candidate under its intended configuration. Preserve access to known test-device diagnostics without exposing production debug tools to users.
- [ ] Verify the final App Store record uses United States only, English metadata, the chosen price, and intended device availability.
- [ ] Confirm the option for automatically adding future territories is not broadening the launch.
- [ ] Complete title/subtitle, description, keywords, category, seller/contact details, copyright, content rights, privacy/support URLs, age answers, privacy labels, accessibility answers, and encryption information.
- [ ] Capture accurate screenshots from supported device classes. Use only features in the candidate and accurately represent ads/optional downloads. Keep captures under `outputs/app-store/` according to repository artifact policy.
- [ ] Verify icon and screenshot dimensions against current App Store Connect requirements and validate text for the final metadata limits.
- [ ] Include review notes with paths to campaign, cooling/Puzzle Box, downloads, offline play, ad controls, and reward collection, plus a plain-language explanation of authored AI satire.
- [ ] Explain the content schema and publishing scope, include an inspectable update, and list supported pack capabilities. No reviewer-specific hidden product behavior.
- [ ] Recheck Apple rules and dependency advisories immediately before submission, including SDK minimums and downloadable-content requirements.
- [ ] Select manual release, submit for App Review, resolve questions, and keep the live review environment stable.

## Milestone G US launch and operation

- [ ] After approval, review the concrete candidate, territory settings, known issues, support coverage, and rollback plan with the owner before public release.
- [ ] Release manually to the United States storefront. Verify the actual listing and installation using a US Apple Account; no physical-location geofence is implied.
- [ ] Link the public listing to AdMob, complete its app readiness and `app-ads.txt` checks, and verify real serving status without clicking production ads.
- [ ] Confirm download fallback, privacy/support/report links, actual installed save behavior, and banner placement in the publicly installed version.
- [ ] Watch crash/hang reports, saves, content errors, complaints, and hosting usage daily for the first 72 hours, then establish a sustainable review cadence.
- [ ] Stop a faulty content rollout or stop ad requests through documented safety controls when needed. A binary defect needs a new app build.
- [ ] Keep prior verified packs, backup/restore material, signing recovery, and support ownership available.
- [ ] Schedule the first small permanent content pilot after reliability and onboarding are understood. Do not make a promise to ship the other 180 levels on a fixed calendar.

## Required evidence record

For each milestone, record who performed it, date, app/build, source reference, content release, device/OS, procedure, result, and remaining limits. Keep account credentials and private signing material out of reports. Link automated output and human observations separately. No item becomes complete solely because a source file exists, an archive builds, or TestFlight accepts an upload.
