"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { authHeaders } from "@/lib/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import ProductImage from "@/components/ProductImage";
import ConfirmModal from "@/components/ConfirmModal";
import {
  itemImage,
  LOOK_SLOTS,
  type Look,
  type WardrobeItem,
} from "@/lib/wardrobe";
import type { Cart } from "@/lib/commerce";
import { notifyCartUpdated } from "@/lib/cart-events";
import { useBuyerOnly } from "@/lib/use-buyer-only";
import { showToast } from "@/lib/toast";

function slotsFromLook(look: Look) {
  const map: Record<string, WardrobeItem | null> = {};
  for (const slot of LOOK_SLOTS) {
    map[slot] = look.items.find((item) => item.slot === slot)?.wardrobeItem ?? null;
  }
  return map;
}

function idsFromSlots(slots: Record<string, WardrobeItem | null>) {
  return LOOK_SLOTS.map((slot) => slots[slot]?.id ?? "").join("|");
}

export default function LookEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const allowed = useBuyerOnly();
  const lookId = params?.id;
  const [look, setLook] = useState<Look | null>(null);
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [picking, setPicking] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shopping, setShopping] = useState(false);
  const [caption, setCaption] = useState("");
  const [savedCaption, setSavedCaption] = useState("");
  const [slots, setSlots] = useState<Record<string, WardrobeItem | null>>({});
  const [savedSlotKey, setSavedSlotKey] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [leaveHref, setLeaveHref] = useState<string | null>(null);

  const dirty = useMemo(() => {
    if (!look) return false;
    return caption !== savedCaption || idsFromSlots(slots) !== savedSlotKey;
  }, [look, caption, savedCaption, slots, savedSlotKey]);

  const applyLook = (lookData: Look) => {
    const nextSlots = slotsFromLook(lookData);
    setLook(lookData);
    setCaption(lookData.caption ?? "");
    setSavedCaption(lookData.caption ?? "");
    setSlots(nextSlots);
    setSavedSlotKey(idsFromSlots(nextSlots));
  };

  const load = async () => {
    if (!lookId) return;
    const [lookData, wardrobe] = await Promise.all([
      apiFetch<Look>(`/wardrobe/looks/${lookId}`, { headers: authHeaders() }),
      apiFetch<WardrobeItem[]>("/wardrobe", { headers: authHeaders() }),
    ]);
    applyLook(lookData);
    setItems(wardrobe);
  };

  useEffect(() => {
    if (!allowed) return;
    load()
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookId, allowed]);

  useEffect(() => {
    if (!dirty) return;
    const onUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [dirty]);

  useEffect(() => {
    if (!dirty) return;
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:")) return;
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      if (`${url.pathname}${url.search}` === `${window.location.pathname}${window.location.search}`) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      setLeaveHref(`${url.pathname}${url.search}${url.hash}`);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [dirty]);

  const saveChanges = async () => {
    if (!lookId || !look) return false;
    setSaving(true);
    try {
      let updated = look;
      if (caption !== savedCaption) {
        updated = await apiFetch<Look>(`/wardrobe/looks/${lookId}`, {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify({ caption }),
        });
      }
      const savedIds = savedSlotKey.split("|");
      for (let i = 0; i < LOOK_SLOTS.length; i += 1) {
        const slot = LOOK_SLOTS[i];
        const nextId = slots[slot]?.id ?? "";
        const prevId = savedIds[i] ?? "";
        if (nextId === prevId) continue;
        if (!nextId) {
          updated = await apiFetch<Look>(`/wardrobe/looks/${lookId}/slots/${slot}`, {
            method: "DELETE",
            headers: authHeaders(),
          });
        } else {
          updated = await apiFetch<Look>(
            `/wardrobe/looks/${lookId}/slots/${slot}`,
            {
              method: "PUT",
              headers: authHeaders(),
              body: JSON.stringify({ wardrobeItemId: nextId }),
            },
          );
        }
      }
      applyLook(updated);
      showToast("Look saved", "success");
      return true;
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not save look", "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async () => {
    if (!lookId || !look) return;
    if (dirty) {
      const saved = await saveChanges();
      if (!saved) return;
    }
    setPublishing(true);
    try {
      const latest = await apiFetch<Look>(`/wardrobe/looks/${lookId}`, { headers: authHeaders() });
      const updated = await apiFetch<Look>(`/wardrobe/looks/${lookId}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ isPublic: !latest.isPublic, caption }),
      });
      applyLook(updated);
      showToast(updated.isPublic ? "Look published" : "Look unpublished", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not update look", "error");
    } finally {
      setPublishing(false);
    }
  };

  const shopLook = async () => {
    if (!lookId) return;
    if (dirty) {
      const saved = await saveChanges();
      if (!saved) return;
    }
    setShopping(true);
    try {
      const result = await apiFetch<{
        added: number;
        skipped: string[];
      }>(`/cart/from-look/${lookId}`, {
        method: "POST",
        headers: authHeaders(),
      });
      const bits = [`${result.added} piece(s) added to cart`];
      if (result.skipped.length) {
        bits.push(`${result.skipped.length} custom item(s) skipped`);
      }
      showToast(bits.join(". "), result.added > 0 ? "success" : "info");
      if (result.added > 0) {
        const cart = await apiFetch<Cart>("/cart", { headers: authHeaders() });
        notifyCartUpdated(cart.itemCount);
        router.push("/cart");
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not shop look", "error");
    } finally {
      setShopping(false);
    }
  };

  const confirmLeaveSave = async () => {
    const href = leaveHref;
    const saved = await saveChanges();
    if (saved && href) router.push(href);
    setLeaveHref(null);
  };

  if (!allowed || loading) return <LoadingSpinner label="Loading look..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!look) return null;

  const filledCount = LOOK_SLOTS.filter((slot) => slots[slot]).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Link
        href="/wardrobe/looks"
        onClick={(event) => {
          if (!dirty) return;
          event.preventDefault();
          setLeaveHref("/wardrobe/looks");
        }}
        className="text-xs font-semibold uppercase tracking-wider text-neutral-500"
      >
        ← Looks
      </Link>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{look.title}</h1>
      <p className="mt-1 text-sm text-neutral-500">
        {look.isPublic
          ? "This look is public on the feed."
          : "Private until you publish. Tap a slot, then pick from your wardrobe."}
        {dirty ? " Unsaved changes." : ""}
      </p>
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        maxLength={280}
        placeholder="Caption (optional)"
        className="mt-4 w-full max-w-xl border border-neutral-200 px-3 py-2 text-sm"
      />
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void saveChanges()}
          disabled={!dirty || saving}
          className="bg-black px-5 py-2.5 text-sm font-medium uppercase tracking-wider text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        <button
          type="button"
          onClick={shopLook}
          disabled={shopping || filledCount === 0}
          className="border border-neutral-900 px-5 py-2.5 text-sm font-medium uppercase tracking-wider disabled:opacity-50"
        >
          {shopping ? "Adding..." : "Shop this look"}
        </button>
        <button
          type="button"
          onClick={() => void togglePublish()}
          disabled={publishing || (!look.isPublic && filledCount === 0)}
          className="border border-neutral-900 px-5 py-2.5 text-sm font-medium uppercase tracking-wider disabled:opacity-50"
        >
          {publishing ? "Saving..." : look.isPublic ? "Unpublish" : "Publish"}
        </button>
        {look.isPublic && (
          <Link
            href={`/looks/${look.id}`}
            className="px-5 py-2.5 text-sm font-medium uppercase tracking-wider text-neutral-500 underline"
          >
            View public page
          </Link>
        )}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {LOOK_SLOTS.map((slot) => {
          const filled = slots[slot];
          const src = filled ? itemImage(filled) : undefined;
          return (
            <div key={slot} className="border border-neutral-200 p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{slot}</p>
              <button
                type="button"
                onClick={() => setPicking(slot)}
                className="relative mt-2 block aspect-[4/5] w-full bg-neutral-100"
              >
                {filled && src ? (
                  <ProductImage src={src} alt={filled.title} productId={filled.id} fill className="object-cover" />
                ) : (
                  <span className="flex h-full items-center justify-center text-xs text-neutral-400">
                    {filled ? filled.title : `Add ${slot}`}
                  </span>
                )}
              </button>
              {filled && (
                <>
                  <p className="mt-2 truncate text-sm font-medium">{filled.title}</p>
                  <button
                    type="button"
                    onClick={() => setSlots((prev) => ({ ...prev, [slot]: null }))}
                    className="text-xs uppercase tracking-wider text-neutral-400 hover:text-black"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {picking && (
        <div className="mt-10 border-t border-neutral-200 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pick {picking}</h2>
            <button type="button" onClick={() => setPicking(null)} className="text-sm text-neutral-500">
              Cancel
            </button>
          </div>
          {items.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-500">
              Wardrobe is empty. <Link href="/wardrobe" className="underline">Add pieces first</Link>.
            </p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {items.map((item) => {
                const src = itemImage(item);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSlots((prev) => ({ ...prev, [picking]: item }));
                      setPicking(null);
                    }}
                    className="border border-neutral-200 text-left hover:border-black"
                  >
                    <div className="relative aspect-[4/5] bg-neutral-100">
                      {src ? (
                        <ProductImage src={src} alt={item.title} productId={item.id} fill className="object-cover" />
                      ) : null}
                    </div>
                    <p className="truncate p-2 text-sm">{item.title}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {leaveHref && (
        <ConfirmModal
          title="Save changes?"
          description="You updated this look. Save before leaving, or discard the changes."
          cancelLabel="Stay"
          extraLabel="Don't save"
          confirmLabel={saving ? "Saving..." : "Save"}
          onCancel={() => setLeaveHref(null)}
          onExtra={() => {
            const href = leaveHref;
            setLeaveHref(null);
            if (href) router.push(href);
          }}
          onConfirm={() => {
            if (!saving) void confirmLeaveSave();
          }}
        />
      )}
    </div>
  );
}
