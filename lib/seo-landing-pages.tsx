import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import {
  COLORED_DIAMOND_LANDINGS,
  JEWELRY_CATEGORY_LANDINGS,
  type ColoredLandingKey,
  type JewelryCategoryKey,
} from "@/constants/seo-pages";
import type { FancyDiamondColor, ProductType } from "@/constants/jewellery";
import { getLocaleFromParamsAsync } from "@/lib/i18n";
import { generateLocalizedMetadata } from "@/lib/i18n-metadata";
import { getDiamonds } from "@/services/diamond.service";
import { getProducts } from "@/services/product.service";
import type { AppPathname } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";

export function createJewelryCategoryPage(key: JewelryCategoryKey) {
  const config = JEWELRY_CATEGORY_LANDINGS[key];

  async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    return generateLocalizedMetadata(
      params,
      config.path,
      config.seoTitleKey,
      config.seoDescriptionKey,
    );
  }

  async function Page({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const locale = await getLocaleFromParamsAsync(params);
    setRequestLocale(locale);
    const t = await getTranslations(`categoryPages.${key}`);
    const tb = await getTranslations("breadcrumb");

    const result = await getProducts({
      productTypes: config.productTypes as ProductType[],
      limit: 24,
      sort: "featured",
    });

    return (
      <SeoLandingPage
        breadcrumb={[
          { label: tb("home"), href: "/" },
          { label: t("title") },
        ]}
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
        sections={[
          { heading: t("section1Title"), body: t("section1Body") },
          { heading: t("section2Title"), body: t("section2Body") },
        ]}
        products={result.items}
        emptyTitle={t("emptyTitle")}
        emptyDescription={t("emptyDescription")}
        relatedLinks={[
          {
            label: t("linkColored"),
            href: "/colored-lab-grown-diamonds" as AppPathname,
          },
          { label: t("linkContact"), href: "/contact" as AppPathname },
        ]}
      />
    );
  }

  return { generateMetadata, Page };
}

export function createColoredLandingPage(key: ColoredLandingKey) {
  const config = COLORED_DIAMOND_LANDINGS[key];

  async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    return generateLocalizedMetadata(
      params,
      config.path,
      config.seoTitleKey,
      config.seoDescriptionKey,
    );
  }

  async function Page({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const locale = await getLocaleFromParamsAsync(params);
    setRequestLocale(locale);
    const t = await getTranslations(`coloredPages.${key}`);
    const tb = await getTranslations("breadcrumb");

    const filters =
      key === "colored"
        ? {
            isLabGrown: true as const,
            limit: 24,
            sort: "featured" as const,
          }
        : {
            isLabGrown: true as const,
            diamondColor: config.diamondColor as FancyDiamondColor,
            limit: 24,
            sort: "featured" as const,
          };

    const [result, diamondResult] = await Promise.all([
      getProducts(filters),
      getDiamonds(
        key === "colored"
          ? { diamondType: "lab", limit: 24, sort: "newest" }
          : {
              diamondType: "lab",
              fancyColor: config.diamondColor as FancyDiamondColor,
              limit: 24,
              sort: "newest",
            },
      ),
    ]);

    // For the hub page, prefer pieces that actually have a fancy color set
    const products =
      key === "colored"
        ? result.items.filter(
            (p) =>
              p.attributes?.diamondColor &&
              p.attributes.diamondColor !== "colorless",
          )
        : result.items;
    const diamonds =
      key === "colored"
        ? diamondResult.items.filter(
            (d) => d.fancyColor && d.fancyColor !== "colorless",
          )
        : diamondResult.items;

    const relatedLinks =
      key === "colored"
        ? [
            {
              label: t("linkBlue"),
              href: "/blue-lab-grown-diamonds" as AppPathname,
            },
            {
              label: t("linkYellow"),
              href: "/yellow-lab-grown-diamonds" as AppPathname,
            },
            {
              label: t("linkPink"),
              href: "/pink-lab-grown-diamonds" as AppPathname,
            },
            { label: t("linkRings"), href: "/rings" as AppPathname },
            { label: t("linkLoose"), href: "/diamonds" as AppPathname },
            {
              label: t("linkCreateRing"),
              href: "/create-ring" as AppPathname,
            },
          ]
        : [
            {
              label: t("linkColored"),
              href: "/colored-lab-grown-diamonds" as AppPathname,
            },
            { label: t("linkRings"), href: "/rings" as AppPathname },
            { label: t("linkLoose"), href: "/diamonds" as AppPathname },
            {
              label: t("linkCreateRing"),
              href: "/create-ring" as AppPathname,
            },
            {
              label: t("linkGuides"),
              href: "/guides/colored-lab-grown-diamonds" as AppPathname,
            },
          ];

    return (
      <SeoLandingPage
        breadcrumb={[
          { label: tb("home"), href: "/" },
          { label: t("title") },
        ]}
        eyebrow={t("eyebrow")}
        title={t("title")}
        intro={t("intro")}
        sections={[
          { heading: t("section1Title"), body: t("section1Body") },
          { heading: t("section2Title"), body: t("section2Body") },
        ]}
        products={products}
        diamonds={diamonds}
        jewelryHeading={t("jewelryHeading")}
        looseHeading={t("looseHeading")}
        emptyTitle={t("emptyTitle")}
        emptyDescription={t("emptyDescription")}
        relatedLinks={relatedLinks}
      />
    );
  }

  return { generateMetadata, Page };
}
