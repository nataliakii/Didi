import "dotenv/config";

import { DEMO_CATEGORY_IMAGES } from "@/constants/demo-images";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

const CATEGORY_IMAGE_BY_SLUG: Record<string, string> = {
  "loose-diamonds": DEMO_CATEGORY_IMAGES.looseDiamonds,
  "engagement-rings": DEMO_CATEGORY_IMAGES.engagementRings,
  "diamond-rings": DEMO_CATEGORY_IMAGES.diamondRings,
  "signature-solitaires": DEMO_CATEGORY_IMAGES.signatureSolitaires,
  "oval-cut-diamonds": DEMO_CATEGORY_IMAGES.ovalCut,
  "round-brilliant-diamonds": DEMO_CATEGORY_IMAGES.roundBrilliant,
  "emerald-cut-diamonds": DEMO_CATEGORY_IMAGES.emeraldCut,
  "custom-ring-settings": DEMO_CATEGORY_IMAGES.ringSettings,
  necklaces: DEMO_CATEGORY_IMAGES.necklaces,
  earrings: DEMO_CATEGORY_IMAGES.earrings,
  bracelets: DEMO_CATEGORY_IMAGES.bracelets,
  "colored-lab-grown-diamonds": DEMO_CATEGORY_IMAGES.coloredLabGrownDiamonds,
};

const PRODUCT_IMAGE_BY_TYPE: Record<string, string> = {
  necklace: DEMO_CATEGORY_IMAGES.necklaces,
  earrings: DEMO_CATEGORY_IMAGES.earrings,
  bracelet: DEMO_CATEGORY_IMAGES.bracelets,
};

async function run() {
  await connectDB();

  for (const [slug, image] of Object.entries(CATEGORY_IMAGE_BY_SLUG)) {
    const result = await Category.updateMany({ slug }, { $set: { image } });
    console.log(`category ${slug}: ${result.modifiedCount} updated`);
  }

  for (const [productType, image] of Object.entries(PRODUCT_IMAGE_BY_TYPE)) {
    const result = await Product.updateMany(
      { productType },
      {
        $set: {
          "images.0.url": image,
          "variants.$[].image": image,
        },
      },
    );
    console.log(`products ${productType}: ${result.modifiedCount} updated`);
  }

  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
