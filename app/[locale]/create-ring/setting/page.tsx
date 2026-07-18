import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { Container } from "@/components/ui/Container";
import { Pagination } from "@/components/ui/Pagination";
import { CompatibilityNotice } from "@/components/ring-builder/CompatibilityNotice";
import { RingBuilderSteps } from "@/components/ring-builder/RingBuilderSteps";
import { RingSettingFilters } from "@/components/ring-builder/RingSettingFilters";
import { RingSettingGrid } from "@/components/ring-builder/RingSettingGrid";
import { SelectedDiamondSummary } from "@/components/ring-builder/SelectedDiamondSummary";
import type { Locale } from "@/constants/i18n";
import { generateLocalizedMetadata } from "@/lib/i18n-metadata";
import { getLocaleFromParamsAsync } from "@/lib/i18n";
import { getParam } from "@/lib/searchParams";
import { getDiamondById } from "@/services/diamond.service";
import {
  getRingSettings,
  parseRingSettingFilters,
} from "@/services/ring-setting.service";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return generateLocalizedMetadata(
    params,
    "/create-ring/setting",
    "createRingSettingTitle",
    "createRingSettingDescription",
  );
}

interface SettingPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CreateRingSettingPage({
  params,
  searchParams,
}: SettingPageProps) {
  const locale = (await getLocaleFromParamsAsync(params)) as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("ringBuilder");
  const tb = await getTranslations("breadcrumb");

  const resolvedParams = await searchParams;
  const diamondId = getParam(resolvedParams, "diamondId");
  const filters = parseRingSettingFilters(resolvedParams);

  const [result, selectedDiamond] = await Promise.all([
    getRingSettings(filters),
    diamondId ? getDiamondById(diamondId) : Promise.resolve(null),
  ]);

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: tb("home"), href: "/" },
          { label: tb("createRing"), href: "/create-ring" },
          { label: tb("setting") },
        ]}
      />
      <Container className="py-10 lg:py-14">
        <RingBuilderSteps current="setting" diamondId={diamondId} />

        <div className="max-w-2xl">
          <p className="section-eyebrow">{t("builderEyebrow")}</p>
          <h1 className="mt-2 font-serif text-3xl text-brand-navy sm:text-4xl">
            {t("settingTitle")}
          </h1>
          <p className="mt-3 text-sm text-brand-charcoal/65">
            {t("settingDescription")}
          </p>
        </div>

        {selectedDiamond && (
          <div className="mt-8 max-w-xl">
            <SelectedDiamondSummary diamond={selectedDiamond} />
            <CompatibilityNotice className="mt-4" variant="info">
              Select a setting compatible with your {selectedDiamond.shape}{" "}
              diamond.
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
              <RingSettingFilters />
            </Suspense>
          </aside>

          <div className="min-w-0 flex-1 space-y-6">
            <p className="text-sm text-brand-charcoal/60">
              {result.total}{" "}
              {result.total === 1 ? "setting" : "settings"} found
            </p>

            <RingSettingGrid
              settings={result.items}
              diamondId={diamondId}
              selectedDiamond={selectedDiamond}
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
