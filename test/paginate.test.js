'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { paginate } = require('../src/paginate');

test('first page', () => {
  assert.deepEqual(paginate([1, 2, 3, 4, 5], 1, 2), { items: [1, 2], page: 1, pages: 3 });
});

test('last partial page', () => {
  assert.deepEqual(paginate([1, 2, 3, 4, 5], 3, 2), { items: [5], page: 3, pages: 3 });
});

test('past the end is empty', () => {
  assert.deepEqual(paginate([1, 2, 3], 5, 2).items, []);
});
