# Scholar's Garden V0.3.4.2 — Learn + Game Runtime Fix

## Exact root causes found

1. **Release/service-worker mismatch**
   - `index.html` requested `?v=0.3.4.1`
   - the service worker precached `?v=0.3.4.1.1`
   - older Scholar Garden caches could therefore mix markup, loaders and runtime files.

2. **Unsafe service-worker fallback**
   - non-navigation fetch handling could fall back too broadly.
   - V0.3.4.2 uses exact-resource fallback for JavaScript, modules, JSON and CSS. These resource types never fall back to `index.html`.

3. **Async Subject Hub rendering was not awaited**
   - `MasterY8.renderLearn`, `renderPractice`, `renderProgress` and Biology data paths could reject after the outer synchronous `try/catch` had already returned.
   - This could leave an endless loading panel or make a click look dead.

4. **Duplicate Side Task binding**
   - Side Tasks still had a direct `.onclick` while the central ActionRouter also handled the same control.

5. **Latin Games V2 was not actually modularised**
   - the migrated `latin-games.js` still referenced legacy-scope variables/functions that no longer existed:
     - `state`
     - `save`
     - `show`
     - `setNavActive`
     - `bank`
     - `ensureAudio`
     - `playTone`
   - `state` failed during GameV2 initialization.
   - after bridging that, deeper game-level testing exposed `show`, `bank`, then `ensureAudio`.
   - V0.3.4.2 explicitly bridges these dependencies to `LatinModule`, `LATIN_BANK`, and safe local audio hooks.

6. **Quick Play race**
   - Home Quick Play navigated to Play, waited an arbitrary 100 ms, then tried to call the game.
   - V0.3.4.2 awaits the Subject Hub Play route and then starts the real engine immediately.

## Learn routes exercised in runtime harness

- Latin Year 8 Foundation → Learn: visible structured content rendered
- French Year 8 Foundation → Learn: visible structured content rendered
- Biology Year 8 Foundation → Learn: visible structured content rendered
- Biology Year 9 → Learn: visible topic cards rendered
- Chemistry Year 9 → Learn: visible topic cards rendered
- Physics Year 9 → Learn: visible topic cards rendered

Also exercised:
- Latin: Learn → Practise → Play → Progress → Learn
- French: Learn → Practise → Play → Progress → Learn

## Practice routes exercised

- Latin Mixed Practice → real quiz rendered
- French Mixed Practice → real quiz rendered
- Biology Mixed Practice → real quiz rendered
- Latin Extra Practice → real quiz rendered
- French Extra Practice → real quiz rendered
- Biology Extra Practice → real quiz rendered

## Mini-games exercised

GameV2 initialization is now clean.

The harness opened:
- Forma Forge
- Sentence Mosaic
- Verbum Match
- Manuscript Mystery

It also entered Level 1 of every one of those four engines and confirmed game UI rendered.

## Service worker changes

Release is now **0.3.4.2 everywhere**:
- index asset queries
- app/service-worker registration
- service-worker cache namespace
- service-worker precache URLs
- footer/build label

Activation removes older `scholars-garden-*` caches only. It does not clear localStorage or learner state.

Navigation may fall back to cached `index.html`.
JavaScript / `.mjs` / JSON / CSS requests may only use:
- a successful exact network response, or
- an exact cached copy.
They never receive `index.html` as a substitute.

## Public deployment status

This is a deployment candidate, not a public-build acceptance.
The public GitHub Pages site was still showing V0.3.4 while this package was produced.
A public V0.3.4.2 click-through cannot be reported until this package is actually deployed.

## Browser limitation

A real Chromium launch against a local HTTP server was attempted.
The execution environment terminates Chromium before usable navigation, so no physical-browser or iPad claim is made from this environment.
