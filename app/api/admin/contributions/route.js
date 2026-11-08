import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-session";
import {
  isSameOriginRequest,
  ORIGIN_MISMATCH_MESSAGE,
} from "@/lib/request-origin";
import {
  canModerate,
  canModerateTransition,
  validateReviewAction,
} from "@/lib/submission-status";
import { createSupabaseServerClient } from "@/lib/supabase";

function responseError(message, status, errorKey) {
  return NextResponse.json(
    errorKey ? { error: message, errorKey } : { error: message },
    { status },
  );
}

/**
 * Review a community submission.
 *
 * Body: `{ id, status?, reviewNote?, featured? }`
 *   status    'published' | 'returned' | 'pending' (admin only)
 *   reviewNote required when returning, so the author learns what to fix
 *   featured  admin only; a highlight on the public archive
 *
 * The database enforces the same rules (migration 0012): only the archive
 * owner may touch status/featured/review_*, and an owner may only move their
 * own returned entry back to pending by editing it.
 */
export async function PATCH(request) {
  if (!isSameOriginRequest(request)) {
    return responseError(ORIGIN_MISMATCH_MESSAGE, 403);
  }

  const supabase = await createSupabaseServerClient();
  const { user, error: authError } = await getCurrentUser(supabase);
  if (authError) {
    console.error("Could not verify submission review session:", authError);
    return responseError("We couldn't verify your session. Please try again.", 503);
  }
  if (!user) {
    return responseError("Please log in to review submissions.", 401);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) {
    console.error("Could not verify submission review role:", profileError);
    return responseError("We couldn't verify your review permissions.", 500);
  }

  const role = profile?.role ?? null;
  if (!canModerate(role)) {
    return responseError(
      "Only the archive owner can approve or return an entry.",
      403,
      "reviewNotAllowed",
    );
  }

  let input;
  try {
    input = await request.json();
  } catch (error) {
    console.error("Could not read submission review request:", error);
    return responseError("The review request could not be read.", 400);
  }

  const { value, errors } = validateReviewAction(input);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Please review the request.", fieldErrors: errors },
      { status: 400 },
    );
  }

  const { data: entry, error: entryError } = await supabase
    .from("entries")
    .select("id, status")
    .eq("id", value.id)
    .maybeSingle();

  if (entryError) {
    console.error("Could not load the submission being reviewed:", entryError);
    return responseError("We couldn't load this submission. Please try again.", 500);
  }
  if (!entry) {
    return responseError("This submission could not be found.", 404);
  }

  const update = {};

  if (value.status) {
    if (!canModerateTransition(entry.status, value.status, role)) {
      return responseError(
        "This submission has already moved on. Reload the page to see its current status.",
        409,
        "reviewStaleSubmission",
      );
    }

    update.status = value.status;
    update.review_note = value.reviewNote === "" ? null : value.reviewNote;
    update.reviewed_at = new Date().toISOString();
    update.reviewed_by = user.id;
  }

  // Featuring belongs to the same owner-only control as approving.
  if (value.featured !== undefined) {
    update.featured = value.featured;
  }

  const { data: saved, error: updateError } = await supabase
    .from("entries")
    .update(update)
    .eq("id", value.id)
    .select("id, status, review_note, reviewed_at")
    .maybeSingle();

  if (updateError) {
    console.error("Could not update submission status:", updateError);
    if (updateError.code === "42501") {
      return responseError(
        "Only archive editors can change this submission.",
        403,
        "reviewNotAllowed",
      );
    }

    return responseError("We couldn't update this submission. Please try again.", 500);
  }
  if (!saved) {
    return responseError("This submission could not be updated.", 409);
  }

  return NextResponse.json({
    success: true,
    status: saved.status,
    reviewNote: saved.review_note ?? null,
    reviewedAt: saved.reviewed_at ?? null,
  });
}
