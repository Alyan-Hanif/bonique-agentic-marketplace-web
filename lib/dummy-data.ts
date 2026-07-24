import type { Merchant, MerchantProduct, Product, SyncJob } from "./types";
import { productImageUrl, heroImage } from "./product-images";

export { heroImage };

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
    title: "Oversized Streetwear Hoodie",
    brand: "North & Thread",
    price: 89,
    currency: "USD",
    description: "Heavyweight fleece hoodie with dropped shoulders and kangaroo pocket. Perfect for casual weekend layering.",
    department: "men",
    styleCategories: ["men", "streetwear", "hoodie", "casual", "new-arrivals"],
    fabricComposition: "80% Cotton, 20% Polyester",
    careInstructions: "Machine wash cold. Tumble dry low.",
    images: ["https://source.unsplash.com/600x800/?hoodie,streetwear"],
    variants: [
      { id: "p1-v1", sizeLabel: "S", color: "Black", chestCm: 112, lengthCm: 70, stockStatus: "in_stock" },
      { id: "p1-v2", sizeLabel: "M", color: "Black", chestCm: 118, lengthCm: 72, stockStatus: "in_stock" },
      { id: "p1-v3", sizeLabel: "L", color: "Grey", chestCm: 124, lengthCm: 74, stockStatus: "low_stock" },
    ],
  },
  {
    id: "p2",
    title: "Vintage Wash Denim Jacket",
    brand: "Velvet Lane",
    price: 128,
    currency: "USD",
    description: "Classic trucker silhouette with vintage wash and brass hardware. A grunge-era staple reimagined.",
    department: "unisex",
    styleCategories: ["outerwear", "denim", "vintage", "grunge", "casual"],
    fabricComposition: "100% Cotton Denim",
    careInstructions: "Machine wash cold inside out. Hang dry.",
    images: ["https://source.unsplash.com/600x800/?denim,jacket"],
    variants: [
      { id: "p2-v1", sizeLabel: "S", color: "Indigo", chestCm: 98, lengthCm: 58, stockStatus: "in_stock" },
      { id: "p2-v2", sizeLabel: "M", color: "Indigo", chestCm: 104, lengthCm: 60, stockStatus: "in_stock" },
      { id: "p2-v3", sizeLabel: "L", color: "Light Wash", chestCm: 110, lengthCm: 62, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p3",
    title: "Wool Blend Overcoat",
    brand: "Lumière Atelier",
    price: 289,
    currency: "USD",
    description: "Tailored double-breasted overcoat for cold winter days. Fully lined with notch lapels.",
    department: "men",
    styleCategories: ["outerwear", "winter", "coat", "workwear", "men"],
    fabricComposition: "70% Wool, 30% Polyester",
    careInstructions: "Dry clean only.",
    images: ["https://source.unsplash.com/600x800/?winter,coat"],
    variants: [
      { id: "p3-v1", sizeLabel: "M", color: "Charcoal", chestCm: 104, lengthCm: 98, stockStatus: "in_stock" },
      { id: "p3-v2", sizeLabel: "L", color: "Charcoal", chestCm: 110, lengthCm: 100, stockStatus: "in_stock" },
      { id: "p3-v3", sizeLabel: "XL", color: "Navy", chestCm: 116, lengthCm: 102, stockStatus: "low_stock" },
    ],
  },
  {
    id: "p4",
    title: "Retro High-Top Sneakers",
    brand: "North & Thread",
    price: 119,
    currency: "USD",
    description: "Chunky sole high-tops with premium leather upper. Street-ready comfort for all-day wear.",
    department: "unisex",
    styleCategories: ["footwear", "sneakers", "streetwear", "casual"],
    fabricComposition: "Leather upper, rubber sole",
    careInstructions: "Wipe clean with damp cloth.",
    images: ["https://source.unsplash.com/600x800/?sneakers"],
    variants: [
      { id: "p4-v1", sizeLabel: "8", color: "White/Red", stockStatus: "in_stock" },
      { id: "p4-v2", sizeLabel: "9", color: "White/Red", stockStatus: "in_stock" },
      { id: "p4-v3", sizeLabel: "10", color: "Black", stockStatus: "low_stock" },
      { id: "p4-v4", sizeLabel: "11", color: "Black", stockStatus: "in_stock" },
    ],
  },
  {
    id: "p5",
    title: "Floral Midi Dress",
    brand: "Velvet Lane",
    price: 98,
    currency: "USD",
    description: "Flowing midi dress with delicate floral print. Effortless elegance for brunch or evening outings.",
    department: "women",
    styleCategories: ["women", "dresses", "dress", "casual", "new-arrivals"],
    fabricComposition: "100% Viscose",
    careInstructions: "Hand wash cold. Hang dry.",
    images: ["https://source.unsplash.com/600x800/?dress,fashion"],
    variants: [
      { id: "p5-v1", sizeLabel: "XS", color: "Floral", chestCm: 82, waistCm: 64, lengthCm: 118, stockStatus: "in_stock" },
      { id: "p5-v2", sizeLabel: "S", color: "Floral", chestCm: 86, waistCm: 68, lengthCm: 119, stockStatus: "in_stock" },
      { id: "p5-v3", sizeLabel: "M", color: "Floral", chestCm: 90, waistCm: 72, lengthCm: 120, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p6",
    title: "Graphic Print Tee",
    brand: "North & Thread",
    price: 42,
    currency: "USD",
    description: "Soft cotton tee with bold graphic print. 90s-inspired streetwear essential at an affordable price.",
    department: "unisex",
    styleCategories: ["streetwear", "graphic", "grunge", "casual", "sale"],
    fabricComposition: "100% Organic Cotton",
    careInstructions: "Machine wash cold. Do not bleach.",
    images: ["https://source.unsplash.com/600x800/?tshirt,graphic"],
    variants: [
      { id: "p6-v1", sizeLabel: "S", color: "Black", chestCm: 96, lengthCm: 68, stockStatus: "in_stock" },
      { id: "p6-v2", sizeLabel: "M", color: "White", chestCm: 102, lengthCm: 70, stockStatus: "in_stock" },
      { id: "p6-v3", sizeLabel: "L", color: "Black", chestCm: 108, lengthCm: 72, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p7",
    title: "Slim Fit Chino Pants",
    brand: "Lumière Atelier",
    price: 78,
    currency: "USD",
    description: "Tailored slim chinos in stretch cotton twill. Versatile enough for office or weekend.",
    department: "men",
    styleCategories: ["men", "bottoms", "workwear", "casual"],
    fabricComposition: "97% Cotton, 3% Elastane",
    careInstructions: "Machine wash warm. Tumble dry low.",
    images: ["https://source.unsplash.com/600x800/?chinos,men"],
    variants: [
      { id: "p7-v1", sizeLabel: "30", color: "Khaki", waistCm: 76, lengthCm: 102, stockStatus: "in_stock" },
      { id: "p7-v2", sizeLabel: "32", color: "Khaki", waistCm: 81, lengthCm: 103, stockStatus: "in_stock" },
      { id: "p7-v3", sizeLabel: "34", color: "Navy", waistCm: 86, lengthCm: 104, stockStatus: "low_stock" },
    ],
  },
  {
    id: "p8",
    title: "Puffer Jacket",
    brand: "North & Thread",
    price: 165,
    currency: "USD",
    description: "Lightweight insulated puffer with water-resistant shell. Stay cozy through the coldest months.",
    department: "unisex",
    styleCategories: ["outerwear", "winter", "puffer", "cozy"],
    fabricComposition: "100% Nylon shell, down fill",
    careInstructions: "Machine wash gentle. Tumble dry with tennis balls.",
    images: ["https://source.unsplash.com/600x800/?puffer,jacket"],
    variants: [
      { id: "p8-v1", sizeLabel: "S", color: "Black", chestCm: 104, lengthCm: 66, stockStatus: "in_stock" },
      { id: "p8-v2", sizeLabel: "M", color: "Olive", chestCm: 110, lengthCm: 68, stockStatus: "in_stock" },
      { id: "p8-v3", sizeLabel: "L", color: "Black", chestCm: 116, lengthCm: 70, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p9",
    title: "High-Waist Skinny Jeans",
    brand: "Velvet Lane",
    price: 88,
    currency: "USD",
    description: "Stretch denim skinny jeans with a flattering high-rise waist. A wardrobe staple for every season.",
    department: "women",
    styleCategories: ["women", "denim", "jeans", "bottoms", "casual"],
    fabricComposition: "92% Cotton, 6% Polyester, 2% Elastane",
    careInstructions: "Machine wash cold inside out.",
    images: ["https://source.unsplash.com/600x800/?jeans,women"],
    variants: [
      { id: "p9-v1", sizeLabel: "26", color: "Dark Wash", waistCm: 66, lengthCm: 96, stockStatus: "in_stock" },
      { id: "p9-v2", sizeLabel: "28", color: "Dark Wash", waistCm: 71, lengthCm: 97, stockStatus: "in_stock" },
      { id: "p9-v3", sizeLabel: "30", color: "Light Wash", waistCm: 76, lengthCm: 98, stockStatus: "low_stock" },
    ],
  },
  {
    id: "p10",
    title: "Leather Chelsea Boots",
    brand: "Lumière Atelier",
    price: 198,
    currency: "USD",
    description: "Hand-finished leather Chelsea boots with elastic side panels. Polished enough for date night.",
    department: "men",
    styleCategories: ["footwear", "boots", "men", "workwear"],
    fabricComposition: "100% Full-Grain Leather",
    careInstructions: "Condition leather monthly. Use shoe trees.",
    images: ["https://source.unsplash.com/600x800/?chelsea,boots"],
    variants: [
      { id: "p10-v1", sizeLabel: "9", color: "Brown", stockStatus: "in_stock" },
      { id: "p10-v2", sizeLabel: "10", color: "Brown", stockStatus: "in_stock" },
      { id: "p10-v3", sizeLabel: "11", color: "Black", stockStatus: "low_stock" },
    ],
  },
  {
    id: "p11",
    title: "Cropped Blazer",
    brand: "Velvet Lane",
    price: 145,
    currency: "USD",
    description: "Structured cropped blazer with single-button closure. Power dressing meets modern minimalism.",
    department: "women",
    styleCategories: ["women", "workwear", "blazer", "office"],
    fabricComposition: "65% Polyester, 35% Viscose",
    careInstructions: "Dry clean recommended.",
    images: ["https://source.unsplash.com/600x800/?blazer,women"],
    variants: [
      { id: "p11-v1", sizeLabel: "XS", color: "Black", chestCm: 88, lengthCm: 52, stockStatus: "in_stock" },
      { id: "p11-v2", sizeLabel: "S", color: "Black", chestCm: 92, lengthCm: 53, stockStatus: "in_stock" },
      { id: "p11-v3", sizeLabel: "M", color: "Cream", chestCm: 96, lengthCm: 54, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p12",
    title: "Crossbody Leather Bag",
    brand: "Lumière Atelier",
    price: 156,
    currency: "USD",
    description: "Compact crossbody bag in pebbled leather with adjustable strap. Hands-free style on the go.",
    department: "women",
    styleCategories: ["accessories", "bag", "women"],
    fabricComposition: "100% Pebbled Leather",
    careInstructions: "Wipe with leather conditioner.",
    images: ["https://source.unsplash.com/600x800/?handbag,leather"],
    variants: [
      { id: "p12-v1", sizeLabel: "One Size", color: "Tan", stockStatus: "in_stock" },
      { id: "p12-v2", sizeLabel: "One Size", color: "Black", stockStatus: "in_stock" },
    ],
  },
  {
    id: "p13",
    title: "Bomber Jacket",
    brand: "North & Thread",
    price: 134,
    currency: "USD",
    description: "Classic MA-1 bomber with ribbed cuffs and hem. Military-inspired streetwear icon.",
    department: "men",
    styleCategories: ["outerwear", "jacket", "men", "streetwear", "new-arrivals"],
    fabricComposition: "100% Nylon",
    careInstructions: "Spot clean only.",
    images: ["https://source.unsplash.com/600x800/?bomber,jacket"],
    variants: [
      { id: "p13-v1", sizeLabel: "M", color: "Olive", chestCm: 108, lengthCm: 64, stockStatus: "in_stock" },
      { id: "p13-v2", sizeLabel: "L", color: "Black", chestCm: 114, lengthCm: 66, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p14",
    title: "Ribbed Knit Sweater",
    brand: "Velvet Lane",
    price: 72,
    currency: "USD",
    description: "Cozy ribbed knit crewneck sweater. Soft merino blend perfect for layering in winter.",
    department: "women",
    styleCategories: ["knitwear", "winter", "cozy", "women", "casual"],
    fabricComposition: "70% Merino Wool, 30% Acrylic",
    careInstructions: "Hand wash cold. Lay flat to dry.",
    images: ["https://source.unsplash.com/600x800/?sweater,knitwear"],
    variants: [
      { id: "p14-v1", sizeLabel: "S", color: "Camel", chestCm: 90, lengthCm: 58, stockStatus: "in_stock" },
      { id: "p14-v2", sizeLabel: "M", color: "Burgundy", chestCm: 96, lengthCm: 60, stockStatus: "in_stock" },
      { id: "p14-v3", sizeLabel: "L", color: "Camel", chestCm: 102, lengthCm: 62, stockStatus: "low_stock" },
    ],
  },
  {
    id: "p15",
    title: "Cargo Utility Pants",
    brand: "North & Thread",
    price: 95,
    currency: "USD",
    description: "Relaxed cargo pants with multiple pockets and adjustable ankle cuffs. Utilitarian street style.",
    department: "men",
    styleCategories: ["men", "bottoms", "streetwear", "casual"],
    fabricComposition: "100% Cotton Twill",
    careInstructions: "Machine wash cold.",
    images: ["https://source.unsplash.com/600x800/?cargo,pants"],
    variants: [
      { id: "p15-v1", sizeLabel: "M", color: "Khaki", waistCm: 82, lengthCm: 104, stockStatus: "in_stock" },
      { id: "p15-v2", sizeLabel: "L", color: "Black", waistCm: 88, lengthCm: 106, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p16",
    title: "Satin Slip Dress",
    brand: "Lumière Atelier",
    price: 118,
    currency: "USD",
    description: "Bias-cut satin slip dress with delicate straps. Evening elegance with a minimalist edge.",
    department: "women",
    styleCategories: ["women", "dresses", "dress", "evening", "party"],
    fabricComposition: "100% Silk Satin",
    careInstructions: "Dry clean only.",
    images: ["https://source.unsplash.com/600x800/?slip,dress"],
    variants: [
      { id: "p16-v1", sizeLabel: "XS", color: "Champagne", chestCm: 80, lengthCm: 110, stockStatus: "in_stock" },
      { id: "p16-v2", sizeLabel: "S", color: "Black", chestCm: 84, lengthCm: 112, stockStatus: "in_stock" },
      { id: "p16-v3", sizeLabel: "M", color: "Black", chestCm: 88, lengthCm: 114, stockStatus: "low_stock" },
    ],
  },
  {
    id: "p17",
    title: "Running Performance Sneakers",
    brand: "North & Thread",
    price: 135,
    currency: "USD",
    description: "Lightweight mesh running shoes with responsive cushioning. Built for speed and all-day comfort.",
    department: "unisex",
    styleCategories: ["footwear", "sneakers", "running", "athletic"],
    fabricComposition: "Mesh upper, EVA foam sole",
    careInstructions: "Hand wash. Air dry.",
    images: ["https://source.unsplash.com/600x800/?running,shoes"],
    variants: [
      { id: "p17-v1", sizeLabel: "8", color: "White/Blue", stockStatus: "in_stock" },
      { id: "p17-v2", sizeLabel: "9", color: "White/Blue", stockStatus: "in_stock" },
      { id: "p17-v3", sizeLabel: "10", color: "Grey", stockStatus: "in_stock" },
    ],
  },
  {
    id: "p18",
    title: "Kids Colorblock Windbreaker",
    brand: "Velvet Lane",
    price: 58,
    currency: "USD",
    description: "Lightweight windbreaker with bold colorblock panels. Water-resistant fun for active kids.",
    department: "kids",
    styleCategories: ["kids", "outerwear", "jacket", "casual"],
    fabricComposition: "100% Polyester",
    careInstructions: "Machine wash cold.",
    images: ["https://source.unsplash.com/600x800/?kids,jacket"],
    variants: [
      { id: "p18-v1", sizeLabel: "4Y", color: "Blue/Orange", chestCm: 68, lengthCm: 44, stockStatus: "in_stock" },
      { id: "p18-v2", sizeLabel: "6Y", color: "Blue/Orange", chestCm: 72, lengthCm: 48, stockStatus: "in_stock" },
      { id: "p18-v3", sizeLabel: "8Y", color: "Green/Yellow", chestCm: 76, lengthCm: 52, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p19",
    title: "Kids Graphic Hoodie",
    brand: "North & Thread",
    price: 45,
    currency: "USD",
    description: "Soft fleece hoodie with playful graphic print. Cozy essential for school and play.",
    department: "kids",
    styleCategories: ["kids", "hoodie", "casual", "sale"],
    fabricComposition: "60% Cotton, 40% Polyester",
    careInstructions: "Machine wash cold.",
    images: ["https://source.unsplash.com/600x800/?kids,hoodie"],
    variants: [
      { id: "p19-v1", sizeLabel: "4Y", color: "Navy", chestCm: 66, lengthCm: 42, stockStatus: "in_stock" },
      { id: "p19-v2", sizeLabel: "6Y", color: "Red", chestCm: 70, lengthCm: 46, stockStatus: "in_stock" },
      { id: "p19-v3", sizeLabel: "8Y", color: "Navy", chestCm: 74, lengthCm: 50, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p20",
    title: "Fleece Quarter-Zip Pullover",
    brand: "Lumière Atelier",
    price: 68,
    currency: "USD",
    description: "Ultra-soft fleece pullover with quarter-zip collar. Your go-to cozy layer for chilly mornings.",
    department: "unisex",
    styleCategories: ["outerwear", "fleece", "cozy", "casual", "winter"],
    fabricComposition: "100% Polyester Fleece",
    careInstructions: "Machine wash cold. Do not iron.",
    images: ["https://source.unsplash.com/600x800/?fleece,pullover"],
    variants: [
      { id: "p20-v1", sizeLabel: "S", color: "Heather Grey", chestCm: 100, lengthCm: 64, stockStatus: "in_stock" },
      { id: "p20-v2", sizeLabel: "M", color: "Navy", chestCm: 106, lengthCm: 66, stockStatus: "in_stock" },
      { id: "p20-v3", sizeLabel: "L", color: "Heather Grey", chestCm: 112, lengthCm: 68, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p21",
    title: "Leather Belt",
    brand: "Velvet Lane",
    price: 48,
    currency: "USD",
    description: "Classic leather belt with brushed metal buckle. The finishing touch for any outfit.",
    department: "men",
    styleCategories: ["accessories", "men", "workwear"],
    fabricComposition: "100% Genuine Leather",
    careInstructions: "Condition periodically.",
    images: ["https://source.unsplash.com/600x800/?leather,belt"],
    variants: [
      { id: "p21-v1", sizeLabel: "32", color: "Brown", stockStatus: "in_stock" },
      { id: "p21-v2", sizeLabel: "34", color: "Black", stockStatus: "in_stock" },
      { id: "p21-v3", sizeLabel: "36", color: "Brown", stockStatus: "in_stock" },
    ],
  },
  {
    id: "p22",
    title: "Aviator Sunglasses",
    brand: "North & Thread",
    price: 62,
    currency: "USD",
    description: "Timeless aviator frames with UV400 polarized lenses. Cool factor included.",
    department: "unisex",
    styleCategories: ["accessories", "streetwear", "sale"],
    fabricComposition: "Metal frame, polycarbonate lenses",
    careInstructions: "Clean with microfiber cloth.",
    images: ["https://source.unsplash.com/600x800/?sunglasses,fashion"],
    variants: [
      { id: "p22-v1", sizeLabel: "One Size", color: "Gold/Green", stockStatus: "in_stock" },
      { id: "p22-v2", sizeLabel: "One Size", color: "Silver/Blue", stockStatus: "in_stock" },
    ],
  },
  {
    id: "p23",
    title: "Platform Ankle Boots",
    brand: "Velvet Lane",
    price: 148,
    currency: "USD",
    description: "Chunky platform ankle boots with side zip. Statement footwear for bold street looks.",
    department: "women",
    styleCategories: ["footwear", "boots", "women", "streetwear", "new-arrivals"],
    fabricComposition: "Synthetic upper, rubber platform sole",
    careInstructions: "Wipe clean. Store with boot shapers.",
    images: ["https://source.unsplash.com/600x800/?ankle,boots,women"],
    variants: [
      { id: "p23-v1", sizeLabel: "6", color: "Black", stockStatus: "in_stock" },
      { id: "p23-v2", sizeLabel: "7", color: "Black", stockStatus: "in_stock" },
      { id: "p23-v3", sizeLabel: "8", color: "White", stockStatus: "low_stock" },
    ],
  },
  {
    id: "p24",
    title: "Linen Summer Shirt",
    brand: "Lumière Atelier",
    price: 74,
    currency: "USD",
    description: "Breathable linen button-down with relaxed fit. Effortless summer style for warm weekends.",
    department: "men",
    styleCategories: ["men", "tops", "casual", "summer", "sale"],
    fabricComposition: "100% European Linen",
    careInstructions: "Machine wash gentle. Line dry.",
    images: ["https://source.unsplash.com/600x800/?linen,shirt,men"],
    variants: [
      { id: "p24-v1", sizeLabel: "S", color: "White", chestCm: 104, lengthCm: 72, stockStatus: "in_stock" },
      { id: "p24-v2", sizeLabel: "M", color: "Sky Blue", chestCm: 110, lengthCm: 74, stockStatus: "in_stock" },
      { id: "p24-v3", sizeLabel: "L", color: "White", chestCm: 116, lengthCm: 76, stockStatus: "in_stock" },
    ],
  },
];

products.forEach((product) => {
  product.images = [productImageUrl(product.id)];
});

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
  p13: { merchantId: "m1", lastSyncedAt: "2026-07-23T14:32:00Z" },
  p14: { merchantId: "m2", lastSyncedAt: "2026-07-23T15:10:00Z" },
  p15: { merchantId: "m3", lastSyncedAt: "2026-07-22T09:45:00Z" },
  p16: { merchantId: "m1", lastSyncedAt: "2026-07-23T14:32:00Z" },
  p17: { merchantId: "m2", lastSyncedAt: "2026-07-23T15:10:00Z" },
  p18: { merchantId: "m3", lastSyncedAt: "2026-07-22T09:45:00Z" },
  p19: { merchantId: "m1", lastSyncedAt: "2026-07-23T14:32:00Z" },
  p20: { merchantId: "m2", lastSyncedAt: "2026-07-23T15:10:00Z" },
  p21: { merchantId: "m3", lastSyncedAt: "2026-07-22T09:45:00Z" },
  p22: { merchantId: "m1", lastSyncedAt: "2026-07-23T14:32:00Z" },
  p23: { merchantId: "m2", lastSyncedAt: "2026-07-23T15:10:00Z" },
  p24: { merchantId: "m3", lastSyncedAt: "2026-07-22T09:45:00Z" },
};

export const allProducts: Product[] = products;

export const trendingProducts: Product[] = products.filter((p) =>
  p.styleCategories.includes("new-arrivals")
).concat(products.filter((p) => !p.styleCategories.includes("new-arrivals")).slice(0, 4)).slice(0, 8);

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

export function getProductsByCategory(category: string): Product[] {
  switch (category) {
    case "new-arrivals":
      return products.filter((p) => p.styleCategories.includes("new-arrivals"));
    case "men":
      return products.filter((p) => p.department === "men" || p.styleCategories.includes("men"));
    case "women":
      return products.filter((p) => p.department === "women" || p.styleCategories.includes("women"));
    case "kids":
      return products.filter((p) => p.department === "kids" || p.styleCategories.includes("kids"));
    case "outerwear":
      return products.filter((p) => p.styleCategories.includes("outerwear"));
    case "footwear":
      return products.filter((p) => p.styleCategories.includes("footwear"));
    case "sale":
      return products.filter((p) => p.styleCategories.includes("sale"));
    default:
      return products;
  }
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
