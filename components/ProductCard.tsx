import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const sizes = Array.from(new Set(product.variants.map((v) => v.sizeLabel)));
  const onSale = product.styleCategories.includes("sale");

  return (
    <Link
      href={`/product/${product.id}`}
      className={`group flex flex-col overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        compact ? "" : "rounded-sm"
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <ProductImage
          src={product.images[0]}
          alt={product.title}
          productId={product.id}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={compact ? "176px" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"}
        />
        {onSale && (
          <span className="absolute left-2 top-2 bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
            Sale
          </span>
        )}
        {product.styleCategories.includes("new-arrivals") && !onSale && (
          <span className="absolute left-2 top-2 bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
            New
          </span>
        )}
      </div>
      <div className={`flex flex-1 flex-col ${compact ? "gap-1 p-2" : "gap-1.5 p-3"}`}>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
          {product.brand}
        </p>
        <h3 className={`font-medium text-neutral-900 line-clamp-2 ${compact ? "text-xs" : "text-sm"}`}>
          {product.title}
        </h3>
        <p className={`mt-auto font-bold text-neutral-900 ${compact ? "text-xs" : "text-sm"}`}>
          ${product.price.toFixed(0)}
        </p>
        {!compact && (
          <div className="flex flex-wrap gap-1">
            {sizes.slice(0, 3).map((size) => (
              <span key={size} className="text-[10px] text-neutral-400">
                {size}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
