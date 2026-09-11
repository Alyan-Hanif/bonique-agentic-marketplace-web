"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { authHeaders } from "@/lib/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import type { Order } from "@/lib/commerce";
import { useBuyerOnly } from "@/lib/use-buyer-only";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const allowed = useBuyerOnly();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!allowed || !params?.id) return;
    apiFetch<Order>(`/orders/${params.id}`, { headers: authHeaders() })
      .then(setOrder)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [allowed, params?.id]);

  if (!allowed || loading) return <LoadingSpinner label="Loading order..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!order) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/orders" className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        ← Orders
      </Link>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Order placed</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Payment is a stub — no card was charged.
      </p>
      <p className="mt-2 text-xs uppercase tracking-widest text-neutral-400">
        {order.status} · {new Date(order.createdAt).toLocaleString()}
      </p>

      <section className="mt-8">
        <h2 className="text-xs font-bold uppercase tracking-widest">Items</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {order.lines.map((line) => (
            <li key={line.id} className="flex justify-between">
              <span>
                {line.title} × {line.quantity}
              </span>
              <span>${line.lineTotal.toFixed(0)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 font-semibold">Total ${order.nativeSubtotal.toFixed(0)}</p>
      </section>

      <p className="mt-8 text-sm text-neutral-500">
        Ship to {order.shipping.name}, {order.shipping.line1}, {order.shipping.city}
      </p>
    </div>
  );
}
