import ConsumerHeader from "@/components/ConsumerHeader";
import ConsumerFooter from "@/components/ConsumerFooter";
import StyleRecommender from "@/components/StyleRecommender";

export default function ConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ConsumerHeader />
      <main className="flex-1">{children}</main>
      <ConsumerFooter />
      <StyleRecommender />
    </div>
  );
}
