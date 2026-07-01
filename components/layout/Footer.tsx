import { BrandLogo } from "@/components/layout/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("navigation");
  const tCommon = await getTranslations("common");

  const footerLinks = {
    shop: [
      { label: t("looseDiamonds"), href: "/diamonds" as const },
      { label: tNav("engagementRings"), href: "/products?type=engagement-ring" as const },
      { label: t("diamondRings"), href: "/products" as const },
      { label: tNav("ringSettings"), href: "/create-ring/setting" as const },
    ],
    services: [
      { label: tNav("createYourRing"), href: "/create-ring" as const },
      { label: t("bookConsultation"), href: "/appointment" as const },
      { label: t("ringSizeGuide"), href: "/about" as const },
      { label: t("diamondGuide"), href: "/about" as const },
    ],
    company: [
      { label: t("aboutUs"), href: "/about" as const },
      { label: t("deliveryInfo"), href: "/about" as const },
      { label: t("returnsPolicy"), href: "/about" as const },
      { label: t("contact"), href: "/appointment" as const },
    ],
  };

  return (
    <footer className="border-t border-brand-gold/20 bg-brand-navy text-brand-ivory">
      <Container className="py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <BrandLogo size="md" variant="light" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-ivory/70">
              {t("description")}
            </p>
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
                      className="text-sm text-brand-ivory/70 transition-colors hover:text-brand-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 border-t border-brand-gold/20 pt-8 text-xs leading-relaxed text-brand-ivory/50">
          {t("trustNote")}
        </p>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-brand-ivory/50">
            {tCommon("copyright", { year: new Date().getFullYear() })}
          </p>
          <p className="text-xs text-brand-gold/80">{tCommon("tagline")}</p>
        </div>
      </Container>
    </footer>
  );
}
