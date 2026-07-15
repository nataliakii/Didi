import { Container } from "@/components/ui/Container";
import { getTranslations } from "next-intl/server";

export async function AboutPageContent() {
  const t = await getTranslations("about");

  return (
    <Container className="py-12 lg:py-16">
      <div className="mx-auto max-w-2xl">
        <p className="section-eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-2 font-serif text-3xl text-brand-navy sm:text-4xl">
          {t("pageTitle")}
        </h1>

        <div className="mt-12 border-t border-brand-gold/20 pt-10">
          <p className="font-serif text-2xl text-brand-navy">{t("founderName")}</p>
          <p className="mt-2 text-xs tracking-[0.14em] text-brand-gold uppercase">
            {t("founderTitle")}
          </p>
          <p className="mt-6 leading-relaxed text-brand-charcoal/75">
            {t("founderBio")}
          </p>
        </div>

        <div className="mt-12 border-t border-brand-gold/20 pt-10">
          <h2 className="font-serif text-xl text-brand-navy">{t("houseTitle")}</h2>
          <p className="mt-4 leading-relaxed text-brand-charcoal/75">
            {t("houseDescription")}
          </p>
        </div>
      </div>
    </Container>
  );
}
