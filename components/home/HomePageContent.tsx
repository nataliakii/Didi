import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DemoImage } from "@/components/ui/DemoImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeUspStrip } from "@/components/home/HomeUspStrip";
import { ShopDiamondsByShape } from "@/components/home/ShopDiamondsByShape";
import { ShopJewelryByCategory } from "@/components/home/ShopJewelryByCategory";
import { ProductCard } from "@/components/product/ProductCard";
import { DEMO_ABOUT_IMAGES, DEMO_CONSULTATION_IMAGES } from "@/constants/demo-images";
import { BRAND_TEAM, type BrandPerson } from "@/constants/contact";
import { Link } from "@/i18n/routing";
import { getFeaturedProducts } from "@/services/product.service";
import type { ProductSummary } from "@/types";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

const FOUNDER_PHOTOS: Partial<Record<BrandPerson["name"], string>> = {
  "Diana Angelaki": DEMO_ABOUT_IMAGES.founder,
};

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function TrustStripItem({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5 text-center sm:justify-start">
      <span
        className="h-px w-4 shrink-0 bg-brand-gold/40 sm:w-5"
        aria-hidden
      />
      <span className="text-[11px] tracking-[0.08em] text-brand-text/65 uppercase sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export async function HomePageContent() {
  const t = await getTranslations("home");
  const tAbout = await getTranslations("about");
  const tCommon = await getTranslations("common");

  const featuredProducts = await getFeaturedProducts(4);

  const trustItems = [
    t("trustCertified"),
    t("trustBespoke"),
    t("trustSecure"),
    t("trustAppointment"),
  ];

  const guarantees = [
    {
      title: t("guaranteeLabsTitle"),
      body: t("guaranteeLabsBody"),
    },
    {
      title: t("guaranteeReportTitle"),
      body: t("guaranteeReportBody"),
    },
    {
      title: t("guaranteeTraceTitle"),
      body: t("guaranteeTraceBody"),
    },
  ];

  const faqs = [
    { question: t("faq1Question"), answer: t("faq1Answer") },
    { question: t("faq2Question"), answer: t("faq2Answer") },
    { question: t("faq3Question"), answer: t("faq3Answer") },
  ];

  return (
    <>
      <Suspense
        fallback={
          <div className="hero-section" style={{ minHeight: "85svh" }} />
        }
      >
        <HomeHero />
      </Suspense>

      <section
        id="asteria-intro"
        className="scroll-mt-14 border-b border-brand-gold/15 bg-brand-bg py-12 sm:py-16 lg:scroll-mt-28"
      >
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-eyebrow">{t("brandIntroEyebrow")}</p>
            <h2 className="mt-3 font-serif text-[1.85rem] leading-tight font-normal text-brand-text sm:text-4xl">
              {t("brandIntroTitle")}
            </h2>
            <p className="mt-5 font-serif text-base leading-relaxed text-brand-charcoal/70 sm:text-lg">
              {t("brandPositioning")}
            </p>
            <p className="mt-6 text-sm text-brand-gold" aria-hidden>
              ✦
            </p>

            <ul className="mt-8 flex items-center justify-center gap-8">
              {BRAND_TEAM.map((person) => {
                const photo = FOUNDER_PHOTOS[person.name];
                return (
                  <li
                    key={person.name}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border border-brand-gold/30 bg-brand-cream sm:h-[4.5rem] sm:w-[4.5rem]">
                      {photo ? (
                        <DemoImage
                          src={photo}
                          alt={`${person.name}, ${tAbout(person.titleKey)}`}
                          placeholderKind="diamond"
                          fill
                          className="object-cover object-[center_20%]"
                          sizes="72px"
                        />
                      ) : (
                        <span
                          className="flex h-full w-full items-center justify-center font-serif text-lg tracking-[0.12em] text-brand-text"
                          aria-hidden
                        >
                          {initialsFor(person.name)}
                        </span>
                      )}
                    </div>
                    <p className="font-serif text-sm text-brand-text">
                      {person.name}
                    </p>
                    <p className="text-[10px] tracking-[0.14em] text-brand-gold uppercase">
                      {tAbout(person.titleKey)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </section>

      <section className="border-b border-brand-gold/15 bg-brand-bg py-6">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {trustItems.map((item) => (
              <TrustStripItem key={item} label={item} />
            ))}
          </div>
        </Container>
      </section>

      <HomeUspStrip />

      <ShopJewelryByCategory />

      <ShopDiamondsByShape />

      <section className="border-y border-brand-gold/15 bg-brand-cream/30 py-16 sm:py-20">
        <Container>
          <div className="flex items-end justify-between">
            <div>
              <p className="section-eyebrow">{t("curatedEyebrow")}</p>
              <h2 className="mt-2 font-serif text-3xl text-brand-text">
                {t("featuredProducts")}
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden text-sm text-brand-text/70 transition-colors hover:text-brand-gold sm:block"
            >
              {tCommon("viewAll")}
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
              {featuredProducts.map((product: ProductSummary) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState
                title={t("productsEmptyTitle")}
                description={t("productsEmptyDescription")}
                action={<Button href="/products">{t("browseCatalogue")}</Button>}
              />
            </div>
          )}
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-brand-gold/20 bg-brand-cream">
              <DemoImage
                src={DEMO_CONSULTATION_IMAGES.privateDiamond}
                fallback={DEMO_CONSULTATION_IMAGES.ringDesign}
                alt={t("consultationImageAlt")}
                placeholderKind="diamond"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="section-eyebrow">{t("consultationEyebrow")}</p>
              <h2 className="mt-2 font-serif text-3xl text-brand-text sm:text-4xl">
                {t("appointmentTitle")}
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-brand-charcoal/70">
                {t("appointmentDescription")}
              </p>
              <div className="mt-8">
                <Button href="/appointment" size="lg">
                  {t("bookAppointment")}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-brand-gold/10 bg-brand-cream/25 py-12 sm:py-14">
        <Container>
          <div className="text-center">
            <p className="section-eyebrow">{t("guaranteesEyebrow")}</p>
            <h2 className="mt-2 font-serif text-xl text-brand-text sm:text-2xl">
              {t("guaranteesTitle")}
            </h2>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {guarantees.map((item) => (
              <div
                key={item.title}
                className="rounded-sm border border-brand-gold/15 bg-brand-surface p-5 text-center sm:text-left"
              >
                <h3 className="font-serif text-lg text-brand-text">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/70">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/certification"
              className="text-xs tracking-[0.2em] text-brand-gold uppercase transition-colors hover:text-brand-text"
            >
              {t("guaranteesCta")} →
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-14">
        <Container>
          <div className="text-center">
            <p className="section-eyebrow">{t("faqEyebrow")}</p>
            <h2 className="mt-2 font-serif text-xl text-brand-text sm:text-2xl">
              {t("faqTitle")}
            </h2>
          </div>
          <div className="mx-auto mt-6 max-w-xl divide-y divide-brand-gold/15">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-4">
                <summary className="cursor-pointer list-none text-sm font-medium text-brand-text">
                  {faq.question}
                  <span className="float-right text-brand-gold/80 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/65">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
