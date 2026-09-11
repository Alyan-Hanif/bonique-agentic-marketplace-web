import Link from "next/link";
import type { MerchantOrder } from "@/lib/commerce";

const STATUS_COLORS: Record<string, string> = {
  placed: "#78716c",
  processing: "#d97706",
  shipped: "#0284c7",
  delivered: "#059669",
  cancelled: "#b91c1c",
};

function dayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function lastSevenDays() {
  const days: Array<{ key: string; label: string }> = [];
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - i);
    days.push({
      key: dayKey(date),
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return days;
}

export default function DashboardOverview({
  productCount,
  orders,
}: {
  productCount: number;
  orders: MerchantOrder[];
}) {
  const paid = orders.filter((order) => order.status !== "cancelled");
  const sales = paid.reduce((sum, order) => sum + order.subtotal, 0);
  const days = lastSevenDays();
  const salesByDay = days.map((day) => {
    const total = paid
      .filter((order) => dayKey(new Date(order.createdAt)) === day.key)
      .reduce((sum, order) => sum + order.subtotal, 0);
    return { ...day, total };
  });
  const maxSales = Math.max(...salesByDay.map((day) => day.total), 1);

  const statusCounts = ["placed", "processing", "shipped", "delivered", "cancelled"].map(
    (status) => ({
      status,
      count: orders.filter((order) => order.status === status).length,
    }),
  );
  const maxStatus = Math.max(...statusCounts.map((row) => row.count), 1);

  const stats = [
    { label: "Sales", value: `$${sales.toFixed(0)}`, href: "/dashboard/orders" },
    { label: "Orders", value: String(orders.length), href: "/dashboard/orders" },
    { label: "Products", value: String(productCount), href: undefined },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const body = (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-semibold text-stone-900">{stat.value}</p>
            </>
          );
          const className =
            "rounded-lg border border-stone-200 bg-white p-5 text-left transition-colors hover:border-stone-300";
          return stat.href ? (
            <Link key={stat.label} href={stat.href} className={className}>
              {body}
            </Link>
          ) : (
            <div key={stat.label} className={className}>
              {body}
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-stone-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
            Sales this week
          </h2>
          <p className="mt-1 text-xs text-stone-500">Paid orders by day (cancelled excluded)</p>
          <div className="mt-6 flex h-48 items-end gap-2">
            {salesByDay.map((day) => {
              const pct = Math.round((day.total / maxSales) * 100);
              return (
                <div key={day.key} className="flex h-full min-w-0 flex-1 flex-col items-center">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t bg-stone-900"
                      style={{ height: `${Math.max(day.total > 0 ? 8 : 3, pct)}%` }}
                      title={`${day.label}: $${day.total.toFixed(0)}`}
                    />
                  </div>
                  <p className="mt-2 text-[10px] text-stone-400">
                    {day.total > 0 ? `$${day.total.toFixed(0)}` : "—"}
                  </p>
                  <p className="text-[11px] font-medium text-stone-500">{day.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-lg border border-stone-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-900">
            Orders by status
          </h2>
          <p className="mt-1 text-xs text-stone-500">How your current orders are moving</p>
          <ul className="mt-6 space-y-3">
            {statusCounts.map((row) => (
              <li key={row.status}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="capitalize text-stone-600">{row.status}</span>
                  <span className="font-medium text-stone-900">{row.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.round((row.count / maxStatus) * 100)}%`,
                      backgroundColor: STATUS_COLORS[row.status],
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
