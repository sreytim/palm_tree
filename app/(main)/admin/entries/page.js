import { redirect } from "next/navigation";
import AdminEntries from "@/components/admin/AdminEntries";
import ReviewStatusMessage from "@/components/admin/ReviewStatusMessage";
import { getCurrentUser } from "@/lib/auth-session";
import { SUBMISSION_COLUMNS, toSubmission } from "@/lib/entry-mapping";
import { canManageEntries } from "@/lib/submission-status";
import { createSupabaseServerClient } from "@/lib/supabase";

export const metadata = {
  title: "Manage entries | Palm-Leaf Archive",
};

/**
 * The archive team's entry manager. Editors see every submission and can
 * moderate it; admins additionally feature and delete any entry, including
 * published ones. Row Level Security enforces the same split.
 */
export default async function AdminEntriesPage({ searchParams }) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { user, error: authError } = await getCurrentUser(supabase);

  if (authError) {
    console.error("Could not verify manage-entries session:", authError);
    return <ReviewStatusMessage message="reviewUnavailable" />;
  }

  if (!user) {
    redirect("/login?next=%2Fadmin%2Fentries");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Could not verify manage-entries permissions:", profileError);
    return <ReviewStatusMessage message="reviewPermissionUnavailable" />;
  }

  if (!canManageEntries(profile?.role)) {
    return <ReviewStatusMessage message="editorAccessRequired" />;
  }

  const { data: entries, error: entriesError } = await supabase
    .from("entries")
    .select(SUBMISSION_COLUMNS)
    .order("created_at", { ascending: false });

  if (entriesError) {
    console.error("Could not load entries for management:", entriesError);
    return <ReviewStatusMessage message="reviewEntriesUnavailable" />;
  }

  return (
    <AdminEntries
      initialEntries={(entries ?? []).map(toSubmission)}
      role={profile?.role ?? "editor"}
      justUpdated={params?.updated === "1"}
    />
  );
}
