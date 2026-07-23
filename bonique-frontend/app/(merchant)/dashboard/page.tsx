import Link from "next/link";
import DashboardTable from "@/components/DashboardTable";
import SyncStatusBadge from "@/components/SyncStatusBadge";
import {
  defaultMerchant,
  getMerchantProducts,
  syncJobs,
} from "@/lib/dummy-data";

export default function DashboardPage() {
  const products = getMerchantProducts(defaultMerchant.id);
  const merchantSyncJob = syncJobs.find(
    (job) => job.merchantName === defaultMerchant.businessName
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900 md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            {defaultMerchant.businessName} — manage your connected store
          </p>
        </div>
        <Link
          href="/connect"
          className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-2.5 text-sm font-medium text-stone-900 transition-colors hover:border-stone-400"
        >
          Connect another store
        </Link>
      </div>

      {merchantSyncJob && (
        <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-4">
          <span className="text-sm text-stone-600">Store sync status:</span>
          <SyncStatusBadge status={merchantSyncJob.status} />
          <span className="text-xs text-stone-400">
            Last synced{" "}
            {new Date(merchantSyncJob.lastSyncedAt).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </span>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-900">
          Your Products
        </h2>
        <DashboardTable products={products} />
      </div>
    </div>
  );
}
