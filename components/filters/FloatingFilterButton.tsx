"use client";

import { FilterIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface FloatingFilterButtonProps {
  label: string;
  activeCount?: number;
  onClick: () => void;
  className?: string;
}

export function countActiveFilterParams(
  params: URLSearchParams,
  ignoreKeys: string[] = ["sort", "page", "search"],
) {
  const ignored = new Set(ignoreKeys);
  let count = 0;
  params.forEach((value, key) => {
    if (!ignored.has(key) && value) count += 1;
  });
  return count;
}

export function FloatingFilterButton({
  label,
  activeCount = 0,
  onClick,
  className,
}: FloatingFilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-brand-navy px-5 py-3 text-sm tracking-wide text-brand-ivory shadow-lg shadow-brand-navy/20 transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold lg:hidden",
        className,
      )}
    >
      <FilterIcon className="h-4 w-4" />
      <span>{label}</span>
      {activeCount > 0 ? (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-gold px-1.5 text-[11px] font-medium text-brand-navy">
          {activeCount}
        </span>
      ) : null}
    </button>
  );
}
