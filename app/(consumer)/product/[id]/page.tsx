import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import { getProductById } from "@/lib/dummy-data";

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/discover"
        className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Shop
      </Link>
      <ProductDetailView product={product} />
    </div>
  );
}
