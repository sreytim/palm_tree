import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const repair = readFileSync(
  new URL(
    "../supabase/migrations/0016_returned_resubmission_repair.sql",
    import.meta.url,
  ),
  "utf8",
);

const guard =
  repair.match(
    /create or replace function public\.prevent_owner_moderation_changes\(\)[\s\S]*?\$\$;/,
  )?.[0] ?? "";

test("the returned -> pending resubmission may clear the review note", () => {
  // enforce_contribution_rules clears the review columns before this guard
  // runs, so the guard must not read that as the author editing a review note.
  assert.match(guard, /old\.status = 'returned' and new\.status = 'pending'/);
  assert.match(guard, /new\.review_note is not null/);
  assert.match(guard, /new\.reviewed_at is not null/);
  assert.match(guard, /new\.reviewed_by is not null/);
});

test("an author still cannot write or restore a review note", () => {
  assert.match(
    guard,
    /raise exception 'Only the archive owner can write review notes'/,
  );
  assert.match(guard, /new\.review_note is distinct from old\.review_note/);
  assert.match(guard, /new\.reviewed_at is distinct from old\.reviewed_at/);
  assert.match(guard, /new\.reviewed_by is distinct from old\.reviewed_by/);
});

test("moderation fields remain the archive owner's decision", () => {
  assert.match(
    guard,
    /Only the archive owner can approve, return or moderate an entry/,
  );
  assert.match(guard, /new\.featured is distinct from old\.featured/);
  assert.match(guard, /new\.is_sample is distinct from old\.is_sample/);
});

test("migrations and the archive owner keep full access", () => {
  assert.match(guard, /if \(select auth\.uid\(\)\) is null then/);
  assert.match(guard, /if coalesce\(\(select public\.is_admin\(\)\), false\) then/);
});

test("the trigger is recreated so a missing one is repaired", () => {
  assert.match(
    repair,
    /drop trigger if exists prevent_owner_moderation_changes on public\.entries/,
  );
  assert.match(
    repair,
    /create trigger prevent_owner_moderation_changes\s+before update on public\.entries/,
  );
});
