"use client";

import { DIAMOND_FILTER_PRESETS } from "@/constants/jewellery";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface DiamondFilterPresetsProps {
  activePreset?: string | null;
  onSelect: (preset: (typeof DIAMOND_FILTER_PRESETS)[number] | null) => void;
}

const PRESET_LABEL_KEYS = {
  "most-sparkle": "presetMostSparkle",
  "best-balance": "presetBestBalance",
  "top-quality": "presetTopQuality",
} as const;

export function DiamondFilterPresets({
  activePreset,
  onSelect,
}: DiamondFilterPresetsProps) {
  const t = useTranslations("filters");

  return (
    <div>
      <p className="mb-3 text-xs font-medium tracking-[0.2em] text-brand-navy/60 uppercase">
        {t("quickFilters")}
      </p>
      <div className="flex flex-wrap gap-2">
        {DIAMOND_FILTER_PRESETS.map((preset) => {
          const isActive = activePreset === preset;
          return (
            <button
              key={preset}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(isActive ? null : preset)}
              className={cn(
                "rounded-sm border px-3 py-1.5 text-xs tracking-wide transition-colors",
                isActive
                  ? "border-brand-navy bg-brand-navy text-brand-ivory"
                  : "border-brand-gold/30 bg-white text-brand-navy/75 hover:border-brand-gold/60",
              )}
            >
              {t(PRESET_LABEL_KEYS[preset])}
            </button>
          );
        })}
      </div>
    </div>
  );
}
