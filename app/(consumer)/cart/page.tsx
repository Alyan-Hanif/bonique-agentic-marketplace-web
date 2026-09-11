"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { authHeaders } from "@/lib/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import ProductImage from "@/components/ProductImage";
import type { Cart, CartLine } from "@/lib/commerce";
import { notifyCartUpdated } from "@/lib/cart-events";
import { useBuyerOnly } from "@/lib/use-buyer-only";
import { showToast } from "@/lib/toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function CartPage() {
  const allowed = useBuyerOnly();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearing, setClearing] = useState(false);

  const load = () =>
    apiFetch<Cart>("/cart", { headers: authHeaders() })
      .then(setCart)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    if (!allowed) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed]);

  const setQty = async (line: CartLine, quantity: number) => {
    try {
      const updated = await apiFetch<Cart>(`/cart/items/${line.id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ quantity }),
      });
      setCart(updated);
      notifyCartUpdated(updated.itemCount);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not update cart", "error");
    }
  };

  const clearAll = async () => {
    setClearing(true);
    try {
      const updated = await apiFetch<Cart>("/cart", {
        method: "DELETE",
        headers: authHeaders(),
      });
      setCart(updated);
      notifyCartUpdated(updated.itemCount);
      setConfirmClear(false);
      showToast("Cart cleared", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not clear cart", "error");
    } finally {
      setClearing(false);
    }
  };

  const remove = async (line: CartLine) => {
    try {
      const updated = await apiFetch<Cart>(`/cart/items/${line.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      setCart(updated);
      notifyCartUpdated(updated.itemCount);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not remove item", "error");
    }
  };

  if (!allowed || loading) return <LoadingSpinner label="Loading cart..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!cart) return null;

  return (
    <div className="page-shell-narrow">
      <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Cart</h1>
      <p className="mt-1.5 text-sm text-neutral-500">
        Checkout on Bonique. Payment is a stub for now (no card).
      </p>

      {cart.lines.length === 0 ? (
        <p className="mt-12 text-sm text-neutral-500">
          Cart is empty. <Link href="/discover" className="underline">Keep shopping</Link>
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          <section>
            <ul className="divide-y overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              {cart.lines.map((line) => (
                <CartRow key={line.id} line={line} onQty={setQty} onRemove={remove} />
              ))}
            </ul>
            <p className="mt-4 text-right text-lg font-semibold">
              Subtotal ${cart.nativeSubtotal.toFixed(0)}
            </p>
          </section>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium uppercase tracking-wider text-neutral-700 hover:border-black"
            >
              Clear all
            </button>
            <Link
              href="/checkout"
              className="rounded-full bg-black px-8 py-3 text-sm font-medium uppercase tracking-wider text-white"
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
      {confirmClear && (
        <ConfirmModal
          title="Clear cart?"
          description="This removes every item from your cart."
          confirmLabel={clearing ? "Clearing..." : "Clear all"}
          onCancel={() => {
            if (!clearing) setConfirmClear(false);
          }}
          onConfirm={() => {
            if (!clearing) void clearAll();
          }}
        />
      )}
    </div>
  );
}

function CartRow({
  line,
  onQty,
  onRemove,
}: {
  line: CartLine;
  onQty: (line: CartLine, qty: number) => void;
  onRemove: (line: CartLine) => void;
}) {
  return (
    <li className="flex gap-4 px-4 py-4">
      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        {line.imageUrl && (
          <ProductImage src={line.imageUrl} alt={line.title} productId={line.productId} fill className="object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{line.title}</p>
        <p className="text-xs text-neutral-500">
          {[line.brand, line.color, line.sizeLabel].filter(Boolean).join(" · ")}
        </p>
        <p className="mt-1 text-sm">${line.unitPrice.toFixed(0)}</p>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="number"
            min={1}
            value={line.quantity}
            onChange={(e) => onQty(line, Math.max(1, Number(e.target.value) || 1))}
            className="w-16 rounded border border-neutral-200 px-2 py-1 text-sm"
          />
          <button type="button" onClick={() => onRemove(line)} className="text-xs uppercase tracking-wider text-neutral-400 hover:text-black">
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
