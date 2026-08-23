import { ContentArticle } from "@/components/seo/SeoLandingPage";
import { GUIDE_SLUGS, type GuideSlug } from "@/constants/seo-pages";
import { getLocaleFromParamsAsync } from "@/lib/i18n";
import { createLocalizedMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!GUIDE_SLUGS.includes(slug as GuideSlug)) {
    return {};
  }
  const locale = await getLocaleFromParamsAsync(params);
  const t = await getTranslations({ locale, namespace: `guides.${slug}` });
  return createLocalizedMetadata({
    locale,
    path: `/guides/${slug}`,
    title: t("metaTitle"),
    description: t("metaDescription"),
  });
}

export default async function GuideArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  if (!GUIDE_SLUGS.includes(slug as GuideSlug)) {
    notFound();
  }

  const locale = await getLocaleFromParamsAsync(params);
  setRequestLocale(locale);
  const t = await getTranslations(`guides.${slug}`);
  const tb = await getTranslations("breadcrumb");
  const tg = await getTranslations("guidesIndex");

  return (
    <ContentArticle
      breadcrumb={[
        { label: tb("home"), href: "/" },
        { label: tg("title"), href: "/guides" },
        { label: t("title") },
      ]}
      title={t("title")}
      intro={t("intro")}
      relatedLinks={[
        {
          label: t("linkColored"),
          href: "/colored-lab-grown-diamonds",
        },
        { label: t("linkRings"), href: "/rings" },
        { label: t("linkCert"), href: "/certification" },
        { label: tg("title"), href: "/guides" },
      ]}
    >
      <section>
        <h2 className="font-serif text-2xl text-brand-text">
          {t("section1Title")}
        </h2>
        <p className="mt-3 whitespace-pre-line">{t("section1Body")}</p>
      </section>
      <section>
        <h2 className="font-serif text-2xl text-brand-text">
          {t("section2Title")}
        </h2>
        <p className="mt-3 whitespace-pre-line">{t("section2Body")}</p>
      </section>
      <section>
        <h2 className="font-serif text-2xl text-brand-text">
          {t("section3Title")}
        </h2>
        <p className="mt-3 whitespace-pre-line">{t("section3Body")}</p>
      </section>
    </ContentArticle>
  );
}
