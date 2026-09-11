"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { authHeaders } from "@/lib/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import ProductImage from "@/components/ProductImage";
import { itemImage, type WardrobeItem } from "@/lib/wardrobe";
import { useBuyerOnly } from "@/lib/use-buyer-only";
import { showToast } from "@/lib/toast";
import PageHeader from "@/components/PageHeader";

const CATEGORIES = ["top", "bottom", "shoes", "outerwear", "accessory"] as const;

export default function WardrobePage() {
  const allowed = useBuyerOnly();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("top");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const load = () => {
    apiFetch<WardrobeItem[]>("/wardrobe", { headers: authHeaders() })
      .then(setItems)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!allowed) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed]);

  const addItem = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await apiFetch<WardrobeItem>("/wardrobe", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          title: title.trim(),
          category,
          brand: brand.trim() || undefined,
          color: color.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
        }),
      });
      setItems((prev) => [created, ...prev]);
      setTitle("");
      setBrand("");
      setColor("");
      setImageUrl("");
      showToast("Added to wardrobe", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not add item", "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await apiFetch(`/wardrobe/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      setItems((prev) => prev.filter((item) => item.id !== id));
      showToast("Removed from wardrobe", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not remove item", "error");
    }
  };

  if (!allowed || loading) return <LoadingSpinner label="Loading wardrobe..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => { setLoading(true); setError(null); load(); }} />;

  return (
    <div className="page-shell">
      <PageHeader
        kicker="Private"
        title="Wardrobe"
        description="Saved catalog pieces and items you add yourself."
        actions={
          <Link href="/wardrobe/looks" className="ui-btn uppercase tracking-wider">
            My looks
          </Link>
        }
      />

      <form
        onSubmit={addItem}
        className="mt-8 grid gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4 sm:grid-cols-2 lg:grid-cols-6"
      >
        <input
          required
          minLength={2}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Item name"
          className="ui-input lg:col-span-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="ui-input"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Brand"
          className="ui-input"
        />
        <input
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="Color"
          className="ui-input"
        />
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL"
          className="ui-input lg:col-span-2"
        />
        <button
          type="submit"
          disabled={saving}
          className="ui-btn uppercase tracking-wider disabled:opacity-70"
        >
          {saving ? "Adding..." : "Add item"}
        </button>
      </form>

      {items.length === 0 ? (
        <p className="mt-12 text-center text-sm text-neutral-500">
          Nothing here yet. Open a product and click Save to wardrobe, or add an item above.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const src = itemImage(item);
            return (
              <article key={item.id} className="ui-card">
                <div className="relative aspect-[4/5] bg-neutral-100">
                  {src ? (
                    <ProductImage src={src} alt={item.title} productId={item.id} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-neutral-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="space-y-1 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    {item.category} · {item.source}
                  </p>
                  <h2 className="text-sm font-semibold">{item.title}</h2>
                  <p className="text-xs text-neutral-500">
                    {[item.brand, item.color, item.sizeLabel].filter(Boolean).join(" · ") || " "}
                  </p>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="pt-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-black"
                  >
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
