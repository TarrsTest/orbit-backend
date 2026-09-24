const DEFAULT_WPM = 200;

// Whole minutes to read `text` at `wpm` words per minute.
//
// Returns a plain number: ceil(words / wpm), at least 1 for non-empty text and
// exactly 0 for empty/whitespace-only (null/undefined count as empty).
// The `{ wpm }` option and the RangeError are kept; only the word count was
// dropped, since no caller used it.
// Throws a RangeError when `wpm` is not a positive finite number.
function readingTime(text, { wpm = DEFAULT_WPM } = {}) {
  const rate = Number(wpm);
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new RangeError(`wpm must be a positive finite number, got ${wpm}`);
  }

  if (text == null) return 0;

  const words = (String(text).match(/\S+/g) || []).length;
  if (words === 0) return 0;

  return Math.ceil(words / rate);
}

module.exports = { readingTime };
