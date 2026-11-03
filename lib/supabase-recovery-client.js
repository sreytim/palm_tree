import { createBrowserClient } from "@supabase/ssr";
import { getRecoveryStorageKey } from "@/lib/password-recovery";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// A client of its own for the password recovery flow.
//
// The recovery link carries a one-time code that Supabase exchanges for a
// session. When that exchange happens on the archive's own client, the
// session is written to the archive's session cookie and the user is signed
// in to the whole archive - the recovery link behaves like a magic link.
//
// This client keeps the recovery session in its own storage key, so it lands
// in a separate cookie that the archive never reads. The recovery link can
// therefore only ever unlock the "set a new password" form.
export const recoverySupabase = createBrowserClient(
  supabaseUrl,
  supabasePublishableKey,
  {
    // The archive client is a cached singleton; this one must stay separate
    // from it, so it opts out of the singleton cache.
    isSingleton: false,
    auth: {
      storageKey: getRecoveryStorageKey(supabaseUrl),
      // The reset page redeems the code explicitly so it can report an
      // invalid or expired link instead of silently ignoring it.
      detectSessionInUrl: false,
      autoRefreshToken: false,
    },
  },
);
