import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { Container } from "@/components/ui/Container";
import { Pagination } from "@/components/ui/Pagination";
import {
  ActiveFilterChips,
  DIAMOND_ACTIVE_FILTER_CONFIGS,
} from "@/components/filters/ActiveFilterChips";
import { DiamondFilters, DiamondSortSelect } from "@/components/diamond/DiamondFilters";
import { DiamondGrid } from "@/components/diamond/DiamondGrid";
import { generateLocalizedMetadata } from "@/lib/i18n-metadata";
import { getDiamonds, parseDiamondFilters } from "@/services/diamond.service";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return generateLocalizedMetadata(
    params,
    "/diamonds",
    "diamondsTitle",
    "diamondsDescription",
  );
}

interface DiamondsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DiamondsPage({
  params,
  searchParams,
}: DiamondsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("diamonds");
  const tb = await getTranslations("breadcrumb");
  const tf = await getTranslations("filters");
  const resolvedParams = await searchParams;
  const filters = parseDiamondFilters(resolvedParams);
  const result = await getDiamonds(filters);

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: tb("home"), href: "/" },
          { label: tb("looseDiamonds") },
        ]}
      />
      <Container className="py-10 lg:py-14">
        <div className="max-w-2xl">
          <p className="section-eyebrow">{t("pageEyebrow")}</p>
          <h1 className="mt-2 font-serif text-3xl text-brand-navy sm:text-4xl">
            {t("pageTitle")}
          </h1>
        </div>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:gap-12">
          <aside className="w-full shrink-0 lg:w-72">
            <Suspense
              fallback={
                <div className="h-96 animate-pulse rounded-sm bg-brand-cream" />
              }
            >
              <DiamondFilters />
            </Suspense>
          </aside>

          <div className="min-w-0 flex-1 space-y-6">
            <Suspense
              fallback={
                <div className="h-10 w-48 animate-pulse rounded-sm bg-brand-cream" />
              }
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <p className="text-sm text-brand-charcoal/60">
                  {t("resultsCount", { count: result.total })}
                </p>
                <DiamondSortSelect />
              </div>
              <ActiveFilterChips
                configs={DIAMOND_ACTIVE_FILTER_CONFIGS}
                resetLabel={tf("resetAll")}
                className="mt-2"
              />
            </Suspense>

            <DiamondGrid diamonds={result.items} />

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
