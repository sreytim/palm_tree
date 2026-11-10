-- ============================================================================
-- 0013 — remove the leftover "(sample)" markers from published entries
-- ============================================================================
-- The migrated examples carried the marker inside their own text: the location
-- read "Kampong Speu Province, Cambodia (sample)", and every contributor story
-- ended with "— as recalled by a community elder, sample entry." The archive now
-- presents that content as real archive material, so the marker is removed from
-- the data instead of being hidden in the interface.
--
-- `is_sample` is deliberately left alone: it is moderation metadata, nothing
-- displays it any more, and the generated `sort_order` column (migration 0008)
-- uses it to keep the migrated examples in their intended order.
--
-- Safe to re-run: both statements only touch rows that still carry a marker, so
-- a second run matches nothing.
-- ============================================================================

update public.entries
set location = nullif(
  btrim(regexp_replace(location, '\s*\(sample\)\s*$', '', 'i')),
  ''
)
where location ~* '\(sample\)\s*$';

update public.entries
set contributor_story = regexp_replace(
  contributor_story,
  ',\s*sample (entry|contributor)\.',
  '.',
  'gi'
)
where contributor_story ~* ',\s*sample (entry|contributor)\.';
