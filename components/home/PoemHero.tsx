"use client";

import { HeroConstellationSky } from "@/components/home/HeroConstellationSky";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

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

  const lines = [t("poemLine1"), t("poemLine2"), t("poemLine3")];

  return (
    <section className="hero-section relative flex min-h-[78vh] items-center overflow-hidden sm:min-h-[85vh]">
      <div className="hero-atmosphere absolute inset-0" aria-hidden="true" />
      <HeroConstellationSky />

      <Container className="relative z-10 py-24 text-center sm:py-28">
        <p
          className={`hero-eyebrow poem-reveal ${ready ? "is-visible" : ""}`}
          style={{ transitionDelay: "0ms" }}
        >
          {t("heroEyebrow")}
        </p>

        <h1 className="hero-title mx-auto mt-8 max-w-3xl font-serif">
          {lines.map((line, index) => (
            <span
              key={line}
              className={`poem-line poem-reveal block text-4xl leading-[1.15] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.12] ${ready ? "is-visible" : ""}`}
              style={{ transitionDelay: `${160 + index * 220}ms` }}
            >
              {line}
            </span>
          ))}
        </h1>

        <p
          className={`hero-description mx-auto mt-7 max-w-md text-base leading-relaxed sm:text-lg poem-reveal ${ready ? "is-visible" : ""}`}
          style={{ transitionDelay: "980ms" }}
        >
          {t("heroDescription")}
        </p>

        <div
          className={`hero-cta-group mt-10 flex flex-col items-stretch justify-center gap-3 px-4 sm:flex-row sm:items-center sm:px-0 poem-reveal ${ready ? "is-visible" : ""}`}
          style={{ transitionDelay: "1180ms" }}
        >
          <Button
            href="/create-ring"
            variant="gold"
            size="lg"
            className="hero-cta-primary w-full sm:w-auto sm:min-w-[200px]"
          >
            {t("createYourRing")}
          </Button>
          <Button
            href="/diamonds"
            variant="outline"
            size="lg"
            className="hero-cta-secondary w-full sm:w-auto sm:min-w-[200px]"
          >
            {t("shopDiamonds")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
