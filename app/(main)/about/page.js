"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, MapPin, Heart, BookOpen, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/common/SectionHeading";
import FadeIn from "@/components/common/FadeIn";
import WeaveDivider from "@/components/common/WeaveDivider";
import { useLanguage } from "@/components/common/LanguageProvider";
import { localizeLabel } from "@/lang/i18n";
import { images } from "@/lib/images";

/**
 * Every paragraph on this page is written as an `{ en, km }` pair.
 *
 * The page previously branched on `language === "km"` and carried hand-written
 * Khmer strings that still contained English words ("neighborhood",
 * "relatives"), so a Khmer reader met a half-translated page. Keeping both
 * languages side by side makes that kind of drift visible while editing.
 */
const copy = {
  eyebrow: { en: "About This Archive", km: "អំពីបណ្ណសារនេះ" },
  title: { en: "What is this archive?", km: "បណ្ណសារនេះជាអ្វី?" },
  intro: {
    en: "This archive documents traditional techniques for using palm leaves to cover houses — selecting and drying the leaves, weaving them into panels, tying those panels to the frame, and keeping the roof in repair. The knowledge comes from elders in the community who have built, lived under, or repaired these roofs themselves.",
    km: "បណ្ណសារនេះកត់ត្រាបច្ចេកទេសប្រពៃណីក្នុងការប្រើស្លឹកត្នោតដើម្បីប្រក់ផ្ទះ — រាប់តាំងពីការជ្រើសរើស និងការហាលស្លឹក ការត្បាញជាបន្ទះ ការចងបន្ទះលើគ្រោងដំបូល រហូតដល់ការថែទាំឱ្យដំបូលប្រើបានយូរ។ ចំណេះដឹងនេះប្រមូលបានពីចាស់ទុំក្នុងសហគមន៍ ដែលធ្លាប់សាងសង់ រស់នៅក្រោម ឬជួសជុលដំបូលបែបនេះដោយផ្ទាល់។",
  },
  founderEyebrow: {
    en: "Why I Created This Archive",
    km: "ហេតុអ្វីខ្ញុំបង្កើតបណ្ណសារនេះ",
  },
  founderStory: {
    en: "I grew up seeing palm-leaf roofs on the houses around my village, but I never learned how they were actually made. When I began asking older relatives and neighbours about the work, I realized how much detailed knowledge lived only in memory and had never been written down. This archive began as a personal effort to record that knowledge before it is lost, and to give the people who hold it a proper place to be recognized.",
    km: "ខ្ញុំបានធំឡើងដោយឃើញដំបូលស្លឹកត្នោតនៅលើផ្ទះជុំវិញភូមិរបស់ខ្ញុំ ប៉ុន្តែខ្ញុំមិនដែលរៀនពីរបៀបធ្វើវាដោយផ្ទាល់ទេ។ ពេលខ្ញុំចាប់ផ្តើមសួរញាតិមិត្តចាស់ៗ និងអ្នកជិតខាងអំពីការងារនេះ ខ្ញុំបានដឹងថាចំណេះដឹងលម្អិតជាច្រើនមានតែនៅក្នុងការចងចាំ ហើយមិនដែលត្រូវបានកត់ត្រាទុកឡើយ។ បណ្ណសារនេះចាប់ផ្តើមជាការខិតខំផ្ទាល់ខ្លួន ដើម្បីកត់ត្រាចំណេះដឹងនេះមុនពេលវាបាត់បង់ និងផ្តល់កន្លែងដ៏សក្តិសមដល់អ្នកដែលកាន់កាប់វា។",
  },
  founderAlt: {
    en: "A person documenting a conversation with a community elder",
    km: "មនុស្សម្នាក់កំពុងកត់ត្រាសន្ទនាជាមួយចាស់ទុំក្នុងសហគមន៍",
  },
  sourceEyebrow: {
    en: "Where the Knowledge Comes From",
    km: "ចំណេះដឹងនេះមកពីណា",
  },
  sourceText: {
    en: "Every entry is built from direct conversations with people in the community — recorded interviews, household visits, and photographs taken with permission. The technical detail here does not come from books or websites; it comes from practice, passed down and now written down for the first time.",
    km: "រាល់កំណត់ត្រាកសាងឡើងពីការសន្ទនាផ្ទាល់ជាមួយអ្នកនៅក្នុងសហគមន៍ — ការសម្ភាសន៍ដែលបានកត់ត្រា ការទៅសួរសុខទុក្ខគ្រួសារ និងរូបថតដែលថតដោយមានការអនុញ្ញាត។ មាតិកាបច្ចេកទេសនៅទីនេះមិនមែនចម្លងពីសៀវភៅ ឬគេហទំព័រទេ គឺមកពីការអនុវត្តពិត ដែលបានបន្តពីជំនាន់មួយទៅជំនាន់មួយ ហើយឥឡូវនេះត្រូវបានកត់ត្រាជាលើកដំបូង។",
  },
  contributorsEyebrow: { en: "Who Contributes", km: "អ្នកណាខ្លះចូលរួមចំណែក" },
  contributorsText: {
    en: "Contributors are neighbours, relatives and community elders — people who have built, lived under, repaired, or grown up beneath a palm-leaf roof. Each contributor is credited by name, or by their own preference, beside the knowledge they shared, because the people behind this craft are as much a part of the archive as the techniques.",
    km: "អ្នករួមចំណែកគឺជាអ្នកជិតខាង ញាតិមិត្ត និងចាស់ទុំក្នុងសហគមន៍ — អ្នកដែលធ្លាប់សាងសង់ រស់នៅក្រោម ជួសជុល ឬធំឡើងក្រោមដំបូលស្លឹកត្នោត។ អ្នករួមចំណែកម្នាក់ៗត្រូវបានកត់ឈ្មោះ ឬតាមការពេញចិត្តរបស់ពួកគេ ទន្ទឹមនឹងចំណេះដឹងដែលពួកគេចែករំលែក ព្រោះមនុស្សដែលនៅពីក្រោយសិប្បកម្មនេះ គឺជាផ្នែកមួយសំខាន់នៃបណ្ណសារ ដូចគ្នានឹងបច្ចេកទេសដែរ។",
  },
  preservationEyebrow: {
    en: "Why Preservation Matters",
    km: "ហេតុអ្វីការថែរក្សាមានសារៈសំខាន់",
  },
  preservationText: {
    en: "Building materials and methods change quickly, and with each generation fewer people learn these skills firsthand. Once a technique survives only in the memory of a handful of elders, it is one lifetime away from disappearing. This archive exists to slow that loss — not by freezing the craft in place, but by making sure the knowledge, and the people who hold it, are remembered properly and can be learned from for years to come.",
    km: "សម្ភារៈ និងវិធីសាស្ត្រសាងសង់ផ្លាស់ប្តូរយ៉ាងលឿន ហើយជាមួយជំនាន់មួយៗ មានមនុស្សតិចទៅៗដែលរៀនជំនាញទាំងនេះដោយផ្ទាល់។ នៅពេលដែលបច្ចេកទេសមួយនៅសល់តែក្នុងការចងចាំរបស់ចាស់ទុំពីរបីនាក់ បច្ចេកទេសនោះគ្រាន់តែជិតមួយជីវិតពីការបាត់បង់ទាំងស្រុង។ បណ្ណសារនេះមានគោលដៅធ្វើឱ្យការបាត់បង់នោះយឺតឡើង — មិនមែនបង្កកសិប្បកម្មនេះចោលទេ តែធានាថាចំណេះដឹង និងមនុស្សដែលកាន់កាប់វា ត្រូវបានចងចាំយ៉ាងត្រឹមត្រូវ និងអាចរៀនបន្តបានយូរអង្វែង។",
  },
  ctaTitle: {
    en: "Explore what has been documented so far",
    km: "ស្វែងយល់ពីអ្វីដែលបានកត់ត្រារួច",
  },
  cta: { en: "Explore the Archive", km: "ស្វែងរកក្នុងបណ្ណសារ" },
};

export default function AboutPage() {
  const { language } = useLanguage();
  const text = (value) => localizeLabel(value, language);

  return (
    <div>
      <div className="mx-auto max-w-4xl px-5 sm:px-8 pt-12 sm:pt-16 pb-6 sm:pb-8 text-center">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          align="center"
        />
        <p className="mt-6 text-base sm:text-lg text-ink-soft leading-relaxed max-w-2xl mx-auto">
          {text(copy.intro)}
        </p>
      </div>

      <WeaveDivider className="my-6" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <FadeIn className="lg:col-span-5">
          <div className="relative aspect-square rounded-[2rem] overflow-hidden">
            <Image
              src={images.aboutFounder}
              alt={text(copy.founderAlt)}
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
              {text(copy.founderEyebrow)}
            </h2>
          </div>
          <p className="text-base sm:text-lg text-ink-soft leading-relaxed">
            {text(copy.founderStory)}
          </p>
        </FadeIn>
      </div>

      <div className="bg-cream-deep">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
          <FadeIn>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={18} className="text-clay-deep" />
              <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-clay-deep">
                {text(copy.sourceEyebrow)}
              </h2>
            </div>
            <p className="text-base text-ink-soft leading-relaxed">
              {text(copy.sourceText)}
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <div className="flex items-center gap-2 mb-3">
              <Users size={18} className="text-clay-deep" />
              <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-clay-deep">
                {text(copy.contributorsEyebrow)}
              </h2>
            </div>
            <p className="text-base text-ink-soft leading-relaxed">
              {text(copy.contributorsText)}
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 sm:py-16">
        <FadeIn>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={18} className="text-clay-deep" />
            <h2 className="font-mono text-xs tracking-[0.2em] uppercase text-clay-deep">
              {text(copy.preservationEyebrow)}
            </h2>
          </div>
          <p className="text-base sm:text-lg text-ink-soft leading-relaxed max-w-3xl">
            {text(copy.preservationText)}
          </p>
        </FadeIn>
      </div>

      <div className="weave-bg-dark text-ink">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12 sm:py-16 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-medium">
            {text(copy.ctaTitle)}
          </h2>
          <Link
            href="/archive"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-cream text-palm-deep px-7 py-3.5 text-sm font-semibold hover:bg-beige-soft transition-colors duration-200"
          >
            {text(copy.cta)} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
