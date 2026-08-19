'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const bin = path.join(__dirname, '..', 'bin', 'wc.js');

test('counts words', () => {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'wc-')), 'a.txt');
  fs.writeFileSync(file, 'one two\nthree\n\nfour five six\n');
  assert.equal(execFileSync(process.execPath, [bin, file], { encoding: 'utf8' }), '6\n');
});
