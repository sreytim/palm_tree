import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const revision = readFileSync(
  new URL(
    "../supabase/migrations/0017_owner_revision_of_published_entries.sql",
    import.meta.url,
  ),
  "utf8",
);

const policy =
  revision.match(
    /create policy entries_owner_update on public\.entries([\s\S]*?);/,
  )?.[1] ?? "";

test("an author may open and update their own published entry", () => {
  assert.match(
    policy,
    /using \(\s*owner = \(select auth\.uid\(\)\)\s*and status in \('pending', 'returned', 'published'\)/,
  );
});

test("the saved row can only land back in the review queue", () => {
  // WITH CHECK runs after BEFORE triggers, so the resubmission trigger turns a
  // published row into 'pending' before this check sees it. Direct attempts to
  // write 'published' are refused.
  assert.match(
    policy,
    /with check \(\s*owner = \(select auth\.uid\(\)\)\s*and status in \('pending', 'returned'\)/,
  );
});

test("saving a published entry resubmits it and clears the review note", () => {
  assert.match(
    revision,
    /if old\.status in \('returned', 'published'\) then[\s\S]*?new\.status := 'pending';[\s\S]*?new\.review_note := null;/,
  );
});

test("only the contributing owner may use the automatic resubmission", () => {
  // An editor editing a published row must keep it published; the exception is
  // restricted to a contributor's own row, which is the path the BEFORE trigger
  // takes for a normal author edit.
  assert.match(
    revision,
    /current_profile_role\(\)\), ''\) = 'contributor'[\s\S]*?new\.owner = \(select auth\.uid\(\)\)[\s\S]*?old\.status in \('returned', 'published'\)[\s\S]*?new\.status = 'pending'/,
  );
});

test("an author-supplied status change fails loudly", () => {
  assert.match(
    revision,
    /if new\.status is distinct from old\.status then\s+raise exception 'Only the archive owner can approve, return or moderate an entry'/,
  );
  assert.match(revision, /using errcode = '42501'/);
});

test("a reviewer edit of a published entry leaves the status alone", () => {
  // The contribution trigger returns early for any role other than
  // 'contributor', so editors and admins never reach the resubmission branch.
  assert.match(
    revision,
    /if coalesce\(public\.current_profile_role\(\), ''\) <> 'contributor' then\s+return new;/,
  );
});

test("the resubmission may clear the review columns, but not write them", () => {
  assert.match(
    revision,
    /if old\.status in \('returned', 'published'\) and new\.status = 'pending' then/,
  );
  assert.match(revision, /new\.review_note is not null/);
  assert.match(revision, /new\.reviewed_at is not null/);
  assert.match(revision, /new\.reviewed_by is not null/);
  assert.match(
    revision,
    /raise exception 'Only the archive owner can write review notes'/,
  );
});

test("the triggers are recreated so a missing one is repaired", () => {
  assert.match(
    revision,
    /drop trigger if exists enforce_contribution_rules on public\.entries/,
  );
  assert.match(
    revision,
    /create trigger enforce_contribution_rules\s+before insert or update on public\.entries/,
  );
  assert.match(
    revision,
    /drop trigger if exists prevent_owner_moderation_changes on public\.entries/,
  );
});
