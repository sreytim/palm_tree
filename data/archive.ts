import { ArchiveItem } from "@/lib/types";
import { images } from "@/lib/images";

/**
 * Sample Archive Entries
 *
 * All entries below are labeled example content, written to demonstrate
 * the structure of a real archive entry. Replace the text, images, and
 * contributor details with real interviews as they are collected — the
 * shape of this object (id, slug, category, steps, tips, etc.) is designed
 * to map directly onto a database or CMS later.
 */
export const archiveItems: ArchiveItem[] = [
  {
    id: "arch-01",
    slug: "preparing-palm-leaves-for-house-covering",
    title: "Preparing Palm Leaves for House Covering",
    category: "Palm Leaf Preparation",
    description:
      "An overview of how palm leaves are selected, cleaned, dried, and prepared before they are used to cover a traditional house.",
    image: images.archive1,
    imageAlt: "Bundles of palm leaves laid out to prepare for house covering",
    contributor: "Community Elder Interview",
    location: "Kampong Speu Province, Cambodia (sample)",
    date: "March 2024",
    introduction:
      "Before a single leaf touches the frame of a roof, it passes through many hands. This entry documents the preparation stage as described by a community elder who learned the technique from her mother in the 1960s. Preparation is considered the foundation of a durable roof — leaves that are poorly chosen or poorly dried will not last a single rainy season.",
    steps: [
      {
        title: "Selecting mature fronds",
        description:
          "Only fully mature, unopened palm fronds are chosen. Younger leaves are too soft and tear easily; leaves that are too old have already begun to dry unevenly on the tree and become brittle.",
      },
      {
        title: "Cutting in the early morning",
        description:
          "Fronds are cut early in the day, while the plant retains moisture and the leaf fibers are more flexible, making them easier to bundle and transport without cracking.",
      },
      {
        title: "Removing damaged leaflets",
        description:
          "Each frond is checked by hand. Leaflets that are torn, insect-damaged, or discolored are trimmed away so they do not weaken the finished panel.",
      },
      {
        title: "Bundling for transport",
        description:
          "Cleaned fronds are tied into loose bundles with a length of vine or rope, spine-side out, to prevent the delicate leaflets from being crushed on the way back to the household.",
      },
    ],
    tips: [
      "Leaves cut during the dry season are said to hold their shape longer once woven.",
      "A frond that springs back after being gently bent is considered ready; one that stays folded is too old.",
    ],
    contributorStory:
      "\"My mother would wake before sunrise during harvest weeks. She always said the leaf remembers how it was cut — if you tear it in anger, it will tear again on the roof.\" — as recalled by a community elder, sample contributor.",
    relatedImages: [
      { src: images.archive7, alt: "Rack used for drying palm leaves in the sun" },
      { src: images.categoryPreparing, alt: "Close-up of cleaned palm leaflets" },
    ],
    featured: true,
    isSample: true,
  },
  {
    id: "arch-02",
    slug: "the-cross-weave-pattern",
    title: "The Cross-Weave Pattern for Roof Panels",
    category: "Weaving Techniques",
    description:
      "A step-by-step look at the traditional cross-weave used to bind individual palm leaflets into a single watertight panel.",
    image: images.archive2,
    imageAlt: "Detail of a woven palm leaf roofing panel showing the cross pattern",
    contributor: "Community Elder Interview",
    location: "Takeo Province, Cambodia (sample)",
    date: "April 2024",
    introduction:
      "The cross-weave is the technique most families in this community used to bind loose leaflets into a single rigid panel strong enough to shed monsoon rain. This entry breaks the weave into its component folds, as demonstrated by a retired thatcher during a recorded interview.",
    steps: [
      {
        title: "Folding over the spine",
        description:
          "Each leaflet is folded over a central bamboo or wood spine so that two even lengths of leaf hang on either side.",
      },
      {
        title: "Crossing alternate leaflets",
        description:
          "Working down the spine, alternating leaflets are crossed over one another, left over right, then right over left, to lock them in place without any binding.",
      },
      {
        title: "Compressing the weave",
        description:
          "After every few crossings, the weaver presses the leaflets tightly together by hand so that no gaps remain for water to pass through.",
      },
      {
        title: "Securing the row",
        description:
          "A thin strip of split rattan or vine is threaded along the base of the row to hold the completed section firm before it is set aside to dry flat.",
      },
    ],
    tips: [
      "A tighter weave near the base of the panel prevents water from pooling where the roof will overlap.",
      "Weaving is traditionally done in the shade to keep the leaves pliable for longer.",
    ],
    contributorStory:
      "\"It took me two rainy seasons of watching before my hands understood the rhythm. My grandmother never explained it in words — she just wove, and I copied.\" — as recalled by a community contributor, sample entry.",
    relatedImages: [
      { src: images.categoryWeaving, alt: "Hands weaving palm leaflets over a spine" },
      { src: images.archive4, alt: "Completed woven panel resting against a wall" },
    ],
    featured: true,
    isSample: true,
  },
  {
    id: "arch-03",
    slug: "raising-the-roof-frame",
    title: "Raising the Roof Frame Before Covering",
    category: "House Construction",
    description:
      "How the wooden or bamboo frame of a traditional house is built to support woven palm-leaf panels, including spacing and pitch.",
    image: images.archive3,
    imageAlt: "Bamboo frame of a traditional house under construction",
    contributor: "Family Interview, Contributor's Uncle",
    location: "Kampong Chhnang Province, Cambodia (sample)",
    date: "May 2024",
    introduction:
      "A palm-leaf covering is only as good as the frame beneath it. This entry documents how one family in the community describes the traditional timber and bamboo frame used to support a steep, water-shedding roof pitch.",
    steps: [
      {
        title: "Setting the ridge beam",
        description:
          "A single long ridge beam is raised first, typically with the help of several neighbors, and leveled before any other framing begins.",
      },
      {
        title: "Placing the rafters",
        description:
          "Rafters are spaced evenly from the ridge down to the eaves, with spacing narrow enough to support the woven panels without sagging.",
      },
      {
        title: "Adding horizontal purlins",
        description:
          "Thinner bamboo purlins run horizontally across the rafters, creating a grid that each palm-leaf panel will be tied onto.",
      },
      {
        title: "Checking the pitch",
        description:
          "The roof's steep angle is checked by eye against a nearby completed house, since a shallow pitch causes water to sit rather than drain.",
      },
    ],
    tips: [
      "A steeper pitch is favored in areas with heavier rainy-season downpours.",
      "Bamboo is often smoked over a low fire before use to discourage insects.",
    ],
    contributorStory:
      "\"When we raised our frame, half the village came to help lift the ridge beam. Nobody built alone — that was the tradition as much as the house itself.\" — as recalled by a family contributor, sample entry.",
    relatedImages: [
      { src: images.categoryAttaching, alt: "Bamboo purlins across a roof frame" },
      { src: images.archive6, alt: "Finished traditional house with palm-leaf roof" },
    ],
    isSample: true,
  },
  {
    id: "arch-04",
    slug: "tying-panels-to-the-roof-frame",
    title: "Tying Panels to the Roof Frame",
    category: "Attachment Techniques",
    description:
      "The traditional method for attaching finished woven palm-leaf panels to a house frame, starting from the eaves and working upward.",
    image: images.archive4,
    imageAlt: "Woven palm leaf panels being tied to a roof frame",
    contributor: "Community Elder Interview",
    location: "Kampong Speu Province, Cambodia (sample)",
    date: "May 2024",
    introduction:
      "Attaching the panels is done in careful, overlapping rows, always starting at the eaves and working toward the ridge, so that each higher row sheds water over the row below it — the same principle used with modern shingles.",
    steps: [
      {
        title: "Aligning the first row",
        description:
          "The bottom row of panels is aligned along the eave, overhanging slightly to direct rainwater away from the walls below.",
      },
      {
        title: "Lashing to the purlins",
        description:
          "Each panel is lashed to the bamboo purlins with split rattan or rope, tied at consistent intervals along the spine of the panel.",
      },
      {
        title: "Overlapping each new row",
        description:
          "Every subsequent row is laid to overlap roughly one-third to one-half of the row beneath it, doubling the water-shedding layer at every seam.",
      },
      {
        title: "Capping the ridge",
        description:
          "At the very top, panels are folded and lashed over the ridge beam itself, sealing the peak where two roof slopes meet.",
      },
    ],
    tips: [
      "Consistent overlap is more important than the total number of panels used.",
      "Ridge capping is often reinforced yearly, since it takes the most direct sun and rain exposure.",
    ],
    contributorStory:
      "\"My father always tied the ridge himself. He said if the top failed, everything below it failed too, no matter how well it was woven.\" — as recalled by a community elder, sample entry.",
    relatedImages: [
      { src: images.archive3, alt: "Roof frame ready for panel attachment" },
      { src: images.categoryHouses, alt: "Traditional house with layered palm-leaf roof" },
    ],
    featured: true,
    isSample: true,
  },
  {
    id: "arch-05",
    slug: "seasonal-roof-repair",
    title: "Seasonal Roof Repair Before the Rains",
    category: "Maintenance & Repair",
    description:
      "How families traditionally inspect and repair palm-leaf roofing each year before the start of the rainy season.",
    image: images.archive5,
    imageAlt: "A person repairing a section of a palm leaf roof",
    contributor: "Community Elder Interview",
    location: "Takeo Province, Cambodia (sample)",
    date: "June 2024",
    introduction:
      "A well-built palm-leaf roof can last several years, but it is rarely left untouched. This entry documents the yearly inspection and repair ritual described by a longtime resident, usually carried out in the weeks before the rainy season begins.",
    steps: [
      {
        title: "Inspecting from inside",
        description:
          "On a sunny day, the household checks the underside of the roof for any small points of light, which mark spots where leaves have thinned or cracked.",
      },
      {
        title: "Marking weak panels",
        description:
          "Weak spots are marked with a loose knot of grass or cloth so they can be found again once the family is back outside.",
      },
      {
        title: "Weaving patch panels",
        description:
          "Small replacement panels are woven using the same cross-weave technique, sized to match the section being replaced.",
      },
      {
        title: "Re-lashing the patch",
        description:
          "The old, damaged section is untied, removed, and the new patch is lashed into place using the same overlap principle as the original installation.",
      },
    ],
    tips: [
      "Repairs are best done in the dry season, when leaves are easier to source and weave.",
      "Checking for light spots from inside is faster and more reliable than inspecting the roof from outside.",
    ],
    contributorStory:
      "\"Every year before the rains, my whole family spent a morning walking the house, finding the thin spots. It became a kind of yearly ritual, almost like a small celebration before the wet season began.\" — as recalled by a community elder, sample entry.",
    relatedImages: [
      { src: images.categoryMaintaining, alt: "Close-up of a patched section of roof" },
      { src: images.archive1, alt: "Freshly prepared leaves ready for patch panels" },
    ],
    isSample: true,
  },
  {
    id: "arch-06",
    slug: "the-family-house-in-kampong-speu",
    title: "A Traditional Family House in Kampong Speu",
    category: "Traditional Houses",
    description:
      "Documentation of a full traditional house, including its layout, elevated structure, and the palm-leaf roof that has been maintained for over a decade.",
    image: images.archive6,
    imageAlt: "A complete traditional house with a palm leaf roof, raised on wooden stilts",
    contributor: "Household Visit and Interview",
    location: "Kampong Speu Province, Cambodia (sample)",
    date: "July 2024",
    introduction:
      "This entry documents a single household's house as an example of a still-standing, actively maintained palm-leaf roof. The house is raised on stilts, a common feature in the region that keeps the living space above seasonal floodwater and improves airflow beneath the covering.",
    steps: [
      {
        title: "Elevated stilt structure",
        description:
          "The house stands roughly two meters above ground on hardwood stilts, with the space below used for storage, shade, and tools during the day.",
      },
      {
        title: "Open-sided living area",
        description:
          "Walls are partial or woven from lighter material, allowing air to move freely beneath the deep-pitched, palm-leaf roof above.",
      },
      {
        title: "Deep roof overhang",
        description:
          "The roof extends well beyond the walls on all sides, protecting the timber structure and interior from direct rain and sun.",
      },
    ],
    tips: [
      "Deep overhangs reduce how often the walls and stilts need to be treated or replaced.",
      "Raised houses like this one are especially common in areas that flood seasonally.",
    ],
    contributorStory:
      "\"This roof has covered three generations of my family. We have replaced sections of it many times, but never all at once — it has always felt like the same roof, just renewed.\" — as recalled by the household contributor, sample entry.",
    relatedImages: [
      { src: images.categoryHouses, alt: "Wide view of a traditional stilt house" },
      { src: images.archive4, alt: "Detail of overlapping roof panels on the same house" },
    ],
    featured: true,
    isSample: true,
  },
  {
    id: "arch-07",
    slug: "drying-technique-for-longer-lasting-panels",
    title: "A Drying Technique for Longer-Lasting Panels",
    category: "Palm Leaf Preparation",
    description:
      "A traditional method of slow, shaded drying that is believed to make finished panels more resistant to cracking and pests.",
    image: images.archive7,
    imageAlt: "Palm leaf panels resting on a raised drying rack in the shade",
    contributor: "Community Elder Interview",
    location: "Kampong Chhnang Province, Cambodia (sample)",
    date: "August 2024",
    introduction:
      "Unlike leaving leaves in direct sun, some households in this community favor a slower, shaded drying process, which they believe results in panels that last longer and resist cracking. This entry documents that approach.",
    steps: [
      {
        title: "Building a raised rack",
        description:
          "A simple bamboo rack is raised off the ground, allowing air to circulate on all sides of the drying leaves.",
      },
      {
        title: "Drying in partial shade",
        description:
          "Leaves are laid under a covered but open-sided structure, avoiding both direct sun and dampness from the ground.",
      },
      {
        title: "Turning the leaves daily",
        description:
          "Leaves are turned once a day for several days so that moisture leaves evenly from both sides.",
      },
    ],
    tips: [
      "Leaves dried too quickly in direct sun are said to become brittle and split during weaving.",
      "A gentle, even color across the dried leaf is used as a visual sign that drying was successful.",
    ],
    contributorStory:
      "\"Direct sun is fast, but fast is not always better. Slow drying in the shade was something my grandfather insisted on, even when the family was in a hurry to finish a roof.\" — as recalled by a community elder, sample entry.",
    relatedImages: [
      { src: images.archive1, alt: "Bundles of leaves ready for the drying rack" },
      { src: images.categoryPreparing, alt: "Close view of leaves turning color as they dry" },
    ],
    isSample: true,
  },
  {
    id: "arch-08",
    slug: "the-tools-of-a-traditional-thatcher",
    title: "The Tools of a Traditional Thatcher",
    category: "Weaving Techniques",
    description:
      "An overview of the simple hand tools traditionally used to cut, split, and weave palm leaves into finished roofing panels.",
    image: images.archive8,
    imageAlt: "A set of traditional hand tools used for palm leaf thatching",
    contributor: "Community Elder Interview",
    location: "Takeo Province, Cambodia (sample)",
    date: "August 2024",
    introduction:
      "The tools involved in this craft are few, simple, and often handmade. This entry documents the small set of tools one contributor still keeps and uses today, each with its own specific role.",
    steps: [
      {
        title: "The cutting knife",
        description:
          "A short, curved blade used both to harvest fronds from the tree and to trim damaged leaflets during preparation.",
      },
      {
        title: "The splitting tool",
        description:
          "A narrow wooden or bone tool used to split rattan and vine into thin strips for lashing panels to the frame.",
      },
      {
        title: "The spine gauge",
        description:
          "A length of bamboo used to check that each woven panel's spine is a consistent width before it is attached to the roof.",
      },
    ],
    tips: [
      "Many older tools were handmade and passed down rather than purchased.",
      "A well-kept cutting knife is often mentioned as a source of pride among older thatchers.",
    ],
    contributorStory:
      "\"This knife belonged to my father. I have sharpened it more times than I can count, but I have never replaced it.\" — as recalled by a community elder, sample entry.",
    relatedImages: [
      { src: images.categoryWeaving, alt: "Close-up of hands using a splitting tool" },
      { src: images.archive2, alt: "Finished weave made using traditional tools" },
    ],
    isSample: true,
  },
];

export function getArchiveItemBySlug(slug: string) {
  return archiveItems.find((item) => item.slug === slug);
}

export function getFeaturedArchiveItems() {
  return archiveItems.filter((item) => item.featured);
}

export function getRelatedArchiveItems(current: ArchiveItem, count = 3) {
  return archiveItems
    .filter((item) => item.id !== current.id && item.category === current.category)
    .slice(0, count)
    .concat(
      archiveItems.filter((item) => item.id !== current.id && item.category !== current.category)
    )
    .slice(0, count);
}
