import { createBrowserClient } from "@supabase/ssr";
import { isRecoveryPath } from "@/lib/password-recovery";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// The password recovery page redeems its one-time code with the dedicated
// recovery client (see lib/supabase-recovery-client.js). Detecting the session
// in the URL here as well would put two clients in a race for the same
// single-use code, and could sign the user in with the application session.
const detectSessionInUrl = !isRecoveryPath(
  typeof window === "undefined" ? "" : window.location.pathname,
);

export const supabase = createBrowserClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    detectSessionInUrl,
  },
});
