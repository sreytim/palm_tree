import Gallery from "@/components/gallery/Gallery";
import { galleryImages } from "@/data/gallery";

export const metadata = {
  title: "Gallery | Traditional Palm-Leaf House Covering Techniques",
  description:
    "A visual collection of palm-leaf house building, weaving, and community documentation.",
};

export default function GalleryPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-clay-deep">
          Photo archive
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium text-ink sm:text-5xl">
          Gallery
        </h1>
      </div>
      <Gallery images={galleryImages} />
    </main>
  );
}
