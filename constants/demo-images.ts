/**
 * Local demo/seed image paths for Asteria Diamond House.
 * Files live under public/images/demo/ — replace JPGs without changing code.
 *
 * Until real JPGs are added, leave NEXT_PUBLIC_DEMO_ASSETS_READY unset so the UI
 * shows styled placeholders instead of requesting missing files.
 */
export const DEMO_ASSETS_READY =
  process.env.NEXT_PUBLIC_DEMO_ASSETS_READY === "true";

const DEMO_IMAGE_PREFIX = "/images/demo/";

export function isDemoImagePath(path?: string | null): boolean {
  return Boolean(path?.trim().startsWith(DEMO_IMAGE_PREFIX));
}

/** Use ivory UI placeholder instead of loading a missing demo JPG. */
export function shouldUseDemoPlaceholder(path?: string | null): boolean {
  const trimmed = path?.trim();
  if (!trimmed) return true;
  return isDemoImagePath(trimmed) && !DEMO_ASSETS_READY;
}

export const DEMO_HERO_IMAGES = {
  diamondMinimal: "/images/demo/hero/hero-diamond-minimal.jpg",
  solitaireRing: "/images/demo/hero/hero-solitaire-ring.jpg",
} as const;

export const DEMO_DIAMOND_IMAGES = {
  roundBrilliant: "/images/demo/diamonds/round-brilliant-diamond.jpg",
  oval: "/images/demo/diamonds/oval-diamond.jpg",
  emeraldCut: "/images/demo/diamonds/emerald-cut-diamond.jpg",
  pear: "/images/demo/diamonds/pear-diamond.jpg",
} as const;

export const DEMO_RING_IMAGES = {
  ovalSolitaire: "/images/demo/rings/oval-solitaire-ring.jpg",
  roundSolitaire: "/images/demo/rings/round-solitaire-ring.jpg",
  emeraldCut: "/images/demo/rings/emerald-cut-ring.jpg",
  hiddenHalo: "/images/demo/rings/hidden-halo-ring.jpg",
} as const;

export const DEMO_SETTING_IMAGES = {
  classicSolitaire: "/images/demo/settings/classic-solitaire-setting.jpg",
  hiddenHalo: "/images/demo/settings/hidden-halo-setting.jpg",
  cathedral: "/images/demo/settings/cathedral-setting.jpg",
  signatureProng: "/images/demo/settings/signature-prong-setting.jpg",
} as const;

export const DEMO_CONSULTATION_IMAGES = {
  privateDiamond: "/images/demo/consultation/private-diamond-consultation.jpg",
  ringDesign: "/images/demo/consultation/ring-design-consultation.jpg",
} as const;

export const DEMO_PLACEHOLDER_IMAGES = {
  diamond: "/images/demo/placeholders/diamond-placeholder.jpg",
  ring: "/images/demo/placeholders/ring-placeholder.jpg",
  setting: "/images/demo/placeholders/setting-placeholder.jpg",
} as const;

/** Ring builder step cards — replace JPGs in public/images/demo/create-ring/ */
export const DEMO_CREATE_RING_IMAGES = {
  diamond: "/images/demo/create-ring/create-ring-diamond.jpg",
  setting: "/images/demo/create-ring/create-ring-setting.jpg",
  metal: "/images/demo/create-ring/create-ring-metal.jpg",
  review: "/images/demo/create-ring/create-ring-review.jpg",
} as const;

/** Per-metal product variant images — replace JPGs in public/images/demo/products/ */
export const DEMO_PRODUCT_VARIANT_IMAGES = {
  "yellow-gold": "/images/demo/products/product-solitaire-yellow-gold.jpg",
  "white-gold": "/images/demo/products/product-solitaire-white-gold.jpg",
  "rose-gold": "/images/demo/products/product-solitaire-rose-gold.jpg",
  platinum: "/images/demo/products/product-solitaire-platinum.jpg",
} as const;

/** Category cards in seed — mapped to diamond/ring demo assets */
export const DEMO_CATEGORY_IMAGES = {
  looseDiamonds: DEMO_DIAMOND_IMAGES.roundBrilliant,
  engagementRings: DEMO_RING_IMAGES.ovalSolitaire,
  diamondRings: DEMO_RING_IMAGES.roundSolitaire,
  signatureSolitaires: DEMO_RING_IMAGES.roundSolitaire,
  ovalCut: DEMO_DIAMOND_IMAGES.oval,
  roundBrilliant: DEMO_DIAMOND_IMAGES.roundBrilliant,
  emeraldCut: DEMO_DIAMOND_IMAGES.emeraldCut,
  ringSettings: DEMO_SETTING_IMAGES.classicSolitaire,
} as const;

/** Convenience map for components that used the previous DEMO_IMAGES shape */
export const DEMO_IMAGES = {
  hero: {
    diamond: DEMO_HERO_IMAGES.diamondMinimal,
    solitaire: DEMO_HERO_IMAGES.solitaireRing,
  },
  diamond: {
    round: DEMO_DIAMOND_IMAGES.roundBrilliant,
    oval: DEMO_DIAMOND_IMAGES.oval,
    emerald: DEMO_DIAMOND_IMAGES.emeraldCut,
    pear: DEMO_DIAMOND_IMAGES.pear,
  },
  ring: {
    ovalSolitaire: DEMO_RING_IMAGES.ovalSolitaire,
    roundSolitaire: DEMO_RING_IMAGES.roundSolitaire,
    solitaire: DEMO_RING_IMAGES.ovalSolitaire,
    halo: DEMO_RING_IMAGES.hiddenHalo,
    emerald: DEMO_RING_IMAGES.emeraldCut,
  },
  setting: {
    classicSolitaire: DEMO_SETTING_IMAGES.classicSolitaire,
    hiddenHalo: DEMO_SETTING_IMAGES.hiddenHalo,
    cathedral: DEMO_SETTING_IMAGES.cathedral,
    signatureProng: DEMO_SETTING_IMAGES.signatureProng,
  },
  consultation: {
    private: DEMO_CONSULTATION_IMAGES.privateDiamond,
    ringDesign: DEMO_CONSULTATION_IMAGES.ringDesign,
  },
  createRing: DEMO_CREATE_RING_IMAGES,
  productVariants: DEMO_PRODUCT_VARIANT_IMAGES,
  categories: DEMO_CATEGORY_IMAGES,
  fallback: {
    product: DEMO_PLACEHOLDER_IMAGES.ring,
    category: DEMO_PLACEHOLDER_IMAGES.diamond,
    setting: DEMO_PLACEHOLDER_IMAGES.setting,
    diamond: DEMO_PLACEHOLDER_IMAGES.diamond,
    ring: DEMO_PLACEHOLDER_IMAGES.ring,
  },
} as const;

export type DemoPlaceholderKind = "diamond" | "ring" | "setting";

/**
 * Standardize demo image path resolution without filesystem checks.
 * Returns the first non-empty path, or the diamond placeholder.
 */
export function getDemoImage(
  path?: string | null,
  fallback?: string,
): string {
  const trimmed = path?.trim();
  if (trimmed) return trimmed;

  const trimmedFallback = fallback?.trim();
  if (trimmedFallback) return trimmedFallback;

  return DEMO_PLACEHOLDER_IMAGES.diamond;
}

export function getDemoFallback(kind: DemoPlaceholderKind): string {
  return DEMO_PLACEHOLDER_IMAGES[kind];
}

export function demoImage(
  url: string,
  alt: string,
  isPrimary = true,
): { url: string; alt: string; isPrimary: boolean } {
  return { url, alt, isPrimary };
}

type DemoMetal = keyof typeof DEMO_PRODUCT_VARIANT_IMAGES;

/** Resolve a per-metal variant image path, falling back when unavailable. */
export function getVariantImage(
  metal?: string | null,
  fallback?: string,
): string {
  if (metal && metal in DEMO_PRODUCT_VARIANT_IMAGES) {
    return DEMO_PRODUCT_VARIANT_IMAGES[metal as DemoMetal];
  }
  return getDemoImage(fallback, DEMO_PLACEHOLDER_IMAGES.ring);
}

const DIAMOND_SHAPE_IMAGE_MAP: Record<string, string> = {
  round: DEMO_DIAMOND_IMAGES.roundBrilliant,
  oval: DEMO_DIAMOND_IMAGES.oval,
  emerald: DEMO_DIAMOND_IMAGES.emeraldCut,
  pear: DEMO_DIAMOND_IMAGES.pear,
};

/** Map a diamond shape to its demo image path. */
export function getDiamondShapeImage(shape?: string | null): string {
  const key = shape?.trim().toLowerCase();
  if (key && key in DIAMOND_SHAPE_IMAGE_MAP) {
    return DIAMOND_SHAPE_IMAGE_MAP[key];
  }
  return DEMO_DIAMOND_IMAGES.roundBrilliant;
}
