"use client";

import { useEffect, useMemo, useState } from "react";
import type { MerchantProduct } from "@/lib/types";

interface DashboardTableProps {
  products: MerchantProduct[];
}

const PAGE_SIZE = 10;

function getAggregateStockStatus(
  product: MerchantProduct
): "in_stock" | "low_stock" | "out_of_stock" {
  const statuses = product.variants.map((v) => v.stockStatus);
  if (statuses.every((s) => s === "out_of_stock")) return "out_of_stock";
  if (statuses.some((s) => s === "out_of_stock" || s === "low_stock")) return "low_stock";
  return "in_stock";
}

const stockBadge = {
  in_stock: { label: "In Stock", className: "bg-emerald-50 text-emerald-700" },
  low_stock: { label: "Low Stock", className: "bg-amber-50 text-amber-700" },
  out_of_stock: { label: "Out of Stock", className: "bg-red-50 text-red-700" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DashboardTable({ products }: DashboardTableProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return products;
    return products.filter((product) => {
      const haystack = [
        product.title,
        product.brand,
        product.source,
        product.department,
        ...product.styleCategories,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [products, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-12 text-center text-sm text-stone-500">
        No products found. Connect a store to start syncing.
      </div>
    );
  }

  const from = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, filtered.length);

  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <div className="border-b border-stone-200 px-6 py-3">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <input
          id="product-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, brand, or tag"
          className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
        />
      </div>
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-sm text-stone-500">
          No products match “{query.trim()}”.
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              <th className="px-6 py-3 text-left font-medium text-stone-600">Product</th>
              <th className="px-6 py-3 text-left font-medium text-stone-600">Price</th>
              <th className="px-6 py-3 text-left font-medium text-stone-600">Variants</th>
              <th className="px-6 py-3 text-left font-medium text-stone-600">Stock</th>
              <th className="px-6 py-3 text-left font-medium text-stone-600">Last Synced</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((product) => {
              const stock = getAggregateStockStatus(product);
              const badge = stockBadge[stock];
              return (
                <tr
                  key={product.id}
                  className="border-b border-stone-100 last:border-0 hover:bg-stone-50"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-stone-900">{product.title}</p>
                    <p className="text-xs text-stone-500">
                      {product.brand}
                      {product.source === "shopify" ? " · Shopify" : ""}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-stone-700">
                    ${product.price.toFixed(0)}
                  </td>
                  <td className="px-6 py-4 text-stone-700">
                    {product.variants.length}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-stone-500">
                    {formatDate(product.lastSyncedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}
      <div className="flex flex-col gap-3 border-t border-stone-200 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-stone-500">
          {filtered.length === 0
            ? "No matching products"
            : `Showing ${from}–${to} of ${filtered.length}`}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || filtered.length === 0}
            className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 hover:border-stone-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-stone-500">
            Page {filtered.length === 0 ? 0 : page} of {filtered.length === 0 ? 0 : pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={page >= pageCount || filtered.length === 0}
            className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-700 hover:border-stone-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
