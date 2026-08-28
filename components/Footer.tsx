import Link from "next/link";
import { Leaf } from "lucide-react";

const categories = [
  "Palm Leaf Preparation",
  "Weaving Techniques",
  "House Construction",
  "Attachment Techniques",
  "Maintenance & Repair",
  "Personal Stories",
];

export default function Footer() {
  return (
    <footer className="weave-bg-dark text-cream">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-palm-deep">
              <Leaf size={18} />
            </span>
            <span className="font-display text-lg">Palm-Leaf House Archive</span>
          </div>
          <p className="text-sm text-cream/75 leading-relaxed">
            Preserving traditional knowledge, one story and technique at a time.
          </p>
        </div>

        <div>
          <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-beige mb-4">Navigate</h3>
          <ul className="space-y-2 text-sm text-cream/80">
            <li><Link className="hover:text-cream transition-colors" href="/">Home</Link></li>
            <li><Link className="hover:text-cream transition-colors" href="/archive">Archive</Link></li>
            <li><Link className="hover:text-cream transition-colors" href="/techniques">Techniques</Link></li>
            <li><Link className="hover:text-cream transition-colors" href="/stories">Stories</Link></li>
            <li><Link className="hover:text-cream transition-colors" href="/gallery">Gallery</Link></li>
            <li><Link className="hover:text-cream transition-colors" href="/about">About This Archive</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-beige mb-4">Categories</h3>
          <ul className="space-y-2 text-sm text-cream/80">
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/archive?category=${encodeURIComponent(cat)}`}
                  className="hover:text-cream transition-colors"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-beige mb-4">A Community Cultural Archive</h3>
          <p className="text-sm text-cream/75 leading-relaxed">
            Built with and for the community members who shared their knowledge, experience, and time.
          </p>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cream/60">
          <p>&copy; {new Date().getFullYear()} Traditional Palm-Leaf House Covering Techniques.</p>
          <p>A Community Cultural Archive</p>
        </div>
      </div>
    </footer>
  );
}
