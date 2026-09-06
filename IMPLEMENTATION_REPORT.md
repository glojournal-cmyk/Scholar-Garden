# Scholar’s Garden V0.3 UX Reset — Implementation Report

## Source of truth
Implemented around the supplied V0.3 UX Blueprint and Codex Handoff. The existing academic engines are treated as protected dependencies.

## Phase log
1. **v0.3-shell — implemented**
   - Four global destinations only: Home, Study, Garden, Scholar.
   - Legacy Latin/French/Collection/Profile hashes redirect safely.
   - iPad/mobile uses persistent bottom navigation; wide layouts use a slim left rail.

2. **v0.3-home — implemented**
   - Compact greeting/date, centred seven-day strip, maximum three Today tasks.
   - Automatic planner priority: due review → weak items → current Year 9 Learn → foundation consolidation.
   - Quick target = 7 questions; standard target = 15 questions.
   - One CTA per Today task; top task opens the session/notes directly.

3. **v0.3-study — implemented**
   - Current Year 9 and Foundation Review are visually separate.
   - One reusable Subject Hub with Learn / Practice / Review / Play / Progress.

4. **v0.3-latin-french — implemented**
   - Existing Latin and French engine DOM/functions moved behind the common Subject Hub.
   - Latin game engine retained byte-for-byte.
   - Latin formal state key remains `latinSummerV8State`.
   - French state key remains `monJardinFrancais.progress.v2`.
   - Existing subject-specific marking/review logic remains in place.

5. **v0.3-foundation-bio — source-blocked safely**
   - The structured `Master_Content_Pack_V1` required by the handoff was not available as an accessible file.
   - The app exposes the Foundation Biology route as unavailable rather than fabricating or rebuilding questions from booklet PDFs.
   - This is the only source dependency preventing full Phase 5 completion.

6. **v0.3-y9-science-notes — implemented**
   - Biology B1–B16 Learn topics.
   - Chemistry C1–C17 Learn topics.
   - Physics P1–P18 Learn topics.
   - Practice/Review/Play remain unavailable for Year 9 Science until an approved practice bank exists.
   - AQA/HT extension notes use a separate visual treatment.

7. **v0.3-growth — implemented**
   - Garden first view is visual and concise.
   - Collection moved under Scholar.
   - Scholar contains Wardrobe / Collection / Achievements.
   - Avatar viewport is locked to a 560×760 logical canvas with seven deterministic layers.
   - Only geometric placeholders are used; no character-art production was started.
   - Existing shared key remains `luxScholarGardenV1`; UX-only state uses additive key `scholarGardenUxV03`.

8. **v0.3-qa — completed to environment limits**
   - 54/54 deterministic syntax, structure, state, engine-preservation, planner and PWA checks passed.
   - Browser launch was attempted but Chromium terminated in this environment; no physical iPad Safari claim is made.

## Protected academic assets
- Latin question bank remains byte-identical to V0.2: 1,056 questions / 24 blocks / 24 notes.
- Latin Games V2 JS/CSS remain byte-identical.
- Growth engine remains byte-identical.
- Existing WebP artwork remains byte-identical.
- Latin/French modules were changed only for presentation copy and adapter methods needed by the new planner/Subject Hub; their persisted keys and marking/review functions were retained.

## New modules
- `daily-plan.js`
- `science-notes.js`
- `subject-hub.js`
- `scholar.js`

## Character-art status
Not started, by design. The technical viewport/layer contract is now in place so a later small validation batch can be aligned before any full wardrobe production.
