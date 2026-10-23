"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "../common/LanguageProvider";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { supabase } from "@/lib/supabase-client";
import { images } from "@/lib/images";
const links = [
  { href: "/", label: "Home" },
  { href: "/techniques", label: "Techniques" },
  { href: "/about", label: "About" },
];
export default function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [canReview, setCanReview] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    let mounted = true;
    const updateSession = async (session) => {
      const nextUser = session?.user ?? null;
      if (mounted) {
        setUser(nextUser);
        setCanReview(false);
      }
      if (!nextUser) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", nextUser.id)
        .maybeSingle();
      if (error) {
        console.error("Could not check archive review access:", error);
        return;
      }
      if (mounted) {
        setCanReview(["editor", "admin"].includes(profile?.role));
      }
    };

    supabase.auth
      .getSession()
      .then(async ({ data: { session }, error }) => {
        if (error) {
          console.error("Could not restore the authentication session:", error);
          return;
        }
        await updateSession(session);
      })
      .catch((error) => {
        console.error("Could not restore the authentication session:", error);
      });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setCanReview(false);
      setTimeout(() => {
        void updateSession(session);
      }, 0);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  const visibleLinks = canReview
    ? [
        ...links,
        {
          href: "/admin/review",
          label: "reviewSubmissions",
          translationKey: "reviewSubmissions",
        },
      ]
    : links;
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout failed:", error);
        return;
      }
      setOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  };
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
          className="flex items-center group"
          aria-label="Traditional Palm-Leaf House Covering Techniques — Home"
        >
          <Image
            src={images.logo}
            alt=""
            loading="eager"
            sizes="(max-width: 640px) 100px, 140px"
            className="h-11 w-auto transition-transform duration-300 group-hover:scale-105 sm:h-12"
          />
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {visibleLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                    active
                      ? "text-cream bg-palm"
                      : "text-ink-soft hover:text-ink hover:bg-beige-soft"
                  }`}
                >
                  {t(link.translationKey ?? link.label.toLowerCase())}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="header-actions flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          {user ? (
            <div className="auth-actions hidden md:flex items-center gap-2">
              <span
                className="auth-email max-w-40 truncate text-xs text-ink"
                title={user.email}
              >
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="auth-secondary-button rounded-full border border-palm px-3 py-2 text-xs font-medium text-ink hover:bg-beige-soft transition-colors"
              >
                {t("logOut")}
              </button>
            </div>
          ) : (
            <div className="auth-actions hidden md:flex items-center gap-1 text-sm">
              <Link
                href="/login"
                className={`auth-primary-button rounded-full px-4 py-2 font-medium transition-colors ${isLoginPage ? "bg-palm text-cream hover:bg-palm-deep" : "text-ink hover:bg-beige-soft hover:text-palm-deep"}`}
              >
                {t("logIn")}
              </Link>
              <Link
                href="/signup"
                className={`auth-primary-button rounded-full px-4 py-2 font-medium transition-colors ${isSignupPage ? "bg-palm text-cream hover:bg-palm-deep" : "text-ink hover:bg-beige-soft hover:text-palm-deep"}`}
              >
                {t("signUp")}
              </Link>
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-full border border-beige text-ink hover:bg-beige-soft transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <ul className="px-5 pb-5 pt-1 flex flex-col gap-1 bg-cream/95 backdrop-blur">
          {visibleLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    active
                      ? "bg-palm text-cream"
                      : "text-ink hover:bg-beige-soft"
                  }`}
                >
                  {t(link.translationKey ?? link.label.toLowerCase())}
                </Link>
              </li>
            );
          })}
          <li className="mt-3 border-t border-beige pt-3">
            {user ? (
              <div className="flex items-center justify-between gap-3 px-4 py-2 text-sm text-ink">
                <span className="truncate" title={user.email}>
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="shrink-0 font-medium text-palm-deep hover:text-palm"
                >
                  {t("logOut")}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 px-4 py-2 text-sm">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="text-ink"
                >
                  {t("logIn")}
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="font-medium text-palm-deep hover:text-palm"
                >
                  {t("signUp")}
                </Link>
              </div>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}
