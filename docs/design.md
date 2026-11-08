# Design — levenshtein-core

Classic DP with a full table for alignment (deterministic backtrack)
and a two-row pass for bare distance. The alignment is a proof object:
tests replay it into the target and recount edits against `distance`,
so implementation and explanation cannot drift apart.

Oracle: kitten/sitting, flaw/lawn, weekend cases, emoji pairs, empty
edges. No transpositions (Damerau is out of scope by design).
