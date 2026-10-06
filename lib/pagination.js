/**
 * Pagination helpers.
 *
 * Pure functions, so the slicing and clamping can be tested on their own —
 * the same approach as `lib/entry-mapping.js`.
 */

/** Total pages for `total` items, never less than 1. */
export function pageCount(total, pageSize) {
  if (!pageSize || pageSize < 1) return 1;
  return Math.max(1, Math.ceil(total / pageSize));
}

/** Clamp a requested page into the valid range. */
export function clampPage(page, total, pageSize) {
  const count = pageCount(total, pageSize);
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.min(Math.floor(page), count);
}

/**
 * The slice of `items` to show for `page`.
 *
 * With no `pageSize`, everything is returned and `paginated` is false, so
 * callers that do not want pagination keep their existing behaviour.
 * Clamping happens here, which means a shrinking result set (for example after
 * typing a search) can never leave the UI stranded on an out-of-range page.
 */
export function paginate(items, page, pageSize) {
  if (!pageSize || pageSize < 1) {
    return { items, currentPage: 1, totalPages: 1, paginated: false };
  }

  const totalPages = pageCount(items.length, pageSize);
  const currentPage = clampPage(page, items.length, pageSize);
  const start = (currentPage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    currentPage,
    totalPages,
    paginated: totalPages > 1,
  };
}

/** 1…totalPages, for the numbered buttons. */
export function pageNumbers(totalPages) {
  return Array.from({ length: totalPages }, (_, index) => index + 1);
}