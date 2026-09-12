"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { localizeLabel } from "@/lib/i18n";
export default function CategoryCard({ title, description, image, imageAlt, href, icon: Icon, }) {
    const { language } = useLanguage();
    return (<Link href={href} className="group relative flex flex-col overflow-hidden rounded-3xl bg-cream border border-beige hover:shadow-[0_20px_40px_-20px_rgba(43,36,23,0.35)] transition-shadow duration-300">
      <div className="relative aspect-[4/3] img-zoom">
        <Image src={image} alt={imageAlt} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-wood-deep/60 via-wood-deep/0 to-transparent"/>
        <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-cream text-palm-deep shadow-md">
          <Icon size={18}/>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-medium text-ink mb-2">
          {localizeLabel(title, language)}
        </h3>
        <p className="text-sm text-ink-soft leading-relaxed flex-1">
          {localizeLabel(description, language)}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-palm-deep">
          {localizeLabel("Explore", language)}
          <ArrowUpRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/>
        </span>
      </div>
    </Link>);
}
