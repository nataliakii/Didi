import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/constants/i18n";

export function isSupportedLocale(locale: string): locale is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

export function getLocaleFromParams(
  params: { locale?: string } | Promise<{ locale?: string }>,
): Locale {
  const resolved = params instanceof Promise ? undefined : params.locale;
  if (resolved && isSupportedLocale(resolved)) {
    return resolved;
  }
  return DEFAULT_LOCALE;
}

export async function getLocaleFromParamsAsync(
  params: Promise<{ locale: string }>,
): Promise<Locale> {
  const { locale } = await params;
  return isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
}

/**
 * Prefix a store path with the locale segment.
 * Accepts paths like `/products`, `/products?type=ring`, or `/create-ring/review?settingId=1`.
 */
export function localizePath(locale: Locale, path: string): string {
  const [pathname, search = ""] = path.split("?");
  const normalized =
    pathname === "/" ? "" : pathname.startsWith("/") ? pathname : `/${pathname}`;
  const localized = `/${locale}${normalized}`;
  return search ? `${localized}?${search}` : localized;
}

export function getLocalizedHref(locale: Locale, href: string): string {
  if (
    href.startsWith("http") ||
    href.startsWith("#") ||
    href.startsWith("/admin") ||
    href.startsWith("/api")
  ) {
    return href;
  }

  const localePrefix = `/${locale}`;
  if (href === localePrefix || href.startsWith(`${localePrefix}/`)) {
    return href;
  }

  for (const supportedLocale of SUPPORTED_LOCALES) {
    const prefix = `/${supportedLocale}`;
    if (href === prefix || href.startsWith(`${prefix}/`)) {
      return localizePath(locale, href.slice(prefix.length) || "/");
    }
  }

  return localizePath(locale, href);
}

export function removeLocaleFromPath(pathname: string): string {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];
  if (maybeLocale && isSupportedLocale(maybeLocale)) {
    const rest = segments.slice(2).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname || "/";
}

export function detectLocaleFromAcceptLanguage(
  acceptLanguage: string | null,
): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const preferences = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, qValue] = part.trim().split(";q=");
      return {
        tag: tag.toLowerCase().split("-")[0],
        q: qValue ? Number.parseFloat(qValue) : 1,
      };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferences) {
    if (isSupportedLocale(tag)) return tag;
  }

  return DEFAULT_LOCALE;
}
