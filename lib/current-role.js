/**
 * The role that governs the admin screens and the admin API routes.
 *
 * The database owns this decision. `public.current_profile_role()` is a
 * security-definer function that returns the signed-in account's role, and
 * migration 0015 makes it answer `'admin'` for the e-mail in
 * `public.super_admins` even when `profiles.role` was never updated. Reading the
 * function instead of the table means the archive owner cannot be locked out of
 * the review queue by a stale profile row — and because the same function backs
 * `is_admin()` / `is_editor()` in Row Level Security, the UI and the data agree.
 *
 * A plain `profiles` read is kept as a fallback for a database that predates the
 * function, so an older project still renders the right menus.
 */
export async function readCurrentRole(supabase, userId = null) {
  try {
    const { data, error } = await supabase.rpc("current_profile_role");

    if (!error) {
      return { role: typeof data === "string" ? data : null, error: null };
    }

    console.error("Could not read the current role from the database:", error);
  } catch (error) {
    console.error("Could not read the current role from the database:", error);
  }

  let id = userId;

  if (!id) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      id = user?.id ?? null;
    } catch (error) {
      console.error("Could not read the signed-in account:", error);
      return { role: null, error };
    }
  }

  if (!id) {
    return { role: null, error: null };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { role: null, error };
  }

  return { role: profile?.role ?? null, error: null };
}
