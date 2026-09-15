"use client";

import { cn } from "@/lib/utils";
import { useEffect, type ReactNode } from "react";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function FilterDrawer({
  open,
  onClose,
  title = "Filters",
  children,
  footer,
}: FilterDrawerProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close filters"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-x-0 bottom-0 flex max-h-[92svh] flex-col rounded-t-2xl bg-brand-surface shadow-xl"
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-brand-gold/35" aria-hidden />
        <div className="flex items-center justify-between border-b border-brand-gold/20 px-4 py-3">
          <h2 className="text-sm font-medium tracking-wide text-brand-text">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm p-1 text-brand-charcoal/55 hover:bg-brand-cream hover:text-brand-text"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className={cn("flex-1 overflow-y-auto p-4")}>{children}</div>
        {footer ? (
          <div className="border-t border-brand-gold/20 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
