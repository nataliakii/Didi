"use client";

import { ChevronDownIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { useEffect, useId, useRef, useState } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id: string;
  label: string;
  value?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Select({
  id,
  label,
  value = "",
  options,
  placeholder = "Select...",
  onChange,
  className,
}: SelectProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const selected = options.find((option) => option.value === value);
  const displayLabel = selected?.label ?? placeholder;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function choose(nextValue: string) {
    onChange?.(nextValue);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={cn("relative space-y-1.5", className)}>
      <label
        id={`${id}-label`}
        htmlFor={id}
        className="text-xs font-medium tracking-[0.15em] text-brand-muted uppercase"
      >
        {label}
      </label>

      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-sm border border-brand-border bg-brand-surface px-3 py-2.5 text-left text-sm transition-colors",
          "text-brand-text hover:border-brand-teal/40 focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal/40",
          open && "border-brand-teal ring-1 ring-brand-teal/40",
        )}
      >
        <span className={cn(!selected && "text-brand-muted")}>{displayLabel}</span>
        <ChevronDownIcon
          className={cn(
            "h-4 w-4 shrink-0 text-brand-muted transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="absolute z-40 mt-1.5 max-h-64 w-full overflow-auto rounded-sm border border-brand-border bg-brand-surface py-1.5 shadow-[0_12px_40px_rgba(2,13,26,0.35)]"
        >
          <li role="option" aria-selected={value === ""}>
            <button
              type="button"
              onClick={() => choose("")}
              className={cn(
                "flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors",
                value === ""
                  ? "bg-brand-teal/15 text-brand-teal"
                  : "text-brand-muted hover:bg-brand-surface-hover hover:text-brand-text",
              )}
            >
              <span>{placeholder}</span>
              {value === "" && (
                <span className="text-brand-teal" aria-hidden>
                  ✓
                </span>
              )}
            </button>
          </li>
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => choose(option.value)}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors",
                    isActive
                      ? "bg-brand-teal/15 text-brand-teal"
                      : "text-brand-text hover:bg-brand-surface-hover",
                  )}
                >
                  <span>{option.label}</span>
                  {isActive && (
                    <span className="text-brand-teal" aria-hidden>
                      ✓
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
