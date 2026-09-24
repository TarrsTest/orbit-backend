const test = require('node:test');
const assert = require('node:assert');

const { toSlug } = require('../lib/text');

test('toSlug: converts plain ASCII to a lowercased, dashed slug', () => {
  assert.strictEqual(toSlug('Hello World'), 'hello-world');
});

test('toSlug: strips diacritics', () => {
  assert.strictEqual(toSlug('Crème Brûlée'), 'creme-brulee');
});

test('toSlug: collapses repeated punctuation into a single dash', () => {
  assert.strictEqual(toSlug('foo!!!bar???'), 'foo-bar');
});

test('toSlug: trims leading and trailing symbols', () => {
  assert.strictEqual(toSlug('  --Hello, World!!  '), 'hello-world');
});

test('toSlug: truncates to maxLength without leaving a trailing dash', () => {
  assert.strictEqual(toSlug('Hello World', 6), 'hello');
});

test('toSlug: returns an empty string for empty input', () => {
  assert.strictEqual(toSlug(''), '');
});

test('toSlug: transliterates German ß to ss', () => {
  assert.strictEqual(toSlug('Straße'), 'strasse');
});

test('toSlug: returns an empty string for emoji-only input', () => {
  assert.strictEqual(toSlug('🎉🎉'), '');
});

test('toSlug: keeps CJK letters', () => {
  assert.strictEqual(toSlug('你好 世界'), '你好-世界');
});

test('toSlug: defaults maxLength to 60', () => {
  assert.strictEqual(toSlug('a'.repeat(80)), 'a'.repeat(60));
});

test('toSlug: truncation never splits a surrogate pair into a lone half', () => {
  const astral = '\u{1D49C}'; // MATHEMATICAL SCRIPT CAPITAL A — a \p{L} astral char
  const result = toSlug(astral.repeat(2), 1);
  assert.strictEqual(result, astral);
  assert.ok(!/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/.test(result), 'must not contain a lone surrogate');
  assert.doesNotThrow(() => encodeURIComponent(result));
});

test('toSlug: maxLength counts astral letters as one character each', () => {
  const astral = '\u{1D49C}';
  assert.strictEqual(toSlug(astral.repeat(3), 2), astral.repeat(2));
});

test('toSlug: mixed ASCII + astral input stays well-formed when truncated', () => {
  const result = toSlug(`x${'\u{1D49C}'.repeat(30)}`, 20);
  assert.ok(!/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/.test(result), 'must not contain a lone surrogate');
  assert.doesNotThrow(() => encodeURIComponent(result));
  assert.strictEqual([...result].length, 20);
});
