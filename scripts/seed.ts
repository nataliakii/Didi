import "dotenv/config";

import {
  DEMO_CATEGORY_IMAGES,
  DEMO_DIAMOND_IMAGES,
  DEMO_PRODUCT_VARIANT_IMAGES,
  DEMO_RING_IMAGES,
  DEMO_SETTING_IMAGES,
  demoImage,
} from "@/constants/demo-images";
import { connectDB } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import { Appointment } from "@/models/Appointment";
import { Category } from "@/models/Category";
import { Diamond } from "@/models/Diamond";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { RingSetting } from "@/models/RingSetting";
import { User } from "@/models/User";
import { createHash } from "crypto";

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

async function seed() {
  console.log("Connecting to MongoDB...");
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Diamond.deleteMany({}),
    RingSetting.deleteMany({}),
    Order.deleteMany({}),
    Appointment.deleteMany({}),
  ]);

  console.log("Creating admin user...");
  await User.create({
    name: "Admin User",
    email: "admin@didi.com",
    passwordHash: hashPassword("admin123"),
    role: "super_admin",
    isActive: true,
  });

  console.log("Creating categories...");
  await Category.insertMany([
    {
      name: "Loose Diamonds",
      slug: "loose-diamonds",
      description: "Certified loose diamonds, selected one at a time.",
      image: DEMO_CATEGORY_IMAGES.looseDiamonds,
      isActive: true,
    },
    {
      name: "Engagement Rings",
      slug: "engagement-rings",
      description: "Diamond engagement rings and solitaire styles.",
      image: DEMO_CATEGORY_IMAGES.engagementRings,
      isActive: true,
    },
    {
      name: "Diamond Rings",
      slug: "diamond-rings",
      description: "Refined diamond ring styles for meaningful moments.",
      image: DEMO_CATEGORY_IMAGES.diamondRings,
      isActive: true,
    },
    {
      name: "Signature Solitaires",
      slug: "signature-solitaires",
      description: "Quiet, timeless solitaire diamond rings.",
      image: DEMO_CATEGORY_IMAGES.signatureSolitaires,
      isActive: true,
    },
    {
      name: "Oval Cut Diamonds",
      slug: "oval-cut-diamonds",
      description: "Elegant oval diamonds with soft, elongated brilliance.",
      image: DEMO_CATEGORY_IMAGES.ovalCut,
      isActive: true,
    },
    {
      name: "Round Brilliant Diamonds",
      slug: "round-brilliant-diamonds",
      description: "Classic round brilliant diamonds with exceptional fire.",
      image: DEMO_CATEGORY_IMAGES.roundBrilliant,
      isActive: true,
    },
    {
      name: "Emerald Cut Diamonds",
      slug: "emerald-cut-diamonds",
      description: "Architectural emerald cut diamonds with quiet sophistication.",
      image: DEMO_CATEGORY_IMAGES.emeraldCut,
      isActive: true,
    },
    {
      name: "Custom Ring Settings",
      slug: "custom-ring-settings",
      description: "Settings for the ring builder — separate from your diamond.",
      image: DEMO_CATEGORY_IMAGES.ringSettings,
      isActive: true,
    },
  ]);

  const categories = await Category.find();
  const engagementCategory = categories.find((c) => c.slug === "engagement-rings")!;
  const solitaireCategory = categories.find((c) => c.slug === "signature-solitaires")!;
  const diamondRingsCategory = categories.find((c) => c.slug === "diamond-rings")!;

  console.log("Creating products...");
  await Product.insertMany([
    {
      name: "Oval Solitaire Diamond Ring",
      slug: "oval-solitaire-diamond-ring",
      sku: "DR-001",
      productType: "engagement-ring",
      categoryId: engagementCategory._id,
      shortDescription: "An oval diamond in a refined four-prong solitaire setting.",
      description:
        "A quietly elegant oval solitaire, crafted to let your diamond speak for itself. Available in platinum and 18k gold.",
      basePrice: 1450,
      salePrice: 1299,
      images: [
        demoImage(DEMO_RING_IMAGES.ovalSolitaire, "Oval Solitaire Diamond Ring"),
      ],
      variants: [
        {
          sku: "DR-001-WG",
          metal: "white-gold",
          price: 1450,
          salePrice: 1299,
          stockQuantity: 2,
          image: DEMO_PRODUCT_VARIANT_IMAGES["white-gold"],
        },
        {
          sku: "DR-001-YG",
          metal: "yellow-gold",
          price: 1420,
          salePrice: 1275,
          stockQuantity: 2,
          image: DEMO_PRODUCT_VARIANT_IMAGES["yellow-gold"],
        },
        {
          sku: "DR-001-PT",
          metal: "platinum",
          price: 1680,
          salePrice: 1495,
          stockQuantity: 2,
          image: DEMO_PRODUCT_VARIANT_IMAGES.platinum,
        },
      ],
      attributes: {
        metal: ["white-gold", "yellow-gold", "platinum"],
        stoneType: "diamond",
        diamondShape: "oval",
        style: "solitaire",
        ringSizes: ["5", "5.5", "6", "6.5", "7", "7.5", "8"],
      },
      stockQuantity: 6,
      availabilityStatus: "made-to-order",
      productionTime: "2–3 weeks",
      isFeatured: true,
      isBestSeller: true,
      isReadyToShip: false,
      status: "published",
    },
    {
      name: "Round Brilliant Diamond Ring",
      slug: "round-brilliant-diamond-ring",
      sku: "DR-002",
      productType: "engagement-ring",
      categoryId: solitaireCategory._id,
      shortDescription: "A classic round brilliant in a signature solitaire setting.",
      description:
        "Timeless round brilliant proportions paired with a clean, low-profile solitaire band — understated and enduring.",
      basePrice: 1380,
      images: [
        demoImage(DEMO_RING_IMAGES.roundSolitaire, "Round Brilliant Diamond Ring"),
      ],
      variants: [
        {
          sku: "DR-002-WG",
          metal: "white-gold",
          price: 1380,
          stockQuantity: 2,
          image: DEMO_PRODUCT_VARIANT_IMAGES["white-gold"],
        },
        {
          sku: "DR-002-PT",
          metal: "platinum",
          price: 1580,
          stockQuantity: 2,
          image: DEMO_PRODUCT_VARIANT_IMAGES.platinum,
        },
      ],
      attributes: {
        metal: ["white-gold", "platinum"],
        stoneType: "diamond",
        diamondShape: "round",
        style: "solitaire",
        ringSizes: ["5", "5.5", "6", "6.5", "7", "7.5", "8"],
      },
      stockQuantity: 4,
      availabilityStatus: "made-to-order",
      productionTime: "2–3 weeks",
      isFeatured: true,
      isBestSeller: false,
      isReadyToShip: false,
      status: "published",
    },
    {
      name: "Emerald Cut Signature Ring",
      slug: "emerald-cut-signature-ring",
      sku: "DR-003",
      productType: "engagement-ring",
      categoryId: diamondRingsCategory._id,
      shortDescription: "An emerald cut diamond in a tailored signature setting.",
      description:
        "Architectural lines and a step-cut diamond create a composed, gallery-worthy ring with calm presence.",
      basePrice: 1680,
      images: [
        demoImage(DEMO_RING_IMAGES.emeraldCut, "Emerald Cut Signature Ring"),
      ],
      variants: [
        {
          sku: "DR-003-WG",
          metal: "white-gold",
          price: 1680,
          stockQuantity: 1,
          image: DEMO_PRODUCT_VARIANT_IMAGES["white-gold"],
        },
        {
          sku: "DR-003-PT",
          metal: "platinum",
          price: 1880,
          stockQuantity: 2,
          image: DEMO_PRODUCT_VARIANT_IMAGES.platinum,
        },
      ],
      attributes: {
        metal: ["white-gold", "platinum"],
        stoneType: "diamond",
        diamondShape: "emerald",
        style: "solitaire",
        ringSizes: ["5", "5.5", "6", "6.5", "7"],
      },
      stockQuantity: 3,
      availabilityStatus: "made-to-order",
      productionTime: "3–4 weeks",
      isFeatured: true,
      isBestSeller: false,
      isReadyToShip: false,
      status: "published",
    },
    {
      name: "Hidden Halo Diamond Ring",
      slug: "hidden-halo-diamond-ring",
      sku: "DR-004",
      productType: "engagement-ring",
      categoryId: engagementCategory._id,
      shortDescription: "A concealed halo that adds brilliance without excess.",
      description:
        "A hidden halo beneath the centre diamond offers subtle radiance — refined, not ornate. Ideal for round and oval centres.",
      basePrice: 1920,
      images: [
        demoImage(DEMO_RING_IMAGES.hiddenHalo, "Hidden Halo Diamond Ring"),
      ],
      variants: [
        {
          sku: "DR-004-WG",
          metal: "white-gold",
          price: 1920,
          stockQuantity: 2,
          image: DEMO_PRODUCT_VARIANT_IMAGES["white-gold"],
        },
        {
          sku: "DR-004-RG",
          metal: "rose-gold",
          price: 1890,
          stockQuantity: 2,
          image: DEMO_PRODUCT_VARIANT_IMAGES["rose-gold"],
        },
        {
          sku: "DR-004-PT",
          metal: "platinum",
          price: 2120,
          stockQuantity: 1,
          image: DEMO_PRODUCT_VARIANT_IMAGES.platinum,
        },
      ],
      attributes: {
        metal: ["white-gold", "rose-gold", "platinum"],
        stoneType: "diamond",
        diamondShape: "round",
        style: "halo",
        ringSizes: ["5", "5.5", "6", "6.5", "7"],
      },
      stockQuantity: 5,
      availabilityStatus: "made-to-order",
      productionTime: "3–4 weeks",
      isFeatured: false,
      isBestSeller: true,
      isReadyToShip: false,
      status: "published",
    },
  ]);

  console.log("Creating diamonds...");
  await Diamond.insertMany([
    {
      diamondType: "natural",
      shape: "round",
      carat: 1.02,
      cut: "Excellent",
      color: "F",
      clarity: "VS1",
      polish: "Excellent",
      symmetry: "Excellent",
      fluorescence: "None",
      certification: {
        lab: "GIA",
        reportNumber: "2141234567",
        reportUrl: "https://www.gia.edu/report-check?reportno=2141234567",
      },
      price: 5200,
      images: [
        demoImage(
          DEMO_DIAMOND_IMAGES.roundBrilliant,
          "1.02 ct Round Brilliant Diamond",
        ),
      ],
      availabilityStatus: "in-stock",
      isActive: true,
    },
    {
      diamondType: "lab",
      shape: "oval",
      carat: 1.5,
      cut: "Excellent",
      color: "E",
      clarity: "VVS2",
      polish: "Excellent",
      symmetry: "Very Good",
      fluorescence: "Faint",
      certification: {
        lab: "IGI",
        reportNumber: "IGI-9876543210",
        reportUrl: "https://www.igi.org/reports",
      },
      price: 3800,
      salePrice: 3499,
      images: [demoImage(DEMO_DIAMOND_IMAGES.oval, "1.50 ct Oval Diamond")],
      availabilityStatus: "in-stock",
      isActive: true,
    },
    {
      diamondType: "natural",
      shape: "emerald",
      carat: 0.92,
      cut: "Very Good",
      color: "G",
      clarity: "VS2",
      polish: "Very Good",
      symmetry: "Very Good",
      fluorescence: "None",
      certification: {
        lab: "GIA",
        reportNumber: "5234567890",
      },
      price: 3400,
      images: [
        demoImage(DEMO_DIAMOND_IMAGES.emeraldCut, "0.92 ct Emerald Cut Diamond"),
      ],
      availabilityStatus: "in-stock",
      isActive: true,
    },
    {
      diamondType: "natural",
      shape: "round",
      carat: 0.78,
      cut: "Excellent",
      color: "H",
      clarity: "VS1",
      polish: "Excellent",
      symmetry: "Excellent",
      fluorescence: "None",
      certification: {
        lab: "GIA",
        reportNumber: "1234567891",
      },
      price: 2450,
      images: [
        demoImage(
          DEMO_DIAMOND_IMAGES.roundBrilliant,
          "0.78 ct Round Brilliant Diamond",
        ),
      ],
      availabilityStatus: "in-stock",
      isActive: true,
    },
  ]);

  console.log("Creating ring settings...");
  await RingSetting.insertMany([
    {
      name: "Classic Solitaire Setting",
      slug: "classic-solitaire-setting",
      style: "solitaire",
      basePrice: 820,
      description:
        "A timeless four-prong solitaire — clean lines, maximum light, quiet presence.",
      images: [
        demoImage(DEMO_SETTING_IMAGES.classicSolitaire, "Classic Solitaire Setting"),
      ],
      availableMetals: ["white-gold", "yellow-gold", "rose-gold", "platinum"],
      compatibleDiamondShapes: ["round", "oval", "cushion"],
      minRingSize: "3",
      maxRingSize: "11",
      productionTime: "2–3 weeks",
      status: "published",
      isFeatured: true,
    },
    {
      name: "Hidden Halo Setting",
      slug: "hidden-halo-setting",
      style: "halo",
      basePrice: 1180,
      description:
        "A concealed halo beneath the centre stone — brilliance without visual noise.",
      images: [
        demoImage(DEMO_SETTING_IMAGES.hiddenHalo, "Hidden Halo Setting"),
      ],
      availableMetals: ["white-gold", "rose-gold", "platinum"],
      compatibleDiamondShapes: ["round", "oval"],
      minRingSize: "4",
      maxRingSize: "10",
      productionTime: "3–4 weeks",
      status: "published",
      isFeatured: true,
    },
    {
      name: "Cathedral Setting",
      slug: "cathedral-setting",
      style: "solitaire",
      basePrice: 980,
      description:
        "Graceful cathedral shoulders that elevate the centre diamond with architectural poise.",
      images: [demoImage(DEMO_SETTING_IMAGES.cathedral, "Cathedral Setting")],
      availableMetals: ["white-gold", "platinum"],
      compatibleDiamondShapes: ["emerald", "oval", "asscher"],
      minRingSize: "3",
      maxRingSize: "11",
      productionTime: "2–3 weeks",
      status: "published",
      isFeatured: false,
    },
    {
      name: "Signature Prong Setting",
      slug: "signature-prong-setting",
      style: "solitaire",
      basePrice: 1050,
      description:
        "A refined prong setting with slender lines — the diamond remains the focus.",
      images: [
        demoImage(DEMO_SETTING_IMAGES.signatureProng, "Signature Prong Setting"),
      ],
      availableMetals: ["white-gold", "platinum"],
      compatibleDiamondShapes: ["round", "oval", "cushion", "pear"],
      minRingSize: "3",
      maxRingSize: "11",
      productionTime: "2–3 weeks",
      status: "published",
      isFeatured: false,
    },
  ]);

  console.log("Creating sample order...");
  await Order.create({
    orderNumber: generateOrderNumber(),
    customer: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 555-0100",
    },
    items: [
      {
        itemType: "product",
        quantity: 1,
        unitPrice: 1299,
        totalPrice: 1299,
        snapshot: {
          name: "Oval Solitaire Diamond Ring",
          price: 1299,
          images: [
            demoImage(DEMO_RING_IMAGES.ovalSolitaire, "Oval Solitaire Diamond Ring"),
          ],
          selectedOptions: {
            metal: "platinum",
            ringSize: "6",
          },
        },
      },
    ],
    subtotal: 1299,
    discountTotal: 0,
    shippingTotal: 0,
    taxTotal: 104,
    total: 1403,
    currency: "USD",
    status: "paid",
    paymentStatus: "paid",
    shippingAddress: {
      line1: "123 Main Street",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "US",
    },
  });

  console.log("Creating sample appointment...");
  await Appointment.create({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 555-0200",
    appointmentType: "diamond-consultation",
    preferredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    preferredTime: "14:00",
    budget: "$5,000 - $10,000",
    message:
      "Looking for a round brilliant around 1 carat with GIA report, and guidance on a solitaire setting.",
    status: "requested",
  });

  console.log("\nSeed completed successfully!");
  console.log("\nDemo images: place JPGs under public/images/demo/ (see README.md)");
  console.log("\nAdmin credentials:");
  console.log("  Email: admin@didi.com");
  console.log("  Password: admin123");

  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
