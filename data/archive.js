import { images } from "@/lib/images";
import { entryContent } from "./entry-content.js";

/**
 * Archive entries.
 *
 * The human-readable copy lives in `data/entry-content.js` as `{ en, km }`
 * pairs, so this file only holds the parts that make an entry an archive
 * record: its identity, its subject, the photograph, and the relations to
 * technique steps, gallery photographs and contributors.
 *
 * `content()` throws when a slug has no bilingual copy, so a typo can never
 * ship an entry that renders half in English and half in Khmer.
 */
const content = (slug) => {
  const entry = entryContent[slug];

  if (!entry) {
    throw new Error(`Missing bilingual content for archive entry "${slug}"`);
  }

  return entry;
};

export const archiveItems = [
  {
    id: "arch-01",
    slug: "preparing-palm-leaves-for-house-covering",
    ...content("preparing-palm-leaves-for-house-covering"),
    // Topic: the subject this entry belongs to. Kept separate from `title`,
    // which carries the document title.
    primaryTopicSlug: "palm-leaf-houses",
    topicSlugs: ["palm-leaf-houses", "palm-leaf-preparation"],
    category: "Palm Leaf Preparation",
    image: images.archive1,
    personId: "person-community-elder",
    techniqueStepIds: ["step-01-selecting", "step-02-preparing"],
    galleryIds: ["gal-01", "gal-05"],
    relatedImages: [
      {
        src: images.archive7,
        alt: {
          en: "Rack used for drying palm leaves in the shade",
          km: "រនាបប្រើសម្រាប់ហាលស្លឹកត្នោតក្នុងម្លប់",
        },
      },
      {
        src: images.categoryPreparing,
        alt: {
          en: "Close-up of cleaned palm leaflets",
          km: "រូបភាពជិតនៃស្លឹកត្នោតតូចៗដែលសម្អាតរួច",
        },
      },
    ],
    featured: true,
    isSample: true,
  },
  {
    id: "arch-02",
    slug: "the-cross-weave-pattern",
    ...content("the-cross-weave-pattern"),
    primaryTopicSlug: "roof-covering",
    topicSlugs: ["roof-covering", "leaf-weaving"],
    category: "Weaving Techniques",
    image: images.archive2,
    personId: "person-community-elder",
    techniqueStepIds: ["step-04-weaving"],
    galleryIds: ["gal-04", "gal-09"],
    relatedImages: [
      {
        src: images.categoryWeaving,
        alt: {
          en: "Hands weaving palm leaflets over a spine",
          km: "ដៃកំពុងត្បាញស្លឹកត្នោតតូចៗលើឆ្អឹងស្លឹក",
        },
      },
      {
        src: images.archive4,
        alt: {
          en: "Completed woven panel resting against a wall",
          km: "បន្ទះស្លឹកដែលត្បាញរួច ផ្អែកនឹងជញ្ជាំង",
        },
      },
    ],
    featured: true,
    isSample: true,
  },
  {
    id: "arch-03",
    slug: "raising-the-roof-frame",
    ...content("raising-the-roof-frame"),
    primaryTopicSlug: "wall-covering",
    topicSlugs: ["wall-covering", "house-construction"],
    category: "House Construction",
    image: images.archive3,
    personId: "person-family-uncle",
    // No technique step covers framing.
    techniqueStepIds: [],
    galleryIds: ["gal-10"],
    relatedImages: [
      {
        src: images.categoryAttaching,
        alt: {
          en: "Close-up of lashings holding a roof frame together",
          km: "រូបភាពជិតនៃចំណងដែលចងគ្រោងដំបូលឱ្យជាប់គ្នា",
        },
      },
      {
        src: images.archive6,
        alt: {
          en: "Finished traditional house with a palm-leaf roof",
          km: "ផ្ទះប្រពៃណីដែលសាងសង់រួច មានដំបូលប្រក់ស្លឹកត្នោត",
        },
      },
    ],
    isSample: true,
  },
  {
    id: "arch-04",
    slug: "tying-panels-to-the-roof-frame",
    ...content("tying-panels-to-the-roof-frame"),
    primaryTopicSlug: "palm-leaf-preparation",
    topicSlugs: ["palm-leaf-preparation", "roof-covering"],
    category: "Attachment Techniques",
    image: images.archive4,
    personId: "person-community-elder",
    techniqueStepIds: ["step-05-attaching"],
    galleryIds: ["gal-06"],
    relatedImages: [
      {
        src: images.archive3,
        alt: {
          en: "Roof frame ready for the panels to be tied on",
          km: "គ្រោងដំបូលរួចរាល់សម្រាប់ចងបន្ទះស្លឹក",
        },
      },
      {
        src: images.categoryHouses,
        alt: {
          en: "Completed palm-leaf roof on a family house",
          km: "ដំបូលស្លឹកត្នោតដែលប្រក់រួចលើផ្ទះគ្រួសារ",
        },
      },
    ],
    featured: true,
    isSample: true,
  },
  {
    id: "arch-05",
    slug: "seasonal-roof-repair",
    ...content("seasonal-roof-repair"),
    primaryTopicSlug: "leaf-weaving",
    topicSlugs: ["leaf-weaving", "maintenance-repair"],
    category: "Maintenance & Repair",
    image: images.archive5,
    personId: "person-community-elder",
    techniqueStepIds: ["step-06-maintaining", "step-04-weaving"],
    galleryIds: ["gal-09"],
    relatedImages: [
      {
        src: images.categoryMaintaining,
        alt: {
          en: "Close-up of a patched section of a palm-leaf roof",
          km: "រូបភាពជិតនៃផ្នែកដំបូលស្លឹកត្នោតដែលបានបំណះ",
        },
      },
      {
        src: images.categoryPreparing,
        alt: {
          en: "Freshly prepared leaves ready for patching",
          km: "ស្លឹកដែលទើបរៀបចំរួច ត្រៀមសម្រាប់បំណះ",
        },
      },
    ],
    isSample: true,
  },
  {
    id: "arch-06",
    slug: "the-family-house-in-kampong-speu",
    ...content("the-family-house-in-kampong-speu"),
    primaryTopicSlug: "house-construction",
    topicSlugs: ["house-construction", "traditional-house-types"],
    category: "Traditional Houses",
    image: images.archive6,
    personId: "person-household-visit",
    // Its steps describe the standing house, not a leaf-working stage.
    techniqueStepIds: [],
    galleryIds: ["gal-02", "gal-07", "gal-12"],
    relatedImages: [
      {
        src: images.categoryHouses,
        alt: {
          en: "Wide view of a traditional house raised on posts",
          km: "រូបភាពទូលាយនៃផ្ទះប្រពៃណីដែលលើកកំពស់លើសសរ",
        },
      },
      {
        src: images.archive4,
        alt: {
          en: "Detail of overlapping roof panels on the same house",
          km: "រូបភាពលម្អិតនៃបន្ទះដំបូលត្រួតគ្នានៅលើផ្ទះដដែល",
        },
      },
    ],
    featured: true,
    isSample: true,
  },
  {
    id: "arch-07",
    slug: "drying-technique-for-longer-lasting-panels",
    ...content("drying-technique-for-longer-lasting-panels"),
    primaryTopicSlug: "traditional-house-types",
    topicSlugs: ["traditional-house-types", "palm-leaf-preparation"],
    category: "Palm Leaf Preparation",
    image: images.archive7,
    personId: "person-community-elder",
    techniqueStepIds: ["step-03-drying"],
    galleryIds: ["gal-05", "gal-13"],
    relatedImages: [
      {
        src: images.archive1,
        alt: {
          en: "Bundles of leaves ready for the drying rack",
          km: "បាច់ស្លឹកត្រៀមរួចសម្រាប់ដាក់លើរនាបហាល",
        },
      },
      {
        src: images.categoryPreparing,
        alt: {
          en: "Close view of leaves changing colour as they dry",
          km: "រូបភាពជិតនៃស្លឹកដែលកំពុងប្រែពណ៌ពេលស្ងួត",
        },
      },
    ],
    isSample: true,
  },
  {
    id: "arch-08",
    slug: "the-tools-of-a-traditional-thatcher",
    ...content("the-tools-of-a-traditional-thatcher"),
    primaryTopicSlug: "maintenance-repair",
    topicSlugs: ["maintenance-repair", "tools"],
    category: "Weaving Techniques",
    image: images.archive8,
    personId: "person-community-elder",
    // Tools are not one of the leaf-processing stages.
    techniqueStepIds: [],
    galleryIds: ["gal-03"],
    relatedImages: [
      {
        src: images.categoryWeaving,
        alt: {
          en: "Close-up of hands using a splitting tool",
          km: "រូបភាពជិតនៃដៃកំពុងប្រើឧបករណ៍ច្រៀកវល្លិ",
        },
      },
      {
        src: images.archive2,
        alt: {
          en: "A finished weave made with these traditional tools",
          km: "ការត្បាញដែលរួចរាល់ ធ្វើឡើងដោយឧបករណ៍ប្រពៃណីទាំងនេះ",
        },
      },
    ],
    isSample: true,
  },
];

export function getArchiveItemBySlug(slug) {
  return archiveItems.find((item) => item.slug === slug);
}

export function getFeaturedArchiveItems() {
  return archiveItems.filter((item) => item.featured && !item.isSample);
}

export function getRelatedArchiveItems(current, count = 3) {
  return archiveItems
    .filter(
      (item) =>
        !item.isSample &&
        item.id !== current.id &&
        item.category === current.category,
    )
    .slice(0, count)
    .concat(
      archiveItems.filter(
        (item) =>
          !item.isSample &&
          item.id !== current.id &&
          item.category !== current.category,
      ),
    )
    .slice(0, count);
}
