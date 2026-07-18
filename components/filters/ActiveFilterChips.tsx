"use client";

import { cn, formatLabel } from "@/lib/utils";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";

export interface ActiveFilterConfig {
  key: string;
  label: string;
  formatValue?: (value: string) => string;
}

interface ActiveFilterChipsProps {
  configs: ActiveFilterConfig[];
  preserveKeys?: string[];
  resetLabel?: string;
  className?: string;
}

function formatDefaultValue(key: string, value: string): string {
  if (key.startsWith("min") || key.startsWith("max")) {
    const prefix = key.startsWith("min") ? "Min" : "Max";
    const field = key.replace(/^(min|max)/, "");
    return `${prefix} ${formatLabel(field)}: ${value}`;
  }
  if (value === "true") return formatLabel(key);
  return formatLabel(value);
}

export function ActiveFilterChips({
  configs,
  preserveKeys = [],
  resetLabel,
  className,
}: ActiveFilterChipsProps) {
  const tf = useTranslations("filters");
  const resolvedResetLabel = resetLabel ?? tf("resetAll");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramsString = searchParams.toString();
  const params = useMemo(
    () => new URLSearchParams(paramsString),
    [paramsString],
  );

  const activeFilters = useMemo(() => {
    const items: { key: string; value: string; label: string }[] = [];

    for (const config of configs) {
      const value = params.get(config.key);
      if (!value || value === "false") continue;
      items.push({
        key: config.key,
        value,
        label: config.formatValue
          ? config.formatValue(value)
          : formatDefaultValue(config.key, value),
      });
    }

    return items;
  }, [configs, params]);

  const navigate = useCallback(
    (next: URLSearchParams) => {
      const query = next.toString();
      router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    },
    [pathname, router],
  );

  const removeFilter = (key: string) => {
    const next = new URLSearchParams(params.toString());
    next.delete(key);
    next.delete("page");
    navigate(next);
  };

  const resetAll = () => {
    const next = new URLSearchParams();
    for (const key of preserveKeys) {
      const value = params.get(key);
      if (value) next.set(key, value);
    }
    navigate(next);
  };

  if (activeFilters.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {activeFilters.map((filter) => (
        <button
          key={`${filter.key}-${filter.value}`}
          type="button"
          onClick={() => removeFilter(filter.key)}
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/40 bg-brand-cream/60 px-3 py-1 text-xs text-brand-navy transition-colors hover:border-brand-navy/30"
        >
          <span>{filter.label}</span>
          <span className="text-brand-navy/50" aria-hidden="true">
            ×
          </span>
          <span className="sr-only">Remove {filter.label} filter</span>
        </button>
      ))}
      <button
        type="button"
        onClick={resetAll}
        className="text-xs tracking-wide text-brand-navy/50 underline-offset-2 hover:text-brand-navy hover:underline"
      >
        {resolvedResetLabel}
      </button>
    </div>
  );
}

/** Keys cleared by reset — exported for filter sidebars */
export const DIAMOND_FILTER_PARAM_KEYS = [
  "diamondType",
  "shape",
  "minCarat",
  "maxCarat",
  "minPrice",
  "maxPrice",
  "cut",
  "color",
  "clarity",
  "minCut",
  "maxCut",
  "minColor",
  "maxColor",
  "minClarity",
  "maxClarity",
  "minFluorescence",
  "maxFluorescence",
  "polish",
  "symmetry",
  "minLwRatio",
  "maxLwRatio",
  "minTable",
  "maxTable",
  "minDepthPercent",
  "maxDepthPercent",
  "collectionFlawless",
  "collectionBlockchain",
  "collectionTrulyBrilliant",
  "preset",
  "certificationLab",
  "certificateLab",
  "availabilityStatus",
  "sort",
  "page",
] as const;

export const PRODUCT_FILTER_PARAM_KEYS = [
  "search",
  "category",
  "productType",
  "minPrice",
  "maxPrice",
  "metal",
  "stoneType",
  "diamondShape",
  "style",
  "availabilityStatus",
  "isReadyToShip",
  "isFeatured",
  "isBestSeller",
  "sort",
  "page",
] as const;

export const DIAMOND_ACTIVE_FILTER_CONFIGS: ActiveFilterConfig[] = [
  { key: "shape", label: "Shape", formatValue: formatLabel },
  { key: "preset", label: "Preset", formatValue: formatLabel },
  { key: "minCut", label: "Cut from" },
  { key: "maxCut", label: "Cut to" },
  { key: "minColor", label: "Color from" },
  { key: "maxColor", label: "Color to" },
  { key: "minClarity", label: "Clarity from" },
  { key: "maxClarity", label: "Clarity to" },
  { key: "minFluorescence", label: "Fluorescence from" },
  { key: "maxFluorescence", label: "Fluorescence to" },
  { key: "color", label: "Color" },
  { key: "cut", label: "Cut" },
  { key: "clarity", label: "Clarity" },
  { key: "diamondType", label: "Type", formatValue: formatLabel },
  { key: "polish", label: "Polish" },
  { key: "symmetry", label: "Symmetry" },
  {
    key: "collectionFlawless",
    label: "Flawless Collection",
    formatValue: () => "Flawless Collection",
  },
  {
    key: "collectionBlockchain",
    label: "Blockchain Enabled",
    formatValue: () => "Blockchain Enabled",
  },
  {
    key: "collectionTrulyBrilliant",
    label: "Truly Brilliant",
    formatValue: () => "Truly Brilliant",
  },
  {
    key: "minLwRatio",
    label: "Min L:W",
    formatValue: (v) => `L:W ≥ ${v}`,
  },
  {
    key: "maxLwRatio",
    label: "Max L:W",
    formatValue: (v) => `L:W ≤ ${v}`,
  },
  {
    key: "certificationLab",
    label: "Certificate",
    formatValue: (v) => v,
  },
  {
    key: "availabilityStatus",
    label: "Availability",
    formatValue: formatLabel,
  },
  {
    key: "minCarat",
    label: "Min carat",
    formatValue: (v) => `${v} ct min`,
  },
  {
    key: "maxCarat",
    label: "Max carat",
    formatValue: (v) => `${v} ct max`,
  },
  {
    key: "minPrice",
    label: "Min price",
    formatValue: (v) => `From $${v}`,
  },
  {
    key: "maxPrice",
    label: "Max price",
    formatValue: (v) => `Up to $${v}`,
  },
];

export const PRODUCT_ACTIVE_FILTER_CONFIGS: ActiveFilterConfig[] = [
  { key: "search", label: "Search", formatValue: (v) => `"${v}"` },
  { key: "productType", label: "Type", formatValue: formatLabel },
  { key: "metal", label: "Metal", formatValue: formatLabel },
  { key: "diamondShape", label: "Shape", formatValue: formatLabel },
  { key: "style", label: "Style", formatValue: formatLabel },
  { key: "stoneType", label: "Stone", formatValue: formatLabel },
  {
    key: "availabilityStatus",
    label: "Availability",
    formatValue: formatLabel,
  },
  { key: "isReadyToShip", label: "Ready to ship", formatValue: () => "Ready to ship" },
  { key: "isFeatured", label: "Featured", formatValue: () => "Featured" },
  { key: "isBestSeller", label: "Best seller", formatValue: () => "Best seller" },
  {
    key: "minPrice",
    label: "Min price",
    formatValue: (v) => `From $${v}`,
  },
  {
    key: "maxPrice",
    label: "Max price",
    formatValue: (v) => `Up to $${v}`,
  },
];
