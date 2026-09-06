# Scholar's Garden V0.3.2 — Change Audit

## Home game-feel recomposition
- Rebuilt the upper Home into a two-column hero on desktop/tablet.
- Left column: compact greeting/date, compact seven-day strip, featured Main Quest, two secondary tasks, one Today Progress component.
- Right column: Scholar Scene with stable future-art slot, Scholar level/XP, Garden stage, and a visually larger Next Reward card.
- Quick Play is now a visual tile area with three recommended real games and a retained See all games drawer.
- Continue Learning remains below the hero/game loop as secondary navigation.
- Mobile ordering intentionally keeps greeting/calendar compact, then Scholar Scene, then Main Quest and supporting tasks.
- No character art was generated.

## Master Content Pack V1 integration
### Latin Year 8 Foundation
- Full editorial bank included byte-for-byte: 2,492 questions, 778 concepts.
- 65 topic runtime shards copied byte-for-byte and lazy-loaded.
- Foundation Learn / Practise / Progress now use the structured Master Content Pack.
- Existing Latin mini-games remain the Play surface and are unchanged.

### French Year 8 Foundation
- Full editorial bank included byte-for-byte: 5,585 questions, 1,913 concepts.
- Release status preserved: 4,555 enabled / 171 preview / 859 disabled.
- 32 topic runtime shards copied byte-for-byte and lazy-loaded.
- Ordinary sessions select enabled content only.
- Foundation Learn / Practise / Progress now use the structured Master Content Pack.
- Existing French Spelling game remains the Play surface.
- listen_type source records are preserved but are not auto-selected until a reliable approved audio source exists.

### Biology Year 8 Foundation
- Existing V0.3.1 structured integration retained: 989 questions plus concepts/notes/keywords/diagram specs.

## Mastery / review / migration
- New additive structured state keys: latinY8MasteryV1 and frenchY8MasteryV1.
- Existing latinSummerV8State and monJardinFrancais.progress.v2 are not deleted or overwritten.
- Migration maps preserved verified legacy question IDs into Master Pack conceptIds where possible.
- The supplied reference marker is used for Latin/French structured marking.
- Recognition-only evidence cannot directly become secure.
- Production/application plus 2-day and 7-day recall and >=85% weighted accuracy are required for secure state.

## Mini-games
- No new top-level Games destination.
- Latin Games V2 JS/CSS are byte-identical to V0.3.1.
- Home Quick Play links directly to Verbum Match, Sentence Mosaic and French Spelling Sprint.
