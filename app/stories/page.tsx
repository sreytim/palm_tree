import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import StoryCard from "@/components/StoryCard";
import FadeIn from "@/components/FadeIn";
import { stories } from "@/data/stories";

export const metadata: Metadata = {
  title: "Stories | Traditional Palm-Leaf House Covering Techniques",
  description: "First-hand stories and memories from the community members who carry this traditional knowledge.",
};

export default function StoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
      <SectionHeading
        eyebrow="Stories from Elders"
        title="The people behind the knowledge"
        lede="Every technique in this archive comes from someone. These are their words, memories, and reflections on a lifetime spent close to this craft."
      />

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stories.map((story, i) => (
          <FadeIn key={story.id} delay={i * 60}>
            <StoryCard story={story} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
