import Image from "next/image";
import Link from "next/link";
import { Lightbulb, ArrowRight, ArrowLeft, MapPin, Calendar, User } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import FadeIn from "@/components/FadeIn";
import WeaveDivider from "@/components/WeaveDivider";
import { techniqueSteps } from "@/data/techniques";
import { getArchiveItemBySlug } from "@/data/entries";
export const metadata = {
    title: "Techniques | Traditional Palm-Leaf House Covering Techniques",
    description: "A visual, step-by-step journey from palm leaf to finished house covering.",
};
export default async function TechniquesPage({ searchParams }) {
    const { entry } = await searchParams;
    const item = typeof entry === "string" ? getArchiveItemBySlug(entry) : undefined;

    if (item) {
        return (<article>
          <div className="relative h-[46vh] sm:h-[56vh] min-h-[320px] w-full">
            <Image src={item.image} alt={item.imageAlt} fill priority sizes="100vw" className="object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-wood-deep/85 via-wood-deep/25 to-wood-deep/10"/>
            <div className="absolute inset-0 flex items-end">
              <div className="mx-auto max-w-5xl w-full px-5 sm:px-8 pb-10">
                <Link href="/#archive" className="inline-flex items-center gap-1.5 text-sm font-medium text-cream/90 hover:text-cream mb-6">
                  <ArrowLeft size={15}/> Back to Archive
                </Link>
                <span className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-cream bg-palm-deep/90 px-2.5 py-1 rounded-full">{item.category}</span>
                <h1 className="font-display text-3xl sm:text-5xl font-medium text-cream mt-4 max-w-3xl text-balance">{item.title}</h1>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-5xl px-5 sm:px-8 py-10 sm:py-14">
            {item.isSample && <p className="mb-8 inline-block font-mono text-[0.65rem] tracking-[0.15em] uppercase text-wood bg-beige-soft px-3 py-1.5 rounded-full">Sample Archive Entry — for demonstration purposes</p>}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-10 border-b border-beige text-sm">
              <div className="flex items-center gap-2 text-ink-soft"><User size={16} className="text-palm-deep shrink-0"/><span>{item.contributor}</span></div>
              <div className="flex items-center gap-2 text-ink-soft"><Calendar size={16} className="text-palm-deep shrink-0"/><span>{item.date}</span></div>
              <div className="flex items-center gap-2 text-ink-soft"><MapPin size={16} className="text-palm-deep shrink-0"/><span>{item.location}</span></div>
            </div>
            <section className="pt-10">
              <h2 className="font-display text-2xl font-medium text-ink mb-4">Introduction</h2>
              <p className="text-base sm:text-lg text-ink-soft leading-relaxed max-w-3xl">{item.introduction}</p>
            </section>
            <section className="pt-10 sm:pt-12">
              <h2 className="font-display text-2xl font-medium text-ink mb-6">Step-by-Step Process</h2>
              <ol className="space-y-6">
                {item.steps.map((step, i) => (<li key={step.title} className="flex gap-5">
                    <span className="font-mono text-sm text-cream bg-palm flex h-9 w-9 shrink-0 items-center justify-center rounded-full">{String(i + 1).padStart(2, "0")}</span>
                    <div><h3 className="font-display text-lg font-medium text-ink">{step.title}</h3><p className="mt-1 text-sm sm:text-base text-ink-soft leading-relaxed">{step.description}</p></div>
                  </li>))}
              </ol>
            </section>
            {item.tips.length > 0 && <section className="pt-10 sm:pt-12">
                <h2 className="font-display text-2xl font-medium text-ink mb-6">Traditional Knowledge &amp; Tips</h2>
                <ul className="space-y-3">
                  {item.tips.map((tip) => (<li key={tip} className="flex gap-3 rounded-2xl bg-cream-deep border border-beige p-4 text-sm sm:text-base text-ink-soft leading-relaxed"><Lightbulb size={18} className="text-clay-deep shrink-0 mt-0.5"/><span>{tip}</span></li>))}
                </ul>
              </section>}
            <section className="pt-10 sm:pt-12">
              <h2 className="font-display text-2xl font-medium text-ink mb-4">Contributor Story</h2>
              <blockquote className="border-l-4 border-clay pl-5 sm:pl-6 italic text-base sm:text-lg text-ink leading-relaxed font-display">{item.contributorStory}</blockquote>
            </section>
            {item.relatedImages.length > 0 && <section className="pt-10 sm:pt-12">
                <h2 className="font-display text-2xl font-medium text-ink mb-6">Related Images</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {item.relatedImages.map((img) => (<div key={img.src} className="relative aspect-[4/3] rounded-2xl overflow-hidden img-zoom"><Image src={img.src} alt={img.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover"/></div>))}
                </div>
              </section>}
          </div>
          <div className="mx-auto max-w-5xl px-5 sm:px-8 pb-10">
            <Link href="/#archive" className="inline-flex items-center gap-2 rounded-full border-2 border-wood text-wood px-6 py-3 text-sm font-semibold hover:bg-wood hover:text-cream transition-colors duration-200"><ArrowLeft size={16}/> Back to Archive</Link>
          </div>
        </article>);
    }

    return (<div>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-12 sm:pt-16 pb-4 sm:pb-6">
        <SectionHeading eyebrow="The Process" title="From Palm Leaf to House" lede="Six stages carry a palm frond from the tree to a finished, weatherproof roof. Each stage represents years of accumulated, hand-taught knowledge."/>
      </div>

      <WeaveDivider className="my-10"/>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-16 sm:pb-20 space-y-14 sm:space-y-16">
        {techniqueSteps.map((step, i) => {
            const reverse = i % 2 === 1;
            return (<FadeIn key={step.slug}>
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className="lg:col-span-7 relative">
                  <div className="relative aspect-[4/3] rounded-[1.75rem] overflow-hidden img-zoom">
                    <Image src={step.image} alt={step.imageAlt} fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover"/>
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
                    <Lightbulb size={18} className="text-clay-deep shrink-0 mt-0.5"/>
                    <p className="text-sm text-ink-soft leading-relaxed">{step.tip}</p>
                  </div>
                  <Link href="/#archive" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-palm-deep">
                    Browse the Archive <ArrowRight size={14}/>
                  </Link>
                </div>
              </div>
            </FadeIn>);
        })}
      </div>

      <div className="weave-bg-dark text-ink">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-medium">See the full documentation</h2>
          <p className="mt-3 text-ink-soft leading-relaxed">
            Every step above corresponds to detailed entries in the archive, contributed directly
            by community members.
          </p>
          <Link href="/#archive" className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream text-palm-deep px-7 py-3.5 text-sm font-semibold hover:bg-beige-soft transition-colors duration-200">
            Browse the Archive <ArrowRight size={16}/>
          </Link>
        </div>
      </div>
    </div>);
}
