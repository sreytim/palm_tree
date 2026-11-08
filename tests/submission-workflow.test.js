import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  MAX_PENDING_SUBMISSIONS,
  canManageEntries,
  canModerate,
  canModerateTransition,
  canOwnerEdit,
  canOwnerWithdraw,
  getSubmissionActions,
  isEntryId,
  validateReviewAction,
} from "../lib/submission-status.js";
import { getPhotoStoragePath } from "../lib/photo-validation.js";

const workflow = readFileSync(
  new URL(
    "../supabase/migrations/0012_community_contributor_workflow.sql",
    import.meta.url,
  ),
  "utf8",
);

const policy = (name) =>
  workflow.match(
    new RegExp(`create policy ${name} on public\\.entries([\\s\\S]*?);`),
  )?.[1] ?? "";

// ---------------------------------------------------------------------------
// Schema / policy expectations
// ---------------------------------------------------------------------------

test("a returned submission carries a review note and reviewer", () => {
  assert.match(
    workflow,
    /alter table public\.entries add column if not exists review_note text/,
  );
  assert.match(
    workflow,
    /alter table public\.entries add column if not exists reviewed_at timestamptz/,
  );
  assert.match(
    workflow,
    /alter table public\.entries add column if not exists reviewed_by uuid/,
  );
  assert.match(workflow, /entries_review_note_length/);
});

test("the archive owner is an allow-listed email, not a hard-coded uuid", () => {
  assert.match(workflow, /create table if not exists public\.super_admins/);
  assert.match(workflow, /alter table public\.super_admins enable row level security/);
  assert.match(
    workflow,
    /revoke all on table public\.super_admins from anon, authenticated/,
  );
  assert.match(workflow, /values \('sreytimt@gmail\.com'/);
  // New sign-ups become contributors, the owner becomes admin.
  assert.match(workflow, /from public\.super_admins s where s\.email = lower\(new\.email\)/);
  assert.match(workflow, /then 'admin'/);
  assert.match(workflow, /else 'contributor'/);
});

test("only admins change roles and the owner cannot be demoted", () => {
  assert.match(workflow, /create or replace function public\.prevent_profile_role_escalation/);
  assert.match(workflow, /Only admins can change profile roles/);
  assert.match(workflow, /The archive owner account cannot be demoted/);
  assert.match(workflow, /create trigger prevent_profile_role_escalation/);
});

test("an owner can only edit or withdraw an unapproved entry", () => {
  const ownerUpdate = policy("entries_owner_update");
  assert.match(ownerUpdate, /for update to authenticated/);
  assert.match(ownerUpdate, /owner = \(select auth\.uid\(\)\)/);
  assert.match(ownerUpdate, /status in \('pending', 'returned'\)/);
  assert.match(ownerUpdate, /with check/);

  const ownerDelete = policy("entries_owner_delete");
  assert.match(ownerDelete, /for delete to authenticated/);
  assert.match(ownerDelete, /status in \('pending', 'returned'\)/);
});

test("editors may correct text, only the owner moderates or deletes", () => {
  // Removing a submission is the owner's decision, not the editor's.
  assert.doesNotMatch(workflow, /create policy entries_editor_delete/);
  assert.match(policy("entries_editor_update"), /using \(public\.is_editor\(\)\)/);
  assert.match(policy("entries_admin_update"), /using \(public\.is_admin\(\)\)/);
  assert.match(policy("entries_admin_delete"), /using \(public\.is_admin\(\)\)/);
});

test("the public only ever reads published rows", () => {
  assert.match(
    policy("entries_public_published"),
    /for select to anon, authenticated\s+using \(status = 'published'\)/,
  );
  assert.match(workflow, /revoke insert, update, delete on table public\.entries from anon, public/);
});

test("contribution rules run on insert and update, with a pending cap", () => {
  assert.match(
    workflow,
    /create trigger enforce_contribution_rules\s+before insert or update on public\.entries/,
  );
  assert.match(workflow, /raise exception 'Submission limit reached'/);
});

test("the pending-submission cap is identical in SQL and in the app", () => {
  const sqlCap = Number(
    workflow.match(/max_pending constant integer := (\d+);/)?.[1],
  );
  assert.equal(sqlCap, MAX_PENDING_SUBMISSIONS);
});

test("editing a returned entry resubmits it and clears the old note", () => {
  assert.match(workflow, /if old\.status = 'returned' then/);
  assert.match(workflow, /new\.status := 'pending';/);
  assert.match(workflow, /new\.review_note := null;/);
});

test("owners cannot move moderation fields, except the resubmission", () => {
  assert.match(
    workflow,
    /Only the archive owner can approve, return or moderate an entry/,
  );
  assert.match(workflow, /old\.status = 'returned' and new\.status = 'pending'/);
  assert.match(workflow, /Only the archive owner can write review notes/);
});

// ---------------------------------------------------------------------------
// Workflow rules shared by the API routes and the UI
// ---------------------------------------------------------------------------

const ENTRY_ID = "0ab49510-1029-4e92-b98a-1d6d3c2cd10a";

test("owners may only change pending or returned submissions", () => {
  assert.equal(canOwnerEdit("pending"), true);
  assert.equal(canOwnerEdit("returned"), true);
  assert.equal(canOwnerEdit("published"), false);
  assert.equal(canOwnerWithdraw("pending"), true);
  assert.equal(canOwnerWithdraw("published"), false);
  assert.equal(canOwnerEdit(undefined), false);
});

test("only the archive owner may moderate", () => {
  assert.equal(canModerate("admin"), true);
  assert.equal(canModerate("editor"), false);
  assert.equal(canModerate("contributor"), false);
  assert.equal(canModerate(null), false);
});

test("editors and admins may manage entry content", () => {
  assert.equal(canManageEntries("editor"), true);
  assert.equal(canManageEntries("admin"), true);
  assert.equal(canManageEntries("contributor"), false);
});

test("an editor can never approve, return or unpublish", () => {
  assert.equal(canModerateTransition("pending", "published", "editor"), false);
  assert.equal(canModerateTransition("pending", "returned", "editor"), false);
  assert.equal(canModerateTransition("returned", "published", "editor"), false);
  assert.equal(canModerateTransition("published", "returned", "editor"), false);
});

test("a status never stays the same, whoever asks", () => {
  assert.equal(canModerateTransition("pending", "pending", "admin"), false);
  assert.equal(canModerateTransition("published", "published", "admin"), false);
  assert.equal(canModerateTransition("returned", "pending", "contributor"), false);
  assert.equal(canModerateTransition("pending", "published", "contributor"), false);
  assert.equal(canModerateTransition("pending", "published", null), false);
  assert.equal(canModerateTransition("unknown", "published", "admin"), false);
});

test("the archive owner may move any submission anywhere", () => {
  assert.equal(canModerateTransition("published", "pending", "admin"), true);
  assert.equal(canModerateTransition("returned", "pending", "admin"), true);
  assert.equal(canModerateTransition("pending", "published", "admin"), true);
  assert.equal(canModerateTransition("published", "returned", "admin"), true);
});

test("returning a submission requires an explanation", () => {
  const missingNote = validateReviewAction({ id: ENTRY_ID, status: "returned" });
  assert.equal(missingNote.errors.reviewNote, "reviewNoteRequired");

  const shortNote = validateReviewAction({
    id: ENTRY_ID,
    status: "returned",
    reviewNote: "too short",
  });
  assert.equal(shortNote.errors.reviewNote, "reviewNoteRequired");

  const goodNote = validateReviewAction({
    id: ENTRY_ID,
    status: "returned",
    reviewNote: "  The photo is blurry and the first step is missing.  ",
  });
  assert.deepEqual(goodNote.errors, {});
  assert.equal(
    goodNote.value.reviewNote,
    "The photo is blurry and the first step is missing.",
  );
});

test("a review action needs a real submission and a real action", () => {
  assert.equal(
    validateReviewAction({ id: "not-a-uuid", status: "published" }).errors.id,
    "reviewInvalidId",
  );
  assert.equal(
    validateReviewAction({ id: ENTRY_ID, status: "archived" }).errors.status,
    "reviewInvalidStatus",
  );
  assert.equal(validateReviewAction({ id: ENTRY_ID }).errors.status, "reviewInvalidStatus");
  assert.equal(
    validateReviewAction({ id: ENTRY_ID, featured: "yes" }).errors.featured,
    "reviewInvalidStatus",
  );
});

test("approving needs no note and accepts a featured toggle", () => {
  const approve = validateReviewAction({ id: ENTRY_ID, status: "published" });
  assert.deepEqual(approve.errors, {});
  assert.equal(approve.value.reviewNote, "");

  const feature = validateReviewAction({ id: ENTRY_ID, featured: false });
  assert.deepEqual(feature.errors, {});
  assert.equal(feature.value.featured, false);
});

test("a review note longer than 500 characters is rejected", () => {
  const result = validateReviewAction({
    id: ENTRY_ID,
    status: "returned",
    reviewNote: "a".repeat(501),
  });
  assert.equal(result.errors.reviewNote, "reviewNoteLength");
});

test("submission actions follow the status", () => {
  assert.deepEqual(getSubmissionActions("pending"), {
    canEdit: true,
    canWithdraw: true,
    isPublic: false,
  });
  assert.deepEqual(getSubmissionActions("returned"), {
    canEdit: true,
    canWithdraw: true,
    isPublic: false,
  });
  assert.deepEqual(getSubmissionActions("published"), {
    canEdit: false,
    canWithdraw: false,
    isPublic: true,
  });
});

test("entry ids are validated as uuids", () => {
  assert.equal(isEntryId(ENTRY_ID), true);
  assert.equal(isEntryId("0ab49510"), false);
  assert.equal(isEntryId(null), false);
});

test("a contribution photo path is read back from its public URL", () => {
  const uid = "0ab49510-1029-4e92-b98a-1d6d3c2cd10a";
  assert.equal(
    getPhotoStoragePath(
      `https://example.supabase.co/storage/v1/object/public/photos/${uid}/photo.jpg`,
    ),
    `${uid}/photo.jpg`,
  );
  assert.equal(
    getPhotoStoragePath(
      `https://example.supabase.co/storage/v1/object/public/photos/${uid}/photo.webp?download=1`,
    ),
    `${uid}/photo.webp`,
  );
  assert.equal(getPhotoStoragePath("https://example.com/photo.jpg"), null);
  assert.equal(getPhotoStoragePath(null), null);
});

test("hand-made policies on entries are removed before the rules are rebuilt", () => {
  // A policy added by hand in the dashboard (e.g. "anyone can read entries") is
  // OR-ed with the new ones, so it must be dropped whatever its name is.
  assert.match(
    workflow,
    /for existing in\s+select policyname\s+from pg_policies\s+where schemaname = 'public' and tablename = 'entries'/,
  );
  assert.match(
    workflow,
    /execute format\('drop policy if exists %I on public\.entries', existing\.policyname\)/,
  );
});

test("auth users whose profile row was never created get one", () => {
  assert.match(
    workflow,
    /insert into public\.profiles \(id, display_name, role\)\s+select u\.id,/,
  );
  assert.match(
    workflow,
    /where not exists \(select 1 from public\.profiles p where p\.id = u\.id\)/,
  );
});
