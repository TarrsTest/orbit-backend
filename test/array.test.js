'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { unique, sum } = require('../src/array');

test('unique keeps first occurrences in order', () => {
  assert.deepEqual(unique([3, 1, 3, 2, 1]), [3, 1, 2]);
});

test('sum of empty list is zero', () => {
  assert.equal(sum([]), 0);
  assert.equal(sum([1, 2, 3]), 6);
});
