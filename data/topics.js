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
 * The names below are kept byte-identical to those original labels so existing
 * Khmer translations in `lang/i18n.js` (keyed by the English label) keep
 * resolving, and so no visible copy changes.
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
    name: "Palm-Leaf Houses",
    scope: "archive",
    description:
      "Explore traditional Khmer houses that use palm leaves as a natural material for roofing and walls.",
  },
  {
    id: "topic-roof-covering",
    slug: "roof-covering",
    name: "Roof Covering",
    scope: "archive",
    description:
      "Discover how palm leaves are prepared, layered, and secured to create durable traditional roofing.",
  },
  {
    id: "topic-wall-covering",
    slug: "wall-covering",
    name: "Wall Covering",
    scope: "archive",
    description:
      "Learn how palm leaves are woven, arranged, and attached to form natural walls that provide shade and ventilation.",
  },
  {
    id: "topic-palm-leaf-preparation",
    slug: "palm-leaf-preparation",
    name: "Palm Leaf Preparation",
    scope: "archive",
    description:
      "Learn how palm leaves are selected, cut, dried, and prepared before being used for house construction.",
  },
  {
    id: "topic-leaf-weaving",
    slug: "leaf-weaving",
    name: "Leaf Weaving",
    scope: "archive",
    description:
      "Explore traditional methods of arranging, weaving, sewing, and binding palm leaves into usable panels.",
  },
  {
    id: "topic-house-construction",
    slug: "house-construction",
    name: "House Construction",
    scope: "archive",
    description:
      "Discover how prepared palm-leaf materials are attached to the wooden or bamboo structure of a traditional house.",
  },
  {
    id: "topic-traditional-house-types",
    slug: "traditional-house-types",
    name: "Traditional House Types",
    scope: "archive",
    description:
      "Explore different forms of traditional houses that incorporate palm leaves as part of their construction and covering.",
  },
  {
    id: "topic-maintenance-repair",
    slug: "maintenance-repair",
    name: "Maintenance & Repair",
    scope: "archive",
    description:
      "Learn traditional ways of maintaining, replacing, and repairing palm-leaf roofs and walls to extend their use.",
  },

  // ---- previously the `category` of a gallery image ----------------------
  {
    id: "topic-palm-leaves",
    slug: "palm-leaves",
    name: "Palm Leaves",
    scope: "gallery",
  },
  {
    id: "topic-traditional-houses",
    slug: "traditional-houses",
    name: "Traditional Houses",
    scope: "gallery",
  },
  { id: "topic-tools", slug: "tools", name: "Tools", scope: "gallery" },
  { id: "topic-weaving", slug: "weaving", name: "Weaving", scope: "gallery" },
  {
    id: "topic-preparing-leaves",
    slug: "preparing-leaves",
    name: "Preparing Leaves",
    scope: "gallery",
  },
  {
    id: "topic-attaching-palm-leaves",
    slug: "attaching-palm-leaves",
    name: "Attaching Palm Leaves",
    scope: "gallery",
  },
  {
    id: "topic-finished-houses",
    slug: "finished-houses",
    name: "Finished Houses",
    scope: "gallery",
  },
  {
    id: "topic-community-members",
    slug: "community-members",
    name: "Community Members",
    scope: "gallery",
  },
];

export function getTopicBySlug(slug) {
  return topics.find((topic) => topic.slug === slug);
}