"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { apiFetch } from "@/lib/api";
import {
  collectColors,
  collectPriceRange,
  collectSizes,
  filterByCategory,
  mapApiProduct,
  type ApiProduct,
} from "@/lib/mappers";
import { filterProducts } from "@/lib/filter-products";
import type { Product, ProductFilters } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  "new-arrivals": "New Arrivals",
  men: "Men",
  women: "Women",
  kids: "Kids",
  outerwear: "Outerwear",
  footwear: "Footwear",
  sale: "Sale",
};

function DiscoverContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const priceRange = useMemo(() => collectPriceRange(products), [products]);

  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    sizes: [],
    colors: [],
    minPrice: 0,
    maxPrice: 500,
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    apiFetch<ApiProduct[]>("/products")
      .then((data) => {
        if (cancelled) return;
        const mapped = data.map(mapApiProduct);
        setProducts(mapped);
        const range = collectPriceRange(mapped);
        setFilters((prev) => ({
          ...prev,
          minPrice: range.min,
          maxPrice: range.max,
        }));
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

  const baseProducts = useMemo(
    () => (category ? filterByCategory(products, category) : products),
    [category, products]
  );

  const filteredProducts = useMemo(
    () => filterProducts(baseProducts, filters),
    [baseProducts, filters]
  );

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const pageTitle = category ? CATEGORY_LABELS[category] ?? "Shop" : "Shop All";

  if (loading) {
    return <LoadingSpinner label="Loading products..." />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <ErrorMessage
          message={error}
          onRetry={() => setReloadKey((k) => k + 1)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-tight text-neutral-900 sm:text-3xl">
          {pageTitle}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      <SearchBar value={filters.search} onChange={handleSearchChange} />

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <FilterPanel
          filters={filters}
          availableSizes={collectSizes(products)}
          availableColors={collectColors(products)}
          priceRange={priceRange}
          onChange={setFilters}
        />

        <div>
          {filteredProducts.length === 0 ? (
            <div className="border border-neutral-200 bg-neutral-50 p-12 text-center text-sm text-neutral-500">
              No products match your filters. Try adjusting your search or
              filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={<LoadingSpinner label="Loading..." />}
    >
      <DiscoverContent />
    </Suspense>
  );
}
