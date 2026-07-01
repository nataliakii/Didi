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
  "princess",
  "emerald",
  "pear",
  "marquise",
  "radiant",
  "asscher",
  "heart",
] as const;

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

export const DIAMOND_CUTS = [
  "Excellent",
  "Very Good",
  "Good",
  "Fair",
  "Poor",
] as const;

export const DIAMOND_TYPES = ["natural", "lab"] as const;

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
export type RingStyle = (typeof RING_STYLES)[number];
export type ProductType = (typeof PRODUCT_TYPES)[number];
export type AvailabilityStatus = (typeof AVAILABILITY_STATUSES)[number];
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];
