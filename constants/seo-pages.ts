import type { FancyDiamondColor, ProductType } from "@/constants/jewellery";
import type { AppPathname } from "@/i18n/routing";

export type JewelryCategoryKey =
  | "rings"
  | "necklaces"
  | "earrings"
  | "bracelets";

export type ColoredLandingKey =
  | "colored"
  | "blue"
  | "yellow"
  | "pink";

export const JEWELRY_CATEGORY_LANDINGS: Record<
  JewelryCategoryKey,
  {
    path: AppPathname;
    productTypes: ProductType[];
    seoTitleKey: string;
    seoDescriptionKey: string;
    contentNamespace: string;
  }
> = {
  rings: {
    path: "/rings",
    productTypes: ["ring", "engagement-ring", "wedding-ring"],
    seoTitleKey: "ringsTitle",
    seoDescriptionKey: "ringsDescription",
    contentNamespace: "categoryPages.rings",
  },
  necklaces: {
    path: "/necklaces",
    productTypes: ["necklace"],
    seoTitleKey: "necklacesTitle",
    seoDescriptionKey: "necklacesDescription",
    contentNamespace: "categoryPages.necklaces",
  },
  earrings: {
    path: "/earrings",
    productTypes: ["earrings"],
    seoTitleKey: "earringsTitle",
    seoDescriptionKey: "earringsDescription",
    contentNamespace: "categoryPages.earrings",
  },
  bracelets: {
    path: "/bracelets",
    productTypes: ["bracelet"],
    seoTitleKey: "braceletsTitle",
    seoDescriptionKey: "braceletsDescription",
    contentNamespace: "categoryPages.bracelets",
  },
};

export const COLORED_DIAMOND_LANDINGS: Record<
  ColoredLandingKey,
  {
    path: AppPathname;
    diamondColor?: FancyDiamondColor;
    /** When true, filter lab-grown jewelry with any fancy color except colorless. */
    coloredOnly?: boolean;
    seoTitleKey: string;
    seoDescriptionKey: string;
    contentNamespace: string;
  }
> = {
  colored: {
    path: "/colored-lab-grown-diamonds",
    coloredOnly: true,
    seoTitleKey: "coloredTitle",
    seoDescriptionKey: "coloredDescription",
    contentNamespace: "coloredPages.colored",
  },
  blue: {
    path: "/blue-lab-grown-diamonds",
    diamondColor: "blue",
    seoTitleKey: "blueTitle",
    seoDescriptionKey: "blueDescription",
    contentNamespace: "coloredPages.blue",
  },
  yellow: {
    path: "/yellow-lab-grown-diamonds",
    diamondColor: "yellow",
    seoTitleKey: "yellowTitle",
    seoDescriptionKey: "yellowDescription",
    contentNamespace: "coloredPages.yellow",
  },
  pink: {
    path: "/pink-lab-grown-diamonds",
    diamondColor: "pink",
    seoTitleKey: "pinkTitle",
    seoDescriptionKey: "pinkDescription",
    contentNamespace: "coloredPages.pink",
  },
};

export const GUIDE_SLUGS = [
  "what-are-lab-grown-diamonds",
  "colored-lab-grown-diamonds",
  "lab-grown-vs-natural-diamonds",
  "how-colored-lab-grown-diamonds-are-created",
  "igi-certification",
  "how-to-read-a-diamond-certificate",
  "diamond-cuts-and-shapes",
] as const;

export type GuideSlug = (typeof GUIDE_SLUGS)[number];
