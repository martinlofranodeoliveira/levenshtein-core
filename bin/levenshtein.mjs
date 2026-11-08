#!/usr/bin/env node
// Demo: fixed pairs, asserts exact distances. --assert exits non-zero on mismatch.
import { distance, similarity } from '../src/levenshtein.mjs';

const CASES = [['kitten', 'sitting', 3], ['flaw', 'lawn', 2], ['', '', 0]];

let failed = 0;
for (const [a, b, expected] of CASES) {
  const got = distance(a, b);
  const pass = got === expected;
  if (!pass) failed++;
  console.log(`${pass ? 'PASS' : 'FAIL'} d(${JSON.stringify(a)}, ${JSON.stringify(b)}) = ${got} sim=${similarity(a, b).toFixed(2)}`);
}
if (process.argv.includes('--assert') && failed > 0) process.exit(1);
if (failed > 0) process.exitCode = 1;
console.log(failed === 0 ? 'demo: all cases as expected' : `demo: ${failed} mismatch(es)`);
