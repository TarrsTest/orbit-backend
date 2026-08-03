'use strict';

/** Unique values, first occurrence wins, order kept. */
function unique(list) {
  return [...new Set(list)];
}

/** Sum of a list of numbers; 0 for an empty list. */
function sum(list) {
  return list.reduce((a, b) => a + b, 0);
}

/**
 * Split `list` into arrays of `size` elements; the last one may be shorter.
 *   chunk([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]]
 * TODO: not implemented yet.
 */
function chunk(list, size) {
  throw new Error('not implemented');
}

module.exports = { unique, sum, chunk };
