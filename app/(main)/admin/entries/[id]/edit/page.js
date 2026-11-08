import { notFound, redirect } from "next/navigation";
import ReviewStatusMessage from "@/components/admin/ReviewStatusMessage";
import SubmissionEditor from "@/components/contribute/SubmissionEditor";
import { getCurrentUser } from "@/lib/auth-session";
import {
  EDITABLE_ENTRY_COLUMNS,
  toContributionForm,
} from "@/lib/entry-mapping";
import { canManageEntries, isEntryId } from "@/lib/submission-status";
import { createSupabaseServerClient } from "@/lib/supabase";

export const metadata = {
  title: "Edit entry | Palm-Leaf Archive",
};

/**
 * The archive team corrects any entry, whatever its status. The form PATCHes
 * `/api/entries/[id]`, which allows editors and admins to edit every row.
 */
export default async function AdminEditEntryPage({ params }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { user, error: authError } = await getCurrentUser(supabase);

  if (authError) {
    console.error("Could not verify admin edit session:", authError);
    return <ReviewStatusMessage message="reviewUnavailable" />;
  }

  if (!user) {
    redirect(`/login?next=%2Fadmin%2Fentries%2F${encodeURIComponent(id)}%2Fedit`);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Could not verify admin edit permissions:", profileError);
    return <ReviewStatusMessage message="reviewPermissionUnavailable" />;
  }

  if (!canManageEntries(profile?.role)) {
    return <ReviewStatusMessage message="editorAccessRequired" />;
  }

  if (!isEntryId(id)) {
    notFound();
  }

  const { data: entry, error: entryError } = await supabase
    .from("entries")
    .select(EDITABLE_ENTRY_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (entryError) {
    console.error("Could not load the entry being edited:", entryError);
    notFound();
  }

  if (!entry) {
    notFound();
  }

  return (
    <SubmissionEditor
      entryId={entry.id}
      initialEntry={toContributionForm(entry)}
      status={entry.status}
      reviewNote={entry.review_note}
      headingKey="editEntry"
      hintKey="editEntryHint"
      backHref="/admin/entries"
      backLabelKey="manageEntries"
      redirectTo="/admin/entries"
    />
  );
}
