export interface CartLine {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  title: string;
  brand?: string | null;
  sizeLabel?: string | null;
  color?: string | null;
  imageUrl?: string | null;
  unitPrice: number;
  lineTotal: number;
  currency: string;
  source: "native" | "shopify";
  handoverUrl?: string | null;
}

export interface Cart {
  id: string;
  itemCount: number;
  nativeSubtotal: number;
  shopifyCount: number;
  currency: string;
  lines: CartLine[];
}

export interface ShopifyHandover {
  title: string;
  url: string | null;
}

export interface OrderLine {
  id: string;
  title: string;
  brand?: string | null;
  sizeLabel?: string | null;
  color?: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  currency: string;
  source: string;
  handoverUrl?: string | null;
  imageUrl?: string | null;
}

export interface Order {
  id: string;
  status: string;
  paymentStatus: string;
  nativeSubtotal: number;
  currency: string;
  shipping: {
    name: string;
    line1: string;
    city: string;
    region?: string | null;
    postal?: string | null;
    country: string;
  };
  createdAt: string;
  lines: OrderLine[];
}

export interface CheckoutResult {
  order: Order;
  shopifyHandovers: ShopifyHandover[];
  message: string;
}

export const MERCHANT_ORDER_STATUSES = [
  "placed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type MerchantOrderStatus = (typeof MERCHANT_ORDER_STATUSES)[number];

export interface MerchantOrderLine {
  id: string;
  title: string;
  brand?: string | null;
  sizeLabel?: string | null;
  color?: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  currency: string;
  imageUrl?: string | null;
}

export interface MerchantOrder {
  id: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  currency: string;
  customer: {
    email: string;
    name: string;
  };
  shipping: Order["shipping"];
  createdAt: string;
  lines: MerchantOrderLine[];
}
