export interface ShopifyConnection {
  id: string;
  merchantId: string;
  provider: string;
  externalShopId: string;
  scopes: string[];
  status: string;
  lastSyncedAt: string | null;
  hasAccessToken: boolean;
}

export interface ShopifyStatus {
  configured: boolean;
  authenticated: boolean;
  message: string;
  oauthRedirectUri: string | null;
  scopes: string;
  connection: ShopifyConnection | null;
}

export interface ShopifyConnectStart {
  provider: string;
  status: string;
  shop: string;
  authorizeUrl: string;
  message: string;
}

export interface ShopifyProductSyncResult {
  shop: string;
  productsProcessed: number;
  productsCreated: number;
  productsUpdated: number;
  productsArchived: number;
  variantsProcessed: number;
  failures: Array<{ shopifyProductId: string; error: string }>;
  durationMs: number;
  syncJobId: string | null;
}

export interface ShopifyDisconnectResult {
  disconnected: boolean;
  shop: string;
  shopifyUninstalled: boolean;
  message: string;
}

export function normalizeShopDomain(raw: string): string {
  let shop = raw.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (shop && !shop.includes(".")) {
    shop = `${shop}.myshopify.com`;
  }
  return shop;
}
