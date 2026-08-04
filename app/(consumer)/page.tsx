"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { heroImage, editorialImage } from "@/lib/product-images";
import { apiFetch } from "@/lib/api";
import {
  getTrendingProducts,
  mapApiProduct,
  type ApiProduct,
} from "@/lib/mappers";
import type { Product } from "@/lib/types";

const CATEGORIES = [
  { label: "New Arrivals", href: "/discover?category=new-arrivals" },
  { label: "Men", href: "/discover?category=men" },
  { label: "Women", href: "/discover?category=women" },
  { label: "Outerwear", href: "/discover?category=outerwear" },
  { label: "Footwear", href: "/discover?category=footwear" },
  { label: "Sale", href: "/discover?category=sale" },
];

export default function HomePage() {
  const [trending, setTrending] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    apiFetch<ApiProduct[]>("/products")
      .then((data) => {
        if (!cancelled) {
          setTrending(getTrendingProducts(data.map(mapApiProduct)));
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message || "Failed to load products");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return (
    <>
      <section
        id="hero"
        className="relative flex h-[calc(100dvh-var(--consumer-header-height,4rem))] min-h-[20rem] items-center overflow-hidden"
      >
        <Image
          src={heroImage}
          alt="New season streetwear collection"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/80 sm:text-sm">
            SS26 Collection
          </p>
          <h1 className="mt-3 max-w-xl text-4xl font-bold uppercase leading-none tracking-tight text-white sm:text-6xl md:text-7xl">
            Define Your
            <br />
            <span className="text-accent">Street Style</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
            Bold fits. Fresh drops. Curated streetwear and fashion from the
            brands you love.
          </p>
          <Link
            href="/discover"
            className="mt-8 inline-block bg-accent px-10 py-4 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-dark"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-4 sm:px-6">
          <div className="flex gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="flex-shrink-0 border border-black px-5 py-2 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-black hover:text-accent"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black py-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent sm:text-sm">
          Up to 40% off select styles —{" "}
          <Link
            href="/discover?category=sale"
            className="underline underline-offset-2"
          >
            Shop the Sale
          </Link>
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-neutral-900 sm:text-3xl">
              Trending Now
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              The pieces everyone&apos;s talking about
            </p>
          </div>
          <Link
            href="/discover"
            className="hidden text-sm font-semibold uppercase tracking-wider text-neutral-900 underline underline-offset-4 hover:text-accent sm:block"
          >
            View All
          </Link>
        </div>

        {loading && <LoadingSpinner label="Loading trending products..." />}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => setReloadKey((k) => k + 1)}
          />
        )}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {trending.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/discover"
                className="text-sm font-semibold uppercase tracking-wider text-neutral-900 underline underline-offset-4"
              >
                View All
              </Link>
            </div>
          </>
        )}
      </section>

      <section className="relative mx-4 mb-12 overflow-hidden sm:mx-6 lg:mx-auto lg:max-w-7xl">
        <div className="relative aspect-[21/9] min-h-[200px]">
          <Image
            src={editorialImage}
            alt="Urban street style editorial"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="text-center">
              <h3 className="text-2xl font-bold uppercase tracking-tight text-white sm:text-4xl">
                Street. Bold. You.
              </h3>
              <Link
                href="/discover?category=new-arrivals"
                className="mt-4 inline-block border-2 border-accent px-8 py-3 text-xs font-bold uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-black"
              >
                Explore New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
