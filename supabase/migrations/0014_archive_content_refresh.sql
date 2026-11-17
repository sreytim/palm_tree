-- ============================================================================
-- Archive content refresh — the eight seeded entries, in English
--
-- The bilingual catalogue in `data/entry-content.js` is the editorial source of
-- truth for these entries. The application pairs that Khmer copy with whatever
-- English text the database holds (see lib/entry-content.js), so Khmer readers
-- already get the full Khmer entry. This migration brings the database's own
-- English text in line with the catalogue, so both languages describe exactly
-- the same practice.
--
-- HOW TO RUN
--   1. Open the Supabase SQL editor for this project.
--   2. Paste this file and run it.
--   3. Nothing is inserted or deleted: rows are matched by `slug`, so owner,
--      status, image and review metadata are untouched. Safe to re-run.
--
-- Entries submitted by the community are not touched.
-- ============================================================================

-- preparing-palm-leaves-for-house-covering
update public.entries
   set title             = 'Preparing Palm Leaves for House Covering',
       description       = 'A palm-leaf roof is decided long before the first panel is woven — by the tree that is chosen, the season it is cut in, and the care taken with every leaf.',
       introduction      = 'In the villages of Kampong Speu the palmyra palm — ត្នោត, Borassus flabellifer — is called the tree of life. Its sap becomes palm sugar, its fruit is eaten fresh, its trunk gives timber, and its leaves cover the roofs of homes. Roofing work begins in the dry season, between January and April, when the leaves are full-grown and the sky stays clear enough to dry them. Preparation is the stage that decides how the rest of the work will end: leaves cut too young tear at the fold, leaves dried too fast split, and a roof made from either will be leaking before the next rainy season is over.',
       steps             = '[{"title":"Choosing the right palm","description":"Not every palm gives good roofing. Families look for a healthy tree whose fronds have opened fully and whose leaflets have thickened with age. Leaves from a young palm are thin and curl as they dry; leaves already yellowing on the tree have lost the strength that keeps a roof tight."},{"title":"Cutting in the cool of the morning","description":"Leaves are cut early, while the moisture of the night still keeps the fibres supple. A leaf cut at midday cracks along the fold, and every crack becomes a place where water will find its way in later."},{"title":"Cleaning each frond by hand","description":"Each frond is laid out and checked leaflet by leaflet. Torn or insect-damaged leaflets are stripped away, and the small thorns along the stem are removed so they cannot pierce a bare hand or work loose inside the weave."},{"title":"Carrying the leaves home","description":"Cleaned leaves are tied into loose bundles and carried home on a shoulder pole or by ox cart. They are stacked in the shade of the house, never in direct sun, until enough has been gathered to begin weaving."}]'::jsonb,
       tips              = '["Leaves cut in the dry season keep their shape much longer than leaves cut during the rains.","A leaf that springs back when bent gently is ready; one that stays folded is too old.","Bundles are tied loosely so the leaflets can breathe on the way home; packed tight, they sweat and discolour."]'::jsonb,
       contributor_story = '"My mother cut leaves before the sun came up, and she would not let us drag the bundles along the path. She said a leaf that is treated roughly on the way home will be rough on the roof." — as recalled by a community elder in Kampong Speu.',
       location          = 'Kampong Speu Province, Cambodia',
       image_alt         = 'Bundles of palm leaves laid out in a village yard before weaving'
 where slug = 'preparing-palm-leaves-for-house-covering';

-- the-cross-weave-pattern
update public.entries
   set title             = 'The Cross-Weave Pattern',
       description       = 'Panels are woven leaflet by leaflet over a spine, each leaf crossing the next, so the roof holds together without a single nail.',
       introduction      = 'A palm-leaf roof is not a heap of leaves thrown on a frame; it is a set of woven panels — បន្ទះស្លឹកត្នោត — each tight enough to shed water and stiff enough to lie flat across the rafters. In Takeo families still teach this cross-weave because it needs nothing that cannot be found in the village: leaves, a spine, split rattan, and hands that have learned the rhythm.',
       steps             = '[{"title":"Folding over the spine","description":"A straight length of bamboo or hardwood becomes the spine of the panel. Each leaflet is folded over it so that two even lengths hang on either side — an uneven fold shows up later as a bulge in the roof."},{"title":"Crossing alternate leaflets","description":"Working along the spine, every other leaflet is crossed over its neighbour — left over right, then right over left — locking the row without any binding. This is the step that takes longest to learn and longest to forget."},{"title":"Pressing the weave tight","description":"After every few crossings the weaver presses the leaves together with the flat of the hand. Where the weave stays loose a gap opens, and a gap is where rain gets in and where rot begins."},{"title":"Binding the finished row","description":"A thin strip of split rattan is threaded along the lower edge of the panel to hold the finished section firm. The panel is then laid flat to dry, still straight, before it is carried up to the roof."}]'::jsonb,
       tips              = '["A tighter weave along the lower edge stops water pooling where the next row of panels overlaps it.","Weaving is done in the shade of the house, where the leaves stay soft enough to bend without splitting.","Rattan strips are soaked before use; they shrink as they dry and pull the panel tight on their own."]'::jsonb,
       contributor_story = '"It took me two rainy seasons of watching before my hands understood the rhythm. My grandmother never explained it in words — she wove, and I copied until the leaves stopped fighting me." — as recalled by a community contributor in Takeo.',
       location          = 'Takeo Province, Cambodia',
       image_alt         = 'Detail of a woven palm-leaf panel showing the crossing pattern'
 where slug = 'the-cross-weave-pattern';

-- raising-the-roof-frame
update public.entries
   set title             = 'Raising the Roof Frame',
       description       = 'A covering is only as good as the frame beneath it: straight posts, a steep pitch, and joints tied so tightly that the roof moves as one piece.',
       introduction      = 'In a traditional Khmer house the roof does more work than any other part of the building: it carries the weight of the covering, sheds the monsoon, and keeps the timber below it dry enough to last. That is why the frame is built before a single panel is woven, and why the pitch of the roof is judged by eye against a house that has already survived many rainy seasons. Rafters are cut from timber that has been left to dry, and the bamboo that will carry the panels is often smoked over a low fire so insects and mould keep away from it.',
       steps             = '[{"title":"Setting the ridge beam","description":"A single long beam is raised first along the ridge line, usually with several neighbours lifting together, and levelled before anything else is added. Every later measurement is taken from it."},{"title":"Placing the rafters","description":"Rafters run from the ridge down to the eaves, spaced closely enough that a woven panel cannot sag between them. Spacing is measured with a stick rather than guessed, so every panel lands on timber instead of air."},{"title":"Laying the bamboo purlins","description":"Thinner bamboo is laid horizontally across the rafters, creating the grid that each panel will be tied onto. These bamboo lengths are the part of the frame the lashing actually grips."},{"title":"Checking the pitch","description":"The angle of the roof is compared against a neighbouring house that has held up well. A shallow roof lets water sit and soak in; a steep one throws the rain clear of the walls below."}]'::jsonb,
       tips              = '["Where the rains are heavy, families choose a steeper pitch than they would on drier ground.","Bamboo that will carry the panels is dried and often smoked over a low fire so insects and mould keep away.","The ridge beam is lifted by many hands at once; a frame raised by neighbours is finished in a day."]'::jsonb,
       contributor_story = '"When we raised our ridge beam, half the village came to help lift it. Nobody built a roof alone — that was as much a part of the tradition as the house itself." — as recalled by a household contributor in Kampong Chhnang.',
       location          = 'Kampong Chhnang Province, Cambodia',
       image_alt         = 'Timber and bamboo roof frame of a traditional house under construction'
 where slug = 'raising-the-roof-frame';

-- tying-panels-to-the-roof-frame
update public.entries
   set title             = 'Tying Panels to the Roof Frame',
       description       = 'Rows are fixed from the eaves upward, each one overlapping the row below, so every drop of rain is passed down the roof instead of into it.',
       introduction      = 'Once the panels are dry and the frame is level, the covering goes on in overlapping rows — the same principle used by roof tiles and shingles everywhere. The work runs from the eaves upward, because a row laid above a row already fixed can never be slipped underneath again. Every tie is made with rattan or vine soaked beforehand, so it tightens around the bamboo as it dries.',
       steps             = '[{"title":"Aligning the first row","description":"The lowest row is set along the eave with a slight overhang, so rain leaves the roof before it can run down the wall. This row decides the line that every row above it will follow."},{"title":"Lashing to the bamboo","description":"Each panel is tied to the bamboo purlins at even intervals along its spine. Ties are pulled close to the frame, not looped loosely, so the panel cannot lift and slap in the wind."},{"title":"Overlapping the row above","description":"Every row above covers roughly a third of the row beneath it. That overlap is what keeps the roof dry; the number of panels matters far less than keeping the overlap the same all the way up."},{"title":"Capping the ridge","description":"At the top, panels are folded over the ridge beam and tied from both sides, sealing the peak where the two slopes meet. The ridge takes the most sun and the most rain, so it is checked every year."}]'::jsonb,
       tips              = '["Consistent overlap matters more than the total number of panels used.","Ridge capping is reinforced every year, because it faces the full force of sun and rain."]'::jsonb,
       contributor_story = '"My father always tied the ridge himself. He said that if the top fails, everything below it fails too, however well it was woven." — as recalled by a community elder in Kampong Speu.',
       location          = 'Kampong Speu Province, Cambodia',
       image_alt         = 'Woven palm-leaf panels being tied onto a bamboo roof frame'
 where slug = 'tying-panels-to-the-roof-frame';

-- seasonal-roof-repair
update public.entries
   set title             = 'Seasonal Roof Repair',
       description       = 'A palm-leaf roof is repaired a little every year, before the rains, so that it never has to be replaced all at once.',
       introduction      = 'With a good weave, a steep pitch and a deep eave, a palm-leaf roof can serve a household for three to five years — but only if it is looked after. In Takeo the checking is done in the dry months, after the Khmer New Year and before the first heavy rain, when new leaves are easy to find in the village and the weather allows the work to be done slowly. Nobody waits for a whole roof to fail: a household replaces the thin panels each year, and in this way the roof is never new and never beyond saving.',
       steps             = '[{"title":"Checking from inside the house","description":"On a bright day the household walks through the house looking up at the underside of the roof. Any small point of light marks a place where the leaves have worn thin, and those points are found faster from inside than from a ladder outside."},{"title":"Marking the weak panels","description":"Weak spots are marked with a knot of grass or a scrap of cloth tied below them, so that whoever climbs onto the roof can find the same place again without guessing."},{"title":"Weaving small patch panels","description":"Patch panels are woven with the same cross-weave as the roof itself, cut to the size of the worn section. A patch that matches the weave sits flat; one that is too small leaves a seam for water to enter."},{"title":"Tying the patch back into place","description":"The worn panel is untied, taken out and replaced by the patch, which is tied with new rattan in the same overlapping line as the panels around it. The old panel is kept — its good leaflets are stripped for the next repair."}]'::jsonb,
       tips              = '["Repairs belong to the dry season, while leaves are easy to cut and to weave.","The ridge and the eaves are checked first: they take the most sun, wind and rain of any part of the roof.","A roof that is patched every year lasts longer than one that is left alone and then rebuilt."]'::jsonb,
       contributor_story = '"Before the rains my whole family walked the house together, looking for the thin spots. It became a yearly ritual — almost like a small celebration before the wet season began." — as recalled by a community elder in Takeo.',
       location          = 'Takeo Province, Cambodia',
       image_alt         = 'A household member patching a worn section of a palm-leaf roof'
 where slug = 'seasonal-roof-repair';

-- the-family-house-in-kampong-speu
update public.entries
   set title             = 'The Family House in Kampong Speu',
       description       = 'A raised Khmer house whose palm-leaf roof has been renewed panel by panel for three generations, and never once replaced all at once.',
       introduction      = 'This entry documents one household''s house as an example of a palm-leaf roof that is still in daily use. The house stands on wooden posts about two metres above the ground, with the space underneath kept for tools, storage and shade during the day. It faces east, as Khmer houses traditionally do, so the morning sun reaches the veranda and the long afternoon sun falls on the back wall instead of the living space. The roof is steep, deeply overhanging, and cool under the hand even at midday — a quality families mention again and again when they compare palm leaf with zinc.',
       steps             = '[{"title":"Posts that lift the floor","description":"Hardwood posts raise the floor clear of the ground, keeping the living space dry through seasonal flooding and letting air move underneath. The posts also keep the damp of the earth away from the timber of the house."},{"title":"An open, airy living space","description":"Some walls are left partly open or covered with lighter woven material, so air moves under the roof. In the hot season the family sleeps in the cooler part of the veranda rather than inside the closed rooms."},{"title":"The deep overhang","description":"The roof reaches well past the walls on every side. That overhang keeps direct rain off the timber and palms, and keeps the walls in shade for most of the day, which is why they last so long."},{"title":"Renewing the roof panel by panel","description":"When a section wears out, only those panels are woven and tied again. The family says the roof has never been replaced as a whole; it has simply been renewed, season after season, and each repair keeps the same overlap and the same line."}]'::jsonb,
       tips              = '["Deep overhangs cut down how often the walls and posts have to be replaced.","Raised houses of this kind are common where the land floods in the rainy season.","A palm-leaf roof keeps the rooms cooler than a metal sheet, which families notice most in April."]'::jsonb,
       contributor_story = '"This roof has covered three generations of my family. We have replaced parts of it many times, but never all at once — it has always felt like the same roof, only renewed." — as recalled by the household contributor in Kampong Speu.',
       location          = 'Kampong Speu Province, Cambodia',
       image_alt         = 'A traditional Khmer house raised on wooden posts with a palm-leaf roof'
 where slug = 'the-family-house-in-kampong-speu';

-- drying-technique-for-longer-lasting-panels
update public.entries
   set title             = 'Drying Leaves in the Shade',
       description       = 'Some households refuse to dry palm leaves in full sun. Slower drying in the shade, they say, gives panels that bend instead of splitting.',
       introduction      = 'Drying is the quietest stage of the work and the one most often rushed. In Kampong Chhnang some households dry their leaves under an open-sided shelter instead of laying them in the open sun, turning them once a day for several days. The leaves take longer to be ready, but they stay supple enough to fold without cracking — and a leaf that folds cleanly is a leaf that will not leak.',
       steps             = '[{"title":"Building a raised rack","description":"A simple rack of bamboo is raised off the ground so air can move under the leaves as well as over them. Leaves laid straight on the earth pick up damp and stain, however dry the weather is."},{"title":"Drying in partial shade","description":"The rack sits under a roof with open sides: enough air and light to dry the leaves, but no direct sun and no damp rising from the ground. The leaves darken slowly and evenly instead of bleaching at the edges."},{"title":"Turning the leaves every day","description":"Once a day the leaves are turned so that both faces dry at the same rate. A leaf dried on one side only curls to that side and will never lie flat on the roof."}]'::jsonb,
       tips              = '["Leaves dried too fast in direct sun turn brittle and split along the fold during weaving.","An even, gentle colour across the leaf is the sign that drying has gone well.","A leaf is dry enough when it rustles in the hand and the spine snaps instead of bending."]'::jsonb,
       contributor_story = '"Direct sun is fast, but fast is not always better. Slow drying in the shade was something my grandfather insisted on, even when the family was in a hurry to finish a roof." — as recalled by a community elder in Kampong Chhnang.',
       location          = 'Kampong Chhnang Province, Cambodia',
       image_alt         = 'Palm leaves resting on a raised bamboo rack under a shaded shelter'
 where slug = 'drying-technique-for-longer-lasting-panels';

-- the-tools-of-a-traditional-thatcher
update public.entries
   set title             = 'The Tools of a Traditional Thatcher',
       description       = 'Four simple tools carry the whole craft: a knife, a splitting tool, a measuring stick and a bamboo ladder.',
       introduction      = 'Walk into any household that still covers its own roof and you will not find a workshop. You will find a knife, a length of bamboo for measuring, something to split rattan, and a ladder leaning against the palm. Most of these tools were made by the person using them, or inherited from a parent, and many have been sharpened or repaired far more often than they have been replaced.',
       steps             = '[{"title":"The cutting knife","description":"A short, slightly curved blade cuts fronds from the palm and trims damaged leaflets afterwards. It is kept sharp on a stone at home; a blunt knife bruises the leaf instead of cutting it, and a bruised leaf rots early."},{"title":"The splitting tool","description":"A narrow blade of wood, bone or metal splits rattan and vine into strips thin enough to tie a panel without cutting into the leaves. The strips are soaked before use so they can be pulled tight."},{"title":"The measuring stick","description":"A length of bamboo marked with notches is used to keep the spacing of rafters and the width of panels the same. Guessing by eye is how a roof ends up with one row tighter than the next."},{"title":"The bamboo ladder","description":"A bamboo ladder is leaned against the palm to reach the fronds, and later against the house during repair. Raising and lowering it is usually work for two people, and children are kept well away from it."}]'::jsonb,
       tips              = '["Many of these tools were made at home and passed down, not bought.","A well-kept knife is a point of pride: older thatchers judge a tool before they judge the work.","Tools are counted and put away after each job; a knife left in the yard is a knife that goes missing."]'::jsonb,
       contributor_story = '"This knife belonged to my father. I have sharpened it more times than I can count, but I have never replaced it." — as recalled by a community elder in Takeo.',
       location          = 'Takeo Province, Cambodia',
       image_alt         = 'Handmade palm-leaf thatching tools resting on a wooden bench'
 where slug = 'the-tools-of-a-traditional-thatcher';
