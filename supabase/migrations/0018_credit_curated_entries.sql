-- ============================================================================
-- 0018_credit_curated_entries.sql
-- ============================================================================
-- Why this file exists
--
-- The eight curated entries were seeded with an empty `contributor` column.
-- The public entry page only renders a "Contributor" line when that column has
-- a value, so readers saw the location and date but no source credit at all.
--
-- The catalogue in `data/entry-content.js` now carries bilingual, role-based
-- attribution (never an invented person: "Community Elder Interview",
-- "Family interview with the contributor's uncle", "Household visit and
-- interview"). This script fills the same attribution into the database so the
-- admin screens, the API and the public entry all agree.
--
-- It only fills blanks: an entry whose contributor was already written is left
-- alone. Safe to run more than once.
--
-- HOW TO RUN
--   Supabase dashboard -> SQL editor -> paste this file -> Run.
-- ============================================================================

update public.entries
   set contributor = 'Community Elder Interview'
 where slug in (
   'preparing-palm-leaves-for-house-covering',
   'the-cross-weave-pattern',
   'tying-panels-to-the-roof-frame',
   'seasonal-roof-repair',
   'drying-technique-for-longer-lasting-panels',
   'the-tools-of-a-traditional-thatcher'
 )
   and (contributor is null or btrim(contributor) = '');

update public.entries
   set contributor = 'Family Interview, Contributor''s Uncle'
 where slug = 'raising-the-roof-frame'
   and (contributor is null or btrim(contributor) = '');

update public.entries
   set contributor = 'Household Visit and Interview'
 where slug = 'the-family-house-in-kampong-speu'
   and (contributor is null or btrim(contributor) = '');
