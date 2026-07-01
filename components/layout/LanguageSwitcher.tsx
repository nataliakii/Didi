"use client";

import {
  LOCALE_FLAGS,
  LOCALE_LABELS,
  SUPPORTED_LOCALES,
  type Locale,
} from "@/constants/i18n";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("navigation");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(nextLocale: Locale) {
    const query = searchParams.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    router.replace(href, { locale: nextLocale });
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1.5 rounded-sm border border-brand-gold/30 px-2.5 py-1.5 text-xs text-brand-navy/70 transition-colors hover:border-brand-gold hover:text-brand-navy"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("selectLanguage")}
      >
        <span aria-hidden="true">{LOCALE_FLAGS[locale]}</span>
        <span className="hidden sm:inline">{LOCALE_LABELS[locale]}</span>
        <span className="sm:hidden">{locale.toUpperCase()}</span>
        <svg
          className={cn("h-3 w-3 transition-transform", open && "rotate-180")}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("language")}
          className="absolute right-0 z-50 mt-2 max-h-72 w-48 overflow-auto rounded-sm border border-brand-gold/25 bg-white py-1 shadow-lg"
        >
          {SUPPORTED_LOCALES.map((supportedLocale) => (
            <li
              key={supportedLocale}
              role="option"
              aria-selected={supportedLocale === locale}
            >
              <button
                type="button"
                onClick={() => switchLocale(supportedLocale)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-brand-cream",
                  supportedLocale === locale
                    ? "font-medium text-brand-navy"
                    : "text-brand-navy/70",
                )}
              >
                <span aria-hidden="true">{LOCALE_FLAGS[supportedLocale]}</span>
                <span>{LOCALE_LABELS[supportedLocale]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
