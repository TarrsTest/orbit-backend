// Turn a title into a URL-safe slug, e.g. "Héllo, World!" -> "hello-world".
//
// Non-ASCII letters are kept (e.g. "你好 世界" -> "你好-世界"), so we separate on
// Unicode letter/number classes rather than [a-z0-9]. Ligatures that NFD cannot
// decompose (most notably German ß) are transliterated explicitly first.
function slugify(title, maxLength = 60) {
  const slug = String(title == null ? '' : title)
    .toLowerCase()
    .replace(/ß/g, 'ss') // NFD leaves ß intact — map it to ss ourselves.
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics/accent marks
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');

  if (slug.length <= maxLength) return slug;
  // Cutting mid-word can leave a dangling separator — drop it.
  return slug.slice(0, maxLength).replace(/-+$/, '');
}

module.exports = { slugify };
