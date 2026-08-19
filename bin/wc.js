#!/usr/bin/env node
'use strict';

// Usage: node bin/wc.js <file>
// Prints the number of words in the file.

const fs = require('node:fs');

function main(argv) {
  const file = argv[0];
  if (!file) {
    process.stderr.write('usage: wc.js <file>\n');
    return 2;
  }
  const text = fs.readFileSync(file, 'utf8');
  const words = text.split(/\s+/).filter(Boolean).length;
  process.stdout.write(`${words}\n`);
  return 0;
}

process.exitCode = main(process.argv.slice(2));
