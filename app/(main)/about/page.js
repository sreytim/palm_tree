"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, MapPin, Heart, BookOpen, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/common/SectionHeading";
import FadeIn from "@/components/common/FadeIn";
import WeaveDivider from "@/components/common/WeaveDivider";
import { useLanguage } from "@/components/common/LanguageProvider";
import { images } from "@/lib/images";

export default function AboutPage() {
  const { language } = useLanguage();
  const isKhmer = language === "km";

  const intro = isKhmer
    ? "បណ្ណសារនេះកត់ត្រាបច្ចេកទេសប្រពៃណីក្នុងការប្រើស្លឹកត្នោតដើម្បីគ្របផ្ទះ រួមទាំងរបៀបរៀបចំ ស្រស់ស្អាត ការភ្ជាប់ និងការថែទាំ។ ចំណេះដឹងនេះត្រូវបានប្រមូលពីមនុស្សចាស់ៗក្នុងសហគមន៍ ដែលមានបទពិសោធន៍ក្នុងការធ្វើ ធ្វើជិតផ្ទះ ឬថែទាំផ្ទះប្រពៃណីទាំងនេះ។"
    : "This archive documents traditional techniques for using palm leaves to cover houses, including how the leaves are prepared, woven, attached, and maintained. The knowledge is collected from older people in the community who have experience making, living in, or maintaining these traditional houses.";

  const founderStory = isKhmer
    ? "ខ្ញុំបានធំឡើងដោយឃើញដំបូលស្លឹកត្នោតនៅលើផ្ទះជុំវិញ neighborhood របស់ខ្ញុំ ប៉ុន្តែខ្ញុំមិនដែលរៀនពីរបៀបធ្វើវា។ នៅពេលដែលខ្ញុំចាប់ផ្តើមសួរភ relatives និងអ្នកជិតខាងអំពីដំណើរការ ខ្ញុំបានដឹងថាចំណេះដឹងលម្អិត និងកម្រិតខ្ពស់ដែលមានតែក្នុងការចងចាំ ប៉ុន្តែគ្មានការកត់ត្រាទេ។ បណ្ណសារនេះបានចាប់ផ្តើមជាការខិតខំផ្ទាល់ខ្លួនដើម្បីកត់ត្រាចំណេះដឹងនេះមុនពេលវាបាត់បង់ និងផ្តល់ឱ្យអ្នកដែលកាន់កាប់វានូវកន្លែងដ៏ល្អ និងអាចស្គាល់បានយូរ។"
    : "I grew up seeing palm-leaf roofs on houses throughout my neighborhood, but I never learned how they were actually made. When I started asking older relatives and neighbors about the process, I realized how much detailed, hard-won knowledge existed only in memory, never written down. This archive began as a personal effort to record that knowledge before it is lost, and to give the people who hold it a proper, lasting place to be recognized.";

  const sourceText = isKhmer
    ? "រាល់កំណត់ត្រានៅក្នុងបណ្ណសារនេះត្រូវបានធ្វើឡើងពីការសន្ទនាដោយផ្ទាល់ជាមួយអ្នកនៅក្នុងសហគមន៍ — សម្ភាសន៍ដែលបានថតតាមកាលបរិច្ឆេទ បន្ទាន់សិក្សា និងរូបថតដែលថតដោយការអនុញ្ញាត។ មាតិកាបច្ចេកទេសទាំងនេះមិនមកពីសៀវភៅ ឬអ៊ីនធឺណិតទេ វាមកពីបទពិសោធន៍ពិតប្រាកដដែលបានបន្តតាំងពីជំនាន់មួយទៅមួយជំនាន់។"
    : "Every entry in this archive is built from direct conversations with people in the community — recorded interviews, household visits, and photographs taken with permission. None of the technical content here comes from books or the internet; it comes from lived experience, passed down and now written down for the first time.";

  const contributorsText = isKhmer
    ? "អ្នករួមចំណែកគឺជាអ្នកជិតខាង សាច់ញាតិ និងអ្នកចាស់ក្នុងសហគមន៍ — អ្នកដែលបានសាងសង់ ធ្វើជីវិត ជួសជុល ឬធំឡើងជាមួយដំបូលស្លឹកត្នោត។ រាល់អ្នករួមចំណែកត្រូវបានកត់ឈ្មោះ (ឬតាមការពេញចិត្ត) ក្បាលគ្រប់ចំណែកនៃចំណេះដឹងที่ពួកគេចែករំលែក ដោយហេតុថាមនុស្សនៅពីក្រោយសិប្បករនេះគឺជាផ្នែកមួយដ៏សំខាន់នៃបណ្ណសារដូចគ្នានឹងបច្ចេកទេសផងដែរ។"
    : "Contributors are neighbors, relatives, and community elders — people who have built, lived in, repaired, or grown up under a palm-leaf roof. Each contributor is credited by name (or by their preference) alongside the knowledge they share, because the people behind this craft are as much a part of the archive as the techniques themselves.";

  const preservationText = isKhmer
    ? "សម្ភារៈ និងវិធីសាស្ត្រសាងសង់ផ្លាស់ប្តូរយ៉ាងលឿន ហើយជាមួយនឹងចំនួនជំនាន់មួយៗ មានមនុស្សកាន់តែតិចដែលរៀនពីជំនាញទាំងនេះដោយផ្ទាល់។ នៅពេលដែលបច្ចេកទេសត្រូវបានរក្សាទុកតែក្នុងការចងចាំរបស់អ្នកចាស់មួយចំនួន បច្ចេកទេសនោះនឹងស្ថិតនៅកម្រិតមួយជីវិតពីការបាត់បង់ទាំងស្រុង។ បណ្ណសារនេះមានបេសកកម្មដើម្បីធ្វើឱ្យការបាត់បង់នេះយឺតឡើង — មិនមែនដើម្បីផ្អាកសិប្បករនោះឱ្យគេចខ្លួននោះទេ ប៉ុន្តែដើម្បីធានាថាចំណេះដឹង និងមនុស្សដែលកាន់កាប់វាត្រូវបានចងចាំត្រឹមត្រូវ និងអាចរៀនពីវាបានយូរជាងនេះ។"
    : "Building materials and methods change quickly, and with each generation, fewer people learn skills like these firsthand. Once a technique exists only in the memory of a small number of elders, it is one lifetime away from disappearing entirely. This archive exists to slow that loss — not by freezing the craft in place, but by making sure the knowledge, and the people who hold it, are properly remembered and can be learned from for years to come.";

  const archiveCta = isKhmer ? "ស្វែងយល់ពីបណ្ណសារ" : "Explore the Archive";

  return (
    <div>
      <div className="mx-auto max-w-4xl px-5 sm:px-8 pt-12 sm:pt-16 pb-6 sm:pb-8 text-center">
        <SectionHeading
          eyebrow={isKhmer ? "អំពីបណ្ណសារនេះ" : "About This Archive"}
          title={isKhmer ? "បណ្ណសារនេះជាអ្វី?" : "What is this archive?"}
          align="center"
        />
        <p className="mt-6 text-base sm:text-lg text-ink-soft leading-relaxed max-w-2xl mx-auto">
          {intro}
        </p>
      </div>

      <WeaveDivider className="my-6" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <FadeIn className="lg:col-span-5">
          <div className="relative aspect-square rounded-[2rem] overflow-hidden">
            <Image
              src={images.aboutFounder}
              alt={isKhmer ? "មនុស្សម្នាក់កំពុងកត់ត្រាសន្ទនាជាមួយអ្នកចាស់ក្នុងសហគមន៍" : "A person documenting a conversation with a community elder"}
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
          </div>
        </FadeIn>
        <FadeIn delay={100} className="lg:col-span-7">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={18} className="text-clay-deep" />
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-clay-deep">
              {isKhmer ? "ហេតុអ្វីខ្ញុំបានបង្កើតបណ្ណសារនេះ" : "Why I Created This Archive"}
            </h2>
          </div>
          <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
            {founderStory}
          </p>
        </FadeIn>
      </div>

      <div className="bg-cream-deep">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
          <FadeIn>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={18} className="text-clay-deep" />
              <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-clay-deep">
                {isKhmer ? "ចំណេះដឹងមកពីណា" : "Where the Knowledge Comes From"}
              </h2>
            </div>
            <p className="text-base text-ink-soft leading-relaxed">
              {sourceText}
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-clay-deep" />
              <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-clay-deep">
                {isKhmer ? "អ្នកណាជួយចំណែក" : "Who Contributes"}
              </h2>
            </div>
            <p className="text-base text-ink-soft leading-relaxed">
              {contributorsText}
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 sm:py-16">
        <FadeIn>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={18} className="text-clay-deep" />
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-clay-deep">
              {isKhmer ? "ហេតុអ្វីការថែរក្សាសំខាន់" : "Why Preservation Matters"}
            </h2>
          </div>
          <p className="text-base sm:text-lg text-ink-soft leading-relaxed max-w-3xl">
            {preservationText}
          </p>
        </FadeIn>
      </div>

      <div className="weave-bg-dark text-ink">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-medium">
            {isKhmer ? "ស្វែងយល់អំពីអ្វីដែលត្រូវបានកត់ត្រារួចរាល់" : "Explore what has been documented so far"}
          </h2>
          <Link
            href="/#archive"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-cream text-palm-deep px-7 py-3.5 text-sm font-semibold hover:bg-beige-soft transition-colors duration-200"
          >
            {archiveCta} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
