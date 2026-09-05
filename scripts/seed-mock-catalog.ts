/**
 * Upsert the full mock product catalog without wiping orders/appointments.
 * Safe for local Viva / checkout simulation.
 *
 *   npm run seed:mock-catalog
 */
import "dotenv/config";

import {
  DEMO_CATEGORY_IMAGES,
  DEMO_DIAMOND_IMAGES,
  DEMO_RING_IMAGES,
  DEMO_SETTING_IMAGES,
  demoImage,
} from "@/constants/demo-images";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Diamond } from "@/models/Diamond";
import { Product } from "@/models/Product";
import { RingSetting } from "@/models/RingSetting";

async function ensureCategories() {
  const defs = [
    {
      name: "Loose Diamonds",
      slug: "loose-diamonds",
      description: "Certified loose diamonds, selected one at a time.",
      image: DEMO_CATEGORY_IMAGES.looseDiamonds,
    },
    {
      name: "Engagement Rings",
      slug: "engagement-rings",
      description: "Diamond engagement rings designed around the stone.",
      image: DEMO_CATEGORY_IMAGES.engagementRings,
    },
    {
      name: "Diamond Rings",
      slug: "diamond-rings",
      description: "Lab-grown diamond rings from Asteria Diamond House.",
      image: DEMO_CATEGORY_IMAGES.diamondRings,
    },
    {
      name: "Signature Solitaires",
      slug: "signature-solitaires",
      description: "Clean solitaire silhouettes with certified diamonds.",
      image: DEMO_CATEGORY_IMAGES.signatureSolitaires,
    },
    {
      name: "Oval Cut Diamonds",
      slug: "oval-cut-diamonds",
      description: "Oval diamonds for rings and custom designs.",
      image: DEMO_CATEGORY_IMAGES.ovalCut,
    },
    {
      name: "Round Brilliant Diamonds",
      slug: "round-brilliant-diamonds",
      description: "Round brilliant diamonds selected for light return.",
      image: DEMO_CATEGORY_IMAGES.roundBrilliant,
    },
    {
      name: "Emerald Cut Diamonds",
      slug: "emerald-cut-diamonds",
      description: "Emerald-cut diamonds with calm, linear brilliance.",
      image: DEMO_CATEGORY_IMAGES.emeraldCut,
    },
    {
      name: "Custom Ring Settings",
      slug: "custom-ring-settings",
      description: "Settings for the ring builder.",
      image: DEMO_CATEGORY_IMAGES.ringSettings,
    },
    {
      name: "Necklaces",
      slug: "necklaces",
      description: "Lab-grown diamond necklaces from Asteria Diamond House.",
      image: DEMO_CATEGORY_IMAGES.necklaces,
    },
    {
      name: "Earrings",
      slug: "earrings",
      description: "Lab-grown diamond earrings crafted in Thessaloniki.",
      image: DEMO_CATEGORY_IMAGES.earrings,
    },
    {
      name: "Bracelets",
      slug: "bracelets",
      description: "Lab-grown diamond bracelets and tennis styles.",
      image: DEMO_CATEGORY_IMAGES.bracelets,
    },
    {
      name: "Colored Lab-Grown Diamonds",
      slug: "colored-lab-grown-diamonds",
      description: "Blue, yellow, and pink lab-grown diamond jewelry.",
      image: DEMO_CATEGORY_IMAGES.coloredLabGrownDiamonds,
    },
  ];

  for (const def of defs) {
    await Category.updateOne(
      { slug: def.slug },
      {
        $set: {
          name: def.name,
          description: def.description,
          image: def.image,
          isActive: true,
        },
        $setOnInsert: { slug: def.slug },
      },
      { upsert: true },
    );
  }

  return Category.find({}).lean();
}

async function run() {
  console.log("Connecting…");
  await connectDB();

  console.log("Ensuring categories…");
  const categories = await ensureCategories();
  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const diamondRingsCategory = bySlug["diamond-rings"];
  const necklacesCategory = bySlug.necklaces;
  const earringsCategory = bySlug.earrings;
  const braceletsCategory = bySlug.bracelets;
  const coloredCategory = bySlug["colored-lab-grown-diamonds"];
  const engagementCategory = bySlug["engagement-rings"];

  if (
    !diamondRingsCategory ||
    !necklacesCategory ||
    !earringsCategory ||
    !braceletsCategory ||
    !coloredCategory ||
    !engagementCategory
  ) {
    throw new Error("Required categories missing after upsert.");
  }

  const products = [
    {
      sku: "WR-001",
      name: "Classic Lab-Grown Wedding Band",
      slug: "classic-lab-grown-wedding-band",
      productType: "wedding-ring" as const,
      categoryId: diamondRingsCategory._id,
      shortDescription: "A refined plain wedding band for everyday wear.",
      description:
        "Lab-grown diamond house wedding band — quiet, precise, made for Greece and EU delivery.",
      basePrice: 680,
      images: [
        demoImage(DEMO_CATEGORY_IMAGES.diamondRings, "Classic Lab-Grown Wedding Band"),
      ],
      variants: [
        {
          sku: "WR-001-WG",
          metal: "white-gold",
          price: 680,
          stockQuantity: 5,
          image: DEMO_CATEGORY_IMAGES.diamondRings,
        },
        {
          sku: "WR-001-YG",
          metal: "yellow-gold",
          price: 660,
          stockQuantity: 4,
          image: DEMO_CATEGORY_IMAGES.diamondRings,
        },
      ],
      attributes: {
        metal: ["white-gold", "yellow-gold", "platinum"],
        goldPurity: "18k",
        stoneType: "none",
        isLabGrown: false,
        style: "solitaire",
        ringSizes: ["5", "5.5", "6", "6.5", "7", "7.5", "8"],
        customSizeAvailable: true,
        shipsTo: "greece-eu",
      },
      stockQuantity: 11,
      availabilityStatus: "in-stock",
      productionTime: "1–2 weeks",
      isFeatured: true,
      isBestSeller: true,
      isReadyToShip: true,
      status: "published",
    },
    {
      sku: "WR-002",
      name: "Pavé Lab-Grown Wedding Band",
      slug: "pave-lab-grown-wedding-band",
      productType: "wedding-ring" as const,
      categoryId: diamondRingsCategory._id,
      shortDescription: "A slender pavé wedding band with lab-grown diamonds.",
      description:
        "Wedding ring with a continuous pavé of lab-grown diamonds — designed in Thessaloniki.",
      basePrice: 1180,
      images: [demoImage(DEMO_CATEGORY_IMAGES.pave, "Pavé Lab-Grown Wedding Band")],
      variants: [
        {
          sku: "WR-002-WG",
          metal: "white-gold",
          price: 1180,
          stockQuantity: 3,
          image: DEMO_CATEGORY_IMAGES.pave,
        },
      ],
      attributes: {
        metal: ["white-gold", "rose-gold"],
        goldPurity: "18k",
        stoneType: "lab-grown-diamond",
        isLabGrown: true,
        diamondShape: "round",
        diamondColor: "colorless",
        diamondCarat: 0.35,
        style: "pave",
        ringSizes: ["5", "5.5", "6", "6.5", "7"],
        customSizeAvailable: true,
        shipsTo: "greece-eu",
        certification: { lab: "IGI", reportNumber: "LG12345040" },
      },
      stockQuantity: 5,
      availabilityStatus: "made-to-order",
      productionTime: "2–3 weeks",
      isFeatured: false,
      isBestSeller: false,
      isReadyToShip: false,
      status: "published",
    },
    {
      sku: "CJ-001",
      name: "Custom Lab-Grown Pendant Study",
      slug: "custom-lab-grown-pendant-study",
      productType: "custom-jewellery" as const,
      categoryId: necklacesCategory._id,
      shortDescription: "A starting point for bespoke lab-grown diamond jewellery.",
      description:
        "Custom jewellery concept with a lab-grown diamond — book a consultation to refine metal, shape, and proportions.",
      basePrice: 1500,
      images: [
        demoImage(DEMO_CATEGORY_IMAGES.necklaces, "Custom Lab-Grown Pendant Study"),
      ],
      variants: [
        {
          sku: "CJ-001-WG",
          metal: "white-gold",
          price: 1500,
          stockQuantity: 1,
          image: DEMO_CATEGORY_IMAGES.necklaces,
        },
      ],
      attributes: {
        metal: ["white-gold", "yellow-gold", "rose-gold", "platinum"],
        goldPurity: "18k",
        stoneType: "lab-grown-diamond",
        isLabGrown: true,
        diamondShape: "oval",
        diamondColor: "colorless",
        diamondCarat: 0.7,
        customStoneAvailable: true,
        shipsTo: "greece-eu",
      },
      stockQuantity: 1,
      availabilityStatus: "made-to-order",
      productionTime: "4–6 weeks",
      isFeatured: false,
      isBestSeller: false,
      isReadyToShip: false,
      status: "published",
    },
    {
      sku: "TEST-VIVA-01",
      name: "Viva Checkout Test Pendant",
      slug: "viva-checkout-test-pendant",
      productType: "necklace" as const,
      categoryId: necklacesCategory._id,
      shortDescription: "€1 mock item for end-to-end Viva / checkout testing.",
      description:
        "Internal test product for simulating checkout and Viva payment flows. Safe low amount above the Viva minimum.",
      basePrice: 1,
      images: [
        demoImage(DEMO_CATEGORY_IMAGES.necklaces, "Viva Checkout Test Pendant"),
      ],
      variants: [
        {
          sku: "TEST-VIVA-01-WG",
          metal: "white-gold",
          price: 1,
          stockQuantity: 99,
          image: DEMO_CATEGORY_IMAGES.necklaces,
        },
      ],
      attributes: {
        metal: ["white-gold"],
        goldPurity: "18k",
        stoneType: "lab-grown-diamond",
        isLabGrown: true,
        diamondShape: "round",
        diamondColor: "colorless",
        diamondCarat: 0.01,
        shipsTo: "greece-eu",
      },
      stockQuantity: 99,
      availabilityStatus: "in-stock",
      productionTime: "Ready",
      isFeatured: false,
      isBestSeller: false,
      isReadyToShip: true,
      status: "published",
    },
    {
      sku: "TEST-VIVA-02",
      name: "Viva Checkout Test Studs",
      slug: "viva-checkout-test-studs",
      productType: "earrings" as const,
      categoryId: earringsCategory._id,
      shortDescription: "€1 mock earrings for checkout / Viva payment testing.",
      description:
        "Internal test product for cart, shipping, and payment simulation across jewellery types.",
      basePrice: 1,
      images: [
        demoImage(DEMO_CATEGORY_IMAGES.earrings, "Viva Checkout Test Studs"),
      ],
      variants: [
        {
          sku: "TEST-VIVA-02-WG",
          metal: "white-gold",
          price: 1,
          stockQuantity: 99,
          image: DEMO_CATEGORY_IMAGES.earrings,
        },
      ],
      attributes: {
        metal: ["white-gold"],
        goldPurity: "18k",
        stoneType: "lab-grown-diamond",
        isLabGrown: true,
        diamondShape: "round",
        diamondColor: "colorless",
        diamondCarat: 0.02,
        shipsTo: "greece-eu",
      },
      stockQuantity: 99,
      availabilityStatus: "in-stock",
      productionTime: "Ready",
      isFeatured: false,
      isBestSeller: false,
      isReadyToShip: true,
      status: "published",
    },
    {
      sku: "NK-001",
      name: "Lab-Grown Diamond Pendant Necklace",
      slug: "lab-grown-diamond-pendant-necklace",
      productType: "necklace" as const,
      categoryId: necklacesCategory._id,
      shortDescription: "A luminous lab-grown diamond pendant on a fine chain.",
      description:
        "Lab-grown diamond necklace from Asteria Diamond House — light at the collarbone, crafted in Greece.",
      basePrice: 980,
      images: [
        demoImage(DEMO_CATEGORY_IMAGES.necklaces, "Lab-Grown Diamond Pendant Necklace"),
      ],
      variants: [
        {
          sku: "NK-001-WG",
          metal: "white-gold",
          price: 980,
          stockQuantity: 3,
          image: DEMO_CATEGORY_IMAGES.necklaces,
        },
      ],
      attributes: {
        metal: ["white-gold", "yellow-gold"],
        goldPurity: "18k",
        stoneType: "lab-grown-diamond",
        isLabGrown: true,
        diamondShape: "round",
        diamondColor: "colorless",
        diamondCarat: 0.5,
        shipsTo: "greece-eu",
        certification: { lab: "IGI", reportNumber: "LG12345010" },
      },
      stockQuantity: 5,
      availabilityStatus: "in-stock",
      productionTime: "1–2 weeks",
      isFeatured: true,
      isBestSeller: true,
      isReadyToShip: true,
      status: "published",
    },
    {
      sku: "ER-001",
      name: "Lab-Grown Diamond Stud Earrings",
      slug: "lab-grown-diamond-stud-earrings",
      productType: "earrings" as const,
      categoryId: earringsCategory._id,
      shortDescription: "Classic lab-grown diamond studs for every day.",
      description:
        "Lab-grown diamond earrings from Asteria — quiet brilliance, clear specifications, made in Greece.",
      basePrice: 720,
      images: [
        demoImage(DEMO_CATEGORY_IMAGES.earrings, "Lab-Grown Diamond Stud Earrings"),
      ],
      variants: [
        {
          sku: "ER-001-WG",
          metal: "white-gold",
          price: 720,
          stockQuantity: 4,
          image: DEMO_CATEGORY_IMAGES.earrings,
        },
      ],
      attributes: {
        metal: ["white-gold", "platinum"],
        goldPurity: "18k",
        stoneType: "lab-grown-diamond",
        isLabGrown: true,
        diamondShape: "round",
        diamondColor: "colorless",
        diamondCarat: 0.4,
        shipsTo: "greece-eu",
        certification: { lab: "IGI", reportNumber: "LG12345020" },
      },
      stockQuantity: 6,
      availabilityStatus: "in-stock",
      productionTime: "1–2 weeks",
      isFeatured: true,
      isBestSeller: true,
      isReadyToShip: true,
      status: "published",
    },
    {
      sku: "BR-001",
      name: "Lab-Grown Tennis Bracelet",
      slug: "lab-grown-tennis-bracelet",
      productType: "bracelet" as const,
      categoryId: braceletsCategory._id,
      shortDescription: "A continuous line of lab-grown diamonds.",
      description:
        "Lab-grown diamond bracelet from Asteria Diamond House — refined for Greece and EU delivery.",
      basePrice: 3200,
      images: [
        demoImage(DEMO_CATEGORY_IMAGES.bracelets, "Lab-Grown Tennis Bracelet"),
      ],
      variants: [
        {
          sku: "BR-001-WG",
          metal: "white-gold",
          price: 3200,
          stockQuantity: 2,
          image: DEMO_CATEGORY_IMAGES.bracelets,
        },
      ],
      attributes: {
        metal: ["white-gold", "yellow-gold"],
        goldPurity: "18k",
        stoneType: "lab-grown-diamond",
        isLabGrown: true,
        diamondShape: "round",
        diamondColor: "colorless",
        diamondCarat: 2.0,
        shipsTo: "greece-eu",
        certification: { lab: "IGI", reportNumber: "LG12345030" },
      },
      stockQuantity: 3,
      availabilityStatus: "made-to-order",
      productionTime: "3–4 weeks",
      isFeatured: true,
      isBestSeller: true,
      isReadyToShip: false,
      status: "published",
    },
    {
      sku: "DR-OVAL-001",
      name: "Oval Solitaire Diamond Ring",
      slug: "oval-solitaire-diamond-ring",
      productType: "engagement-ring" as const,
      categoryId: engagementCategory._id,
      shortDescription: "An oval solitaire set for quiet brilliance.",
      description: "Oval solitaire engagement ring from Asteria Diamond House.",
      basePrice: 1450,
      images: [
        demoImage(DEMO_RING_IMAGES.ovalSolitaire, "Oval Solitaire Diamond Ring"),
      ],
      variants: [
        {
          sku: "DR-OVAL-001-PT",
          metal: "platinum",
          price: 1450,
          stockQuantity: 2,
          image: DEMO_RING_IMAGES.ovalSolitaire,
        },
      ],
      attributes: {
        metal: ["platinum", "white-gold", "yellow-gold"],
        goldPurity: "18k",
        stoneType: "lab-grown-diamond",
        isLabGrown: true,
        diamondShape: "oval",
        diamondColor: "colorless",
        diamondCarat: 1.0,
        style: "solitaire",
        ringSizes: ["5", "5.5", "6", "6.5", "7"],
        shipsTo: "greece-eu",
      },
      stockQuantity: 4,
      availabilityStatus: "in-stock",
      productionTime: "2–3 weeks",
      isFeatured: true,
      isBestSeller: true,
      isReadyToShip: true,
      status: "published",
    },
  ];

  console.log("Upserting products…");
  for (const product of products) {
    await Product.updateOne(
      { $or: [{ sku: product.sku }, { slug: product.slug }] },
      { $set: product },
      { upsert: true },
    );
    console.log(`  product ${product.sku}`);
  }

  const diamondCount = await Diamond.countDocuments();
  if (diamondCount === 0) {
    console.log("No diamonds found — inserting a starter loose diamond…");
    await Diamond.create({
      diamondType: "lab",
      shape: "round",
      carat: 1.0,
      cut: "Ideal",
      color: "F",
      clarity: "VS1",
      polish: "Excellent",
      symmetry: "Excellent",
      fluorescence: "None",
      price: 2100,
      images: [
        demoImage(DEMO_DIAMOND_IMAGES.roundBrilliant, "1.00 ct Round Lab Diamond"),
      ],
      availabilityStatus: "in-stock",
      isActive: true,
    });
  }

  const settingCount = await RingSetting.countDocuments();
  if (settingCount === 0) {
    console.log("No ring settings found — inserting a starter setting…");
    await RingSetting.create({
      name: "Classic Solitaire Setting",
      slug: "classic-solitaire-setting",
      style: "solitaire",
      basePrice: 650,
      availableMetals: ["white-gold", "yellow-gold", "platinum"],
      compatibleDiamondShapes: ["round", "oval", "cushion", "pear"],
      images: [
        demoImage(DEMO_SETTING_IMAGES.classicSolitaire, "Classic Solitaire Setting"),
      ],
      status: "published",
      isFeatured: true,
    });
  }

  const counts = {
    categories: await Category.countDocuments(),
    products: await Product.countDocuments(),
    diamonds: await Diamond.countDocuments(),
    settings: await RingSetting.countDocuments(),
  };

  console.log("\nMock catalog ready:");
  console.log(counts);
  console.log("\nTest products for Viva simulation:");
  console.log("  /en/products/viva-checkout-test-pendant  (€1)");
  console.log("  /en/products/viva-checkout-test-studs    (€1)");
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
