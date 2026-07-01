"use client";

import {
  getDemoFallback,
  getDemoImage,
  shouldUseDemoPlaceholder,
  type DemoPlaceholderKind,
} from "@/constants/demo-images";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useMemo, useState } from "react";

interface DemoImageProps {
  src?: string | null;
  alt: string;
  fallback?: string;
  placeholderKind?: DemoPlaceholderKind;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  containerClassName?: string;
}

export function ImagePlaceholder({ alt }: { alt: string }) {
  return (
    <div
      role="img"
      aria-label={alt}
      className="flex h-full w-full flex-col items-center justify-center bg-brand-cream"
    >
      <span className="text-2xl text-brand-gold/40" aria-hidden>
        &#9670;
      </span>
    </div>
  );
}

interface DemoImageInnerProps extends Omit<DemoImageProps, "src" | "fallback"> {
  preferredSrc: string;
  resolvedFallback: string;
}

function DemoImageInner({
  preferredSrc,
  resolvedFallback,
  alt,
  fill = false,
  width,
  height,
  className,
  sizes,
  priority,
  containerClassName,
}: DemoImageInnerProps) {
  const [activeSrc, setActiveSrc] = useState(preferredSrc);
  const [forcePlaceholder, setForcePlaceholder] = useState(
    () => shouldUseDemoPlaceholder(preferredSrc),
  );

  const handleError = () => {
    if (activeSrc !== resolvedFallback && !shouldUseDemoPlaceholder(resolvedFallback)) {
      setActiveSrc(resolvedFallback);
      return;
    }
    setForcePlaceholder(true);
  };

  if (forcePlaceholder) {
    return (
      <div
        className={cn(
          fill && "relative h-full w-full",
          containerClassName,
        )}
      >
        <ImagePlaceholder alt={alt} />
      </div>
    );
  }

  const image = (
    <Image
      src={activeSrc}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={handleError}
    />
  );

  if (fill) {
    return (
      <div className={cn("relative h-full w-full", containerClassName)}>
        {image}
      </div>
    );
  }

  return image;
}

export function DemoImage({
  src,
  alt,
  fallback,
  placeholderKind = "diamond",
  fill = false,
  width,
  height,
  className,
  sizes,
  priority,
  containerClassName,
}: DemoImageProps) {
  const resolvedFallback = fallback ?? getDemoFallback(placeholderKind);
  const preferredSrc = useMemo(
    () => getDemoImage(src, resolvedFallback),
    [src, resolvedFallback],
  );

  return (
    <DemoImageInner
      key={preferredSrc}
      preferredSrc={preferredSrc}
      resolvedFallback={resolvedFallback}
      alt={alt}
      placeholderKind={placeholderKind}
      fill={fill}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      containerClassName={containerClassName}
    />
  );
}
