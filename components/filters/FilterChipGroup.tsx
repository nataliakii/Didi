"use client";

import { cn } from "@/lib/utils";

export interface FilterChipOption {
  value: string;
  label: string;
  /** If true, selecting this chip does not map to a backend param yet */
  disabled?: boolean;
  disabledTitle?: string;
}

interface FilterChipGroupProps {
  label: string;
  options: FilterChipOption[];
  value?: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

export function FilterChipGroup({
  label,
  options,
  value,
  onChange,
  className,
}: FilterChipGroupProps) {
  return (
    <div className={className}>
      <p className="mb-2.5 text-xs font-medium tracking-[0.2em] text-brand-navy/60 uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={label}>
        {options.map((option) => {
          const isActive = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              title={option.disabled ? option.disabledTitle : undefined}
              aria-label={option.label}
              aria-pressed={isActive}
              aria-disabled={option.disabled}
              onClick={() => {
                if (option.disabled) return;
                onChange(isActive ? null : option.value);
              }}
              className={cn(
                "rounded-full border px-3 py-1 text-xs tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-gold",
                option.disabled &&
                  "cursor-not-allowed border-dashed border-brand-gold/25 bg-brand-cream/30 text-brand-navy/40 italic",
                !option.disabled &&
                  isActive &&
                  "border-brand-navy bg-brand-navy text-brand-gold",
                !option.disabled &&
                  !isActive &&
                  "border-brand-gold/30 bg-white text-brand-navy/70 hover:border-brand-gold/60",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
