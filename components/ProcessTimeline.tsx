import Image from "next/image";
import { Mic, FileText, Camera, Archive, Share2 } from "lucide-react";
import { images } from "@/lib/images";
import FadeIn from "./FadeIn";

const steps = [
  {
    icon: Mic,
    title: "Interview",
    description: "Sitting with community elders to listen and record their knowledge and memories.",
    image: images.processInterview,
  },
  {
    icon: FileText,
    title: "Document",
    description: "Writing down techniques, steps, and terminology in clear, structured detail.",
    image: images.processDocument,
  },
  {
    icon: Camera,
    title: "Photograph",
    description: "Capturing tools, materials, and finished work to accompany each written record.",
    image: images.processPhotograph,
  },
  {
    icon: Archive,
    title: "Preserve",
    description: "Organizing every entry into the archive so it can be found and referenced later.",
    image: images.processPreserve,
  },
  {
    icon: Share2,
    title: "Share",
    description: "Publishing the record so it can be explored by the community and beyond.",
    image: images.processShare,
  },
];

export default function ProcessTimeline() {
  return (
    <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <FadeIn as="li" delay={i * 80} key={step.title} className="relative flex flex-col">
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="hidden lg:block absolute top-[4.5rem] left-[calc(50%+2.25rem)] w-[calc(100%-2rem)] h-px bg-beige"
              />
            )}
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 img-zoom mx-auto w-full max-w-[9rem] lg:max-w-none">
              <Image src={step.image} alt="" fill sizes="180px" className="object-cover" />
            </div>
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-palm text-cream shrink-0">
                <Icon size={15} />
              </span>
              <h3 className="font-display text-lg font-medium text-ink">{step.title}</h3>
            </div>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed text-center lg:text-left">
              {step.description}
            </p>
          </FadeIn>
        );
      })}
    </ol>
  );
}
