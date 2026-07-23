"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import {
  allProducts,
  getAllColors,
  getAllSizes,
  getPriceRange,
} from "@/lib/dummy-data";
import { filterProducts } from "@/lib/filter-products";
import type { ProductFilters } from "@/lib/types";

const priceRange = getPriceRange();

export default function DiscoverPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    sizes: [],
    colors: [],
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
  });

  const filteredProducts = useMemo(
    () => filterProducts(allProducts, filters),
    [filters]
  );

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900 md:text-3xl">
          Discover
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Curated pieces from independent fashion merchants
        </p>
      </div>

      <SearchBar value={filters.search} onChange={handleSearchChange} />

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <FilterPanel
          filters={filters}
          availableSizes={getAllSizes()}
          availableColors={getAllColors()}
          priceRange={priceRange}
          onChange={setFilters}
        />

        <div>
          <p className="mb-4 text-sm text-stone-500">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          </p>

          {filteredProducts.length === 0 ? (
            <div className="rounded-lg border border-stone-200 bg-white p-12 text-center text-sm text-stone-500">
              No products match your filters. Try adjusting your search or filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
