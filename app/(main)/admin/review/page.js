import { redirect } from "next/navigation";
import ReviewQueue from "@/components/admin/ReviewQueue";
import ReviewStatusMessage from "@/components/admin/ReviewStatusMessage";
import { getCurrentUser } from "@/lib/auth-session";
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

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Could not verify review permissions:", profileError);
    return <ReviewStatusMessage message="reviewPermissionUnavailable" />;
  }

  if (!["editor", "admin"].includes(profile?.role)) {
    return <ReviewStatusMessage message="editorAccessRequired" />;
  }

  const { data: entries, error: entriesError } = await supabase
    .from("entries")
    .select(
      "id, slug, title, description, category, location, image_path, image_alt, introduction, steps, tips, contributor_story, created_at",
    )
    .eq("status", "draft")
    .order("created_at", { ascending: true });

  if (entriesError) {
    console.error("Could not load community submissions:", entriesError);
    return <ReviewStatusMessage message="reviewEntriesUnavailable" />;
  }

  return <ReviewQueue initialEntries={entries ?? []} />;
}
