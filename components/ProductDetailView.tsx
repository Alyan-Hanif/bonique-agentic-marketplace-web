"use client";

import { useState } from "react";
import ProductImage from "@/components/ProductImage";
import TryOnModal from "@/components/TryOnModal";
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
  const [tryOnOpen, setTryOnOpen] = useState(false);

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
      <TryOnModal
        open={tryOnOpen}
        onClose={() => setTryOnOpen(false)}
        productTitle={product.title}
      />

      {showToast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-neutral-900 px-6 py-3 text-sm text-white shadow-lg">
          Would redirect to merchant site
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
          <ProductImage
            src={product.images[0]}
            alt={product.title}
            productId={product.id}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              {product.brand}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
              {product.title}
            </h1>
            <p className="mt-3 text-2xl font-bold text-neutral-900">
              ${product.price.toFixed(0)}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600">
              {product.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.styleCategories.map((cat) => (
              <span
                key={cat}
                className="bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-600"
              >
                {cat}
              </span>
            ))}
          </div>

          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
              Color — {selectedColor}
            </h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`border px-4 py-2 text-sm font-medium transition-colors ${
                    selectedColor === color
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 text-neutral-700 hover:border-neutral-900"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
              Size
            </h3>
            <div className="flex flex-wrap gap-2">
              {sizesForColor.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleSizeChange(variant.sizeLabel)}
                  disabled={variant.stockStatus === "out_of_stock"}
                  className={`min-w-[3rem] border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                    selectedVariant.id === variant.id
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 text-neutral-700 hover:border-neutral-900"
                  }`}
                >
                  {variant.sizeLabel}
                </button>
              ))}
            </div>
            <span
              className={`mt-2 inline-block px-2.5 py-1 text-xs font-semibold ${stockColor[selectedVariant.stockStatus]}`}
            >
              {stockLabel[selectedVariant.stockStatus]}
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleBuyNow}
              disabled={selectedVariant.stockStatus === "out_of_stock"}
              className="flex-1 bg-accent py-4 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              Buy Now
            </button>
            <button
              onClick={() => setTryOnOpen(true)}
              className="flex-1 border-2 border-neutral-900 bg-white py-4 text-sm font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-neutral-50"
            >
              Try It On
            </button>
          </div>

          <div className="space-y-4 border-t border-neutral-200 pt-6 text-sm text-neutral-600">
            <div>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-neutral-900">Fabric</h3>
              <p>{product.fabricComposition}</p>
            </div>
            <div>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-neutral-900">Care</h3>
              <p>{product.careInstructions}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-400">
              Size &amp; Measurements
            </h3>
            <div className="overflow-x-auto border border-neutral-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-neutral-500">Size</th>
                    <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-neutral-500">Color</th>
                    {product.variants.some((v) => v.chestCm) && (
                      <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-neutral-500">Chest</th>
                    )}
                    {product.variants.some((v) => v.waistCm) && (
                      <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-neutral-500">Waist</th>
                    )}
                    {product.variants.some((v) => v.lengthCm) && (
                      <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-wider text-neutral-500">Length</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((variant) => (
                    <tr key={variant.id} className="border-b border-neutral-100 last:border-0">
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
