import { images } from "@/lib/images";
/**
 * Sample Stories
 *
 * These are example entries showing how contributor stories should be
 * structured. Replace names, portraits, and text with real interviews.
 * Names below are placeholders and should be updated with permission
 * from real contributors before publishing.
 */
export const stories = [
    {
        id: "story-01",
        slug: "learning-from-the-older-generation",
        name: "Yeay Sokha (sample name)",
        generation: "Born c. 1948",
        location: "Kampong Speu Province, Cambodia (sample)",
        quote: "The leaf remembers how it was cut.",
        title: "Learning from the Older Generation",
        portrait: images.storyPortrait1,
        excerpt: "A lifelong resident recalls learning to weave palm-leaf panels from her mother, and why she believes the skill should not be allowed to disappear.",
        fullStory: [
            "I first held a palm leaf in my hands before I could properly walk, or so my mother liked to tell me. By the time I was seven or eight, I was already sitting beside her during the harvest weeks, watching her fingers move faster than I could follow.",
            "She never explained the weave in words. She would simply weave, slowly at first, and expect me to copy her. It took me two full rainy seasons before my hands understood the rhythm on their own, without me having to think about each crossing.",
            "Our roof was always a family project. My father cut the frame, my brothers helped raise the beams, and my mother and I prepared and wove the covering. Every part of the house carried someone's hands in it.",
            "Today, fewer young people in my village know how to weave a roof panel. Many prefer metal sheeting, which is faster and needs less yearly care. I understand why — but something is lost when a skill like this is no longer passed from hand to hand.",
            "This is why, when someone asked to record what I remember, I agreed without hesitation. If even one young person watches this and wants to learn, then the knowledge has not disappeared. It has simply found a new place to live.",
        ],
        isSample: true,
    },
    {
        id: "story-02",
        slug: "a-lifetime-under-one-roof",
        name: "Ta Sarun (sample name)",
        generation: "Born c. 1952",
        location: "Takeo Province, Cambodia (sample)",
        quote: "We never built alone. The whole village raised the beam together.",
        title: "A Lifetime Under One Roof",
        portrait: images.storyPortrait2,
        excerpt: "A retired farmer describes decades of maintaining the same family house, and the community effort it took to build it in the first place.",
        fullStory: [
            "The house I live in now is not the first roof I have covered, but it is the one I have kept the longest. My father and I built the frame together when I was a young man, not long after I was married.",
            "In those days, no one built a house frame alone. When it came time to raise the main ridge beam, half the village arrived to help lift it into place. It was hard work, but it never felt like a burden — it felt like something we did for each other, knowing our neighbors would do the same for us.",
            "Maintaining the roof became a yearly rhythm. Before the rains came, I would walk the inside of the house on a bright day, looking for small points of light coming through the leaves. Each one marked a spot that needed a patch before the wet season arrived.",
            "I have replaced sections of this roof more times than I can count, but I have never rebuilt it completely. In a strange way, it still feels like the same roof my father and I raised all those years ago — just renewed, piece by piece, season after season.",
        ],
        isSample: true,
    },
    {
        id: "story-03",
        slug: "a-daughters-promise",
        name: "Srey Neang (sample name)",
        generation: "Born c. 1975",
        location: "Kampong Chhnang Province, Cambodia (sample)",
        quote: "I did not want to be the generation that let it end.",
        title: "A Daughter's Promise",
        portrait: images.storyPortrait3,
        excerpt: "A contributor in her late forties explains why she chose to learn the traditional weave from her aunt, even after moving to the city for work.",
        fullStory: [
            "For a long time, I thought this knowledge was not really mine to keep. I moved to the city for work in my twenties, and for many years I only came home for holidays and family gatherings.",
            "It was during one of those visits that I noticed my aunt, one of the last people in our extended family who still wove roof panels by hand, was slowing down. Her hands were not as steady as they used to be, and no one in my generation had properly learned from her.",
            "I asked her to teach me, even though I knew I would likely never build a full roof of my own in the city. She agreed, a little surprised, and over several visits home she walked me through the weave, the same way her own mother had taught her decades earlier.",
            "I do not know if I will ever use this skill the way she did. But I did not want to be the generation that let it end quietly, without anyone noticing. Now, when I visit, I sit with her and weave a small panel, just to keep my hands from forgetting.",
        ],
        isSample: true,
    },
    {
        id: "story-04",
        slug: "the-carpenter-who-still-remembers",
        name: "Ta Vibol (sample name)",
        generation: "Born c. 1945",
        location: "Kampong Speu Province, Cambodia (sample)",
        quote: "A house should be built the way it will be lived in — together.",
        title: "The Carpenter Who Still Remembers",
        portrait: images.storyPortrait4,
        excerpt: "A retired carpenter reflects on decades spent framing houses for palm-leaf roofs, and what he hopes future generations will understand about the craft.",
        fullStory: [
            "I spent most of my working life building the frames that other families' roofs would sit on. Framing is different work from weaving, but the two have to understand each other — a poorly spaced frame will ruin even the best woven panel.",
            "I learned from watching older carpenters in my village long before anyone formally taught me anything. There was no school for this. You watched, you were given small tasks, and slowly you were trusted with more.",
            "What I hope people understand now is that this was never just about shelter. Building a roof together, sharing tools, checking each other's work — it was how a community stayed connected to each other, season after season.",
            "I am glad someone is writing this down. My grandchildren know how to use a mobile phone far better than I ever will, but I would like at least one of them to know how a roof frame is raised, even if they never build one themselves.",
        ],
        isSample: true,
    },
];
export function getStoryBySlug(slug) {
    return stories.find((story) => story.slug === slug);
}
