"use client";

import { cn, formatLabel } from "@/lib/utils";
import type { Metal } from "@/constants/jewellery";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { setParam } from "@/lib/searchParams";
import { useTranslations } from "next-intl";

interface MetalSelectorProps {
  availableMetals: Metal[];
  selectedMetal?: Metal;
}

export function MetalSelector({
  availableMetals,
  selectedMetal,
}: MetalSelectorProps) {
  const t = useTranslations("ringBuilder");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );

  const handleSelect = (metal: Metal) => {
    router.replace(`${pathname}${setParam(params, "metal", metal, false)}`, {
      scroll: false,
    });
  };

  return (
    <div>
      <h3 className="text-sm font-medium tracking-wide text-brand-navy">
        {t("chooseMetal")}
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {availableMetals.map((metal) => (
          <button
            key={metal}
            type="button"
            onClick={() => handleSelect(metal)}
            className={cn(
              "rounded-sm border px-4 py-2 text-sm transition-colors",
              selectedMetal === metal
                ? "border-brand-navy bg-brand-navy text-brand-ivory"
                : "border-brand-gold/35 bg-white text-brand-navy hover:border-brand-gold hover:bg-brand-cream",
            )}
          >
            {formatLabel(metal)}
          </button>
        ))}
      </div>
    </div>
  );
}
