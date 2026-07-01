"use client";

import type { Metal } from "@/constants/jewellery";
import { cn, formatLabel } from "@/lib/utils";
import { useTranslations } from "next-intl";

const METAL_COLORS: Record<Metal, string> = {
  "white-gold": "bg-[#E8E8E8]",
  "yellow-gold": "bg-[#D4AF37]",
  "rose-gold": "bg-[#B76E79]",
  platinum: "bg-[#C0C0C0]",
  silver: "bg-[#A8A8A8]",
};

interface MetalSwatchesProps {
  metals: Metal[];
  activeMetal?: Metal;
  onSelect: (metal: Metal) => void;
  className?: string;
  size?: "sm" | "md";
}

export function MetalSwatches({
  metals,
  activeMetal,
  onSelect,
  className,
  size = "sm",
}: MetalSwatchesProps) {
  const t = useTranslations("products");

  if (metals.length === 0) return null;

  const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      role="group"
      aria-label={t("metalOptions")}
    >
      {metals.map((metal) => {
        const isActive = activeMetal === metal;
        const metalLabel = formatLabel(metal);

        return (
          <button
            key={metal}
            type="button"
            title={metalLabel}
            aria-label={t("selectMetal", { metal: metalLabel })}
            aria-pressed={isActive}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onSelect(metal);
            }}
            className={cn(
              "rounded-full border-2 p-0.5 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
              isActive
                ? "border-brand-navy ring-1 ring-brand-gold/50"
                : "border-transparent hover:border-brand-gold/40",
            )}
          >
            <span
              className={cn(
                "block rounded-full",
                sizeClass,
                METAL_COLORS[metal],
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
