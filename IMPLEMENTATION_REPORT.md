# Scholar's Garden V0.3.1 — Home Polish + Games + Master Content Pack

## Completed in this continuation
- Preserved the V0.3 UX Reset architecture: Home / Study / Garden / Scholar.
- Polished Home hierarchy with one Main Quest, secondary tasks, calm calendar states, Quick Play, reward-art slot and clearer Continue Learning cards.
- Restored/promoted real mini-games without adding a top-level Games destination.
- Preserved the Latin Games V2 JS/CSS byte-for-byte.
- Kept French spelling gameplay and added only Scholar-XP completion feedback; formal mastery remains separate.
- Integrated the structured Year 8 Biology Master Content Pack under Foundation Review.

## Master_Content_Pack_V1 integrated exactly
- 989 questions
- 989 answers
- 455 concepts
- 267 keywords
- 37 topic notes
- 14 diagram specifications

The source JSON files are copied byte-for-byte under `bio-y8-*` filenames. The rename avoids collision with the existing French `question-bank.json` bridge.

## Biology Foundation engine
- Learn: structured notes by topic.
- Practise: Due Review / Biology Boost / Mixed / focused production practice.
- Progress: concept stages and topic secure percentage.
- Play: intentionally unavailable until a genuine Biology game engine exists.
- Marking supports automatic routes where the pack provides deterministic answers and manual checklist/self-review where the pack explicitly requires mark points or cannot be safely auto-marked.
- Review recovery follows 2-day then 7-day after a wrong answer.
- Secure mastery requires production/application evidence plus the later consolidation recall; recognition-only evidence cannot create secure mastery.

## State safety
Existing keys preserved:
- `latinSummerV8State`
- `monJardinFrancais.progress.v2`
- `luxScholarGardenV1`
- `scholarGardenUxV03`

New additive Biology key:
- `biologyY8MasteryV1`

No existing key is renamed, deleted or reset.

## Character art
Not started. Existing WebP assets remain unchanged.
