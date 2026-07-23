import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const sizes = Array.from(new Set(product.variants.map((v) => v.sizeLabel)));

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
          {product.brand}
        </p>
        <h3 className="text-sm font-medium text-stone-900 line-clamp-2">
          {product.title}
        </h3>
        <p className="mt-auto text-sm font-semibold text-stone-900">
          ${product.price.toFixed(0)}
        </p>
        <div className="flex flex-wrap gap-1">
          {sizes.slice(0, 4).map((size) => (
            <span
              key={size}
              className="rounded-full border border-stone-200 px-2 py-0.5 text-xs text-stone-600"
            >
              {size}
            </span>
          ))}
          {sizes.length > 4 && (
            <span className="rounded-full border border-stone-200 px-2 py-0.5 text-xs text-stone-400">
              +{sizes.length - 4}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
