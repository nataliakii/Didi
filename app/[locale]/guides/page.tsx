import { ContentArticle } from "@/components/seo/SeoLandingPage";
import { GUIDE_SLUGS } from "@/constants/seo-pages";
import { generateLocalizedMetadata } from "@/lib/i18n-metadata";
import { getLocaleFromParamsAsync } from "@/lib/i18n";
import { Link } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return generateLocalizedMetadata(
    params,
    "/guides",
    "guidesTitle",
    "guidesDescription",
  );
}

export default async function GuidesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParamsAsync(params);
  setRequestLocale(locale);
  const t = await getTranslations("guidesIndex");
  const tb = await getTranslations("breadcrumb");

  const articles = await Promise.all(
    GUIDE_SLUGS.map(async (slug) => {
      const tg = await getTranslations(`guides.${slug}`);
      return {
        slug,
        title: tg("title"),
        summary: tg("intro"),
      };
    }),
  );

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
          label: t("linkColored"),
          href: "/colored-lab-grown-diamonds",
        },
        { label: t("linkCert"), href: "/certification" },
      ]}
    >
      <ul className="space-y-6">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/guides/${article.slug}` as "/guides"}
              className="group block"
            >
              <h2 className="font-serif text-xl text-brand-text group-hover:text-brand-teal">
                {article.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-brand-charcoal/65">
                {article.summary}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </ContentArticle>
  );
}
