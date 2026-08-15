"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DemoImage } from "@/components/ui/DemoImage";
import {
  DEMO_CONSULTATION_IMAGES,
  DEMO_DIAMOND_IMAGES,
  DEMO_RING_IMAGES,
} from "@/constants/demo-images";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

const CHAPTERS = [
  {
    key: "1" as const,
    image: DEMO_CONSULTATION_IMAGES.privateDiamond,
    placeholderKind: "diamond" as const,
    imageAltKey: "consultationImageAlt" as const,
  },
  {
    key: "2" as const,
    image: DEMO_DIAMOND_IMAGES.roundBrilliant,
    placeholderKind: "diamond" as const,
    imageAltKey: "diamondsImageAlt" as const,
  },
  {
    key: "3" as const,
    image: DEMO_RING_IMAGES.ovalSolitaire,
    placeholderKind: "ring" as const,
    imageAltKey: "bespokeImageAlt" as const,
  },
];

function useInView<T extends HTMLElement>(threshold = 0.22) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function JourneyChapter({
  index,
  title,
  body,
  image,
  imageAlt,
  placeholderKind,
}: {
  index: number;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  placeholderKind: "diamond" | "ring";
}) {
  const { ref, visible } = useInView<HTMLElement>();
  const reverse = index % 2 === 1;

  return (
    <article
      ref={ref}
      className={`journey-chapter grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${visible ? "is-visible" : ""}`}
    >
      <div
        className={`relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5] ${reverse ? "lg:order-2" : ""}`}
      >
        <DemoImage
          src={image}
          alt={imageAlt}
          placeholderKind={placeholderKind}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/35 via-transparent to-transparent" />
      </div>

      <div className={reverse ? "lg:order-1" : undefined}>
        <span className="journey-hairline" aria-hidden="true" />
        <p className="mt-5 font-serif text-sm tracking-[0.28em] text-brand-gold uppercase">
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-3 font-serif text-3xl text-brand-text sm:text-4xl">
          {title}
        </h3>
        <p className="mt-5 max-w-md text-base leading-relaxed text-brand-charcoal/75">
          {body}
        </p>
      </div>
    </article>
  );
}

export function AboutJourney() {
  const t = useTranslations("about");
  const tHome = useTranslations("home");
  const { ref: ctaRef, visible: ctaVisible } = useInView<HTMLDivElement>(0.35);

  return (
    <section className="border-t border-brand-gold/20 bg-brand-bg py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">{t("journeyEyebrow")}</p>
        </div>

        <div className="mt-14 space-y-20 lg:mt-20 lg:space-y-28">
          {CHAPTERS.map((chapter, index) => (
            <JourneyChapter
              key={chapter.key}
              index={index}
              title={t(`chapter${chapter.key}Title`)}
              body={t(`chapter${chapter.key}Body`)}
              image={chapter.image}
              imageAlt={tHome(chapter.imageAltKey)}
              placeholderKind={chapter.placeholderKind}
            />
          ))}
        </div>

        <div
          ref={ctaRef}
          className={`mt-16 flex flex-col items-center gap-3 sm:mt-20 sm:flex-row sm:justify-center journey-cta ${ctaVisible ? "is-visible" : ""}`}
        >
          <Button href="/create-ring" variant="gold" size="lg">
            {t("createRingCta")}
          </Button>
          <Button href="/appointment" variant="outline" size="lg">
            {t("bookAppointmentCta")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
