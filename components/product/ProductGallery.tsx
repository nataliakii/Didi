"use client";

import { DemoImage } from "@/components/ui/DemoImage";
import { MediaVideo } from "@/components/ui/MediaVideo";
import {
  DEMO_PLACEHOLDER_IMAGES,
  DEMO_PRODUCT_VARIANT_IMAGES,
  type DemoPlaceholderKind,
} from "@/constants/demo-images";
import { cn, formatLabel } from "@/lib/utils";
import type { ProductImage, ProductVariant } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  videoUrl?: string;
  variants?: ProductVariant[];
  metals?: string[];
  priority?: boolean;
  placeholderKind?: DemoPlaceholderKind;
}

type GallerySlide =
  | { kind: "image"; url: string; alt: string; key: string }
  | { kind: "video"; url: string; key: string };

function buildGalleryImages(input: {
  images: ProductImage[];
  productName: string;
  variants?: ProductVariant[];
  metals?: string[];
  placeholderKind: DemoPlaceholderKind;
}): ProductImage[] {
  const seen = new Set<string>();
  const result: ProductImage[] = [];
  const fallback = DEMO_PLACEHOLDER_IMAGES[input.placeholderKind] ?? DEMO_PLACEHOLDER_IMAGES.ring;

  function push(url: string | undefined, alt: string, isPrimary = false) {
    if (!url?.trim()) return;
    const normalized = url.trim();
    if (seen.has(normalized)) return;
    seen.add(normalized);
    result.push({ url: normalized, alt, isPrimary });
  }

  if (input.images.length > 0) {
    input.images.forEach((image, index) => {
      push(
        image.url,
        image.alt?.trim() || `${input.productName} — view ${index + 1}`,
        Boolean(image.isPrimary) || index === 0,
      );
    });
  } else {
    push(fallback, `${input.productName} — primary view`, true);
  }

  for (const variant of input.variants ?? []) {
    const metalLabel = variant.metal ? formatLabel(variant.metal) : "variant";
    push(variant.image, `${input.productName} — ${metalLabel}`);
  }

  const metals =
    input.metals?.length
      ? input.metals
      : (input.variants ?? [])
          .map((variant) => variant.metal)
          .filter((metal): metal is NonNullable<typeof metal> => Boolean(metal));

  for (const metal of metals) {
    const demo =
      DEMO_PRODUCT_VARIANT_IMAGES[
        metal as keyof typeof DEMO_PRODUCT_VARIANT_IMAGES
      ];
    if (demo) {
      push(demo, `${input.productName} — ${formatLabel(metal)}`);
    }
  }

  return result;
}

export function ProductGallery({
  images,
  productName,
  videoUrl,
  variants,
  metals,
  priority = false,
  placeholderKind = "ring",
}: ProductGalleryProps) {
  const galleryImages = useMemo(
    () =>
      buildGalleryImages({
        images,
        productName,
        variants,
        metals,
        placeholderKind,
      }),
    [images, productName, variants, metals, placeholderKind],
  );
  const fallbackImage =
    DEMO_PLACEHOLDER_IMAGES[placeholderKind] ?? DEMO_PLACEHOLDER_IMAGES.ring;

  const slides: GallerySlide[] = useMemo(
    () => [
      ...galleryImages.map((image, index) => ({
        kind: "image" as const,
        url: image.url,
        alt: image.alt ?? `${productName} — view ${index + 1}`,
        key: `image-${image.url}-${index}`,
      })),
      ...(videoUrl?.trim()
        ? [{ kind: "video" as const, url: videoUrl.trim(), key: "video" }]
        : []),
    ],
    [galleryImages, productName, videoUrl],
  );

  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = mobileTrackRef.current;
    if (!track) return;

    function updateActive() {
      if (!track) return;
      const width = track.clientWidth;
      if (width <= 0) return;
      const next = Math.round(track.scrollLeft / width);
      setActiveIndex(Math.min(Math.max(next, 0), slides.length - 1));
    }

    track.addEventListener("scroll", updateActive, { passive: true });
    updateActive();
    return () => track.removeEventListener("scroll", updateActive);
  }, [slides.length]);

  function goToSlide(index: number) {
    const track = mobileTrackRef.current;
    if (!track) return;
    track.scrollTo({
      left: index * track.clientWidth,
      behavior: "smooth",
    });
    setActiveIndex(index);
  }

  return (
    <div className="w-full">
      {/* Mobile / tablet: full-bleed horizontal snap carousel */}
      <div className="lg:hidden">
        <div className="relative">
          <div
            ref={mobileTrackRef}
            className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label={`${productName} gallery`}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.key}
                className="relative aspect-square w-full shrink-0 snap-center snap-always bg-brand-cream"
              >
                {slide.kind === "video" ? (
                  <MediaVideo
                    url={slide.url}
                    title={`${productName} video`}
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <DemoImage
                    src={slide.url}
                    fallback={fallbackImage}
                    alt={slide.alt}
                    placeholderKind={placeholderKind}
                    fill
                    priority={priority && index === 0}
                    className="object-cover"
                    sizes="100vw"
                  />
                )}
              </div>
            ))}
          </div>

          {slides.length > 1 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex items-center justify-center gap-1.5">
              {slides.map((slide, index) => (
                <button
                  key={`dot-${slide.key}`}
                  type="button"
                  aria-label={`Show image ${index + 1}`}
                  aria-current={index === activeIndex}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "pointer-events-auto h-1.5 rounded-full transition-all",
                    index === activeIndex
                      ? "w-5 bg-brand-text"
                      : "w-1.5 bg-brand-text/35",
                  )}
                />
              ))}
            </div>
          )}

          {slides.length > 1 && (
            <p className="pointer-events-none absolute top-3 right-3 rounded-sm bg-brand-bg/75 px-2 py-1 text-[10px] tracking-widest text-brand-muted tabular-nums uppercase backdrop-blur-sm">
              {activeIndex + 1} / {slides.length}
            </p>
          )}
        </div>
      </div>

      {/* Desktop: stacked full images that scroll with the page */}
      <div className="hidden space-y-3 lg:block">
        {slides.map((slide, index) => (
          <div
            key={slide.key}
            className="relative aspect-square overflow-hidden bg-brand-cream"
          >
            {slide.kind === "video" ? (
              <MediaVideo
                url={slide.url}
                title={`${productName} video`}
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <DemoImage
                src={slide.url}
                fallback={fallbackImage}
                alt={slide.alt}
                placeholderKind={placeholderKind}
                fill
                priority={priority && index === 0}
                className="object-cover"
                sizes="(max-width: 1280px) 50vw, 640px"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
