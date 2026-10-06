function isMissingSessionError(error) {
  return (
    error?.name === "AuthSessionMissingError" ||
    error?.code === "session_not_found"
  );
}

export async function getCurrentUser(supabase) {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (isMissingSessionError(error)) {
      return { user: null, error: null };
    }

    return { user: user ?? null, error };
  } catch (error) {
    if (isMissingSessionError(error)) {
      return { user: null, error: null };
    }

    return { user: null, error };
  }
}
