import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type BrandLogoSize = "sm" | "md" | "lg";
type BrandLogoVariant = "default" | "light";

interface BrandLogoProps extends ComponentPropsWithoutRef<"span"> {
  size?: BrandLogoSize;
  variant?: BrandLogoVariant;
  /** Show only the primary wordmark (Asteria) */
  compact?: boolean;
}

const sizeStyles: Record<
  BrandLogoSize,
  { primary: string; secondary: string; gap: string }
> = {
  sm: {
    primary: "text-base tracking-[0.22em] lg:text-lg",
    secondary: "text-[0.5em] tracking-[0.32em]",
    gap: "mt-0.5",
  },
  md: {
    primary: "text-lg tracking-[0.24em] lg:text-xl",
    secondary: "text-[0.52em] tracking-[0.34em]",
    gap: "mt-0.5",
  },
  lg: {
    primary: "text-xl tracking-[0.26em] sm:text-2xl",
    secondary: "text-[0.5em] tracking-[0.36em]",
    gap: "mt-1",
  },
};

export function BrandLogo({
  size = "md",
  variant = "default",
  compact = false,
  className,
  ...props
}: BrandLogoProps) {
  const styles = sizeStyles[size];
  const isLight = variant === "light";

  return (
    <span
      className={cn("inline-flex flex-col leading-none select-none", className)}
      {...props}
    >
      <span
        className={cn(
          "font-serif font-semibold uppercase",
          isLight ? "text-brand-ivory" : "text-brand-navy",
          styles.primary,
        )}
      >
        Asteria
      </span>
      {!compact && (
        <span
          className={cn(
            "font-serif font-medium uppercase",
            isLight ? "text-brand-gold" : "text-brand-gold",
            styles.secondary,
            styles.gap,
          )}
        >
          Diamond House
        </span>
      )}
    </span>
  );
}
