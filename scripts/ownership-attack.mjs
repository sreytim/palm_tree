import { createClient } from "@supabase/supabase-js";

const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SPRINT2_ACCOUNT_A_EMAIL",
  "SPRINT2_ACCOUNT_A_PASSWORD",
  "SPRINT2_ACCOUNT_B_EMAIL",
  "SPRINT2_ACCOUNT_B_PASSWORD",
];
const missing = requiredEnv.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

function makeClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    },
  );
}

const accountA = makeClient();
const accountB = makeClient();

const { error: accountAError } = await accountA.auth.signInWithPassword({
  email: process.env.SPRINT2_ACCOUNT_A_EMAIL,
  password: process.env.SPRINT2_ACCOUNT_A_PASSWORD,
});
if (accountAError) {
  console.error("Account A could not sign in.");
  process.exit(1);
}

const {
  data: { user: userB },
  error: accountBError,
} = await accountB.auth.signInWithPassword({
  email: process.env.SPRINT2_ACCOUNT_B_EMAIL,
  password: process.env.SPRINT2_ACCOUNT_B_PASSWORD,
});
if (accountBError || !userB) {
  console.error("Account B could not sign in.");
  process.exit(1);
}

const { data: target, error: targetError } = await accountB
  .from("entries")
  .select("id, title, status")
  .eq("owner", userB.id)
  .eq("is_sample", false)
  .limit(1)
  .maybeSingle();

if (targetError || !target) {
  console.error(
    "Account B needs one non-sample entry before the ownership attack can run.",
  );
  process.exit(1);
}

const attemptedTitle = `Unauthorized ownership attack ${Date.now()}`;
const updateAttempt = await accountA
  .from("entries")
  .update({ title: attemptedTitle })
  .eq("id", target.id)
  .select("id")
  .maybeSingle();
const deleteAttempt = await accountA
  .from("entries")
  .delete()
  .eq("id", target.id)
  .select("id")
  .maybeSingle();

const updateRefused = Boolean(updateAttempt.error) || updateAttempt.data === null;
const deleteRefused = Boolean(deleteAttempt.error) || deleteAttempt.data === null;
if (!updateRefused || !deleteRefused) {
  console.error("FAIL: account A changed or deleted account B's entry.");
  process.exit(1);
}

const { data: unchanged, error: verificationError } = await accountB
  .from("entries")
  .select("id, title, status")
  .eq("id", target.id)
  .maybeSingle();

if (
  verificationError ||
  !unchanged ||
  unchanged.title !== target.title ||
  unchanged.status !== target.status
) {
  console.error("FAIL: account B's entry changed after the refused attacks.");
  process.exit(1);
}

console.log("PASS: account A's update returned no changed row.");
console.log("PASS: account A's delete returned no deleted row.");
console.log("PASS: account B's entry is unchanged after reload.");
