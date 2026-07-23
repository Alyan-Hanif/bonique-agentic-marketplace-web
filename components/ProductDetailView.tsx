"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product, ProductVariant } from "@/lib/types";

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants.find((v) => v.color === colors[0]) ?? product.variants[0]
  );
  const [showToast, setShowToast] = useState(false);

  const sizesForColor = product.variants.filter((v) => v.color === selectedColor);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const variant = product.variants.find((v) => v.color === color);
    if (variant) setSelectedVariant(variant);
  };

  const handleSizeChange = (sizeLabel: string) => {
    const variant = product.variants.find(
      (v) => v.color === selectedColor && v.sizeLabel === sizeLabel
    );
    if (variant) setSelectedVariant(variant);
  };

  const handleBuyNow = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const stockLabel = {
    in_stock: "In Stock",
    low_stock: "Low Stock",
    out_of_stock: "Out of Stock",
  };

  const stockColor = {
    in_stock: "text-emerald-700 bg-emerald-50",
    low_stock: "text-amber-700 bg-amber-50",
    out_of_stock: "text-red-700 bg-red-50",
  };

  return (
    <div className="relative">
      {showToast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-900 px-6 py-3 text-sm text-white shadow-lg">
          Would redirect to merchant site
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-stone-100">
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-stone-500">
              {product.brand}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-stone-900 md:text-3xl">
              {product.title}
            </h1>
            <p className="mt-3 text-xl font-semibold text-stone-900">
              ${product.price.toFixed(0)} {product.currency}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.styleCategories.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-stone-100 px-3 py-1 text-xs capitalize text-stone-600"
              >
                {cat}
              </span>
            ))}
          </div>

          <div>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-500">
              Color
            </h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    selectedColor === color
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-stone-500">
              Size
            </h3>
            <div className="flex flex-wrap gap-2">
              {sizesForColor.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleSizeChange(variant.sizeLabel)}
                  disabled={variant.stockStatus === "out_of_stock"}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    selectedVariant.id === variant.id
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-200 text-stone-600 hover:border-stone-400"
                  }`}
                >
                  {variant.sizeLabel}
                </button>
              ))}
            </div>
            <span
              className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${stockColor[selectedVariant.stockStatus]}`}
            >
              {stockLabel[selectedVariant.stockStatus]}
            </span>
          </div>

          <button
            onClick={handleBuyNow}
            disabled={selectedVariant.stockStatus === "out_of_stock"}
            className="w-full rounded-full bg-stone-900 py-4 text-sm font-medium uppercase tracking-wider text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Buy Now
          </button>

          <div className="space-y-4 border-t border-stone-200 pt-6 text-sm text-stone-600">
            <div>
              <h3 className="mb-1 font-medium text-stone-900">Fabric</h3>
              <p>{product.fabricComposition}</p>
            </div>
            <div>
              <h3 className="mb-1 font-medium text-stone-900">Care</h3>
              <p>{product.careInstructions}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-stone-500">
              Size &amp; Measurements
            </h3>
            <div className="overflow-x-auto rounded-lg border border-stone-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50">
                    <th className="px-4 py-2 text-left font-medium text-stone-600">Size</th>
                    <th className="px-4 py-2 text-left font-medium text-stone-600">Color</th>
                    {product.variants.some((v) => v.chestCm) && (
                      <th className="px-4 py-2 text-left font-medium text-stone-600">Chest</th>
                    )}
                    {product.variants.some((v) => v.waistCm) && (
                      <th className="px-4 py-2 text-left font-medium text-stone-600">Waist</th>
                    )}
                    {product.variants.some((v) => v.lengthCm) && (
                      <th className="px-4 py-2 text-left font-medium text-stone-600">Length</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((variant) => (
                    <tr key={variant.id} className="border-b border-stone-100 last:border-0">
                      <td className="px-4 py-2">{variant.sizeLabel}</td>
                      <td className="px-4 py-2">{variant.color}</td>
                      {product.variants.some((v) => v.chestCm) && (
                        <td className="px-4 py-2">
                          {variant.chestCm ? `${variant.chestCm} cm` : "—"}
                        </td>
                      )}
                      {product.variants.some((v) => v.waistCm) && (
                        <td className="px-4 py-2">
                          {variant.waistCm ? `${variant.waistCm} cm` : "—"}
                        </td>
                      )}
                      {product.variants.some((v) => v.lengthCm) && (
                        <td className="px-4 py-2">
                          {variant.lengthCm ? `${variant.lengthCm} cm` : "—"}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
