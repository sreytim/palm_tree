import ContributionPageContent from "@/components/contribute/ContributionPageContent";
import { getCurrentUser } from "@/lib/auth-session";
import { createSupabaseServerClient } from "@/lib/supabase";

export default async function ContributePage() {
  const supabase = await createSupabaseServerClient();
  const { user, error } = await getCurrentUser(supabase);

  if (error) {
    console.error("Could not verify contribution page session:", error);
  }

  let hasContributorRole = false;
  let roleCheckFailed = false;
  if (user && !error) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Could not verify contribution role:", profileError);
      roleCheckFailed = true;
    } else {
      hasContributorRole = ["contributor", "editor", "admin"].includes(
        profile?.role,
      );
    }
  }

  return (
    <ContributionPageContent
      isAuthenticated={Boolean(user)}
      hasContributorRole={hasContributorRole}
      authCheckFailed={Boolean(error)}
      roleCheckFailed={roleCheckFailed}
    />
  );
}
