# Friends playtest — separate game repository

The user requested a separate public repository, matching their other projects. Repository: [3QInnova/exception-human](https://github.com/3QInnova/exception-human). Share URL: **https://3qinnova.com/exception-human/**. The account Pages custom domain supplies this project URL; the game is stored in its own repository.

## Published content

- `index.html`: friend landing page, PC/iPhone options, instructions, and five feedback prompts, plus nine-room game builds.
- `desktop.html`: self-contained PC game HTML/CSS/JavaScript, with crawler metadata added to the preserved source.
- `mobile.html`: self-contained iPhone Safari game, including the physically confirmed long-press and zoom fixes.
- `README.md`: controls, hosting, feedback, and validation scope.

GitHub Pages publishes from `main`, repository root, with HTTPS enforced. The game pages request `noindex,nofollow`; the site and repository are public, and the user accepted sharing by link without login. No automatic gameplay feedback collection was added. Feedback goes to Will through the tester's usual chat or the email address already listed on the company site. No invitations were sent by the agent.

Current code commit: `228215409ca0d913ac70692ea6a1c8d50ca88e31`. [Pages deployment](https://github.com/3QInnova/exception-human/actions/runs/38639762836). The initial seven-room release was `93165fab899f8a3d5fa79bb398214aff80bcd4ea`.

## Rebuild and update

```sh
python3 tools/build-mobile.py
python3 tools/build-playtest.py
PLAYWRIGHT_BROWSERS_PATH=/private/tmp/exception-forecast-browsers node tests/friends-playtest.test.mjs
```

The upload folder is `outputs/friends-playtest/repository/`. [Upload ZIP](outputs/friends-playtest/exception-human-playtest.zip) contains the repository-root package. Its optional `.nojekyll` marker is packaged locally; the initial web upload published the four visible files above. The HTML pages need no Jekyll processing.

For a subsequent update, upload the rebuilt pages to the game repository and commit to `main`; verify the Pages deployment and both live games. The local PC source remains `initalDemoDocs/Exception_Human_Misclassification_V3.html`, and mobile presentation sources remain in `mobile/`. The public game HTML contains its full runnable code. The local research notes and design archive were not uploaded.

The GitHub connector cannot write (HTTP 403), and the CLI is not signed in. Creation, upload, and Pages setup were completed through the signed-in Firefox session using the computer-use skill. Do not infer connector write access from this browser success.

## Invitation draft

> Can you give my game about 10–15 minutes? It is a rage platformer where a confidently wrong AI keeps “helping.” Use iPhone Safari sideways or a PC: https://3qinnova.com/exception-human/
>
> Try it without advice first, then tell me where you got stuck, what made you laugh or retry, what felt unfair, and whether you would play again. Let me know your device/browser too. Please keep the link within our test group for now.

## Verification

WebKit checks passed for the repository-root package: the landing page fits a phone viewport, both game links load and advance, crawler metadata is present, and the packaged desktop differs only by that metadata. Evidence: [checks](outputs/friends-playtest/checks.json), [landing screenshot](outputs/friends-playtest/landing.png), [file manifest](outputs/friends-playtest/package.json). Physical iPhone Safari controls and zoom fixes were confirmed by the project owner; Android and native iOS builds are untested.

Live deployment checks passed: all three pages return HTTP 200 over HTTPS and match the tested package exactly. See [deployment evidence](outputs/friends-playtest/deployment.json) and [live browser checks](outputs/friends-playtest/live-checks.json).

The current update adds rooms eight and nine. See [long-level expansion](LONG_LEVEL_EXPANSION.md) for design, practice selection, and solvability evidence. The deployment evidence records the latest published commit.

The secret-commit release adds twelve marked floor launchpads and 32 new Git loss remarks. See [trap direction and checks](SECRET_GIT_BOUNCE.md). The share URL stays the same; refresh the landing page for the new build links.

The current release adds eight random fake AI message-credit and subscription paywalls. Billing dialogs freeze gameplay and have a two-step free-plan exit; all purchases are imaginary. See [AI paywalls](FAKE_AI_PAYWALLS.md).

## Original audio release

All old beeps were replaced with 22 layered sound effects and an original 104 BPM synth score. Compaction and fake AI billing have separate arrangements; loss reading quiets the music. Enable Sound, then use the independent Music toggle for effects-only play. Audio controls live in Menu on iPhone. See [audio direction and WAV previews](AUDIO_DIRECTION.md). Browser audio checks passed in WebKit and Chromium for both layouts; iPhone listening approval remains pending. Landing links use `v=20261013-audio6` to load the release.

## October 14 expansion — published

Six new long levels bring the campaign to fifteen rooms. All nine long rooms appear in the PC/iPhone practice selectors. Added 72 themed remarks. Paywall interruptions are capped at one per level across retries and compaction. All fifteen rooms clear with ordinary inputs; 195,062 PC/mobile snapshots match. WebKit practice checks cleared all six additions in both layouts. Package is rebuilt; link suffix is `v=20261014-levels15`. Published from the signed-in Firefox session after the Mac was unlocked. Commit `b3d2241ac47016f104ce073cffd49cd94430b5b1`; Pages run `38614451187` succeeded. All three live pages match the package, and WebKit opened all six new levels in both layouts. See [expansion validation](outputs/six-long-levels/VALIDATION.md).

## Glass sightline lab — published October 14

Menu includes Glass sightline test: six visible glass objects and six hidden platforms across corrupted data. Campaign remains fifteen rooms. Added 56 remarks and a glass contact chime; 23 sound cues total. Published commit `348b5c92b008b7dd6d822836416420dbd7014c29`, successful Pages run `38616997483`. All three live pages match the package, and PC/iPhone WebKit practice and jump checks passed. Links use `v=20261014-glass16`. See [glass direction](GLASS_SIGHTLINE_TEST.md) and [validation](outputs/glass-test/VALIDATION.md).

## Player-tracking glass clues

Removed the sweeping ray from the glass lab. The one line aims through the player and extends straight to cross support beneath them. Clues now depend on movement; waiting does not sweep. Published commit `228215409ca0d913ac70692ea6a1c8d50ca88e31`, Pages run `38639762836`. All three live files match the package. Live PC/iPhone WebKit checks confirm one ray, working practice selection/jumping, and preserved fifteen-room campaign. Cache suffix: `v=20261014-tracking17`.
