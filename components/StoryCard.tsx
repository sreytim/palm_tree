import Link from "next/link";
import Image from "next/image";
import { Story } from "@/lib/types";
import { Quote, ArrowRight } from "lucide-react";

export default function StoryCard({ story }: { story: Story }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-cream border border-beige hover:shadow-[0_20px_40px_-20px_rgba(43,36,23,0.35)] transition-shadow duration-300">
      <div className="relative aspect-[4/5] img-zoom">
        <Image
          src={story.portrait}
          alt={`Portrait of ${story.name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wood-deep/70 via-wood-deep/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-cream">
          <p className="font-display text-lg font-medium leading-tight">{story.name}</p>
          <p className="text-xs text-cream/80 mt-0.5">{story.generation} &middot; {story.location}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Quote size={18} className="text-clay mb-2" />
        <p className="font-display italic text-base text-ink leading-snug">&ldquo;{story.quote}&rdquo;</p>
        <h3 className="mt-4 text-sm font-semibold text-palm-deep uppercase tracking-wide">{story.title}</h3>
        <p className="mt-2 text-sm text-ink-soft leading-relaxed flex-1">{story.excerpt}</p>
        <Link
          href={`/stories/${story.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-palm-deep w-fit"
        >
          Read Story <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
