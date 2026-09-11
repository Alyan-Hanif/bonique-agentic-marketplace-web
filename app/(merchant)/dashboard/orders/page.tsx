"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import MerchantOrdersTable from "@/components/MerchantOrdersTable";
import { apiFetch } from "@/lib/api";
import { authHeaders } from "@/lib/auth";
import type { MerchantOrder } from "@/lib/commerce";
import { useSellerOnly } from "@/lib/use-buyer-only";

export default function MerchantOrdersPage() {
  const allowed = useSellerOnly();
  const [orders, setOrders] = useState<MerchantOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!allowed) return;
    apiFetch<MerchantOrder[]>("/merchants/me/orders", { headers: authHeaders() })
      .then(setOrders)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [allowed]);

  if (!allowed || loading) return <LoadingSpinner label="Loading orders..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900 md:text-3xl">Orders</h1>
        <p className="mt-1 text-sm text-stone-500">
          Orders for your products. Open one to update fulfillment.
        </p>
      </div>
      <MerchantOrdersTable orders={orders} />
    </div>
  );
}
