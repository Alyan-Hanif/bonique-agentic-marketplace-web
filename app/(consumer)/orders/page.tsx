"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { authHeaders } from "@/lib/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import type { Order } from "@/lib/commerce";
import { useBuyerOnly } from "@/lib/use-buyer-only";

export default function OrdersPage() {
  const allowed = useBuyerOnly();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!allowed) return;
    apiFetch<Order[]>("/orders", { headers: authHeaders() })
      .then(setOrders)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [allowed]);

  if (!allowed || loading) return <LoadingSpinner label="Loading orders..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="page-shell-narrow">
      <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Orders</h1>
      {orders.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No orders yet.</p>
      ) : (
        <ul className="mt-8 divide-y overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          {orders.map((order) => (
            <li key={order.id} className="px-4 py-4">
              <Link href={`/orders/${order.id}`} className="flex justify-between hover:underline">
                <span>
                  {new Date(order.createdAt).toLocaleDateString()} · {order.status}
                </span>
                <span>${order.nativeSubtotal.toFixed(0)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
