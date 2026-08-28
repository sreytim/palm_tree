"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { GalleryImage } from "@/lib/types";

export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const showNext = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, showPrev, showNext]);

  const active = activeIndex !== null ? images[activeIndex] : null;

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl img-zoom focus-visible:outline focus-visible:outline-2 focus-visible:outline-clay"
            aria-haspopup="dialog"
          >
            <Image
              src={img.src}
              alt={img.alt}
              width={800}
              height={600}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wood-deep/70 via-wood-deep/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute bottom-3 left-3 right-3 text-cream text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-left">
              {img.title}
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-wood-deep/90 backdrop-blur-sm p-4 sm:p-8"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close image viewer"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 transition-colors"
          >
            <X size={22} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="Previous image"
            className="hidden sm:flex absolute left-4 sm:left-6 h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="Next image"
            className="hidden sm:flex absolute right-4 sm:right-6 h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 transition-colors"
          >
            <ChevronRight size={22} />
          </button>

          <div
            className="max-w-4xl w-full max-h-full overflow-y-auto rounded-2xl bg-cream"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-wood-deep">
              <Image src={active.src} alt={active.alt} fill sizes="90vw" className="object-contain" />
            </div>
            <div className="p-6">
              <span className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-clay-deep bg-clay/10 px-2.5 py-1 rounded-full">
                {active.category}
              </span>
              <h3 className="font-display text-2xl font-medium text-ink mt-3">{active.title}</h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{active.description}</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft/80">
                <span>{active.contributor}</span>
                {active.location && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {active.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
