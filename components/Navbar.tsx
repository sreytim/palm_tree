"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Leaf } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/archive", label: "Archive" },
  { href: "/techniques", label: "Techniques" },
  { href: "/stories", label: "Stories" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 backdrop-blur shadow-[0_1px_0_0_rgba(107,68,35,0.15)]"
          : "bg-cream/70 backdrop-blur-sm"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto max-w-7xl px-5 sm:px-8 flex items-center justify-between h-16 sm:h-20"
      >
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Traditional Palm-Leaf House Covering Techniques — Home"
        >
          <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-palm text-cream transition-transform duration-300 group-hover:rotate-12">
            <Leaf size={18} strokeWidth={2} />
          </span>
          <span className="font-display text-base sm:text-lg leading-tight text-ink">
            Palm-Leaf
            <span className="block text-[0.65rem] sm:text-xs font-mono tracking-[0.15em] uppercase text-ink-soft">
              House Archive
            </span>
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                    active ? "text-cream bg-palm" : "text-ink-soft hover:text-ink hover:bg-beige-soft"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden flex items-center justify-center h-10 w-10 rounded-full border border-beige text-ink hover:bg-beige-soft transition-colors"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="px-5 pb-5 pt-1 flex flex-col gap-1 bg-cream/95 backdrop-blur">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    active ? "bg-palm text-cream" : "text-ink hover:bg-beige-soft"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
