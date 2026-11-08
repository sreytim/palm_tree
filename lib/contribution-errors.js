/**
 * Turns a failed `entries` write into the HTTP response the UI expects.
 *
 * The table triggers (supabase/migrations/0012_community_contributor_workflow.sql)
 * raise plain exceptions via `raise exception '...'`, which arrive as SQLSTATE
 * P0001. Those mean the author's input was rejected, not that the server broke,
 * so they are reported as 400 - except the pending-submission cap, which is a
 * rate limit. 42501 is the "not allowed" check the moderation triggers raise.
 *
 * Pure function: no Next.js import, so the mapping can be unit tested.
 */
import { MAX_PENDING_SUBMISSIONS } from "./submission-status.js";

export const CONTRIBUTION_LIMIT_MESSAGE =
  "You already have " +
  MAX_PENDING_SUBMISSIONS +
  " submissions waiting for review. Wait for a decision or withdraw one first.";

export function describeContributionWriteError(error) {
  if (error?.code === "P0001") {
    if (/submission limit reached/i.test(error.message ?? "")) {
      return {
        message: CONTRIBUTION_LIMIT_MESSAGE,
        status: 429,
        errorKey: "contributionLimitReached",
      };
    }

    return {
      message: "Some contribution details were rejected. Please review the form.",
      status: 400,
      errorKey: "contributionInvalid",
    };
  }

  if (error?.code === "42501") {
    return {
      message: "Your account cannot change this entry.",
      status: 403,
      errorKey: "contributionNotAllowed",
    };
  }

  if (error?.code === "23514") {
    return {
      message: "Some contribution details were rejected. Please review the form.",
      status: 400,
      errorKey: "contributionInvalid",
    };
  }

  return {
    message:
      "We couldn't save your changes. Please check your connection and try again.",
    status: 500,
    errorKey: "contributionSubmitFailed",
  };
}
