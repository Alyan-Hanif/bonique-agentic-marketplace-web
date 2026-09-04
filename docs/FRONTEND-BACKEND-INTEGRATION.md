# Bonique Frontend ↔ Backend Integration

How the Next.js marketplace UI (`bonique-agentic-marketplace-web`) loads real data from the NestJS API (`bonique-backend`), instead of hardcoded mocks.

Related docs:

- Backend MCP gateway: [`../bonique-backend/docs/MCP-OPERATOR-GUIDE.md`](../../bonique-backend/docs/MCP-OPERATOR-GUIDE.md)
- AI semantic search handoff: [`../bonique-backend/docs/AI-DEVELOPER-HANDOFF.md`](../../bonique-backend/docs/AI-DEVELOPER-HANDOFF.md)

---

## Architecture (current)

```
Browser (localhost:3000)
  → lib/api.ts  (apiFetch)
  → NestJS API (localhost:4000)
  → Prisma → PostgreSQL
```

| Layer | Location | Role |
|-------|----------|------|
| UI | `bonique-agentic-marketplace-web` | Next.js 14 App Router |
| API client | `lib/api.ts` | Unwraps `{ success, data, message }` |
| Mappers | `lib/mappers.ts` | API/Prisma shape → frontend `Product` type |
| Auth | `lib/auth.ts` | JWT in `localStorage` |
| Catalog seed | `bonique-backend/prisma/frontend-catalog.ts` | Same 24 products that used to live in frontend mocks |
| Seed runner | `bonique-backend/prisma/seed.ts` | Merchant, user, sync jobs, agent key + catalog |

**Legacy mock file:** `lib/dummy-data.ts` is kept for reference only. App pages must not import it.

---

## Quick start (both apps)

### 1. Backend

```bash
cd bonique-backend
docker compose up -d
npm install
npx prisma migrate dev
npx prisma db seed          # loads frontend catalog into Postgres
npm run start:dev           # http://localhost:4000
```

### 2. Frontend

```bash
cd bonique-agentic-marketplace-web
npm install
# .env.local should contain:
# NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev                 # http://localhost:3000
```

### Seeded merchant login

| Field | Value |
|-------|--------|
| Email | `admin@bonique.test` |
| Password | `password123` |

---

## Environment

Frontend `.env.local` (gitignored via `.env*.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Backend CORS already allows `http://localhost:3000` (see `bonique-backend/src/main.ts`).

---

## API response wrapper

Backend wraps every success/error as:

```ts
{
  success: boolean;
  statusCode: number;
  message: string;
  data: T;           // present on success
  error?: string;    // present on failure
  timestamp: string;
}
```

`apiFetch()` returns **only `data`** on success and throws `ApiError` with `message` (+ `statusCode`) on failure.

```ts
import { apiFetch } from "@/lib/api";

const products = await apiFetch<ApiProduct[]>("/products");
```

Authenticated calls:

```ts
import { authHeaders } from "@/lib/auth";

await apiFetch("/merchants/me", { headers: authHeaders() });
```

---

## Field mapping (API → UI)

| Frontend `Product` | Backend / Prisma |
|--------------------|------------------|
| `id` | `Product.id` (UUID) |
| `price` | `Number(basePrice)` |
| `images: string[]` | `images[].url` (sorted by `position`) |
| `variants[].stockStatus` | `variants[].inventoryLevel.status` |
| `department` | Derived from `styleCategories` (`kids` / `women` / `men` / else `unisex`) |
| `externalId` (DB only) | `p1`–`p24` (legacy frontend ids, for seed traceability) |

Mappers live in `lib/mappers.ts`: `mapApiProduct`, `mapApiMerchantProduct`, `getTrendingProducts`, `filterByCategory`, etc.

---

## Pages & data sources

| Route | Data source | Auth |
|-------|-------------|------|
| `/` (home trending) | `GET /products` → trending slice | No |
| `/discover` | `GET /products` + client filters | No |
| `/product/[id]` | `GET /products/:id` | No |
| `/style` | `GET /products`, then **local** `matchProductsByPrompt` | No |
| `/login` | `POST /auth/login` → save JWT | — |
| `/dashboard` | `GET /merchants/me`, `GET /merchants/:id/products`, `GET /sync-jobs`, `GET /shopify/status`; **Sync catalog** calls `POST /shopify/sync/products` | Bearer JWT |
| `/connect` | `GET /shopify/status`; **Connect Shopify** calls `POST /platform-connections/connect` `{ provider, shop }` then redirects to Shopify OAuth | Bearer JWT |

### Style recommender note

`lib/dummy-recommend.ts` keyword matching is **intentionally still frontend-only**. It runs against the live API product list, not `dummy-data.ts`. Real semantic search will come from the AI developer / MCP `semantic_apparel_search` work later.

---

## Auth flow (merchant)

1. User submits email/password on `/login`
2. `POST /auth/login` returns `{ accessToken, user }`
3. Frontend stores:
   - `localStorage.bonique_access_token`
   - `localStorage.bonique_user` (includes `merchantId`)
4. Dashboard/connect send `Authorization: Bearer <token>`
5. On `401`, auth is cleared and user is sent back to `/login`

---

## Catalog seed (keeping UI & DB in sync)

Product content for the DB is defined once in:

`bonique-backend/prisma/frontend-catalog.ts`

Originally copied from `bonique-agentic-marketplace-web/lib/dummy-data.ts` (+ Unsplash URLs from `lib/product-images.ts`).

To refresh the DB after catalog edits:

```bash
cd bonique-backend
npx prisma db seed
```

(`seed.ts` already deletes existing rows, then inserts merchant/user/jobs/agent + all catalog products.)

If you ever need a full migrate wipe (dev only):

```bash
npx prisma migrate reset --force
npx prisma db seed
```

> Do **not** run `migrate reset` against production.

After changing frontend-facing catalog fields, update **both**:

1. `prisma/frontend-catalog.ts` (source of truth for DB)
2. Optionally keep `lib/dummy-data.ts` aligned if you still use it as a design reference

---

## Loading & errors

Pages that fetch remote data show:

- `components/LoadingSpinner.tsx` while waiting
- `components/ErrorMessage.tsx` with optional retry

---

## Verification checklist

With both servers running:

```bash
# Backend catalog
curl http://localhost:4000/products
# Expect 24 products, titles like "Grey Fleece Pullover Hoodie" (not old backend-only names)

# Frontend smoke + API auth flow
cd bonique-agentic-marketplace-web
npx tsx scripts/frontend-api-e2e.ts
```

Manual browser checks:

1. Open http://localhost:3000 — Trending shows real products  
2. `/discover` — filters work on API data  
3. Click a product — detail (fabric, variants, stock) loads  
4. `/style?q=winter%20hoodie` — recommendations from API pool  
5. `/login` with seeded credentials → `/dashboard` shows 24 merchant products  
6. `/connect` → Connect Shopify succeeds (stub)  

---

## Key files

### Frontend (`bonique-agentic-marketplace-web`)

| Path | Purpose |
|------|---------|
| `lib/api.ts` | `apiFetch`, `ApiError`, base URL |
| `lib/mappers.ts` | API → UI types |
| `lib/auth.ts` | JWT storage helpers |
| `lib/dummy-data.ts` | Legacy mock (do not import from pages) |
| `lib/dummy-recommend.ts` | Keyword style matcher (still used on `/style`) |
| `.env.local` | `NEXT_PUBLIC_API_URL` |
| `scripts/frontend-api-e2e.ts` | Automated integration check |

### Backend (`bonique-backend`)

| Path | Purpose |
|------|---------|
| `prisma/frontend-catalog.ts` | Product seed content |
| `prisma/seed.ts` | Full DB seed |
| `src/main.ts` | CORS for `:3000` |
| `src/modules/products/` | Public catalog API |
| `src/modules/auth/` | Login / JWT |
| `src/modules/merchants/` | Merchant profile + products |
| `src/modules/sync-jobs/` | Sync job list |
| `src/modules/platform-connections/` | Connect stub |

---

## Out of scope / known follow-ups

| Item | Status |
|------|--------|
| Real vector / semantic search in UI | AI developer (backend MCP / `AiBridgeService`) |
| Real Shopify OAuth | Stub only |
| Multi-merchant storefronts in seed | Single merchant owns all 24 products |
| Deleting `dummy-data.ts` | Kept on purpose for reference |

---

## Troubleshooting

| Symptom | Check |
|---------|--------|
| Frontend empty / fetch errors | Backend up on `:4000`? `.env.local` set? CORS? |
| Login always fails | Seed ran? Use `admin@bonique.test` / `password123` |
| Dashboard redirects to login | Token missing/expired — log in again |
| Wrong/old product titles | Re-run `npx prisma db seed` |
| Images broken | Unsplash URLs in seed; `next.config.mjs` allows `images.unsplash.com` |
| Style page empty catalog | `GET /products` failing — same as discover |
