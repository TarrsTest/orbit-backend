const test = require('node:test');
const assert = require('node:assert');

const { slugify } = require('../lib/text');

test('slugify: converts plain ASCII to a lowercased, dashed slug', () => {
  assert.strictEqual(slugify('Hello World'), 'hello-world');
});

test('slugify: strips diacritics', () => {
  assert.strictEqual(slugify('Crème Brûlée'), 'creme-brulee');
});

test('slugify: collapses repeated punctuation into a single dash', () => {
  assert.strictEqual(slugify('foo!!!bar???'), 'foo-bar');
});

test('slugify: trims leading and trailing symbols', () => {
  assert.strictEqual(slugify('  --Hello, World!!  '), 'hello-world');
});

test('slugify: truncates to maxLength without leaving a trailing dash', () => {
  assert.strictEqual(slugify('Hello World', 6), 'hello');
});

test('slugify: returns an empty string for empty input', () => {
  assert.strictEqual(slugify(''), '');
});

test('slugify: transliterates German ß to ss', () => {
  assert.strictEqual(slugify('Straße'), 'strasse');
});

test('slugify: returns an empty string for emoji-only input', () => {
  assert.strictEqual(slugify('🎉🎉'), '');
});

test('slugify: keeps CJK letters', () => {
  assert.strictEqual(slugify('你好 世界'), '你好-世界');
});

test('slugify: defaults maxLength to 60', () => {
  assert.strictEqual(slugify('a'.repeat(80)), 'a'.repeat(60));
});
