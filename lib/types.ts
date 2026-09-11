export interface Product {
  id: string;
  title: string;
  brand: string;
  price: number;
  currency: string;
  description: string;
  department: "men" | "women" | "kids" | "unisex";
  styleCategories: string[];
  fabricComposition: string;
  careInstructions: string;
  images: string[];
  variants: ProductVariant[];
  source?: "native" | "shopify";
  handoverUrl?: string | null;
}

export interface ProductVariant {
  id: string;
  sizeLabel: string;
  color: string;
  chestCm?: number;
  waistCm?: number;
  lengthCm?: number;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
}

export interface Merchant {
  id: string;
  businessName: string;
  status: string;
}

export interface SyncJob {
  id: string;
  merchantName: string;
  status: "success" | "running" | "failed";
  lastSyncedAt: string;
}

export interface MerchantProduct extends Product {
  merchantId: string;
  lastSyncedAt: string;
  source?: "shopify" | "manual";
}

export interface ProductFilters {
  search: string;
  sizes: string[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
}
