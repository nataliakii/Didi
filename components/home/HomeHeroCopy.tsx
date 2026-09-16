"use client";

import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const HERO_GOLD = "#C5A059";

export function HomeHeroCopy({
  ready = true,
  className,
  align = "center",
}: {
  ready?: boolean;
  className?: string;
  align?: "center" | "left";
}) {
  const t = useTranslations("home");
  const lines = [t("poemLine1"), t("poemLine2")];
  const isLeft = align === "left";

  return (
    <div className={cn(isLeft ? "text-left" : "text-center", className)}>
      <p
        className={`hero-eyebrow poem-reveal ${ready ? "is-visible" : ""}`}
        style={{ transitionDelay: "0ms", color: HERO_GOLD }}
      >
        {t("heroSlogan")}
      </p>
      <span
        className={`hero-eyebrow-rule poem-reveal ${ready ? "is-visible" : ""}`}
        style={{ color: HERO_GOLD }}
        aria-hidden
      >
        ✦
      </span>

      <h1
        className={cn(
          "hero-title mt-5 font-serif font-normal sm:mt-7",
          isLeft ? "mx-0 max-w-[13.5rem] sm:max-w-md" : "mx-auto max-w-3xl",
        )}
        style={{ color: HERO_GOLD }}
      >
        {lines.map((line, index) => (
          <span
            key={line}
            className={`poem-line poem-reveal block text-[2.15rem] leading-[1.1] sm:text-5xl lg:text-[3.35rem] lg:leading-[1.12] ${ready ? "is-visible" : ""}`}
            style={{
              color: HERO_GOLD,
              transitionDelay: `${140 + index * 200}ms`,
            }}
          >
            {line}
          </span>
        ))}
      </h1>

      <p
        className={cn(
          "hero-positioning font-brand mt-5 max-w-xs text-[11px] tracking-[0.18em] uppercase sm:mt-6 sm:max-w-xl sm:text-sm poem-reveal",
          isLeft ? "mx-0" : "mx-auto",
          ready ? "is-visible" : "",
        )}
        style={{ color: HERO_GOLD, transitionDelay: "640ms" }}
      >
        {t("heroPositioning")}
      </p>

      <div
        className={cn(
          "hero-cta-group mt-8 flex items-center poem-reveal",
          isLeft ? "justify-start" : "justify-center",
          ready ? "is-visible" : "",
        )}
        style={{ transitionDelay: "820ms" }}
      >
        <Link
          href="/colored-lab-grown-diamonds"
          className="hero-cta-primary font-brand inline-flex items-center justify-center rounded-sm px-7 py-2.5 text-sm tracking-[0.14em] uppercase sm:min-w-[220px] sm:px-8 sm:py-3 sm:text-base"
          style={{
            backgroundColor: "transparent",
            color: HERO_GOLD,
            border: `1px solid ${HERO_GOLD}`,
          }}
        >
          {t("exploreCollection")}
          <span aria-hidden className="ml-2">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
