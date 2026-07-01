"use client";

import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const t = useTranslations("navigation");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const trimmed = String(formData.get("search") ?? "").trim();
      if (!trimmed) return;
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
      onClose();
    },
    [router, onClose],
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-brand-navy/40 px-4 pt-24 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t("search")}
      onClick={onClose}
    >
      <form
        key="search-overlay-form"
        className="w-full max-w-xl rounded-sm border border-brand-gold/30 bg-brand-ivory p-4 shadow-none"
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <SearchIcon className="shrink-0 text-brand-navy/50" />
          <input
            ref={inputRef}
            type="search"
            name="search"
            defaultValue=""
            placeholder={t("searchPlaceholder")}
            className={cn(
              "min-w-0 flex-1 bg-transparent font-serif text-lg text-brand-navy",
              "placeholder:text-brand-navy/40 focus:outline-none",
            )}
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm p-1.5 text-brand-navy/60 hover:text-brand-navy"
            aria-label={t("closeSearch")}
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
