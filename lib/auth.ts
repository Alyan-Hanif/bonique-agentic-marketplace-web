const TOKEN_KEY = "bonique_access_token";
const USER_KEY = "bonique_user";

export interface SizeProfile {
  id?: string;
  heightCm?: number | null;
  weightKg?: number | null;
  chestCm?: number | null;
  waistCm?: number | null;
  hipCm?: number | null;
  shoeSize?: string | null;
  preferredFit?: string | null;
}

export interface AuthMerchant {
  id: string;
  businessName: string;
  slug: string;
  status: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  merchantId?: string | null;
  username?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  sizeProfile?: SizeProfile | null;
  merchant?: AuthMerchant | null;
}

export function saveAuth(accessToken: string, user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function authHeaders(): HeadersInit {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isSeller(user: AuthUser | null | undefined): boolean {
  if (!user?.merchantId) return false;
  return user.role === "merchant_admin" || user.role === "seller" || user.role === "admin";
}

export function postLoginPath(user: AuthUser): string {
  return isSeller(user) ? "/dashboard" : "/account";
}
