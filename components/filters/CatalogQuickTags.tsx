"use client";

import { cn } from "@/lib/utils";

export interface CatalogQuickTag {
  param: string;
  value: string;
  label: string;
}

interface CatalogQuickTagsProps {
  tags: CatalogQuickTag[];
  params: URLSearchParams;
  onToggle: (param: string, value: string) => void;
  label?: string;
  className?: string;
}

export function CatalogQuickTags({
  tags,
  params,
  onToggle,
  label,
  className,
}: CatalogQuickTagsProps) {
  return (
    <div className={className}>
      {label ? (
        <p className="sr-only">{label}</p>
      ) : null}
      <div
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label={label}
      >
        {tags.map((tag) => {
          const isActive = params.get(tag.param) === tag.value;

          return (
            <button
              key={`${tag.param}-${tag.value}`}
              type="button"
              aria-pressed={isActive}
              onClick={() => onToggle(tag.param, tag.value)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs tracking-wide whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold",
                isActive
                  ? "border-brand-navy bg-brand-navy text-brand-ivory"
                  : "border-brand-gold/25 bg-brand-surface text-brand-text/75 hover:border-brand-gold/50 hover:text-brand-text",
              )}
            >
              {tag.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
