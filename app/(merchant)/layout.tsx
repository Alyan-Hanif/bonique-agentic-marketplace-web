import MerchantChrome from "@/components/MerchantChrome";

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MerchantChrome>{children}</MerchantChrome>;
}
