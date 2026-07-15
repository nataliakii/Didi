"use client";

import { AppLink } from "@/components/ui/AppLink";
import { cn } from "@/lib/utils";
import {
  useCallback,
  useState,
  type ComponentPropsWithoutRef,
  type PointerEvent,
} from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "gold" | "navy";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
}

interface PressEffect {
  id: number;
  x: number;
  y: number;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-navy text-brand-ivory hover:bg-brand-navy-light focus-visible:ring-brand-navy",
  secondary:
    "bg-brand-cream text-brand-navy hover:bg-brand-gold-soft/40 focus-visible:ring-brand-gold",
  outline:
    "border border-brand-gold bg-transparent text-brand-navy hover:bg-brand-cream focus-visible:ring-brand-gold",
  ghost:
    "bg-transparent text-brand-navy hover:bg-brand-cream focus-visible:ring-brand-gold",
  gold:
    "bg-brand-gold text-brand-navy hover:bg-brand-gold/90 focus-visible:ring-brand-gold",
  navy:
    "bg-brand-navy text-brand-ivory hover:bg-brand-navy-light focus-visible:ring-brand-navy",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

function ButtonContent({
  children,
  effects,
  shimmerKey,
}: {
  children: React.ReactNode;
  effects: PressEffect[];
  shimmerKey: number | null;
}) {
  return (
    <>
      {effects.map(({ id, x, y }) => (
        <span
          key={id}
          className="button-click-ripple"
          style={{ left: x, top: y }}
          aria-hidden
        />
      ))}
      {shimmerKey !== null && (
        <span key={shimmerKey} className="button-click-shimmer" aria-hidden />
      )}
      <span className="relative z-[1]">{children}</span>
    </>
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  children,
  disabled,
  onPointerDown,
  ...props
}: ButtonProps) {
  const [effects, setEffects] = useState<PressEffect[]>([]);
  const [shimmerKey, setShimmerKey] = useState<number | null>(null);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (disabled) return;

      const target = event.currentTarget;
      const rect = target.getBoundingClientRect();
      const id = performance.now();

      setEffects((current) => [
        ...current,
        { id, x: event.clientX - rect.left, y: event.clientY - rect.top },
      ]);
      setShimmerKey(id);

      window.setTimeout(() => {
        setEffects((current) => current.filter((effect) => effect.id !== id));
      }, 650);

      window.setTimeout(() => {
        setShimmerKey((current) => (current === id ? null : current));
      }, 700);

      onPointerDown?.(event as PointerEvent<HTMLButtonElement>);
    },
    [disabled, onPointerDown],
  );

  const classes = cn(
    "relative isolate inline-flex items-center justify-center overflow-hidden rounded-sm font-medium tracking-wide transition-[transform,colors] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if (href) {
    return (
      <AppLink
        href={href}
        className={classes}
        onPointerDown={handlePointerDown}
        aria-disabled={disabled || undefined}
      >
        <ButtonContent effects={effects} shimmerKey={shimmerKey}>
          {children}
        </ButtonContent>
      </AppLink>
    );
  }

  return (
    <button
      className={classes}
      disabled={disabled}
      onPointerDown={handlePointerDown}
      {...props}
    >
      <ButtonContent effects={effects} shimmerKey={shimmerKey}>
        {children}
      </ButtonContent>
    </button>
  );
}
