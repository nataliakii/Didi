import { BRAND_NAME } from "@/constants/brand";
import { BRAND_CONTACT } from "@/constants/contact";
import type {
  AvailabilityStatus,
  ProductShipRegion,
} from "@/constants/jewellery";
import { getBaseUrl } from "@/lib/seo";
import { formatLabel } from "@/lib/utils";

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

function shippingCountries(shipsTo?: ProductShipRegion): string[] {
  switch (shipsTo) {
    case "greece":
      return ["GR"];
    case "eu":
      return ["EU"];
    case "greece-eu":
    default:
      return ["GR", "EU"];
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
  material?: string;
  color?: string;
  shipsTo?: ProductShipRegion;
  additionalProperties?: Array<{ name: string; value: string }>;
}) {
  const countries = shippingCountries(input.shipsTo);
  const additionalProperty = input.additionalProperties?.length
    ? input.additionalProperties.map((prop) => ({
        "@type": "PropertyValue" as const,
        name: prop.name,
        value: prop.value,
      }))
    : undefined;

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
    material: input.material,
    color: input.color,
    additionalProperty,
    offers: {
      "@type": "Offer",
      url: input.url,
      priceCurrency: STORE_CURRENCY,
      price: input.price.toFixed(2),
      availability: offerAvailability(input.availabilityStatus),
      areaServed: countries,
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: countries.map((country) => ({
          "@type": "DefinedRegion",
          addressCountry: country,
        })),
      },
      seller: {
        "@type": "Organization",
        name: BRAND_NAME,
      },
    },
  };
}

/** Build jewelry-specific PropertyValue rows for Product JSON-LD. */
export function buildJewelryAdditionalProperties(attrs?: {
  diamondShape?: string;
  diamondColor?: string;
  diamondCarat?: number;
  stoneType?: string;
  isLabGrown?: boolean;
  goldPurity?: string;
  certification?: { lab?: string; reportNumber?: string };
}): Array<{ name: string; value: string }> {
  if (!attrs) return [];

  const props: Array<{ name: string; value: string }> = [];

  if (attrs.diamondShape) {
    props.push({ name: "Diamond shape", value: formatLabel(attrs.diamondShape) });
  }
  if (attrs.diamondColor) {
    props.push({ name: "Diamond color", value: formatLabel(attrs.diamondColor) });
  }
  if (attrs.diamondCarat != null) {
    props.push({ name: "Carat", value: `${attrs.diamondCarat} ct` });
  }
  if (attrs.isLabGrown || attrs.stoneType === "lab-grown-diamond") {
    props.push({ name: "Stone type", value: "Lab-grown diamond" });
  } else if (attrs.stoneType && attrs.stoneType !== "none") {
    props.push({ name: "Stone type", value: formatLabel(attrs.stoneType) });
  }
  if (attrs.goldPurity) {
    props.push({ name: "Gold purity", value: attrs.goldPurity.toUpperCase() });
  }
  if (attrs.certification?.lab) {
    const report = attrs.certification.reportNumber
      ? ` · ${attrs.certification.reportNumber}`
      : "";
    props.push({
      name: "Certificate",
      value: `${attrs.certification.lab}${report}`,
    });
  }

  return props;
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
