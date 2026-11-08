import { redirect } from "next/navigation";
import AdminUsers from "@/components/admin/AdminUsers";
import ReviewStatusMessage from "@/components/admin/ReviewStatusMessage";
import { getCurrentUser } from "@/lib/auth-session";
import { isAdminRole } from "@/lib/submission-status";
import { createSupabaseServerClient } from "@/lib/supabase";

export const metadata = {
  title: "Manage accounts | Palm-Leaf Archive",
};

/**
 * Account roles. Admin only: editors moderate content, but who is allowed to
 * moderate is the archive owner's decision. The database trigger
 * `prevent_profile_role_escalation` repeats this rule server-side.
 */
export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();
  const { user, error: authError } = await getCurrentUser(supabase);

  if (authError) {
    console.error("Could not verify manage-accounts session:", authError);
    return <ReviewStatusMessage message="reviewUnavailable" />;
  }

  if (!user) {
    redirect("/login?next=%2Fadmin%2Fusers");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Could not verify manage-accounts permissions:", profileError);
    return <ReviewStatusMessage message="reviewPermissionUnavailable" />;
  }

  if (!isAdminRole(profile?.role)) {
    return <ReviewStatusMessage message="adminAccessRequired" />;
  }

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, display_name, role, created_at")
    .order("created_at", { ascending: false });

  if (profilesError) {
    console.error("Could not load the account list:", profilesError);
    return <ReviewStatusMessage message="reviewEntriesUnavailable" />;
  }

  return <AdminUsers initialProfiles={profiles ?? []} currentUserId={user.id} />;
}
