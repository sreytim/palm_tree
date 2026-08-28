import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Lightbulb, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import FadeIn from "@/components/FadeIn";
import WeaveDivider from "@/components/WeaveDivider";
import { techniqueSteps } from "@/data/techniques";

export const metadata: Metadata = {
  title: "Techniques | Traditional Palm-Leaf House Covering Techniques",
  description: "A visual, step-by-step journey from palm leaf to finished house covering.",
};

export default function TechniquesPage() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-16 sm:pt-24 pb-6">
        <SectionHeading
          eyebrow="The Process"
          title="From Palm Leaf to House"
          lede="Six stages carry a palm frond from the tree to a finished, weatherproof roof. Each stage represents years of accumulated, hand-taught knowledge."
        />
      </div>

      <WeaveDivider className="my-10" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-24 space-y-20 sm:space-y-28">
        {techniqueSteps.map((step, i) => {
          const reverse = i % 2 === 1;
          return (
            <FadeIn key={step.slug}>
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                  reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="lg:col-span-7 relative">
                  <div className="relative aspect-[4/3] rounded-[1.75rem] overflow-hidden img-zoom">
                    <Image
                      src={step.image}
                      alt={step.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover"
                    />
                  </div>
                  <span className="absolute -top-6 -left-2 sm:left-4 font-display text-6xl sm:text-8xl font-medium text-palm/15 select-none">
                    {step.number}
                  </span>
                </div>
                <div className="lg:col-span-5">
                  <p className="font-mono text-xs tracking-[0.2em] uppercase text-clay-deep mb-3">
                    Step {step.number}
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-medium text-ink">{step.title}</h2>
                  <p className="mt-4 text-base text-ink-soft leading-relaxed">{step.description}</p>
                  <div className="mt-5 flex gap-3 rounded-2xl bg-cream-deep border border-beige p-4">
                    <Lightbulb size={18} className="text-clay-deep shrink-0 mt-0.5" />
                    <p className="text-sm text-ink-soft leading-relaxed">{step.tip}</p>
                  </div>
                  <Link
                    href="/archive"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-palm-deep"
                  >
                    Learn more in the Archive <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>

      <div className="weave-bg-dark text-cream">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-20 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-medium">See the full documentation</h2>
          <p className="mt-3 text-cream/80 leading-relaxed">
            Every step above corresponds to detailed entries in the archive, contributed directly
            by community members.
          </p>
          <Link
            href="/archive"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream text-palm-deep px-7 py-3.5 text-sm font-semibold hover:bg-beige-soft transition-colors duration-200"
          >
            Explore the Archive <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
