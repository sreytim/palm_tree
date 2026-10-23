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
 * Reads published entries through the public Supabase policy. The publishable
 * key is enough — no service key is involved.
 *
 * The migration-defined sort_order preserves the example order while placing
 * later non-sample entries first. Created time and slug make equal positions
 * deterministic.
 */
export async function fetchEntries() {
  const { data, error } = await supabase
    .from("entries")
    .select(COLUMNS)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .order("slug", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(toUiEntry);
}