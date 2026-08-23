import { BRAND_NAME } from "@/constants/brand";
import { BRAND_CONTACT } from "@/constants/contact";
import type { AvailabilityStatus } from "@/constants/jewellery";
import { getBaseUrl } from "@/lib/seo";

const STORE_CURRENCY = "EUR";

function offerAvailability(
  status: AvailabilityStatus,
): string {
  switch (status) {
    case "in-stock":
      return "https://schema.org/InStock";
    case "pre-order":
    case "made-to-order":
      return "https://schema.org/PreOrder";
    case "out-of-stock":
    default:
      return "https://schema.org/OutOfStock";
  }
}

export function buildOrganizationJsonLd() {
  const baseUrl = getBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url: baseUrl,
    email: BRAND_CONTACT.email,
    telephone: BRAND_CONTACT.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Thessaloniki",
      addressCountry: "GR",
    },
    areaServed: ["GR", "EU"],
    brand: {
      "@type": "Brand",
      name: BRAND_NAME,
    },
    description:
      "ASTERIA DIAMOND HOUSE — Colored Lab-Grown Diamond Jewelry in Greece, based in Thessaloniki.",
  };
}

export function buildProductJsonLd(input: {
  name: string;
  description: string;
  images: string[];
  sku: string;
  url: string;
  price: number;
  availabilityStatus: AvailabilityStatus;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    image: input.images.length ? input.images : undefined,
    sku: input.sku,
    brand: {
      "@type": "Brand",
      name: BRAND_NAME,
    },
    offers: {
      "@type": "Offer",
      url: input.url,
      priceCurrency: STORE_CURRENCY,
      price: input.price.toFixed(2),
      availability: offerAvailability(input.availabilityStatus),
      seller: {
        "@type": "Organization",
        name: BRAND_NAME,
      },
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
