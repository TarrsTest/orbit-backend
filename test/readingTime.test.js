const test = require('node:test');
const assert = require('node:assert');

const { readingTime } = require('../lib/text');

test('readingTime: empty string -> 0', () => {
  assert.strictEqual(readingTime(''), 0);
});

test('readingTime: whitespace-only -> 0', () => {
  assert.strictEqual(readingTime('   \n\t  '), 0);
});

test('readingTime: null/undefined -> 0', () => {
  assert.strictEqual(readingTime(null), 0);
  assert.strictEqual(readingTime(undefined), 0);
});

test('readingTime: a single word -> 1', () => {
  assert.strictEqual(readingTime('hello'), 1);
});

test('readingTime: 200 words -> 1', () => {
  assert.strictEqual(readingTime(Array(200).fill('word').join(' ')), 1);
});

test('readingTime: 201 words -> 2', () => {
  assert.strictEqual(readingTime(Array(201).fill('word').join(' ')), 2);
});

test('readingTime: custom wpm doubles the minutes for the same text', () => {
  const text = Array(200).fill('word').join(' ');
  assert.strictEqual(readingTime(text, { wpm: 100 }), 2);
});

test('readingTime: wpm <= 0 throws RangeError', () => {
  assert.throws(() => readingTime('hello', { wpm: 0 }), RangeError);
  assert.throws(() => readingTime('hello', { wpm: -5 }), RangeError);
});

test('readingTime: NaN wpm throws RangeError', () => {
  assert.throws(() => readingTime('hello', { wpm: NaN }), RangeError);
});
