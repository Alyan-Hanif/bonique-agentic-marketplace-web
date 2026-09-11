import Link from "next/link";
import type { MerchantOrder } from "@/lib/commerce";

const statusClass: Record<string, string> = {
  placed: "bg-stone-100 text-stone-700",
  processing: "bg-amber-50 text-amber-800",
  shipped: "bg-sky-50 text-sky-800",
  delivered: "bg-emerald-50 text-emerald-800",
  cancelled: "bg-red-50 text-red-700",
};

export function orderStatusLabel(status: string) {
  return status.replace(/_/g, " ");
}

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
        statusClass[status] ?? "bg-stone-100 text-stone-700"
      }`}
    >
      {orderStatusLabel(status)}
    </span>
  );
}

export default function MerchantOrdersTable({
  orders,
}: {
  orders: MerchantOrder[];
}) {
  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-12 text-center text-sm text-stone-500">
        No orders yet. When shoppers buy your products, they show up here.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              <th className="px-6 py-3 text-left font-medium text-stone-600">Order</th>
              <th className="px-6 py-3 text-left font-medium text-stone-600">Customer</th>
              <th className="px-6 py-3 text-left font-medium text-stone-600">Items</th>
              <th className="px-6 py-3 text-left font-medium text-stone-600">Total</th>
              <th className="px-6 py-3 text-left font-medium text-stone-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                <td className="px-6 py-4">
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="font-medium text-stone-900 hover:underline"
                  >
                    {new Date(order.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <p className="text-stone-900">{order.customer.name}</p>
                  <p className="text-xs text-stone-500">{order.customer.email}</p>
                </td>
                <td className="px-6 py-4 text-stone-700">
                  {order.lines.reduce((sum, line) => sum + line.quantity, 0)}
                </td>
                <td className="px-6 py-4 text-stone-700">${order.subtotal.toFixed(0)}</td>
                <td className="px-6 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
