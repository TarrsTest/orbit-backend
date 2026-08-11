'use strict';

/**
 * Call async `fn` up to `attempts` times. Resolves with the first success.
 * If every attempt fails, rejects with the LAST error.
 */
async function retry(fn, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return fn(i);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

module.exports = { retry };
