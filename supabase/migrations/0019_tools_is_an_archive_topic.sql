-- ============================================================================
-- 0019_tools_is_an_archive_topic.sql
-- ============================================================================
-- Why this file exists
--
-- The "tools" topic was marked scope 'gallery', but the archive entry
-- "The Tools of a Traditional Thatcher" uses it. The contribution validator
-- and the database trigger both accept only scope 'archive' topics, so editing
-- that entry (or submitting a new entry tagged Tools) was rejected with
-- "choose a topic" even though the topic exists.
--
-- Tools is a genuine archive subject, so this promotes it to the archive scope.
-- Idempotent; safe to run more than once.
--
-- HOW TO RUN
--   Supabase dashboard -> SQL editor -> paste this file -> Run.
-- ============================================================================

update public.topics
   set scope = 'archive'
 where slug = 'tools'
   and scope <> 'archive';
