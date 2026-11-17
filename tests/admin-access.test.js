import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { ROLE_LABEL_KEYS, roleLabelKey } from "../lib/submission-status.js";

/**
 * Admin access is decided in three places that must agree:
 *   - the database role function used by Row Level Security,
 *   - the app's role lookup (header, admin pages, admin API routes),
 *   - the allow list that marks the archive owner.
 *
 * When those drift apart the owner signs in as a contributor: no admin menu,
 * "admin access required" on the review queue, and pending rows hidden by RLS.
 * These tests pin the repair that keeps them in step.
 */
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const repair = read("supabase/migrations/0015_admin_access_repair.sql");
const helpers = read("supabase/migrations/0002_rls.sql");
const workflow = read("supabase/migrations/0012_community_contributor_workflow.sql");
const currentRole = read("lib/current-role.js");

const adminReaders = [
  "app/(main)/admin/review/page.js",
  "app/(main)/admin/entries/page.js",
  "app/(main)/admin/users/page.js",
  "app/api/admin/contributions/route.js",
  "app/api/admin/users/route.js",
];

test("the owner e-mail stays in the allow list", () => {
  for (const source of [workflow, repair]) {
    assert.match(
      source,
      /values \('sreytimt@gmail\.com'/,
      "the archive owner e-mail is no longer allow-listed",
    );
    assert.match(source, /on conflict \(email\) do nothing/);
  }
});

test("repair keeps new sign-ups and existing accounts in step", () => {
  // Sign-up trigger: admin for the allow-listed e-mail, contributor otherwise.
  assert.match(repair, /create or replace function public\.handle_new_user\(\)/);
  assert.match(repair, /from public\.super_admins s where s\.email = lower\(new\.email\)/);
  assert.match(repair, /then 'admin'/);
  assert.match(repair, /else 'contributor'/);
  assert.match(repair, /create trigger on_auth_user_created/);

  // Accounts whose profile row never existed get one.
  assert.match(
    repair,
    /insert into public\.profiles \(id, display_name, role\)\s+select u\.id,/,
  );
  assert.match(
    repair,
    /where not exists \(select 1 from public\.profiles p where p\.id = u\.id\)/,
  );

  // Existing owner profiles are promoted.
  assert.match(repair, /update public\.profiles p\s+set role = 'admin'/);
  assert.match(repair, /join public\.super_admins s on s\.email = lower\(u\.email\)/);
});

test("the role function answers admin for the allow-listed account", () => {
  assert.match(
    repair,
    /create or replace function public\.current_profile_role\(\)/,
  );
  // The allow list is consulted before the stored profile role.
  assert.match(repair, /join public\.super_admins s on s\.email = lower\(u\.email\)/);
  assert.match(repair, /then 'admin'\s+else \(select p\.role from public\.profiles p/);
  // Same signature as 0002, so every existing policy keeps calling it.
  assert.match(repair, /returns text\s+language sql\s+security definer/);
});

test("editors and admins both read pending rows through RLS", () => {
  // is_editor() must include admin, otherwise the owner sees an empty queue.
  assert.match(
    helpers,
    /select coalesce\(public\.current_profile_role\(\) in \('editor','admin'\), false\)/,
  );
  assert.match(
    workflow,
    /create policy entries_editor_read on public\.entries\s+for select to authenticated\s+using \(public\.is_editor\(\)\)/,
  );
  assert.match(
    workflow,
    /create policy entries_admin_update on public\.entries\s+for update to authenticated\s+using \(public\.is_admin\(\)\)/,
  );
});

test("the app reads the role from the database function, not the table", () => {
  assert.match(currentRole, /rpc\("current_profile_role"\)/);
  // A profiles read stays as a fallback for databases without the function.
  assert.match(currentRole, /\.from\("profiles"\)\s*\.select\("role"\)/);
});

test("every admin screen and admin API route uses the shared role lookup", () => {
  for (const path of adminReaders) {
    const source = read(path);

    assert.match(
      source,
      /readCurrentRole/,
      `${path} does not use readCurrentRole`,
    );
    assert.doesNotMatch(
      source,
      /\.from\("profiles"\)\s*[\s\S]{0,80}\.select\("role"\)/,
      `${path} still reads profiles.role directly`,
    );
  }
});

test("a refused admin screen names the signed-in account and role", () => {
  const message = read("components/admin/ReviewStatusMessage.js");

  assert.match(message, /signedInAs/);
  assert.match(message, /roleLabelKey/);
  for (const path of [
    "app/(main)/admin/review/page.js",
    "app/(main)/admin/users/page.js",
  ]) {
    assert.match(read(path), /signedInAs=\{user\.email\}/, `${path} hides the account`);
  }
});

test("role labels resolve for every role and for a missing one", () => {
  for (const role of ["reader", "contributor", "editor", "admin"]) {
    assert.ok(ROLE_LABEL_KEYS[role], `${role} has no label key`);
    assert.equal(roleLabelKey(role), ROLE_LABEL_KEYS[role]);
  }
  assert.equal(roleLabelKey(null), "roleUnknown");
  assert.equal(roleLabelKey("something-else"), "roleUnknown");
});
