"use client";

import { METALS } from "@/constants/jewellery";
import { cn, formatLabel } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface MetalFilterChipsProps {
  value?: string | null;
  onChange: (metal: string | null) => void;
  className?: string;
}

export function MetalFilterChips({
  value,
  onChange,
  className,
}: MetalFilterChipsProps) {
  const t = useTranslations("ringBuilder");

  return (
    <div className={className}>
      <p className="mb-3 text-xs font-medium tracking-[0.2em] text-brand-navy/60 uppercase">
        {t("metal")}
      </p>
      <div className="flex flex-wrap gap-2">
        {METALS.filter((metal) => metal !== "silver").map((metal) => {
          const isActive = value === metal;
          return (
            <button
              key={metal}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(isActive ? null : metal)}
              className={cn(
                "rounded-sm border px-3 py-1.5 text-xs tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
                isActive
                  ? "border-brand-navy bg-brand-navy text-brand-ivory"
                  : "border-brand-gold/30 bg-white text-brand-navy/75 hover:border-brand-gold/60",
              )}
            >
              {formatLabel(metal)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
