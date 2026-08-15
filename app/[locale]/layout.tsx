import { DocumentLang } from "@/components/layout/DocumentLang";
import { StorefrontChrome } from "@/components/layout/StorefrontChrome";
import { ComingSoonPage } from "@/components/coming-soon/ComingSoonPage";
import { SUPPORTED_LOCALES, type Locale } from "@/constants/i18n";
import { COMING_SOON } from "@/constants/site";
import { routing } from "@/i18n/routing";
import { buildSiteMetadata } from "@/lib/seo";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: "seo" });
  if (COMING_SOON) {
    const tComingSoon = await getTranslations({ locale, namespace: "comingSoon" });
    return buildSiteMetadata(
      locale as Locale,
      tComingSoon("metaTitle"),
      tComingSoon("metaDescription"),
      { noIndex: true },
    );
  }
  return buildSiteMetadata(locale as Locale, t("homeTitle"), t("homeDescription"));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <DocumentLang locale={locale} />
      {COMING_SOON ? (
        <ComingSoonPage />
      ) : (
        <StorefrontChrome>{children}</StorefrontChrome>
      )}
    </NextIntlClientProvider>
  );
}
