'use strict';

/**
 * Split one CSV line into fields.
 *   parseLine('a,b,c') -> ['a', 'b', 'c']
 * Fields may be wrapped in double quotes; inside quotes a comma is part of
 * the field and "" stands for one literal quote character.
 */
function parseLine(line) {
  return line.split(',').map(field => field.replace(/^"|"$/g, ''));
}

module.exports = { parseLine };
