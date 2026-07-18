"use client";

import {
  DIAMOND_ACTIVE_FILTER_CONFIGS,
} from "@/components/filters/ActiveFilterChips";
import { DiamondFilterPresets } from "@/components/filters/DiamondFilterPresets";
import {
  GradeInfoModal,
  type GradeInfoTopic,
} from "@/components/filters/GradeInfoModal";
import { GradeRangeSlider } from "@/components/filters/GradeRangeSlider";
import { ShapeFilterRow } from "@/components/filters/ShapeFilterRow";
import { Checkbox } from "@/components/ui/Checkbox";
import { FilterDrawer } from "@/components/ui/FilterDrawer";
import { Select } from "@/components/ui/Select";
import { CERTIFICATION_LABS } from "@/constants/certification";
import {
  AVAILABILITY_STATUSES,
  CLARITY_SLIDER_GRADES,
  COLOR_SLIDER_GRADES,
  CUT_SLIDER_GRADES,
  DIAMOND_FILTER_PRESETS,
  DIAMOND_TYPES,
  FINISH_GRADES,
  FLUORESCENCE_SLIDER_GRADES,
} from "@/constants/jewellery";
import { DIAMOND_PRESET_VALUES } from "@/lib/diamond-grades";
import { getParam, setParam } from "@/lib/searchParams";
import { cn, formatLabel } from "@/lib/utils";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";

const CERT_FILTER_OPTIONS = CERTIFICATION_LABS.filter((lab) =>
  ["GIA", "IGI", "HRD", "OTHER"].includes(lab),
).map((lab) => ({ value: lab, label: lab }));

function DiamondOriginToggle({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (type: string | null) => void;
}) {
  const t = useTranslations("ringBuilder");

  return (
    <div>
      <p className="mb-3 text-xs font-medium tracking-[0.2em] text-brand-navy/60 uppercase">
        {t("diamondOrigin")}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {DIAMOND_TYPES.map((type) => {
          const isActive = value === type;
          return (
            <button
              key={type}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(isActive ? null : type)}
              className={cn(
                "rounded-sm border px-3 py-2.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
                isActive
                  ? "border-brand-navy bg-brand-navy text-brand-ivory"
                  : "border-brand-gold/30 bg-white text-brand-navy hover:border-brand-gold/60",
              )}
            >
              {type === "natural" ? t("naturalDiamonds") : t("labDiamonds")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NumberPairInputs({
  minId,
  maxId,
  minLabel,
  maxLabel,
  minValue,
  maxValue,
  step,
  onMinBlur,
  onMaxBlur,
}: {
  minId: string;
  maxId: string;
  minLabel: string;
  maxLabel: string;
  minValue: string;
  maxValue: string;
  step?: string;
  onMinBlur: (value: string) => void;
  onMaxBlur: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <label
          htmlFor={minId}
          className="text-xs font-medium tracking-[0.2em] text-brand-navy/60 uppercase"
        >
          {minLabel}
        </label>
        <input
          id={minId}
          type="number"
          min={0}
          step={step}
          defaultValue={minValue}
          onBlur={(event) => onMinBlur(event.target.value)}
          className="w-full rounded-sm border border-brand-gold/30 bg-white px-3 py-2 text-sm text-brand-navy focus:border-brand-navy focus:outline-none"
        />
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor={maxId}
          className="text-xs font-medium tracking-[0.2em] text-brand-navy/60 uppercase"
        >
          {maxLabel}
        </label>
        <input
          id={maxId}
          type="number"
          min={0}
          step={step}
          defaultValue={maxValue}
          onBlur={(event) => onMaxBlur(event.target.value)}
          className="w-full rounded-sm border border-brand-gold/30 bg-white px-3 py-2 text-sm text-brand-navy focus:border-brand-navy focus:outline-none"
        />
      </div>
    </div>
  );
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group border-t border-brand-gold/15 pt-4"
    >
      <summary className="cursor-pointer list-none text-xs font-medium tracking-[0.2em] text-brand-navy/60 uppercase">
        <span className="flex items-center justify-between">
          {title}
          <span className="text-brand-gold transition-transform group-open:rotate-180">
            ▾
          </span>
        </span>
      </summary>
      <div className="mt-4 space-y-4">{children}</div>
    </details>
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
  const [infoTopic, setInfoTopic] = useState<GradeInfoTopic | null>(null);

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

  const applyParams = useCallback(
    (mutator: (next: URLSearchParams) => void) => {
      const next = new URLSearchParams(params.toString());
      mutator(next);
      next.delete("page");
      const query = next.toString();
      navigate(query ? `?${query}` : "");
    },
    [navigate, params],
  );

  const handleUpdate = useCallback(
    (key: string, value: string | null) => {
      applyParams((next) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
    },
    [applyParams],
  );

  const handleRange = useCallback(
    (minKey: string, maxKey: string, min: string | null, max: string | null) => {
      applyParams((next) => {
        next.delete("preset");
        if (minKey === "minCut") next.delete("cut");
        if (minKey === "minColor") next.delete("color");
        if (minKey === "minClarity") next.delete("clarity");
        if (min) next.set(minKey, min);
        else next.delete(minKey);
        if (max) next.set(maxKey, max);
        else next.delete(maxKey);
      });
    },
    [applyParams],
  );

  const handlePreset = useCallback(
    (preset: (typeof DIAMOND_FILTER_PRESETS)[number] | null) => {
      applyParams((next) => {
        [
          "minCut",
          "maxCut",
          "minColor",
          "maxColor",
          "minClarity",
          "maxClarity",
          "minFluorescence",
          "maxFluorescence",
          "cut",
          "color",
          "clarity",
          "preset",
        ].forEach((key) => next.delete(key));

        if (!preset) return;

        const values = DIAMOND_PRESET_VALUES[preset];
        next.set("preset", preset);
        next.set("minCut", values.minCut);
        next.set("maxCut", values.maxCut);
        next.set("minColor", values.minColor);
        next.set("maxColor", values.maxColor);
        next.set("minClarity", values.minClarity);
        next.set("maxClarity", values.maxClarity);
        if (values.minFluorescence) {
          next.set("minFluorescence", values.minFluorescence);
        }
        if (values.maxFluorescence) {
          next.set("maxFluorescence", values.maxFluorescence);
        }
      });
    },
    [applyParams],
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
    <div className="space-y-6">
      <DiamondOriginToggle
        value={params.get("diamondType")}
        onChange={(type) => handleUpdate("diamondType", type)}
      />

      <ShapeFilterRow
        label={tf("shape")}
        value={params.get("shape")}
        onChange={(shape) => handleUpdate("shape", shape)}
      />

      <NumberPairInputs
        minId="minCarat"
        maxId="maxCarat"
        minLabel={tf("minCarat")}
        maxLabel={tf("maxCarat")}
        minValue={params.get("minCarat") ?? ""}
        maxValue={params.get("maxCarat") ?? ""}
        step="0.01"
        onMinBlur={(value) => handleUpdate("minCarat", value || null)}
        onMaxBlur={(value) => handleUpdate("maxCarat", value || null)}
      />

      <NumberPairInputs
        minId="minPrice"
        maxId="maxPrice"
        minLabel={tf("minPrice")}
        maxLabel={tf("maxPrice")}
        minValue={params.get("minPrice") ?? ""}
        maxValue={params.get("maxPrice") ?? ""}
        onMinBlur={(value) => handleUpdate("minPrice", value || null)}
        onMaxBlur={(value) => handleUpdate("maxPrice", value || null)}
      />

      <DiamondFilterPresets
        activePreset={params.get("preset")}
        onSelect={handlePreset}
      />

      <GradeRangeSlider
        label={tf("cut")}
        grades={CUT_SLIDER_GRADES}
        minValue={params.get("minCut")}
        maxValue={params.get("maxCut")}
        onChange={(min, max) => handleRange("minCut", "maxCut", min, max)}
        onInfoClick={() => setInfoTopic("cut")}
      />

      <GradeRangeSlider
        label={tf("color")}
        grades={COLOR_SLIDER_GRADES}
        minValue={params.get("minColor")}
        maxValue={params.get("maxColor")}
        onChange={(min, max) => handleRange("minColor", "maxColor", min, max)}
        onInfoClick={() => setInfoTopic("color")}
      />

      <GradeRangeSlider
        label={tf("clarity")}
        grades={CLARITY_SLIDER_GRADES}
        minValue={params.get("minClarity")}
        maxValue={params.get("maxClarity")}
        onChange={(min, max) =>
          handleRange("minClarity", "maxClarity", min, max)
        }
        onInfoClick={() => setInfoTopic("clarity")}
      />

      <div>
        <p className="mb-3 text-xs font-medium tracking-[0.2em] text-brand-navy/60 uppercase">
          {tf("collections")}
        </p>
        <div className="space-y-2">
          <Checkbox
            id="collectionFlawless"
            label={tf("collectionFlawless")}
            checked={params.get("collectionFlawless") === "true"}
            onChange={(checked) =>
              handleUpdate("collectionFlawless", checked ? "true" : null)
            }
          />
          <Checkbox
            id="collectionBlockchain"
            label={tf("collectionBlockchain")}
            checked={params.get("collectionBlockchain") === "true"}
            onChange={(checked) =>
              handleUpdate("collectionBlockchain", checked ? "true" : null)
            }
          />
          <Checkbox
            id="collectionTrulyBrilliant"
            label={tf("collectionTrulyBrilliant")}
            checked={params.get("collectionTrulyBrilliant") === "true"}
            onChange={(checked) =>
              handleUpdate("collectionTrulyBrilliant", checked ? "true" : null)
            }
          />
        </div>
      </div>

      <CollapsibleSection title={tf("lwRatio")} defaultOpen>
        <div className="flex items-center justify-between">
          <p className="text-xs text-brand-charcoal/55">{tf("lwRatioHint")}</p>
          <button
            type="button"
            onClick={() => setInfoTopic("lwRatio")}
            className="flex h-4 w-4 items-center justify-center rounded-full border border-brand-gold/40 text-[10px] text-brand-navy/55"
            aria-label={tf("lwRatio")}
          >
            i
          </button>
        </div>
        <NumberPairInputs
          minId="minLwRatio"
          maxId="maxLwRatio"
          minLabel={tf("minRatio")}
          maxLabel={tf("maxRatio")}
          minValue={params.get("minLwRatio") ?? ""}
          maxValue={params.get("maxLwRatio") ?? ""}
          step="0.01"
          onMinBlur={(value) => handleUpdate("minLwRatio", value || null)}
          onMaxBlur={(value) => handleUpdate("maxLwRatio", value || null)}
        />
      </CollapsibleSection>

      <CollapsibleSection title={tf("fluorescence")}>
        <GradeRangeSlider
          label={tf("fluorescence")}
          grades={FLUORESCENCE_SLIDER_GRADES}
          minValue={params.get("minFluorescence")}
          maxValue={params.get("maxFluorescence")}
          onChange={(min, max) =>
            handleRange("minFluorescence", "maxFluorescence", min, max)
          }
        />
      </CollapsibleSection>

      <CollapsibleSection title={tf("polishSymmetry")}>
        <Select
          id="polish"
          label={tf("polish")}
          value={params.get("polish") ?? ""}
          placeholder={tf("allGrades")}
          options={FINISH_GRADES.map((grade) => ({
            value: grade,
            label: grade,
          }))}
          onChange={(value) => handleUpdate("polish", value || null)}
        />
        <Select
          id="symmetry"
          label={tf("symmetry")}
          value={params.get("symmetry") ?? ""}
          placeholder={tf("allGrades")}
          options={FINISH_GRADES.map((grade) => ({
            value: grade,
            label: grade,
          }))}
          onChange={(value) => handleUpdate("symmetry", value || null)}
        />
      </CollapsibleSection>

      <CollapsibleSection title={tf("tableDepth")}>
        <NumberPairInputs
          minId="minTable"
          maxId="maxTable"
          minLabel={tf("minTable")}
          maxLabel={tf("maxTable")}
          minValue={params.get("minTable") ?? ""}
          maxValue={params.get("maxTable") ?? ""}
          step="0.1"
          onMinBlur={(value) => handleUpdate("minTable", value || null)}
          onMaxBlur={(value) => handleUpdate("maxTable", value || null)}
        />
        <NumberPairInputs
          minId="minDepthPercent"
          maxId="maxDepthPercent"
          minLabel={tf("minDepth")}
          maxLabel={tf("maxDepth")}
          minValue={params.get("minDepthPercent") ?? ""}
          maxValue={params.get("maxDepthPercent") ?? ""}
          step="0.1"
          onMinBlur={(value) => handleUpdate("minDepthPercent", value || null)}
          onMaxBlur={(value) => handleUpdate("maxDepthPercent", value || null)}
        />
      </CollapsibleSection>

      <CollapsibleSection title={tf("report")}>
        <Select
          id="certificationLab"
          label={tf("certificate")}
          value={
            params.get("certificationLab") ?? params.get("certificateLab") ?? ""
          }
          placeholder={tf("allLabs")}
          options={CERT_FILTER_OPTIONS}
          onChange={(value) => handleUpdate("certificationLab", value || null)}
        />
        <Select
          id="availabilityStatus"
          label={tf("availability")}
          value={params.get("availabilityStatus") ?? ""}
          placeholder={tf("allAvailability")}
          options={AVAILABILITY_STATUSES.map((status) => ({
            value: status,
            label: formatLabel(status),
          }))}
          onChange={(value) =>
            handleUpdate("availabilityStatus", value || null)
          }
        />
      </CollapsibleSection>
    </div>
  );

  return (
    <>
      <div className={cn("hidden lg:block", className)}>
        <div className="sticky top-36 max-h-[calc(100vh-8rem)] space-y-6 overflow-y-auto pr-1">
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

      <GradeInfoModal
        topic={infoTopic}
        activeGrade={
          infoTopic === "cut"
            ? params.get("maxCut")
            : infoTopic === "color"
              ? params.get("maxColor")
              : infoTopic === "clarity"
                ? params.get("maxClarity")
                : null
        }
        onClose={() => setInfoTopic(null)}
      />
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
