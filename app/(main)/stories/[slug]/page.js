import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoryBySlug } from "@/data/stories";

export default async function StoryPage({ params }) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <Link
        href="/stories"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-palm-deep"
      >
        ← Back to stories
      </Link>

      <div className="overflow-hidden rounded-[2rem] border border-beige bg-cream">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={story.portrait}
            alt={`Portrait of ${story.name}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="p-6 sm:p-8">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-clay-deep">
            {story.generation}
          </p>
          <h1 className="mt-3 font-display text-3xl font-medium text-ink sm:text-5xl">
            {story.name}
          </h1>
          <p className="mt-2 text-sm text-ink-soft sm:text-base">
            {story.location}
          </p>

          <blockquote className="mt-6 border-l-4 border-clay pl-5 text-lg italic leading-relaxed text-ink">
            “{story.quote}”
          </blockquote>

          <h2 className="mt-8 font-display text-2xl font-medium text-ink">
            {story.title}
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft sm:text-lg">
            {story.fullStory.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
