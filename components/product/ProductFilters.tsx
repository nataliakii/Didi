"use client";

import { FilterChipGroup } from "@/components/filters/FilterChipGroup";
import { ShapeFilterRow } from "@/components/filters/ShapeFilterRow";
import { Checkbox } from "@/components/ui/Checkbox";
import { FilterDrawer } from "@/components/ui/FilterDrawer";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import {
  AVAILABILITY_STATUSES,
  DIAMOND_SHAPES,
  METALS,
  PRODUCT_TYPES,
  RING_STYLES,
  STONE_TYPES,
} from "@/constants/jewellery";
import { clearFilters, getParam, setParam } from "@/lib/searchParams";
import { cn, formatLabel } from "@/lib/utils";
import type { CategorySummary } from "@/types";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";

const PRODUCT_FILTER_KEYS = [
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
];

interface ProductFiltersProps {
  categories: CategorySummary[];
  className?: string;
}

function VisualProductFilters({
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
        value={params.get("diamondShape")}
        onChange={(shape) => onUpdate("diamondShape", shape)}
      />

      <FilterChipGroup
        label={tf("metal")}
        options={METALS.filter((m) => m !== "silver").map((metal) => ({
          value: metal,
          label: formatLabel(metal),
        }))}
        value={params.get("metal")}
        onChange={(value) => onUpdate("metal", value)}
      />
    </div>
  );
}

function FilterFields({
  categories,
  params,
  onUpdate,
}: {
  categories: CategorySummary[];
  params: URLSearchParams;
  onUpdate: (key: string, value: string | null) => void;
}) {
  return (
    <div className="space-y-6">
      <Select
        id="category"
        label="Category"
        value={params.get("category") ?? ""}
        placeholder="All categories"
        options={categories.map((category) => ({
          value: category.slug,
          label: category.name,
        }))}
        onChange={(value) => onUpdate("category", value || null)}
      />

      <Select
        id="productType"
        label="Product Type"
        value={params.get("productType") ?? ""}
        placeholder="All types"
        options={PRODUCT_TYPES.map((type) => ({
          value: type,
          label: formatLabel(type),
        }))}
        onChange={(value) => onUpdate("productType", value || null)}
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

      {/* Metal also available as visual chips above — select kept for accessibility */}

      <Select
        id="stoneType"
        label="Stone Type"
        value={params.get("stoneType") ?? ""}
        placeholder="All stones"
        options={STONE_TYPES.map((stone) => ({
          value: stone,
          label: formatLabel(stone),
        }))}
        onChange={(value) => onUpdate("stoneType", value || null)}
      />

      <Select
        id="diamondShape"
        label="Diamond Shape"
        value={params.get("diamondShape") ?? ""}
        placeholder="All shapes"
        options={DIAMOND_SHAPES.map((shape) => ({
          value: shape,
          label: formatLabel(shape),
        }))}
        onChange={(value) => onUpdate("diamondShape", value || null)}
      />

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

      <div className="space-y-3 border-t border-brand-gold/20 pt-4">
        <Checkbox
          id="isReadyToShip"
          label="Ready to ship"
          checked={params.get("isReadyToShip") === "true"}
          onChange={(checked) =>
            onUpdate("isReadyToShip", checked ? "true" : null)
          }
        />
        <Checkbox
          id="isFeatured"
          label="Featured"
          checked={params.get("isFeatured") === "true"}
          onChange={(checked) =>
            onUpdate("isFeatured", checked ? "true" : null)
          }
        />
        <Checkbox
          id="isBestSeller"
          label="Best seller"
          checked={params.get("isBestSeller") === "true"}
          onChange={(checked) =>
            onUpdate("isBestSeller", checked ? "true" : null)
          }
        />
      </div>
    </div>
  );
}

export function ProductFilters({ categories, className }: ProductFiltersProps) {
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
    navigate(clearFilters(params, PRODUCT_FILTER_KEYS));
    setDrawerOpen(false);
  };

  const filterFields = (
    <>
      <VisualProductFilters params={params} onUpdate={handleUpdate} />
      <FilterFields
        categories={categories}
        params={params}
        onUpdate={handleUpdate}
      />
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
          {filterFields}
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
          title={tf("filterProducts")}
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
          {filterFields}
        </FilterDrawer>
      </div>
    </>
  );
}

export { PRODUCT_ACTIVE_FILTER_CONFIGS } from "@/components/filters/ActiveFilterChips";

export function ProductSortSelect() {
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
    { value: "featured", label: "Featured" },
    { value: "best-sellers", label: "Best Sellers" },
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

export function ProductSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramsString = searchParams.toString();
  const params = useMemo(
    () => new URLSearchParams(paramsString),
    [paramsString],
  );

  const handleSearch = useCallback(
    (value: string) => {
      const current = params.get("search") ?? "";
      if (value === current) return;
      router.replace(
        `${pathname}${setParam(params, "search", value || null)}`,
        { scroll: false },
      );
    },
    [pathname, params, router],
  );

  return (
    <SearchInput
      key={params.get("search") ?? ""}
      defaultValue={params.get("search") ?? ""}
      placeholder="Search products..."
      label="Search products"
      onSearch={handleSearch}
      className="max-w-md flex-1"
    />
  );
}
