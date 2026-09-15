"use client";

import { HomeHeroCopy } from "@/components/home/HomeHeroCopy";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCallback } from "react";

export function BrandMarkHero() {
  const t = useTranslations("home");

  const scrollToIntro = useCallback(() => {
    document.getElementById("asteria-intro")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <section
      data-hero="asteria-phone"
      className="hero-section hero-under-header relative flex flex-col overflow-hidden"
      style={{ minHeight: "85svh" }}
      aria-label={t("heroBrandMark")}
    >
      <Image
        src="/images/brand/hero-velvet-ring.jpg"
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
        className="object-cover object-[72%_42%] sm:object-[78%_40%]"
      />
      <div className="hero-photo-veil-mark absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-5 pb-16 pt-[4.75rem] sm:px-10 lg:px-16">
        <div className="w-[min(100%,16.75rem)] sm:max-w-lg">
          <HomeHeroCopy align="left" />
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToIntro}
        className="hero-scroll-cue absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5"
        aria-label={t("scrollCue")}
      >
        <span className="font-brand text-[9px] tracking-[0.32em] text-brand-gold/80 uppercase">
          {t("scrollCue")}
        </span>
        <span className="hero-scroll-line" aria-hidden />
      </button>
    </section>
  );
}
