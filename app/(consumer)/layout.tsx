import { Suspense } from "react";
import dynamic from "next/dynamic";
import ConsumerHeader from "@/components/ConsumerHeader";
import ConsumerFooter from "@/components/ConsumerFooter";
import KeepSellersOnDashboard from "@/components/KeepSellersOnDashboard";

const StyleRecommender = dynamic(() => import("@/components/StyleRecommender"), {
  ssr: false,
});

export default function ConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <KeepSellersOnDashboard>
      <div className="flex min-h-screen flex-col bg-white">
        <Suspense>
          <ConsumerHeader />
        </Suspense>
        <main className="flex-1">{children}</main>
        <ConsumerFooter />
        <StyleRecommender />
      </div>
    </KeepSellersOnDashboard>
  );
}
