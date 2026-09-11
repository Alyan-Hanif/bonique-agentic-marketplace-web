export const LOOK_SLOTS = [
  "top",
  "bottom",
  "shoes",
  "outerwear",
  "accessory",
] as const;

export type LookSlot = (typeof LOOK_SLOTS)[number];

export interface WardrobeItem {
  id: string;
  source: string;
  title: string;
  brand?: string | null;
  category: string;
  color?: string | null;
  sizeLabel?: string | null;
  imageUrl?: string | null;
  productId?: string | null;
  variantId?: string | null;
  product?: {
    id: string;
    title: string;
    brand?: string | null;
    images?: Array<{ url: string }>;
  } | null;
}

export interface LookItem {
  id: string;
  slot: string;
  wardrobeItemId: string;
  wardrobeItem: WardrobeItem;
}

export interface Look {
  id: string;
  title: string;
  caption?: string | null;
  isPublic: boolean;
  publishedAt?: string | null;
  items: LookItem[];
}

export function itemImage(item: WardrobeItem): string | undefined {
  return item.imageUrl || item.product?.images?.[0]?.url || undefined;
}
