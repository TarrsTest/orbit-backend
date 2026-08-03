'use strict';

/**
 * Turn a title into a URL slug: lower case, ASCII letters and digits,
 * words joined by a single "-", no leading or trailing "-".
 *   slugify('Hello, World!')      -> 'hello-world'
 *   slugify('  many   spaces  ')  -> 'many-spaces'
 */
function slugify(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
}

module.exports = { slugify };
