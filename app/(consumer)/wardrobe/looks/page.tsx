"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { authHeaders } from "@/lib/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import ProductImage from "@/components/ProductImage";
import { itemImage, type Look } from "@/lib/wardrobe";
import { useBuyerOnly } from "@/lib/use-buyer-only";
import { showToast } from "@/lib/toast";

export default function LooksPage() {
  const router = useRouter();
  const allowed = useBuyerOnly();
  const [looks, setLooks] = useState<Look[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    apiFetch<Look[]>("/wardrobe/looks", { headers: authHeaders() })
      .then(setLooks)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!allowed) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed]);

  const createLook = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const look = await apiFetch<Look>("/wardrobe/looks", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ title: title.trim() }),
      });
      showToast("Look created", "success");
      router.push(`/wardrobe/looks/${look.id}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not create look", "error");
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await apiFetch(`/wardrobe/looks/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      setLooks((prev) => prev.filter((look) => look.id !== id));
      showToast("Look deleted", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not delete look", "error");
    }
  };

  if (!allowed || loading) return <LoadingSpinner label="Loading looks..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="page-shell">
      <Link href="/wardrobe" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        ← Wardrobe
      </Link>
      <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">My looks</h1>
      <p className="mt-1.5 text-sm text-neutral-500">
        Build outfits from your wardrobe. Publish one and it shows up in{" "}
        <Link href="/looks" className="underline">
          Looks
        </Link>
        .
      </p>

      <form onSubmit={createLook} className="mt-8 flex max-w-md gap-3">
        <input
          required
          minLength={2}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Look name"
          className="ui-input flex-1"
        />
        <button
          type="submit"
          disabled={saving}
          className="ui-btn uppercase tracking-wider"
        >
          {saving ? "Creating..." : "New look"}
        </button>
      </form>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {looks.map((look) => {
          const cover = look.items[0] ? itemImage(look.items[0].wardrobeItem) : undefined;
          return (
            <article key={look.id} className="ui-card">
              <Link href={`/wardrobe/looks/${look.id}`} className="block">
                <div className="relative aspect-[4/5] bg-neutral-100">
                  {cover ? (
                    <ProductImage src={cover} alt={look.title} productId={look.id} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-neutral-400">
                      Empty look
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-semibold">{look.title}</h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      {look.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">{look.items.length} pieces</p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => remove(look.id)}
                className="px-4 pb-4 text-xs uppercase tracking-wider text-neutral-400 hover:text-black"
              >
                Delete
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
