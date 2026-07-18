"use client";

import { DemoImage } from "@/components/ui/DemoImage";
import {
  DEMO_CREATE_RING_IMAGES,
  DEMO_RING_IMAGES,
  DEMO_SETTING_IMAGES,
} from "@/constants/demo-images";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRef } from "react";

const RING_CATEGORIES = [
  {
    key: "engagement",
    image: DEMO_RING_IMAGES.ovalSolitaire,
    href: "/products?productType=engagement-ring" as const,
  },
  {
    key: "solitaire",
    image: DEMO_RING_IMAGES.roundSolitaire,
    href: "/products?style=solitaire" as const,
  },
  {
    key: "halo",
    image: DEMO_RING_IMAGES.hiddenHalo,
    href: "/products?style=halo" as const,
  },
  {
    key: "threeStone",
    image: DEMO_RING_IMAGES.emeraldCut,
    href: "/products?style=three-stone" as const,
  },
  {
    key: "vintage",
    image: DEMO_SETTING_IMAGES.cathedral,
    href: "/products?style=vintage" as const,
  },
  {
    key: "createRing",
    image: DEMO_CREATE_RING_IMAGES.review,
    href: "/create-ring" as const,
  },
  {
    key: "settings",
    image: DEMO_SETTING_IMAGES.classicSolitaire,
    href: "/create-ring/setting" as const,
  },
  {
    key: "diamondRings",
    image: DEMO_RING_IMAGES.roundSolitaire,
    href: "/products" as const,
  },
] as const;

export function ShopRingsByCategory() {
  const t = useTranslations("home");
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(320, el.clientWidth * 0.7);
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <section className="bg-brand-ivory py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl text-brand-navy sm:text-4xl">
            {t("shopByCategoryTitle")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-brand-charcoal/65">
            {t("shopByCategoryDescription")}
          </p>
        </div>

        <div className="relative mt-10">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label={t("shopByCategoryPrev")}
            className="absolute top-1/2 left-0 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gold/30 bg-white text-brand-navy shadow-sm transition-colors hover:border-brand-navy md:flex"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={t("shopByCategoryNext")}
            className="absolute top-1/2 right-0 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gold/30 bg-white text-brand-navy shadow-sm transition-colors hover:border-brand-navy md:flex"
          >
            ›
          </button>

          <div
            ref={scrollerRef}
            className={cn(
              "-mx-1 flex gap-4 overflow-x-auto px-1 pb-2 scroll-smooth",
              "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              "md:mx-12",
            )}
          >
            {RING_CATEGORIES.map((category) => (
              <Link
                key={category.key}
                href={category.href}
                className="group w-[46%] shrink-0 snap-start sm:w-[30%] lg:w-[22%] xl:w-[18%]"
              >
                <div className="relative aspect-square overflow-hidden rounded-sm bg-brand-cream">
                  <DemoImage
                    src={category.image}
                    alt={t(`shopByCategoryCards.${category.key}`)}
                    placeholderKind="ring"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 18vw"
                  />
                </div>
                <p className="mt-3 text-center text-sm text-brand-navy/85 transition-colors group-hover:text-brand-navy sm:text-left">
                  {t(`shopByCategoryCards.${category.key}`)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
