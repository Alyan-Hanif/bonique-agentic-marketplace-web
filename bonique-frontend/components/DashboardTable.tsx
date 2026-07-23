import type { MerchantProduct } from "@/lib/types";

interface DashboardTableProps {
  products: MerchantProduct[];
}

function getAggregateStockStatus(
  product: MerchantProduct
): "in_stock" | "low_stock" | "out_of_stock" {
  const statuses = product.variants.map((v) => v.stockStatus);
  if (statuses.every((s) => s === "out_of_stock")) return "out_of_stock";
  if (statuses.some((s) => s === "out_of_stock" || s === "low_stock")) return "low_stock";
  return "in_stock";
}

const stockBadge = {
  in_stock: { label: "In Stock", className: "bg-emerald-50 text-emerald-700" },
  low_stock: { label: "Low Stock", className: "bg-amber-50 text-amber-700" },
  out_of_stock: { label: "Out of Stock", className: "bg-red-50 text-red-700" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DashboardTable({ products }: DashboardTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-stone-200 bg-white p-12 text-center text-sm text-stone-500">
        No products found. Connect a store to start syncing.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              <th className="px-6 py-3 text-left font-medium text-stone-600">Product</th>
              <th className="px-6 py-3 text-left font-medium text-stone-600">Price</th>
              <th className="px-6 py-3 text-left font-medium text-stone-600">Variants</th>
              <th className="px-6 py-3 text-left font-medium text-stone-600">Stock</th>
              <th className="px-6 py-3 text-left font-medium text-stone-600">Last Synced</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const stock = getAggregateStockStatus(product);
              const badge = stockBadge[stock];
              return (
                <tr
                  key={product.id}
                  className="border-b border-stone-100 last:border-0 hover:bg-stone-50"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-stone-900">{product.title}</p>
                    <p className="text-xs text-stone-500">{product.brand}</p>
                  </td>
                  <td className="px-6 py-4 text-stone-700">
                    ${product.price.toFixed(0)}
                  </td>
                  <td className="px-6 py-4 text-stone-700">
                    {product.variants.length}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-stone-500">
                    {formatDate(product.lastSyncedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
