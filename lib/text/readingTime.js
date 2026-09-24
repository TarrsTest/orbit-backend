const WORDS_PER_MINUTE = 200;

// Whole minutes to read `text` at ~200 wpm, rounded up. Empty/blank -> 0.
function readingTime(text) {
  if (text == null) return 0;
  const words = String(text).trim().match(/\S+/g) || [];
  if (words.length === 0) return 0;
  return Math.ceil(words.length / WORDS_PER_MINUTE);
}

module.exports = { readingTime };
