"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { label: "New Arrivals", href: "/discover?category=new-arrivals" },
  { label: "Men", href: "/discover?category=men" },
  { label: "Women", href: "/discover?category=women" },
  { label: "Kids", href: "/discover?category=kids" },
  { label: "Sale", href: "/discover?category=sale" },
];

export default function ConsumerHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-black/95 backdrop-blur-md">
      <div className="bg-accent text-black">
        <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs font-semibold tracking-wide sm:text-sm">
          FREE SHIPPING ON ORDERS OVER $100 — NEW SEASON DROP NOW LIVE
        </p>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo height={40} />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-semibold uppercase tracking-widest text-neutral-300 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-semibold uppercase tracking-widest ${
                  pathname === link.href ? "text-accent" : "text-neutral-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/discover"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-semibold uppercase tracking-widest text-neutral-300"
            >
              Shop All
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
