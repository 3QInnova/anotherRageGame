# Audio validation — October 13, 2026

PC source SHA-256: `83692ad531f1e16e84d7e34d9d7574f80c4c4fa8f27a6270b14fb7347a97e9b9`. Mobile rebuilt from this shared source.

- WebKit and Chromium, PC and mobile layouts: 22 distinct effects, three nonzero music arrangements, no waveform clipping, no script errors.
- Audio activation from a gesture, separate music toggle retaining effects, master mute, blur/suspend, focus/Resume, and mobile menu silence passed.
- Music transitions checked for play, compaction, paywall, loss, and win.
- Nine-room campaign parity: 58,990 identical active gameplay snapshots, zero deaths, with random paywalls and compactions.
- Existing WebKit mobile controls, rotation, background pause, loss reading, compaction recovery, and small viewport checks passed.
- Public package landing and both builds passed WebKit checks locally.

See `browser-results.json` for waveform metrics and preview WAVs in this directory. Physical iPhone listening approval is pending.

Published commit `2768d3c02cfc7409a49d5e7e4863f35a3a9863a1`; Pages run `38511803470` completed successfully. All three live HTTPS pages match the package bytes. Live WebKit startup/mute and friend landing/game checks passed. See `deployment.json` and `live-browser-results.json`.
