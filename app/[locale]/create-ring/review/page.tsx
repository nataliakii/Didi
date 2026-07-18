import { AddCustomRingToCartPanel } from "@/components/cart/AddCustomRingToCartPanel";
import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { EmptyState } from "@/components/ui/EmptyState";
import { PriceDisplay } from "@/components/ui/PriceDisplay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CompatibilityNotice } from "@/components/ring-builder/CompatibilityNotice";
import { MetalSelector } from "@/components/ring-builder/MetalSelector";
import { RingBuilderSteps } from "@/components/ring-builder/RingBuilderSteps";
import { RingPriceSummary } from "@/components/ring-builder/RingPriceSummary";
import { RingSizeSelector } from "@/components/ring-builder/RingSizeSelector";
import { SelectedDiamondSummary } from "@/components/ring-builder/SelectedDiamondSummary";
import { SelectedSettingSummary } from "@/components/ring-builder/SelectedSettingSummary";
import { METALS } from "@/constants/jewellery";
import {
  buildAppointmentHref,
  buildRingDiamondHref,
  buildRingSettingHref,
  calculateCustomRingPrice,
  getAvailableRingSizes,
  isDiamondCompatibleWithSetting,
  isMetalAvailableForSetting,
} from "@/lib/ring-builder";
import { generateLocalizedMetadata } from "@/lib/i18n-metadata";
import { getLocaleFromParamsAsync } from "@/lib/i18n";
import { getParam } from "@/lib/searchParams";
import { formatLabel } from "@/lib/utils";
import { getDiamondById } from "@/services/diamond.service";
import { getRingSettingById } from "@/services/ring-setting.service";
import type { Metal } from "@/constants/jewellery";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

interface ReviewPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return generateLocalizedMetadata(
    params,
    "/create-ring/review",
    "createRingReviewTitle",
    "createRingReviewDescription",
  );
}

function isValidMetal(value: string | undefined): value is Metal {
  return Boolean(value && METALS.includes(value as Metal));
}

export default async function CreateRingReviewPage({
  params,
  searchParams,
}: ReviewPageProps) {
  const locale = await getLocaleFromParamsAsync(params);
  setRequestLocale(locale);
  const t = await getTranslations("ringBuilder");
  const tb = await getTranslations("breadcrumb");
  const resolvedParams = await searchParams;
  const settingId = getParam(resolvedParams, "settingId");
  const diamondId = getParam(resolvedParams, "diamondId");
  const metalParam = getParam(resolvedParams, "metal");
  const ringSize = getParam(resolvedParams, "ringSize");

  const breadcrumbItems = [
    { label: tb("home"), href: "/" as const },
    { label: tb("createRing"), href: "/create-ring" as const },
    { label: tb("review") },
  ];

  if (!settingId || !diamondId) {
    return (
      <>
        <PageBreadcrumb items={breadcrumbItems} />
        <Container className="py-12 lg:py-16">
        <RingBuilderSteps current="review" />
        <EmptyState
          title="Your ring is not complete yet"
          description="Choose both a ring setting and a diamond to review your custom ring."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/create-ring/setting">Choose Setting</Button>
              <Button href="/create-ring/diamond" variant="outline">
                Choose Diamond
              </Button>
            </div>
          }
        />
      </Container>
      </>
    );
  }

  const [setting, diamond] = await Promise.all([
    getRingSettingById(settingId),
    getDiamondById(diamondId),
  ]);

  if (!setting || !diamond) {
    return (
      <>
        <PageBreadcrumb items={breadcrumbItems} />
        <Container className="py-12 lg:py-16">
        <RingBuilderSteps current="review" settingId={settingId} diamondId={diamondId} />
        <EmptyState
          title="Invalid selection"
          description="The selected setting or diamond could not be found. Please start again."
          action={
            <Button href="/create-ring">Start Over</Button>
          }
        />
      </Container>
      </>
    );
  }

  if (!isDiamondCompatibleWithSetting(setting, diamond)) {
    return (
      <>
        <PageBreadcrumb items={breadcrumbItems} />
        <Container className="py-12 lg:py-16">
        <RingBuilderSteps current="review" settingId={settingId} diamondId={diamondId} />
        <CompatibilityNotice variant="error" className="max-w-xl">
          This setting and diamond are not compatible. The {diamond.shape} diamond
          does not match the shapes supported by this setting.
        </CompatibilityNotice>
        <div className="mt-6 flex gap-3">
          <Button href={buildRingSettingHref({ diamondId }, locale)} variant="outline">
            Change Setting
          </Button>
          <Button href={buildRingDiamondHref({ settingId }, locale)} variant="outline">
            Change Diamond
          </Button>
        </div>
      </Container>
      </>
    );
  }

  const selectedMetal = isValidMetal(metalParam) &&
    isMetalAvailableForSetting(setting, metalParam)
      ? metalParam
      : undefined;

  const availableSizes = getAvailableRingSizes(setting);
  const selectedRingSize =
    ringSize && availableSizes.includes(ringSize) ? ringSize : undefined;

  const priceBreakdown = calculateCustomRingPrice(
    setting,
    diamond,
    selectedMetal,
  );

  const canBookAppointment = Boolean(selectedMetal && selectedRingSize);

  return (
    <>
      <PageBreadcrumb items={breadcrumbItems} />
      <Container className="py-12 lg:py-16">
      <RingBuilderSteps
        current="review"
        settingId={settingId}
        diamondId={diamondId}
        metal={selectedMetal}
        ringSize={selectedRingSize}
      />

      <div className="max-w-2xl">
        <p className="section-eyebrow">{t("builderEyebrow")}</p>
        <h1 className="mt-2 font-serif text-3xl text-brand-navy sm:text-4xl">
          {t("reviewTitle")}
        </h1>
        <p className="mt-4 leading-relaxed text-brand-charcoal/70">
          {t("reviewDescription")}
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <SelectedSettingSummary setting={setting} />
          <SelectedDiamondSummary diamond={diamond} />

          <div className="card-luxury p-4 text-sm">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={diamond.availabilityStatus} />
              {setting.isFeatured && (
                <StatusBadge status="featured" label="Featured Setting" variant="info" />
              )}
            </div>
            {setting.productionTime && (
              <p className="mt-3 text-brand-charcoal/55">
                Estimated production time: {setting.productionTime}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <Suspense fallback={<div className="h-24 animate-pulse rounded-sm bg-brand-cream" />}>
            <MetalSelector
              availableMetals={setting.availableMetals}
              selectedMetal={selectedMetal}
            />
          </Suspense>

          <Suspense fallback={<div className="h-24 animate-pulse rounded-sm bg-brand-cream" />}>
            <RingSizeSelector
              availableSizes={availableSizes}
              selectedRingSize={selectedRingSize}
            />
          </Suspense>

          <RingPriceSummary breakdown={priceBreakdown} />

          <div className="space-y-3">
            <AddCustomRingToCartPanel
              setting={setting}
              diamond={diamond}
              selectedMetal={selectedMetal}
              selectedRingSize={selectedRingSize}
              price={priceBreakdown.finalPrice}
              canAdd={canBookAppointment}
            />

            {canBookAppointment ? (
              <Button
                href={buildAppointmentHref(
                  {
                    settingId,
                    diamondId,
                    metal: selectedMetal,
                    ringSize: selectedRingSize,
                  },
                  locale,
                )}
                variant="outline"
                className="w-full"
              >
                {t("bookAppointmentWithRing")}
              </Button>
            ) : (
              <p className="text-center text-sm text-brand-charcoal/55">
                Please choose metal and ring size first.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 border-t border-brand-gold/20 pt-6">
            <Button
              href={buildRingSettingHref({ settingId, diamondId }, locale)}
              variant="ghost"
              size="sm"
            >
              Change Setting
            </Button>
            <Button
              href={buildRingDiamondHref({ settingId, diamondId }, locale)}
              variant="ghost"
              size="sm"
            >
              Change Diamond
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-sm border border-brand-gold/20 bg-brand-cream/50 p-6 lg:hidden">
        <p className="text-sm text-brand-charcoal/55">Final Price</p>
        <PriceDisplay
          price={priceBreakdown.finalPrice}
          size="lg"
          className="mt-1"
        />
        {selectedMetal && (
          <p className="mt-2 text-sm text-brand-charcoal/65">
            Metal: {formatLabel(selectedMetal)}
            {selectedRingSize && ` · Size: ${selectedRingSize}`}
          </p>
        )}
      </div>
    </Container>
    </>
  );
}
