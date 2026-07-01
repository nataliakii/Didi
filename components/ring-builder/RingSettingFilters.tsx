"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import { FilterDrawer } from "@/components/ui/FilterDrawer";
import { Select } from "@/components/ui/Select";
import { DIAMOND_SHAPES, METALS, RING_STYLES } from "@/constants/jewellery";
import { setParam } from "@/lib/searchParams";
import { cn, formatLabel } from "@/lib/utils";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

function FilterFields({
  params,
  onUpdate,
}: {
  params: URLSearchParams;
  onUpdate: (key: string, value: string | null) => void;
}) {
  return (
    <div className="space-y-6">
      <Select
        id="style"
        label="Style"
        value={params.get("style") ?? ""}
        placeholder="All styles"
        options={RING_STYLES.map((style) => ({
          value: style,
          label: formatLabel(style),
        }))}
        onChange={(value) => onUpdate("style", value || null)}
      />

      <Select
        id="metal"
        label="Metal"
        value={params.get("metal") ?? ""}
        placeholder="All metals"
        options={METALS.map((metal) => ({
          value: metal,
          label: formatLabel(metal),
        }))}
        onChange={(value) => onUpdate("metal", value || null)}
      />

      <Select
        id="compatibleShape"
        label="Compatible Diamond Shape"
        value={params.get("compatibleShape") ?? ""}
        placeholder="All shapes"
        options={DIAMOND_SHAPES.map((shape) => ({
          value: shape,
          label: formatLabel(shape),
        }))}
        onChange={(value) => onUpdate("compatibleShape", value || null)}
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="minPrice"
            className="text-xs font-medium tracking-wide text-brand-charcoal/65 uppercase"
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
            className="w-full rounded-sm border border-brand-gold/30 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="maxPrice"
            className="text-xs font-medium tracking-wide text-brand-charcoal/65 uppercase"
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
            className="w-full rounded-sm border border-brand-gold/30 px-3 py-2 text-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
          />
        </div>
      </div>

      <Checkbox
        id="isFeatured"
        label="Featured only"
        checked={params.get("isFeatured") === "true"}
        onChange={(checked) =>
          onUpdate("isFeatured", checked ? "true" : null)
        }
      />
    </div>
  );
}

export function RingSettingFilters({ className }: { className?: string }) {
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

  const filterFields = (
    <FilterFields params={params} onUpdate={handleUpdate} />
  );

  return (
    <>
      <div className={cn("hidden lg:block", className)}>
        <div className="sticky top-24 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-brand-navy">Filters</h2>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-brand-charcoal/55 hover:text-brand-navy"
            >
              Clear all
            </button>
          </div>
          {filterFields}
        </div>
      </div>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="rounded-sm border border-brand-gold/30 px-4 py-2 text-sm text-brand-charcoal/75 hover:bg-brand-cream/50"
        >
          Filters
        </button>
        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Filter Settings"
        >
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs text-brand-charcoal/55 hover:text-brand-navy"
            >
              Clear all
            </button>
          </div>
          {filterFields}
        </FilterDrawer>
      </div>
    </>
  );
}
