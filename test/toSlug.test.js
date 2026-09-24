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
