import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import Gallery from "@/components/Gallery";
import { galleryImages } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Gallery | Traditional Palm-Leaf House Covering Techniques",
  description: "A visual gallery documenting palm leaves, traditional houses, tools, and the people behind the craft.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 sm:py-24">
      <SectionHeading
        eyebrow="Photo Gallery"
        title="Documenting the craft, in pictures"
        lede="Palm leaves, tools, weaving in progress, finished houses, and the people who make it all possible. Select any photo to see it in detail."
      />
      <div className="mt-14">
        <Gallery images={galleryImages} />
      </div>
    </div>
  );
}
