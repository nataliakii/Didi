"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "@/types";
import { useTranslations } from "next-intl";
import { useRef } from "react";

interface ProductCarouselProps {
  products: ProductSummary[];
  className?: string;
}

export function ProductCarousel({ products, className }: ProductCarouselProps) {
  const t = useTranslations("products");
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  function scrollBy(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(360, el.clientWidth * 0.75);
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => scrollBy(-1)}
        aria-label={t("relatedPrev")}
        className="absolute top-[28%] left-0 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-surface text-brand-text shadow-sm transition-colors hover:border-brand-navy md:flex"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scrollBy(1)}
        aria-label={t("relatedNext")}
        className="absolute top-[28%] right-0 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-surface text-brand-text shadow-sm transition-colors hover:border-brand-navy md:flex"
      >
        ›
      </button>

      <div
        ref={scrollerRef}
        className={cn(
          "-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 scroll-smooth sm:-mx-6 sm:px-6 lg:mx-0 lg:gap-6 lg:px-12",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-[28%] xl:w-[23%]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
