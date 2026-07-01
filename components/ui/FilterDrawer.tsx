"use client";

import { cn } from "@/lib/utils";
import { useEffect, type ReactNode } from "react";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function FilterDrawer({
  open,
  onClose,
  title = "Filters",
  children,
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
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        aria-label="Close filters"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-brand-gold/20 px-4 py-4">
          <h2 className="text-sm font-medium text-brand-navy">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm p-1 text-brand-charcoal/55 hover:bg-brand-cream hover:text-brand-navy"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className={cn("flex-1 overflow-y-auto p-4")}>{children}</div>
      </div>
    </div>
  );
}
