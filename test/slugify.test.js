'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { slugify } = require('../src/slugify');

test('punctuation and spaces become one dash', () => {
  assert.equal(slugify('Hello, World!'), 'hello-world');
});

test('runs of spaces collapse and the ends are trimmed', () => {
  assert.equal(slugify('  many   spaces  '), 'many-spaces');
});

test('digits survive', () => {
  assert.equal(slugify('Top 10 Tips'), 'top-10-tips');
});
