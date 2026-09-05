import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, MapPin, Calendar, User, Lightbulb } from "lucide-react";
import {
  entries,
  getArchiveItemBySlug,
  getRelatedArchiveItems,
} from "@/data/entries";
import EntryCard from "@/components/EntryCard";
import WeaveDivider from "@/components/WeaveDivider";

export function generateStaticParams() {
  return entries.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getArchiveItemBySlug(slug);
  if (!item) return { title: "Archive Entry Not Found" };
  return {
    title: `${item.title} | Traditional Palm-Leaf House Covering Techniques`,
    description: item.description,
  };
}

export default async function ArchiveDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getArchiveItemBySlug(slug);
  if (!item) notFound();

  const related = getRelatedArchiveItems(item);

  return (
    <article>
      <div className="relative h-[46vh] sm:h-[56vh] min-h-[320px] w-full">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wood-deep/85 via-wood-deep/25 to-wood-deep/10" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-5xl w-full px-5 sm:px-8 pb-10">
            <Link
              href="/archive"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-cream/90 hover:text-cream mb-6"
            >
              <ArrowLeft size={15} /> Back to Archive
            </Link>
            <div>
              <span className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-cream bg-palm-deep/90 px-2.5 py-1 rounded-full">
                {item.category}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-medium text-cream mt-4 max-w-3xl text-balance">
              {item.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-12 sm:py-16">
        {item.isSample && (
          <p className="mb-8 inline-block font-mono text-[0.65rem] tracking-[0.15em] uppercase text-wood bg-beige-soft px-3 py-1.5 rounded-full">
            Sample Archive Entry — for demonstration purposes
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-10 border-b border-beige text-sm">
          <div className="flex items-center gap-2 text-ink-soft">
            <User size={16} className="text-palm-deep shrink-0" />
            <span>{item.contributor}</span>
          </div>
          <div className="flex items-center gap-2 text-ink-soft">
            <Calendar size={16} className="text-palm-deep shrink-0" />
            <span>{item.date}</span>
          </div>
          <div className="flex items-center gap-2 text-ink-soft">
            <MapPin size={16} className="text-palm-deep shrink-0" />
            <span>{item.location}</span>
          </div>
        </div>

        <div className="pt-10">
          <h2 className="font-display text-2xl font-medium text-ink mb-4">
            Introduction
          </h2>
          <p className="text-base sm:text-lg text-ink-soft leading-relaxed max-w-3xl">
            {item.introduction}
          </p>
        </div>

        <div className="pt-14">
          <h2 className="font-display text-2xl font-medium text-ink mb-6">
            Step-by-Step Process
          </h2>
          <ol className="space-y-6">
            {item.steps.map((step, i) => (
              <li key={step.title} className="flex gap-5">
                <span className="font-mono text-sm text-cream bg-palm flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-lg font-medium text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm sm:text-base text-ink-soft leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {item.tips.length > 0 && (
          <div className="pt-14">
            <h2 className="font-display text-2xl font-medium text-ink mb-6">
              Traditional Knowledge &amp; Tips
            </h2>
            <ul className="space-y-3">
              {item.tips.map((tip) => (
                <li
                  key={tip}
                  className="flex gap-3 rounded-2xl bg-cream-deep border border-beige p-4 text-sm sm:text-base text-ink-soft leading-relaxed"
                >
                  <Lightbulb
                    size={18}
                    className="text-clay-deep shrink-0 mt-0.5"
                  />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-14">
          <h2 className="font-display text-2xl font-medium text-ink mb-4">
            Contributor Story
          </h2>
          <blockquote className="border-l-4 border-clay pl-5 sm:pl-6 italic text-base sm:text-lg text-ink leading-relaxed font-display">
            {item.contributorStory}
          </blockquote>
        </div>

        {item.relatedImages.length > 0 && (
          <div className="pt-14">
            <h2 className="font-display text-2xl font-medium text-ink mb-6">
              Related Images
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {item.relatedImages.map((img) => (
                <div
                  key={img.src}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden img-zoom"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <>
          <WeaveDivider />
          <div className="bg-cream-deep">
            <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16">
              <h2 className="font-display text-2xl font-medium text-ink mb-6">
                Related Archive Entries
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((r) => (
                  <EntryCard key={r.id} item={r} view="grid" />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-10">
        <Link
          href="/archive"
          className="inline-flex items-center gap-2 rounded-full border-2 border-wood text-wood px-6 py-3 text-sm font-semibold hover:bg-wood hover:text-cream transition-colors duration-200"
        >
          <ArrowLeft size={16} /> Back to Archive
        </Link>
      </div>
    </article>
  );
}
