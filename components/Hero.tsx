import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import { images } from "@/lib/images";

export default function Hero() {
  return (
    <section className="relative overflow-hidden weave-bg">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-14 sm:pt-20 pb-16 sm:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        <div className="lg:col-span-6 order-2 lg:order-1">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-clay-deep mb-5">
            A Community Cultural Archive
          </p>
          <h1 className="font-display text-[2.6rem] sm:text-6xl lg:text-[3.4rem] leading-[1.05] font-medium text-ink text-balance">
            Traditional Palm-Leaf House Covering Techniques
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-ink-soft leading-relaxed max-w-xl">
            Preserving the knowledge, skills, and stories behind a traditional way of building and living.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/archive"
              className="inline-flex items-center gap-2 rounded-full bg-palm text-cream px-7 py-3.5 text-sm font-semibold tracking-wide hover:bg-palm-deep transition-colors duration-200"
            >
              Explore the Archive
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border-2 border-wood text-wood px-7 py-3.5 text-sm font-semibold tracking-wide hover:bg-wood hover:text-cream transition-colors duration-200"
            >
              About This Archive
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6 order-1 lg:order-2 relative">
          <div className="relative aspect-[4/5] sm:aspect-[5/6] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-25px_rgba(43,36,23,0.45)] frond-border">
            <Image
              src={images.heroHouse}
              alt="A traditional house with a steeply pitched palm-leaf roof, raised on wooden stilts"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wood-deep/40 via-transparent to-transparent" />
          </div>
          <div className="hidden sm:block absolute -bottom-6 -left-6 w-28 h-28 rounded-2xl overflow-hidden border-4 border-cream shadow-xl rotate-[-6deg]">
            <Image
              src={images.heroTexture}
              alt="Close-up texture of woven palm leaves"
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center pb-8 sm:pb-10">
        <a
          href="#why-it-matters"
          className="flex flex-col items-center gap-2 text-ink-soft hover:text-palm-deep transition-colors group"
          aria-label="Scroll to learn why this knowledge matters"
        >
          <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase">Scroll</span>
          <ArrowDown size={16} className="animate-bounce group-hover:translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
}
