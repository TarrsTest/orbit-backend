const test = require('node:test');
const assert = require('node:assert');

const { readingTime } = require('../lib/text');

test('readingTime: empty string -> { minutes: 0, words: 0 }', () => {
  assert.deepStrictEqual(readingTime(''), { minutes: 0, words: 0 });
});

test('readingTime: whitespace-only -> { minutes: 0, words: 0 }', () => {
  assert.deepStrictEqual(readingTime('   \n\t  '), { minutes: 0, words: 0 });
});

test('readingTime: null/undefined -> { minutes: 0, words: 0 }', () => {
  assert.deepStrictEqual(readingTime(null), { minutes: 0, words: 0 });
  assert.deepStrictEqual(readingTime(undefined), { minutes: 0, words: 0 });
});

test('readingTime: a single word -> { minutes: 1, words: 1 }', () => {
  assert.deepStrictEqual(readingTime('hello'), { minutes: 1, words: 1 });
});

test('readingTime: 200 words -> { minutes: 1, words: 200 }', () => {
  assert.deepStrictEqual(readingTime(Array(200).fill('word').join(' ')), { minutes: 1, words: 200 });
});

test('readingTime: 201 words -> { minutes: 2, words: 201 }', () => {
  assert.deepStrictEqual(readingTime(Array(201).fill('word').join(' ')), { minutes: 2, words: 201 });
});

test('readingTime: custom wpm doubles the minutes for the same text', () => {
  const text = Array(200).fill('word').join(' ');
  assert.deepStrictEqual(readingTime(text, { wpm: 100 }), { minutes: 2, words: 200 });
});

test('readingTime: wpm <= 0 throws RangeError', () => {
  assert.throws(() => readingTime('hello', { wpm: 0 }), RangeError);
  assert.throws(() => readingTime('hello', { wpm: -5 }), RangeError);
});

test('readingTime: NaN wpm throws RangeError', () => {
  assert.throws(() => readingTime('hello', { wpm: NaN }), RangeError);
});
