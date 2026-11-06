import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const editorReview = readFileSync(
  new URL(
    "../supabase/migrations/0011_editor_review_and_status_repair.sql",
    import.meta.url,
  ),
  "utf8",
);

const policy = (name) =>
  editorReview.match(
    new RegExp(`create policy ${name} on public\\.entries([\\s\\S]*?);`),
  )?.[1] ?? "";

test("editors can update entries they do not own so submissions can be reviewed", () => {
  // Without this policy the review queue writes zero rows and always reports
  // the submission as already reviewed.
  const editorUpdate = policy("entries_editor_update");
  assert.match(editorUpdate, /for update to authenticated/);
  assert.match(editorUpdate, /using \(public\.is_editor\(\)\)/);
  assert.match(editorUpdate, /with check \(public\.is_editor\(\)\)/);
});

test("editorial writes cleared by the previous migration are restored", () => {
  assert.match(
    editorReview,
    /drop policy if exists entries_editor_update on public\.entries/,
  );
  // Reviews must not become ownership transfers.
  assert.match(editorReview, /create trigger prevent_entry_owner_change/);
  assert.match(editorReview, /new\.owner is distinct from old\.owner/);
  assert.match(editorReview, /Entry ownership cannot be transferred/);
});

test("moderation fields stay editor-only for signed-in users", () => {
  assert.match(editorReview, /\(select auth\.uid\(\)\) is not null/);
  assert.match(editorReview, /Only editors can change entry moderation fields/);
});

test("the status workflow is re-applied in an order that cannot fail", () => {
  const dropConstraint = editorReview.indexOf(
    "drop constraint if exists entries_status_check",
  );
  const migrateRows = editorReview.indexOf("update public.entries");
  const addConstraint = editorReview.indexOf(
    "add constraint entries_status_check",
  );

  assert.ok(dropConstraint > -1, "the old status constraint is dropped");
  assert.ok(
    addConstraint > dropConstraint,
    "the new constraint is added after the drop",
  );
  assert.ok(
    migrateRows > dropConstraint && migrateRows < addConstraint,
    "existing rows are migrated between the drop and the add",
  );
  assert.match(
    editorReview,
    /check \(status in \('pending', 'published', 'returned'\)\)/,
  );
});
