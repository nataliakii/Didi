export const SUPPORTED_LOCALES = [
  "en",
  "fr",
  "de",
  "es",
  "it",
  "nl",
  "pt",
  "pl",
  "el",
  "uk",
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
  nl: "Nederlands",
  pt: "Português",
  pl: "Polski",
  el: "Ελληνικά",
  uk: "Українська",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  fr: "🇫🇷",
  de: "🇩🇪",
  es: "🇪🇸",
  it: "🇮🇹",
  nl: "🇳🇱",
  pt: "🇵🇹",
  pl: "🇵🇱",
  el: "🇬🇷",
  uk: "🇺🇦",
};

/** BCP 47 tags for hreflang / Open Graph locale. */
export const LOCALE_HREFLANG: Record<Locale, string> = {
  en: "en",
  fr: "fr",
  de: "de",
  es: "es",
  it: "it",
  nl: "nl",
  pt: "pt",
  pl: "pl",
  el: "el",
  uk: "uk",
};
