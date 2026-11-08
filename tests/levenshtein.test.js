import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { distance, align, similarity, EditError } from '../src/levenshtein.mjs';

describe('distance', () => {
  it('matches textbook values', () => {
    assert.equal(distance('kitten', 'sitting'), 3);
    assert.equal(distance('', ''), 0);
    assert.equal(distance('abc', ''), 3);
    assert.equal(distance('flaw', 'lawn'), 2);
  });
  it('counts code points, not UTF-16 units', () => {
    assert.equal(distance('🌍', ''), 1);
    assert.equal(distance('café', 'cafe'), 1);
  });
  it('rejects non-strings and oversize', () => {
    assert.throws(() => distance(42, 'a'), (e) => e.code === 'NOT_STRING');
    assert.throws(() => distance('x'.repeat(2001), ''), (e) => e.code === 'TOO_LONG');
  });
});

describe('align', () => {
  it('explains kitten->sitting with 3 edits', () => {
    const ops = align('kitten', 'sitting');
    const edits = ops.filter((o) => o.op !== 'match');
    assert.equal(edits.length, 3);
    assert.equal(ops.filter((o) => o.op === 'match').length, 4);
    // replay: apply ops to 'kitten' yields 'sitting'
    let out = '';
    for (const o of ops) if (o.op !== 'del') out += o.b;
    assert.equal(out, 'sitting');
  });
  it('replay holds on random pairs', () => {
    const pairs = [['abc', 'axc'], ['saturday', 'sunday'], ['🌍a', 'a🌍'], ['', 'abc'], ['abc', '']];
    for (const [a, b] of pairs) {
      const ops = align(a, b);
      let out = '';
      for (const o of ops) if (o.op !== 'del') out += o.b;
      assert.equal(out, b, `${a} -> ${b}`);
      assert.equal(ops.filter((o) => o.op !== 'match').length, distance(a, b));
    }
  });
  it('similarity is bounded', () => {
    assert.equal(similarity('abc', 'abc'), 1);
    assert.equal(similarity('', ''), 1);
    assert.equal(similarity('abc', 'xyz'), 0);
    assert.ok(new EditError('X') instanceof Error);
  });
});
