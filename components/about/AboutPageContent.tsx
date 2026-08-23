import { AboutJourney } from "@/components/about/AboutJourney";
import { Container } from "@/components/ui/Container";
import { DemoImage } from "@/components/ui/DemoImage";
import { DEMO_ABOUT_IMAGES } from "@/constants/demo-images";
import { BRAND_TEAM } from "@/constants/contact";
import { getTranslations } from "next-intl/server";

export async function AboutPageContent() {
  const t = await getTranslations("about");

  return (
    <>
      <Container className="py-12 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <p className="section-eyebrow">{t("eyebrow")}</p>
          <h1 className="mt-2 font-serif text-3xl text-brand-text sm:text-4xl">
            {t("pageTitle")}
          </h1>

          <div className="mt-12 grid items-start gap-10 border-t border-brand-gold/20 pt-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <div className="relative mx-auto aspect-[2/3] w-full max-w-sm overflow-hidden rounded-sm border border-brand-gold/20 bg-brand-cream lg:mx-0 lg:max-w-none">
              <DemoImage
                src={DEMO_ABOUT_IMAGES.founder}
                alt={`${t("founderName")}, ${t("dianaTitle")}`}
                placeholderKind="diamond"
                fill
                priority
                className="object-cover object-[center_20%]"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>

            <div className="lg:pt-6 space-y-10">
              {BRAND_TEAM.map((person, index) => (
                <div
                  key={person.name}
                  className={
                    index > 0
                      ? "border-t border-brand-gold/20 pt-8"
                      : undefined
                  }
                >
                  <p className="font-serif text-2xl text-brand-text sm:text-3xl">
                    {person.name}
                  </p>
                  <p className="mt-2 text-xs tracking-[0.14em] text-brand-gold uppercase">
                    {t(person.titleKey)}
                  </p>
                  {index === 0 && (
                    <p className="mt-6 max-w-md leading-relaxed text-brand-charcoal/75">
                      {t("founderBio")}
                    </p>
                  )}
                  {index === 1 && (
                    <p className="mt-6 max-w-md leading-relaxed text-brand-charcoal/75">
                      {t("coFounderBio")}
                    </p>
                  )}
                  <div className="mt-6 space-y-1 text-sm text-brand-charcoal/70">
                    <p>
                      <a
                        href={person.phoneHref}
                        className="text-brand-teal underline-offset-2 hover:underline"
                      >
                        {person.phone}
                      </a>
                    </p>
                    <p>
                      <a
                        href={`mailto:${person.email}`}
                        className="text-brand-teal underline-offset-2 hover:underline"
                      >
                        {person.email}
                      </a>
                    </p>
                  </div>
                </div>
              ))}

              <div className="border-t border-brand-gold/20 pt-10">
                <h2 className="font-serif text-xl text-brand-text">
                  {t("houseTitle")}
                </h2>
                <p className="mt-4 max-w-md leading-relaxed text-brand-charcoal/75">
                  {t("houseDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <AboutJourney />
    </>
  );
}
