"use client";

import { DemoImage } from "@/components/ui/DemoImage";
import { MediaVideo } from "@/components/ui/MediaVideo";
import {
  DEMO_PLACEHOLDER_IMAGES,
} from "@/constants/demo-images";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types";
import { useState } from "react";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  videoUrl?: string;
}

export function ProductGallery({
  images,
  productName,
  videoUrl,
}: ProductGalleryProps) {
  const galleryImages =
    images.length > 0
      ? images
      : [
          {
            url: DEMO_PLACEHOLDER_IMAGES.ring,
            alt: productName,
            isPrimary: true,
          },
        ];

  const hasVideo = Boolean(videoUrl?.trim());
  const [mode, setMode] = useState<"image" | "video">(
    hasVideo && galleryImages.length === 0 ? "video" : "image",
  );
  const [activeIndex, setActiveIndex] = useState(
    Math.max(
      0,
      galleryImages.findIndex((image) => image.isPrimary),
    ),
  );

  const activeImage = galleryImages[activeIndex] ?? galleryImages[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-sm bg-brand-cream">
        {mode === "video" && videoUrl ? (
          <MediaVideo
            url={videoUrl}
            title={`${productName} video`}
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <DemoImage
            key={activeIndex}
            src={activeImage.url}
            fallback={DEMO_PLACEHOLDER_IMAGES.ring}
            alt={activeImage.alt ?? productName}
            placeholderKind="ring"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        )}
      </div>

      {(galleryImages.length > 1 || hasVideo) && (
        <div className="grid grid-cols-4 gap-3">
          {galleryImages.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => {
                setMode("image");
                setActiveIndex(index);
              }}
              className={cn(
                "relative aspect-square overflow-hidden rounded-sm border-2 bg-brand-cream",
                mode === "image" && index === activeIndex
                  ? "border-brand-navy"
                  : "border-transparent hover:border-brand-gold/40",
              )}
            >
              <DemoImage
                src={image.url}
                fallback={DEMO_PLACEHOLDER_IMAGES.ring}
                alt={image.alt ?? `${productName} view ${index + 1}`}
                placeholderKind="ring"
                fill
                className="object-cover"
                sizes="120px"
              />
            </button>
          ))}
          {hasVideo && (
            <button
              type="button"
              onClick={() => setMode("video")}
              className={cn(
                "flex aspect-square items-center justify-center rounded-sm border-2 bg-brand-cream text-xs font-medium tracking-wide text-brand-navy uppercase",
                mode === "video"
                  ? "border-brand-navy"
                  : "border-transparent hover:border-brand-gold/40",
              )}
            >
              Video
            </button>
          )}
        </div>
      )}
    </div>
  );
}
