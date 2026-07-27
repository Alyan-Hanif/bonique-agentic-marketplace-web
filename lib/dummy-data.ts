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
    title: "Grey Fleece Pullover Hoodie",
    brand: "North & Thread",
    price: 89,
    currency: "USD",
    description: "Soft grey fleece hoodie with a relaxed fit and kangaroo pocket. An everyday essential for laid-back layering.",
    department: "unisex",
    styleCategories: ["streetwear", "hoodie", "casual", "new-arrivals"],
    fabricComposition: "80% Cotton, 20% Polyester",
    careInstructions: "Machine wash cold. Tumble dry low.",
    images: ["https://source.unsplash.com/600x800/?hoodie,streetwear"],
    variants: [
      { id: "p1-v1", sizeLabel: "S", color: "Grey", chestCm: 112, lengthCm: 70, stockStatus: "in_stock" },
      { id: "p1-v2", sizeLabel: "M", color: "Grey", chestCm: 118, lengthCm: 72, stockStatus: "in_stock" },
      { id: "p1-v3", sizeLabel: "L", color: "Charcoal", chestCm: 124, lengthCm: 74, stockStatus: "low_stock" },
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
    description: "Tailored overcoat in a warm wool blend. A refined cold-weather layer with clean lines and notch lapels.",
    department: "men",
    styleCategories: ["outerwear", "winter", "coat", "workwear", "men"],
    fabricComposition: "70% Wool, 30% Polyester",
    careInstructions: "Dry clean only.",
    images: ["https://source.unsplash.com/600x800/?winter,coat"],
    variants: [
      { id: "p3-v1", sizeLabel: "M", color: "Camel", chestCm: 104, lengthCm: 98, stockStatus: "in_stock" },
      { id: "p3-v2", sizeLabel: "L", color: "Camel", chestCm: 110, lengthCm: 100, stockStatus: "in_stock" },
      { id: "p3-v3", sizeLabel: "XL", color: "Tan", chestCm: 116, lengthCm: 102, stockStatus: "low_stock" },
    ],
  },
  {
    id: "p4",
    title: "Classic Red Canvas Sneakers",
    brand: "North & Thread",
    price: 119,
    currency: "USD",
    description: "Low-profile canvas sneakers with a bold red upper and clean white sole. A streetwear staple for everyday wear.",
    department: "unisex",
    styleCategories: ["footwear", "sneakers", "streetwear", "casual"],
    fabricComposition: "Leather upper, rubber sole",
    careInstructions: "Wipe clean with damp cloth.",
    images: ["https://source.unsplash.com/600x800/?sneakers"],
    variants: [
      { id: "p4-v1", sizeLabel: "8", color: "White/Red", stockStatus: "in_stock" },
      { id: "p4-v2", sizeLabel: "9", color: "White/Red", stockStatus: "in_stock" },
      { id: "p4-v3", sizeLabel: "10", color: "Red", stockStatus: "low_stock" },
      { id: "p4-v4", sizeLabel: "11", color: "Red", stockStatus: "in_stock" },
    ],
  },
  {
    id: "p5",
    title: "Mustard Corduroy Pinafore Dress",
    brand: "Velvet Lane",
    price: 98,
    currency: "USD",
    description: "Retro-inspired corduroy pinafore dress in a rich mustard tone. Perfect for street-style layering over tees or turtlenecks.",
    department: "women",
    styleCategories: ["women", "dresses", "dress", "streetwear", "new-arrivals"],
    fabricComposition: "100% Viscose",
    careInstructions: "Hand wash cold. Hang dry.",
    images: ["https://source.unsplash.com/600x800/?dress,fashion"],
    variants: [
      { id: "p5-v1", sizeLabel: "XS", color: "Mustard", chestCm: 82, waistCm: 64, lengthCm: 118, stockStatus: "in_stock" },
      { id: "p5-v2", sizeLabel: "S", color: "Mustard", chestCm: 86, waistCm: 68, lengthCm: 119, stockStatus: "in_stock" },
      { id: "p5-v3", sizeLabel: "M", color: "Mustard", chestCm: 90, waistCm: 72, lengthCm: 120, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p6",
    title: "Essential White Crew Tee",
    brand: "North & Thread",
    price: 42,
    currency: "USD",
    description: "Clean, minimal crew neck tee in crisp white cotton. The perfect blank canvas for any outfit.",
    department: "unisex",
    styleCategories: ["tops", "casual", "sale"],
    fabricComposition: "100% Organic Cotton",
    careInstructions: "Machine wash cold. Do not bleach.",
    images: ["https://source.unsplash.com/600x800/?tshirt,graphic"],
    variants: [
      { id: "p6-v1", sizeLabel: "S", color: "White", chestCm: 96, lengthCm: 68, stockStatus: "in_stock" },
      { id: "p6-v2", sizeLabel: "M", color: "White", chestCm: 102, lengthCm: 70, stockStatus: "in_stock" },
      { id: "p6-v3", sizeLabel: "L", color: "White", chestCm: 108, lengthCm: 72, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p7",
    title: "Boutique Knit Sweater",
    brand: "Lumière Atelier",
    price: 78,
    currency: "USD",
    description: "Soft brushed knit sweater with a relaxed drape. A cozy layer inspired by classic boutique knitwear.",
    department: "unisex",
    styleCategories: ["knitwear", "tops", "casual", "cozy"],
    fabricComposition: "70% Wool, 30% Acrylic",
    careInstructions: "Machine wash warm. Tumble dry low.",
    images: ["https://source.unsplash.com/600x800/?chinos,men"],
    variants: [
      { id: "p7-v1", sizeLabel: "S", color: "Camel", chestCm: 96, lengthCm: 64, stockStatus: "in_stock" },
      { id: "p7-v2", sizeLabel: "M", color: "Grey", chestCm: 102, lengthCm: 66, stockStatus: "in_stock" },
      { id: "p7-v3", sizeLabel: "L", color: "Navy", chestCm: 108, lengthCm: 68, stockStatus: "low_stock" },
    ],
  },
  {
    id: "p8",
    title: "Yellow Puffer Jacket",
    brand: "North & Thread",
    price: 165,
    currency: "USD",
    description: "Vibrant yellow insulated puffer with a lightweight shell. A bold cold-weather layer that stands out.",
    department: "unisex",
    styleCategories: ["outerwear", "winter", "puffer", "cozy"],
    fabricComposition: "100% Nylon shell, down fill",
    careInstructions: "Machine wash gentle. Tumble dry with tennis balls.",
    images: ["https://source.unsplash.com/600x800/?puffer,jacket"],
    variants: [
      { id: "p8-v1", sizeLabel: "S", color: "Yellow", chestCm: 104, lengthCm: 66, stockStatus: "in_stock" },
      { id: "p8-v2", sizeLabel: "M", color: "Yellow", chestCm: 110, lengthCm: 68, stockStatus: "in_stock" },
      { id: "p8-v3", sizeLabel: "L", color: "Yellow", chestCm: 116, lengthCm: 70, stockStatus: "in_stock" },
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
    title: "Suede Chelsea Boots",
    brand: "Lumière Atelier",
    price: 198,
    currency: "USD",
    description: "Classic suede Chelsea boots with elastic side panels. A timeless smart-casual staple.",
    department: "unisex",
    styleCategories: ["footwear", "boots", "casual", "workwear"],
    fabricComposition: "100% Full-Grain Leather",
    careInstructions: "Condition leather monthly. Use shoe trees.",
    images: ["https://source.unsplash.com/600x800/?chelsea,boots"],
    variants: [
      { id: "p10-v1", sizeLabel: "9", color: "Brown", stockStatus: "in_stock" },
      { id: "p10-v2", sizeLabel: "10", color: "Brown", stockStatus: "in_stock" },
      { id: "p10-v3", sizeLabel: "11", color: "Tan", stockStatus: "low_stock" },
    ],
  },
  {
    id: "p11",
    title: "Slim Fit Suit Blazer",
    brand: "Velvet Lane",
    price: 145,
    currency: "USD",
    description: "Tailored slim-fit blazer in a refined grey wool blend. Sharp enough for the office, polished enough for evening.",
    department: "men",
    styleCategories: ["men", "workwear", "blazer", "office"],
    fabricComposition: "65% Polyester, 35% Viscose",
    careInstructions: "Dry clean recommended.",
    images: ["https://source.unsplash.com/600x800/?blazer,women"],
    variants: [
      { id: "p11-v1", sizeLabel: "38", color: "Grey", chestCm: 96, lengthCm: 72, stockStatus: "in_stock" },
      { id: "p11-v2", sizeLabel: "40", color: "Grey", chestCm: 100, lengthCm: 73, stockStatus: "in_stock" },
      { id: "p11-v3", sizeLabel: "42", color: "Charcoal", chestCm: 104, lengthCm: 74, stockStatus: "in_stock" },
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
    title: "Olive Satin Bomber Jacket",
    brand: "North & Thread",
    price: 134,
    currency: "USD",
    description: "Lightweight satin bomber in an olive green finish. A sporty layer with a sleek, modern silhouette.",
    department: "women",
    styleCategories: ["women", "outerwear", "jacket", "streetwear", "new-arrivals"],
    fabricComposition: "100% Nylon",
    careInstructions: "Spot clean only.",
    images: ["https://source.unsplash.com/600x800/?bomber,jacket"],
    variants: [
      { id: "p13-v1", sizeLabel: "S", color: "Olive", chestCm: 100, lengthCm: 62, stockStatus: "in_stock" },
      { id: "p13-v2", sizeLabel: "M", color: "Olive", chestCm: 106, lengthCm: 64, stockStatus: "in_stock" },
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
      { id: "p14-v1", sizeLabel: "S", color: "Cream", chestCm: 90, lengthCm: 58, stockStatus: "in_stock" },
      { id: "p14-v2", sizeLabel: "M", color: "Cream", chestCm: 96, lengthCm: 60, stockStatus: "in_stock" },
      { id: "p14-v3", sizeLabel: "L", color: "Beige", chestCm: 102, lengthCm: 62, stockStatus: "low_stock" },
    ],
  },
  {
    id: "p15",
    title: "Urban Streetwear Set",
    brand: "North & Thread",
    price: 95,
    currency: "USD",
    description: "Coordinated streetwear look with relaxed proportions and earthy tones. Built for city exploration.",
    department: "unisex",
    styleCategories: ["streetwear", "casual", "new-arrivals"],
    fabricComposition: "100% Cotton Twill",
    careInstructions: "Machine wash cold.",
    images: ["https://source.unsplash.com/600x800/?cargo,pants"],
    variants: [
      { id: "p15-v1", sizeLabel: "S", color: "Rust", chestCm: 100, lengthCm: 68, stockStatus: "in_stock" },
      { id: "p15-v2", sizeLabel: "M", color: "Rust", chestCm: 106, lengthCm: 70, stockStatus: "in_stock" },
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
      { id: "p16-v1", sizeLabel: "XS", color: "White", chestCm: 80, lengthCm: 110, stockStatus: "in_stock" },
      { id: "p16-v2", sizeLabel: "S", color: "White", chestCm: 84, lengthCm: 112, stockStatus: "in_stock" },
      { id: "p16-v3", sizeLabel: "M", color: "Ivory", chestCm: 88, lengthCm: 114, stockStatus: "low_stock" },
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
      { id: "p17-v1", sizeLabel: "8", color: "Red/White", stockStatus: "in_stock" },
      { id: "p17-v2", sizeLabel: "9", color: "Red/White", stockStatus: "in_stock" },
      { id: "p17-v3", sizeLabel: "10", color: "Red/White", stockStatus: "in_stock" },
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
    title: "Relaxed Denim Shirt",
    brand: "North & Thread",
    price: 45,
    currency: "USD",
    description: "Easy-wearing denim shirt with a relaxed fit and classic collar. Layer over tees or wear buttoned up.",
    department: "women",
    styleCategories: ["women", "tops", "denim", "casual", "sale"],
    fabricComposition: "100% Cotton Denim",
    careInstructions: "Machine wash cold.",
    images: ["https://source.unsplash.com/600x800/?kids,hoodie"],
    variants: [
      { id: "p19-v1", sizeLabel: "XS", color: "Light Denim", chestCm: 88, lengthCm: 62, stockStatus: "in_stock" },
      { id: "p19-v2", sizeLabel: "S", color: "Light Denim", chestCm: 92, lengthCm: 64, stockStatus: "in_stock" },
      { id: "p19-v3", sizeLabel: "M", color: "Medium Denim", chestCm: 96, lengthCm: 66, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p20",
    title: "Black Zip-Up Hoodie",
    brand: "Lumière Atelier",
    price: 68,
    currency: "USD",
    description: "Sleek black zip-up hoodie with a modern streetwear cut. Layer it open or zip it up for a clean urban look.",
    department: "unisex",
    styleCategories: ["streetwear", "hoodie", "casual", "new-arrivals"],
    fabricComposition: "80% Cotton, 20% Polyester",
    careInstructions: "Machine wash cold. Do not iron.",
    images: ["https://source.unsplash.com/600x800/?fleece,pullover"],
    variants: [
      { id: "p20-v1", sizeLabel: "S", color: "Black", chestCm: 100, lengthCm: 64, stockStatus: "in_stock" },
      { id: "p20-v2", sizeLabel: "M", color: "Black", chestCm: 106, lengthCm: 66, stockStatus: "in_stock" },
      { id: "p20-v3", sizeLabel: "L", color: "Charcoal", chestCm: 112, lengthCm: 68, stockStatus: "in_stock" },
    ],
  },
  {
    id: "p21",
    title: "Leather Belt & Watch Set",
    brand: "Velvet Lane",
    price: 48,
    currency: "USD",
    description: "Curated accessories set with a genuine leather belt and classic timepiece. A polished finishing touch for any outfit.",
    department: "unisex",
    styleCategories: ["accessories", "belts", "watches", "workwear"],
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
    title: "Classic Henley Long Sleeve",
    brand: "Velvet Lane",
    price: 54,
    currency: "USD",
    description: "Soft cotton henley with a three-button placket and relaxed fit. A versatile casual staple for everyday wear.",
    department: "men",
    styleCategories: ["men", "tops", "casual", "basics", "new-arrivals"],
    fabricComposition: "100% Cotton",
    careInstructions: "Machine wash cold. Tumble dry low.",
    images: ["https://source.unsplash.com/600x800/?ankle,boots,women"],
    variants: [
      { id: "p23-v1", sizeLabel: "S", color: "Heather Grey", chestCm: 96, lengthCm: 70, stockStatus: "in_stock" },
      { id: "p23-v2", sizeLabel: "M", color: "Heather Grey", chestCm: 102, lengthCm: 72, stockStatus: "in_stock" },
      { id: "p23-v3", sizeLabel: "L", color: "Charcoal", chestCm: 108, lengthCm: 74, stockStatus: "low_stock" },
    ],
  },
  {
    id: "p24",
    title: "Relaxed White Oxford Shirt",
    brand: "Lumière Atelier",
    price: 74,
    currency: "USD",
    description: "Effortless white oxford shirt with a loose, breezy fit. A minimalist wardrobe essential for warm-weather styling.",
    department: "women",
    styleCategories: ["women", "tops", "shirts", "casual", "sale"],
    fabricComposition: "100% Cotton",
    careInstructions: "Machine wash gentle. Line dry.",
    images: ["https://source.unsplash.com/600x800/?linen,shirt,men"],
    variants: [
      { id: "p24-v1", sizeLabel: "XS", color: "White", chestCm: 88, lengthCm: 68, stockStatus: "in_stock" },
      { id: "p24-v2", sizeLabel: "S", color: "White", chestCm: 92, lengthCm: 70, stockStatus: "in_stock" },
      { id: "p24-v3", sizeLabel: "M", color: "Ivory", chestCm: 96, lengthCm: 72, stockStatus: "in_stock" },
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
