import { AppLink } from "@/components/ui/AppLink";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "gold" | "navy";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
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

export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-sm font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if (href) {
    return (
      <AppLink href={href} className={classes}>
        {children}
      </AppLink>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
