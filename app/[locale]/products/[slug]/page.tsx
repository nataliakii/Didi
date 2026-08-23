import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLocaleFromParamsAsync } from "@/lib/i18n";
import { createLocalizedMetadata, getLocalizedCanonical } from "@/lib/seo";
import { buildProductJsonLd } from "@/lib/schema";
import { formatLabel } from "@/lib/utils";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/services/product.service";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ProductDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function shipsToLabel(shipsTo?: string): string | null {
  switch (shipsTo) {
    case "greece":
      return "Greece";
    case "eu":
      return "European Union";
    case "greece-eu":
      return "Greece & European Union";
    default:
      return null;
  }
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocaleFromParamsAsync(params);
  const t = await getTranslations({ locale, namespace: "products" });
  const product = await getProductBySlug(slug);
  const path = `/products/${slug}`;

  if (!product) {
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
    title: product.seoTitle ?? product.name,
    description:
      product.seoDescription ?? product.shortDescription ?? t("pageDescription"),
  });
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const locale = await getLocaleFromParamsAsync(params);
  const t = await getTranslations("products");
  const tb = await getTranslations("breadcrumb");
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product);
  const attrs = product.attributes;
  const productUrl = getLocalizedCanonical(locale, `/products/${slug}`);

  const hasSale =
    product.salePrice !== undefined && product.salePrice < product.basePrice;

  const shipLabel = shipsToLabel(attrs?.shipsTo);

  return (
    <>
      <JsonLd
        data={buildProductJsonLd({
          name: product.name,
          description:
            product.shortDescription ?? product.description ?? product.name,
          images: product.images.map((img) => img.url),
          sku: product.sku ?? product.slug,
          url: productUrl,
          price: product.salePrice ?? product.basePrice,
          availabilityStatus: product.availabilityStatus,
        })}
      />
      <PageBreadcrumb
        items={[
          { label: tb("home"), href: "/" },
          { label: tb("products"), href: "/products" },
          { label: product.name },
        ]}
      />
      <Container className="py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <ProductGallery
            images={product.images}
            productName={product.name}
            videoUrl={product.videoUrl}
            priority
          />

          <div className="space-y-6">
            <div>
              <p className="text-xs tracking-widest text-brand-charcoal/45 uppercase">
                {formatLabel(product.productType)}
              </p>
              <h1 className="mt-2 font-serif text-3xl text-brand-text sm:text-4xl">
                {product.name}
              </h1>
              {product.shortDescription && (
                <p className="mt-4 text-brand-charcoal/65 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}
            </div>

            <PriceDisplay
              price={product.basePrice}
              salePrice={product.salePrice}
              currency="EUR"
              size="lg"
            />

            <div className="flex flex-wrap gap-2">
              <StatusBadge status={product.availabilityStatus} />
              {product.isFeatured && (
                <StatusBadge status="featured" label="Featured" variant="info" />
              )}
              {product.isBestSeller && (
                <StatusBadge status="best-seller" label="Best Seller" />
              )}
              {product.isReadyToShip && (
                <StatusBadge status="ready-to-ship" label="Ready to Ship" />
              )}
              {hasSale && (
                <StatusBadge status="sale" label="Sale" variant="danger" />
              )}
            </div>

            <dl className="grid grid-cols-2 gap-4 rounded-sm border border-brand-gold/20 p-4 text-sm">
              {attrs?.metal && attrs.metal.length > 0 && (
                <div>
                  <dt className="text-brand-charcoal/45">{t("attrMetal")}</dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {attrs.metal.map(formatLabel).join(", ")}
                  </dd>
                </div>
              )}
              {attrs?.goldPurity && (
                <div>
                  <dt className="text-brand-charcoal/45">
                    {t("attrGoldPurity")}
                  </dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {attrs.goldPurity.toUpperCase()}
                  </dd>
                </div>
              )}
              {(attrs?.isLabGrown ||
                attrs?.stoneType === "lab-grown-diamond") && (
                <div>
                  <dt className="text-brand-charcoal/45">
                    {t("attrStoneType")}
                  </dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {t("labGrownDiamond")}
                  </dd>
                </div>
              )}
              {attrs?.stoneType &&
                attrs.stoneType !== "lab-grown-diamond" &&
                !attrs.isLabGrown && (
                  <div>
                    <dt className="text-brand-charcoal/45">
                      {t("attrStoneType")}
                    </dt>
                    <dd className="mt-1 font-medium text-brand-text">
                      {formatLabel(attrs.stoneType)}
                    </dd>
                  </div>
                )}
              {attrs?.diamondColor && (
                <div>
                  <dt className="text-brand-charcoal/45">
                    {t("attrDiamondColor")}
                  </dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {formatLabel(attrs.diamondColor)}
                  </dd>
                </div>
              )}
              {attrs?.diamondShape && (
                <div>
                  <dt className="text-brand-charcoal/45">
                    {t("attrDiamondShape")}
                  </dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {formatLabel(attrs.diamondShape)}
                  </dd>
                </div>
              )}
              {attrs?.diamondCarat != null && (
                <div>
                  <dt className="text-brand-charcoal/45">
                    {t("attrDiamondCarat")}
                  </dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {attrs.diamondCarat} ct
                  </dd>
                </div>
              )}
              {attrs?.style && (
                <div>
                  <dt className="text-brand-charcoal/45">{t("attrStyle")}</dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {formatLabel(attrs.style)}
                  </dd>
                </div>
              )}
              {attrs?.certification?.lab && (
                <div>
                  <dt className="text-brand-charcoal/45">
                    {t("attrCertificate")}
                  </dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {attrs.certification.lab}
                    {attrs.certification.reportNumber
                      ? ` · ${attrs.certification.reportNumber}`
                      : ""}
                    {attrs.certification.reportUrl ? (
                      <>
                        {" · "}
                        <a
                          href={attrs.certification.reportUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-teal underline-offset-2 hover:underline"
                        >
                          {t("viewReport")}
                        </a>
                      </>
                    ) : null}
                  </dd>
                </div>
              )}
              {attrs?.ringSizes && attrs.ringSizes.length > 0 && (
                <div className="col-span-2">
                  <dt className="text-brand-charcoal/45">
                    {t("attrRingSizes")}
                  </dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {attrs.ringSizes.join(", ")}
                  </dd>
                </div>
              )}
              {attrs?.customSizeAvailable && (
                <div>
                  <dt className="text-brand-charcoal/45">
                    {t("attrCustomSize")}
                  </dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {t("available")}
                  </dd>
                </div>
              )}
              {attrs?.customStoneAvailable && (
                <div>
                  <dt className="text-brand-charcoal/45">
                    {t("attrCustomStone")}
                  </dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {t("available")}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-brand-charcoal/45">{t("attrStock")}</dt>
                <dd className="mt-1 font-medium text-brand-text">
                  {product.stockQuantity > 0
                    ? t("stockAvailable", { count: product.stockQuantity })
                    : t("madeToOrder")}
                </dd>
              </div>
              {product.productionTime && (
                <div>
                  <dt className="text-brand-charcoal/45">
                    {t("attrProductionTime")}
                  </dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {product.productionTime}
                  </dd>
                </div>
              )}
              {shipLabel && (
                <div className="col-span-2">
                  <dt className="text-brand-charcoal/45">
                    {t("attrDelivery")}
                  </dt>
                  <dd className="mt-1 font-medium text-brand-text">
                    {t("deliveryTo", { regions: shipLabel })}
                  </dd>
                </div>
              )}
            </dl>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <ProductPurchasePanel product={product} />
              </div>
              <Button
                href={`/appointment?productId=${product._id}`}
                variant="outline"
                className="flex-1 self-start sm:self-auto"
              >
                {t("bookAppointment")}
              </Button>
            </div>
          </div>
        </div>

        {product.description && (
          <section className="mt-16 max-w-3xl">
            <h2 className="font-serif text-2xl text-brand-text">
              {t("descriptionHeading")}
            </h2>
            <div className="mt-4 whitespace-pre-line text-brand-charcoal/65 leading-relaxed">
              {product.description}
            </div>
          </section>
        )}

        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-brand-gold/20 pt-16">
            <h2 className="font-serif text-2xl text-brand-text">
              {t("relatedHeading")}
            </h2>
            <div className="mt-8">
              <ProductGrid products={relatedProducts} />
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
