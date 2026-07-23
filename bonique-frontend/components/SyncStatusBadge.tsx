import type { SyncJob } from "@/lib/types";

interface SyncStatusBadgeProps {
  status: SyncJob["status"];
}

const config = {
  success: {
    label: "Synced",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  running: {
    label: "Syncing",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500 animate-pulse",
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
};

export default function SyncStatusBadge({ status }: SyncStatusBadgeProps) {
  const { label, className, dot } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
