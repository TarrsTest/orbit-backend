'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { retry } = require('../src/retry');

test('succeeds on the third attempt', async () => {
  let calls = 0;
  const value = await retry(async () => {
    calls++;
    if (calls < 3) throw new Error(`fail ${calls}`);
    return 'ok';
  }, 3);
  assert.equal(value, 'ok');
  assert.equal(calls, 3);
});

test('rejects with the last error when every attempt fails', async () => {
  let calls = 0;
  await assert.rejects(
    retry(async () => { calls++; throw new Error(`fail ${calls}`); }, 2),
    /fail 2/,
  );
  assert.equal(calls, 2);
});
