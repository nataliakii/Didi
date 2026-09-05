"use client";

import { DemoImage } from "@/components/ui/DemoImage";
import { DEMO_CATEGORY_IMAGES } from "@/constants/demo-images";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRef } from "react";

const RING_CATEGORIES = [
  {
    key: "engagement",
    image: DEMO_CATEGORY_IMAGES.engagementRings,
    href: "/products?productType=engagement-ring" as const,
  },
  {
    key: "solitaire",
    image: DEMO_CATEGORY_IMAGES.signatureSolitaires,
    href: "/products?style=solitaire" as const,
  },
  {
    key: "halo",
    image: DEMO_CATEGORY_IMAGES.halo,
    href: "/products?style=halo" as const,
  },
  {
    key: "threeStone",
    image: DEMO_CATEGORY_IMAGES.threeStone,
    href: "/products?style=three-stone" as const,
  },
  {
    key: "vintage",
    image: DEMO_CATEGORY_IMAGES.vintage,
    href: "/products?style=vintage" as const,
  },
  {
    key: "pave",
    image: DEMO_CATEGORY_IMAGES.pave,
    href: "/products?style=pave" as const,
  },
  {
    key: "bezel",
    image: DEMO_CATEGORY_IMAGES.bezel,
    href: "/products?style=bezel" as const,
  },
  {
    key: "channel",
    image: DEMO_CATEGORY_IMAGES.channel,
    href: "/products?style=channel" as const,
  },
  {
    key: "tension",
    image: DEMO_CATEGORY_IMAGES.tension,
    href: "/products?style=tension" as const,
  },
  {
    key: "createRing",
    image: DEMO_CATEGORY_IMAGES.createRing,
    href: "/create-ring" as const,
  },
  {
    key: "settings",
    image: DEMO_CATEGORY_IMAGES.ringSettings,
    href: "/create-ring/setting" as const,
  },
  {
    key: "diamondRings",
    image: DEMO_CATEGORY_IMAGES.diamondRings,
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
    <section className="bg-brand-bg py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl text-brand-text sm:text-4xl">
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
            className="absolute top-1/2 left-0 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-surface text-brand-text shadow-sm transition-colors hover:border-brand-navy md:flex"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label={t("shopByCategoryNext")}
            className="absolute top-1/2 right-0 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-surface text-brand-text shadow-sm transition-colors hover:border-brand-navy md:flex"
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
                <div className="relative aspect-square overflow-hidden rounded-sm border border-brand-gold/15 bg-brand-cream">
                  <DemoImage
                    src={category.image}
                    alt={t(`shopByCategoryCards.${category.key}`)}
                    placeholderKind="ring"
                    fill
                    className="object-contain p-6 transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 18vw"
                  />
                </div>
                <p className="mt-3 text-center text-sm text-brand-text/85 transition-colors group-hover:text-brand-text sm:text-left">
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
