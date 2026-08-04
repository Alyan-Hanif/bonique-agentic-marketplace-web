"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { apiFetch } from "@/lib/api";
import { mapApiProduct, type ApiProduct } from "@/lib/mappers";
import type { Product } from "@/lib/types";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotFound(false);

    apiFetch<ApiProduct>(`/products/${id}`)
      .then((data) => {
        if (!cancelled) setProduct(mapApiProduct(data));
      })
      .catch((err: Error & { statusCode?: number }) => {
        if (cancelled) return;
        if (err.statusCode === 404) {
          setNotFound(true);
        } else {
          setError(err.message || "Failed to load product");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/discover"
        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back to Shop
      </Link>

      {loading && <LoadingSpinner label="Loading product..." />}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => setReloadKey((k) => k + 1)}
        />
      )}
      {notFound && (
        <div className="border border-neutral-200 bg-neutral-50 p-12 text-center text-sm text-neutral-500">
          Product not found.
        </div>
      )}
      {product && <ProductDetailView product={product} />}
    </div>
  );
}
