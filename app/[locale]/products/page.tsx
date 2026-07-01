import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { Container } from "@/components/ui/Container";
import { Pagination } from "@/components/ui/Pagination";
import {
  ActiveFilterChips,
  PRODUCT_ACTIVE_FILTER_CONFIGS,
} from "@/components/filters/ActiveFilterChips";
import { StyleCategoryCarousel } from "@/components/filters/StyleCategoryCarousel";
import {
  ProductFilters,
  ProductSearchBar,
  ProductSortSelect,
} from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { generateLocalizedMetadata } from "@/lib/i18n-metadata";
import {
  getActiveCategories,
  getProducts,
  parseProductFilters,
} from "@/services/product.service";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return generateLocalizedMetadata(
    params,
    "/products",
    "productsTitle",
    "productsDescription",
  );
}

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function CatalogControlsFallback() {
  return (
    <div className="flex animate-pulse flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="h-10 max-w-md flex-1 rounded-sm bg-brand-cream" />
      <div className="h-10 w-48 rounded-sm bg-brand-cream" />
    </div>
  );
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("products");
  const tb = await getTranslations("breadcrumb");
  const tf = await getTranslations("filters");
  const resolvedParams = await searchParams;
  const filters = parseProductFilters(resolvedParams);

  const [result, categories] = await Promise.all([
    getProducts(filters),
    getActiveCategories(),
  ]);

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: tb("home"), href: "/" },
          { label: tb("products") },
        ]}
      />
      <Container className="py-10 lg:py-14">
        <div className="max-w-2xl">
          <p className="section-eyebrow">{t("collectionEyebrow")}</p>
          <h1 className="mt-2 font-serif text-3xl text-brand-navy sm:text-4xl">
            {t("pageTitle")}
          </h1>
        </div>

        <div className="mt-8">
          <Suspense fallback={null}>
            <StyleCategoryCarousel label={tf("styleCategory")} />
          </Suspense>
        </div>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:gap-12">
          <aside className="w-full shrink-0 lg:w-72">
            <Suspense
              fallback={
                <div className="h-96 animate-pulse rounded-sm bg-brand-cream" />
              }
            >
              <ProductFilters categories={categories} />
            </Suspense>
          </aside>

          <div className="min-w-0 flex-1 space-y-6">
            <Suspense fallback={<CatalogControlsFallback />}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <ProductSearchBar />
                <ProductSortSelect />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-brand-charcoal/60">
                  {t("resultsCount", { count: result.total })}
                </p>
                <ActiveFilterChips
                  configs={PRODUCT_ACTIVE_FILTER_CONFIGS}
                  resetLabel={tf("resetAll")}
                />
              </div>
            </Suspense>

            <ProductGrid products={result.items} />

            <Pagination
              currentPage={result.page}
              totalPages={result.totalPages}
              searchParams={resolvedParams}
            />
          </div>
        </div>
      </Container>
    </>
  );
}
