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
    "/certification",
    "certificationTitle",
    "certificationDescription",
  );
}

export default async function CertificationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParamsAsync(params);
  setRequestLocale(locale);
  const t = await getTranslations("certificationPage");
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
        {
          label: t("linkIgiGuide"),
          href: "/guides/igi-certification",
        },
        {
          label: t("linkReadCert"),
          href: "/guides/how-to-read-a-diamond-certificate",
        },
        {
          label: t("linkColored"),
          href: "/colored-lab-grown-diamonds",
        },
      ]}
    >
      <section>
        <h2 className="font-serif text-2xl text-brand-text">{t("igiHeading")}</h2>
        <p className="mt-3 whitespace-pre-line">{t("igiBody")}</p>
      </section>
      <section>
        <h2 className="font-serif text-2xl text-brand-text">
          {t("asteriaHeading")}
        </h2>
        <p className="mt-3 whitespace-pre-line">{t("asteriaBody")}</p>
      </section>
    </ContentArticle>
  );
}
