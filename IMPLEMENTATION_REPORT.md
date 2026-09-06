# Scholar's Garden V0.3.2 — Implementation Report

V0.3.2 combines the requested Home game-feel recomposition with completion of Master_Content_Pack_V1 Foundation integration for Latin and French.

## Source integrity
The original Master Content Pack editorial JSON remains byte-identical in the packaged `mcp-*` copies. The app uses flat-root runtime topic shards for iPad/GitHub Pages performance rather than parsing the full French/Latin banks on first paint.

## Hero structure
Desktop/tablet:
- left: compact Today context + Main Quest + secondary tasks + one Today progress indicator
- right: Scholar Scene + stable art slot + Scholar XP + Garden stage + Next Reward

Mobile:
- greeting/date
- compact week strip
- Scholar Scene
- Main Quest
- secondary tasks
- Quick Play
- Continue Learning

## Future-art placeholders
Still awaiting final art:
- Master Scholar transparent character
- reaction poses
- Ink Pot and later reward objects
- room/garden decorative objects
These use stable containers and do not require a layout rewrite when assets arrive.

## Known limitations
- Final character/reward art is intentionally not produced.
- French listen/type questions remain preserved but excluded from ordinary sessions until reliable audio is available.
- Biology diagram specifications remain source-preserved; final anchored artwork is still needed for true diagram interaction.
- No fresh physical iPad Safari E2E claim is made by the deterministic checks.


## GitHub upload packaging fix
The previous V0.3.2 package contained 97 separate Latin/French runtime topic shard files.
V0.3.4 consolidates those into two lazy-loaded subject bundles:
- `mcp-latin-runtime-bundle.json`
- `mcp-french-runtime-bundle.json`

Academic content is unchanged; only packaging/loading granularity changed.
This reduces the flat-root upload package to fewer than 100 files while keeping each individual file below 25 MB.
