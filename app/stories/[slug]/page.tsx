import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Quote } from "lucide-react";
import { stories, getStoryBySlug } from "@/data/stories";

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return { title: "Story Not Found" };
  return {
    title: `${story.title} | Traditional Palm-Leaf House Covering Techniques`,
    description: story.excerpt,
  };
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24">
      <Link href="/stories" className="inline-flex items-center gap-1.5 text-sm font-medium text-palm-deep mb-8">
        <ArrowLeft size={15} /> Back to Stories
      </Link>

      {story.isSample && (
        <p className="mb-6 inline-block font-mono text-[0.65rem] tracking-[0.15em] uppercase text-wood bg-beige-soft px-3 py-1.5 rounded-full">
          Sample Archive Entry — for demonstration purposes
        </p>
      )}

      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden shrink-0 border-2 border-beige">
          <Image src={story.portrait} alt={`Portrait of ${story.name}`} fill sizes="80px" className="object-cover" />
        </div>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-medium text-ink">{story.name}</h1>
          <p className="text-sm text-ink-soft mt-0.5">{story.generation} &middot; {story.location}</p>
        </div>
      </div>

      <h2 className="font-display text-3xl sm:text-4xl font-medium text-ink mt-10 leading-tight">{story.title}</h2>

      <blockquote className="mt-6 border-l-4 border-clay pl-5 sm:pl-6 flex gap-3">
        <Quote size={22} className="text-clay shrink-0 mt-1" />
        <p className="font-display italic text-xl sm:text-2xl text-ink leading-snug">{story.quote}</p>
      </blockquote>

      <div className="mt-10 space-y-5">
        {story.fullStory.map((paragraph, i) => (
          <p key={i} className="text-base sm:text-lg text-ink-soft leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-14 pt-8 border-t border-beige">
        <Link
          href="/stories"
          className="inline-flex items-center gap-2 rounded-full border-2 border-wood text-wood px-6 py-3 text-sm font-semibold hover:bg-wood hover:text-cream transition-colors duration-200"
        >
          <ArrowLeft size={16} /> Back to Stories
        </Link>
      </div>
    </article>
  );
}
