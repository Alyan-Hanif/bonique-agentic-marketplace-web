"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { authHeaders } from "@/lib/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import type { Cart, CheckoutResult } from "@/lib/commerce";
import { useBuyerOnly } from "@/lib/use-buyer-only";
import { showToast } from "@/lib/toast";

export default function CheckoutPage() {
  const router = useRouter();
  const allowed = useBuyerOnly();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [shippingName, setShippingName] = useState("");
  const [shippingLine1, setShippingLine1] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingCountry, setShippingCountry] = useState("GB");
  const [shippingPostal, setShippingPostal] = useState("");

  useEffect(() => {
    if (!allowed) return;
    apiFetch<Cart>("/cart", { headers: authHeaders() })
      .then((data) => {
        setCart(data);
        if (data.lines.length === 0) router.replace("/cart");
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [allowed, router]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await apiFetch<CheckoutResult>("/checkout", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          shippingName,
          shippingLine1,
          shippingCity,
          shippingCountry,
          shippingPostal: shippingPostal || undefined,
        }),
      });
      showToast("Order placed", "success");
      router.push(`/orders/${result.order.id}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Checkout failed", "error");
      setSubmitting(false);
    }
  };

  if (!allowed || loading) return <LoadingSpinner label="Loading checkout..." />;
  if (!cart) return error ? <ErrorMessage message={error} /> : null;

  const field =
    "mt-1 w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:border-neutral-400 focus:outline-none";

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <form onSubmit={submit} className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
        <p className="text-sm text-neutral-500">
          Payment is a stub for now — no card is charged.
        </p>
        <div>
          <label className="text-sm font-medium">Full name</label>
          <input required value={shippingName} onChange={(e) => setShippingName(e.target.value)} className={field} />
        </div>
        <div>
          <label className="text-sm font-medium">Address</label>
          <input required value={shippingLine1} onChange={(e) => setShippingLine1(e.target.value)} className={field} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">City</label>
            <input required value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} className={field} />
          </div>
          <div>
            <label className="text-sm font-medium">Postal code</label>
            <input value={shippingPostal} onChange={(e) => setShippingPostal(e.target.value)} className={field} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Country</label>
          <input required value={shippingCountry} onChange={(e) => setShippingCountry(e.target.value)} className={field} />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-black py-3 text-sm font-medium uppercase tracking-wider text-white disabled:opacity-70"
        >
          {submitting ? "Placing order..." : "Place order"}
        </button>
        <Link href="/cart" className="block text-center text-sm underline">
          Back to cart
        </Link>
      </form>

      <aside>
        <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {cart.lines.map((line) => (
            <li key={line.id} className="flex justify-between gap-4">
              <span>
                {line.title} × {line.quantity}
              </span>
              <span>${line.lineTotal.toFixed(0)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-lg font-semibold">Total ${cart.nativeSubtotal.toFixed(0)}</p>
      </aside>
    </div>
  );
}
