"use client";

import { useBlockSellers } from "@/lib/use-buyer-only";

export default function KeepSellersOnDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  useBlockSellers();
  return children;
}
