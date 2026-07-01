import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from "@/constants/i18n";
import { getRequestConfig } from "next-intl/server";

function isSupportedLocale(locale: string): locale is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && isSupportedLocale(requested)
    ? requested
    : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
