"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import AccountMenu from "@/components/AccountMenu";
import CartLink from "@/components/CartLink";
import { REVEAL_HEADER_EVENT } from "@/lib/cart-events";
import { getAuthUser, isSeller } from "@/lib/auth";

const SHOP_LINKS = [
  { label: "New Arrivals", href: "/discover?category=new-arrivals" },
  { label: "Men", href: "/discover?category=men" },
  { label: "Women", href: "/discover?category=women" },
  { label: "Sale", href: "/discover?category=sale" },
];

const LOOKS_LINK = { label: "Looks", href: "/looks" };

function isNavActive(pathname: string, href: string, category: string | null) {
  const [path, query] = href.split("?");
  const params = new URLSearchParams(query || "");
  if (path === "/looks") return pathname === "/looks" || pathname.startsWith("/looks/");
  if (path === "/discover") {
    if (pathname !== "/discover") return false;
    const linkCategory = params.get("category");
    if (linkCategory) return category === linkCategory;
    return !category;
  }
  if (path === "/cart") return pathname === "/cart";
  return pathname === path;
}

function navLinkClass(active: boolean) {
  return `relative text-sm font-semibold uppercase tracking-widest transition-colors duration-300 hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-white after:transition-all after:duration-300 ${
    active ? "text-white after:w-full" : "text-neutral-400 after:w-0 hover:after:w-full"
  }`;
}

const SCROLL_THRESHOLD = 8;

export default function ConsumerHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const isHome = pathname === "/";
  const isLooks = pathname === "/looks" || pathname.startsWith("/looks/");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(64);
  const [seller, setSeller] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    setSeller(isSeller(getAuthUser()));
  }, []);

  useEffect(() => {
    const routes = [
      "/",
      "/discover",
      "/discover?category=new-arrivals",
      "/discover?category=men",
      "/discover?category=women",
      "/discover?category=sale",
      "/looks",
      "/cart",
    ];
    routes.forEach((href) => router.prefetch(href));
  }, [router]);

  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [mobileOpen]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--consumer-header-height",
      `${headerHeight}px`
    );
    return () => {
      document.documentElement.style.removeProperty("--consumer-header-height");
    };
  }, [headerHeight]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const isInHeroZone = () => {
      const hero = document.getElementById("hero");
      if (!hero || !headerRef.current) return false;
      return hero.getBoundingClientRect().bottom > headerRef.current.offsetHeight;
    };

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (isLooks) {
        setVisible(true);
        lastScrollY.current = currentY;
        return;
      }

      // Stay visible while the hero section is still on screen
      if (isHome && isInHeroZone()) {
        setVisible(true);
        lastScrollY.current = currentY;
        return;
      }

      if (currentY <= 0) {
        setVisible(true);
      } else if (delta > SCROLL_THRESHOLD) {
        setVisible(false);
        setMobileOpen(false);
      } else if (delta < -SCROLL_THRESHOLD) {
        setVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, isLooks]);

  useEffect(() => {
    const reveal = () => setVisible(true);
    window.addEventListener(REVEAL_HEADER_EVENT, reveal);
    return () => window.removeEventListener(REVEAL_HEADER_EVENT, reveal);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed left-0 right-0 top-0 z-40 border-b border-neutral-800 bg-black/95 backdrop-blur-md transition-transform duration-300 ease-in-out ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo height={40} />

          <nav className="hidden items-center gap-8 md:flex">
            {SHOP_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={navLinkClass(isNavActive(pathname, link.href, category))}
              >
                {link.label}
              </Link>
            ))}
            {!seller && (
              <>
                <span className="h-3 w-px bg-neutral-700" aria-hidden />
                <Link
                  href={LOOKS_LINK.href}
                  className={navLinkClass(isNavActive(pathname, LOOKS_LINK.href, category))}
                >
                  {LOOKS_LINK.label}
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <AccountMenu />
            </div>

            {!seller && <CartLink />}

            <Link
              href="/discover"
              className="text-neutral-300 transition-colors hover:text-accent"
              aria-label="Search"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-neutral-300 md:hidden"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-neutral-800 bg-black px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {SHOP_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={navLinkClass(isNavActive(pathname, link.href, category))}
                >
                  {link.label}
                </Link>
              ))}
              {!seller && (
                <Link
                  href={LOOKS_LINK.href}
                  onClick={() => setMobileOpen(false)}
                  className={navLinkClass(isNavActive(pathname, LOOKS_LINK.href, category))}
                >
                  {LOOKS_LINK.label}
                </Link>
              )}
              <Link
                href="/discover"
                onClick={() => setMobileOpen(false)}
                className={navLinkClass(isNavActive(pathname, "/discover", category))}
              >
                Shop All
              </Link>
              {!seller && (
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className={navLinkClass(isNavActive(pathname, "/cart", category))}
                >
                  Cart
                </Link>
              )}
              {seller && (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold uppercase tracking-widest text-neutral-300"
                >
                  Dashboard
                </Link>
              )}
              <div className="border-t border-neutral-800 pt-3">
                <AccountMenu />
              </div>
            </div>
          </nav>
        )}
      </header>

      <div aria-hidden style={{ height: headerHeight }} />
    </>
  );
}
