"use client";

import { RING_STYLES, type RingStyle } from "@/constants/jewellery";
import { cn, formatLabel } from "@/lib/utils";
import { useTranslations } from "next-intl";

const STYLE_HINTS: Record<RingStyle, string> = {
  solitaire: "Classic single stone",
  halo: "Diamond surround",
  "three-stone": "Past, present, future",
  pave: "Pavé band",
  vintage: "Heirloom detail",
  bezel: "Secure modern edge",
  channel: "Set in channel",
  tension: "Floating hold",
};

interface RingStylePickerProps {
  value?: string | null;
  onChange: (style: string | null) => void;
  className?: string;
}

export function RingStylePicker({
  value,
  onChange,
  className,
}: RingStylePickerProps) {
  const t = useTranslations("ringBuilder");

  return (
    <div className={className}>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-brand-navy/60 uppercase">
            {t("settingStyle")}
          </p>
          <p className="mt-1 text-sm text-brand-charcoal/55">
            {t("settingStyleHint")}
          </p>
        </div>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-brand-charcoal/55 transition-colors hover:text-brand-navy"
          >
            {t("clearStyle")}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {RING_STYLES.map((style) => {
          const isActive = value === style;
          return (
            <button
              key={style}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(isActive ? null : style)}
              className={cn(
                "group flex flex-col items-start rounded-sm border px-3 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
                isActive
                  ? "border-brand-navy bg-brand-navy text-brand-ivory"
                  : "border-brand-gold/25 bg-white text-brand-navy hover:border-brand-gold/50 hover:bg-brand-cream/40",
              )}
            >
              <span
                className={cn(
                  "font-serif text-sm",
                  isActive ? "text-brand-ivory" : "text-brand-navy",
                )}
              >
                {formatLabel(style)}
              </span>
              <span
                className={cn(
                  "mt-1 text-[11px] leading-snug",
                  isActive ? "text-brand-ivory/70" : "text-brand-charcoal/50",
                )}
              >
                {STYLE_HINTS[style]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
