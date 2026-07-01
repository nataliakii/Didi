"use client";

import { RING_STYLES } from "@/constants/jewellery";
import { setParam } from "@/lib/searchParams";
import { cn, formatLabel } from "@/lib/utils";
import { usePathname, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";

interface StyleCategoryCarouselProps {
  className?: string;
  label?: string;
}

export function StyleCategoryCarousel({
  className,
  label = "Style",
}: StyleCategoryCarouselProps) {
  const tf = useTranslations("filters");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramsString = searchParams.toString();
  const params = useMemo(
    () => new URLSearchParams(paramsString),
    [paramsString],
  );

  const activeStyle = params.get("style");

  const navigate = useCallback(
    (value: string | null) => {
      router.replace(`${pathname}${setParam(params, "style", value)}`, {
        scroll: false,
      });
    },
    [pathname, params, router],
  );

  return (
    <div className={cn("border-b border-brand-gold/10 pb-5", className)}>
      <p className="mb-3 text-xs font-medium tracking-[0.2em] text-brand-navy/60 uppercase">
        {label}
      </p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          aria-pressed={!activeStyle}
          onClick={() => navigate(null)}
          className={cn(
            "shrink-0 snap-start rounded-sm border px-4 py-2 font-serif text-sm transition-colors",
            !activeStyle
              ? "border-brand-navy bg-brand-navy text-brand-gold"
              : "border-brand-gold/25 bg-white text-brand-navy/70 hover:border-brand-gold/50",
          )}
        >
          {tf("allStyles")}
        </button>
        {RING_STYLES.map((style) => {
          const isActive = activeStyle === style;
          const styleLabel = formatLabel(style);

          return (
            <button
              key={style}
              type="button"
              aria-pressed={isActive}
              aria-label={styleLabel}
              onClick={() => navigate(isActive ? null : style)}
              className={cn(
                "shrink-0 snap-start rounded-sm border px-4 py-2 font-serif text-sm whitespace-nowrap transition-colors",
                isActive
                  ? "border-brand-navy bg-brand-navy text-brand-gold"
                  : "border-brand-gold/25 bg-white text-brand-navy/70 hover:border-brand-gold/50",
              )}
            >
              {styleLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
