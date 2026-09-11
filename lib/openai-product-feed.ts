import { BRAND_NAME } from "@/constants/brand";
import { DEFAULT_LOCALE } from "@/constants/i18n";
import type {
  AvailabilityStatus,
  ProductShipRegion,
  ProductType,
} from "@/constants/jewellery";
import { getDhlFallbackRates } from "@/constants/dhl";
import { localizePath } from "@/lib/i18n";
import { getBaseUrl } from "@/lib/seo";
import { formatLabel } from "@/lib/utils";

export type OpenAIProductFeedItem = {
  item_id: string;
  title: string;
  description: string;
  url: string;
  brand: string;
  seller_name: string;
  seller_url: string;
  image_url: string;
  additional_image_urls?: string[];
  availability: "in_stock" | "out_of_stock" | "pre_order" | "backorder";
  price: string;
  sale_price?: string;
  condition: "new";
  product_category: string;
  material?: string;
  color?: string;
  mpn?: string;
  is_eligible_search: boolean;
  is_eligible_checkout: boolean;
  store_country: string;
  shipping?: string;
  shipping_price?: string;
  accepts_returns: boolean;
  return_deadline_in_days?: number;
  return_policy: string;
  group_id?: string;
  listing_has_variations?: boolean;
  variant_dict?: Record<string, string>;
};

type FeedProduct = {
  _id: string;
  name: string;
  slug: string;
  sku?: string;
  shortDescription?: string;
  description?: string;
  basePrice: number;
  salePrice?: number;
  images: Array<{ url: string; isPrimary?: boolean }>;
  productType: string;
  availabilityStatus: AvailabilityStatus;
  attributes?: {
    metal?: string[];
    diamondColor?: string;
    diamondShape?: string;
    diamondCarat?: number;
    goldPurity?: string;
    shipsTo?: ProductShipRegion;
    certification?: { lab?: string; reportNumber?: string };
  };
  variants?: Array<{
    sku: string;
    metal?: string;
    ringSize?: string;
    price: number;
    salePrice?: number;
    image?: string;
    stockQuantity?: number;
  }>;
};

function toAbsoluteUrl(pathOrUrl: string, baseUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${baseUrl}${path}`;
}

function money(amount: number, currency = "EUR"): string {
  return `${amount.toFixed(2)} ${currency}`;
}

function mapAvailability(
  status: AvailabilityStatus,
): OpenAIProductFeedItem["availability"] {
  switch (status) {
    case "in-stock":
      return "in_stock";
    case "pre-order":
      return "pre_order";
    case "made-to-order":
      return "pre_order";
    case "out-of-stock":
    default:
      return "out_of_stock";
  }
}

function productCategory(productType: string): string {
  const root = "Apparel & Accessories > Jewelry";
  switch (productType as ProductType) {
    case "engagement-ring":
      return `${root} > Rings > Engagement Rings`;
    case "wedding-ring":
      return `${root} > Rings > Wedding Bands`;
    case "ring":
      return `${root} > Rings`;
    case "necklace":
      return `${root} > Necklaces`;
    case "earrings":
      return `${root} > Earrings`;
    case "bracelet":
      return `${root} > Bracelets`;
    case "loose-diamond":
      return `${root} > Loose Diamonds`;
    default:
      return root;
  }
}

function enrichDescription(product: FeedProduct): string {
  const base =
    product.description?.trim() ||
    product.shortDescription?.trim() ||
    product.name;
  const attrs = product.attributes;
  const extras: string[] = [];

  if (attrs?.metal?.length) {
    extras.push(`Metal: ${attrs.metal.map(formatLabel).join(", ")}`);
  }
  if (attrs?.goldPurity) {
    extras.push(`Gold purity: ${attrs.goldPurity.toUpperCase()}`);
  }
  if (attrs?.diamondShape) {
    extras.push(`Diamond shape: ${formatLabel(attrs.diamondShape)}`);
  }
  if (attrs?.diamondColor) {
    extras.push(`Diamond color: ${formatLabel(attrs.diamondColor)}`);
  }
  if (attrs?.diamondCarat != null) {
    extras.push(`Carat: ${attrs.diamondCarat} ct`);
  }
  if (attrs?.certification?.lab) {
    const report = attrs.certification.reportNumber
      ? ` ${attrs.certification.reportNumber}`
      : "";
    extras.push(`Certificate: ${attrs.certification.lab}${report}`);
  }

  const shipsTo = attrs?.shipsTo ?? "greece-eu";
  extras.push(
    shipsTo === "greece"
      ? "Ships to Greece"
      : shipsTo === "eu"
        ? "Ships to the European Union"
        : "Ships to Greece and the European Union",
  );

  const combined = extras.length ? `${base}\n\n${extras.join(". ")}.` : base;
  return combined.slice(0, 5000);
}

function primaryAndAdditionalImages(
  product: FeedProduct,
  baseUrl: string,
  variantImage?: string,
): { image_url: string; additional_image_urls?: string[] } {
  const urls = product.images.map((img) => toAbsoluteUrl(img.url, baseUrl));
  const primaryFromVariant = variantImage
    ? toAbsoluteUrl(variantImage, baseUrl)
    : undefined;
  const primary =
    primaryFromVariant ??
    urls[
      Math.max(
        0,
        product.images.findIndex((img) => img.isPrimary),
      )
    ] ??
    urls[0];

  if (!primary) {
    // OpenAI requires an image URL; skip incomplete rows upstream instead.
    return { image_url: "" };
  }

  const additional = urls.filter((url) => url !== primary).slice(0, 10);
  return {
    image_url: primary,
    additional_image_urls: additional.length ? additional : undefined,
  };
}

function shippingFields(shipsTo?: ProductShipRegion): {
  shipping?: string;
  shipping_price?: string;
} {
  const rates = getDhlFallbackRates();
  const region = shipsTo ?? "greece-eu";

  if (region === "greece") {
    return {
      shipping: `GR::Standard:${money(rates.domestic)}`,
      shipping_price: money(rates.domestic),
    };
  }

  if (region === "eu") {
    return {
      shipping: `EU::Standard:${money(rates.eu)}`,
      shipping_price: money(rates.eu),
    };
  }

  return {
    shipping: `GR::Standard:${money(rates.domestic)}`,
    shipping_price: money(rates.eu),
  };
}

function materialLabel(attrs?: FeedProduct["attributes"]): string | undefined {
  if (!attrs?.metal?.length) return undefined;
  const metals = attrs.metal.map(formatLabel).join(", ");
  return attrs.goldPurity
    ? `${attrs.goldPurity.toUpperCase()} ${metals}`
    : metals;
}

function buildBaseItem(
  product: FeedProduct,
  baseUrl: string,
): Omit<
  OpenAIProductFeedItem,
  "item_id" | "title" | "price" | "sale_price" | "image_url" | "additional_image_urls" | "mpn" | "group_id" | "listing_has_variations" | "variant_dict" | "url" | "availability"
> {
  const ship = shippingFields(product.attributes?.shipsTo);

  return {
    description: enrichDescription(product),
    brand: BRAND_NAME,
    seller_name: BRAND_NAME,
    seller_url: baseUrl,
    condition: "new",
    product_category: productCategory(product.productType),
    material: materialLabel(product.attributes),
    color: product.attributes?.diamondColor
      ? formatLabel(product.attributes.diamondColor)
      : undefined,
    is_eligible_search: true,
    // Checkout inside ChatGPT needs a separate OpenAI ACP onboarding.
    is_eligible_checkout: false,
    store_country: "GR",
    shipping: ship.shipping,
    shipping_price: ship.shipping_price,
    accepts_returns: true,
    return_deadline_in_days: 14,
    return_policy: `${baseUrl}${localizePath(DEFAULT_LOCALE, "/delivery-returns")}`,
  };
}

export function buildOpenAIProductFeedItems(
  products: FeedProduct[],
): OpenAIProductFeedItem[] {
  const baseUrl = getBaseUrl();
  const items: OpenAIProductFeedItem[] = [];

  for (const product of products) {
    const productUrl = `${baseUrl}${localizePath(DEFAULT_LOCALE, `/products/${product.slug}`)}`;
    const base = buildBaseItem(product, baseUrl);
    const variants = product.variants?.filter((v) => v.sku) ?? [];

    if (variants.length === 0) {
      const images = primaryAndAdditionalImages(product, baseUrl);
      const sale =
        product.salePrice != null &&
        product.salePrice > 0 &&
        product.salePrice < product.basePrice
          ? money(product.salePrice)
          : undefined;

      items.push({
        ...base,
        item_id: product.sku || product.slug || product._id,
        title: product.name.slice(0, 150),
        description: base.description,
        url: productUrl,
        availability: mapAvailability(product.availabilityStatus),
        price: money(product.basePrice),
        sale_price: sale,
        mpn: product.sku,
        ...images,
      });
      continue;
    }

    for (const variant of variants) {
      const images = primaryAndAdditionalImages(
        product,
        baseUrl,
        variant.image,
      );
      const variantPrice = variant.price;
      const sale =
        variant.salePrice != null &&
        variant.salePrice > 0 &&
        variant.salePrice < variantPrice
          ? money(variant.salePrice)
          : product.salePrice != null &&
              product.salePrice > 0 &&
              product.salePrice < variantPrice
            ? money(product.salePrice)
            : undefined;

      const variantLabelParts = [
        variant.metal ? formatLabel(variant.metal) : null,
        variant.ringSize ? `Size ${variant.ringSize}` : null,
      ].filter(Boolean);
      const title = (
        variantLabelParts.length
          ? `${product.name} — ${variantLabelParts.join(", ")}`
          : product.name
      ).slice(0, 150);

      const variantDict: Record<string, string> = {};
      if (variant.metal) variantDict.metal = formatLabel(variant.metal);
      if (variant.ringSize) variantDict.size = variant.ringSize;

      const availability =
        (variant.stockQuantity ?? 0) <= 0 &&
        product.availabilityStatus === "in-stock"
          ? "out_of_stock"
          : mapAvailability(product.availabilityStatus);

      const query = new URLSearchParams();
      if (variant.metal) query.set("metal", variant.metal);
      if (variant.ringSize) query.set("size", variant.ringSize);
      const url = query.toString()
        ? `${productUrl}?${query.toString()}`
        : productUrl;

      items.push({
        ...base,
        item_id: variant.sku,
        group_id: product.sku || product.slug || product._id,
        listing_has_variations: true,
        variant_dict: Object.keys(variantDict).length
          ? variantDict
          : undefined,
        title,
        url,
        availability,
        price: money(variantPrice),
        sale_price: sale,
        mpn: variant.sku,
        material: variant.metal
          ? formatLabel(variant.metal)
          : base.material,
        ...images,
      });
    }
  }

  return items.filter((item) => Boolean(item.image_url));
}

export function toOpenAIProductFeedJsonl(items: OpenAIProductFeedItem[]): string {
  return `${items.map((item) => JSON.stringify(item)).join("\n")}${items.length ? "\n" : ""}`;
}
