import {
  EU_COUNTRY_CODES,
  getDhlFallbackRates,
  getDhlOrigin,
  isDhlConfigured,
} from "@/constants/dhl";
import { getVivaCurrency } from "@/constants/viva";
import { fetchDhlExpressRates, type DhlShippingRate } from "@/lib/dhl";

export type ShippingQuoteSource = "dhl" | "fallback";

export interface ShippingQuoteOption {
  id: string;
  carrier: "dhl";
  productCode: string;
  localProductCode?: string;
  productName: string;
  price: number;
  currency: string;
  estimatedDelivery?: string;
  transitDays?: number;
  source: ShippingQuoteSource;
}

export interface QuoteShippingInput {
  country: string;
  city: string;
  postalCode: string;
  /** Cart item count — adds light extra weight for multi-piece bags. */
  itemCount?: number;
  currency?: string;
}

function toOption(
  rate: DhlShippingRate,
  source: ShippingQuoteSource,
): ShippingQuoteOption {
  return {
    id: `dhl:${rate.productCode}`,
    carrier: "dhl",
    productCode: rate.productCode,
    localProductCode: rate.localProductCode,
    productName: rate.productName,
    price: Math.round(rate.price * 100) / 100,
    currency: rate.currency,
    estimatedDelivery: rate.estimatedDelivery,
    transitDays: rate.deliveryCapabilities?.totalTransitDays,
    source,
  };
}

function fallbackOptions(country: string, currency: string): ShippingQuoteOption[] {
  const origin = getDhlOrigin();
  const rates = getDhlFallbackRates();
  const dest = country.trim().toUpperCase();

  let price = rates.international;
  let productName = "DHL Express (estimated international)";
  let productCode = "FALLBACK-INT";

  if (dest === origin.countryCode) {
    price = rates.domestic;
    productName = "DHL Express (estimated domestic)";
    productCode = "FALLBACK-DOM";
  } else if (EU_COUNTRY_CODES.has(dest)) {
    price = rates.eu;
    productName = "DHL Express (estimated EU)";
    productCode = "FALLBACK-EU";
  }

  return [
    {
      id: `dhl:${productCode}`,
      carrier: "dhl",
      productCode,
      productName,
      price,
      currency,
      source: "fallback",
    },
  ];
}

export async function quoteShippingRates(
  input: QuoteShippingInput,
): Promise<{
  options: ShippingQuoteOption[];
  source: ShippingQuoteSource;
  configured: boolean;
}> {
  const currency = (input.currency || getVivaCurrency()).toUpperCase();
  const country = input.country.trim().toUpperCase();
  const city = input.city.trim();
  const postalCode = input.postalCode.trim();

  if (!country || country.length !== 2 || !city || !postalCode) {
    return { options: [], source: "fallback", configured: isDhlConfigured() };
  }

  if (!isDhlConfigured()) {
    return {
      options: fallbackOptions(country, currency),
      source: "fallback",
      configured: false,
    };
  }

  const itemCount = Math.max(1, input.itemCount ?? 1);
  const extraWeightKg = Math.max(0, itemCount - 1) * 0.1;

  try {
    const rates = await fetchDhlExpressRates({
      destinationCountryCode: country,
      destinationCityName: city,
      destinationPostalCode: postalCode,
      currencyCode: currency,
      extraWeightKg,
    });

    if (rates.length === 0) {
      return {
        options: fallbackOptions(country, currency),
        source: "fallback",
        configured: true,
      };
    }

    return {
      options: rates.map((rate) => toOption(rate, "dhl")),
      source: "dhl",
      configured: true,
    };
  } catch (error) {
    console.error("quoteShippingRates DHL error:", error);
    return {
      options: fallbackOptions(country, currency),
      source: "fallback",
      configured: true,
    };
  }
}

/**
 * Resolve the selected shipping option at checkout time.
 * Prefers a live DHL re-quote so the charged amount matches MyDHL rates.
 */
export async function resolveShippingOption(input: {
  country: string;
  city: string;
  postalCode: string;
  productCode: string;
  itemCount?: number;
  currency?: string;
}): Promise<
  | { success: true; option: ShippingQuoteOption }
  | { success: false; error: string }
> {
  const quoted = await quoteShippingRates({
    country: input.country,
    city: input.city,
    postalCode: input.postalCode,
    itemCount: input.itemCount,
    currency: input.currency,
  });

  const match = quoted.options.find(
    (option) => option.productCode === input.productCode,
  );

  if (!match) {
    return {
      success: false,
      error:
        "Selected shipping method is no longer available. Please refresh rates and try again.",
    };
  }

  return { success: true, option: match };
}
