"use client";

import { DiamondShapeIcon } from "@/components/ui/icons";
import type { DiamondShape } from "@/constants/jewellery";
import { cn, formatLabel } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ShapeFilterRowProps {
  value?: string | null;
  onChange: (shape: string | null) => void;
  className?: string;
  label?: string;
}

const SHAPES: (DiamondShape | "other")[] = [
  "round",
  "princess",
  "cushion",
  "elongated-cushion",
  "oval",
  "pear",
  "emerald",
  "radiant",
  "heart",
  "marquise",
  "asscher",
  "other",
];

export function ShapeFilterRow({
  value,
  onChange,
  className,
  label,
}: ShapeFilterRowProps) {
  const tf = useTranslations("filters");
  const rowLabel = label ?? tf("shape");

  return (
    <div className={className}>
      <p className="mb-3 text-xs font-medium tracking-[0.2em] text-brand-navy/60 uppercase">
        {rowLabel}
      </p>
      <div className="flex flex-wrap gap-2">
        {SHAPES.map((shape) => {
          const paramValue = shape === "other" ? null : shape;
          const isActive = shape === "other" ? !value : value === shape;
          const shapeLabel =
            shape === "other" ? tf("otherShapes") : formatLabel(shape);

          return (
            <button
              key={shape}
              type="button"
              title={shapeLabel}
              aria-label={shapeLabel}
              aria-pressed={isActive}
              onClick={() => onChange(isActive ? null : paramValue)}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
                isActive
                  ? "border-brand-navy bg-brand-navy text-brand-gold"
                  : "border-brand-gold/25 bg-brand-cream/50 text-brand-navy/60 hover:border-brand-gold/50 hover:text-brand-navy",
              )}
            >
              <DiamondShapeIcon shape={shape} className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
