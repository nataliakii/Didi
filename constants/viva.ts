export type VivaEnvironment = "demo" | "live";

export function getVivaEnvironment(): VivaEnvironment {
  return process.env.VIVA_ENVIRONMENT === "live" ? "live" : "demo";
}

export function isVivaConfigured(): boolean {
  return Boolean(
    process.env.VIVA_CLIENT_ID?.trim() &&
      process.env.VIVA_CLIENT_SECRET?.trim() &&
      process.env.VIVA_SOURCE_CODE?.trim(),
  );
}

export function getVivaCurrency(): string {
  return (process.env.VIVA_CURRENCY || "EUR").trim().toUpperCase();
}

export function getVivaSourceCode(): string {
  return (process.env.VIVA_SOURCE_CODE || "Default").trim();
}

export function getVivaAccountsBaseUrl(env = getVivaEnvironment()): string {
  return env === "live"
    ? "https://accounts.vivapayments.com"
    : "https://demo-accounts.vivapayments.com";
}

export function getVivaApiBaseUrl(env = getVivaEnvironment()): string {
  return env === "live"
    ? "https://api.vivapayments.com"
    : "https://demo-api.vivapayments.com";
}

/** Legacy host still used by some Basic-auth endpoints (webhook key). */
export function getVivaLegacyApiBaseUrl(env = getVivaEnvironment()): string {
  return env === "live"
    ? "https://www.vivapayments.com"
    : "https://demo.vivapayments.com";
}

export function getVivaCheckoutBaseUrl(env = getVivaEnvironment()): string {
  return env === "live"
    ? "https://www.vivapayments.com"
    : "https://demo.vivapayments.com";
}

export function buildVivaCheckoutUrl(orderCode: string | number): string {
  const color = process.env.VIVA_CHECKOUT_COLOR?.replace("#", "").trim();
  const base = `${getVivaCheckoutBaseUrl()}/web/checkout?ref=${orderCode}`;
  return color ? `${base}&color=${color}` : base;
}

/** Convert major currency units (e.g. 1299) to Viva minor units (cents). */
export function toVivaAmountCents(majorUnits: number): number {
  return Math.round(majorUnits * 100);
}

/** Map app locale to Viva requestLang (ISO 639-1 + country). */
export function toVivaRequestLang(locale: string): string {
  const map: Record<string, string> = {
    en: "en-GB",
    fr: "fr-FR",
    de: "de-DE",
    es: "es-ES",
    it: "it-IT",
    nl: "nl-NL",
    pt: "pt-PT",
    pl: "pl-PL",
    el: "el-GR",
    uk: "en-GB",
  };
  return map[locale] ?? "en-GB";
}
