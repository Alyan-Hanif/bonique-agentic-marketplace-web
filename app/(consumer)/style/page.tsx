"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { allProducts } from "@/lib/dummy-data";
import { matchProductsByPrompt } from "@/lib/dummy-recommend";
import type { Product } from "@/lib/types";

function StyleResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") ?? "";

  const [prompt, setPrompt] = useState(queryParam);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    setPrompt(queryParam);
    if (!queryParam.trim()) {
      setResults([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setHasSearched(false);

    const timer = setTimeout(() => {
      const matched = matchProductsByPrompt(queryParam, allProducts);
      setResults(matched);
      setLoading(false);
      setHasSearched(true);
    }, 800);

    return () => clearTimeout(timer);
  }, [queryParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    router.push(`/style?q=${encodeURIComponent(prompt.trim())}`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-neutral-500 transition-colors hover:text-neutral-900"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Home
        </Link>
        <h1 className="mt-4 text-2xl font-bold uppercase tracking-tight text-neutral-900 sm:text-3xl">
          Find Your Style
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Describe what you&apos;re looking for and we&apos;ll match pieces from our catalog
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='e.g. "I want a cozy winter outfit for a casual weekend" or "something like 90s grunge but affordable"'
          rows={3}
          className="w-full resize-none border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-accent focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={!prompt.trim() || loading}
          className="bg-accent px-8 py-3 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Get Recommendations"}
        </button>
      </form>

      {loading && (
        <div className="flex items-center justify-center gap-3 py-16 text-sm text-neutral-500">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Thinking...
        </div>
      )}

      {hasSearched && !loading && (
        <div>
          <h2 className="mb-2 text-lg font-bold uppercase tracking-tight text-neutral-900">
            Here&apos;s what we found for you
          </h2>
          {queryParam && (
            <p className="mb-6 text-sm text-neutral-500">
              Results for: &ldquo;{queryParam}&rdquo;
            </p>
          )}
          {results.length === 0 ? (
            <div className="border border-neutral-200 bg-neutral-50 p-12 text-center text-sm text-neutral-500">
              No matches found. Try describing your style differently.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function StylePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-neutral-500">Loading...</div>}>
      <StyleResultsContent />
    </Suspense>
  );
}
