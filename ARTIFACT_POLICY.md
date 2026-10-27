# Git artifact policy

Updated October 23, 2026. Screenshots and recordings made while building, testing or reviewing the game stay local. Write them under `outputs/<suite>/`; the entire directory is ignored. Capture directories and common screenshot filenames elsewhere are also ignored as a fallback. A new capture tool must use `outputs/` even when its filenames do not contain “screenshot.”

## What belongs in Git

- Source code, authored campaign data, design decisions and small reproducible test fixtures.
- Actual game assets and native app icons/splash artwork. A PNG is not automatically a screenshot.
- Deliberately selected Play Store evidence under `release/play-store/evidence/`, with its purpose and build recorded in that directory's README. Do not copy a whole test run there.
- The original `initalDemoDocs/EXCEPTION_HUMAN_V3_Playtest_Pack.zip`, retained as the supplied historical design snapshot. It contains the original forecast capture; new generated playtest packages belong under `outputs/`.

The loose `initalDemoDocs/Exception_Human_V3_forecast.png` is local reference material and is ignored. Existing links can still work in this checkout; a fresh checkout can read the matching image from the preserved ZIP. This change does not remove blobs from previous commits.

## Before staging a capture or generated file

Use `git status --short` and inspect the proposed files. Do not use `git add -f` to bypass the capture policy. To inspect a matching rule:

```sh
git check-ignore -v --no-index outputs/example/screen.png
git check-ignore -v --no-index 'Screenshot example.png'
```

An ignore rule does not stop Git tracking an existing file. Find those files with:

```sh
git ls-files -ci --exclude-standard
```

Inspect dependencies before using `git rm --cached -- <path>` to remove a generated file from the index while keeping it on disk. Move durable regression inputs into `tests/fixtures/`; tests must generate their own screenshots and reports. Do not rewrite repository history as routine cleanup.

Keep screenshots out of fixture directories unless a test actually consumes their pixels. New artwork belongs in a source asset directory with an explicit runtime use. If a new capture naming convention escapes the current rules, add a narrow ignore pattern and keep the capture under `outputs/`.
