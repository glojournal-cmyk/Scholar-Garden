# Alpha 6 — True UI Rebuild

This pass stops treating the supplied UI mockups as a light reskin.

Implemented:
- Desktop vertical navy navigation rail matching the supplied wide mockups.
- Thin cream utility/header bar.
- Home rebuilt as a new editorial composition using the supplied visual language: large Scholar hero, Scholar Level, Today's Journey, Garden, daily summary, Continue Studying and Quick Play.
- Study Hub rebuilt around the wide mockup composition with editorial hero and dense three-column subject cards.
- Subject header, tabs, Scholar overview and responsive shell retuned to the same design system.
- Existing academic, XP, mastery, review, Garden and Scholar state remains the data source.
- Old Home layout remains in DOM for engine compatibility but is visually replaced by the new composition.

Static QA:
- JavaScript syntax: 28/28 PASS
- Duplicate IDs: PASS
- Missing local index refs: PASS

Reference target:
The implementation follows the supplied Scholar's Garden mockups, particularly the wide Study Hub layout and the cream/navy botanical visual system.
