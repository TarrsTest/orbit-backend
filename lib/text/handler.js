const { toSlug, readingTime } = require('./index');

// Query params can arrive as arrays (repeated keys) or objects, so coerce to a
// plain string before handing anything to toSlug/readingTime.
function asText(value) {
  if (Array.isArray(value)) return value.length ? asText(value[0]) : '';
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

// Pure request logic, decoupled from Express: a req.query-like object in,
// a { status, body } out.
function handleTextRequest(query) {
  const q = query && typeof query === 'object' ? query : {};
  const title = asText(q.title);

  if (title.trim() === '') {
    return { status: 400, body: { error: 'title is required' } };
  }

  const body = asText(q.body);
  const minutes = readingTime(body);
  return { status: 200, body: { slug: toSlug(title), minutes } };
}

module.exports = { handleTextRequest };
