"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";
import { useLanguage } from "../common/LanguageProvider";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { supabase } from "@/lib/supabase-client";
import { images } from "@/lib/images";

// Pages every visitor can reach. Signed-in members get two more links appended
// after a divider, so the header always stays one predictable row.
const PUBLIC_LINKS = [
  { href: "/", labelKey: "home" },
  { href: "/techniques", labelKey: "techniques" },
  { href: "/about", labelKey: "about" },
];

const ROLE_LABEL_KEYS = {
  reader: "roleReader",
  contributor: "roleContributor",
  editor: "roleEditor",
  admin: "roleAdmin",
};

// A link stays active on its own page and on every page nested under it, so
// "My submissions" is still highlighted while a returned entry is edited.
function isActivePath(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const accountRef = useRef(null);

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
        setRole(null);
      }
      if (!nextUser) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", nextUser.id)
        .maybeSingle();
      if (error) {
        console.error("Could not check archive access role:", error);
        return;
      }
      if (mounted) {
        setRole(profile?.role ?? null);
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
      setRole(null);
      setTimeout(() => {
        void updateSession(session);
      }, 0);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Navigating away always leaves the header collapsed. Adjusting state during
  // render is React's recommended alternative to an effect here: both menus are
  // already closed by the time the new page paints.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMobileOpen(false);
    setAccountOpen(false);
  }

  // The account panel closes on an outside click and on Escape, so it never
  // stays open over the page it just navigated to.
  useEffect(() => {
    if (!accountOpen) return undefined;

    const onPointerDown = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accountOpen]);

  const isAdmin = role === "admin";
  const canManageEntries = role === "editor" || role === "admin";
  const memberLinks = user
    ? [
        { href: "/contribute", labelKey: "contributeEntry" },
        { href: "/my-submissions", labelKey: "mySubmissions" },
      ]
    : [];
  // Approving submissions is the archive owner's job; managing entries belongs
  // to editors and admins. Contributors never see this menu at all.
  const teamLinks = [
    ...(isAdmin
      ? [{ href: "/admin/review", labelKey: "reviewSubmissions" }]
      : []),
    ...(canManageEntries
      ? [{ href: "/admin/entries", labelKey: "manageEntries" }]
      : []),
    ...(isAdmin ? [{ href: "/admin/users", labelKey: "manageAccounts" }] : []),
  ];
  const roleLabel = role ? t(ROLE_LABEL_KEYS[role] ?? role) : "";
  const accountInitial = user?.email ? user.email.charAt(0).toUpperCase() : "?";
  const allLinks = [...PUBLIC_LINKS, ...memberLinks];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout failed:", error);
        return;
      }
      setMobileOpen(false);
      setAccountOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  };

  const desktopLinkClass = (active) =>
    `whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${
      active
        ? "bg-palm text-cream"
        : "text-ink-soft hover:bg-beige-soft hover:text-ink"
    }`;

  const mobileLinkClass = (active) =>
    `flex items-center whitespace-nowrap rounded-xl px-4 py-3 text-base font-medium transition-colors ${
      active ? "bg-palm text-cream" : "text-ink hover:bg-beige-soft"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 backdrop-blur shadow-[0_1px_0_0_rgba(107,68,35,0.15)]"
          : "bg-cream/80 backdrop-blur-sm"
      }`}
    >
      <nav
        aria-label={t("mainNavigation")}
        className="mx-auto flex h-16 w-full max-w-7xl items-center gap-2 px-5 sm:h-20 sm:gap-3 sm:px-8"
      >
        <Link
          href="/"
          className="group flex shrink-0 items-center"
          aria-label="Traditional Palm-Leaf House Covering Techniques — Home"
        >
          <Image
            src={images.logo}
            alt=""
            loading="eager"
            sizes="(max-width: 640px) 100px, 140px"
            className="h-9 w-auto transition-transform duration-300 group-hover:scale-105 sm:h-12"
          />
        </Link>

        <ul className="ml-3 hidden items-center gap-1 xl:flex">
          {allLinks.map((link, index) => (
            <li
              key={link.href}
              className={
                index === PUBLIC_LINKS.length && memberLinks.length > 0
                  ? "ml-2 border-l border-beige pl-2"
                  : undefined
              }
            >
              <Link
                href={link.href}
                aria-current={
                  isActivePath(pathname, link.href) ? "page" : undefined
                }
                className={desktopLinkClass(isActivePath(pathname, link.href))}
              >
                {t(link.labelKey)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />

          {user ? (
            <div ref={accountRef} className="relative hidden xl:block">
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                aria-label={t("accountMenu")}
                className="flex max-w-[13.5rem] items-center gap-2 rounded-full border border-beige bg-cream py-1.5 pl-1.5 pr-2.5 text-left transition-colors hover:bg-beige-soft"
              >
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-palm text-xs font-semibold text-cream"
                >
                  {accountInitial}
                </span>
                <span className="truncate text-xs font-medium text-ink">
                  {user.email}
                </span>
                <ChevronDown
                  size={14}
                  aria-hidden="true"
                  className={`shrink-0 text-ink-soft transition-transform duration-200 ${
                    accountOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {accountOpen && (
                <div
                  role="menu"
                  aria-label={t("myAccount")}
                  className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-beige bg-cream shadow-[0_18px_45px_rgba(74,46,23,0.18)]"
                >
                  <div className="border-b border-beige/70 px-4 py-3">
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-clay-deep">
                      {t("signedInAs")}
                    </p>
                    <p
                      className="mt-1 truncate text-sm font-medium text-ink"
                      title={user.email}
                    >
                      {user.email}
                    </p>
                    {roleLabel && (
                      <p className="mt-2 inline-flex rounded-full bg-beige-soft px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-clay-deep">
                        {roleLabel}
                      </p>
                    )}
                  </div>

                  {teamLinks.length > 0 && (
                    <div className="border-b border-beige/70 p-2">
                      <p className="px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-soft">
                        {t("adminArea")}
                      </p>
                      {teamLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          role="menuitem"
                          className={`flex items-center whitespace-nowrap rounded-xl px-3 py-2 text-sm transition-colors ${
                            isActivePath(pathname, link.href)
                              ? "bg-beige-soft font-medium text-palm-deep"
                              : "text-ink hover:bg-beige-soft"
                          }`}
                        >
                          {t(link.labelKey)}
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="p-2">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium text-clay-deep transition-colors hover:bg-clay/10"
                    >
                      <LogOut size={15} aria-hidden="true" />
                      {t("logOut")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 xl:flex">
              <Link
                href="/login"
                className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  pathname === "/login"
                    ? "bg-beige-soft text-palm-deep"
                    : "text-ink hover:bg-beige-soft hover:text-palm-deep"
                }`}
              >
                {t("logIn")}
              </Link>
              <Link
                href="/signup"
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  pathname === "/signup"
                    ? "bg-palm-deep text-cream"
                    : "bg-palm text-cream hover:bg-palm-deep"
                }`}
              >
                {t("signUp")}
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-beige text-ink transition-colors hover:bg-beige-soft xl:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        inert={!mobileOpen}
        className={`overflow-hidden bg-cream/95 backdrop-blur transition-[max-height,opacity] duration-300 ease-in-out xl:hidden ${
          mobileOpen
            ? "max-h-[70vh] overflow-y-auto opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-beige px-4 pb-6 pt-3 sm:px-6">
          <ul className="flex flex-col gap-1">
            {allLinks.map((link) => {
              const active = isActivePath(pathname, link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={mobileLinkClass(active)}
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>

          {teamLinks.length > 0 && (
            <div className="mt-5 border-t border-beige pt-4">
              <p className="px-4 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-clay-deep">
                {t("adminArea")}
              </p>
              <ul className="mt-2 flex flex-col gap-1">
                {teamLinks.map((link) => {
                  const active = isActivePath(pathname, link.href);

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={mobileLinkClass(active)}
                      >
                        {t(link.labelKey)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="mt-5 border-t border-beige pt-4">
            {user ? (
              <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-soft">
                    {t("signedInAs")}
                  </p>
                  <p
                    className="truncate text-sm font-medium text-ink"
                    title={user.email}
                  >
                    {user.email}
                  </p>
                  {roleLabel && (
                    <p className="mt-1 text-xs text-clay-deep">{roleLabel}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-palm px-4 py-2.5 text-sm font-semibold text-palm-deep transition-colors hover:bg-beige-soft"
                >
                  <LogOut size={15} aria-hidden="true" />
                  {t("logOut")}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-palm px-4 py-3 text-center text-sm font-semibold text-cream transition-colors hover:bg-palm-deep"
                >
                  {t("logIn")}
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full border border-palm px-4 py-3 text-center text-sm font-semibold text-palm-deep transition-colors hover:bg-beige-soft"
                >
                  {t("signUp")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

