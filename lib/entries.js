"use client";

/**
 * Entries data layer (Lab 6, Part 3).
 *
 * Reads archive entries from the Supabase `entries` table. Row-to-UI mapping
 * lives in `lib/entry-mapping.js`, which is pure and separately testable.
 */
import { supabase } from "./supabase-client";
import { COLUMNS, toUiEntry } from "./entry-mapping";

export { toUiEntry };

/**
 * Reads every entry. The table's read policy is `using (true)`, so the
 * publishable key is enough — no service key is involved.
 *
 * Ordered by created_at ascending, which reproduces the seed order
 * (arch-01 → arch-08). The table has no explicit position column; if the rows
 * were inserted in a single transaction they share a timestamp, in which case
 * the order is stable in practice but not guaranteed.
 */
export async function fetchEntries() {
  const { data, error } = await supabase
    .from("entries")
    .select(COLUMNS)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(toUiEntry);
}