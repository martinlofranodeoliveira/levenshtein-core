// SPDX-License-Identifier: MIT
// Levenshtein edit distance with operation alignment (match/substitute,
// insert, delete). Two-row DP, code-point aware. No network, no I/O.

export const MAX_LENGTH = 2000;

export class EditError extends Error {
  constructor(code, detail = '') {
    super(detail ? `${code}: ${detail}` : code);
    this.name = 'EditError';
    this.code = code;
  }
}

function chars(s) {
  if (typeof s !== 'string') throw new EditError('NOT_STRING');
  const out = [...s];
  if (out.length > MAX_LENGTH) throw new EditError('TOO_LONG');
  return out;
}

/** Edit distance between two strings (code points). */
export function distance(a, b) {
  const x = chars(a);
  const y = chars(b);
  if (x.length > y.length) return distance(b, a);
  let prev = Array.from({ length: x.length + 1 }, (_, i) => i);
  for (let j = 1; j <= y.length; j++) {
    const cur = [j];
    for (let i = 1; i <= x.length; i++) {
      cur[i] = Math.min(prev[i] + 1, cur[i - 1] + 1, prev[i - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[x.length];
}

/**
 * One optimal alignment: [{ op: 'match'|'sub'|'ins'|'del', a?, b? }].
 * Deterministic tie-break: match/sub > delete > insert.
 */
export function align(a, b) {
  const x = chars(a);
  const y = chars(b);
  const m = x.length;
  const n = y.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (x[i - 1] === y[j - 1] ? 0 : 1));
    }
  }
  const ops = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && x[i - 1] === y[j - 1] && dp[i][j] === dp[i - 1][j - 1]) {
      ops.push({ op: 'match', a: x[i - 1], b: y[j - 1] }); i--; j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      ops.push({ op: 'sub', a: x[i - 1], b: y[j - 1] }); i--; j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      ops.push({ op: 'del', a: x[i - 1] }); i--;
    } else {
      ops.push({ op: 'ins', b: y[j - 1] }); j--;
    }
  }
  return ops.reverse();
}

/** Similarity in [0,1]: 1 - distance/maxLength (1 for two empties). */
export function similarity(a, b) {
  const x = chars(a);
  const y = chars(b);
  if (x.length === 0 && y.length === 0) return 1;
  return 1 - distance(a, b) / Math.max(x.length, y.length);
}
