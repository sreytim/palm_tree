/**
 * People / contributors.
 *
 * Previously every record carried a free-text `contributor` string, which made
 * it impossible to answer "which entries did this person contribute to?".
 * `contributor` is still kept on the records as the display label, but it is
 * now backed by a `personId` that points here.
 *
 * Named people are the four interview contributors. The remaining records
 * represent the anonymous attribution types the content uses (a household
 * visit, a family interview, the archive's photograph collection), so that no
 * contributor string is left unattached. Replace role labels with real
 * contributor names — and get permission — before publishing.
 */
export const people = [
  {
    id: "person-01",
    slug: "community-weaver-1",
    name: "Community weaver",
    role: "weaver",
  },
  {
    id: "person-02",
    slug: "householder",
    name: "Householder",
    role: "householder",
  },
  {
    id: "person-03",
    slug: "community-weaver-2",
    name: "Community weaver",
    role: "weaver",
  },
  {
    id: "person-04",
    slug: "community-carpenter",
    name: "Community carpenter",
    role: "carpenter",
  },

  // ---- anonymous attribution types --------------------------------------
  {
    id: "person-community-elder",
    slug: "community-elder",
    name: null,
    role: "anonymous-contributor",
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
    id: "person-archive-collection",
    slug: "archive-photograph-collection",
    name: null,
    role: "anonymous-contributor",
    attributionLabel: {
      en: "Archive photograph collection",
      km: "បណ្ដុំរូបថតរបស់បណ្ណសារ",
    },
  },
];

export function getPersonById(id) {
  return people.find((person) => person.id === id);
}