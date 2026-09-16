"use client";

import { BrandMarkHero } from "@/components/home/BrandMarkHero";
import { PoemHero } from "@/components/home/PoemHero";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export const HERO_STORAGE_KEY = "asteria-hero";
export type HomeHeroId = "constellation" | "mark";

function parseHero(value: string | null): HomeHeroId | null {
  if (value === "constellation" || value === "mark") return value;
  return null;
}

export function HomeHero() {
  const t = useTranslations("home");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hero, setHero] = useState<HomeHeroId>("mark");

  useEffect(() => {
    const fromQuery = parseHero(searchParams.get("hero"));
    if (!fromQuery) return;
    setHero(fromQuery);
    try {
      localStorage.setItem(HERO_STORAGE_KEY, fromQuery);
    } catch {
      /* ignore */
    }
  }, [searchParams]);

  const selectHero = useCallback(
    (next: HomeHeroId) => {
      setHero(next);
      try {
        localStorage.setItem(HERO_STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      const params = new URLSearchParams(searchParams.toString());
      params.set("hero", next);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <>
      {hero === "mark" ? <BrandMarkHero /> : <PoemHero />}

      <div className="pointer-events-none fixed right-3 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 sm:right-5">
        <div className="pointer-events-auto rounded-sm border border-brand-gold/35 bg-[#FDFBF7]/95 p-1.5 shadow-md backdrop-blur-md">
          <p className="px-1.5 pb-1 text-[9px] tracking-[0.16em] text-brand-muted uppercase">
            {t("heroPreview")}
          </p>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => selectHero("constellation")}
              className={cn(
                "min-h-10 rounded-sm px-3 py-2 text-[11px] tracking-wide transition-colors sm:min-h-0 sm:px-2.5 sm:py-1.5",
                hero === "constellation"
                  ? "bg-brand-navy text-brand-ivory"
                  : "text-brand-text/80 hover:bg-brand-cream",
              )}
            >
              {t("heroNightSky")}
            </button>
            <button
              type="button"
              onClick={() => selectHero("mark")}
              className={cn(
                "min-h-10 rounded-sm px-3 py-2 text-[11px] tracking-wide transition-colors sm:min-h-0 sm:px-2.5 sm:py-1.5",
                hero === "mark"
                  ? "bg-brand-navy text-brand-ivory"
                  : "text-brand-text/80 hover:bg-brand-cream",
              )}
            >
              {t("heroBrandMark")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
