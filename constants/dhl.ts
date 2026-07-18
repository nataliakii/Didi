export type DhlEnvironment = "test" | "live";

export function getDhlEnvironment(): DhlEnvironment {
  return process.env.DHL_ENVIRONMENT === "live" ? "live" : "test";
}

export function isDhlConfigured(): boolean {
  return Boolean(
    process.env.DHL_API_KEY?.trim() &&
      process.env.DHL_API_SECRET?.trim() &&
      process.env.DHL_ACCOUNT_NUMBER?.trim(),
  );
}

export function getDhlApiBaseUrl(env = getDhlEnvironment()): string {
  return env === "live"
    ? "https://express.api.dhl.com/mydhlapi"
    : "https://express.api.dhl.com/mydhlapi/test";
}

export function getDhlAccountNumber(): string {
  return (process.env.DHL_ACCOUNT_NUMBER || "").trim();
}

/** Ship-from defaults (Asteria warehouse / atelier). */
export function getDhlOrigin() {
  return {
    countryCode: (process.env.DHL_ORIGIN_COUNTRY || "GR").trim().toUpperCase(),
    cityName: (process.env.DHL_ORIGIN_CITY || "Athens").trim(),
    postalCode: (process.env.DHL_ORIGIN_POSTAL_CODE || "10563").trim(),
    addressLine1: (
      process.env.DHL_SHIPPER_ADDRESS_LINE1 || "Asteria Diamond House"
    ).trim(),
    addressLine2: process.env.DHL_SHIPPER_ADDRESS_LINE2?.trim() || undefined,
  };
}

export function getDhlShipperContact() {
  return {
    fullName: (process.env.DHL_SHIPPER_NAME || "Asteria Diamond House").trim(),
    companyName: (
      process.env.DHL_SHIPPER_COMPANY || "Asteria Diamond House"
    ).trim(),
    phone: (process.env.DHL_SHIPPER_PHONE || "+302101234567").trim(),
    email: (process.env.DHL_SHIPPER_EMAIL || "shipping@asteria.diamonds").trim(),
  };
}

/** Whether MyDHL should book a courier pickup when creating the shipment. */
export function shouldRequestDhlPickup(): boolean {
  return process.env.DHL_REQUEST_PICKUP === "true";
}

/** HS code used for jewellery customs line items (default: articles of jewellery). */
export function getDhlDefaultHsCode(): string {
  return (process.env.DHL_DEFAULT_HS_CODE || "711319").trim();
}

export function isFallbackDhlProductCode(productCode: string): boolean {
  return productCode.toUpperCase().startsWith("FALLBACK");
}

/** Default jewellery parcel (ring box) — metric. */
export function getDhlDefaultPackage() {
  return {
    weightKg: Number(process.env.DHL_DEFAULT_WEIGHT_KG || "0.5") || 0.5,
    lengthCm: Number(process.env.DHL_DEFAULT_LENGTH_CM || "20") || 20,
    widthCm: Number(process.env.DHL_DEFAULT_WIDTH_CM || "15") || 15,
    heightCm: Number(process.env.DHL_DEFAULT_HEIGHT_CM || "10") || 10,
  };
}

/** Used only when DHL credentials are not set (local/dev). */
export function getDhlFallbackRates() {
  return {
    domestic: Number(process.env.DHL_FALLBACK_DOMESTIC_EUR || "12") || 12,
    eu: Number(process.env.DHL_FALLBACK_EU_EUR || "28") || 28,
    international: Number(process.env.DHL_FALLBACK_INTERNATIONAL_EUR || "45") || 45,
  };
}

/** EU/EEA ISO codes for customs + fallback banding. */
export const EU_COUNTRY_CODES = new Set([
  "AT",
  "BE",
  "BG",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "HU",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SE",
  "SI",
  "SK",
]);
