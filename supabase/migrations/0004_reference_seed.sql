-- ============================================================================
-- 0004_reference_seed.sql — topics, categories and people
-- ============================================================================
-- The small, stable vocabularies. Applied as SQL rather than through the app
-- seed route because they are reference data: reviewable by eye and unlikely to
-- change often. Content (entries, stories, steps, gallery images) and the join
-- rows are loaded by the seed route, which imports `data/*.js`.
--
-- Khmer values are copied verbatim from `lang/i18n.js` so nothing is retyped.
-- Re-runnable: every statement is an upsert on the natural key.
-- ============================================================================

-- archive categories: one per entry ------------------------------------------
insert into public.archive_categories (id, name_en, name_km, sort_order) values
  ('palm-leaf-preparation',  'Palm Leaf Preparation',  'ការរៀបចំស្លឹកត្នោត',        1),
  ('weaving-techniques',     'Weaving Techniques',     'បច្ចេកទេសត្បាញ',            2),
  ('house-construction',     'House Construction',     'ការសាងសង់ផ្ទះ',            3),
  ('attachment-techniques',  'Attachment Techniques',  'បច្ចេកទេសភ្ជាប់',           4),
  ('maintenance-repair',     'Maintenance & Repair',   'ការថែទាំ និងជួសជុល',       5),
  ('traditional-houses',     'Traditional Houses',     'ផ្ទះប្រពៃណី',               6)
on conflict (id) do update
  set name_en    = excluded.name_en,
      name_km    = excluded.name_km,
      sort_order = excluded.sort_order;

-- people: contributors --------------------------------------------------------
insert into public.people (id, slug, name, role, attribution_label) values
  ('person-01', 'yeay-sokha',  'Yeay Sokha (sample name)',  'weaver',               null),
  ('person-02', 'ta-sarun',    'Ta Sarun (sample name)',    'householder',          null),
  ('person-03', 'srey-neang',  'Srey Neang (sample name)',  'weaver',               null),
  ('person-04', 'ta-vibol',    'Ta Vibol (sample name)',    'carpenter',            null),
  ('person-community-elder',  'community-elder',   null, 'anonymous-contributor', 'Community Elder Interview'),
  ('person-family-uncle',     'family-uncle',      null, 'anonymous-contributor', 'Family Interview, Contributor''s Uncle'),
  ('person-household-visit',  'household-visit',   null, 'anonymous-contributor', 'Household Visit and Interview'),
  ('person-sample-archive',   'sample-archive-entry',   null, 'sample', 'Sample Archive Entry'),
  ('person-sample-household', 'sample-household-visit', null, 'sample', 'Household Visit, Sample Entry')
on conflict (id) do update
  set slug              = excluded.slug,
      name              = excluded.name,
      role              = excluded.role,
      attribution_label = excluded.attribution_label;

-- topics: the shared subject vocabulary --------------------------------------
-- The primary key is the slug, which is the value every relation already uses,
-- so no slug-to-id mapping is needed when the content is seeded.
-- The eight 'archive' topics carry the descriptions that used to live on the
-- archive entries; the eight 'gallery' topics had no Khmer translation before
-- and still have none.
insert into public.topics (slug, legacy_id, name_en, name_km, scope, description_en, sort_order) values
  ('palm-leaf-houses', 'topic-palm-leaf-houses', 'Palm-Leaf Houses', 'ផ្ទះប្រក់ស្លឹកត្នោត', 'archive',
   'Explore traditional Khmer houses that use palm leaves as a natural material for roofing and walls.', 1),
  ('roof-covering', 'topic-roof-covering', 'Roof Covering', 'ការប្រក់ដំបូល', 'archive',
   'Discover how palm leaves are prepared, layered, and secured to create durable traditional roofing.', 2),
  ('wall-covering', 'topic-wall-covering', 'Wall Covering', 'ការបាំងជញ្ជាំង', 'archive',
   'Learn how palm leaves are woven, arranged, and attached to form natural walls that provide shade and ventilation.', 3),
  ('palm-leaf-preparation', 'topic-palm-leaf-preparation', 'Palm Leaf Preparation', 'ការរៀបចំស្លឹកត្នោត', 'archive',
   'Learn how palm leaves are selected, cut, dried, and prepared before being used for house construction.', 4),
  ('leaf-weaving', 'topic-leaf-weaving', 'Leaf Weaving', 'ការត្បាញស្លឹកត្នោត', 'archive',
   'Explore traditional methods of arranging, weaving, sewing, and binding palm leaves into usable panels.', 5),
  ('house-construction', 'topic-house-construction', 'House Construction', 'ការសាងសង់ផ្ទះ', 'archive',
   'Discover how prepared palm-leaf materials are attached to the wooden or bamboo structure of a traditional house.', 6),
  ('traditional-house-types', 'topic-traditional-house-types', 'Traditional House Types', 'ប្រភេទផ្ទះបែបប្រពៃណី', 'archive',
   'Explore different forms of traditional houses that incorporate palm leaves as part of their construction and covering.', 7),
  ('maintenance-repair', 'topic-maintenance-repair', 'Maintenance & Repair', 'ការថែទាំ និងជួសជុល', 'archive',
   'Learn traditional ways of maintaining, replacing, and repairing palm-leaf roofs and walls to extend their use.', 8),
  ('palm-leaves', 'topic-palm-leaves', 'Palm Leaves', null, 'gallery', null, 9),
  ('traditional-houses', 'topic-traditional-houses', 'Traditional Houses', null, 'gallery', null, 10),
  ('tools', 'topic-tools', 'Tools', null, 'gallery', null, 11),
  ('weaving', 'topic-weaving', 'Weaving', null, 'gallery', null, 12),
  ('preparing-leaves', 'topic-preparing-leaves', 'Preparing Leaves', null, 'gallery', null, 13),
  ('attaching-palm-leaves', 'topic-attaching-palm-leaves', 'Attaching Palm Leaves', null, 'gallery', null, 14),
  ('finished-houses', 'topic-finished-houses', 'Finished Houses', null, 'gallery', null, 15),
  ('community-members', 'topic-community-members', 'Community Members', null, 'gallery', null, 16)
on conflict (slug) do update
  set legacy_id      = excluded.legacy_id,
      name_en        = excluded.name_en,
      name_km        = excluded.name_km,
      scope          = excluded.scope,
      description_en = excluded.description_en,
      sort_order     = excluded.sort_order;

-- Merge candidates for later editorial work, recorded here so the intent is not
-- lost: "Traditional House Types"/"Traditional Houses", "Leaf Weaving"/"Weaving",
-- "Palm Leaf Preparation"/"Preparing Leaves"/"Palm Leaves",
-- "Palm-Leaf Houses"/"Finished Houses".