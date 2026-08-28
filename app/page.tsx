import Link from "next/link";
import Image from "next/image";
import { Leaf, Scissors, Waves, Hammer, Wrench, Users, Home as HomeIcon, ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import CategoryCard from "@/components/CategoryCard";
import ProcessTimeline from "@/components/ProcessTimeline";
import WeaveDivider from "@/components/WeaveDivider";
import FadeIn from "@/components/FadeIn";
import { images } from "@/lib/images";

const discoverCards = [
  {
    title: "Preparing the Palm Leaves",
    description: "How leaves are selected, cleaned, and dried before they are ready for weaving.",
    image: images.categoryPreparing,
    imageAlt: "Palm leaves being cleaned and prepared",
    href: "/archive?category=Palm%20Leaf%20Preparation",
    icon: Scissors,
  },
  {
    title: "Weaving the Leaves",
    description: "The cross-weave pattern that binds loose leaflets into a single watertight panel.",
    image: images.categoryWeaving,
    imageAlt: "Hands weaving palm leaves into a pattern",
    href: "/archive?category=Weaving%20Techniques",
    icon: Waves,
  },
  {
    title: "Attaching the Covering",
    description: "How finished panels are lashed to a roof frame, row by overlapping row.",
    image: images.categoryAttaching,
    imageAlt: "Woven panels being attached to a roof frame",
    href: "/archive?category=Attachment%20Techniques",
    icon: Hammer,
  },
  {
    title: "Maintaining the Roof",
    description: "The yearly inspection and repair ritual that keeps a roof watertight for years.",
    image: images.categoryMaintaining,
    imageAlt: "A person repairing a section of roof",
    href: "/archive?category=Maintenance%20%26%20Repair",
    icon: Wrench,
  },
  {
    title: "Stories from Elders",
    description: "First-hand memories from the people who built, lived in, and maintained these houses.",
    image: images.categoryStories,
    imageAlt: "Portrait of a community elder",
    href: "/stories",
    icon: Users,
  },
  {
    title: "Traditional Houses",
    description: "Full documentation of standing houses, their structure, and their history.",
    image: images.categoryHouses,
    imageAlt: "A complete traditional house with a palm leaf roof",
    href: "/archive?category=Traditional%20Houses",
    icon: HomeIcon,
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Why This Knowledge Matters */}
      <section id="why-it-matters" className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <FadeIn className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden">
              <Image
                src={images.aboutCommunity}
                alt="Community members working together on a traditional roof"
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={100} className="lg:col-span-7">
            <SectionHeading
              eyebrow="Why This Knowledge Matters"
              title="Practical knowledge, passed hand to hand between generations"
            />
            <div className="mt-6 space-y-4 text-base sm:text-lg text-ink-soft leading-relaxed max-w-2xl">
              <p>
                For generations, families have covered their homes using nothing more than palm
                leaves, patience, and knowledge passed down without ever being written on paper. A
                skilled elder can look at a single frond and know exactly how it should be cut,
                dried, and woven — knowledge built entirely through years of practice and memory.
              </p>
              <p>
                As building materials change and fewer young people learn the craft, this
                knowledge is at risk of disappearing within a single generation. Documenting these
                techniques now, directly from the people who hold them, helps preserve not just a
                building method, but a piece of cultural memory.
              </p>
            </div>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-palm-deep"
            >
              Read more about this archive <ArrowRight size={15} />
            </Link>
          </FadeIn>
        </div>
      </section>

      <WeaveDivider />

      {/* What You'll Discover */}
      <section className="bg-cream-deep">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
          <FadeIn>
            <SectionHeading
              eyebrow="What You'll Discover"
              title="Six ways into the archive"
              lede="Every entry in this archive falls somewhere along the journey from living palm tree to finished, weatherproof roof — and the people who carry that knowledge."
            />
          </FadeIn>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {discoverCards.map((card, i) => (
              <FadeIn key={card.title} delay={i * 60}>
                <CategoryCard {...card} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* From Knowledge to Archive */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-28">
        <FadeIn>
          <SectionHeading
            eyebrow="From Knowledge to Archive"
            title="How each entry is collected"
            lede="Every technique documented here follows the same careful path, from a conversation with a community member to a published record anyone can explore."
          />
        </FadeIn>
        <div className="mt-14">
          <ProcessTimeline />
        </div>
      </section>

      {/* Final CTA */}
      <section className="weave-bg-dark text-cream">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-20 sm:py-28 text-center">
          <FadeIn>
            <Leaf className="mx-auto mb-5" size={28} />
            <h2 className="font-display text-3xl sm:text-4xl font-medium">
              Help Preserve Traditional Knowledge
            </h2>
            <p className="mt-4 text-cream/80 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
              Every story, technique, and memory can help keep this knowledge alive.
            </p>
            <Link
              href="/archive"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream text-palm-deep px-8 py-4 text-sm font-semibold tracking-wide hover:bg-beige-soft transition-colors duration-200"
            >
              Explore the Archive
              <ArrowRight size={16} />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
