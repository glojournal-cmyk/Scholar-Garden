# Scholar's Garden V0.3.4.1 — Critical Functional Fix Change Audit

## Root causes found

### 1. Latin/French Practice crashed at runtime
`language-y8.js` called `ordinaryEligible(...)`, but no such function existed in the deployed V0.3.4 code.
That produced a `ReferenceError` as soon as Latin/French Practice attempted to build a question pool.

Effect:
- Latin Practice could open a shell but could not render questions.
- French Practice could open a shell but could not render questions.
- Latin/French Extra Practice also failed before question rendering.

Fix:
- Removed the undefined call and routed eligibility through the existing `enabled(q)` gate.
- That gate still excludes French `listen_type` from ordinary sessions while preserving the source records.

### 2. Extra Practice could resolve to an empty pool
Some valid topics have recognition-only material and no production-format questions.
V0.3.4 treated Extra Practice as production-only, so a visible Extra Practice CTA could lead to no exercise.

Fix:
- Extra Practice remains production-led when production questions exist.
- When a supported topic has no production question, it falls back to valid enabled questions for that topic.
- Recognition-only evidence still cannot directly make a concept secure.

### 3. Service-worker/cache version mismatch
The GitHub-safe V0.3.4 package had `index.html` requesting `?v=0.3.4`, but `sw.js` still used the V0.3.2 internal cache name and V0.3.2 precache URLs.

This was especially risky after the runtime-bank repack:
- old loader code could remain cached
- old loader code expected removed bundle filenames
- new markup + old JS could therefore produce apparently dead buttons/routes

Fix:
- Internal SW cache bumped to `scholars-garden-v0-3-4-1-critical-functional-fix-20260906`
- every core asset reference aligned to `?v=0.3.4.1`
- install precache explicitly fetches with `cache: 'reload'`
- navigation requests prefer a fresh `index.html`
- registration uses `updateViaCache: 'none'` and calls `reg.update()`
- learner localStorage/state is not cleared

### 4. High-level navigation was fragmented
Navigation was split across per-render `onclick` assignment, Subject Hub bindings, hash routing and dynamic card binding.
This increased the chance that DOM rewrites left a visually active control disconnected from the expected handler.

Fix:
One delegated high-level action router now handles:
- global navigation
- Home subject training
- Study subject cards
- Subject Continue
- Subject tabs
- Main Quest
- Side Tasks
- Quick Play
- See-all game choices
- retry actions

Activity-local answer controls remain inside their learning/game engines.

## Practice routes verified by runtime harness

The deterministic runtime harness loads the actual packaged JSON and calls the real Foundation practice engines with a minimal DOM shell.

PASS:
- Latin Master Pack data loads
- French Master Pack data loads
- Biology Master Pack data loads
- Latin mixed Practice starts and renders a real quiz card
- French mixed Practice starts and renders a real quiz card
- Biology mixed Practice starts and renders a real quiz card
- Latin Extra Practice starts and renders a real quiz card
- French Extra Practice starts and renders a real quiz card
- Biology Extra Practice starts and renders a real quiz card

## Home / routing wiring

Verified in source/static QA:
- Scholar scene present
- Quest Log present
- Subject Training present
- Quick Play present
- Main Quest and Side Task selectors are handled by the central action router
- all Study subject-card selectors are handled by the central action router
- Subject Hub has Learn / Practise / Play / Progress
- supported Foundation Practice routes call the real engines
- Year 9 Science Practice is intentionally disabled with `Practice bank not yet available`
- Biology Foundation Play is intentionally disabled because no verified Biology game engine exists

## Mini-games

Preserved without changing the Latin game engine:
- Verbum Match
- Forma Forge
- Sentence Mosaic
- Manuscript Mystery

`latin-games.js` and `latin-games.css` remain byte-identical to the previous build.
Home Quick Play still calls `GameV2.start(gameId)`.
French Quick Play still calls the existing French spelling engine.

## Overlay/touch safety

Decorative Scholar/scene layers and pseudo-elements now use `pointer-events: none`.
Interactive controls are explicitly placed above decorative layers.

## Files changed in this fix

- `app.js`
- `subject-hub.js`
- `language-y8.js`
- `biology-y8.js`
- `styles.css`
- `sw.js`
- `index.html`
- reports/instructions/checksums

Verified question-bank source JSON, concept IDs and answer specifications were not regenerated.

## QA limits

A Chromium browser launch was attempted in this execution environment.
The environment blocked local browser navigation / terminated Chromium before a usable page session, so this report does NOT claim:
- fresh physical iPad Safari QA
- full real-browser click-through of every mini-game
- deployed GitHub Pages end-to-end QA

Those checks must be completed after this package is deployed.
