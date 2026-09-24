// Turn a title into a URL-safe slug, e.g. "Héllo, World!" -> "hello-world".
function slugify(title, maxLength = 60) {
  const slug = String(title == null ? '' : title)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics/accent marks
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (slug.length <= maxLength) return slug;
  // Cutting mid-word can leave a dangling separator — drop it.
  return slug.slice(0, maxLength).replace(/-+$/, '');
}

module.exports = { slugify };
