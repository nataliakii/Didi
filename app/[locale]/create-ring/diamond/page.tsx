import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { Container } from "@/components/ui/Container";
import { Pagination } from "@/components/ui/Pagination";
import {
  ActiveFilterChips,
  DIAMOND_ACTIVE_FILTER_CONFIGS,
} from "@/components/filters/ActiveFilterChips";
import { CompatibilityNotice } from "@/components/ring-builder/CompatibilityNotice";
import { RingBuilderDiamondGrid } from "@/components/ring-builder/RingBuilderDiamondGrid";
import { RingBuilderSteps } from "@/components/ring-builder/RingBuilderSteps";
import { SelectedSettingSummary } from "@/components/ring-builder/SelectedSettingSummary";
import { DiamondFilters, DiamondSortSelect } from "@/components/diamond/DiamondFilters";
import type { Locale } from "@/constants/i18n";
import { generateLocalizedMetadata } from "@/lib/i18n-metadata";
import { getLocaleFromParamsAsync } from "@/lib/i18n";
import { getCompatibleShapesLabel } from "@/lib/ring-builder";
import { getParam } from "@/lib/searchParams";
import {
  getDiamonds,
  parseDiamondFilters,
} from "@/services/diamond.service";
import { getRingSettingById } from "@/services/ring-setting.service";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return generateLocalizedMetadata(
    params,
    "/create-ring/diamond",
    "createRingDiamondTitle",
    "createRingDiamondDescription",
  );
}

interface DiamondPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CreateRingDiamondPage({
  params,
  searchParams,
}: DiamondPageProps) {
  const locale = (await getLocaleFromParamsAsync(params)) as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("ringBuilder");
  const tb = await getTranslations("breadcrumb");
  const tf = await getTranslations("filters");

  const resolvedParams = await searchParams;
  const settingId = getParam(resolvedParams, "settingId");
  const filters = parseDiamondFilters(resolvedParams);

  const selectedSetting = settingId
    ? await getRingSettingById(settingId)
    : null;

  if (selectedSetting) {
    filters.compatibleShapes = selectedSetting.compatibleDiamondShapes;
  }

  const result = await getDiamonds(filters);

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: tb("home"), href: "/" },
          { label: tb("createRing"), href: "/create-ring" },
          { label: tb("diamond") },
        ]}
      />
      <Container className="py-10 lg:py-14">
        <RingBuilderSteps current="diamond" settingId={settingId} />

        <div className="max-w-2xl">
          <h1 className="font-serif text-3xl text-brand-navy sm:text-4xl">
            {t("diamondTitle")}
          </h1>
          <p className="mt-3 text-sm text-brand-charcoal/65">
            {t("diamondDescription")}
          </p>
        </div>

        {selectedSetting && (
          <div className="mt-8 max-w-xl">
            <SelectedSettingSummary setting={selectedSetting} />
            <CompatibilityNotice className="mt-4" variant="info">
              Showing diamonds compatible with your selected setting (
              {getCompatibleShapesLabel(selectedSetting.compatibleDiamondShapes)}
              ).
            </CompatibilityNotice>
          </div>
        )}

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:gap-12">
          <aside className="w-full shrink-0 lg:w-72">
            <Suspense
              fallback={
                <div className="h-96 animate-pulse rounded-sm bg-brand-cream" />
              }
            >
              <DiamondFilters preserveKeys={["settingId", "diamondId"]} />
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
                  {result.total}{" "}
                  {result.total === 1 ? "diamond" : "diamonds"} found
                </p>
                <DiamondSortSelect />
              </div>
              <ActiveFilterChips
                configs={DIAMOND_ACTIVE_FILTER_CONFIGS}
                preserveKeys={["settingId", "diamondId"]}
                resetLabel={tf("resetAll")}
              />
            </Suspense>

            <RingBuilderDiamondGrid
              diamonds={result.items}
              settingId={settingId}
              selectedSetting={selectedSetting}
              locale={locale}
            />

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
