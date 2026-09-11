"use client";

import { useEffect, useState } from "react";
import ConsumerHeader from "@/components/ConsumerHeader";
import ConsumerFooter from "@/components/ConsumerFooter";
import MerchantChrome from "@/components/MerchantChrome";
import { getAuthUser, isSeller } from "@/lib/auth";

function accountMode(): "seller" | "buyer" {
  const user = getAuthUser();
  return user && isSeller(user) ? "seller" : "buyer";
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<"seller" | "buyer">(accountMode);

  useEffect(() => {
    setMode(accountMode());
  }, []);

  if (mode === "seller") {
    return <MerchantChrome>{children}</MerchantChrome>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ConsumerHeader />
      <main className="flex-1">{children}</main>
      <ConsumerFooter />
    </div>
  );
}
