"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

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
        style={{ transitionDelay: "0ms" }}
      >
        {t("heroSlogan")}
      </p>
      <span
        className={`hero-eyebrow-rule poem-reveal ${ready ? "is-visible" : ""}`}
        aria-hidden
      >
        ✦
      </span>

      <h1
        className={cn(
          "hero-title mt-5 font-serif font-normal sm:mt-7",
          isLeft ? "mx-0 max-w-[13.5rem] sm:max-w-md" : "mx-auto max-w-3xl",
        )}
      >
        {lines.map((line, index) => (
          <span
            key={line}
            className={`poem-line poem-reveal block text-[2.15rem] leading-[1.1] sm:text-5xl lg:text-[3.35rem] lg:leading-[1.12] ${ready ? "is-visible" : ""}`}
            style={{ transitionDelay: `${140 + index * 200}ms` }}
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
        style={{ transitionDelay: "640ms" }}
      >
        {t("heroPositioning")}
      </p>

      <div
        className={cn(
          "hero-cta-group mt-7 flex items-center poem-reveal",
          isLeft ? "justify-start" : "justify-center",
          ready ? "is-visible" : "",
        )}
        style={{ transitionDelay: "820ms" }}
      >
        <Button
          href="/colored-lab-grown-diamonds"
          variant="gold"
          size="sm"
          className="hero-cta-primary font-brand px-6 tracking-[0.14em] uppercase sm:min-w-[220px] sm:px-8 sm:py-3 sm:text-base"
        >
          {t("exploreCollection")}
          <span aria-hidden className="ml-2">
            →
          </span>
        </Button>
      </div>
    </div>
  );
}
