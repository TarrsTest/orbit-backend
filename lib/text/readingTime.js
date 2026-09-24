const DEFAULT_WPM = 200;

// Word count and whole minutes to read `text` at `wpm` words per minute.
//
// Returns { minutes, words }: `words` is the number of whitespace-separated
// tokens; `minutes` is ceil(words / wpm), at least 1 for non-empty text and
// exactly 0 for empty/whitespace-only (null/undefined count as empty).
// Throws a RangeError when `wpm` is not a positive finite number.
function readingTime(text, { wpm = DEFAULT_WPM } = {}) {
  const rate = Number(wpm);
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new RangeError(`wpm must be a positive finite number, got ${wpm}`);
  }

  if (text == null) return { minutes: 0, words: 0 };

  const words = (String(text).match(/\S+/g) || []).length;
  if (words === 0) return { minutes: 0, words: 0 };

  return { minutes: Math.ceil(words / rate), words };
}

module.exports = { readingTime };
