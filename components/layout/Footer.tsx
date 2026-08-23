import { BrandLogo } from "@/components/layout/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { BRAND_CONTACT } from "@/constants/contact";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("navigation");
  const tCommon = await getTranslations("common");

  const footerLinks = {
    shop: [
      { label: t("rings"), href: "/rings" as const },
      { label: tNav("necklaces"), href: "/necklaces" as const },
      { label: tNav("earrings"), href: "/earrings" as const },
      { label: tNav("bracelets"), href: "/bracelets" as const },
      {
        label: t("coloredDiamonds"),
        href: "/colored-lab-grown-diamonds" as const,
      },
      { label: t("looseDiamonds"), href: "/diamonds" as const },
    ],
    services: [
      { label: tNav("createYourRing"), href: "/create-ring" as const },
      { label: t("bookConsultation"), href: "/appointment" as const },
      { label: t("diamondGuide"), href: "/guides" as const },
      { label: t("certification"), href: "/certification" as const },
    ],
    company: [
      { label: t("aboutUs"), href: "/about" as const },
      { label: t("deliveryInfo"), href: "/delivery-returns" as const },
      { label: t("contact"), href: "/contact" as const },
    ],
  };

  return (
    <footer className="border-t border-brand-border bg-brand-bg-deep text-brand-on-deep">
      <Container className="py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <BrandLogo size="md" variant="light" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-muted-on-deep">
              {t("description")}
            </p>
            <p className="mt-3 text-sm text-brand-gold">{t("locationLine")}</p>
            <p className="mt-1 text-sm text-brand-muted-on-deep">
              <a
                href={BRAND_CONTACT.phoneHref}
                className="transition-colors hover:text-brand-teal-soft"
              >
                {BRAND_CONTACT.phone}
              </a>
              {" · "}
              <a
                href={`mailto:${BRAND_CONTACT.email}`}
                className="transition-colors hover:text-brand-teal-soft"
              >
                {BRAND_CONTACT.email}
              </a>
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <p className="font-serif text-base text-brand-on-deep">
                  {t("founderName")}
                </p>
                <p className="mt-1 text-[11px] tracking-[0.12em] text-brand-gold uppercase">
                  {t("founderTitle")}
                </p>
              </div>
              <div>
                <p className="font-serif text-base text-brand-on-deep">
                  {t("coFounderName")}
                </p>
                <p className="mt-1 text-[11px] tracking-[0.12em] text-brand-gold uppercase">
                  {t("coFounderTitle")}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Button href="/appointment" variant="gold" size="sm">
                {t("bookConsultation")}
              </Button>
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-medium tracking-[0.2em] text-brand-gold uppercase">
                {t(section as "shop" | "services" | "company")}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-muted-on-deep transition-colors hover:text-brand-teal-soft"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 border-t border-white/10 pt-8 text-xs leading-relaxed text-brand-muted-on-deep">
          {t("trustNote")}
        </p>
        <p className="mt-4 text-xs text-brand-muted-on-deep">
          {tCommon("copyright", { year: new Date().getFullYear() })}
        </p>
      </Container>
    </footer>
  );
}
