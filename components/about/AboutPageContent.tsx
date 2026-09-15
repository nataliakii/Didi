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
      <section className="pt-12 lg:pt-16">
        <Container>
          <p className="section-eyebrow">{t("eyebrow")}</p>
          <h1 className="mt-2 font-serif text-3xl text-brand-text sm:text-4xl">
            {t("pageTitle")}
          </h1>
        </Container>

        <div className="mt-10 border-t border-brand-gold/20 lg:mt-12 lg:grid lg:grid-cols-2 lg:items-stretch">
          <div className="relative aspect-[2/3] w-full overflow-hidden bg-brand-cream sm:aspect-[3/4] lg:aspect-auto lg:min-h-[36rem]">
            <DemoImage
              src={DEMO_ABOUT_IMAGES.founder}
              alt={`${t("founderName")}, ${t("dianaTitle")}`}
              placeholderKind="diamond"
              fill
              priority
              className="object-cover object-[center_20%]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col justify-center px-4 py-10 sm:px-6 sm:py-12 lg:px-12 lg:py-16 xl:px-16 xl:pr-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            <div className="mx-auto w-full max-w-md space-y-10 lg:mx-0">
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
                    <p className="mt-6 leading-relaxed text-brand-charcoal/75">
                      {t("founderBio")}
                    </p>
                  )}
                  {index === 1 && (
                    <p className="mt-6 leading-relaxed text-brand-charcoal/75">
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
                <p className="mt-4 leading-relaxed text-brand-charcoal/75">
                  {t("houseDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutJourney />
    </>
  );
}
