# Contract — levenshtein-core

Pure ESM in `src/levenshtein.mjs`, zero runtime dependencies, Node >= 22.
Code-point aware (`[...s]`); astral characters cost 1.

| Export | Result |
| --- | --- |
| `MAX_LENGTH` (2000 code points) | Hard bound per string. |
| `distance(a, b)` | Edit count (two-row DP). |
| `align(a, b)` | One optimal `[{op,a?,b?}]` with deterministic tie-break (match/sub > del > ins). Replaying non-`del` ops yields `b`. |
| `similarity(a, b)` | `1 - d/maxLen` in [0,1] (1 for two empties). |

Errors: `NOT_STRING` · `TOO_LONG`.
