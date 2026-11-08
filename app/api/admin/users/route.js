import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-session";
import {
  isSameOriginRequest,
  ORIGIN_MISMATCH_MESSAGE,
} from "@/lib/request-origin";
import { isAdminRole, isEntryId } from "@/lib/submission-status";
import { createSupabaseServerClient } from "@/lib/supabase";

// 'reader' is kept for completeness but is not offered in the UI: every new
// account starts as a contributor so any visitor can submit an entry.
const ASSIGNABLE_ROLES = ["contributor", "editor", "admin"];

function responseError(message, status, errorKey) {
  return NextResponse.json(
    errorKey ? { error: message, errorKey } : { error: message },
    { status },
  );
}

/**
 * Change a profile role. Admin only.
 *
 * Body: `{ id, role }`
 *
 * The database trigger `prevent_profile_role_escalation` (migration 0012)
 * enforces the same rule server-side and refuses to demote the archive owner
 * account listed in `public.super_admins`.
 */
export async function PATCH(request) {
  if (!isSameOriginRequest(request)) {
    return responseError(ORIGIN_MISMATCH_MESSAGE, 403);
  }

  const supabase = await createSupabaseServerClient();
  const { user, error: authError } = await getCurrentUser(supabase);
  if (authError) {
    console.error("Could not verify role management session:", authError);
    return responseError("We couldn't verify your session. Please try again.", 503);
  }
  if (!user) {
    return responseError("Please log in to manage accounts.", 401);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) {
    console.error("Could not verify role management permissions:", profileError);
    return responseError("We couldn't verify your permissions.", 500);
  }
  if (!isAdminRole(profile?.role)) {
    return responseError(
      "Only the archive owner can manage account roles.",
      403,
      "roleNotAllowed",
    );
  }

  let input;
  try {
    input = await request.json();
  } catch (error) {
    console.error("Could not read the role change request:", error);
    return responseError("The request could not be read.", 400);
  }

  const id = typeof input?.id === "string" ? input.id : "";
  const role = typeof input?.role === "string" ? input.role : "";

  if (!isEntryId(id) || !ASSIGNABLE_ROLES.includes(role)) {
    return responseError("Choose a valid account and role.", 400);
  }

  if (id === user.id) {
    return responseError(
      "You cannot change your own role. Ask another admin to do it.",
      409,
      "roleSelfChange",
    );
  }

  const { data: saved, error: updateError } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id)
    .select("id, role")
    .maybeSingle();

  if (updateError) {
    console.error("Could not change the profile role:", updateError);
    if (updateError.code === "42501") {
      return responseError(
        updateError.message ||
          "This account role cannot be changed.",
        403,
        "roleNotAllowed",
      );
    }

    return responseError("We couldn't update this account. Please try again.", 500);
  }
  if (!saved) {
    return responseError("This account could not be updated.", 409);
  }

  return NextResponse.json({ success: true, role: saved.role });
}
