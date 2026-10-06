"use client";

import { useEffect, useState } from "react";

/**
 * A page size that follows the layout breakpoints.
 *
 * Chosen to line up with the entry grid (`sm:grid-cols-2 lg:grid-cols-3`) so a
 * page always ends on a full row:
 *   - laptop / big screen (≥ 1024px, three columns): 6 cards = two rows of three
 *   - phone and tablet (below 1024px):               4 cards = two rows of two
 *
 * The server cannot know the viewport, so `small` is the initial value and the
 * real size is applied on mount. Entries are fetched in the browser anyway, so
 * the first painted card list already uses the correct size.
 */
export function useResponsivePageSize(small = 4, large = 6) {
  const [pageSize, setPageSize] = useState(small);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const apply = () => setPageSize(query.matches ? large : small);

    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [small, large]);

  return pageSize;
}