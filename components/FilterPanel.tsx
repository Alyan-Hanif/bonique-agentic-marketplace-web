"use client";

import type { ProductFilters } from "@/lib/types";

interface FilterPanelProps {
  filters: ProductFilters;
  availableSizes: string[];
  availableColors: string[];
  priceRange: { min: number; max: number };
  onChange: (filters: ProductFilters) => void;
}

export default function FilterPanel({
  filters,
  availableSizes,
  availableColors,
  priceRange,
  onChange,
}: FilterPanelProps) {
  const toggleSize = (size: string) => {
    const sizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onChange({ ...filters, sizes });
  };

  const toggleColor = (color: string) => {
    const colors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onChange({ ...filters, colors });
  };

  const resetFilters = () => {
    onChange({
      search: filters.search,
      sizes: [],
      colors: [],
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });
  };

  const hasActiveFilters =
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.minPrice > priceRange.min ||
    filters.maxPrice < priceRange.max;

  return (
    <aside className="space-y-6 border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-900">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-neutral-500 underline hover:text-neutral-900"
          >
            Clear all
          </button>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          Size
        </h3>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`border px-3 py-1 text-xs font-medium transition-colors ${
                filters.sizes.includes(size)
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 text-neutral-600 hover:border-neutral-900"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          Price Range
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-medium text-neutral-600">
            <span>${filters.minPrice}</span>
            <span>${filters.maxPrice}</span>
          </div>
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={filters.minPrice}
            onChange={(e) =>
              onChange({
                ...filters,
                minPrice: Math.min(Number(e.target.value), filters.maxPrice - 1),
              })
            }
            className="w-full accent-neutral-900"
          />
          <input
            type="range"
            min={priceRange.min}
            max={priceRange.max}
            value={filters.maxPrice}
            onChange={(e) =>
              onChange({
                ...filters,
                maxPrice: Math.max(Number(e.target.value), filters.minPrice + 1),
              })
            }
            className="w-full accent-neutral-900"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          Color
        </h3>
        <div className="flex flex-wrap gap-2">
          {availableColors.map((color) => (
            <button
              key={color}
              onClick={() => toggleColor(color)}
              className={`border px-3 py-1 text-xs font-medium transition-colors ${
                filters.colors.includes(color)
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 text-neutral-600 hover:border-neutral-900"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
