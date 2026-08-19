'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { describeUser, activeNames } = require('../src/report');

test('describeUser', () => {
  assert.equal(describeUser(1), 'Ada (active)');
  assert.equal(describeUser(2), 'Grace (inactive)');
  assert.equal(describeUser(9), 'unknown user 9');
});

test('activeNames', () => {
  assert.deepEqual(activeNames(), ['Ada', 'Linus']);
});
