-- ============================================================================
-- 0003_storage.sql — media bucket
-- ============================================================================
-- Path convention mirrors the existing `public/images/*` folders, so the
-- registry in `lib/images.js` becomes a lookup rather than a rewrite:
--   archive/  stories/  gallery/  techniques/  categories/  process/  hero/
--
-- Only the path (e.g. 'archive/roof-covering.jpg') is stored in the database;
-- the public URL is derived in one place in the app.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'archive-media',
  'archive-media',
  true,
  10485760,   -- 10 MB
  array['image/jpeg','image/png','image/webp','image/gif','image/svg+xml']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- public read ---------------------------------------------------------------
drop policy if exists archive_media_public_read on storage.objects;
create policy archive_media_public_read on storage.objects
  for select using (bucket_id = 'archive-media');

-- editorial writes ----------------------------------------------------------
drop policy if exists archive_media_editor_insert on storage.objects;
create policy archive_media_editor_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'archive-media' and public.is_editor());

drop policy if exists archive_media_editor_update on storage.objects;
create policy archive_media_editor_update on storage.objects
  for update to authenticated
  using (bucket_id = 'archive-media' and public.is_editor())
  with check (bucket_id = 'archive-media' and public.is_editor());

drop policy if exists archive_media_editor_delete on storage.objects;
create policy archive_media_editor_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'archive-media' and public.is_editor());