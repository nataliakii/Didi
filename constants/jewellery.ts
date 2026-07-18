export const METALS = [
  "white-gold",
  "yellow-gold",
  "rose-gold",
  "platinum",
  "silver",
] as const;

export const DIAMOND_SHAPES = [
  "round",
  "oval",
  "cushion",
  "elongated-cushion",
  "princess",
  "emerald",
  "pear",
  "marquise",
  "radiant",
  "asscher",
  "heart",
] as const;

/** Homepage / shop-by-shape order (Brilliant Earth–style). */
export const HOME_DIAMOND_SHAPES = [
  "oval",
  "round",
  "emerald",
  "marquise",
  "radiant",
  "pear",
  "elongated-cushion",
  "cushion",
  "princess",
  "asscher",
] as const satisfies readonly (typeof DIAMOND_SHAPES)[number][];

export const DIAMOND_COLORS = [
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
] as const;

export const DIAMOND_CLARITY = [
  "FL",
  "IF",
  "VVS1",
  "VVS2",
  "VS1",
  "VS2",
  "SI1",
  "SI2",
  "I1",
  "I2",
] as const;

/**
 * Stored cut grades. Includes Ideal / Super Ideal (Brilliant Earth–style)
 * and Excellent (legacy GIA-style, treated as Ideal for range filters).
 */
export const DIAMOND_CUTS = [
  "Super Ideal",
  "Ideal",
  "Excellent",
  "Very Good",
  "Good",
  "Fair",
  "Poor",
] as const;

export const DIAMOND_TYPES = ["natural", "lab"] as const;

/** Slider order: lower quality → higher quality (left → right). */
export const CUT_SLIDER_GRADES = [
  "Fair",
  "Good",
  "Very Good",
  "Ideal",
  "Super Ideal",
] as const;

export const COLOR_SLIDER_GRADES = [
  "K",
  "J",
  "I",
  "H",
  "G",
  "F",
  "E",
  "D",
] as const;

export const CLARITY_SLIDER_GRADES = [
  "SI2",
  "SI1",
  "VS2",
  "VS1",
  "VVS2",
  "VVS1",
  "IF",
  "FL",
] as const;

export const FLUORESCENCE_GRADES = [
  "None",
  "Faint",
  "Medium",
  "Strong",
  "Very Strong",
] as const;

/** Fluorescence slider left→right: more fluorescence → none (BE style). */
export const FLUORESCENCE_SLIDER_GRADES = [
  "Very Strong",
  "Strong",
  "Medium",
  "Faint",
  "None",
] as const;

export const FINISH_GRADES = [
  "Excellent",
  "Very Good",
  "Good",
  "Fair",
] as const;

export const DIAMOND_COLLECTIONS = [
  "flawless",
  "blockchain",
  "truly-brilliant",
] as const;

export const DIAMOND_FILTER_PRESETS = [
  "most-sparkle",
  "best-balance",
  "top-quality",
] as const;

export const RING_STYLES = [
  "solitaire",
  "halo",
  "three-stone",
  "pave",
  "vintage",
  "bezel",
  "channel",
  "tension",
] as const;

export const PRODUCT_TYPES = [
  "ring",
  "engagement-ring",
  "wedding-ring",
  "earrings",
  "necklace",
  "bracelet",
  "loose-diamond",
  "custom-jewellery",
] as const;

export const AVAILABILITY_STATUSES = [
  "in-stock",
  "made-to-order",
  "out-of-stock",
  "pre-order",
] as const;

export const PRODUCT_STATUSES = ["draft", "published", "archived"] as const;

export const RING_SIZES = [
  "3",
  "3.5",
  "4",
  "4.5",
  "5",
  "5.5",
  "6",
  "6.5",
  "7",
  "7.5",
  "8",
  "8.5",
  "9",
  "9.5",
  "10",
  "10.5",
  "11",
] as const;

export const STONE_TYPES = [
  "diamond",
  "sapphire",
  "ruby",
  "emerald",
  "moissanite",
  "none",
] as const;

export type Metal = (typeof METALS)[number];
export type DiamondShape = (typeof DIAMOND_SHAPES)[number];
export type DiamondColor = (typeof DIAMOND_COLORS)[number];
export type DiamondClarity = (typeof DIAMOND_CLARITY)[number];
export type DiamondCut = (typeof DIAMOND_CUTS)[number];
export type DiamondType = (typeof DIAMOND_TYPES)[number];
export type FluorescenceGrade = (typeof FLUORESCENCE_GRADES)[number];
export type FinishGrade = (typeof FINISH_GRADES)[number];
export type DiamondCollection = (typeof DIAMOND_COLLECTIONS)[number];
export type DiamondFilterPreset = (typeof DIAMOND_FILTER_PRESETS)[number];
export type RingStyle = (typeof RING_STYLES)[number];
export type ProductType = (typeof PRODUCT_TYPES)[number];
export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];
