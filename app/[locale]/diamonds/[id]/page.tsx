import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { Container } from "@/components/ui/Container";
import { DiamondGradingReport } from "@/components/diamond/DiamondGradingReport";
import { DiamondPurchaseActions } from "@/components/diamond/DiamondPurchaseActions";
import { ProductGallery } from "@/components/product/ProductGallery";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Locale } from "@/constants/i18n";
import { getLocaleFromParamsAsync } from "@/lib/i18n";
import { createLocalizedMetadata } from "@/lib/seo";
import { formatLabel } from "@/lib/utils";
import { getDiamondById } from "@/services/diamond.service";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface DiamondDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: DiamondDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const locale = await getLocaleFromParamsAsync(params);
  const t = await getTranslations({ locale, namespace: "diamonds" });
  const diamond = await getDiamondById(id);
  const path = `/diamonds/${id}`;

  if (!diamond) {
    return createLocalizedMetadata({
      locale,
      path,
      title: t("notFoundTitle"),
      description: t("pageDescription"),
    });
  }

  return createLocalizedMetadata({
    locale,
    path,
    title: `${diamond.carat.toFixed(2)}ct ${formatLabel(diamond.shape)} Diamond`,
    description: `${formatLabel(diamond.diamondType)} ${diamond.carat.toFixed(2)} carat ${formatLabel(diamond.shape)} diamond, ${diamond.color} color, ${diamond.clarity} clarity.`,
  });
}

export default async function DiamondDetailPage({
  params,
}: DiamondDetailPageProps) {
  const { id, locale: localeParam } = await params;
  const locale = await getLocaleFromParamsAsync(
    Promise.resolve({ locale: localeParam }),
  );
  const tb = await getTranslations({ locale, namespace: "breadcrumb" });
  const diamond = await getDiamondById(id);

  if (!diamond) {
    notFound();
  }

  const title = `${diamond.carat.toFixed(2)} ct ${formatLabel(diamond.shape)}`;
  const galleryImages =
    diamond.images?.map((image, index) => ({
      url: image.url,
      alt:
        image.alt?.trim() ||
        `${title} — view ${index + 1}`,
      isPrimary: image.isPrimary,
    })) ?? [];

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: tb("home"), href: "/" },
          { label: tb("looseDiamonds"), href: "/diamonds" },
          { label: title },
        ]}
      />
      <Container className="py-0 lg:py-12">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-12 xl:gap-16">
          <div className="sticky top-14 z-0 -mx-4 sm:-mx-6 lg:static lg:top-auto lg:z-auto lg:mx-0">
            <ProductGallery
              images={galleryImages}
              productName={title}
              videoUrl={diamond.videoUrl}
              placeholderKind="diamond"
              priority
            />
          </div>

          <div className="relative z-10 -mx-4 space-y-6 bg-brand-bg px-4 pt-8 pb-10 shadow-[0_-12px_28px_rgba(6,24,43,0.08)] sm:-mx-6 sm:px-6 lg:mx-0 lg:bg-transparent lg:px-0 lg:pt-0 lg:pb-0 lg:shadow-none lg:sticky lg:top-28 lg:self-start">
            <div
              className="mx-auto mb-6 h-px w-12 bg-brand-border lg:hidden"
              aria-hidden
            />

            <div>
              <p className="text-xs tracking-widest text-brand-charcoal/45 uppercase">
                {formatLabel(diamond.diamondType)} Diamond
              </p>
              <h1 className="mt-2 font-serif text-3xl text-brand-text sm:text-4xl">
                {title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <PriceDisplay
                price={diamond.price}
                salePrice={diamond.salePrice}
                size="lg"
              />
              <StatusBadge status={diamond.availabilityStatus} />
            </div>

            <dl className="grid grid-cols-2 gap-4 rounded-sm border border-brand-gold/20 p-6 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-brand-charcoal/45">Shape</dt>
                <dd className="mt-1 font-medium text-brand-text">
                  {formatLabel(diamond.shape)}
                </dd>
              </div>
              <div>
                <dt className="text-brand-charcoal/45">Carat</dt>
                <dd className="mt-1 font-medium text-brand-text">
                  {diamond.carat.toFixed(2)}
                </dd>
              </div>
              <div>
                <dt className="text-brand-charcoal/45">Cut</dt>
                <dd className="mt-1 font-medium text-brand-text">
                  {diamond.cut}
                </dd>
              </div>
              <div>
                <dt className="text-brand-charcoal/45">Color</dt>
                <dd className="mt-1 font-medium text-brand-text">
                  {diamond.color}
                </dd>
              </div>
              <div>
                <dt className="text-brand-charcoal/45">Clarity</dt>
                <dd className="mt-1 font-medium text-brand-text">
                  {diamond.clarity}
                </dd>
              </div>
              {diamond.polish && (
                <div>
                  <dt className="text-brand-charcoal/45">Polish</dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {diamond.polish}
                  </dd>
                </div>
              )}
              {diamond.symmetry && (
                <div>
                  <dt className="text-brand-charcoal/45">Symmetry</dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {diamond.symmetry}
                  </dd>
                </div>
              )}
              {diamond.fluorescence && (
                <div>
                  <dt className="text-brand-charcoal/45">Fluorescence</dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {diamond.fluorescence}
                  </dd>
                </div>
              )}
              {diamond.lengthWidthRatio !== undefined && (
                <div>
                  <dt className="text-brand-charcoal/45">L:W Ratio</dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {diamond.lengthWidthRatio.toFixed(2)}
                  </dd>
                </div>
              )}
              {diamond.tablePercent !== undefined && (
                <div>
                  <dt className="text-brand-charcoal/45">Table %</dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {diamond.tablePercent}
                  </dd>
                </div>
              )}
              {diamond.depthPercent !== undefined && (
                <div>
                  <dt className="text-brand-charcoal/45">Depth %</dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {diamond.depthPercent}
                  </dd>
                </div>
              )}
              {diamond.lengthMm !== undefined &&
                diamond.widthMm !== undefined && (
                  <div>
                    <dt className="text-brand-charcoal/45">Measurements</dt>
                    <dd className="mt-1 font-medium text-brand-text">
                      {diamond.lengthMm.toFixed(2)} ×{" "}
                      {diamond.widthMm.toFixed(2)}
                      {diamond.depthMm !== undefined
                        ? ` × ${diamond.depthMm.toFixed(2)} mm`
                        : " mm"}
                    </dd>
                  </div>
                )}
            </dl>

            <DiamondGradingReport certification={diamond.certification} />

            <DiamondPurchaseActions
              diamond={diamond}
              locale={locale as Locale}
            />
          </div>
        </div>
      </Container>
    </>
  );
}
