# Architecture
shared/
- storage.js — scholar state only
- growth.js — XP / level / anti-grind
- router.js — app shell
- collection.js — reward blueprint

subjects/
- latin.js — source bank classifier
- french.js — audited content boundary

data/
- latin-question-bank.js — source-locked bank, unchanged

Performance
Core code/data pre-cached.
Artwork is not bulk pre-cached; it loads lazily and enters runtime cache.

Formal mastery remains subject-owned. Shared XP cannot alter formal mastery.
