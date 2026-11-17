import { redirect } from "next/navigation";
import ReviewQueue from "@/components/admin/ReviewQueue";
import ReviewStatusMessage from "@/components/admin/ReviewStatusMessage";
import { getCurrentUser } from "@/lib/auth-session";
import { readCurrentRole } from "@/lib/current-role";
import { canModerate } from "@/lib/submission-status";
import { createSupabaseServerClient } from "@/lib/supabase";

export default async function ReviewPage() {
  const supabase = await createSupabaseServerClient();
  const { user, error: authError } = await getCurrentUser(supabase);

  if (authError) {
    console.error("Could not verify review page session:", authError);
    return <ReviewStatusMessage message="reviewUnavailable" />;
  }

  if (!user) {
    redirect("/login?next=%2Fadmin%2Freview");
  }

  // The database decides the role: `current_profile_role()` answers 'admin' for
  // the e-mail in public.super_admins even when profiles.role is out of date.
  const { role, error: roleError } = await readCurrentRole(supabase, user.id);

  if (roleError) {
    console.error("Could not verify review permissions:", roleError);
    return (
      <ReviewStatusMessage
        message="reviewPermissionUnavailable"
        signedInAs={user.email}
      />
    );
  }

  if (!canModerate(role)) {
    return (
      <ReviewStatusMessage
        message="adminAccessRequired"
        signedInAs={user.email}
        role={role}
      />
    );
  }

  const { data: entries, error: entriesError } = await supabase
    .from("entries")
    .select(
      "id, slug, title, description, category, contributor, location, image_path, image_alt, introduction, steps, tips, contributor_story, created_at",
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (entriesError) {
    console.error("Could not load community submissions:", entriesError);
    return <ReviewStatusMessage message="reviewEntriesUnavailable" />;
  }

  return <ReviewQueue initialEntries={entries ?? []} />;
}
