"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import { OrderStatusBadge, orderStatusLabel } from "@/components/MerchantOrdersTable";
import { apiFetch } from "@/lib/api";
import { authHeaders } from "@/lib/auth";
import {
  MERCHANT_ORDER_STATUSES,
  type MerchantOrder,
} from "@/lib/commerce";
import { useSellerOnly } from "@/lib/use-buyer-only";
import { showToast } from "@/lib/toast";

export default function MerchantOrderDetailPage() {
  const allowed = useSellerOnly();
  const params = useParams<{ id: string }>();
  const orderId = params?.id;
  const [order, setOrder] = useState<MerchantOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("placed");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!allowed || !orderId) return;
    apiFetch<MerchantOrder>(`/merchants/me/orders/${orderId}`, {
      headers: authHeaders(),
    })
      .then((data) => {
        setOrder(data);
        setStatus(data.status);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [allowed, orderId]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    setSaving(true);
    try {
      const updated = await apiFetch<MerchantOrder>(
        `/merchants/me/orders/${orderId}`,
        {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify({ status }),
        },
      );
      setOrder(updated);
      setStatus(updated.status);
      showToast(`Order marked ${orderStatusLabel(updated.status)}`, "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not update order", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!allowed || loading) return <LoadingSpinner label="Loading order..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!order) return null;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/orders"
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← Orders
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">Order</h1>
            <p className="mt-1 text-sm text-stone-500">
              {new Date(order.createdAt).toLocaleString()} · {order.customer.email}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-stone-200 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
            Items
          </h2>
          <ul className="mt-4 divide-y border-y border-stone-100">
            {order.lines.map((line) => (
              <li key={line.id} className="flex justify-between gap-4 py-3 text-sm">
                <span>
                  {line.title} × {line.quantity}
                  <span className="block text-xs text-stone-400">
                    {[line.brand, line.color, line.sizeLabel].filter(Boolean).join(" · ")}
                  </span>
                </span>
                <span>${line.lineTotal.toFixed(0)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-right font-semibold">Total ${order.subtotal.toFixed(0)}</p>
          <p className="mt-1 text-right text-xs text-stone-400">
            Payment: {order.paymentStatus === "stub" ? "stub (not charged)" : order.paymentStatus}
          </p>
        </section>

        <section className="space-y-6">
          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
              Ship to
            </h2>
            <p className="mt-3 text-sm text-stone-700">
              {order.shipping.name}
              <br />
              {order.shipping.line1}
              <br />
              {order.shipping.city}
              {order.shipping.postal ? ` ${order.shipping.postal}` : ""}
              <br />
              {order.shipping.country}
            </p>
          </div>

          <form
            onSubmit={save}
            className="rounded-lg border border-stone-200 bg-white p-6"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
              Fulfillment
            </h2>
            <label htmlFor="status" className="mt-4 block text-sm font-medium text-stone-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-stone-400 focus:outline-none"
            >
              {MERCHANT_ORDER_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {orderStatusLabel(value)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={saving || status === order.status}
              className="mt-4 w-full rounded-full bg-stone-900 py-3 text-sm font-medium uppercase tracking-wider text-white hover:bg-stone-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Update order"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
