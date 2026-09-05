/**
 * Local demo/seed image paths for Asteria Diamond House.
 * Files live under public/images/demo/ — replace assets without changing code.
 *
 * Demo assets ship in git. Opt out with NEXT_PUBLIC_DEMO_ASSETS_READY=false.
 * (Missing env used to hide every demo photo behind ivory placeholders on prod.)
 */
export const DEMO_ASSETS_READY =
  process.env.NEXT_PUBLIC_DEMO_ASSETS_READY !== "false";

const DEMO_IMAGE_PREFIX = "/images/demo/";

export function isDemoImagePath(path?: string | null): boolean {
  return Boolean(path?.trim().startsWith(DEMO_IMAGE_PREFIX));
}

/**
 * Demo files were compressed to .jpg; older DB rows may still store .png.
 * Rewrite at read-time so production works without an immediate re-seed.
 */
export function normalizeDemoImagePath(
  path?: string | null,
): string | undefined {
  const trimmed = path?.trim();
  if (!trimmed) return undefined;
  if (isDemoImagePath(trimmed) && /\.png$/i.test(trimmed)) {
    return trimmed.replace(/\.png$/i, ".jpg");
  }
  return trimmed;
}

/** Use ivory UI placeholder instead of loading a missing demo asset. */
export function shouldUseDemoPlaceholder(path?: string | null): boolean {
  const trimmed = normalizeDemoImagePath(path);
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
  marquise: "/images/demo/diamonds/marquise-diamond.jpg",
  princess: "/images/demo/diamonds/princess-diamond.jpg",
  cushion: "/images/demo/diamonds/cushion-diamond.jpg",
  radiant: "/images/demo/diamonds/radiant-diamond.jpg",
  asscher: "/images/demo/diamonds/asscher-diamond.jpg",
  heart: "/images/demo/diamonds/heart-diamond.jpg",
} as const;

export const DEMO_RING_IMAGES = {
  ovalSolitaire: "/images/demo/rings/oval-solitaire-ring.jpg",
  roundSolitaire: "/images/demo/rings/round-solitaire-ring.jpg",
  roundHalo: "/images/demo/rings/round-halo-ring.jpg",
  emeraldCut: "/images/demo/rings/emerald-cut-ring.jpg",
  hiddenHalo: "/images/demo/rings/hidden-halo-ring.jpg",
  radiantHiddenHalo: "/images/demo/rings/radiant-hidden-halo-ring.jpg",
  cushionSplitShank: "/images/demo/rings/cushion-split-shank-ring.jpg",
  princessChannel: "/images/demo/rings/princess-channel-ring.jpg",
  pearFiligree: "/images/demo/rings/pear-filigree-ring.jpg",
  marquiseBezel: "/images/demo/rings/marquise-bezel-ring.jpg",
  asscherThreeStone: "/images/demo/rings/asscher-three-stone-ring.jpg",
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

export const DEMO_ABOUT_IMAGES = {
  founder: "/images/demo/about/diana-angelaki-founder.jpg",
} as const;

export const DEMO_PLACEHOLDER_IMAGES = {
  diamond: "/images/demo/placeholders/diamond-placeholder.jpg",
  ring: "/images/demo/placeholders/ring-placeholder.jpg",
  setting: "/images/demo/placeholders/setting-placeholder.jpg",
} as const;

/** Ring builder step cards — replace files in public/images/demo/create-ring/ */
export const DEMO_CREATE_RING_IMAGES = {
  diamond: "/images/demo/create-ring/create-ring-diamond.jpg",
  setting: "/images/demo/create-ring/create-ring-setting.jpg",
  metal: "/images/demo/create-ring/create-ring-metal.jpg",
  review: "/images/demo/create-ring/create-ring-review.jpg",
} as const;

/** Per-metal product variant images — replace files in public/images/demo/products/ */
export const DEMO_PRODUCT_VARIANT_IMAGES = {
  "yellow-gold": "/images/demo/products/product-solitaire-yellow-gold.jpg",
  "white-gold": "/images/demo/products/product-solitaire-white-gold.jpg",
  "rose-gold": "/images/demo/products/product-solitaire-rose-gold.jpg",
  platinum: "/images/demo/products/product-solitaire-platinum.jpg",
} as const;

/** Category cards — gold contour line-art (replace later with photography). */
export const DEMO_CATEGORY_IMAGES = {
  looseDiamonds: "/images/demo/contours/contour-diamond.svg",
  engagementRings: "/images/demo/contours/contour-ring.svg",
  diamondRings: "/images/demo/contours/contour-ring.svg",
  signatureSolitaires: "/images/demo/contours/contour-ring.svg",
  ovalCut: "/images/demo/contours/contour-diamond-oval.svg",
  roundBrilliant: "/images/demo/contours/contour-diamond-round.svg",
  emeraldCut: "/images/demo/contours/contour-diamond-emerald.svg",
  pearCut: "/images/demo/contours/contour-diamond-pear.svg",
  marquiseCut: "/images/demo/contours/contour-diamond-marquise.svg",
  princessCut: "/images/demo/contours/contour-diamond-princess.svg",
  cushionCut: "/images/demo/contours/contour-diamond-cushion.svg",
  elongatedCushionCut: "/images/demo/contours/contour-diamond-elongated-cushion.svg",
  radiantCut: "/images/demo/contours/contour-diamond-radiant.svg",
  asscherCut: "/images/demo/contours/contour-diamond-asscher.svg",
  heartCut: "/images/demo/contours/contour-diamond-heart.svg",
  ringSettings: "/images/demo/contours/contour-setting.svg",
  necklaces: "/images/demo/contours/contour-necklace.svg",
  earrings: "/images/demo/contours/contour-earrings.svg",
  bracelets: "/images/demo/contours/contour-bracelet.svg",
  coloredLabGrownDiamonds: "/images/demo/contours/contour-colored.svg",
  halo: "/images/demo/contours/contour-ring-halo.svg",
  threeStone: "/images/demo/contours/contour-ring-three-stone.svg",
  vintage: "/images/demo/contours/contour-ring-vintage.svg",
  pave: "/images/demo/contours/contour-ring-pave.svg",
  bezel: "/images/demo/contours/contour-ring-bezel.svg",
  channel: "/images/demo/contours/contour-ring-channel.svg",
  tension: "/images/demo/contours/contour-ring-tension.svg",
  createRing: "/images/demo/contours/contour-ring-create.svg",
} as const;

/** Map ring style → gold contour for category / filter cards. */
export const RING_STYLE_CONTOUR_MAP: Record<string, string> = {
  solitaire: DEMO_CATEGORY_IMAGES.signatureSolitaires,
  halo: DEMO_CATEGORY_IMAGES.halo,
  "three-stone": DEMO_CATEGORY_IMAGES.threeStone,
  pave: DEMO_CATEGORY_IMAGES.pave,
  vintage: DEMO_CATEGORY_IMAGES.vintage,
  bezel: DEMO_CATEGORY_IMAGES.bezel,
  channel: DEMO_CATEGORY_IMAGES.channel,
  tension: DEMO_CATEGORY_IMAGES.tension,
};

export function getRingStyleContour(style?: string | null): string {
  const key = style?.trim().toLowerCase();
  if (key && key in RING_STYLE_CONTOUR_MAP) {
    return RING_STYLE_CONTOUR_MAP[key];
  }
  return DEMO_CATEGORY_IMAGES.diamondRings;
}

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
    marquise: DEMO_DIAMOND_IMAGES.marquise,
    princess: DEMO_DIAMOND_IMAGES.princess,
    cushion: DEMO_DIAMOND_IMAGES.cushion,
    radiant: DEMO_DIAMOND_IMAGES.radiant,
    asscher: DEMO_DIAMOND_IMAGES.asscher,
    heart: DEMO_DIAMOND_IMAGES.heart,
  },
  ring: {
    ovalSolitaire: DEMO_RING_IMAGES.ovalSolitaire,
    roundSolitaire: DEMO_RING_IMAGES.roundSolitaire,
    solitaire: DEMO_RING_IMAGES.ovalSolitaire,
    halo: DEMO_RING_IMAGES.hiddenHalo,
    emerald: DEMO_RING_IMAGES.emeraldCut,
    cushion: DEMO_RING_IMAGES.cushionSplitShank,
    princess: DEMO_RING_IMAGES.princessChannel,
    pear: DEMO_RING_IMAGES.pearFiligree,
    marquise: DEMO_RING_IMAGES.marquiseBezel,
    asscher: DEMO_RING_IMAGES.asscherThreeStone,
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
  about: {
    founder: DEMO_ABOUT_IMAGES.founder,
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
  const trimmed = normalizeDemoImagePath(path);
  if (trimmed) return trimmed;

  const trimmedFallback = normalizeDemoImagePath(fallback);
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
  marquise: DEMO_DIAMOND_IMAGES.marquise,
  princess: DEMO_DIAMOND_IMAGES.princess,
  cushion: DEMO_DIAMOND_IMAGES.cushion,
  "elongated-cushion": DEMO_DIAMOND_IMAGES.cushion,
  radiant: DEMO_DIAMOND_IMAGES.radiant,
  asscher: DEMO_DIAMOND_IMAGES.asscher,
  heart: DEMO_DIAMOND_IMAGES.heart,
};

const DIAMOND_SHAPE_CONTOUR_MAP: Record<string, string> = {
  round: DEMO_CATEGORY_IMAGES.roundBrilliant,
  oval: DEMO_CATEGORY_IMAGES.ovalCut,
  emerald: DEMO_CATEGORY_IMAGES.emeraldCut,
  pear: DEMO_CATEGORY_IMAGES.pearCut,
  marquise: DEMO_CATEGORY_IMAGES.marquiseCut,
  princess: DEMO_CATEGORY_IMAGES.princessCut,
  cushion: DEMO_CATEGORY_IMAGES.cushionCut,
  "elongated-cushion": DEMO_CATEGORY_IMAGES.elongatedCushionCut,
  radiant: DEMO_CATEGORY_IMAGES.radiantCut,
  asscher: DEMO_CATEGORY_IMAGES.asscherCut,
  heart: DEMO_CATEGORY_IMAGES.heartCut,
};

/** Map a diamond shape to its demo image path. */
export function getDiamondShapeImage(shape?: string | null): string {
  const key = shape?.trim().toLowerCase();
  if (key && key in DIAMOND_SHAPE_IMAGE_MAP) {
    return DIAMOND_SHAPE_IMAGE_MAP[key];
  }
  return DEMO_DIAMOND_IMAGES.roundBrilliant;
}

/** Map a diamond shape to its gold contour outline (homepage / filters). */
export function getDiamondShapeContour(shape?: string | null): string {
  const key = shape?.trim().toLowerCase();
  if (key && key in DIAMOND_SHAPE_CONTOUR_MAP) {
    return DIAMOND_SHAPE_CONTOUR_MAP[key];
  }
  return DEMO_CATEGORY_IMAGES.roundBrilliant;
}
