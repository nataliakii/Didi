"use client";

import {
  DIAMOND_ACTIVE_FILTER_CONFIGS,
} from "@/components/filters/ActiveFilterChips";
import { FilterChipGroup } from "@/components/filters/FilterChipGroup";
import { ShapeFilterRow } from "@/components/filters/ShapeFilterRow";
import { FilterDrawer } from "@/components/ui/FilterDrawer";
import { Select } from "@/components/ui/Select";
import { CERTIFICATION_LABS } from "@/constants/certification";
import {
  AVAILABILITY_STATUSES,
  DIAMOND_CLARITY,
  DIAMOND_CUTS,
  DIAMOND_TYPES,
} from "@/constants/jewellery";
import { getParam, setParam } from "@/lib/searchParams";
import { cn, formatLabel } from "@/lib/utils";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";

const FILTER_COLOR_OPTIONS = ["D", "E", "F", "G", "H", "I", "J", "K"].map(
  (color) => ({ value: color, label: color }),
);

const FILTER_CUT_OPTIONS = DIAMOND_CUTS.filter((cut) =>
  ["Excellent", "Very Good", "Good", "Fair"].includes(cut),
).map((cut) => ({ value: cut, label: cut }));

const CERT_FILTER_OPTIONS = CERTIFICATION_LABS.filter((lab) =>
  ["GIA", "IGI", "HRD", "OTHER"].includes(lab),
).map((lab) => ({ value: lab, label: lab }));

function AdvancedFilterFields({
  params,
  onUpdate,
}: {
  params: URLSearchParams;
  onUpdate: (key: string, value: string | null) => void;
}) {
  return (
    <div className="space-y-6 border-t border-brand-gold/15 pt-6">
      <Select
        id="diamondType"
        label="Diamond Type"
        value={params.get("diamondType") ?? ""}
        placeholder="All types"
        options={DIAMOND_TYPES.map((type) => ({
          value: type,
          label: formatLabel(type),
        }))}
        onChange={(value) => onUpdate("diamondType", value || null)}
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="minCarat"
            className="text-xs font-medium tracking-[0.2em] text-brand-navy/60 uppercase"
          >
            Min Carat
          </label>
          <input
            id="minCarat"
            type="number"
            min={0}
            step={0.01}
            defaultValue={params.get("minCarat") ?? ""}
            onBlur={(event) =>
              onUpdate("minCarat", event.target.value || null)
            }
            className="w-full rounded-sm border border-brand-gold/30 bg-white px-3 py-2 text-sm text-brand-navy focus:border-brand-navy focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="maxCarat"
            className="text-xs font-medium tracking-[0.2em] text-brand-navy/60 uppercase"
          >
            Max Carat
          </label>
          <input
            id="maxCarat"
            type="number"
            min={0}
            step={0.01}
            defaultValue={params.get("maxCarat") ?? ""}
            onBlur={(event) =>
              onUpdate("maxCarat", event.target.value || null)
            }
            className="w-full rounded-sm border border-brand-gold/30 bg-white px-3 py-2 text-sm text-brand-navy focus:border-brand-navy focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="minPrice"
            className="text-xs font-medium tracking-[0.2em] text-brand-navy/60 uppercase"
          >
            Min Price
          </label>
          <input
            id="minPrice"
            type="number"
            min={0}
            defaultValue={params.get("minPrice") ?? ""}
            onBlur={(event) =>
              onUpdate("minPrice", event.target.value || null)
            }
            className="w-full rounded-sm border border-brand-gold/30 bg-white px-3 py-2 text-sm text-brand-navy focus:border-brand-navy focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="maxPrice"
            className="text-xs font-medium tracking-[0.2em] text-brand-navy/60 uppercase"
          >
            Max Price
          </label>
          <input
            id="maxPrice"
            type="number"
            min={0}
            defaultValue={params.get("maxPrice") ?? ""}
            onBlur={(event) =>
              onUpdate("maxPrice", event.target.value || null)
            }
            className="w-full rounded-sm border border-brand-gold/30 bg-white px-3 py-2 text-sm text-brand-navy focus:border-brand-navy focus:outline-none"
          />
        </div>
      </div>

      <Select
        id="clarity"
        label="Clarity"
        value={params.get("clarity") ?? ""}
        placeholder="All clarity"
        options={DIAMOND_CLARITY.map((clarity) => ({
          value: clarity,
          label: clarity,
        }))}
        onChange={(value) => onUpdate("clarity", value || null)}
      />

      <Select
        id="availabilityStatus"
        label="Availability"
        value={params.get("availabilityStatus") ?? ""}
        placeholder="All availability"
        options={AVAILABILITY_STATUSES.map((status) => ({
          value: status,
          label: formatLabel(status),
        }))}
        onChange={(value) => onUpdate("availabilityStatus", value || null)}
      />
    </div>
  );
}

function VisualFilterFields({
  params,
  onUpdate,
}: {
  params: URLSearchParams;
  onUpdate: (key: string, value: string | null) => void;
}) {
  const tf = useTranslations("filters");

  return (
    <div className="space-y-6">
      <ShapeFilterRow
        label={tf("shape")}
        value={params.get("shape")}
        onChange={(shape) => onUpdate("shape", shape)}
      />

      <FilterChipGroup
        label={tf("color")}
        options={[
          ...FILTER_COLOR_OPTIONS,
          {
            value: "fancy",
            label: "Fancy",
            disabled: true,
            disabledTitle: tf("fancyColorComingSoon"),
          },
        ]}
        value={params.get("color")}
        onChange={(value) => onUpdate("color", value)}
      />

      <FilterChipGroup
        label={tf("cut")}
        options={FILTER_CUT_OPTIONS}
        value={params.get("cut")}
        onChange={(value) => onUpdate("cut", value)}
      />

      <FilterChipGroup
        label={tf("certificate")}
        options={CERT_FILTER_OPTIONS}
        value={
          params.get("certificationLab") ?? params.get("certificateLab")
        }
        onChange={(value) => onUpdate("certificationLab", value)}
      />
    </div>
  );
}

export function DiamondFilters({
  className,
  preserveKeys = [],
}: {
  className?: string;
  preserveKeys?: string[];
}) {
  const tf = useTranslations("filters");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const paramsString = searchParams.toString();
  const params = useMemo(
    () => new URLSearchParams(paramsString),
    [paramsString],
  );

  const navigate = useCallback(
    (query: string) => {
      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [pathname, router],
  );

  const handleUpdate = useCallback(
    (key: string, value: string | null) => {
      navigate(setParam(params, key, value));
    },
    [navigate, params],
  );

  const handleClear = () => {
    const next = new URLSearchParams();
    for (const key of preserveKeys) {
      const value = params.get(key);
      if (value) next.set(key, value);
    }
    const query = next.toString();
    navigate(query ? `?${query}` : "");
    setDrawerOpen(false);
  };

  const filterContent = (
    <>
      <VisualFilterFields params={params} onUpdate={handleUpdate} />
      <AdvancedFilterFields params={params} onUpdate={handleUpdate} />
    </>
  );

  return (
    <>
      <div className={cn("hidden lg:block", className)}>
        <div className="sticky top-36 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium tracking-[0.2em] text-brand-navy uppercase">
              {tf("filters")}
            </h2>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-brand-navy/50 hover:text-brand-navy"
            >
              {tf("resetAll")}
            </button>
          </div>
          {filterContent}
        </div>
      </div>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="rounded-sm border border-brand-gold/30 px-4 py-2 text-sm text-brand-navy hover:bg-brand-cream/50"
        >
          {tf("filters")}
        </button>
        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={tf("filterDiamonds")}
        >
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-brand-navy/50 hover:text-brand-navy"
            >
              {tf("resetAll")}
            </button>
          </div>
          {filterContent}
        </FilterDrawer>
      </div>
    </>
  );
}

export { DIAMOND_ACTIVE_FILTER_CONFIGS };

export function DiamondSortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramsString = searchParams.toString();
  const params = useMemo(
    () => new URLSearchParams(paramsString),
    [paramsString],
  );

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "carat-asc", label: "Carat: Low to High" },
    { value: "carat-desc", label: "Carat: High to Low" },
  ];

  return (
    <Select
      id="sort"
      label="Sort by"
      value={getParam(Object.fromEntries(params), "sort") ?? "newest"}
      options={sortOptions}
      onChange={(value) => {
        router.replace(
          `${pathname}${setParam(params, "sort", value === "newest" ? null : value)}`,
          { scroll: false },
        );
      }}
      className="min-w-[180px]"
    />
  );
}
