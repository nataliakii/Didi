import { revalidatePath, revalidateTag } from "next/cache";

/** Cross-request cache tags for storefront catalog data. */
export const CACHE_TAGS = {
  products: "products",
  diamonds: "diamonds",
  categories: "categories",
  ringSettings: "ring-settings",
  product: (slugOrId: string) => `product:${slugOrId}`,
  diamond: (id: string) => `diamond:${id}`,
  ringSetting: (id: string) => `ring-setting:${id}`,
} as const;

/** Default soft TTL (seconds) for catalog reads — admin mutations invalidate sooner via tags. */
export const CATALOG_REVALIDATE_SECONDS = 60;

export function revalidateProductCatalog() {
  revalidateTag(CACHE_TAGS.products, "max");
  revalidateTag(CACHE_TAGS.categories, "max");
  revalidatePath("/", "layout");
}

export function revalidateDiamondCatalog() {
  revalidateTag(CACHE_TAGS.diamonds, "max");
  revalidatePath("/", "layout");
}

export function revalidateRingSettingCatalog() {
  revalidateTag(CACHE_TAGS.ringSettings, "max");
  revalidatePath("/", "layout");
}

export function revalidateCategoryCatalog() {
  revalidateTag(CACHE_TAGS.categories, "max");
  revalidateTag(CACHE_TAGS.products, "max");
  revalidatePath("/", "layout");
}

export function revalidateOpsLists() {
  revalidatePath("/admin", "layout");
}
