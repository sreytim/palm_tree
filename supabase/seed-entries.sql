-- ============================================================================
-- Lab 6, Part 2 — seed data for the entries table
-- Source: data/archive.js (8 entries, one statement per entry)
--
-- HOW TO RUN
--   1. Run supabase/create-entries.sql first — this inserts into that table.
--   2. Paste this file into the Supabase SQL editor.
--   3. Find-and-replace PASTE-YOUR-UUID-HERE with your user uuid
--      (Dashboard -> Authentication -> Users) — all 8 rows use it.
--   4. Run it. Then check:  select count(*) from entries;   -- expect 8
--
-- The uuid is deliberately not stored here: Lab 6 Part 4 checks that the user
-- uuid is not exposed in committed files, and this file is committed.
--
-- FIELD MAPPING from the data file
--   slug, title, description, category, contributor, location, introduction
--   image            -> image_path
--   imageAlt         -> image_alt
--   date             -> entry_date
--   topicSlugs       -> topic_slugs (text[]; first element is the headline topic)
--   steps, tips      -> jsonb (array of {title, description} / array of strings)
--   contributorStory -> contributor_story
--   isSample         -> is_sample
--   status is set to 'published' explicitly, so the rows stay readable if the
--   read policy is later tightened from "using (true)" to published-only.
--   id, created_at and updated_at are omitted, so their defaults apply.
--
-- NOT MAPPED — data-file fields with no column in entries:
--   id (arch-01…, superseded by the generated uuid)
--   primaryTopicSlug (equals topic_slugs[0] by construction)
--   personId, techniqueStepIds, galleryIds, relatedImages (16 image rows)
-- These belong to the wider schema in supabase/migrations/ (see 0001_schema.sql).
-- ============================================================================

-- arch-01: Preparing Palm Leaves for House Covering
insert into entries (owner, slug, title, description, category, topic_slugs, contributor, location, entry_date, image_path, image_alt, introduction, steps, tips, contributor_story, featured, is_sample, status)
values (
  'PASTE-YOUR-UUID-HERE',
  'preparing-palm-leaves-for-house-covering',
  'Preparing Palm Leaves for House Covering',
  'Before a single leaf touches the frame of a roof, it passes through many hands.',
  'Palm Leaf Preparation',
  '{palm-leaf-houses,palm-leaf-preparation}'::text[],
  'Community Elder Interview',
  'Kampong Speu Province, Cambodia (sample)',
  'March 2024',
  '/palm_leaf_houses.png',
  'Bundles of palm leaves laid out to prepare for house covering',
  'Before a single leaf touches the frame of a roof, it passes through many hands. This entry documents the preparation stage as described by a community elder who learned the technique from her mother in the 1960s. Preparation is considered the foundation of a durable roof — leaves that are poorly chosen or poorly dried will not last a single rainy season.',
  '[{"title":"Selecting mature fronds","description":"Only fully mature, unopened palm fronds are chosen. Younger leaves are too soft and tear easily; leaves that are too old have already begun to dry unevenly on the tree and become brittle."},{"title":"Cutting in the early morning","description":"Fronds are cut early in the day, while the plant retains moisture and the leaf fibers are more flexible, making them easier to bundle and transport without cracking."},{"title":"Removing damaged leaflets","description":"Each frond is checked by hand. Leaflets that are torn, insect-damaged, or discolored are trimmed away so they do not weaken the finished panel."},{"title":"Bundling for transport","description":"Cleaned fronds are tied into loose bundles with a length of vine or rope, spine-side out, to prevent the delicate leaflets from being crushed on the way back to the household."}]'::jsonb,
  '["Leaves cut during the dry season are said to hold their shape longer once woven.","A frond that springs back after being gently bent is considered ready; one that stays folded is too old."]'::jsonb,
  '"My mother would wake before sunrise during harvest weeks. She always said the leaf remembers how it was cut — if you tear it in anger, it will tear again on the roof." — as recalled by a community elder, sample contributor.',
  true,
  true,
  'published'
);

-- arch-02: The Cross-Weave Pattern
insert into entries (owner, slug, title, description, category, topic_slugs, contributor, location, entry_date, image_path, image_alt, introduction, steps, tips, contributor_story, featured, is_sample, status)
values (
  'PASTE-YOUR-UUID-HERE',
  'the-cross-weave-pattern',
  'The Cross-Weave Pattern',
  'The cross-weave is the technique most families in this community used to bind loose leaflets into a single rigid panel strong enough to shed monsoon rain.',
  'Weaving Techniques',
  '{roof-covering,leaf-weaving}'::text[],
  'Community Elder Interview',
  'Takeo Province, Cambodia (sample)',
  'April 2024',
  '/roof_covering.jpg',
  'Detail of a woven palm leaf roofing panel showing the cross pattern',
  'The cross-weave is the technique most families in this community used to bind loose leaflets into a single rigid panel strong enough to shed monsoon rain. This entry breaks the weave into its component folds, as demonstrated by a retired thatcher during a recorded interview.',
  '[{"title":"Folding over the spine","description":"Each leaflet is folded over a central bamboo or wood spine so that two even lengths of leaf hang on either side."},{"title":"Crossing alternate leaflets","description":"Working down the spine, alternating leaflets are crossed over one another, left over right, then right over left, to lock them in place without any binding."},{"title":"Compressing the weave","description":"After every few crossings, the weaver presses the leaflets tightly together by hand so that no gaps remain for water to pass through."},{"title":"Securing the row","description":"A thin strip of split rattan or vine is threaded along the base of the row to hold the completed section firm before it is set aside to dry flat."}]'::jsonb,
  '["A tighter weave near the base of each panel helps prevent pooling water where roof rows will later overlap.","Weaving is traditionally done in the shade to keep the leaves pliable for longer."]'::jsonb,
  '"It took me two rainy seasons of watching before my hands understood the rhythm. My grandmother never explained it in words — she just wove, and I copied." — as recalled by a community contributor, sample entry.',
  true,
  true,
  'published'
);

-- arch-03: Raising the Roof Frame
insert into entries (owner, slug, title, description, category, topic_slugs, contributor, location, entry_date, image_path, image_alt, introduction, steps, tips, contributor_story, featured, is_sample, status)
values (
  'PASTE-YOUR-UUID-HERE',
  'raising-the-roof-frame',
  'Raising the Roof Frame',
  'A palm-leaf covering is only as good as the frame beneath it.',
  'House Construction',
  '{wall-covering,house-construction}'::text[],
  'Family Interview, Contributor''s Uncle',
  'Kampong Chhnang Province, Cambodia (sample)',
  'May 2024',
  '/wall_covering.jpg',
  'Bamboo frame of a traditional house under construction',
  'A palm-leaf covering is only as good as the frame beneath it. This entry documents how one family in the community describes the traditional timber and bamboo frame used to support a steep, water-shedding roof pitch.',
  '[{"title":"Setting the ridge beam","description":"A single long ridge beam is raised first, typically with the help of several neighbors, and leveled before any other framing begins."},{"title":"Placing the rafters","description":"Rafters are spaced evenly from the ridge down to the eaves, with spacing narrow enough to support the woven panels without sagging."},{"title":"Adding horizontal purlins","description":"Thinner bamboo purlins run horizontally across the rafters, creating a grid that each palm-leaf panel will be tied onto."},{"title":"Checking the pitch","description":"The roof''s steep angle is checked by eye against a nearby completed house, since a shallow pitch causes water to sit rather than drain."}]'::jsonb,
  '["A steeper pitch is favored in areas with heavier rainy-season downpours.","Bamboo is often smoked over a low fire before use to discourage insects."]'::jsonb,
  '"When we raised our frame, half the village came to help lift the ridge beam. Nobody built alone — that was the tradition as much as the house itself." — as recalled by a family contributor, sample entry.',
  false,
  true,
  'published'
);

-- arch-04: Tying Panels to the Roof Frame
insert into entries (owner, slug, title, description, category, topic_slugs, contributor, location, entry_date, image_path, image_alt, introduction, steps, tips, contributor_story, featured, is_sample, status)
values (
  'PASTE-YOUR-UUID-HERE',
  'tying-panels-to-the-roof-frame',
  'Tying Panels to the Roof Frame',
  'Attaching the panels is done in careful, overlapping rows, always starting at the eaves and working toward the ridge.',
  'Attachment Techniques',
  '{palm-leaf-preparation,roof-covering}'::text[],
  'Community Elder Interview',
  'Kampong Speu Province, Cambodia (sample)',
  'May 2024',
  '/palm_leaf_preparation.jpg',
  'Woven palm leaf panels being tied to a roof frame',
  'Attaching the panels is done in careful, overlapping rows, always starting at the eaves and working toward the ridge, so that each higher row sheds water over the row below it — the same principle used with modern shingles.',
  '[{"title":"Aligning the first row","description":"The bottom row of panels is aligned along the eave, overhanging slightly to direct rainwater away from the walls below."},{"title":"Lashing to the purlins","description":"Each panel is lashed to the bamboo purlins with split rattan or rope, tied at consistent intervals along the spine of the panel."},{"title":"Overlapping each new row","description":"Every subsequent row is laid to overlap roughly one-third to one-half of the row beneath it, doubling the water-shedding layer at every seam."},{"title":"Capping the ridge","description":"At the very top, panels are folded and lashed over the ridge beam itself, sealing the peak where two roof slopes meet."}]'::jsonb,
  '["Consistent overlap between rows matters more than the total number of panels used.","Ridge capping is often reinforced yearly, since it takes the most direct sun and rain exposure."]'::jsonb,
  '"My father always tied the ridge himself. He said if the top failed, everything below it failed too, no matter how well it was woven." — as recalled by a community elder, sample entry.',
  true,
  true,
  'published'
);

-- arch-05: Seasonal Roof Repair
insert into entries (owner, slug, title, description, category, topic_slugs, contributor, location, entry_date, image_path, image_alt, introduction, steps, tips, contributor_story, featured, is_sample, status)
values (
  'PASTE-YOUR-UUID-HERE',
  'seasonal-roof-repair',
  'Seasonal Roof Repair',
  'A well-built palm-leaf roof can last several years, but it is rarely left untouched.',
  'Maintenance & Repair',
  '{leaf-weaving,maintenance-repair}'::text[],
  'Community Elder Interview',
  'Takeo Province, Cambodia (sample)',
  'June 2024',
  '/leaf_weaving.jpg',
  'A person repairing a section of a palm leaf roof',
  'A well-built palm-leaf roof can last several years, but it is rarely left untouched. This entry documents the yearly inspection and repair ritual described by a longtime resident, usually carried out in the weeks before the rainy season begins.',
  '[{"title":"Inspecting from inside","description":"On a sunny day, the household checks the underside of the roof for any small points of light, which mark spots where leaves have thinned or cracked."},{"title":"Marking weak panels","description":"Weak spots are marked with a loose knot of grass or cloth so they can be found again once the family is back outside."},{"title":"Weaving patch panels","description":"Small replacement panels are woven using the same cross-weave technique, sized to match the section being replaced."},{"title":"Re-lashing the patch","description":"The old, damaged section is untied, removed, and the new patch is lashed into place using the same overlap principle as the original installation."}]'::jsonb,
  '["Repairs are best done in the dry season, when leaves are easier to source and weave.","Checking for light spots from inside the house is faster and more reliable than inspecting the roof from outside."]'::jsonb,
  '"Every year before the rains, my whole family spent a morning walking the house, finding the thin spots. It became a kind of yearly ritual, almost like a small celebration before the wet season began." — as recalled by a community elder, sample entry.',
  false,
  true,
  'published'
);

-- arch-06: The Family House in Kampong Speu
insert into entries (owner, slug, title, description, category, topic_slugs, contributor, location, entry_date, image_path, image_alt, introduction, steps, tips, contributor_story, featured, is_sample, status)
values (
  'PASTE-YOUR-UUID-HERE',
  'the-family-house-in-kampong-speu',
  'The Family House in Kampong Speu',
  'This entry documents a single household''s house as an example of a still-standing, actively maintained palm-leaf roof.',
  'Traditional Houses',
  '{house-construction,traditional-house-types}'::text[],
  'Household Visit and Interview',
  'Kampong Speu Province, Cambodia (sample)',
  'July 2024',
  '/house_construction.jpg',
  'A complete traditional house with a palm leaf roof, raised on wooden stilts',
  'This entry documents a single household''s house as an example of a still-standing, actively maintained palm-leaf roof. The house is raised on stilts, a common feature in the region that keeps the living space above seasonal floodwater and improves airflow beneath the covering.',
  '[{"title":"Elevated stilt structure","description":"The house stands roughly two meters above ground on hardwood stilts, with the space below used for storage, shade, and tools during the day."},{"title":"Open-sided living area","description":"Walls are partial or woven from lighter material, allowing air to move freely beneath the deep-pitched, palm-leaf roof above."},{"title":"Deep roof overhang","description":"The roof extends well beyond the walls on all sides, protecting the timber structure and interior from direct rain and sun."}]'::jsonb,
  '["Deep overhangs reduce how often the walls and stilts need to be treated or replaced.","Raised houses like this one are especially common in areas that flood seasonally."]'::jsonb,
  '"This roof has covered three generations of my family. We have replaced sections of it many times, but never all at once — it has always felt like the same roof, just renewed." — as recalled by the household contributor, sample entry.',
  true,
  true,
  'published'
);

-- arch-07: Drying Technique for Longer-Lasting Panels
insert into entries (owner, slug, title, description, category, topic_slugs, contributor, location, entry_date, image_path, image_alt, introduction, steps, tips, contributor_story, featured, is_sample, status)
values (
  'PASTE-YOUR-UUID-HERE',
  'drying-technique-for-longer-lasting-panels',
  'Drying Technique for Longer-Lasting Panels',
  'Unlike leaving leaves in direct sun, some households in this community favor a slower, shaded drying process, which they believe results in panels that last longer and resist cracking.',
  'Palm Leaf Preparation',
  '{traditional-house-types,palm-leaf-preparation}'::text[],
  'Community Elder Interview',
  'Kampong Chhnang Province, Cambodia (sample)',
  'August 2024',
  '/traditional_house_types.png',
  'Palm leaf panels resting on a raised drying rack in the shade',
  'Unlike leaving leaves in direct sun, some households in this community favor a slower, shaded drying process, which they believe results in panels that last longer and resist cracking. This entry documents that approach.',
  '[{"title":"Building a raised rack","description":"A simple bamboo rack is raised off the ground, allowing air to circulate on all sides of the drying leaves."},{"title":"Drying in partial shade","description":"Leaves are laid under a covered but open-sided structure, avoiding both direct sun and dampness from the ground."},{"title":"Turning the leaves daily","description":"Leaves are turned once a day for several days so that moisture leaves evenly from both sides."}]'::jsonb,
  '["Leaves dried too quickly in direct sun are said to become brittle and split during weaving.","A gentle, even color across the dried leaf is used as a visual sign that drying was successful."]'::jsonb,
  '"Direct sun is fast, but fast is not always better. Slow drying in the shade was something my grandfather insisted on, even when the family was in a hurry to finish a roof." — as recalled by a community elder, sample entry.',
  false,
  true,
  'published'
);

-- arch-08: The Tools of a Traditional Thatcher
insert into entries (owner, slug, title, description, category, topic_slugs, contributor, location, entry_date, image_path, image_alt, introduction, steps, tips, contributor_story, featured, is_sample, status)
values (
  'PASTE-YOUR-UUID-HERE',
  'the-tools-of-a-traditional-thatcher',
  'The Tools of a Traditional Thatcher',
  'The tools involved in this craft are few, simple, and often handmade.',
  'Weaving Techniques',
  '{maintenance-repair,tools}'::text[],
  'Community Elder Interview',
  'Takeo Province, Cambodia (sample)',
  'August 2024',
  '/maintenance_repair.jpeg',
  'A set of traditional hand tools used for palm leaf thatching',
  'The tools involved in this craft are few, simple, and often handmade. This entry documents the small set of tools one contributor still keeps and uses today, each with its own specific role.',
  '[{"title":"The cutting knife","description":"A short, curved blade used both to harvest fronds from the tree and to trim damaged leaflets during preparation."},{"title":"The splitting tool","description":"A narrow wooden or bone tool used to split rattan and vine into thin strips for lashing panels to the frame."},{"title":"The spine gauge","description":"A length of bamboo used to check that each woven panel''s spine is a consistent width before it is attached to the roof."}]'::jsonb,
  '["Many older tools were handmade and passed down rather than purchased.","A well-kept cutting knife is often mentioned as a source of pride among older thatchers."]'::jsonb,
  '"This knife belonged to my father. I have sharpened it more times than I can count, but I have never replaced it." — as recalled by a community elder, sample entry.',
  false,
  true,
  'published'
);
