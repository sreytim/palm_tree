/**
 * Submission workflow rules (community contributor pipeline).
 *
 * Pure functions only — no Supabase client, no React — so the same rules can be
 * reused by the API routes, the contributor status page and the admin screens,
 * and exercised on their own in `tests/submission-workflow.test.js`.
 *
 * The statuses here mirror the `entries.status` check constraint and the
 * triggers in `supabase/migrations/0012_community_contributor_workflow.sql`:
 *
 *   contributor submits             -> 'pending'   (private to owner + editors)
 *   owner (admin) approves         -> 'published' (public)
 *   owner (admin) returns + note   -> 'returned'  (back to the author)
 *   author edits returned/published -> 'pending'  (resubmitted automatically)
 *
 * A reviewer editing a published entry keeps it published: reviewing is not a
 * resubmission. Only the author's own edit returns it to the queue.
 */

export const SUBMISSION_STATUSES = ["pending", "published", "returned"];

export const STATUS_LABEL_KEYS = {
  pending: "statusPending",
  published: "statusPublished",
  returned: "statusReturned",
};

export const STATUS_HINT_KEYS = {
  pending: "statusPendingHint",
  published: "statusPublishedHint",
  returned: "statusReturnedHint",
};

/**
 * Approving, returning, featuring or deleting an entry is the archive owner's
 * decision alone. Editors may correct an entry's text, never publish it.
 * Mirrors `public.is_admin()` in the database.
 */
export const MODERATOR_ROLES = ["admin"];

/** Roles that may open the entry manager and correct content. */
export const MANAGER_ROLES = ["editor", "admin"];

/** Roles that may contribute. Mirrors the insert policy on `entries`. */
export const CONTRIBUTOR_ROLES = ["contributor", "editor", "admin"];

/** Translation keys for the role labels shown in the header and admin screens. */
export const ROLE_LABEL_KEYS = {
  reader: "roleReader",
  contributor: "roleContributor",
  editor: "roleEditor",
  admin: "roleAdmin",
};

export function roleLabelKey(role) {
  return ROLE_LABEL_KEYS[role] ?? "roleUnknown";
}

/** Mirrors the `max_pending` constant in the 0012 contribution trigger. */
export const MAX_PENDING_SUBMISSIONS = 5;

export const MAX_REVIEW_NOTE_LENGTH = 500;
export const MIN_RETURN_NOTE_LENGTH = 10;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isSubmissionStatus(value) {
  return SUBMISSION_STATUSES.includes(value);
}

export function isEntryId(value) {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

export function canContribute(role) {
  return CONTRIBUTOR_ROLES.includes(role);
}

export function canModerate(role) {
  return MODERATOR_ROLES.includes(role);
}

export function canManageEntries(role) {
  return MANAGER_ROLES.includes(role);
}

export function isAdminRole(role) {
  return role === "admin";
}

/**
 * Owners may correct a submission while it is pending, returned, or published.
 * Editing either of the last two sends it back to 'pending', so a change to a
 * live entry is reviewed before it is visible again.
 */
export const OWNER_EDITABLE_STATUSES = ["pending", "returned", "published"];

/**
 * Withdrawing deletes the entry and its photo, so it stays limited to entries
 * the public has never seen. A published entry is removed by the archive team.
 */
export const OWNER_WITHDRAWABLE_STATUSES = ["pending", "returned"];

export function canOwnerEdit(status) {
  return OWNER_EDITABLE_STATUSES.includes(status);
}

export function canOwnerWithdraw(status) {
  return OWNER_WITHDRAWABLE_STATUSES.includes(status);
}

/**
 * Whether `role` may move a submission from `from` to `to`.
 * Only the archive owner may: editors can correct text but never publish.
 */
export function canModerateTransition(from, to, role) {
  if (!isSubmissionStatus(from) || !isSubmissionStatus(to)) {
    return false;
  }
  // A status may never stay the same — approving always changes something.
  if (from === to) {
    return false;
  }

  return canModerate(role);
}

export function normalizeReviewNote(value) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Validates a review request body (`PATCH /api/admin/contributions`).
 * Returning a submission without an explanation leaves the author guessing, so
 * a return note is required. The note is optional for an approval.
 */
export function validateReviewAction(input) {
  const source =
    input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const value = {
    id: typeof source.id === "string" ? source.id : "",
    status: isSubmissionStatus(source.status) ? source.status : null,
    reviewNote: normalizeReviewNote(source.reviewNote),
    featured:
      typeof source.featured === "boolean" ? source.featured : undefined,
  };
  const errors = {};

  if (!isEntryId(value.id)) {
    errors.id = "reviewInvalidId";
  }

  if (source.status !== undefined && value.status === null) {
    errors.status = "reviewInvalidStatus";
  }

  if (source.status === undefined && value.featured === undefined) {
    errors.status = "reviewInvalidStatus";
  }

  if (source.featured !== undefined && value.featured === undefined) {
    errors.featured = "reviewInvalidStatus";
  }

  if (value.reviewNote.length > MAX_REVIEW_NOTE_LENGTH) {
    errors.reviewNote = "reviewNoteLength";
  } else if (
    value.status === "returned" &&
    value.reviewNote.length < MIN_RETURN_NOTE_LENGTH
  ) {
    errors.reviewNote = "reviewNoteRequired";
  }

  return { value, errors };
}

/**
 * The status a submission has while it waits for a decision, keyed by the
 * action the author can take next. Keeps the UI copy and the button logic in
 * one place.
 */
export function getSubmissionActions(status) {
  return {
    canEdit: canOwnerEdit(status),
    canWithdraw: canOwnerWithdraw(status),
    isPublic: status === "published",
  };
}
