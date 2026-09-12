import Image from "next/image";
import Link from "next/link";
import { Users, MapPin, Heart, BookOpen, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import FadeIn from "@/components/FadeIn";
import WeaveDivider from "@/components/WeaveDivider";
import { images } from "@/lib/images";
export const metadata = {
    title: "About This Archive | Traditional Palm-Leaf House Covering Techniques",
    description: "Learn what this archive is, why it was created, and where its knowledge comes from.",
};
export default function AboutPage() {
    return (<div>
      <div className="mx-auto max-w-4xl px-5 sm:px-8 pt-12 sm:pt-16 pb-6 sm:pb-8 text-center">
        <SectionHeading eyebrow="About This Archive" title="What is this archive?" align="center"/>
        <p className="mt-6 text-base sm:text-lg text-ink-soft leading-relaxed max-w-2xl mx-auto">
          This archive documents traditional techniques for using palm leaves to cover houses,
          including how the leaves are prepared, woven, attached, and maintained. The knowledge is
          collected from older people in the community who have experience making, living in, or
          maintaining these traditional houses.
        </p>
      </div>

      <WeaveDivider className="my-6"/>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <FadeIn className="lg:col-span-5">
          <div className="relative aspect-square rounded-[2rem] overflow-hidden">
            <Image src={images.aboutFounder} alt="A person documenting a conversation with a community elder" fill sizes="(max-width: 1024px) 90vw, 40vw" className="object-cover"/>
          </div>
        </FadeIn>
        <FadeIn delay={100} className="lg:col-span-7">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={18} className="text-clay-deep"/>
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-clay-deep">
              Why I Created This Archive
            </h2>
          </div>
          <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
            I grew up seeing palm-leaf roofs on houses throughout my neighborhood, but I never
            learned how they were actually made. When I started asking older relatives and
            neighbors about the process, I realized how much detailed, hard-won knowledge existed
            only in memory, never written down. This archive began as a personal effort to record
            that knowledge before it is lost, and to give the people who hold it a proper, lasting
            place to be recognized.
          </p>
        </FadeIn>
      </div>

      <div className="bg-cream-deep">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
          <FadeIn>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={18} className="text-clay-deep"/>
              <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-clay-deep">
                Where the Knowledge Comes From
              </h2>
            </div>
            <p className="text-base text-ink-soft leading-relaxed">
              Every entry in this archive is built from direct conversations with people in the
              community — recorded interviews, household visits, and photographs taken with
              permission. None of the technical content here comes from books or the internet; it
              comes from lived experience, passed down and now written down for the first time.
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-clay-deep"/>
              <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-clay-deep">
                Who Contributes
              </h2>
            </div>
            <p className="text-base text-ink-soft leading-relaxed">
              Contributors are neighbors, relatives, and community elders — people who have built,
              lived in, repaired, or grown up under a palm-leaf roof. Each contributor is credited
              by name (or by their preference) alongside the knowledge they share, because the
              people behind this craft are as much a part of the archive as the techniques
              themselves.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 sm:py-16">
        <FadeIn>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={18} className="text-clay-deep"/>
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-clay-deep">
              Why Preservation Matters
            </h2>
          </div>
          <p className="text-base sm:text-lg text-ink-soft leading-relaxed max-w-3xl">
            Building materials and methods change quickly, and with each generation, fewer people
            learn skills like these firsthand. Once a technique exists only in the memory of a
            small number of elders, it is one lifetime away from disappearing entirely. This
            archive exists to slow that loss — not by freezing the craft in place, but by making
            sure the knowledge, and the people who hold it, are properly remembered and can be
            learned from for years to come.
          </p>
        </FadeIn>
      </div>

      <div className="weave-bg-dark text-ink">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-medium">
            Explore what has been documented so far
          </h2>
          <Link href="/#archive" className="mt-7 inline-flex items-center gap-2 rounded-full bg-cream text-palm-deep px-7 py-3.5 text-sm font-semibold hover:bg-beige-soft transition-colors duration-200">
            Explore the Archive <ArrowRight size={16}/>
          </Link>
        </div>
      </div>
    </div>);
}
