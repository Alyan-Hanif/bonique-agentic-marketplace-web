"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { authHeaders, getAuthUser, isSeller } from "@/lib/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import FollowButton from "@/components/FollowButton";
import ProductCard from "@/components/ProductCard";
import { mapApiProduct, type ApiProduct } from "@/lib/mappers";
import type { ShopProfile } from "@/lib/social";

export default function ShopPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [data, setData] = useState<ShopProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    apiFetch<ShopProfile>(`/shops/${slug}`, { headers: authHeaders() })
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner label="Loading shop..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!data) return null;

  const products = (data.products as ApiProduct[]).map(mapApiProduct);
  const seller = isSeller(getAuthUser());

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Brand shop
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {data.shop.businessName}
          </h1>
          <p className="mt-2 text-xs uppercase tracking-widest text-neutral-400">
            {data.followerCount} followers · {data.shop.productCount} products
          </p>
        </div>
        {!seller && (
          <FollowButton
            targetType="merchant"
            targetId={data.shop.id}
            following={data.isFollowing}
            onChange={(following) =>
              setData((prev) =>
                prev
                  ? {
                      ...prev,
                      isFollowing: following,
                      followerCount: prev.followerCount + (following ? 1 : -1),
                    }
                  : prev,
              )
            }
          />
        )}
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
