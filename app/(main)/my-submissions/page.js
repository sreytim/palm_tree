import MySubmissions from "@/components/contribute/MySubmissions";
import { getCurrentUser } from "@/lib/auth-session";
import { SUBMISSION_COLUMNS, toSubmission } from "@/lib/entry-mapping";
import { createSupabaseServerClient } from "@/lib/supabase";

export const metadata = {
  title: "My submissions | Palm-Leaf Archive",
};

/**
 * The contributor's own submissions and their review status.
 *
 * Row Level Security (`entries_owner_read`) already limits the query to the
 * signed-in author's rows, so filtering by `owner` here is a convenience, not
 * the security boundary.
 */
export default async function MySubmissionsPage({ searchParams }) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { user, error: authError } = await getCurrentUser(supabase);

  if (authError) {
    console.error("Could not verify my-submissions session:", authError);
  }

  if (!user || authError) {
    return (
      <MySubmissions
        isAuthenticated={Boolean(user) && !authError}
        authFailed={Boolean(authError)}
        entries={[]}
        loadFailed={false}
        justSubmitted={false}
        justUpdated={false}
      />
    );
  }

  const { data: entries, error: entriesError } = await supabase
    .from("entries")
    .select(SUBMISSION_COLUMNS)
    .eq("owner", user.id)
    .order("created_at", { ascending: false });

  if (entriesError) {
    console.error("Could not load my submissions:", entriesError);
  }

  return (
    <MySubmissions
      isAuthenticated
      authFailed={false}
      entries={entriesError ? [] : (entries ?? []).map(toSubmission)}
      loadFailed={Boolean(entriesError)}
      justSubmitted={params?.submitted === "1"}
      justUpdated={params?.updated === "1"}
    />
  );
}
