"use client";

import { ShapeFilterRow } from "@/components/filters/ShapeFilterRow";
import { MetalFilterChips } from "@/components/ring-builder/MetalFilterChips";
import { RingStylePicker } from "@/components/ring-builder/RingStylePicker";
import { FilterDrawer } from "@/components/ui/FilterDrawer";
import { setParam } from "@/lib/searchParams";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";

function FilterFields({
  params,
  onUpdate,
  showStylePicker = true,
}: {
  params: URLSearchParams;
  onUpdate: (key: string, value: string | null) => void;
  showStylePicker?: boolean;
}) {
  const t = useTranslations("ringBuilder");
  const tf = useTranslations("filters");

  return (
    <div className="space-y-8">
      {showStylePicker && (
        <RingStylePicker
          value={params.get("style")}
          onChange={(style) => onUpdate("style", style)}
        />
      )}

      <MetalFilterChips
        value={params.get("metal")}
        onChange={(metal) => onUpdate("metal", metal)}
      />

      <ShapeFilterRow
        label={t("compatibleShape")}
        value={params.get("compatibleShape")}
        onChange={(shape) => onUpdate("compatibleShape", shape)}
      />

      <div>
        <p className="mb-3 text-xs font-medium tracking-[0.2em] text-brand-navy/60 uppercase">
          {tf("priceRange")}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label
              htmlFor="minPrice"
              className="text-xs text-brand-charcoal/55"
            >
              {tf("minPrice")}
            </label>
            <input
              id="minPrice"
              type="number"
              min={0}
              defaultValue={params.get("minPrice") ?? ""}
              onBlur={(event) =>
                onUpdate("minPrice", event.target.value || null)
              }
              className="w-full rounded-sm border border-brand-gold/30 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="maxPrice"
              className="text-xs text-brand-charcoal/55"
            >
              {tf("maxPrice")}
            </label>
            <input
              id="maxPrice"
              type="number"
              min={0}
              defaultValue={params.get("maxPrice") ?? ""}
              onBlur={(event) =>
                onUpdate("maxPrice", event.target.value || null)
              }
              className="w-full rounded-sm border border-brand-gold/30 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function RingSettingFilters({ className }: { className?: string }) {
  const t = useTranslations("ringBuilder");
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

  const handleClearFilters = () => {
    const next = new URLSearchParams();
    const settingId = params.get("settingId");
    const diamondId = params.get("diamondId");
    if (settingId) next.set("settingId", settingId);
    if (diamondId) next.set("diamondId", diamondId);
    const query = next.toString();
    navigate(query ? `?${query}` : "");
    setDrawerOpen(false);
  };

  return (
    <>
      <div className={cn("hidden lg:block", className)}>
        <div className="sticky top-24 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-brand-navy">{tf("filters")}</h2>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-brand-charcoal/55 hover:text-brand-navy"
            >
              {tf("resetAll")}
            </button>
          </div>
          <FilterFields params={params} onUpdate={handleUpdate} />
        </div>
      </div>

      <div className="space-y-4 lg:hidden">
        <RingStylePicker
          value={params.get("style")}
          onChange={(style) => handleUpdate("style", style)}
        />
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="rounded-sm border border-brand-gold/30 px-4 py-2 text-sm text-brand-charcoal/75 hover:bg-brand-cream/50"
        >
          {t("moreFilters")}
        </button>
        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={t("filterSettings")}
        >
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-brand-charcoal/55 hover:text-brand-navy"
            >
              {tf("resetAll")}
            </button>
          </div>
          <FilterFields
            params={params}
            onUpdate={handleUpdate}
            showStylePicker={false}
          />
        </FilterDrawer>
      </div>
    </>
  );
}
