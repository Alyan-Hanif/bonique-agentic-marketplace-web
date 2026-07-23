import type { Merchant, MerchantProduct, Product, SyncJob } from "./types";

export const merchants: Merchant[] = [
  { id: "m1", businessName: "Lumière Atelier", status: "active" },
  { id: "m2", businessName: "North & Thread", status: "active" },
  { id: "m3", businessName: "Velvet Lane", status: "pending" },
];

export const syncJobs: SyncJob[] = [
  {
    id: "sj1",
    merchantName: "Lumière Atelier",
    status: "success",
    lastSyncedAt: "2026-07-23T14:32:00Z",
  },
  {
    id: "sj2",
    merchantName: "North & Thread",
    status: "running",
    lastSyncedAt: "2026-07-23T15:10:00Z",
  },
  {
    id: "sj3",
    merchantName: "Velvet Lane",
    status: "failed",
    lastSyncedAt: "2026-07-22T09:45:00Z",
  },
];

const products: Product[] = [
  {
    id: "p1",
    title: "Silk Blend Midi Dress",
    brand: "Lumière Atelier",
    price: 189,
    currency: "USD",
    styleCategories: ["dresses", "evening"],
    fabricComposition: "70% Silk, 30% Viscose",
    careInstructions: "Dry clean only. Store on a padded hanger.",
    images: [
      "https://picsum.photos/seed/bonique-p1/400/500",
      "https://picsum.photos/seed/bonique-p1b/400/500",
    ],
    variants: [
      { id: "p1-v1", sizeLabel: "XS", color: "Ivory", chestCm: 82, waistCm: 64, lengthCm: 118, stockStatus: "in_stock" },
      { id: "p1-v2", sizeLabel: "S", color: "Ivory", chestCm: 86, waistCm: 68, lengthCm: 119, stockStatus: "in_stock" },
      { id: "p1-v3", sizeLabel: "M", color: "Black", chestCm: 90, waistCm: 72, lengthCm: 120, stockStatus: "low_stock" },
    ],
  },
  {
    id: "p2",
    title: "Tailored Wool Blazer",
    brand: "North & Thread",
    price: 245,
    currency: "USD",
    styleCategories: ["outerwear", "workwear"],
    fabricComposition: "100% Merino Wool",
    careInstructions: "Dry clean. Brush after wear to maintain nap.",
    images: ["https://picsum.photos/seed/bonique-p2/400/500"],
    variants: [
      { id: "p2-v1", sizeLabel: "S", color: "Charcoal", chestCm: 96, waistCm: 82, lengthCm: 68, stockStatus: "in_stock" },
      { id: "p2-v2", sizeLabel: "M", color: "Charcoal", chestCm: 100, waistCm: 86, lengthCm: 69, stockStatus: "in_stock" },
      { id: "p2-v3", sizeLabel: "L", color: "Navy", chestCm: 104, waistCm: 90, lengthCm: 70, stockStatus: "out_of_stock" },
    ],
  },
  {
    id: "p3",
    title: "Organic Cotton Tee",
    brand: "Velvet Lane",
    price: 48,
    currency: "USD",
    styleCategories: ["tops", "casual"],
    fabricComposition: "100% Organic Cotton",
    careInstructions: "Machine wash cold. Tumble dry low.",
    images: ["https://picsum.photos/seed/bonique-p3/400/500"],
    variants: [
      { id: "p3-v1", sizeLabel: "XS", color: "White", chestCm: 84, waistCm: 66, lengthCm: 62, stockStatus: "in_stock" },
      { id: "p3-v2", sizeLabel: "S", color: "Sage", chestCm: 88, waistCm: 70, lengthCm: 63, stockStatus: "in_stock" },
      { id: "p3-v3", sizeLabel: "M", color: "Sage", chestCm: 92, waistCm: 74, lengthCm: 64, stockStatus: "low_stock" },
    ],
  },
  {
    id: "p4",
    title: "High-Rise Linen Trousers",
    brand: "Lumière Atelier",
    price: 128,
    currency: "USD",
    styleCategories: ["bottoms", "casual"],
    fabricComposition: "100% European Linen",
    careInstructions: "Hand wash or gentle cycle. Line dry.",
    images: ["https://picsum.photos/seed/bonique-p4/400/500"],
    variants: [
      { id: "p4-v1", sizeLabel: "S", color: "Sand", waistCm: 68, lengthCm: 102, stockStatus: "in_stock" },
      { id: "p4-v2", sizeLabel: "M", color: "Sand", waistCm: 72, lengthCm: 103, stockStatus: "in_stock" },
      { id: "p4-v3", sizeLabel: "L", color: "Olive", waistCm: 76, lengthCm: 104, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p5",
    title: "Cashmere Crew Sweater",
    brand: "North & Thread",
    price: 198,
    currency: "USD",
    styleCategories: ["knitwear", "casual"],
    fabricComposition: "100% Grade-A Cashmere",
    careInstructions: "Hand wash in cold water. Lay flat to dry.",
    images: ["https://picsum.photos/seed/bonique-p5/400/500"],
    variants: [
      { id: "p5-v1", sizeLabel: "S", color: "Camel", chestCm: 94, waistCm: 80, lengthCm: 58, stockStatus: "in_stock" },
      { id: "p5-v2", sizeLabel: "M", color: "Grey", chestCm: 98, waistCm: 84, lengthCm: 59, stockStatus: "low_stock" },
      { id: "p5-v3", sizeLabel: "L", color: "Grey", chestCm: 102, waistCm: 88, lengthCm: 60, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p6",
    title: "Pleated Satin Skirt",
    brand: "Velvet Lane",
    price: 112,
    currency: "USD",
    styleCategories: ["bottoms", "evening"],
    fabricComposition: "95% Polyester, 5% Elastane",
    careInstructions: "Dry clean recommended. Do not iron pleats.",
    images: ["https://picsum.photos/seed/bonique-p6/400/500"],
    variants: [
      { id: "p6-v1", sizeLabel: "XS", color: "Blush", waistCm: 62, lengthCm: 72, stockStatus: "in_stock" },
      { id: "p6-v2", sizeLabel: "S", color: "Blush", waistCm: 66, lengthCm: 73, stockStatus: "in_stock" },
      { id: "p6-v3", sizeLabel: "M", color: "Midnight", waistCm: 70, lengthCm: 74, stockStatus: "out_of_stock" },
    ],
  },
  {
    id: "p7",
    title: "Structured Leather Tote",
    brand: "Lumière Atelier",
    price: 320,
    currency: "USD",
    styleCategories: ["accessories"],
    fabricComposition: "100% Full-Grain Leather",
    careInstructions: "Wipe with a damp cloth. Condition leather quarterly.",
    images: ["https://picsum.photos/seed/bonique-p7/400/500"],
    variants: [
      { id: "p7-v1", sizeLabel: "One Size", color: "Tan", stockStatus: "in_stock" },
      { id: "p7-v2", sizeLabel: "One Size", color: "Black", stockStatus: "low_stock" },
    ],
  },
  {
    id: "p8",
    title: "Relaxed Denim Jacket",
    brand: "North & Thread",
    price: 156,
    currency: "USD",
    styleCategories: ["outerwear", "casual"],
    fabricComposition: "98% Cotton, 2% Elastane",
    careInstructions: "Machine wash cold inside out. Hang dry.",
    images: ["https://picsum.photos/seed/bonique-p8/400/500"],
    variants: [
      { id: "p8-v1", sizeLabel: "S", color: "Indigo", chestCm: 98, waistCm: 84, lengthCm: 56, stockStatus: "in_stock" },
      { id: "p8-v2", sizeLabel: "M", color: "Indigo", chestCm: 102, waistCm: 88, lengthCm: 57, stockStatus: "in_stock" },
      { id: "p8-v3", sizeLabel: "L", color: "Light Wash", chestCm: 106, waistCm: 92, lengthCm: 58, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p9",
    title: "Ribbed Knit Tank",
    brand: "Velvet Lane",
    price: 38,
    currency: "USD",
    styleCategories: ["tops", "casual"],
    fabricComposition: "95% Cotton, 5% Spandex",
    careInstructions: "Machine wash cold. Do not bleach.",
    images: ["https://picsum.photos/seed/bonique-p9/400/500"],
    variants: [
      { id: "p9-v1", sizeLabel: "XS", color: "Black", chestCm: 76, waistCm: 60, lengthCm: 52, stockStatus: "in_stock" },
      { id: "p9-v2", sizeLabel: "S", color: "Cream", chestCm: 80, waistCm: 64, lengthCm: 53, stockStatus: "in_stock" },
      { id: "p9-v3", sizeLabel: "M", color: "Rust", chestCm: 84, waistCm: 68, lengthCm: 54, stockStatus: "low_stock" },
    ],
  },
  {
    id: "p10",
    title: "Wide-Leg Crepe Pants",
    brand: "Lumière Atelier",
    price: 168,
    currency: "USD",
    styleCategories: ["bottoms", "workwear"],
    fabricComposition: "70% Triacetate, 30% Polyester",
    careInstructions: "Dry clean or gentle machine wash.",
    images: ["https://picsum.photos/seed/bonique-p10/400/500"],
    variants: [
      { id: "p10-v1", sizeLabel: "S", color: "Black", waistCm: 68, lengthCm: 108, stockStatus: "in_stock" },
      { id: "p10-v2", sizeLabel: "M", color: "Black", waistCm: 72, lengthCm: 109, stockStatus: "in_stock" },
      { id: "p10-v3", sizeLabel: "L", color: "Stone", waistCm: 76, lengthCm: 110, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p11",
    title: "Merino Turtleneck",
    brand: "North & Thread",
    price: 134,
    currency: "USD",
    styleCategories: ["knitwear", "workwear"],
    fabricComposition: "100% Extra-Fine Merino Wool",
    careInstructions: "Hand wash or wool cycle. Lay flat to dry.",
    images: ["https://picsum.photos/seed/bonique-p11/400/500"],
    variants: [
      { id: "p11-v1", sizeLabel: "S", color: "Burgundy", chestCm: 90, waistCm: 76, lengthCm: 60, stockStatus: "in_stock" },
      { id: "p11-v2", sizeLabel: "M", color: "Forest", chestCm: 94, waistCm: 80, lengthCm: 61, stockStatus: "in_stock" },
      { id: "p11-v3", sizeLabel: "L", color: "Forest", chestCm: 98, waistCm: 84, lengthCm: 62, stockStatus: "out_of_stock" },
    ],
  },
  {
    id: "p12",
    title: "Embroidered Linen Blouse",
    brand: "Velvet Lane",
    price: 92,
    currency: "USD",
    styleCategories: ["tops", "casual"],
    fabricComposition: "100% Linen",
    careInstructions: "Hand wash cold. Iron on reverse while damp.",
    images: ["https://picsum.photos/seed/bonique-p12/400/500"],
    variants: [
      { id: "p12-v1", sizeLabel: "XS", color: "White", chestCm: 86, waistCm: 68, lengthCm: 58, stockStatus: "in_stock" },
      { id: "p12-v2", sizeLabel: "S", color: "Sky Blue", chestCm: 90, waistCm: 72, lengthCm: 59, stockStatus: "in_stock" },
      { id: "p12-v3", sizeLabel: "M", color: "Sky Blue", chestCm: 94, waistCm: 76, lengthCm: 60, stockStatus: "low_stock" },
    ],
  },
];

const merchantProductMeta: Record<string, { merchantId: string; lastSyncedAt: string }> = {
  p1: { merchantId: "m1", lastSyncedAt: "2026-07-23T14:32:00Z" },
  p2: { merchantId: "m2", lastSyncedAt: "2026-07-23T15:10:00Z" },
  p3: { merchantId: "m3", lastSyncedAt: "2026-07-22T09:45:00Z" },
  p4: { merchantId: "m1", lastSyncedAt: "2026-07-23T14:32:00Z" },
  p5: { merchantId: "m2", lastSyncedAt: "2026-07-23T15:10:00Z" },
  p6: { merchantId: "m3", lastSyncedAt: "2026-07-22T09:45:00Z" },
  p7: { merchantId: "m1", lastSyncedAt: "2026-07-23T14:32:00Z" },
  p8: { merchantId: "m2", lastSyncedAt: "2026-07-23T15:10:00Z" },
  p9: { merchantId: "m3", lastSyncedAt: "2026-07-22T09:45:00Z" },
  p10: { merchantId: "m1", lastSyncedAt: "2026-07-23T14:32:00Z" },
  p11: { merchantId: "m2", lastSyncedAt: "2026-07-23T15:10:00Z" },
  p12: { merchantId: "m3", lastSyncedAt: "2026-07-22T09:45:00Z" },
};

export const allProducts: Product[] = products;

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getMerchantProducts(merchantId: string): MerchantProduct[] {
  return products
    .filter((p) => merchantProductMeta[p.id]?.merchantId === merchantId)
    .map((p) => ({
      ...p,
      merchantId,
      lastSyncedAt: merchantProductMeta[p.id].lastSyncedAt,
    }));
}

export function getAllSizes(): string[] {
  const sizes = new Set<string>();
  products.forEach((p) => p.variants.forEach((v) => sizes.add(v.sizeLabel)));
  return Array.from(sizes).sort();
}

export function getAllColors(): string[] {
  const colors = new Set<string>();
  products.forEach((p) => p.variants.forEach((v) => colors.add(v.color)));
  return Array.from(colors).sort();
}

export function getPriceRange(): { min: number; max: number } {
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export const defaultMerchant = merchants[0];
