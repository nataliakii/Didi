import { BRAND_NAME } from "@/constants/brand";
import {
  DEFAULT_LOCALE,
  LOCALE_HREFLANG,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/constants/i18n";
import { localizePath } from "@/lib/i18n";
import type { Metadata } from "next";

const SITE_NAME = BRAND_NAME;

export function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

/** Strip query params; canonical always points to the locale path only. */
function normalizeSeoPath(path: string): string {
  const pathname = path.split("?")[0] || "/";
  return pathname === "/" ? "" : pathname;
}

export function getLocalizedCanonical(locale: Locale, path: string): string {
  const normalized = normalizeSeoPath(path);
  return `${getBaseUrl()}${localizePath(locale, normalized || "/")}`;
}

export function getLanguageAlternates(path: string): Record<string, string> {
  const normalized = normalizeSeoPath(path);
  const baseUrl = getBaseUrl();
  const languages: Record<string, string> = {};

  for (const supportedLocale of SUPPORTED_LOCALES) {
    languages[LOCALE_HREFLANG[supportedLocale]] = `${baseUrl}${localizePath(
      supportedLocale,
      normalized || "/",
    )}`;
  }

  languages["x-default"] = `${baseUrl}${localizePath(
    DEFAULT_LOCALE,
    normalized || "/",
  )}`;

  return languages;
}

export interface LocalizedMetadataInput {
  locale: Locale;
  /** Store path without locale prefix, e.g. `/products` or `/products/my-ring`. */
  path: string;
  title: string;
  description: string;
  noIndex?: boolean;
}

export function createLocalizedMetadata({
  locale,
  path,
  title,
  description,
  noIndex = false,
}: LocalizedMetadataInput): Metadata {
  const canonical = getLocalizedCanonical(locale, path);
  const languages = getLanguageAlternates(path);

  const metadata: Metadata = {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: LOCALE_HREFLANG[locale],
      alternateLocale: SUPPORTED_LOCALES.filter((l) => l !== locale).map(
        (l) => LOCALE_HREFLANG[l],
      ),
      type: "website",
    },
  };

  if (noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
    };
  }

  return metadata;
}

/** @deprecated Use createLocalizedMetadata */
export interface PageSeoInput {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}

/** @deprecated Use createLocalizedMetadata */
export function buildPageMetadata(input: PageSeoInput): Metadata {
  return createLocalizedMetadata(input);
}

export function buildSiteMetadata(
  locale: Locale,
  title: string,
  description: string,
  options?: { noIndex?: boolean },
): Metadata {
  return createLocalizedMetadata({
    locale,
    path: "/",
    title,
    description,
    noIndex: options?.noIndex,
  });
}
