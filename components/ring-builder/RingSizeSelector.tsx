"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { setParam } from "@/lib/searchParams";
import { useTranslations } from "next-intl";

interface RingSizeSelectorProps {
  availableSizes: string[];
  selectedRingSize?: string;
}

export function RingSizeSelector({
  availableSizes,
  selectedRingSize,
}: RingSizeSelectorProps) {
  const t = useTranslations("ringBuilder");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );

  const handleSelect = (ringSize: string) => {
    router.replace(
      `${pathname}${setParam(params, "ringSize", ringSize, false)}`,
      { scroll: false },
    );
  };

  return (
    <div>
      <h3 className="text-sm font-medium tracking-wide text-brand-navy">
        {t("chooseRingSize")}
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {availableSizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => handleSelect(size)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-sm border text-sm transition-colors",
              selectedRingSize === size
                ? "border-brand-navy bg-brand-navy text-brand-ivory"
                : "border-brand-gold/35 bg-white text-brand-navy hover:border-brand-gold hover:bg-brand-cream",
            )}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
