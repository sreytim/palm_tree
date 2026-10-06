/**
 * People / contributors.
 *
 * Previously every record carried a free-text `contributor` string, which made
 * it impossible to answer "which entries did this person contribute to?".
 * `contributor` is still kept on the records as the display label, but it is
 * now backed by a `personId` that points here.
 *
 * Named people are the four interview contributors. The remaining records
 * represent the anonymous attribution types the sample content used, so that no
 * contributor string is left unattached. Replace names with real contributor
 * names — and get permission — before publishing.
 */
export const people = [
  {
    id: "person-01",
    slug: "yeay-sokha",
    name: "Yeay Sokha (sample name)",
    role: "weaver",
  },
  {
    id: "person-02",
    slug: "ta-sarun",
    name: "Ta Sarun (sample name)",
    role: "householder",
  },
  {
    id: "person-03",
    slug: "srey-neang",
    name: "Srey Neang (sample name)",
    role: "weaver",
  },
  {
    id: "person-04",
    slug: "ta-vibol",
    name: "Ta Vibol (sample name)",
    role: "carpenter",
  },

  // ---- anonymous attribution types --------------------------------------
  {
    id: "person-community-elder",
    slug: "community-elder",
    name: null,
    role: "anonymous-contributor",
    attributionLabel: "Community Elder Interview",
  },
  {
    id: "person-family-uncle",
    slug: "family-uncle",
    name: null,
    role: "anonymous-contributor",
    attributionLabel: "Family Interview, Contributor's Uncle",
  },
  {
    id: "person-household-visit",
    slug: "household-visit",
    name: null,
    role: "anonymous-contributor",
    attributionLabel: "Household Visit and Interview",
  },
  {
    id: "person-sample-archive",
    slug: "sample-archive-entry",
    name: null,
    role: "sample",
    attributionLabel: "Sample Archive Entry",
  },
  {
    id: "person-sample-household",
    slug: "sample-household-visit",
    name: null,
    role: "sample",
    attributionLabel: "Household Visit, Sample Entry",
  },
];

export function getPersonById(id) {
  return people.find((person) => person.id === id);
}