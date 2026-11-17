/**
 * Curated, bilingual archive copy.
 *
 * This file is the editorial source of truth for the eight archive entries the
 * application ships with. Every human-readable field is stored as `{ en, km }`
 * so the interface can render a complete entry in either language. The older
 * approach translated a hand-maintained dictionary keyed by exact English
 * sentences, which left whole paragraphs in English whenever a sentence was
 * reworded or had never been translated at all.
 *
 * Keep this file free of imports: `tests/archive-content.test.js` reads it
 * directly to prove that no field is missing a Khmer or an English version.
 *
 * Writing rules for the content itself:
 *   - describe practice as it is actually carried out in Cambodian villages;
 *   - name the palm (ត្នោត / Borassus flabellifer), the season, and the parts of
 *     the roof using the words families use;
 *   - never invent a named person. Attribution stays with the household or the
 *     community elder who shared the knowledge, as recorded during interviews.
 */

export const entryContent = {
  // -------------------------------------------------------------------------
  // arch-01 — preparation
  // -------------------------------------------------------------------------
  "preparing-palm-leaves-for-house-covering": {
    contributor: {
      en: "Community Elder Interview",
      km: "សម្ភាសន៍ជាមួយចាស់ទុំសហគមន៍",
    },
    title: {
      en: "Preparing Palm Leaves for House Covering",
      km: "ការរៀបចំស្លឹកត្នោតសម្រាប់ប្រក់ដំបូលផ្ទះ",
    },
    description: {
      en: "A palm-leaf roof is decided long before the first panel is woven — by the tree that is chosen, the season it is cut in, and the care taken with every leaf.",
      km: "គុណភាពដំបូលប្រក់ស្លឹកត្នោតត្រូវបានកំណត់តាំងពីមុនពេលត្បាញបន្ទះទីមួយ — គឺកំណត់ដោយដើមត្នោតដែលជ្រើសរើស រដូវដែលកាត់ស្លឹក និងការយកចិត្តទុកដាក់ចំពោះស្លឹកម្តងមួយៗ។",
    },
    imageAlt: {
      en: "Bundles of palm leaves laid out in a village yard before weaving",
      km: "បាច់ស្លឹកត្នោតដាក់តម្រៀបក្នុងចំណោមផ្ទះ មុនពេលត្បាញ",
    },
    location: {
      en: "Kampong Speu Province, Cambodia",
      km: "ខេត្តកំពង់ស្ពឺ ប្រទេសកម្ពុជា",
    },
    introduction: {
      en: "In the villages of Kampong Speu the palmyra palm — ត្នោត, Borassus flabellifer — is called the tree of life. Its sap becomes palm sugar, its fruit is eaten fresh, its trunk gives timber, and its leaves cover the roofs of homes. Roofing work begins in the dry season, between January and April, when the leaves are full-grown and the sky stays clear enough to dry them. Preparation is the stage that decides how the rest of the work will end: leaves cut too young tear at the fold, leaves dried too fast split, and a roof made from either will be leaking before the next rainy season is over.",
      km: "នៅតាមភូមិក្នុងខេត្តកំពង់ស្ពឺ ដើមត្នោតត្រូវបានហៅថាជាដើមឈើនៃជីវិត។ ទឹកត្នោតធ្វើជាស្ករត្នោត ផ្លែត្នោតអាចបរិភោគបាន ដើមត្នោតផ្តល់ឈើសម្រាប់សាងសង់ ហើយស្លឹកត្នោតគ្របដំបូលផ្ទះ។ ការងារប្រក់ដំបូលចាប់ផ្តើមនៅរដូវប្រាំង ចាប់ពីខែមករាដល់ខែមេសា ជាពេលដែលស្លឹកលូតលាស់ពេញលេញ និងមេឃស្រឡះល្មមសម្រាប់ការហាលស្លឹក។ ការរៀបចំគឺជាដំណាក់កាលកំណត់លទ្ធផលនៃការងារទាំងមូល៖ ស្លឹកដែលកាត់ពេលនៅក្មេងពេកនឹងរហែកនៅកន្លែងបត់ ស្លឹកដែលហាលលឿនពេកនឹងប្រេះ ហើយដំបូលដែលធ្វើពីស្លឹកបែបនោះនឹងលេចទឹកមុនពេលរដូវវស្សាបន្ទាប់ចប់។",
    },
    steps: [
      {
        title: {
          en: "Choosing the right palm",
          km: "ការជ្រើសរើសដើមត្នោតត្រឹមត្រូវ",
        },
        description: {
          en: "Not every palm gives good roofing. Families look for a healthy tree whose fronds have opened fully and whose leaflets have thickened with age. Leaves from a young palm are thin and curl as they dry; leaves already yellowing on the tree have lost the strength that keeps a roof tight.",
          km: "មិនមែនដើមត្នោតគ្រប់ដើមសុទ្ធតែផ្តល់ស្លឹកល្អសម្រាប់ប្រក់ដំបូលទេ។ គ្រួសារតែងរកដើមដែលមានសុខភាពល្អ មានស្លឹកបើកពេញលេញ និងស្លឹកតូចៗក្រាស់ល្មមតាមអាយុ។ ស្លឹកពីដើមក្មេងមានសាច់ស្តើង ហើយរមួលពេលស្ងួត រីឯស្លឹកដែលលឿងលើដើមបានបាត់បង់កម្លាំងដែលធ្វើឱ្យដំបូលតឹង។",
        },
      },
      {
        title: {
          en: "Cutting in the cool of the morning",
          km: "ការកាត់ស្លឹកនៅពេលព្រឹកត្រជាក់",
        },
        description: {
          en: "Leaves are cut early, while the moisture of the night still keeps the fibres supple. A leaf cut at midday cracks along the fold, and every crack becomes a place where water will find its way in later.",
          km: "ស្លឹកត្រូវកាត់នៅព្រឹកព្រលឹម ពេលដែលសំណើមពីយប់នៅធ្វើឱ្យសរសៃស្លឹកទន់ងាយបត់។ ស្លឹកដែលកាត់ពេលថ្ងៃត្រង់ងាយប្រេះតាមជ្រុងបត់ ហើយស្នាមប្រេះនីមួយៗនឹងក្លាយជាផ្លូវឱ្យទឹកជ្រាបចូលនៅពេលក្រោយ។",
        },
      },
      {
        title: {
          en: "Cleaning each frond by hand",
          km: "ការសម្អាតស្លឹកម្តងមួយៗដោយដៃ",
        },
        description: {
          en: "Each frond is laid out and checked leaflet by leaflet. Torn or insect-damaged leaflets are stripped away, and the small thorns along the stem are removed so they cannot pierce a bare hand or work loose inside the weave.",
          km: "ស្លឹកម្តងមួយៗត្រូវដាក់តម្រៀប ហើយពិនិត្យមើលស្លឹកតូចៗម្តងមួយៗ។ ស្លឹកដែលរហែក ឬខូចដោយសត្វល្អិត ត្រូវចេញចោល ហើយបន្លាតូចៗនៅតាមដងស្លឹកក៏ត្រូវចេញដែរ ដើម្បីកុំឱ្យចាក់ដៃ ឬធ្វើឱ្យបន្ទះលាតចេញពេលក្រោយ។",
        },
      },
      {
        title: {
          en: "Carrying the leaves home",
          km: "ការដឹកស្លឹកមកផ្ទះ",
        },
        description: {
          en: "Cleaned leaves are tied into loose bundles and carried home on a shoulder pole or by ox cart. They are stacked in the shade of the house, never in direct sun, until enough has been gathered to begin weaving.",
          km: "ស្លឹកដែលសម្អាតរួចត្រូវចងជាបាច់រលុងៗ ហើយដឹកមកផ្ទះដោយរនាស់ស្ពាយ ឬរទេះគោ។ បាច់ស្លឹកត្រូវដាក់តម្រៀបក្នុងម្លប់ផ្ទះ មិនមែនក្រោមពន្លឺថ្ងៃផ្ទាល់ទេ រហូតដល់ប្រមូលបានគ្រប់គ្រាន់ដើម្បីចាប់ផ្តើមត្បាញ។",
        },
      },
    ],
    tips: [
      {
        en: "Leaves cut in the dry season keep their shape much longer than leaves cut during the rains.",
        km: "ស្លឹកដែលកាត់នៅរដូវប្រាំងរក្សារូបរាងបានយូរជាងស្លឹកដែលកាត់នៅរដូវវស្សាឆ្ងាយណាស់។",
      },
      {
        en: "A leaf that springs back when bent gently is ready; one that stays folded is too old.",
        km: "ស្លឹកដែលបត់ស្រាលៗហើយឡើងវិញ គឺជាស្លឹកដែលសមស្រប រីឯស្លឹកដែលបត់ហើយនៅតែជាប់ គឺចាស់ពេក។",
      },
      {
        en: "Bundles are tied loosely so the leaflets can breathe on the way home; packed tight, they sweat and discolour.",
        km: "បាច់ស្លឹកត្រូវចងរលុងៗ ដើម្បីឱ្យស្លឹកតូចៗខ្យល់ចេញចូលបានពេលដឹកមកផ្ទះ ព្រោះបើចងតឹងពេក ស្លឹកនឹងបែកញើស និងប្រែពណ៌។",
      },
    ],
    contributorStory: {
      en: '"My mother cut leaves before the sun came up, and she would not let us drag the bundles along the path. She said a leaf that is treated roughly on the way home will be rough on the roof." — as recalled by a community elder in Kampong Speu.',
      km: '"ម្តាយខ្ញុំកាត់ស្លឹកមុនពេលថ្ងៃរះ ហើយគាត់មិនឱ្យពួកយើងអូសបាច់ស្លឹកនៅតាមផ្លូវឡើយ។ គាត់ថា ស្លឹកដែលធ្វើប្រហោងពេលដឹកមកផ្ទះ ក៏នឹងប្រហោងនៅលើដំបូលដែរ។" — ដកស្រង់ពីការចងចាំរបស់ចាស់ទុំម្នាក់នៅខេត្តកំពង់ស្ពឺ។',
    },
  },
  // -------------------------------------------------------------------------
  // arch-02 — weaving the panel
  // -------------------------------------------------------------------------
  "the-cross-weave-pattern": {
    contributor: {
      en: "Community Elder Interview",
      km: "សម្ភាសន៍ជាមួយចាស់ទុំសហគមន៍",
    },
    title: {
      en: "The Cross-Weave Pattern",
      km: "លំនាំត្បាញឆ្លាស់គ្នា",
    },
    description: {
      en: "Panels are woven leaflet by leaflet over a spine, each leaf crossing the next, so the roof holds together without a single nail.",
      km: "បន្ទះស្លឹកត្រូវត្បាញម្នីមួយៗលើឆ្អឹងស្លឹក ដោយឱ្យស្លឹកមួយឆ្លាស់លើស្លឹកមួយទៀត ដើម្បីឱ្យដំបូលជាប់គ្នាដោយមិនត្រូវការដែកគោលសូម្បីមួយ។",
    },
    imageAlt: {
      en: "Detail of a woven palm-leaf panel showing the crossing pattern",
      km: "រូបភាពជិតនៃបន្ទះស្លឹកត្នោតដែលត្បាញរួច បង្ហាញលំនាំឆ្លាស់គ្នា",
    },
    location: {
      en: "Takeo Province, Cambodia",
      km: "ខេត្តតាកែវ ប្រទេសកម្ពុជា",
    },
    introduction: {
      en: "A palm-leaf roof is not a heap of leaves thrown on a frame; it is a set of woven panels — បន្ទះស្លឹកត្នោត — each tight enough to shed water and stiff enough to lie flat across the rafters. In Takeo families still teach this cross-weave because it needs nothing that cannot be found in the village: leaves, a spine, split rattan, and hands that have learned the rhythm.",
      km: "ដំបូលប្រក់ស្លឹកត្នោតមិនមែនជាការដាក់ស្លឹកគរពីលើគ្រោងប៉ុណ្ណោះទេ ប៉ុន្តែជាបន្ទះស្លឹកដែលត្បាញរួចមួយៗ ដែលតឹងល្មមកុំឱ្យទឹកជ្រាប និងរឹងល្មមដើម្បីដាក់លើឈើទ្រដំបូលបានស្មើ។ នៅខេត្តតាកែវ គ្រួសារនៅតែបង្រៀនលំនាំត្បាញឆ្លាស់នេះ ព្រោះវាមិនត្រូវការអ្វីក្រៅពីអ្វីដែលមាននៅក្នុងភូមិ៖ ស្លឹក ឆ្អឹងស្លឹក វល្លិច្រៀក និងដៃដែលបានរៀនចងចាំចង្វាក់របស់វា។",
    },
    steps: [
      {
        title: {
          en: "Folding over the spine",
          km: "ការបត់ស្លឹកលើឆ្អឹង",
        },
        description: {
          en: "A straight length of bamboo or hardwood becomes the spine of the panel. Each leaflet is folded over it so that two even lengths hang on either side — an uneven fold shows up later as a bulge in the roof.",
          km: "ឫស្សី ឬឈើត្រង់មួយដុំត្រូវប្រើជាឆ្អឹងរបស់បន្ទះ។ ស្លឹកតូចៗនីមួយៗត្រូវបត់លើឆ្អឹងនោះ ដើម្បីឱ្យស្លឹកវែងស្មើគ្នាធ្លាក់សងខាង — បើបត់មិនស្មើ ពេលក្រោយវានឹងបង្ហាញជាពកនៅលើដំបូល។",
        },
      },
      {
        title: {
          en: "Crossing alternate leaflets",
          km: "ការឆ្លាស់ស្លឹកម្តងមួយៗ",
        },
        description: {
          en: "Working along the spine, every other leaflet is crossed over its neighbour — left over right, then right over left — locking the row without any binding. This is the step that takes longest to learn and longest to forget.",
          km: "តាមបណ្តោយឆ្អឹង ស្លឹកតូចៗម្តងមួយៗត្រូវឆ្លាស់គ្នា — ឆ្វេងពីលើស្តាំ បន្ទាប់មកស្តាំពីលើឆ្វេង — ធ្វើឱ្យជួរនោះជាប់គ្នាដោយមិនចាំបាច់ចង។ នេះជាជំហានដែលចំណាយពេលយូរបំផុតដើម្បីរៀន ហើយក៏យូរបំផុតដើម្បីបំភ្លេចដែរ។",
        },
      },
      {
        title: {
          en: "Pressing the weave tight",
          km: "ការសង្កត់ឱ្យតឹង",
        },
        description: {
          en: "After every few crossings the weaver presses the leaves together with the flat of the hand. Where the weave stays loose a gap opens, and a gap is where rain gets in and where rot begins.",
          km: "ក្រោយការឆ្លាស់ពីរបីដង អ្នកត្បាញសង្កត់ស្លឹកឱ្យជិតគ្នាដោយប្រើបាតដៃ។ កន្លែងណាដែលត្បាញរលុង នោះនឹងកើតមានចន្លោះ ហើយចន្លោះនោះហើយជាផ្លូវឱ្យទឹកចូល និងជាកន្លែងចាប់ផ្តើមរលួយ។",
        },
      },
      {
        title: {
          en: "Binding the finished row",
          km: "ការចងជួរដែលរួចរាល់",
        },
        description: {
          en: "A thin strip of split rattan is threaded along the lower edge of the panel to hold the finished section firm. The panel is then laid flat to dry, still straight, before it is carried up to the roof.",
          km: "វល្លិច្រៀកស្តើងមួយត្រូវចារឹកតាមជាយក្រោមរបស់បន្ទះ ដើម្បីឱ្យផ្នែកដែលរួចរាល់រឹងមាំ។ បន្ទាប់មកបន្ទះនោះត្រូវដាក់ផ្ទាល់ឱ្យស្ងួត នៅតែត្រង់ មុនពេលដឹកឡើងលើដំបូល។",
        },
      },
    ],
    tips: [
      {
        en: "A tighter weave along the lower edge stops water pooling where the next row of panels overlaps it.",
        km: "ការត្បាញឱ្យតឹងជាងនៅជាយក្រោម ជួយកុំឱ្យទឹកដក់នៅកន្លែងដែលជួរបន្ទះបន្ទាប់ត្រួតពីលើ។",
      },
      {
        en: "Weaving is done in the shade of the house, where the leaves stay soft enough to bend without splitting.",
        km: "ការត្បាញត្រូវធ្វើក្នុងម្លប់ផ្ទះ ជាកន្លែងដែលស្លឹកនៅទន់ល្មមបត់បានដោយមិនប្រេះ។",
      },
      {
        en: "Rattan strips are soaked before use; they shrink as they dry and pull the panel tight on their own.",
        km: "វល្លិច្រៀកត្រូវត្រាំទឹកមុនប្រើ ព្រោះវារួមតូចពេលស្ងួត ហើយទាញបន្ទះឱ្យតឹងដោយខ្លួនឯង។",
      },
    ],
    contributorStory: {
      en: '"It took me two rainy seasons of watching before my hands understood the rhythm. My grandmother never explained it in words — she wove, and I copied until the leaves stopped fighting me." — as recalled by a community contributor in Takeo.',
      km: '"ខ្ញុំចំណាយរដូវវស្សាពីរឆ្នាំដើម្បីមើល ទើបដៃខ្ញុំយល់ចង្វាក់របស់វា។ យាយខ្ញុំមិនដែលពន្យល់ដោយពាក្យសម្តីទេ — គាត់ត្បាញ ហើយខ្ញុំក៏ធ្វើតាម រហូតដល់ស្លឹកលែងរឹងចិត្តនឹងខ្ញុំ។" — ដកស្រង់ពីអ្នករួមចំណែកម្នាក់នៅខេត្តតាកែវ។',
    },
  },

  // -------------------------------------------------------------------------
  // arch-03 — the frame that carries the covering
  // -------------------------------------------------------------------------
  "raising-the-roof-frame": {
    contributor: {
      en: "Family Interview, Contributor's Uncle",
      km: "សម្ភាសន៍គ្រួសារ៖ ពូរបស់អ្នករួមចំណែក",
    },
    title: {
      en: "Raising the Roof Frame",
      km: "ការលើកគ្រោងដំបូល",
    },
    description: {
      en: "A covering is only as good as the frame beneath it: straight posts, a steep pitch, and joints tied so tightly that the roof moves as one piece.",
      km: "ការប្រក់ដំបូលឱ្យល្អ អាស្រ័យលើគ្រោងដំបូលខាងក្រោម៖ សសរត្រង់ ដំបូលចែងខ្ពស់ល្មម និងចំណងដែលចងរឹងមាំរហូតដំបូលកម្រើកជាដុំតែមួយ។",
    },
    imageAlt: {
      en: "Timber and bamboo roof frame of a traditional house under construction",
      km: "គ្រោងដំបូលធ្វើពីឈើ និងឫស្សី នៃផ្ទះប្រពៃណីដែលកំពុងសាងសង់",
    },
    location: {
      en: "Kampong Chhnang Province, Cambodia",
      km: "ខេត្តកំពង់ឆ្នាំង ប្រទេសកម្ពុជា",
    },
    introduction: {
      en: "In a traditional Khmer house the roof does more work than any other part of the building: it carries the weight of the covering, sheds the monsoon, and keeps the timber below it dry enough to last. That is why the frame is built before a single panel is woven, and why the pitch of the roof is judged by eye against a house that has already survived many rainy seasons. Rafters are cut from timber that has been left to dry, and the bamboo that will carry the panels is often smoked over a low fire so insects and mould keep away from it.",
      km: "នៅក្នុងផ្ទះខ្មែរប្រពៃណី ដំបូលធ្វើការងារច្រើនជាងផ្នែកផ្សេងទៀតនៃផ្ទះ៖ វាទ្រទ្រង់ទម្ងន់ស្លឹក បង្ហូរទឹកភ្លៀងរដូវវស្សា និងរក្សាឈើខាងក្រោមឱ្យស្ងួតគ្រប់គ្រាន់ដើម្បីប្រើបានយូរ។ ហេតុនេះហើយបានជាគ្រោងដំបូលត្រូវសាងសង់មុនពេលត្បាញបន្ទះស្លឹកមួយ ហើយក៏ជាហេតុដែលជម្រាលដំបូលត្រូវវាស់ដោយភ្នែក ធៀបនឹងផ្ទះដែលបានឆ្លងកាត់រដូវវស្សាជាច្រើនឆ្នាំរួចមកហើយ។ ឈើទ្រដំបូលកាត់ចេញពីឈើដែលហាលស្ងួតរួច ហើយឫស្សីដែលនឹងទ្រទ្រង់បន្ទះស្លឹក ត្រូវដុតផ្សែងស្រាលៗ ដើម្បីកុំឱ្យសត្វល្អិត និងផ្សិតចូល។",
    },
    steps: [
      {
        title: {
          en: "Setting the ridge beam",
          km: "ការដាក់ធ្នឹមកំពូល",
        },
        description: {
          en: "A single long beam is raised first along the ridge line, usually with several neighbours lifting together, and levelled before anything else is added. Every later measurement is taken from it.",
          km: "ធ្នឹមវែងមួយត្រូវលើកដាក់តាមខ្សែកំពូលដំបូលមុនគេ ដោយជាធម្មតាមានអ្នកជិតខាងជាច្រើនជួយលើកជាមួយគ្នា ហើយត្រូវធ្វើឱ្យស្មើមុនពេលបន្ថែមអ្វីផ្សេងទៀត។ ការវាស់វែងទាំងអស់នៅពេលក្រោយ គឺធៀបនឹងធ្នឹមនេះ។",
        },
      },
      {
        title: {
          en: "Placing the rafters",
          km: "ការដាក់ឈើទ្រដំបូល",
        },
        description: {
          en: "Rafters run from the ridge down to the eaves, spaced closely enough that a woven panel cannot sag between them. Spacing is measured with a stick rather than guessed, so every panel lands on timber instead of air.",
          km: "ឈើទ្រដំបូលរត់ពីកំពូលចុះមកជាយដំបូល ដោយមានចន្លោះជិតល្មម ដើម្បីកុំឱ្យបន្ទះស្លឹកធ្លាក់ចុះនៅចន្លោះ។ ចន្លោះត្រូវវាស់ដោយប្រើដងឈើ មិនមែនប៉ាន់ស្មានទេ ដើម្បីឱ្យបន្ទះនីមួយៗដាក់លើឈើ មិនមែនលើខ្យល់។",
        },
      },
      {
        title: {
          en: "Laying the bamboo purlins",
          km: "ការដាក់ឫស្សីឆ្លងកាត់",
        },
        description: {
          en: "Thinner bamboo is laid horizontally across the rafters, creating the grid that each panel will be tied onto. These bamboo lengths are the part of the frame the lashing actually grips.",
          km: "ឫស្សីស្តើងជាងត្រូវដាក់ឆ្លងកាត់ឈើទ្រដំបូល បង្កើតជាបណ្តាញសម្រាប់ចងបន្ទះស្លឹកនីមួយៗ។ ឫស្សីទាំងនេះហើយជាផ្នែកនៃគ្រោងដែលខ្សែចងចាប់ជាប់ពិតប្រាកដ។",
        },
      },
      {
        title: {
          en: "Checking the pitch",
          km: "ការត្រួតពិនិត្យជម្រាល",
        },
        description: {
          en: "The angle of the roof is compared against a neighbouring house that has held up well. A shallow roof lets water sit and soak in; a steep one throws the rain clear of the walls below.",
          km: "មុំជម្រាលដំបូលត្រូវធៀបនឹងផ្ទះអ្នកជិតខាងដែលប្រើបានយូរ។ ដំបូលចែងទាបធ្វើឱ្យទឹកដក់ និងជ្រាបចូល រីឯដំបូលចែងខ្ពស់បោះទឹកឱ្យផុតពីជញ្ជាំងខាងក្រោម។",
        },
      },
    ],
    tips: [
      {
        en: "Where the rains are heavy, families choose a steeper pitch than they would on drier ground.",
        km: "នៅតំបន់ដែលភ្លៀងធ្លាក់ខ្លាំង គ្រួសារតែងជ្រើសរើសជម្រាលដំបូលខ្ពស់ជាងនៅតំបន់ដែលភ្លៀងតិច។",
      },
      {
        en: "Bamboo that will carry the panels is dried and often smoked over a low fire so insects and mould keep away.",

        km: "ឫស្សីដែលនឹងទ្រទ្រង់បន្ទះស្លឹក ត្រូវហាលស្ងួត ហើយជាញឹកញាប់ដុតផ្សែងស្រាលៗ ដើម្បីកុំឱ្យសត្វល្អិត និងផ្សិតចូល។",
      },
      {
        en: "The ridge beam is lifted by many hands at once; a frame raised by neighbours is finished in a day.",
        km: "ធ្នឹមកំពូលត្រូវលើកដោយដៃច្រើនក្នុងពេលតែមួយ ហើយគ្រោងដំបូលដែលមានអ្នកជិតខាងជួយ អាចរួចរាល់ក្នុងរយៈពេលតែមួយថ្ងៃ។",
      },
    ],
    contributorStory: {
      en: '"When we raised our ridge beam, half the village came to help lift it. Nobody built a roof alone — that was as much a part of the tradition as the house itself." — as recalled by a household contributor in Kampong Chhnang.',
      km: '"ពេលយើងលើកធ្នឹមកំពូលផ្ទះ អ្នកភូមិពាក់កណ្តាលបានមកជួយលើក។ គ្មាននរណាម្នាក់សាងសង់ដំបូលតែម្នាក់ឯងទេ — នោះជាផ្នែកមួយនៃប្រពៃណី ដូចជាផ្ទះខ្លួនឯងដែរ។" — ដកស្រង់ពីគ្រួសារអ្នករួមចំណែកម្នាក់នៅខេត្តកំពង់ឆ្នាំង។',
    },
  },

  // -------------------------------------------------------------------------
  // arch-04 — fixing the covering
  // -------------------------------------------------------------------------
  "tying-panels-to-the-roof-frame": {
    contributor: {
      en: "Community Elder Interview",
      km: "សម្ភាសន៍ជាមួយចាស់ទុំសហគមន៍",
    },
    title: {
      en: "Tying Panels to the Roof Frame",
      km: "ការចងបន្ទះស្លឹកលើគ្រោងដំបូល",
    },
    description: {
      en: "Rows are fixed from the eaves upward, each one overlapping the row below, so every drop of rain is passed down the roof instead of into it.",
      km: "ជួរបន្ទះស្លឹកត្រូវចងពីជាយដំបូលឡើងទៅលើ ដោយជួរមួយៗត្រួតពីលើជួរខាងក្រោម ដើម្បីឱ្យតំណក់ទឹកភ្លៀងនីមួយៗហូរចុះតាមដំបូល ជាជាងជ្រាបចូល។",
    },
    imageAlt: {
      en: "Woven palm-leaf panels being tied onto a bamboo roof frame",
      km: "បន្ទះស្លឹកត្នោតកំពុងត្រូវចងលើគ្រោងដំបូលឫស្សី",
    },
    location: {
      en: "Kampong Speu Province, Cambodia",
      km: "ខេត្តកំពង់ស្ពឺ ប្រទេសកម្ពុជា",
    },
    introduction: {
      en: "Once the panels are dry and the frame is level, the covering goes on in overlapping rows — the same principle used by roof tiles and shingles everywhere. The work runs from the eaves upward, because a row laid above a row already fixed can never be slipped underneath again. Every tie is made with rattan or vine soaked beforehand, so it tightens around the bamboo as it dries.",
      km: "ពេលបន្ទះស្លឹកស្ងួត ហើយគ្រោងដំបូលស្មើហើយ ការប្រក់ត្រូវធ្វើជាជួរត្រួតគ្នា — គឺគោលការណ៍ដូចគ្នានឹងការប្រក់ក្បឿងដំបូលគ្រប់ទីកន្លែង។ ការងារធ្វើពីជាយដំបូលឡើងទៅលើ ព្រោះបន្ទះដែលដាក់ពីលើរួចហើយ មិនអាចស៊កបន្ទះខាងក្រោមចូលទៀតបានទេ។ ចំណងនីមួយៗធ្វើដោយវល្លិ ឬខ្សែដែលត្រាំទឹករួច ដើម្បីឱ្យវារឹតឫស្សីឱ្យតឹងនៅពេលស្ងួត។",
    },
    steps: [
      {
        title: {
          en: "Aligning the first row",
          km: "ការតម្រឹមជួរទីមួយ",
        },
        description: {
          en: "The lowest row is set along the eave with a slight overhang, so rain leaves the roof before it can run down the wall. This row decides the line that every row above it will follow.",
          km: "ជួរក្រោមបំផុតត្រូវដាក់តាមជាយដំបូល ដោយឱ្យចេញលើសបន្តិច ដើម្បីឱ្យទឹកភ្លៀងហូរផុតពីដំបូល មុនពេលវាហូរចុះតាមជញ្ជាំង។ ជួរនេះហើយកំណត់ខ្សែដែលជួរខាងលើទាំងអស់ត្រូវដើរតាម។",
        },
      },
      {
        title: {
          en: "Lashing to the bamboo",
          km: "ការចងជាប់នឹងឫស្សី",
        },
        description: {
          en: "Each panel is tied to the bamboo purlins at even intervals along its spine. Ties are pulled close to the frame, not looped loosely, so the panel cannot lift and slap in the wind.",
          km: "បន្ទះនីមួយៗត្រូវចងជាប់នឹងឫស្សីតាមចន្លោះស្មើៗគ្នា តាមបណ្តោយឆ្អឹងរបស់វា។ ចំណងត្រូវរឹតជិតនឹងគ្រោង មិនមែនចងរលុងទេ ដើម្បីកុំឱ្យបន្ទះលើកឡើង និងប៉ះខ្យល់។",
        },
      },
      {
        title: {
          en: "Overlapping the row above",
          km: "ការត្រួតជាន់គ្នានៃជួរខាងលើ",
        },
        description: {
          en: "Every row above covers roughly a third of the row beneath it. That overlap is what keeps the roof dry; the number of panels matters far less than keeping the overlap the same all the way up.",
          km: "ជួរនីមួយៗពីលើត្រូវគ្របពីលើជួរខាងក្រោមប្រហែលមួយភាគបី។ ការត្រួតគ្នានេះហើយដែលរក្សាដំបូលឱ្យស្ងួត ហើយចំនួនបន្ទះមិនសំខាន់ជាងការរក្សាការត្រួតគ្នាឱ្យស្មើពីក្រោមដល់លើនោះទេ។",
        },
      },
      {
        title: {
          en: "Capping the ridge",
          km: "ការគ្របកំពូលដំបូល",
        },
        description: {
          en: "At the top, panels are folded over the ridge beam and tied from both sides, sealing the peak where the two slopes meet. The ridge takes the most sun and the most rain, so it is checked every year.",
          km: "នៅផ្នែកខាងលើ បន្ទះស្លឹកត្រូវបត់គ្របលើធ្នឹមកំពូល ហើយចងពីសងខាង ដើម្បីបិទជិតកំពូលដំបូលដែលជាកន្លែងជម្រាលទាំងពីរជួបគ្នា។ កំពូលដំបូលទទួលកម្តៅថ្ងៃ និងទឹកភ្លៀងច្រើនជាងគេ ដូច្នេះវាត្រូវពិនិត្យរាល់ឆ្នាំ។",
        },
      },
    ],
    tips: [
      {
        en: "Consistent overlap matters more than the total number of panels used.",
        km: "ការត្រួតគ្នាឱ្យស្មើសាច់ សំខាន់ជាងចំនួនបន្ទះសរុបដែលបានប្រើ។",
      },
      {
        en: "Ridge capping is reinforced every year, because it faces the full force of sun and rain.",
        km: "បន្ទះគ្របកំពូលដំបូលត្រូវពង្រឹងរៀងរាល់ឆ្នាំ ព្រោះវាទទួលកម្តៅថ្ងៃ និងទឹកភ្លៀងពេញទំហឹង។",
      },
    ],
    contributorStory: {
      en: '"My father always tied the ridge himself. He said that if the top fails, everything below it fails too, however well it was woven." — as recalled by a community elder in Kampong Speu.',
      km: '"ពុកខ្ញុំតែងតែចងកំពូលដំបូលដោយខ្លួនឯង។ គាត់ថា បើផ្នែកខាងលើខូច ផ្នែកខាងក្រោមក៏ខូចទាំងអស់ដែរ ទោះបីត្បាញបានល្អយ៉ាងណាក៏ដោយ។" — ដកស្រង់ពីការចងចាំរបស់ចាស់ទុំម្នាក់នៅខេត្តកំពង់ស្ពឺ។',
    },
  },

  // -------------------------------------------------------------------------
  // arch-05 — keeping the roof alive
  // -------------------------------------------------------------------------
  "seasonal-roof-repair": {
    contributor: {
      en: "Community Elder Interview",
      km: "សម្ភាសន៍ជាមួយចាស់ទុំសហគមន៍",
    },
    title: {
      en: "Seasonal Roof Repair",
      km: "ការជួសជុលដំបូលតាមរដូវកាល",
    },
    description: {
      en: "A palm-leaf roof is repaired a little every year, before the rains, so that it never has to be replaced all at once.",
      km: "ដំបូលប្រក់ស្លឹកត្នោតត្រូវជួសជុលបន្តិចម្តងៗរៀងរាល់ឆ្នាំ មុនរដូវភ្លៀង ដើម្បីកុំឱ្យត្រូវរុះរើធ្វើថ្មីទាំងស្រុងក្នុងពេលតែមួយ។",
    },
    imageAlt: {
      en: "A household member patching a worn section of a palm-leaf roof",
      km: "សមាជិកគ្រួសារម្នាក់កំពុងបំណះផ្នែកដំបូលស្លឹកត្នោតដែលខូច",
    },
    location: {
      en: "Takeo Province, Cambodia",
      km: "ខេត្តតាកែវ ប្រទេសកម្ពុជា",
    },
    introduction: {
      en: "With a good weave, a steep pitch and a deep eave, a palm-leaf roof can serve a household for three to five years — but only if it is looked after. In Takeo the checking is done in the dry months, after the Khmer New Year and before the first heavy rain, when new leaves are easy to find in the village and the weather allows the work to be done slowly. Nobody waits for a whole roof to fail: a household replaces the thin panels each year, and in this way the roof is never new and never beyond saving.",
      km: "បើត្បាញល្អ ចែងខ្ពស់ និងមានជាយដំបូលធំល្មម ដំបូលប្រក់ស្លឹកត្នោតអាចបម្រើគ្រួសារបានពីបីទៅប្រាំឆ្នាំ — តែលុះត្រាតែមានការថែទាំ។ នៅខេត្តតាកែវ ការត្រួតពិនិត្យធ្វើឡើងក្នុងខែប្រាំង ក្រោយបុណ្យចូលឆ្នាំថ្មី និងមុនពេលភ្លៀងធ្លាក់ខ្លាំងដំបូង ជាពេលដែលរកស្លឹកថ្មីបានងាយក្នុងភូមិ និងអាកាសធាតុអនុញ្ញាតឱ្យធ្វើការបានយឺតៗ។ គ្មាននរណាម្នាក់រង់ចាំឱ្យដំបូលខូចទាំងស្រុងទេ៖ គ្រួសារបំណះជំនួសបន្ទះដែលស្តើងជារៀងរាល់ឆ្នាំ ដូច្នេះដំបូលមិនដែលថ្មីស្រឡាង ហើយក៏មិនដែលហួសកម្រិតជួសជុលដែរ។",
    },
    steps: [
      {
        title: {
          en: "Checking from inside the house",
          km: "ការត្រួតពិនិត្យពីខាងក្នុងផ្ទះ",
        },
        description: {
          en: "On a bright day the household walks through the house looking up at the underside of the roof. Any small point of light marks a place where the leaves have worn thin, and those points are found faster from inside than from a ladder outside.",
          km: "នៅថ្ងៃមានពន្លឺថ្ងៃ គ្រួសារដើរក្នុងផ្ទះ ហើយមើលឡើងលើក្រោមដំបូល។ ចំណុចពន្លឺតូចៗណាមួយ គឺជាសញ្ញាថាស្លឹកនៅកន្លែងនោះស្តើងទៅហើយ ហើយចំណុចទាំងនោះរកឃើញលឿនជាងការឡើងជណ្តើរមើលពីខាងក្រៅ។",
        },
      },
      {
        title: {
          en: "Marking the weak panels",
          km: "ការសម្គាល់បន្ទះដែលខូច",
        },
        description: {
          en: "Weak spots are marked with a knot of grass or a scrap of cloth tied below them, so that whoever climbs onto the roof can find the same place again without guessing.",
          km: "កន្លែងខ្សោយត្រូវសម្គាល់ដោយចងកន្ទុយស្មៅ ឬកណ្តាប់ក្រណាត់នៅខាងក្រោម ដើម្បីឱ្យអ្នកឡើងទៅលើដំបូលរកកន្លែងដដែលឃើញវិញ ដោយមិនចាំបាច់ប៉ាន់ស្មាន។",
        },
      },
      {
        title: {
          en: "Weaving small patch panels",
          km: "ការត្បាញបន្ទះបំណះតូចៗ",
        },
        description: {
          en: "Patch panels are woven with the same cross-weave as the roof itself, cut to the size of the worn section. A patch that matches the weave sits flat; one that is too small leaves a seam for water to enter.",
          km: "បន្ទះបំណះត្រូវត្បាញដោយលំនាំឆ្លាស់ដូចដំបូលដើម ហើយកាត់ឱ្យស្របនឹងទំហំផ្នែកដែលខូច។ បំណះដែលត្រូវនឹងលំនាំនឹងដាក់បានស្មើ រីឯបំណះដែលតូចពេក បន្សល់ជាថ្នេរឱ្យទឹកចូល។",
        },
      },
      {
        title: {
          en: "Tying the patch back into place",
          km: "ការចងបំណះឱ្យចូលកន្លែង",
        },
        description: {
          en: "The worn panel is untied, taken out and replaced by the patch, which is tied with new rattan in the same overlapping line as the panels around it. The old panel is kept — its good leaflets are stripped for the next repair.",
          km: "បន្ទះដែលខូចត្រូវស្រាយចេញ យកចេញ ហើយដាក់បំណះថ្មីជំនួស ដោយចងដោយវល្លិថ្មី ត្រង់ខ្សែត្រួតគ្នាដូចបន្ទះជុំវិញ។ បន្ទះចាស់ត្រូវទុកទុក ដោយចេញស្លឹកដែលនៅល្អ ទុកសម្រាប់ការជួសជុលលើកក្រោយ។",
        },
      },
    ],
    tips: [
      {
        en: "Repairs belong to the dry season, while leaves are easy to cut and to weave.",
        km: "ការជួសជុលគួរធ្វើនៅរដូវប្រាំង ពេលដែលកាត់ស្លឹក និងត្បាញបានងាយ។",
      },
      {
        en: "The ridge and the eaves are checked first: they take the most sun, wind and rain of any part of the roof.",
        km: "កំពូលដំបូល និងជាយដំបូលត្រូវពិនិត្យមុនគេ ព្រោះវាទទួលកម្តៅថ្ងៃ ខ្យល់ និងទឹកភ្លៀងច្រើនជាងផ្នែកផ្សេងទៀត។",
      },
      {
        en: "A roof that is patched every year lasts longer than one that is left alone and then rebuilt.",
        km: "ដំបូលដែលបំណះរៀងរាល់ឆ្នាំ ប្រើបានយូរជាងដំបូលដែលទុកចោល រួចទើបរុះរើធ្វើថ្មី។",
      },
    ],
    contributorStory: {
      en: '"Before the rains my whole family walked the house together, looking for the thin spots. It became a yearly ritual — almost like a small celebration before the wet season began." — as recalled by a community elder in Takeo.',
      km: '"មុនរដូវភ្លៀង គ្រួសារខ្ញុំទាំងមូលដើរមើលផ្ទះទាំងអស់គ្នា ដើម្បីរកកន្លែងដែលស្លឹកស្តើង។ វាក្លាយជាទំនៀមប្រចាំឆ្នាំ — ស្ទើរតែដូចជាពិធីតូចមួយមុនរដូវវស្សាចាប់ផ្តើម។" — ដកស្រង់ពីការចងចាំរបស់ចាស់ទុំម្នាក់នៅខេត្តតាកែវ។',
    },
  },

  // -------------------------------------------------------------------------
  // arch-06 — a house that is lived in
  // -------------------------------------------------------------------------
  "the-family-house-in-kampong-speu": {
    contributor: {
      en: "Household Visit and Interview",
      km: "ទស្សនកិច្ចផ្ទះ និងសម្ភាសន៍",
    },
    title: {
      en: "The Family House in Kampong Speu",
      km: "ផ្ទះគ្រួសារមួយនៅកំពង់ស្ពឺ",
    },
    description: {
      en: "A raised Khmer house whose palm-leaf roof has been renewed panel by panel for three generations, and never once replaced all at once.",
      km: "ផ្ទះខ្មែរលើកកំពស់ ដែលដំបូលស្លឹកត្នោតត្រូវបានជួសជុលបន្ទះម្តងមួយៗអស់រយៈពេលបីជំនាន់ ហើយមិនដែលរុះរើធ្វើថ្មីទាំងស្រុងសូម្បីម្តង។",
    },
    imageAlt: {
      en: "A traditional Khmer house raised on wooden posts with a palm-leaf roof",
      km: "ផ្ទះខ្មែរប្រពៃណីលើកកំពស់លើសសរឈើ មានដំបូលប្រក់ស្លឹកត្នោត",
    },
    location: {
      en: "Kampong Speu Province, Cambodia",
      km: "ខេត្តកំពង់ស្ពឺ ប្រទេសកម្ពុជា",
    },
    introduction: {
      en: "This entry documents one household's house as an example of a palm-leaf roof that is still in daily use. The house stands on wooden posts about two metres above the ground, with the space underneath kept for tools, storage and shade during the day. It faces east, as Khmer houses traditionally do, so the morning sun reaches the veranda and the long afternoon sun falls on the back wall instead of the living space. The roof is steep, deeply overhanging, and cool under the hand even at midday — a quality families mention again and again when they compare palm leaf with zinc.",
      km: "កំណត់ត្រានេះរៀបរាប់អំពីផ្ទះរបស់គ្រួសារមួយ ជាឧទាហរណ៍នៃដំបូលស្លឹកត្នោតដែលនៅប្រើប្រាស់ជារៀងរាល់ថ្ងៃ។ ផ្ទះនេះឈរលើសសរឈើខ្ពស់ពីដីប្រហែលពីរម៉ែត្រ ដោយប្រើចន្លោះខាងក្រោមសម្រាប់ដាក់ឧបករណ៍ ស្តុកទុកអីវ៉ាន់ និងជាម្លប់ពេលថ្ងៃ។ ផ្ទះបែរមុខទៅទិសខាងកើត ដូចជាផ្ទះខ្មែរប្រពៃណី ដើម្បីឱ្យពន្លឺថ្ងៃព្រឹកចាំងចូលរានហាល ហើយពន្លឺថ្ងៃរសៀលដ៏យូរធ្លាក់លើជញ្ជាំងខាងក្រោយ ជាជាងលើកន្លែងរស់នៅ។ ដំបូលចែងខ្ពស់ មានជាយធំ ហើយត្រជាក់នៅពេលប៉ះសូម្បីពេលថ្ងៃត្រង់ — នេះជាលក្ខណៈដែលអ្នកស្រុកនិយាយដដែលៗ ពេលប្រៀបធៀបស្លឹកត្នោតនឹងស័ង្កសី។",
    },
    steps: [
      {
        title: {
          en: "Posts that lift the floor",
          km: "សសរដែលលើកកំពស់ផ្ទះ",
        },
        description: {
          en: "Hardwood posts raise the floor clear of the ground, keeping the living space dry through seasonal flooding and letting air move underneath. The posts also keep the damp of the earth away from the timber of the house.",
          km: "សសរឈើរឹងលើកកំពស់ផ្ទះឱ្យផុតពីដី ដើម្បីរក្សាកន្លែងរស់នៅឱ្យស្ងួតពេលមានទឹកជំនន់តាមរដូវ និងឱ្យខ្យល់ចេញចូលពីក្រោមបាន។ សសរនេះក៏បន្ធូរសំណើមពីដីមិនឱ្យជ្រាបដល់ឈើផ្ទះដែរ។",
        },
      },
      {
        title: {
          en: "An open, airy living space",
          km: "កន្លែងរស់នៅបើកចំហ និងមានខ្យល់",
        },
        description: {
          en: "Some walls are left partly open or covered with lighter woven material, so air moves under the roof. In the hot season the family sleeps in the cooler part of the veranda rather than inside the closed rooms.",
          km: "ជញ្ជាំងខ្លះទុកឱ្យបើកចំហខ្លះ ឬស្រោបដោយសម្ភារៈត្បាញស្រាលៗ ដើម្បីឱ្យខ្យល់ហូរក្រោមដំបូល។ នៅរដូវក្តៅ គ្រួសារដេកនៅផ្នែកត្រជាក់នៃរានហាល ជាជាងខាងក្នុងបន្ទប់បិទជិត។",
        },
      },
      {
        title: {
          en: "The deep overhang",
          km: "ជាយដំបូលធំ",
        },
        description: {
          en: "The roof reaches well past the walls on every side. That overhang keeps direct rain off the timber and palms, and keeps the walls in shade for most of the day, which is why they last so long.",
          km: "ដំបូលលាតចេញផុតពីជញ្ជាំងគ្រប់ជ្រុង។ ជាយដំបូលនេះការពារឈើ និងជញ្ជាំងពីទឹកភ្លៀងផ្ទាល់ ហើយរក្សាជញ្ជាំងឱ្យនៅក្នុងម្លប់ស្ទើរពេញមួយថ្ងៃ ដែលជាហេតុធ្វើឱ្យជញ្ជាំងប្រើបានយូរ។",
        },
      },
      {
        title: {
          en: "Renewing the roof panel by panel",
          km: "ការជំនួសដំបូលបន្ទះម្តងមួយៗ",
        },
        description: {
          en: "When a section wears out, only those panels are woven and tied again. The family says the roof has never been replaced as a whole; it has simply been renewed, season after season, and each repair keeps the same overlap and the same line.",
          km: "ពេលផ្នែកណាមួយខូច គេត្បាញ និងចងជំនួសតែបន្ទះនៅផ្នែកនោះប៉ុណ្ណោះ។ គ្រួសារនិយាយថា ដំបូលនេះមិនដែលត្រូវរុះរើធ្វើថ្មីទាំងស្រុងទេ គឺគ្រាន់តែជួសជុលបន្តបន្ទាប់តាមរដូវកាល ដោយរក្សាការត្រួតគ្នា និងខ្សែដើមដដែល។",
        },
      },
    ],
    tips: [
      {
        en: "Deep overhangs cut down how often the walls and posts have to be replaced.",
        km: "ជាយដំបូលធំជួយកាត់បន្ថយចំនួនដងដែលត្រូវជំនួសជញ្ជាំង និងសសរ។",
      },
      {
        en: "Raised houses of this kind are common where the land floods in the rainy season.",
        km: "ផ្ទះលើកកំពស់បែបនេះមានច្រើននៅតំបន់ដែលមានទឹកជំនន់នៅរដូវវស្សា។",
      },
      {
        en: "A palm-leaf roof keeps the rooms cooler than a metal sheet, which families notice most in April.",
        km: "ដំបូលប្រក់ស្លឹកត្នោតធ្វើឱ្យបន្ទប់ត្រជាក់ជាងដំបូលស័ង្កសី ហើយអ្នកស្រុកដឹងខ្លួនច្បាស់ជាងគេនៅខែមេសា។",
      },
    ],
    contributorStory: {
      en: '"This roof has covered three generations of my family. We have replaced parts of it many times, but never all at once — it has always felt like the same roof, only renewed." — as recalled by the household contributor in Kampong Speu.',
      km: '"ដំបូលនេះបានគ្របលើគ្រួសារខ្ញុំអស់បីជំនាន់ហើយ។ យើងបានជំនួសផ្នែកខ្លះរបស់វាច្រើនដងណាស់ ប៉ុន្តែមិនដែលជំនួសទាំងអស់ក្នុងពេលតែមួយទេ — វានៅតែជាដំបូលដដែល គ្រាន់តែបានជួសជុលថ្មី។" — ដកស្រង់ពីគ្រួសារអ្នករួមចំណែកនៅខេត្តកំពង់ស្ពឺ។',
    },
  },

  // -------------------------------------------------------------------------
  // arch-07 — drying
  // -------------------------------------------------------------------------
  "drying-technique-for-longer-lasting-panels": {
    contributor: {
      en: "Community Elder Interview",
      km: "សម្ភាសន៍ជាមួយចាស់ទុំសហគមន៍",
    },
    title: {
      en: "Drying Leaves in the Shade",
      km: "ការហាលស្លឹកក្នុងម្លប់",
    },
    description: {
      en: "Some households refuse to dry palm leaves in full sun. Slower drying in the shade, they say, gives panels that bend instead of splitting.",
      km: "គ្រួសារខ្លះមិនព្រមហាលស្លឹកត្នោតក្រោមពន្លឺថ្ងៃផ្ទាល់ទេ។ ពួកគេថា ការហាលយឺតៗក្នុងម្លប់ ផ្តល់បន្ទះដែលបត់បាន ជាជាងប្រេះ។",
    },
    imageAlt: {
      en: "Palm leaves resting on a raised bamboo rack under a shaded shelter",
      km: "ស្លឹកត្នោតដាក់លើរនាបឫស្សីក្រោមម្លប់",
    },
    location: {
      en: "Kampong Chhnang Province, Cambodia",
      km: "ខេត្តកំពង់ឆ្នាំង ប្រទេសកម្ពុជា",
    },
    introduction: {
      en: "Drying is the quietest stage of the work and the one most often rushed. In Kampong Chhnang some households dry their leaves under an open-sided shelter instead of laying them in the open sun, turning them once a day for several days. The leaves take longer to be ready, but they stay supple enough to fold without cracking — and a leaf that folds cleanly is a leaf that will not leak.",
      km: "ការហាលស្លឹកគឺជាដំណាក់កាលស្ងប់ស្ងាត់បំផុតនៃការងារ ហើយក៏ជាដំណាក់កាលដែលគេប្រញាប់បំផុតដែរ។ នៅខេត្តកំពង់ឆ្នាំង គ្រួសារខ្លះហាលស្លឹកក្រោមសំណាក់ដែលបើកចំហចំហៀង ជាជាងដាក់ក្រោមពន្លឺថ្ងៃផ្ទាល់ ដោយបង្វិលស្លឹកម្តងក្នុងមួយថ្ងៃ អស់រយៈពេលច្រើនថ្ងៃ។ ស្លឹកចំណាយពេលយូរជាងមុនទើបស្ងួត ប៉ុន្តែនៅទន់ល្មមបត់បានដោយមិនប្រេះ — ហើយស្លឹកដែលបត់បានស្អាត គឺជាស្លឹកដែលនឹងមិនលេចទឹក។",
    },
    steps: [
      {
        title: {
          en: "Building a raised rack",
          km: "ការធ្វើរនាបហាល",
        },
        description: {
          en: "A simple rack of bamboo is raised off the ground so air can move under the leaves as well as over them. Leaves laid straight on the earth pick up damp and stain, however dry the weather is.",
          km: "រនាបឫស្សីសាមញ្ញមួយត្រូវលើកឱ្យផុតពីដី ដើម្បីឱ្យខ្យល់ចេញចូលបានទាំងពីក្រោម ទាំងពីលើស្លឹក។ ស្លឹកដែលដាក់ផ្ទាល់លើដីនឹងស្រូបយកសំណើម និងកើតស្នាម ទោះអាកាសធាតុស្ងួតយ៉ាងណាក៏ដោយ។",
        },
      },
      {
        title: {
          en: "Drying in partial shade",
          km: "ការហាលក្នុងម្លប់ស្រាល",
        },
        description: {
          en: "The rack sits under a roof with open sides: enough air and light to dry the leaves, but no direct sun and no damp rising from the ground. The leaves darken slowly and evenly instead of bleaching at the edges.",
          km: "រនាបនោះស្ថិតនៅក្រោមដំបូលដែលបើកចំហចំហៀង៖ មានខ្យល់ និងពន្លឺគ្រប់គ្រាន់ឱ្យស្លឹកស្ងួត ប៉ុន្តែគ្មានពន្លឺថ្ងៃផ្ទាល់ និងគ្មានសំណើមឡើងពីដី។ ស្លឹកប្រែពណ៌ចាស់បន្តិចម្តងៗដោយស្មើ ជាជាងស្លេកនៅជាយ។",
        },
      },
      {
        title: {
          en: "Turning the leaves every day",
          km: "ការបង្វិលស្លឹករៀងរាល់ថ្ងៃ",
        },
        description: {
          en: "Once a day the leaves are turned so that both faces dry at the same rate. A leaf dried on one side only curls to that side and will never lie flat on the roof.",
          km: "ម្តងក្នុងមួយថ្ងៃ ស្លឹកត្រូវបង្វិល ដើម្បីឱ្យផ្នែកទាំងសងខាងស្ងួតក្នុងល្បឿនស្មើគ្នា។ ស្លឹកដែលស្ងួតតែម្ខាងនឹងរមួលទៅម្ខាងនោះ ហើយមិនអាចដាក់ឱ្យស្មើលើដំបូលបានឡើយ។",
        },
      },
    ],
    tips: [
      {
        en: "Leaves dried too fast in direct sun turn brittle and split along the fold during weaving.",
        km: "ស្លឹកដែលហាលក្រោមពន្លឺថ្ងៃផ្ទាល់លឿនពេក នឹងក្លាយជាស្លឹកស្ងួតផ្តាច់ ហើយប្រេះតាមជ្រុងបត់ពេលត្បាញ។",
      },
      {
        en: "An even, gentle colour across the leaf is the sign that drying has gone well.",
        km: "ពណ៌ស្មើ និងស្រាលលើស្លឹកទាំងមូល គឺជាសញ្ញាថាការហាលបានល្អ។",
      },
      {
        en: "A leaf is dry enough when it rustles in the hand and the spine snaps instead of bending.",
        km: "ស្លឹកស្ងួតគ្រប់គ្រាន់ នៅពេលវាបន្លឺសំឡេងពេលកាន់ ហើយឆ្អឹងស្លឹកដាច់ ជាជាងបត់។",
      },
    ],
    contributorStory: {
      en: '"Direct sun is fast, but fast is not always better. Slow drying in the shade was something my grandfather insisted on, even when the family was in a hurry to finish a roof." — as recalled by a community elder in Kampong Chhnang.',
      km: '"ពន្លឺថ្ងៃផ្ទាល់ហាលលឿន ប៉ុន្តែលឿនមិនមែនល្អជាងគេជានិច្ចទេ។ តាខ្ញុំតែងទទូចឱ្យហាលយឺតៗក្នុងម្លប់ ទោះបីគ្រួសារកំពុងប្រញាប់ធ្វើដំបូលឱ្យរួចក៏ដោយ។" — ដកស្រង់ពីការចងចាំរបស់ចាស់ទុំម្នាក់នៅខេត្តកំពង់ឆ្នាំង។',
    },
  },

  // -------------------------------------------------------------------------
  // arch-08 — the tools
  // -------------------------------------------------------------------------
  "the-tools-of-a-traditional-thatcher": {
    contributor: {
      en: "Community Elder Interview",
      km: "សម្ភាសន៍ជាមួយចាស់ទុំសហគមន៍",
    },
    title: {
      en: "The Tools of a Traditional Thatcher",
      km: "ឧបករណ៍របស់ជាងប្រក់ស្លឹកត្នោត",
    },
    description: {
      en: "Four simple tools carry the whole craft: a knife, a splitting tool, a measuring stick and a bamboo ladder.",
      km: "ឧបករណ៍សាមញ្ញតែបួនប៉ុណ្ណោះ គ្រប់គ្រាន់សម្រាប់ការងារទាំងមូល៖ កាំបិត ឧបករណ៍ច្រៀកវល្លិ ដងវាស់ និងជណ្តើរឫស្សី។",
    },
    imageAlt: {
      en: "Handmade palm-leaf thatching tools resting on a wooden bench",
      km: "ឧបករណ៍ប្រក់ស្លឹកត្នោតធ្វើដោយដៃ ដាក់លើកន្លែងឈើ",
    },
    location: {
      en: "Takeo Province, Cambodia",
      km: "ខេត្តតាកែវ ប្រទេសកម្ពុជា",
    },
    introduction: {
      en: "Walk into any household that still covers its own roof and you will not find a workshop. You will find a knife, a length of bamboo for measuring, something to split rattan, and a ladder leaning against the palm. Most of these tools were made by the person using them, or inherited from a parent, and many have been sharpened or repaired far more often than they have been replaced.",
      km: "ចូលទៅក្នុងគ្រួសារណាមួយដែលនៅតែប្រក់ដំបូលដោយខ្លួនឯង អ្នកនឹងមិនឃើញសិក្ខាសាលាអ្វីធំដុំទេ។ អ្នកនឹងឃើញតែកាំបិតមួយ ឫស្សីមួយដងសម្រាប់វាស់ ឧបករណ៍មួយសម្រាប់ច្រៀកវល្លិ និងជណ្តើរមួយផ្អែកនឹងដើមត្នោត។ ឧបករណ៍ទាំងនេះភាគច្រើនធ្វើឡើងដោយអ្នកដែលប្រើវាផ្ទាល់ ឬទទួលមរតកពីឪពុកម្តាយ ហើយជាច្រើនត្រូវសំលៀង ឬជួសជុលច្រើនដងជាងការជំនួសទៅទៀត។",
    },
    steps: [
      {
        title: {
          en: "The cutting knife",
          km: "កាំបិតកាត់ស្លឹក",
        },
        description: {
          en: "A short, slightly curved blade cuts fronds from the palm and trims damaged leaflets afterwards. It is kept sharp on a stone at home; a blunt knife bruises the leaf instead of cutting it, and a bruised leaf rots early.",
          km: "កាំបិតខ្លី កោងបន្តិច ប្រើសម្រាប់កាត់ស្លឹកពីដើមត្នោត និងកាត់ស្លឹកដែលខូចចេញនៅពេលក្រោយ។ កាំបិតត្រូវសំលៀងនឹងថ្មនៅផ្ទះ ព្រោះកាំបិតខឹងនឹងធ្វើឱ្យស្លឹកថ្នាំង ជាជាងកាត់ឱ្យដាច់ ហើយស្លឹកដែលថ្នាំងនឹងរលួយលឿន។",
        },
      },
      {
        title: {
          en: "The splitting tool",
          km: "ឧបករណ៍ច្រៀកវល្លិ",
        },
        description: {
          en: "A narrow blade of wood, bone or metal splits rattan and vine into strips thin enough to tie a panel without cutting into the leaves. The strips are soaked before use so they can be pulled tight.",
          km: "ដងវល្លិ ឬដែកស្តើងមួយ ប្រើសម្រាប់ច្រៀកវល្លិឱ្យជាចំណាត់ស្តើងល្មម ដើម្បីចងបន្ទះដោយមិនកាត់ចូលស្លឹក។ ចំណាត់វល្លិត្រូវត្រាំទឹកមុនប្រើ ដើម្បីឱ្យអាចរឹតបានតឹង។",
        },
      },
      {
        title: {
          en: "The measuring stick",
          km: "ដងវាស់",
        },
        description: {
          en: "A length of bamboo marked with notches is used to keep the spacing of rafters and the width of panels the same. Guessing by eye is how a roof ends up with one row tighter than the next.",
          km: "ឫស្សីមួយដងដែលកាត់ស្នាមសម្គាល់ ប្រើសម្រាប់រក្សាចន្លោះឈើទ្រដំបូល និងទទឹងបន្ទះឱ្យស្មើគ្នា។ ការប៉ាន់ស្មានដោយភ្នែក គឺជាមូលហេតុដែលធ្វើឱ្យដំបូលមានជួរមួយតឹងជាងជួរមួយទៀត។",
        },
      },
      {
        title: {
          en: "The bamboo ladder",
          km: "ជណ្តើរឫស្សី",
        },
        description: {
          en: "A bamboo ladder is leaned against the palm to reach the fronds, and later against the house during repair. Raising and lowering it is usually work for two people, and children are kept well away from it.",
          km: "ជណ្តើរឫស្សីត្រូវផ្អែកនឹងដើមត្នោត ដើម្បីឡើងទៅកាត់ស្លឹក ហើយក្រោយមកផ្អែកនឹងផ្ទះពេលជួសជុលដំបូល។ ការលើក និងបញ្ចុះជណ្តើរនេះជាធម្មតាត្រូវការមនុស្សពីរនាក់ ហើយកុមារត្រូវនៅឱ្យឆ្ងាយពីវា។",
        },
      },
    ],
    tips: [
      {
        en: "Many of these tools were made at home and passed down, not bought.",
        km: "ឧបករណ៍ទាំងនេះភាគច្រើនធ្វើឡើងនៅផ្ទះ ហើយបន្តពីមួយជំនាន់ទៅមួយជំនាន់ មិនមែនទិញពីផ្សារទេ។",
      },
      {
        en: "A well-kept knife is a point of pride: older thatchers judge a tool before they judge the work.",
        km: "កាំបិតដែលថែរក្សាល្អ ជាមោទនភាពរបស់ម្ចាស់វា៖ ជាងប្រក់ស្លឹកចាស់ៗតែងវាយតម្លៃឧបករណ៍មុនពេលវាយតម្លៃការងារ។",
      },
      {
        en: "Tools are counted and put away after each job; a knife left in the yard is a knife that goes missing.",
        km: "បន្ទាប់ពីធ្វើការរួច ឧបករណ៍ត្រូវរាប់ និងដាក់ចូលកន្លែងវិញ៖ កាំបិតដែលទុកចោលក្នុងចំណោមផ្ទះ គឺជាកាំបិតដែលបាត់។",
      },
    ],
    contributorStory: {
      en: '"This knife belonged to my father. I have sharpened it more times than I can count, but I have never replaced it." — as recalled by a community elder in Takeo.',
      km: '"កាំបិតនេះជារបស់ពុកខ្ញុំ។ ខ្ញុំបានសំលៀងវាច្រើនដងរាប់មិនអស់ ប៉ុន្តែខ្ញុំមិនដែលប្តូរវាថ្មីទេ។" — ដកស្រង់ពីការចងចាំរបស់ចាស់ទុំម្នាក់នៅខេត្តតាកែវ។',
    },
  },

};

export function getEntryContent(slug) {
  return entryContent[slug] ?? null;
}
