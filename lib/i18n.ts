export type Language = "en" | "km";

export const translations = {
  en: {
    home: "Home",
    archive: "Archive",
    techniques: "Techniques",
    stories: "Stories",
    gallery: "Gallery",
    about: "About",
    houseArchive: "House Archive",
    communityArchive: "A Community Cultural Archive",
    exploreArchive: "Explore the Archive",
    aboutArchive: "About This Archive",
    scroll: "Scroll",
    searchArchive: "Search the archive…",
    filterByCategory: "Filter archive by category",
    all: "All",
    entriesFound: "entries found",
    entryFound: "entry found",
    noMatches: "No archive entries match your search yet.",
    browseCollection: "Browse the collection",
    theArchive: "The Archive",
    allEntries: "All Entries",
    preserving:
      "Preserving the knowledge, skills, and stories behind a traditional way of building and living.",
    practicalKnowledge:
      "Practical knowledge, passed hand to hand between generations",
    viewDetails: "View Details",
    navigate: "Navigate",
    categories: "Categories",
    aboutThisArchive: "About This Archive",
    preservingOne:
      "Preserving traditional knowledge, one story and technique at a time.",
    builtWith:
      "Built with and for the community members who shared their knowledge, experience, and time.",
    closeMenu: "Close menu",
    openMenu: "Open menu",
    sampleEntry: "Sample Entry",
  },
  km: {
    home: "ទំព័រដើម",
    archive: "បណ្ណសារ",
    techniques: "បច្ចេកទេស",
    stories: "រឿងរ៉ាវ",
    gallery: "វិចិត្រសាល",
    about: "អំពីយើង",
    houseArchive: "បណ្ណសារផ្ទះ",
    communityArchive: "បណ្ណសារវប្បធម៌សហគមន៍",
    exploreArchive: "ស្វែងរកក្នុងបណ្ណសារ",
    aboutArchive: "អំពីបណ្ណសារនេះ",
    scroll: "រំកិលចុះ",
    searchArchive: "ស្វែងរកក្នុងបណ្ណសារ…",
    filterByCategory: "ត្រងបណ្ណសារតាមប្រភេទ",
    all: "ទាំងអស់",
    entriesFound: "កំណត់ត្រាត្រូវបានរកឃើញ",
    entryFound: "កំណត់ត្រាត្រូវបានរកឃើញ",
    noMatches: "មិនទាន់មានកំណត់ត្រាដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។",
    browseCollection: "ស្វែងរកក្នុងបណ្ដុំ",
    theArchive: "បណ្ណសារ",
    allEntries: "កំណត់ត្រាទាំងអស់",
    preserving:
      "ថែរក្សាចំណេះដឹង ជំនាញ និងរឿងរ៉ាវអំពីរបៀបរស់នៅ និងសាងសង់តាមប្រពៃណី។",
    practicalKnowledge: "ចំណេះដឹងជាក់ស្តែង ដែលបានបន្តពីមួយជំនាន់ទៅមួយជំនាន់",
    viewDetails: "មើលព័ត៌មានលម្អិត",
    navigate: "តំណភ្ជាប់",
    categories: "ប្រភេទ",
    aboutThisArchive: "អំពីបណ្ណសារនេះ",
    preservingOne: "ថែរក្សាចំណេះដឹងប្រពៃណី តាមរយៈរឿងរ៉ាវ និងបច្ចេកទេសមួយៗ។",
    builtWith:
      "បង្កើតជាមួយ និងសម្រាប់សមាជិកសហគមន៍ ដែលបានចែករំលែកចំណេះដឹង បទពិសោធន៍ និងពេលវេលារបស់ពួកគេ។",
    closeMenu: "បិទម៉ឺនុយ",
    openMenu: "បើកម៉ឺនុយ",
    sampleEntry: "កំណត់ត្រាគំរូ",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export const localizedLabels: Record<string, { en: string; km: string }> = {
  "The Archive": { en: "The Archive", km: "បណ្ណសារ" },
  "Browse the collection": {
    en: "Browse the collection",
    km: "ស្វែងរកក្នុងបណ្ដុំ",
  },
  "All Entries": { en: "All Entries", km: "កំណត់ត្រាទាំងអស់" },
  "The Process": { en: "The Process", km: "ដំណើរការ" },
  "From Palm Leaf to House": {
    en: "From Palm Leaf to House",
    km: "ពីស្លឹកត្នោតទៅជាផ្ទះ",
  },
  "Stories from Elders": { en: "Stories from Elders", km: "រឿងរ៉ាវពីចាស់ទុំ" },
  "The people behind the knowledge": {
    en: "The people behind the knowledge",
    km: "មនុស្សនៅពីក្រោយចំណេះដឹងនេះ",
  },
  "Photo Gallery": { en: "Photo Gallery", km: "វិចិត្រសាលរូបថត" },
  "Documenting the craft, in pictures": {
    en: "Documenting the craft, in pictures",
    km: "កត់ត្រាសិប្បកម្មតាមរយៈរូបភាព",
  },
  "About This Archive": { en: "About This Archive", km: "អំពីបណ្ណសារនេះ" },
  "What is this archive?": {
    en: "What is this archive?",
    km: "បណ្ណសារនេះជាអ្វី?",
  },
  "Why This Knowledge Matters": {
    en: "Why This Knowledge Matters",
    km: "ហេតុអ្វីចំណេះដឹងនេះសំខាន់",
  },
  "What You'll Discover": {
    en: "What You'll Discover",
    km: "អ្វីដែលអ្នកនឹងរកឃើញ",
  },
  "Six ways into the archive": {
    en: "Six ways into the archive",
    km: "វិធីប្រាំមួយដើម្បីស្វែងយល់ពីបណ្ណសារ",
  },
  "From Knowledge to Archive": {
    en: "From Knowledge to Archive",
    km: "ពីចំណេះដឹងទៅជាបណ្ណសារ",
  },
  "How each entry is collected": {
    en: "How each entry is collected",
    km: "របៀបប្រមូលកំណត់ត្រានីមួយៗ",
  },
  "Help Preserve Traditional Knowledge": {
    en: "Help Preserve Traditional Knowledge",
    km: "ជួយថែរក្សាចំណេះដឹងប្រពៃណី",
  },
  "Read more about this archive": {
    en: "Read more about this archive",
    km: "អានបន្ថែមអំពីបណ្ណសារនេះ",
  },
  "Explore the Archive": {
    en: "Explore the Archive",
    km: "ស្វែងរកក្នុងបណ្ណសារ",
  },
  "Preparing the Palm Leaves": {
    en: "Preparing the Palm Leaves",
    km: "ការរៀបចំស្លឹកត្នោត",
  },
  "Weaving the Leaves": { en: "Weaving the Leaves", km: "ការត្បាញស្លឹកត្នោត" },
  "Attaching the Covering": {
    en: "Attaching the Covering",
    km: "ការភ្ជាប់ស្រទាប់គ្របដំបូល",
  },
  "Maintaining the Roof": { en: "Maintaining the Roof", km: "ការថែរក្សាដំបូល" },
  "Traditional Houses": { en: "Traditional Houses", km: "ផ្ទះប្រពៃណី" },
  Explore: { en: "Explore", km: "ស្វែងយល់" },
  "See the full documentation": {
    en: "See the full documentation",
    km: "មើលឯកសារពេញលេញ",
  },
  Interview: { en: "Interview", km: "សម្ភាសន៍" },
  Document: { en: "Document", km: "កត់ត្រា" },
  Photograph: { en: "Photograph", km: "ថតរូប" },
  Preserve: { en: "Preserve", km: "ថែរក្សា" },
  Share: { en: "Share", km: "ចែករំលែក" },
  "Palm Leaf Preparation": {
    en: "Palm Leaf Preparation",
    km: "ការរៀបចំស្លឹកត្នោត",
  },
  "Weaving Techniques": { en: "Weaving Techniques", km: "បច្ចេកទេសត្បាញ" },
  "House Construction": { en: "House Construction", km: "ការសាងសង់ផ្ទះ" },
  "Attachment Techniques": {
    en: "Attachment Techniques",
    km: "បច្ចេកទេសភ្ជាប់",
  },
  "Maintenance & Repair": {
    en: "Maintenance & Repair",
    km: "ការថែទាំ និងជួសជុល",
  },
  "Preparing Palm Leaves for House Covering": {
    en: "Preparing Palm Leaves for House Covering",
    km: "ការរៀបចំស្លឹកត្នោតសម្រាប់គ្របផ្ទះ",
  },
  "The Cross-Weave Pattern for Roof Panels": {
    en: "The Cross-Weave Pattern for Roof Panels",
    km: "លំនាំត្បាញឆ្លាស់សម្រាប់បន្ទះដំបូល",
  },
  "Raising the Roof Frame Before Covering": {
    en: "Raising the Roof Frame Before Covering",
    km: "ការលើកគ្រោងដំបូលមុនពេលគ្រប",
  },
  "Tying Panels to the Roof Frame": {
    en: "Tying Panels to the Roof Frame",
    km: "ការចងបន្ទះទៅនឹងគ្រោងដំបូល",
  },
  "Seasonal Roof Repair Before the Rains": {
    en: "Seasonal Roof Repair Before the Rains",
    km: "ការជួសជុលដំបូលមុនរដូវភ្លៀង",
  },
  "A Traditional Family House in Kampong Speu": {
    en: "A Traditional Family House in Kampong Speu",
    km: "ផ្ទះគ្រួសារប្រពៃណីនៅកំពង់ស្ពឺ",
  },
  "A Drying Technique for Longer-Lasting Panels": {
    en: "A Drying Technique for Longer-Lasting Panels",
    km: "បច្ចេកទេសសម្ងួតសម្រាប់បន្ទះដែលប្រើបានយូរ",
  },
  "The Tools of a Traditional Thatcher": {
    en: "The Tools of a Traditional Thatcher",
    km: "ឧបករណ៍របស់ជាងប្រក់ដំបូលប្រពៃណី",
  },
  "An overview of how palm leaves are selected, cleaned, dried, and prepared before they are used to cover a traditional house.":
    {
      en: "An overview of how palm leaves are selected, cleaned, dried, and prepared before they are used to cover a traditional house.",
      km: "ទិដ្ឋភាពទូទៅអំពីការជ្រើសរើស សម្អាត សម្ងួត និងរៀបចំស្លឹកត្នោត មុនយកទៅគ្របផ្ទះប្រពៃណី។",
    },
  "A step-by-step look at the traditional cross-weave used to bind individual palm leaflets into a single watertight panel.":
    {
      en: "A step-by-step look at the traditional cross-weave used to bind individual palm leaflets into a single watertight panel.",
      km: "ការពិនិត្យតាមជំហានអំពីការត្បាញឆ្លាស់ប្រពៃណី ដែលភ្ជាប់ស្លឹកតូចៗទៅជាបន្ទះការពារទឹកតែមួយ។",
    },
  "How the wooden or bamboo frame of a traditional house is built to support woven palm-leaf panels, including spacing and pitch.":
    {
      en: "How the wooden or bamboo frame of a traditional house is built to support woven palm-leaf panels, including spacing and pitch.",
      km: "របៀបសាងសង់គ្រោងឈើ ឬឫស្សីរបស់ផ្ទះប្រពៃណី ដើម្បីទ្រទ្រង់បន្ទះស្លឹកត្នោតដែលបានត្បាញ រួមទាំងចន្លោះ និងជម្រាល។",
    },
  "The traditional method for attaching finished woven palm-leaf panels to a house frame, starting from the eaves and working upward.":
    {
      en: "The traditional method for attaching finished woven palm-leaf panels to a house frame, starting from the eaves and working upward.",
      km: "វិធីសាស្ត្រប្រពៃណីសម្រាប់ភ្ជាប់បន្ទះស្លឹកត្នោតដែលបានត្បាញរួចទៅនឹងគ្រោងផ្ទះ ដោយចាប់ផ្តើមពីចុងដំបូលឡើងទៅលើ។",
    },
  "How families traditionally inspect and repair palm-leaf roofing each year before the start of the rainy season.":
    {
      en: "How families traditionally inspect and repair palm-leaf roofing each year before the start of the rainy season.",
      km: "របៀបដែលគ្រួសារត្រួតពិនិត្យ និងជួសជុលដំបូលស្លឹកត្នោតតាមប្រពៃណីរៀងរាល់ឆ្នាំ មុនចូលរដូវភ្លៀង។",
    },
  "Documentation of a full traditional house, including its layout, elevated structure, and the palm-leaf roof that has been maintained for over a decade.":
    {
      en: "Documentation of a full traditional house, including its layout, elevated structure, and the palm-leaf roof that has been maintained for over a decade.",
      km: "ការកត់ត្រាអំពីផ្ទះប្រពៃណីពេញលេញ រួមទាំងប្លង់ រចនាសម្ព័ន្ធលើកខ្ពស់ និងដំបូលស្លឹកត្នោតដែលបានថែរក្សាជាងមួយទសវត្សរ៍។",
    },
  "A traditional method of slow, shaded drying that is believed to make finished panels more resistant to cracking and pests.":
    {
      en: "A traditional method of slow, shaded drying that is believed to make finished panels more resistant to cracking and pests.",
      km: "វិធីសាស្ត្រប្រពៃណីនៃការសម្ងួតយឺតក្នុងម្លប់ ដែលគេជឿថាធ្វើឱ្យបន្ទះដែលបានបញ្ចប់ធន់នឹងការប្រេះ និងសត្វល្អិតបានកាន់តែប្រសើរ។",
    },
  "An overview of the simple hand tools traditionally used to cut, split, and weave palm leaves into finished roofing panels.":
    {
      en: "An overview of the simple hand tools traditionally used to cut, split, and weave palm leaves into finished roofing panels.",
      km: "ទិដ្ឋភាពទូទៅអំពីឧបករណ៍ដៃសាមញ្ញដែលប្រើតាមប្រពៃណី ដើម្បីកាត់ ពុះ និងត្បាញស្លឹកត្នោតទៅជាបន្ទះដំបូលដែលបានបញ្ចប់។",
    },
  "How leaves are selected, cleaned, and dried before they are ready for weaving.":
    {
      en: "How leaves are selected, cleaned, and dried before they are ready for weaving.",
      km: "របៀបជ្រើសរើស សម្អាត និងសម្ងួតស្លឹក មុនពេលយកទៅត្បាញ។",
    },
  "The cross-weave pattern that binds loose leaflets into a single watertight panel.":
    {
      en: "The cross-weave pattern that binds loose leaflets into a single watertight panel.",
      km: "លំនាំត្បាញឆ្លាស់ដែលភ្ជាប់ស្លឹកតូចៗឱ្យក្លាយជាបន្ទះការពារទឹកតែមួយ។",
    },
  "How finished panels are lashed to a roof frame, row by overlapping row.": {
    en: "How finished panels are lashed to a roof frame, row by overlapping row.",
    km: "របៀបចងបន្ទះដែលបានត្បាញរួចទៅនឹងគ្រោងដំបូល ដោយត្រួតជាន់គ្នាតាមជួរ។",
  },
  "The yearly inspection and repair ritual that keeps a roof watertight for years.":
    {
      en: "The yearly inspection and repair ritual that keeps a roof watertight for years.",
      km: "ការត្រួតពិនិត្យ និងជួសជុលប្រចាំឆ្នាំ ដែលជួយឱ្យដំបូលការពារទឹកបានយូរឆ្នាំ។",
    },
  "First-hand memories from the people who built, lived in, and maintained these houses.":
    {
      en: "First-hand memories from the people who built, lived in, and maintained these houses.",
      km: "អនុស្សាវរីយ៍ផ្ទាល់ពីអ្នកដែលបានសាងសង់ រស់នៅ និងថែរក្សាផ្ទះទាំងនេះ។",
    },
  "Full documentation of standing houses, their structure, and their history.":
    {
      en: "Full documentation of standing houses, their structure, and their history.",
      km: "ការកត់ត្រាពេញលេញអំពីផ្ទះដែលនៅឈរ រចនាសម្ព័ន្ធ និងប្រវត្តិរបស់វា។",
    },
  "Every entry in this archive falls somewhere along the journey from living palm tree to finished, weatherproof roof — and the people who carry that knowledge.":
    {
      en: "Every entry in this archive falls somewhere along the journey from living palm tree to finished, weatherproof roof — and the people who carry that knowledge.",
      km: "កំណត់ត្រានីមួយៗក្នុងបណ្ណសារនេះ បង្ហាញពីដំណើរចាប់ពីដើមត្នោតរស់ រហូតដល់ដំបូលដែលបានបញ្ចប់ និងការពារទឹកបាន ព្រមទាំងអ្នកដែលរក្សាចំណេះដឹងនេះ។",
    },
  "Every technique documented here follows the same careful path, from a conversation with a community member to a published record anyone can explore.":
    {
      en: "Every technique documented here follows the same careful path, from a conversation with a community member to a published record anyone can explore.",
      km: "បច្ចេកទេសនីមួយៗដែលបានកត់ត្រានៅទីនេះ ឆ្លងកាត់ដំណើរយ៉ាងប្រុងប្រយ័ត្នដូចគ្នា ចាប់ពីការសន្ទនាជាមួយសមាជិកសហគមន៍ រហូតដល់កំណត់ត្រាដែលអ្នកគ្រប់គ្នាអាចស្វែងយល់បាន។",
    },
  "Every story, technique, and memory can help keep this knowledge alive.": {
    en: "Every story, technique, and memory can help keep this knowledge alive.",
    km: "រាល់រឿងរ៉ាវ បច្ចេកទេស និងអនុស្សាវរីយ៍ អាចជួយរក្សាចំណេះដឹងនេះឱ្យនៅរស់។",
  },
  "Sitting with community elders to listen and record their knowledge and memories.":
    {
      en: "Sitting with community elders to listen and record their knowledge and memories.",
      km: "អង្គុយស្តាប់ និងកត់ត្រាចំណេះដឹង និងអនុស្សាវរីយ៍របស់ចាស់ទុំក្នុងសហគមន៍។",
    },
  "Writing down techniques, steps, and terminology in clear, structured detail.":
    {
      en: "Writing down techniques, steps, and terminology in clear, structured detail.",
      km: "សរសេរបច្ចេកទេស ជំហាន និងពាក្យសព្ទដោយលម្អិត ច្បាស់លាស់ និងមានរចនាសម្ព័ន្ធ។",
    },
  "Capturing tools, materials, and finished work to accompany each written record.":
    {
      en: "Capturing tools, materials, and finished work to accompany each written record.",
      km: "ថតឧបករណ៍ សម្ភារៈ និងស្នាដៃដែលបានបញ្ចប់ ដើម្បីភ្ជាប់ជាមួយកំណត់ត្រានីមួយៗ។",
    },
  "Organizing every entry into the archive so it can be found and referenced later.":
    {
      en: "Organizing every entry into the archive so it can be found and referenced later.",
      km: "រៀបចំកំណត់ត្រានីមួយៗក្នុងបណ្ណសារ ដើម្បីងាយស្វែងរក និងយោងនៅពេលក្រោយ។",
    },
  "Publishing the record so it can be explored by the community and beyond.": {
    en: "Publishing the record so it can be explored by the community and beyond.",
    km: "ផ្សព្វផ្សាយកំណត់ត្រា ដើម្បីឱ្យសហគមន៍ និងអ្នកដទៃអាចស្វែងយល់បាន។",
  },
};

export function localizeLabel(label: string, language: Language) {
  return localizedLabels[label]?.[language] ?? label;
}
