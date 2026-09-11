export const SUPPORTED_LOCALES = [
  "en",
  "el",
  "de",
  "fr",
  "it",
  "es",
  "ru",
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  el: "Ελληνικά",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  es: "Español",
  ru: "Русский",
};

/** BCP 47 tags for hreflang / Open Graph locale. */
export const LOCALE_HREFLANG: Record<Locale, string> = {
  en: "en",
  el: "el",
  de: "de",
  fr: "fr",
  it: "it",
  es: "es",
  ru: "ru",
};
