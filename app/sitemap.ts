import { SUPPORTED_LOCALES } from "@/constants/i18n";
import { localizePath } from "@/lib/i18n";
import { getBaseUrl } from "@/lib/seo";
import { getActiveDiamondIds } from "@/services/diamond.service";
import { getPublishedProductSlugs } from "@/services/product.service";
import type { MetadataRoute } from "next";

const STATIC_PATHS = [
  "",
  "/products",
  "/diamonds",
  "/create-ring",
  "/about",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of SUPPORTED_LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${baseUrl}${localizePath(locale, path || "/")}`,
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "daily",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  let productSlugs: string[] = [];
  let diamondIds: string[] = [];

  try {
    [productSlugs, diamondIds] = await Promise.all([
      getPublishedProductSlugs(),
      getActiveDiamondIds(),
    ]);
  } catch {
    // Sitemap still works with static routes only when DB is unavailable.
  }

  for (const locale of SUPPORTED_LOCALES) {
    for (const slug of productSlugs) {
      entries.push({
        url: `${baseUrl}${localizePath(locale, `/products/${slug}`)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    for (const id of diamondIds) {
      entries.push({
        url: `${baseUrl}${localizePath(locale, `/diamonds/${id}`)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
