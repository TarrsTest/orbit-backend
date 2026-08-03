'use strict';

/**
 * Return one page of `items`. Pages are 1-based.
 *   paginate([1,2,3,4,5], 1, 2) -> { items: [1,2], page: 1, pages: 3 }
 *   paginate([1,2,3,4,5], 3, 2) -> { items: [5],   page: 3, pages: 3 }
 * A page past the end returns an empty list.
 */
function paginate(items, page, perPage) {
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const start = page * perPage;
  return { items: items.slice(start, start + perPage), page, pages };
}

module.exports = { paginate };
