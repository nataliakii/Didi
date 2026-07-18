import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getLocaleFromParamsAsync } from "@/lib/i18n";
import { createLocalizedMetadata } from "@/lib/seo";
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
  const t = await getTranslations("products");
  const tb = await getTranslations("breadcrumb");
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product);

  const hasSale =
    product.salePrice !== undefined && product.salePrice < product.basePrice;

  return (
    <>
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
        />

        <div className="space-y-6">
          <div>
            <p className="text-xs tracking-widest text-brand-charcoal/45 uppercase">
              {formatLabel(product.productType)}
            </p>
            <h1 className="mt-2 font-serif text-3xl text-brand-navy sm:text-4xl">
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

          {product.attributes && (
            <dl className="grid grid-cols-2 gap-4 rounded-sm border border-brand-gold/20 p-4 text-sm">
              {product.attributes.metal && product.attributes.metal.length > 0 && (
                <div>
                  <dt className="text-brand-charcoal/45">Metal Options</dt>
                  <dd className="mt-1 font-medium text-brand-navy">
                    {product.attributes.metal.map(formatLabel).join(", ")}
                  </dd>
                </div>
              )}
              {product.attributes.stoneType && (
                <div>
                  <dt className="text-brand-charcoal/45">Stone Type</dt>
                  <dd className="mt-1 font-medium text-brand-navy">
                    {formatLabel(product.attributes.stoneType)}
                  </dd>
                </div>
              )}
              {product.attributes.diamondShape && (
                <div>
                  <dt className="text-brand-charcoal/45">Diamond Shape</dt>
                  <dd className="mt-1 font-medium text-brand-navy">
                    {formatLabel(product.attributes.diamondShape)}
                  </dd>
                </div>
              )}
              {product.attributes.style && (
                <div>
                  <dt className="text-brand-charcoal/45">Style</dt>
                  <dd className="mt-1 font-medium text-brand-navy">
                    {formatLabel(product.attributes.style)}
                  </dd>
                </div>
              )}
              {product.attributes.ringSizes &&
                product.attributes.ringSizes.length > 0 && (
                  <div className="col-span-2">
                    <dt className="text-brand-charcoal/45">Ring Sizes</dt>
                    <dd className="mt-1 font-medium text-brand-navy">
                      {product.attributes.ringSizes.join(", ")}
                    </dd>
                  </div>
                )}
              <div>
                <dt className="text-brand-charcoal/45">Stock</dt>
                <dd className="mt-1 font-medium text-brand-navy">
                  {product.stockQuantity > 0
                    ? `${product.stockQuantity} available`
                    : "Made to order"}
                </dd>
              </div>
              {product.productionTime && (
                <div>
                  <dt className="text-brand-charcoal/45">Production Time</dt>
                  <dd className="mt-1 font-medium text-brand-navy">
                    {product.productionTime}
                  </dd>
                </div>
              )}
            </dl>
          )}

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
          <h2 className="font-serif text-2xl text-brand-navy">Description</h2>
          <div className="mt-4 whitespace-pre-line text-brand-charcoal/65 leading-relaxed">
            {product.description}
          </div>
        </section>
      )}

      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-brand-gold/20 pt-16">
          <h2 className="font-serif text-2xl text-brand-navy">
            Related Products
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
