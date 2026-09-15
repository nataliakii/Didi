"use client";

import { HeroConstellationSky } from "@/components/home/HeroConstellationSky";
import { HomeHeroCopy } from "@/components/home/HomeHeroCopy";
import { Container } from "@/components/ui/Container";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

export function PoemHero() {
  const t = useTranslations("home");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setReady(true);
      return;
    }
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const scrollToIntro = useCallback(() => {
    document.getElementById("asteria-intro")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <section
      className="hero-section hero-under-header relative flex flex-col overflow-hidden"
      style={{ minHeight: "85svh" }}
    >
      <div className="hero-atmosphere absolute inset-0" aria-hidden="true" />
      <HeroConstellationSky />

      <Container className="relative z-10 flex flex-1 flex-col justify-center py-10 sm:py-24">
        <HomeHeroCopy ready={ready} />
      </Container>

      <button
        type="button"
        onClick={scrollToIntro}
        className="hero-scroll-cue absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 md:bottom-5"
        aria-label={t("scrollCue")}
      >
        <span className="text-[9px] tracking-[0.32em] text-brand-gold/80 uppercase">
          {t("scrollCue")}
        </span>
        <span className="hero-scroll-line" aria-hidden />
      </button>
    </section>
  );
}
