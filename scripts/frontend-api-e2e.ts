/**
 * End-to-end verification: backend catalog + frontend pages + merchant auth flow.
 * Run: npx tsx scripts/frontend-api-e2e.ts  (from frontend root)
 * Or: node --experimental-strip-types ... 
 */
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const WEB = process.env.FRONTEND_URL || "http://localhost:3000";

const EXPECTED_TITLES = [
  "Grey Fleece Pullover Hoodie",
  "Vintage Wash Denim Jacket",
  "Wool Blend Overcoat",
  "Mustard Corduroy Pinafore Dress",
  "Black Zip-Up Hoodie",
  "Relaxed White Oxford Shirt",
];

async function apiJson(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, init);
  const body = await res.json();
  return { res, body };
}

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

async function main() {
  console.log("=== 1. Backend products = frontend catalog ===");
  const { body: productsBody } = await apiJson("/products");
  assert(productsBody.success, "GET /products failed");
  const products = productsBody.data as Array<{
    id: string;
    title: string;
    brand: string;
    externalId: string;
    images: Array<{ url: string }>;
  }>;
  assert(products.length === 24, `Expected 24 products, got ${products.length}`);
  for (const title of EXPECTED_TITLES) {
    assert(
      products.some((p) => p.title === title),
      `Missing product: ${title}`
    );
  }
  assert(
    products.every((p) => p.externalId?.startsWith("p")),
    "Products should have frontend externalIds p1–p24"
  );
  assert(
    products.every((p) => p.images?.[0]?.url?.includes("unsplash")),
    "Products should use Unsplash image URLs"
  );
  console.log(`✓ ${products.length} products from frontend catalog`);

  const sampleId = products.find((p) => p.title === "Grey Fleece Pullover Hoodie")!.id;
  const { body: detailBody } = await apiJson(`/products/${sampleId}`);
  assert(detailBody.success, "GET /products/:id failed");
  assert(detailBody.data.title === "Grey Fleece Pullover Hoodie", "detail title mismatch");
  console.log(`✓ Product detail OK: ${detailBody.data.title}`);

  console.log("\n=== 2. Merchant auth + dashboard APIs ===");
  const { body: loginBody, res: loginRes } = await apiJson("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@bonique.test",
      password: "password123",
    }),
  });
  assert(loginRes.ok && loginBody.success, `Login failed: ${loginBody.message}`);
  const token = loginBody.data.accessToken as string;
  const merchantId = loginBody.data.user.merchantId as string;
  assert(token && merchantId, "Missing token or merchantId");
  console.log(`✓ Login OK, merchantId=${merchantId}`);

  const auth = { Authorization: `Bearer ${token}` };
  const { body: meBody } = await apiJson("/merchants/me", { headers: auth });
  assert(meBody.success, "GET /merchants/me failed");
  console.log(`✓ Merchant: ${meBody.data.businessName}`);

  const { body: mpBody } = await apiJson(`/merchants/${merchantId}/products`, {
    headers: auth,
  });
  assert(mpBody.success, "GET merchant products failed");
  assert(mpBody.data.length === 24, `Expected 24 merchant products, got ${mpBody.data.length}`);
  console.log(`✓ Merchant products: ${mpBody.data.length}`);

  const { body: jobsBody } = await apiJson("/sync-jobs", { headers: auth });
  assert(jobsBody.success && jobsBody.data.length >= 1, "GET /sync-jobs failed");
  console.log(`✓ Sync jobs: ${jobsBody.data.length}`);

  const { body: connectBody, res: connectRes } = await apiJson(
    "/platform-connections/connect",
    {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify({ provider: "shopify" }),
    }
  );
  assert(connectRes.ok && connectBody.success, `Connect failed: ${connectBody.message}`);
  console.log(`✓ Platform connect stub OK: ${connectBody.data.status}`);

  console.log("\n=== 3. Frontend pages load (no 500) ===");
  for (const path of ["/", "/discover", `/product/${sampleId}`, "/style", "/login"]) {
    const res = await fetch(`${WEB}${path}`);
    assert(res.ok, `Frontend ${path} returned ${res.status}`);
    const html = await res.text();
    assert(!html.includes("Application error"), `Frontend ${path} has app error`);
    console.log(`✓ ${path} → ${res.status}`);
  }

  // Discover should hydrate with fetch to API — verify page mentions Shop / loading markup exists
  const discoverHtml = await (await fetch(`${WEB}/discover`)).text();
  assert(
    discoverHtml.includes("Shop") || discoverHtml.includes("Loading"),
    "Discover page missing expected content"
  );

  console.log("\n=== 4. CORS preflight from localhost:3000 ===");
  const preflight = await fetch(`${API}/products`, {
    method: "OPTIONS",
    headers: {
      Origin: "http://localhost:3000",
      "Access-Control-Request-Method": "GET",
    },
  });
  // Nest may return 204/200/404 for OPTIONS depending on config; check ACAO if present
  const acao = preflight.headers.get("access-control-allow-origin");
  if (acao) {
    assert(
      acao === "http://localhost:3000" || acao === "*",
      `Unexpected CORS origin: ${acao}`
    );
    console.log(`✓ CORS allow-origin: ${acao}`);
  } else {
    // Actual GET with Origin header
    const corsGet = await fetch(`${API}/products`, {
      headers: { Origin: "http://localhost:3000" },
    });
    const origin = corsGet.headers.get("access-control-allow-origin");
    assert(
      origin === "http://localhost:3000" || origin === "*",
      `GET CORS missing/wrong: ${origin}`
    );
    console.log(`✓ CORS on GET: ${origin}`);
  }

  console.log("\nALL FRONTEND↔BACKEND E2E CHECKS PASSED");
}

main().catch((err) => {
  console.error("\nE2E FAILED:", err);
  process.exit(1);
});
