"use client";

import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface GradeRangeSliderProps {
  label: string;
  grades: readonly string[];
  minValue?: string | null;
  maxValue?: string | null;
  onChange: (min: string | null, max: string | null) => void;
  onInfoClick?: () => void;
  className?: string;
}

export function GradeRangeSlider({
  label,
  grades,
  minValue,
  maxValue,
  onChange,
  onInfoClick,
  className,
}: GradeRangeSliderProps) {
  const minIndex = useMemo(() => {
    if (!minValue) return 0;
    const index = grades.indexOf(minValue);
    return index === -1 ? 0 : index;
  }, [grades, minValue]);

  const maxIndex = useMemo(() => {
    if (!maxValue) return grades.length - 1;
    const index = grades.indexOf(maxValue);
    return index === -1 ? grades.length - 1 : index;
  }, [grades, maxValue]);

  const isDefault = minIndex === 0 && maxIndex === grades.length - 1;

  function updateRange(nextMin: number, nextMax: number) {
    const from = Math.min(nextMin, nextMax);
    const to = Math.max(nextMin, nextMax);
    const fullRange = from === 0 && to === grades.length - 1;
    onChange(
      fullRange ? null : grades[from] ?? null,
      fullRange ? null : grades[to] ?? null,
    );
  }

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium tracking-[0.2em] text-brand-navy/60 uppercase">
            {label}
          </p>
          {onInfoClick && (
            <button
              type="button"
              onClick={onInfoClick}
              aria-label={`${label} information`}
              className="flex h-4 w-4 items-center justify-center rounded-full border border-brand-gold/40 text-[10px] text-brand-navy/55 hover:border-brand-navy hover:text-brand-navy"
            >
              i
            </button>
          )}
        </div>
        {!isDefault && (
          <span className="text-[11px] text-brand-navy/55">
            {grades[minIndex]} – {grades[maxIndex]}
          </span>
        )}
      </div>

      <div className="relative px-1 pt-1 pb-2">
        <div className="relative h-1.5 rounded-full bg-brand-cream">
          <div
            className="absolute h-1.5 rounded-full bg-brand-navy/80"
            style={{
              left: `${(minIndex / Math.max(grades.length - 1, 1)) * 100}%`,
              right: `${100 - (maxIndex / Math.max(grades.length - 1, 1)) * 100}%`,
            }}
          />
        </div>

        <input
          type="range"
          min={0}
          max={grades.length - 1}
          value={minIndex}
          aria-label={`${label} minimum`}
          onChange={(event) => {
            const next = Number(event.target.value);
            updateRange(next, Math.max(next, maxIndex));
          }}
          className="grade-range-input absolute inset-x-0 top-0 h-1.5 w-full appearance-none bg-transparent"
        />
        <input
          type="range"
          min={0}
          max={grades.length - 1}
          value={maxIndex}
          aria-label={`${label} maximum`}
          onChange={(event) => {
            const next = Number(event.target.value);
            updateRange(Math.min(next, minIndex), next);
          }}
          className="grade-range-input absolute inset-x-0 top-0 h-1.5 w-full appearance-none bg-transparent"
        />
      </div>

      <div className="mt-1 flex justify-between gap-0.5">
        {grades.map((grade, index) => {
          const inRange = index >= minIndex && index <= maxIndex;
          return (
            <button
              key={grade}
              type="button"
              title={grade}
              onClick={() => {
                if (Math.abs(index - minIndex) <= Math.abs(index - maxIndex)) {
                  updateRange(index, maxIndex);
                } else {
                  updateRange(minIndex, index);
                }
              }}
              className={cn(
                "min-w-0 flex-1 truncate text-center text-[9px] tracking-wide sm:text-[10px]",
                inRange ? "text-brand-navy" : "text-brand-charcoal/35",
              )}
            >
              {grade}
            </button>
          );
        })}
      </div>
    </div>
  );
}
