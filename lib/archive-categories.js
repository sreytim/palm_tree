/**
 * Category filter helpers for the archive search.
 *
 * Pure functions only — no React, no Supabase — so the filter rules can be
 * exercised on their own, the same way `lib/entry-mapping.js` and
 * `lib/pagination.js` are.
 *
 * The contribution form and the database constraint in migration 0012 both use
 * the same six category names, so this module reuses that list as the canonical
 * order instead of inventing a second one.
 */
import { CONTRIBUTION_CATEGORIES } from "./contribution-rules.js";

/** The "no filter" value; also the default when no category is set. */
export const ALL_CATEGORIES = "all";

/**
 * Category options for the filter chips.
 *
 * Only categories that entries actually use are offered, ordered like the
 * contribution form. A stored category that is not on that list (older data, or
 * a category added later) still gets a chip, sorted after the known ones, so
 * filtering can never hide a row.
 */
export function buildCategoryOptions(items) {
  const rows = Array.isArray(items) ? items : [];
  const present = [
    ...new Set(rows.map((item) => item?.category).filter(Boolean)),
  ];
  const known = CONTRIBUTION_CATEGORIES.filter((category) =>
    present.includes(category),
  );
  const extras = present
    .filter((category) => !CONTRIBUTION_CATEGORIES.includes(category))
    .sort((first, second) => first.localeCompare(second));

  return [...known, ...extras];
}

/**
 * The filter to actually apply.
 *
 * A category taken from the address bar (`?category=…`) that no longer matches
 * any entry falls back to "all" rather than leaving the visitor on an
 * unexplained empty page.
 */
export function resolveActiveCategory(category, options) {
  const available = Array.isArray(options) ? options : [];

  return category && available.includes(category)
    ? category
    : ALL_CATEGORIES;
}

/** Whether an entry belongs in the active category filter. */
export function matchesCategory(item, activeCategory) {
  return activeCategory === ALL_CATEGORIES || item?.category === activeCategory;
}
