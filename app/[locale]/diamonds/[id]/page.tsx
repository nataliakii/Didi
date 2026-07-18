import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DiamondGradingReport } from "@/components/diamond/DiamondGradingReport";
import { MediaVideo } from "@/components/ui/MediaVideo";
import { DemoImage } from "@/components/ui/DemoImage";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DEMO_PLACEHOLDER_IMAGES } from "@/constants/demo-images";
import { buildRingSettingHref } from "@/lib/ring-builder";
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
  const t = await getTranslations({ locale, namespace: "diamonds" });
  const tb = await getTranslations({ locale, namespace: "breadcrumb" });
  const diamond = await getDiamondById(id);

  if (!diamond) {
    notFound();
  }

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: tb("home"), href: "/" },
          { label: tb("looseDiamonds"), href: "/diamonds" },
          {
            label: `${diamond.carat.toFixed(2)} ct ${formatLabel(diamond.shape)}`,
          },
        ]}
      />
      <Container className="py-12 lg:py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-sm bg-brand-cream">
            {diamond.images?.[0]?.url ? (
              <DemoImage
                src={diamond.images[0].url}
                fallback={DEMO_PLACEHOLDER_IMAGES.diamond}
                alt={`${diamond.carat}ct ${diamond.shape}`}
                placeholderKind="diamond"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <DemoImage
                src={DEMO_PLACEHOLDER_IMAGES.diamond}
                fallback={DEMO_PLACEHOLDER_IMAGES.diamond}
                alt={`${diamond.carat}ct ${diamond.shape}`}
                placeholderKind="diamond"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
          </div>
          {diamond.videoUrl && (
            <div className="relative aspect-video overflow-hidden rounded-sm bg-brand-cream">
              <MediaVideo
                url={diamond.videoUrl}
                title={`${diamond.carat}ct ${diamond.shape} video`}
                className="absolute inset-0 h-full w-full"
              />
            </div>
          )}
        </div>

      <div className="max-w-3xl">
        <p className="text-xs tracking-widest text-brand-charcoal/45 uppercase">
          {formatLabel(diamond.diamondType)} Diamond
        </p>
        <h1 className="mt-2 font-serif text-3xl text-brand-navy sm:text-4xl">
          {diamond.carat.toFixed(2)} ct {formatLabel(diamond.shape)}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <PriceDisplay
            price={diamond.price}
            salePrice={diamond.salePrice}
            size="lg"
          />
          <StatusBadge status={diamond.availabilityStatus} />
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-4 rounded-sm border border-brand-gold/20 p-6 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-brand-charcoal/45">Shape</dt>
            <dd className="mt-1 font-medium text-brand-navy">
              {formatLabel(diamond.shape)}
            </dd>
          </div>
          <div>
            <dt className="text-brand-charcoal/45">Carat</dt>
            <dd className="mt-1 font-medium text-brand-navy">
              {diamond.carat.toFixed(2)}
            </dd>
          </div>
          <div>
            <dt className="text-brand-charcoal/45">Cut</dt>
            <dd className="mt-1 font-medium text-brand-navy">{diamond.cut}</dd>
          </div>
          <div>
            <dt className="text-brand-charcoal/45">Color</dt>
            <dd className="mt-1 font-medium text-brand-navy">{diamond.color}</dd>
          </div>
          <div>
            <dt className="text-brand-charcoal/45">Clarity</dt>
            <dd className="mt-1 font-medium text-brand-navy">
              {diamond.clarity}
            </dd>
          </div>
          {diamond.polish && (
            <div>
              <dt className="text-brand-charcoal/45">Polish</dt>
              <dd className="mt-1 font-medium text-brand-navy">
                {diamond.polish}
              </dd>
            </div>
          )}
          {diamond.symmetry && (
            <div>
              <dt className="text-brand-charcoal/45">Symmetry</dt>
              <dd className="mt-1 font-medium text-brand-navy">
                {diamond.symmetry}
              </dd>
            </div>
          )}
          {diamond.fluorescence && (
            <div>
              <dt className="text-brand-charcoal/45">Fluorescence</dt>
              <dd className="mt-1 font-medium text-brand-navy">
                {diamond.fluorescence}
              </dd>
            </div>
          )}
          {diamond.lengthWidthRatio !== undefined && (
            <div>
              <dt className="text-brand-charcoal/45">L:W Ratio</dt>
              <dd className="mt-1 font-medium text-brand-navy">
                {diamond.lengthWidthRatio.toFixed(2)}
              </dd>
            </div>
          )}
          {diamond.tablePercent !== undefined && (
            <div>
              <dt className="text-brand-charcoal/45">Table %</dt>
              <dd className="mt-1 font-medium text-brand-navy">
                {diamond.tablePercent}
              </dd>
            </div>
          )}
          {diamond.depthPercent !== undefined && (
            <div>
              <dt className="text-brand-charcoal/45">Depth %</dt>
              <dd className="mt-1 font-medium text-brand-navy">
                {diamond.depthPercent}
              </dd>
            </div>
          )}
          {diamond.lengthMm !== undefined && diamond.widthMm !== undefined && (
            <div>
              <dt className="text-brand-charcoal/45">Measurements</dt>
              <dd className="mt-1 font-medium text-brand-navy">
                {diamond.lengthMm.toFixed(2)} × {diamond.widthMm.toFixed(2)}
                {diamond.depthMm !== undefined
                  ? ` × ${diamond.depthMm.toFixed(2)} mm`
                  : " mm"}
              </dd>
            </div>
          )}
        </dl>

        <DiamondGradingReport
          certification={diamond.certification}
          className="mt-8"
        />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            href={buildRingSettingHref({ diamondId: id }, locale)}
            className="flex-1"
          >
            Choose for ring builder
          </Button>
          <Button href="/diamonds" variant="outline" className="flex-1">
            {t("backToDiamonds")}
          </Button>
        </div>
      </div>
      </div>
    </Container>
    </>
  );
}
