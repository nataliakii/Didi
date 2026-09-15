import { cn } from "@/lib/utils";
import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";

type BrandLogoSize = "sm" | "md" | "lg";
type BrandLogoVariant = "default" | "light";

interface BrandLogoProps extends ComponentPropsWithoutRef<"span"> {
  size?: BrandLogoSize;
  variant?: BrandLogoVariant;
  /** Show only the A mark */
  compact?: boolean;
  priority?: boolean;
}

const sizeStyles: Record<BrandLogoSize, string> = {
  sm: "h-8 w-auto",
  md: "h-10 w-auto sm:h-11 lg:h-12",
  lg: "h-28 w-auto sm:h-36",
};

export function BrandLogo({
  size = "md",
  variant: _variant = "default",
  compact = false,
  priority = false,
  className,
  ...props
}: BrandLogoProps) {
  const src = compact
    ? "/images/brand/asteria-mark-a.png"
    : "/images/brand/asteria-lockup.png";
  const width = compact ? 379 : 852;
  const height = compact ? 468 : 807;

  return (
    <span
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      <Image
        src={src}
        alt="Asteria Diamond House"
        width={width}
        height={height}
        priority={priority}
        className={cn(
          "block max-h-full object-contain object-center",
          sizeStyles[size],
        )}
      />
    </span>
  );
}
