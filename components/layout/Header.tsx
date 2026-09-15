"use client";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { AccountMenuButton } from "@/components/account/AccountMenuButton";
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
import { SUPPORTED_LOCALES } from "@/constants/i18n";
import { BRAND_CONTACT } from "@/constants/contact";
import type { AppPathname } from "@/i18n/routing";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { usePathname as useNextPathname } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

function isStorefrontHome(pathname: string) {
  const clean = (pathname || "/").split("?")[0].replace(/\/+$/, "") || "/";
  const parts = clean.split("/").filter(Boolean);
  if (parts.length === 0) return true;
  return (
    parts.length === 1 &&
    (SUPPORTED_LOCALES as readonly string[]).includes(parts[0])
  );
}

const headerIconButtonClass =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-sm leading-none text-brand-text transition-colors hover:text-brand-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal";

function IconLink({
  href,
  external,
  label,
  children,
  onClick,
  className,
}: {
  href?: AppPathname | `${AppPathname}?${string}` | string;
  external?: boolean;
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const classes = cn(headerIconButtonClass, className);

  if (external && href) {
    return (
      <a href={href} className={classes} aria-label={label}>
        {children}
      </a>
    );
  }

  if (href && !external) {
    return (
      <Link
        href={href as AppPathname}
        className={classes}
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
      className={classes}
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Header() {
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const nextPathname = useNextPathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isHome =
    isStorefrontHome(pathname) || isStorefrontHome(nextPathname);
  const [overHero, setOverHero] = useState(isHome);
  const overlay = isHome && overHero && !mobileOpen;
  const overlayIconClass = overlay
    ? "text-brand-ivory hover:text-brand-gold"
    : undefined;

  const categoryLinks = [
    { label: t("rings"), href: "/rings" as const },
    { label: t("necklaces"), href: "/necklaces" as const },
    { label: t("earrings"), href: "/earrings" as const },
    { label: t("bracelets"), href: "/bracelets" as const },
    {
      label: t("coloredDiamonds"),
      href: "/colored-lab-grown-diamonds" as const,
    },
    { label: t("looseDiamonds"), href: "/diamonds" as const },
    { label: t("createYourRing"), href: "/create-ring" as const },
    { label: t("aboutUs"), href: "/about" as const },
    { label: t("guides"), href: "/guides" as const },
    { label: t("contact"), href: "/contact" as const },
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

  useEffect(() => {
    if (!isHome) {
      setOverHero(false);
      return;
    }

    const onScroll = () => {
      setOverHero(window.scrollY < 240);
    };

    setOverHero(window.scrollY < 240);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b",
          overlay
            ? "header-on-hero"
            : "is-scrolled border-brand-border/80 bg-brand-bg/80 backdrop-blur-md",
        )}
      >
        <Container>
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-1 sm:gap-2 lg:h-[4.5rem]">
            {/* Left */}
            <div className="flex h-full items-center justify-start">
              <button
                type="button"
                className={cn(
                  headerIconButtonClass,
                  "appearance-none lg:hidden [&_svg]:block",
                  overlay ? "text-brand-ivory" : "text-brand-text",
                )}
                aria-label={t("toggleMenu")}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((open) => !open)}
              >
                {mobileOpen ? (
                  <CloseIcon className="block h-5 w-5" />
                ) : (
                  <MenuIcon className="block h-5 w-5" />
                )}
              </button>
              <div className="hidden items-center gap-1.5 sm:gap-2 lg:flex">
                <IconLink
                  href={BRAND_CONTACT.phoneHref}
                  external
                  label={t("callUs")}
                  className={overlayIconClass}
                >
                  <PhoneIcon />
                </IconLink>
                <IconLink
                  href="/appointment"
                  label={t("bookAppointment")}
                  className={overlayIconClass}
                >
                  <CalendarIcon />
                </IconLink>
              </div>
            </div>

            {/* Center logo — a single BrandLogo instance, never duplicated */}
            <Link
              href="/"
              className="flex h-full max-h-full min-w-0 items-center justify-center justify-self-center overflow-hidden transition-opacity hover:opacity-90"
              aria-label="Asteria Diamond House"
              onClick={closeMobile}
            >
              <BrandLogo
                size="md"
                variant={overlay ? "light" : "default"}
                className="max-h-full"
                priority
              />
            </Link>

            {/* Right */}
            <div className="flex h-full items-center justify-end gap-0 sm:gap-1">
              <IconLink
                label={t("search")}
                onClick={() => setSearchOpen(true)}
                className={overlayIconClass}
              >
                <SearchIcon className="h-5 w-5" />
              </IconLink>
              <AccountMenuButton
                onNavigate={closeMobile}
                className={overlayIconClass}
              />
              <button
                type="button"
                className={cn(
                  headerIconButtonClass,
                  "hidden lg:inline-flex",
                  overlay
                    ? "text-brand-ivory hover:text-brand-gold"
                    : "text-brand-text hover:text-brand-crimson-soft",
                )}
                aria-label={t("wishlist")}
                disabled
                title={t("wishlistComingSoon")}
              >
                <HeartIcon />
              </button>
              <CartIconButton
                onNavigate={closeMobile}
                className={cn(
                  headerIconButtonClass,
                  overlay
                    ? "text-brand-ivory hover:text-brand-gold"
                    : "text-brand-text hover:text-brand-teal",
                )}
              />
              <div className="ml-1 hidden items-center gap-2 border-l border-brand-border pl-3 lg:flex">
                <Suspense fallback={null}>
                  <LanguageSwitcher />
                </Suspense>
              </div>
            </div>
          </div>
        </Container>

        {/* Row 2 — category navigation (desktop) */}
        <div
          className={cn(
            "hidden border-t border-brand-border lg:block",
            overlay && "lg:hidden",
          )}
        >
          <Container>
            <nav
              className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-2.5"
              aria-label={t("categoryNav")}
            >
              {categoryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex items-center gap-1 text-[11px] tracking-[0.2em] text-brand-text uppercase transition-colors hover:text-brand-teal"
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
            "border-t border-brand-gold/20 bg-brand-bg lg:hidden",
            mobileOpen ? "block" : "hidden",
          )}
          role="dialog"
          aria-modal="true"
          aria-label={t("menu")}
        >
          <Container className="py-4">
            <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-brand-border pb-4">
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
              <AccountMenuButton onNavigate={closeMobile} />
              <div className="ml-auto flex items-center gap-2">
                <Suspense fallback={null}>
                  <LanguageSwitcher />
                </Suspense>
              </div>
            </div>
            <nav className="flex flex-col gap-0.5" aria-label={t("categoryNav")}>
              {categoryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-2.5 text-sm tracking-wide text-brand-text/80 hover:text-brand-text"
                  onClick={closeMobile}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/cart"
                className="py-2.5 text-sm tracking-wide text-brand-text/80 hover:text-brand-text"
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
