"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import TryOnModal from "@/components/TryOnModal";
import type { Product, ProductVariant } from "@/lib/types";
import { apiFetch } from "@/lib/api";
import { authHeaders, getAccessToken, getAuthUser, isSeller } from "@/lib/auth";
import type { Cart } from "@/lib/commerce";
import { flyImageToCart, notifyCartUpdated, revealHeader } from "@/lib/cart-events";
import { showToast } from "@/lib/toast";

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants.find((v) => v.color === colors[0]) ?? product.variants[0]
  );
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [savingWardrobe, setSavingWardrobe] = useState(false);
  const [cartBusy, setCartBusy] = useState(false);
  const seller = isSeller(getAuthUser());

  const sizesForColor = product.variants.filter((v) => v.color === selectedColor);
  const tags = product.styleCategories.slice(0, 4);
  const extraTags = product.styleCategories.length - tags.length;

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

  const handleBuyNow = async () => {
    const ok = await addToCart(false);
    if (ok) router.push("/checkout");
  };

  const addToCart = async (animate = true) => {
    if (!getAccessToken()) {
      router.push("/login");
      return false;
    }
    if (isSeller(getAuthUser())) {
      showToast("Brand accounts stay in the merchant portal.", "info");
      return false;
    }
    setCartBusy(true);
    if (animate) revealHeader();
    try {
      const cart = await apiFetch<Cart>("/cart/items", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant.id,
          quantity: 1,
        }),
      });
      if (animate) {
        await flyImageToCart(imageWrapRef.current, product.images[0]);
      }
      notifyCartUpdated(cart.itemCount);
      showToast("Added to cart", "success");
      return true;
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not add to cart", "error");
      return false;
    } finally {
      setCartBusy(false);
    }
  };

  const handleSaveWardrobe = async () => {
    if (!getAccessToken()) {
      router.push("/login");
      return;
    }
    if (isSeller(getAuthUser())) {
      showToast("Brand accounts stay in the merchant portal.", "info");
      return;
    }
    setSavingWardrobe(true);
    try {
      await apiFetch("/wardrobe/save", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant?.id,
        }),
      });
      showToast("Saved to wardrobe", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not save", "error");
    } finally {
      setSavingWardrobe(false);
    }
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

  const outOfStock = selectedVariant.stockStatus === "out_of_stock";

  return (
    <div className="relative">
      <TryOnModal
        open={tryOnOpen}
        onClose={() => setTryOnOpen(false)}
        productTitle={product.title}
      />

      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div
          ref={imageWrapRef}
          className="relative aspect-[4/5] overflow-hidden bg-neutral-100 lg:sticky lg:top-[calc(var(--consumer-header-height,64px)+1.5rem)]"
        >
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

        <div className="flex flex-col">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
            {product.brand}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
            {product.title}
          </h1>
          <p className="mt-3 text-2xl font-semibold text-neutral-900">
            ${product.price.toFixed(0)}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">
            {product.description}
          </p>

          {tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((cat) => (
                <span
                  key={cat}
                  className="bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-600"
                >
                  {cat}
                </span>
              ))}
              {extraTags > 0 && (
                <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                  +{extraTags}
                </span>
              )}
            </div>
          )}

          <div className="mt-8">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-400">
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

          <div className="mt-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-400">
              Size
            </h3>
            <div className="flex flex-wrap gap-2">
              {sizesForColor.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleSizeChange(variant.sizeLabel)}
                  disabled={variant.stockStatus === "out_of_stock"}
                  className={`min-w-[3.25rem] border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
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
              className={`mt-3 inline-block px-2.5 py-1 text-xs font-semibold ${stockColor[selectedVariant.stockStatus]}`}
            >
              {stockLabel[selectedVariant.stockStatus]}
            </span>
          </div>

          {seller ? (
            <p className="mt-10 text-sm text-neutral-500">
              Brand accounts can preview listings here. Shopper tools (cart, wardrobe) stay on buyer accounts.
            </p>
          ) : (
          <div className="mt-10 flex flex-col gap-3">
            <button
              onClick={handleBuyNow}
              disabled={outOfStock || cartBusy}
              className="w-full bg-accent py-4 text-sm font-bold uppercase tracking-widest text-black transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cartBusy ? "Adding..." : "Buy now"}
            </button>
            <button
              type="button"
              onClick={() => addToCart(true)}
              disabled={outOfStock || cartBusy}
              className="w-full border border-neutral-900 bg-white py-4 text-sm font-bold uppercase tracking-widest text-neutral-900 transition-colors hover:bg-neutral-50 disabled:opacity-50"
            >
              {cartBusy ? "Adding..." : "Add to cart"}
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTryOnOpen(true)}
                className="border border-neutral-200 bg-white py-3.5 text-xs font-semibold uppercase tracking-widest text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
              >
                Try it on
              </button>
              <button
                type="button"
                onClick={handleSaveWardrobe}
                disabled={savingWardrobe}
                className="border border-neutral-200 bg-white py-3.5 text-xs font-semibold uppercase tracking-widest text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-70"
              >
                {savingWardrobe ? "Saving..." : "Save to wardrobe"}
              </button>
            </div>
          </div>
          )}

          <div className="mt-12 space-y-5 border-t border-neutral-200 pt-8 text-sm text-neutral-600">
            <div>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-neutral-900">
                Fabric
              </h3>
              <p>{product.fabricComposition}</p>
            </div>
            <div>
              <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-neutral-900">
                Care
              </h3>
              <p>{product.careInstructions}</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-400">
              Size &amp; measurements
            </h3>
            <div className="overflow-x-auto border border-neutral-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Size
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Color
                    </th>
                    {product.variants.some((v) => v.chestCm) && (
                      <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Chest
                      </th>
                    )}
                    {product.variants.some((v) => v.waistCm) && (
                      <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Waist
                      </th>
                    )}
                    {product.variants.some((v) => v.lengthCm) && (
                      <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Length
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((variant) => (
                    <tr key={variant.id} className="border-b border-neutral-100 last:border-0">
                      <td className="px-4 py-2.5">{variant.sizeLabel}</td>
                      <td className="px-4 py-2.5">{variant.color}</td>
                      {product.variants.some((v) => v.chestCm) && (
                        <td className="px-4 py-2.5">
                          {variant.chestCm ? `${variant.chestCm} cm` : "—"}
                        </td>
                      )}
                      {product.variants.some((v) => v.waistCm) && (
                        <td className="px-4 py-2.5">
                          {variant.waistCm ? `${variant.waistCm} cm` : "—"}
                        </td>
                      )}
                      {product.variants.some((v) => v.lengthCm) && (
                        <td className="px-4 py-2.5">
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
