"use client";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { CartIconButton } from "@/components/cart/CartIconButton";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Container } from "@/components/ui/Container";
import {
  CalendarIcon,
  ChevronDownIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  PhoneIcon,
  SearchIcon,
} from "@/components/ui/icons";
import { BRAND_CONTACT } from "@/constants/contact";
import type { AppPathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Suspense, useCallback, useEffect, useState } from "react";

function IconLink({
  href,
  external,
  label,
  children,
  onClick,
}: {
  href?: AppPathname | `${AppPathname}?${string}` | string;
  external?: boolean;
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const className =
    "inline-flex items-center justify-center rounded-sm p-2 text-brand-navy/60 transition-colors hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold";

  if (external && href) {
    return (
      <a href={href} className={className} aria-label={label}>
        {children}
      </a>
    );
  }

  if (href && !external) {
    return (
      <Link
        href={href as AppPathname}
        className={className}
        aria-label={label}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Header() {
  const t = useTranslations("navigation");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const categoryLinks = [
    {
      label: t("engagementRings"),
      href: "/products?type=engagement-ring" as const,
    },
    { label: t("diamondRings"), href: "/products" as const },
    { label: t("looseDiamonds"), href: "/diamonds" as const },
    { label: t("ringSettings"), href: "/create-ring/setting" as const },
    { label: t("createYourRing"), href: "/create-ring" as const },
    { label: t("consultations"), href: "/appointment" as const },
  ];

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobile();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen, closeMobile]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-brand-gold/20 bg-brand-ivory/95 backdrop-blur-sm">
        <Container>
          <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center lg:h-16">
            {/* Left */}
            <div className="flex items-center justify-start gap-0.5">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-sm p-2 text-brand-navy lg:hidden"
                aria-label={t("toggleMenu")}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((open) => !open)}
              >
                {mobileOpen ? (
                  <CloseIcon className="h-6 w-6" />
                ) : (
                  <MenuIcon className="h-6 w-6" />
                )}
              </button>
              <div className="hidden items-center gap-0.5 lg:flex">
                <IconLink
                  href={BRAND_CONTACT.phoneHref}
                  external
                  label={t("callUs")}
                >
                  <PhoneIcon />
                </IconLink>
                <IconLink href="/appointment" label={t("bookAppointment")}>
                  <CalendarIcon />
                </IconLink>
              </div>
            </div>

            {/* Center logo */}
            <Link
              href="/"
              className="justify-self-center transition-opacity hover:opacity-90"
              onClick={closeMobile}
            >
              <BrandLogo size="md" />
            </Link>

            {/* Right */}
            <div className="flex items-center justify-end gap-0.5">
              <IconLink label={t("search")} onClick={() => setSearchOpen(true)}>
                <SearchIcon />
              </IconLink>
              <button
                type="button"
                className="hidden rounded-sm p-2 text-brand-navy/60 transition-colors hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:inline-flex"
                aria-label={t("wishlist")}
                disabled
                title={t("wishlistComingSoon")}
              >
                <HeartIcon />
              </button>
              <CartIconButton onNavigate={closeMobile} />
              <div className="hidden lg:block">
                <Suspense fallback={null}>
                  <LanguageSwitcher />
                </Suspense>
              </div>
            </div>
          </div>
        </Container>

        {/* Row 2 — category navigation (desktop) */}
        <div className="hidden border-t border-brand-gold/15 lg:block">
          <Container>
            <nav
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-2.5"
              aria-label={t("categoryNav")}
            >
              {categoryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex items-center gap-1 text-[11px] tracking-[0.2em] text-brand-navy/70 uppercase transition-colors hover:text-brand-navy"
                >
                  {link.label}
                  <ChevronDownIcon className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-40" />
                </Link>
              ))}
            </nav>
          </Container>
        </div>

        {/* Mobile drawer */}
        <div
          className={cn(
            "border-t border-brand-gold/20 bg-brand-ivory lg:hidden",
            mobileOpen ? "block" : "hidden",
          )}
          role="dialog"
          aria-modal="true"
          aria-label={t("menu")}
        >
          <Container className="py-4">
            <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-brand-gold/15 pb-4">
              <IconLink
                href={BRAND_CONTACT.phoneHref}
                external
                label={t("callUs")}
                onClick={closeMobile}
              >
                <PhoneIcon />
              </IconLink>
              <IconLink
                href="/appointment"
                label={t("bookAppointment")}
                onClick={closeMobile}
              >
                <CalendarIcon />
              </IconLink>
              <Suspense fallback={null}>
                <LanguageSwitcher className="ml-auto" />
              </Suspense>
            </div>
            <nav className="flex flex-col gap-0.5" aria-label={t("categoryNav")}>
              {categoryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-2.5 text-sm tracking-wide text-brand-navy/80 hover:text-brand-navy"
                  onClick={closeMobile}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/cart"
                className="py-2.5 text-sm tracking-wide text-brand-navy/80 hover:text-brand-navy"
                onClick={closeMobile}
              >
                {t("shoppingBag")}
              </Link>
            </nav>
          </Container>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
