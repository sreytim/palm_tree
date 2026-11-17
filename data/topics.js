/**
 * Topic vocabulary.
 *
 * A single source of truth for the *subject* an archive entry, technique step
 * or gallery photograph is about. Previously this information was duplicated
 * and drifting across three places — the archive entry `title` field, the
 * gallery `category` field, and the hardcoded list in
 * `components/layout/Footer.js`.
 *
 * `scope` records where a topic came from:
 *   "archive" — was the `title` of an archive entry
 *   "gallery" — was the `category` of a gallery image
 * `name` and `description` carry both languages, so a topic chip renders in the
 * selected language instead of depending on a separate translation dictionary
 * keyed by the English wording.
 *
 * NOTE — merge candidates (editorial decision, not a code change):
 * these pairs describe overlapping subject matter and could be merged once
 * the wording is agreed:
 *   "Traditional House Types" / "Traditional Houses"
 *   "Leaf Weaving"            / "Weaving"
 *   "Palm Leaf Preparation"   / "Preparing Leaves" / "Palm Leaves"
 *   "Palm-Leaf Houses"        / "Finished Houses"
 */
export const topics = [
  // ---- previously the `title` of an archive entry ------------------------
  {
    id: "topic-palm-leaf-houses",
    slug: "palm-leaf-houses",
    name: { en: "Palm-Leaf Houses", km: "ផ្ទះប្រក់ស្លឹកត្នោត" },
    scope: "archive",
    description: {
      en: "Explore traditional Khmer houses that use palm leaves as a natural material for roofing and walls.",
      km: "ផ្ទះខ្មែរប្រពៃណី ដែលប្រើស្លឹកត្នោតជាសម្ភារៈធម្មជាតិសម្រាប់ដំបូល និងជញ្ជាំង។",
    },
  },
  {
    id: "topic-roof-covering",
    slug: "roof-covering",
    name: { en: "Roof Covering", km: "ការប្រក់ដំបូល" },
    scope: "archive",
    description: {
      en: "Discover how palm leaves are prepared, layered, and secured to create durable traditional roofing.",
      km: "ស្វែងយល់ពីរបៀបរៀបចំ តម្រៀប និងចងស្លឹកត្នោត ដើម្បីធ្វើដំបូលប្រពៃណីដែលប្រើបានយូរ។",
    },
  },
  {
    id: "topic-wall-covering",
    slug: "wall-covering",
    name: { en: "Wall Covering", km: "ការបាំងជញ្ជាំង" },
    scope: "archive",
    description: {
      en: "Learn how palm leaves are woven, arranged, and attached to form natural walls that provide shade and ventilation.",
      km: "រៀនពីរបៀបត្បាញ តម្រៀប និងភ្ជាប់ស្លឹកត្នោត ដើម្បីធ្វើជញ្ជាំងធម្មជាតិ ដែលផ្តល់ម្លប់ និងខ្យល់ចេញចូល។",
    },
  },
  {
    id: "topic-palm-leaf-preparation",
    slug: "palm-leaf-preparation",
    name: { en: "Palm Leaf Preparation", km: "ការរៀបចំស្លឹកត្នោត" },
    scope: "archive",
    description: {
      en: "Learn how palm leaves are selected, cut, dried, and prepared before being used for house construction.",
      km: "រៀនពីរបៀបជ្រើសរើស កាត់ ហាល និងរៀបចំស្លឹកត្នោត មុនពេលយកទៅសាងសង់ផ្ទះ។",
    },
  },
  {
    id: "topic-leaf-weaving",
    slug: "leaf-weaving",
    name: { en: "Leaf Weaving", km: "ការត្បាញស្លឹកត្នោត" },
    scope: "archive",
    description: {
      en: "Explore traditional methods of arranging, weaving, sewing, and binding palm leaves into usable panels.",
      km: "ស្វែងយល់ពីវិធីប្រពៃណី ក្នុងការតម្រៀប ត្បាញ ដេរ និងចងស្លឹកត្នោតឱ្យក្លាយជាបន្ទះដែលអាចប្រើបាន។",
    },
  },
  {
    id: "topic-house-construction",
    slug: "house-construction",
    name: { en: "House Construction", km: "ការសាងសង់ផ្ទះ" },
    scope: "archive",
    description: {
      en: "Discover how prepared palm-leaf materials are attached to the wooden or bamboo structure of a traditional house.",
      km: "ស្វែងយល់ពីរបៀបភ្ជាប់ស្លឹកត្នោតដែលរៀបចំរួច ទៅនឹងគ្រោងឈើ ឬឫស្សីរបស់ផ្ទះប្រពៃណី។",
    },
  },
  {
    id: "topic-traditional-house-types",
    slug: "traditional-house-types",
    name: { en: "Traditional House Types", km: "ប្រភេទផ្ទះប្រពៃណី" },
    scope: "archive",
    description: {
      en: "Explore different forms of traditional houses that incorporate palm leaves as part of their construction and covering.",
      km: "ស្វែងយល់ពីប្រភេទផ្សេងៗនៃផ្ទះប្រពៃណី ដែលប្រើស្លឹកត្នោតជាផ្នែកមួយនៃការសាងសង់ និងការប្រក់ដំបូល។",
    },
  },
  {
    id: "topic-maintenance-repair",
    slug: "maintenance-repair",
    name: { en: "Maintenance & Repair", km: "ការថែទាំ និងជួសជុល" },
    scope: "archive",
    description: {
      en: "Learn traditional ways of maintaining, replacing, and repairing palm-leaf roofs and walls to extend their use.",
      km: "រៀនពីវិធីប្រពៃណី ក្នុងការថែទាំ ជំនួស និងជួសជុលដំបូល និងជញ្ជាំងស្លឹកត្នោត ដើម្បីប្រើបានយូរ។",
    },
  },

  // ---- previously the `category` of a gallery image ----------------------
  {
    id: "topic-palm-leaves",
    slug: "palm-leaves",
    name: { en: "Palm Leaves", km: "ស្លឹកត្នោត" },
    scope: "gallery",
  },
  {
    id: "topic-traditional-houses",
    slug: "traditional-houses",
    name: { en: "Traditional Houses", km: "ផ្ទះប្រពៃណី" },
    scope: "gallery",
  },
  { id: "topic-tools", slug: "tools", name: { en: "Tools", km: "ឧបករណ៍" }, scope: "gallery" },
  { id: "topic-weaving", slug: "weaving", name: { en: "Weaving", km: "ការត្បាញ" }, scope: "gallery" },
  {
    id: "topic-preparing-leaves",
    slug: "preparing-leaves",
    name: { en: "Preparing Leaves", km: "ការរៀបចំស្លឹក" },
    scope: "gallery",
  },
  {
    id: "topic-attaching-palm-leaves",
    slug: "attaching-palm-leaves",
    name: { en: "Attaching Palm Leaves", km: "ការភ្ជាប់ស្លឹកត្នោត" },
    scope: "gallery",
  },
  {
    id: "topic-finished-houses",
    slug: "finished-houses",
    name: { en: "Finished Houses", km: "ផ្ទះដែលសាងសង់រួច" },
    scope: "gallery",
  },
  {
    id: "topic-community-members",
    slug: "community-members",
    name: { en: "Community Members", km: "សមាជិកសហគមន៍" },
    scope: "gallery",
  },
];

export function getTopicBySlug(slug) {
  return topics.find((topic) => topic.slug === slug);
}