import { ContentArticle } from "@/components/seo/SeoLandingPage";
import { Button } from "@/components/ui/Button";
import { BRAND_CONTACT, BRAND_TEAM } from "@/constants/contact";
import { BRAND_NAME } from "@/constants/brand";
import { generateLocalizedMetadata } from "@/lib/i18n-metadata";
import { getLocaleFromParamsAsync } from "@/lib/i18n";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return generateLocalizedMetadata(
    params,
    "/contact",
    "contactTitle",
    "contactDescription",
  );
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParamsAsync(params);
  setRequestLocale(locale);
  const t = await getTranslations("contactPage");
  const tAbout = await getTranslations("about");
  const tb = await getTranslations("breadcrumb");

  return (
    <ContentArticle
      breadcrumb={[
        { label: tb("home"), href: "/" },
        { label: t("title") },
      ]}
      title={t("title")}
      intro={t("intro")}
      relatedLinks={[
        { label: t("linkAppointment"), href: "/appointment" },
        { label: t("linkDelivery"), href: "/delivery-returns" },
        { label: t("linkAbout"), href: "/about" },
      ]}
    >
      <section>
        <h2 className="font-serif text-2xl text-brand-text">{t("houseHeading")}</h2>
        <p className="mt-3">{t("houseBody")}</p>
        <dl className="mt-6 space-y-3 text-sm">
          <div>
            <dt className="text-brand-charcoal/45">{t("brandLabel")}</dt>
            <dd className="mt-1 font-medium text-brand-text">{BRAND_NAME}</dd>
          </div>
          <div>
            <dt className="text-brand-charcoal/45">{t("locationLabel")}</dt>
            <dd className="mt-1 font-medium text-brand-text">
              {t("locationValue")}
            </dd>
          </div>
          <div>
            <dt className="text-brand-charcoal/45">{t("emailLabel")}</dt>
            <dd className="mt-1 font-medium text-brand-text">
              <a
                href={`mailto:${BRAND_CONTACT.email}`}
                className="text-brand-teal underline-offset-2 hover:underline"
              >
                {BRAND_CONTACT.email}
              </a>
            </dd>
          </div>
          {BRAND_CONTACT.legalEntity && (
            <div>
              <dt className="text-brand-charcoal/45">{t("legalLabel")}</dt>
              <dd className="mt-1 font-medium text-brand-text">
                {BRAND_CONTACT.legalEntity}
                {BRAND_CONTACT.vatNumber
                  ? ` · ${BRAND_CONTACT.vatNumber}`
                  : ""}
              </dd>
            </div>
          )}
        </dl>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-brand-text">
          {t("teamHeading")}
        </h2>
        <ul className="mt-6 space-y-8">
          {BRAND_TEAM.map((person) => (
            <li key={person.name}>
              <p className="font-serif text-xl text-brand-text">{person.name}</p>
              <p className="mt-1 text-xs tracking-[0.14em] text-brand-gold uppercase">
                {tAbout(person.titleKey)}
              </p>
              <p className="mt-3 text-sm">
                <a
                  href={person.phoneHref}
                  className="text-brand-teal underline-offset-2 hover:underline"
                >
                  {person.phone}
                </a>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-serif text-2xl text-brand-text">
          {t("consultHeading")}
        </h2>
        <p className="mt-3">{t("consultBody")}</p>
        <div className="mt-6">
          <Button href="/appointment" variant="gold">
            {t("consultCta")}
          </Button>
        </div>
      </section>
    </ContentArticle>
  );
}
