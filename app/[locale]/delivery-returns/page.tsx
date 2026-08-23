import { ContentArticle } from "@/components/seo/SeoLandingPage";
import { generateLocalizedMetadata } from "@/lib/i18n-metadata";
import { getLocaleFromParamsAsync } from "@/lib/i18n";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return generateLocalizedMetadata(
    params,
    "/delivery-returns",
    "deliveryTitle",
    "deliveryDescription",
  );
}

export default async function DeliveryReturnsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParamsAsync(params);
  setRequestLocale(locale);
  const t = await getTranslations("deliveryPage");
  const tb = await getTranslations("breadcrumb");

  return (
    <ContentArticle
      breadcrumb={[
        { label: tb("home"), href: "/" },
        { label: t("title") },
      ]}
      title={t("title")}
      intro={t("intro")}
      relatedLinks={[
        { label: t("linkContact"), href: "/contact" },
        { label: t("linkRings"), href: "/rings" },
      ]}
    >
      <section>
        <h2 className="font-serif text-2xl text-brand-text">
          {t("deliveryHeading")}
        </h2>
        <p className="mt-3 whitespace-pre-line">{t("deliveryBody")}</p>
      </section>
      <section>
        <h2 className="font-serif text-2xl text-brand-text">
          {t("returnsHeading")}
        </h2>
        <p className="mt-3 whitespace-pre-line">{t("returnsBody")}</p>
      </section>
      <section>
        <h2 className="font-serif text-2xl text-brand-text">
          {t("madeToOrderHeading")}
        </h2>
        <p className="mt-3 whitespace-pre-line">{t("madeToOrderBody")}</p>
      </section>
    </ContentArticle>
  );
}
