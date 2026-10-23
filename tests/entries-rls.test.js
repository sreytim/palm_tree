import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = (name) =>
  readFileSync(new URL(`../supabase/migrations/${name}`, import.meta.url), "utf8");

const schema = migration("0005_community_contributions.sql");
const publicRead = migration("0008_public_published_entries.sql");
const ownerWrites = migration("0009_owner_entry_write_policies.sql");

const policy = (sql, name) =>
  sql.match(
    new RegExp(`create policy ${name} on public\\.entries([\\s\\S]*?);`),
  )?.[1] ?? "";

test("entries owner references auth.users and RLS is enabled", () => {
  assert.match(schema, /owner\s+uuid not null references auth\.users\s*\(id\)/);
  assert.match(schema, /alter table public\.entries enable row level security/);
});

test("anonymous users can select published entries only", () => {
  assert.match(
    policy(publicRead, "entries_public_published"),
    /for select to anon, authenticated\s+using \(status = 'published'\)/,
  );
});

test("writes require authentication and the matching auth.uid owner", () => {
  assert.match(policy(ownerWrites, "entries_owner_insert"), /for insert to authenticated/);
  assert.match(policy(ownerWrites, "entries_owner_insert"), /owner = \(select auth\.uid\(\)\)/);

  const update = policy(ownerWrites, "entries_owner_update");
  assert.match(update, /for update to authenticated/);
  assert.match(update, /using \(owner = \(select auth\.uid\(\)\)\)/);
  assert.match(update, /with check \(owner = \(select auth\.uid\(\)\)\)/);

  assert.match(
    policy(ownerWrites, "entries_owner_delete"),
    /for delete to authenticated\s+using \(owner = \(select auth\.uid\(\)\)\)/,
  );
});

test("anonymous writes are revoked and editorial fields remain protected", () => {
  assert.match(
    ownerWrites,
    /revoke insert, update, delete on table public\.entries from anon, public/,
  );
  assert.match(ownerWrites, /new\.status is distinct from old\.status/);
  assert.match(ownerWrites, /new\.is_sample is distinct from old\.is_sample/);
  assert.match(ownerWrites, /new\.featured is distinct from old\.featured/);
  assert.doesNotMatch(ownerWrites, /create policy entries_editor_(?:update|delete)/);
});
