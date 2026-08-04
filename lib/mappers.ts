import type { MerchantProduct, Product, ProductVariant } from "./types";

/** Raw shapes returned by NestJS / Prisma */
export interface ApiInventoryLevel {
  status?: string;
  quantity?: number | null;
}

export interface ApiVariant {
  id: string;
  sizeLabel?: string | null;
  color?: string | null;
  chestCm?: number | null;
  waistCm?: number | null;
  lengthCm?: number | null;
  inventoryLevel?: ApiInventoryLevel | null;
}

export interface ApiImage {
  url: string;
  position?: number;
}

export interface ApiProduct {
  id: string;
  merchantId?: string;
  title: string;
  brand?: string | null;
  description?: string | null;
  basePrice: number | string;
  currency: string;
  styleCategories?: string[];
  fabricComposition?: string | null;
  careInstructions?: string | null;
  lastVerifiedAt?: string | null;
  images?: ApiImage[];
  variants?: ApiVariant[];
}

export interface ApiMerchant {
  id: string;
  businessName: string;
  status: string;
  slug?: string;
}

export interface ApiSyncJob {
  id: string;
  status: string;
  completedAt?: string | null;
  startedAt?: string | null;
  createdAt?: string;
  platformConnection?: { provider?: string };
}

function deriveDepartment(
  categories: string[]
): Product["department"] {
  if (categories.includes("kids")) return "kids";
  if (categories.includes("women")) return "women";
  if (categories.includes("men")) return "men";
  return "unisex";
}

function mapStockStatus(
  status?: string | null
): ProductVariant["stockStatus"] {
  if (status === "low_stock" || status === "out_of_stock") return status;
  return "in_stock";
}

export function mapApiVariant(v: ApiVariant): ProductVariant {
  return {
    id: v.id,
    sizeLabel: v.sizeLabel ?? "One Size",
    color: v.color ?? "Default",
    chestCm: v.chestCm ?? undefined,
    waistCm: v.waistCm ?? undefined,
    lengthCm: v.lengthCm ?? undefined,
    stockStatus: mapStockStatus(v.inventoryLevel?.status),
  };
}

export function mapApiProduct(p: ApiProduct): Product {
  const styleCategories = p.styleCategories ?? [];
  return {
    id: p.id,
    title: p.title,
    brand: p.brand ?? "Bonique",
    price: Number(p.basePrice),
    currency: p.currency || "USD",
    description: p.description ?? "",
    department: deriveDepartment(styleCategories),
    styleCategories,
    fabricComposition: p.fabricComposition ?? "See care label",
    careInstructions: p.careInstructions ?? "Follow care label instructions.",
    images: (p.images ?? [])
      .slice()
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
      .map((img) => img.url),
    variants: (p.variants ?? []).map(mapApiVariant),
  };
}

export function mapApiMerchantProduct(p: ApiProduct): MerchantProduct {
  return {
    ...mapApiProduct(p),
    merchantId: p.merchantId ?? "",
    lastSyncedAt:
      p.lastVerifiedAt ?? new Date().toISOString(),
  };
}

export function mapSyncStatus(
  status: string
): "success" | "running" | "failed" {
  if (status === "completed" || status === "success") return "success";
  if (status === "failed") return "failed";
  return "running";
}

export function getTrendingProducts(products: Product[]): Product[] {
  const newArrivals = products.filter((p) =>
    p.styleCategories.includes("new-arrivals")
  );
  const fillers = products.filter(
    (p) => !p.styleCategories.includes("new-arrivals")
  );
  return newArrivals.concat(fillers.slice(0, 4)).slice(0, 8);
}

export function filterByCategory(
  products: Product[],
  category: string
): Product[] {
  switch (category) {
    case "new-arrivals":
      return products.filter((p) =>
        p.styleCategories.includes("new-arrivals")
      );
    case "men":
      return products.filter(
        (p) =>
          p.department === "men" || p.styleCategories.includes("men")
      );
    case "women":
      return products.filter(
        (p) =>
          p.department === "women" || p.styleCategories.includes("women")
      );
    case "kids":
      return products.filter(
        (p) =>
          p.department === "kids" || p.styleCategories.includes("kids")
      );
    case "outerwear":
      return products.filter((p) =>
        p.styleCategories.includes("outerwear")
      );
    case "footwear":
      return products.filter((p) =>
        p.styleCategories.includes("footwear")
      );
    case "sale":
      return products.filter((p) => p.styleCategories.includes("sale"));
    default:
      return products;
  }
}

export function collectSizes(products: Product[]): string[] {
  const sizes = new Set<string>();
  products.forEach((p) => p.variants.forEach((v) => sizes.add(v.sizeLabel)));
  return Array.from(sizes).sort();
}

export function collectColors(products: Product[]): string[] {
  const colors = new Set<string>();
  products.forEach((p) => p.variants.forEach((v) => colors.add(v.color)));
  return Array.from(colors).sort();
}

export function collectPriceRange(products: Product[]): {
  min: number;
  max: number;
} {
  if (products.length === 0) return { min: 0, max: 500 };
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
