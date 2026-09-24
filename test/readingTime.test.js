const test = require('node:test');
const assert = require('node:assert');

const { readingTime } = require('../lib/text');

test('readingTime: empty string -> 0', () => {
  assert.strictEqual(readingTime(''), 0);
});

test('readingTime: whitespace-only -> 0', () => {
  assert.strictEqual(readingTime('   \n\t  '), 0);
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
