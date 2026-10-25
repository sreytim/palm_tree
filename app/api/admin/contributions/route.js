import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-session";
import { createSupabaseServerClient } from "@/lib/supabase";

function responseError(message, status) {
  return NextResponse.json({ error: message }, { status });
}

export async function PATCH(request) {
  const requestUrl = new URL(request.url);
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const protocol = forwardedProtocol
    ? forwardedProtocol.split(",")[0].trim()
    : requestUrl.protocol.slice(0, -1);
  const expectedOrigin = host ? `${protocol}://${host}` : requestUrl.origin;
  if (request.headers.get("origin") !== expectedOrigin) {
    return responseError("Request could not be verified. Please reload and try again.", 403);
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
  if (!["editor", "admin"].includes(profile?.role)) {
    return responseError("Only archive editors can review submissions.", 403);
  }

  let input;
  try {
    input = await request.json();
  } catch (error) {
    console.error("Could not read submission review request:", error);
    return responseError("The review request could not be read.", 400);
  }

  if (
    typeof input?.id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      input.id,
    ) ||
    !["published", "returned"].includes(input.status)
  ) {
    return responseError("Choose a valid submission and review action.", 400);
  }

  let result;
  try {
    result = await supabase
      .from("entries")
      .update({ status: input.status })
      .eq("id", input.id)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();
  } catch (error) {
    console.error("Submission status update request failed:", error);
    return responseError("We couldn't update this submission. Please try again.", 500);
  }

  if (result.error) {
    console.error("Could not update submission status:", result.error);
    return responseError("We couldn't update this submission. Please try again.", 500);
  }
  if (!result.data) {
    return responseError("This submission has already been reviewed.", 409);
  }

  return NextResponse.json({ success: true });
}
