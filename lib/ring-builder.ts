import { RING_SIZES, type Metal } from "@/constants/jewellery";
import { DEFAULT_LOCALE, type Locale } from "@/constants/i18n";
import { localizePath } from "@/lib/i18n";
import type {
  CustomRingPriceBreakdown,
  DiamondDetail,
  DiamondShape,
  RingBuilderParams,
  RingSettingDetail,
} from "@/types";

export function isDiamondCompatibleWithSetting(
  setting: Pick<RingSettingDetail, "compatibleDiamondShapes">,
  diamond: Pick<DiamondDetail, "shape">,
): boolean {
  return setting.compatibleDiamondShapes.includes(diamond.shape);
}

export function isMetalAvailableForSetting(
  setting: Pick<RingSettingDetail, "availableMetals">,
  metal: Metal,
): boolean {
  return setting.availableMetals.includes(metal);
}

export function getMetalAdjustment(metal: Metal): number {
  void metal;
  return 0;
}

export function calculateCustomRingPrice(
  setting: Pick<RingSettingDetail, "basePrice">,
  diamond: Pick<DiamondDetail, "price" | "salePrice">,
  selectedMetal?: Metal,
): CustomRingPriceBreakdown {
  const settingPrice = setting.basePrice;
  const diamondPrice = diamond.salePrice ?? diamond.price;
  const metalAdjustment = selectedMetal ? getMetalAdjustment(selectedMetal) : 0;

  return {
    settingPrice,
    diamondPrice,
    metalAdjustment,
    finalPrice: settingPrice + diamondPrice + metalAdjustment,
  };
}

export function getAvailableRingSizes(
  setting: Pick<RingSettingDetail, "minRingSize" | "maxRingSize">,
): string[] {
  const minIndex = RING_SIZES.indexOf(
    setting.minRingSize as (typeof RING_SIZES)[number],
  );
  const maxIndex = RING_SIZES.indexOf(
    setting.maxRingSize as (typeof RING_SIZES)[number],
  );

  if (minIndex === -1 || maxIndex === -1) {
    return [...RING_SIZES];
  }

  const start = Math.min(minIndex, maxIndex);
  const end = Math.max(minIndex, maxIndex);
  return RING_SIZES.slice(start, end + 1) as unknown as string[];
}

function buildQuery(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export function buildRingReviewHref(
  params: RingBuilderParams,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return localizePath(
    locale,
    `/create-ring/review${buildQuery({
      settingId: params.settingId,
      diamondId: params.diamondId,
      metal: params.metal,
      ringSize: params.ringSize,
    })}`,
  );
}

const RING_BUILDER_KEYS = new Set([
  "settingId",
  "diamondId",
  "metal",
  "ringSize",
]);

function buildRingStepHref(
  path: "/create-ring/setting" | "/create-ring/diamond",
  params: RingBuilderParams & Record<string, string | undefined>,
  keepKey: "diamondId" | "settingId",
  locale: Locale = DEFAULT_LOCALE,
): string {
  const query: Record<string, string | undefined> = {};
  const keepValue = params[keepKey];
  if (keepValue) query[keepKey] = keepValue;

  for (const [key, value] of Object.entries(params)) {
    if (value && !RING_BUILDER_KEYS.has(key)) {
      query[key] = value;
    }
  }

  return localizePath(locale, `${path}${buildQuery(query)}`);
}

export function buildRingSettingHref(
  params: RingBuilderParams & Record<string, string | undefined>,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return buildRingStepHref("/create-ring/setting", params, "diamondId", locale);
}

export function buildRingDiamondHref(
  params: RingBuilderParams & Record<string, string | undefined>,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return buildRingStepHref("/create-ring/diamond", params, "settingId", locale);
}

export function buildAppointmentHref(
  params: RingBuilderParams,
  locale: Locale = DEFAULT_LOCALE,
): string {
  return localizePath(
    locale,
    `/appointment${buildQuery({
      settingId: params.settingId,
      diamondId: params.diamondId,
      metal: params.metal,
      ringSize: params.ringSize,
    })}`,
  );
}

export function getCompatibleShapesLabel(shapes: DiamondShape[]): string {
  return shapes
    .map((shape) => shape.charAt(0).toUpperCase() + shape.slice(1))
    .join(", ");
}
