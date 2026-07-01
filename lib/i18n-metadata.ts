import { getLocaleFromParamsAsync } from "@/lib/i18n";
import { createLocalizedMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

export async function generateLocalizedMetadata(
  params: Promise<{ locale: string }>,
  path: string,
  titleKey: string,
  descriptionKey: string,
  options?: { noIndex?: boolean },
) {
  const locale = await getLocaleFromParamsAsync(params);
  const t = await getTranslations({ locale, namespace: "seo" });

  return createLocalizedMetadata({
    locale,
    path,
    title: t(titleKey),
    description: t(descriptionKey),
    noIndex: options?.noIndex,
  });
}
