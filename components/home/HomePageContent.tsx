import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { DemoImage } from "@/components/ui/DemoImage";
import { EmptyState } from "@/components/ui/EmptyState";
import { PoemHero } from "@/components/home/PoemHero";
import { ShopDiamondsByShape } from "@/components/home/ShopDiamondsByShape";
import { ShopJewelryByCategory } from "@/components/home/ShopJewelryByCategory";
import { ShopRingsByCategory } from "@/components/home/ShopRingsByCategory";
import { ProductCard } from "@/components/product/ProductCard";
import {
  DEMO_CATEGORY_IMAGES,
  DEMO_CONSULTATION_IMAGES,
} from "@/constants/demo-images";
import { Link } from "@/i18n/routing";
import { getFeaturedProducts } from "@/services/product.service";
import type { ProductSummary } from "@/types";
import { getTranslations } from "next-intl/server";

const HOME_CATEGORY_CARDS = [
  {
    key: "createRing",
    image: DEMO_CATEGORY_IMAGES.createRing,
    href: "/create-ring" as const,
    placeholderKind: "ring" as const,
  },
  {
    key: "looseDiamonds",
    image: DEMO_CATEGORY_IMAGES.coloredLabGrownDiamonds,
    href: "/colored-lab-grown-diamonds" as const,
    placeholderKind: "diamond" as const,
  },
  {
    key: "engagementRings",
    image: DEMO_CATEGORY_IMAGES.diamondRings,
    href: "/rings" as const,
    placeholderKind: "ring" as const,
  },
  {
    key: "ringSettings",
    image: DEMO_CATEGORY_IMAGES.ringSettings,
    href: "/create-ring/setting" as const,
    placeholderKind: "setting" as const,
  },
] as const;

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

function VisualCategoryCard({
  title,
  description,
  image,
  href,
  placeholderKind,
  viewLabel,
}: {
  title: string;
  description: string;
  image: string;
  href: (typeof HOME_CATEGORY_CARDS)[number]["href"];
  placeholderKind: "diamond" | "ring" | "setting";
  viewLabel: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block aspect-[4/3] overflow-hidden rounded-sm border border-brand-gold/15 bg-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
    >
      <DemoImage
        src={image}
        alt={title}
        placeholderKind={placeholderKind}
        fill
        className="object-contain p-8 transition-transform duration-700 group-hover:scale-[1.03]"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="font-serif text-lg text-brand-ivory">{title}</h3>
        <p className="mt-1 text-sm text-brand-ivory/75 line-clamp-2">
          {description}
        </p>
        <span className="sr-only">{viewLabel}</span>
      </div>
    </Link>
  );
}

export async function HomePageContent() {
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  const featuredProducts = await getFeaturedProducts(4);

  const trustItems = [
    t("trustCertified"),
    t("trustBespoke"),
    t("trustSecure"),
    t("trustAppointment"),
  ];

  const reviews = [
    {
      name: "Sarah M.",
      rating: 5,
      text: t("testimonial1"),
    },
    {
      name: "James & Emily",
      rating: 5,
      text: t("testimonial2"),
    },
    {
      name: "David L.",
      rating: 5,
      text: t("testimonial3"),
    },
  ];

  const faqs = [
    { question: t("faq1Question"), answer: t("faq1Answer") },
    { question: t("faq2Question"), answer: t("faq2Answer") },
    { question: t("faq3Question"), answer: t("faq3Answer") },
  ];

  return (
    <>
      <PoemHero />

      <section className="border-b border-brand-gold/15 bg-brand-bg py-12 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-eyebrow">{t("brandIntroEyebrow")}</p>
            <h2 className="mt-3 font-serif text-2xl text-brand-text sm:text-3xl">
              {t("brandIntroTitle")}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-brand-charcoal/70 sm:text-lg">
              {t("brandPositioning")}
            </p>
            <p className="mt-4 text-base leading-relaxed text-brand-charcoal/65 sm:text-lg">
              {t("brandPositioningExtra")}
            </p>
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

      <ShopJewelryByCategory />

      <ShopDiamondsByShape />

      <ShopRingsByCategory />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="text-center">
            <p className="section-eyebrow">{t("collectionsEyebrow")}</p>
            <h2 className="mt-2 font-serif text-3xl text-brand-text">
              {t("featuredCategories")}
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {HOME_CATEGORY_CARDS.map((card) => (
              <VisualCategoryCard
                key={card.key}
                title={t(`categoryCards.${card.key}.title`)}
                description={t(`categoryCards.${card.key}.description`)}
                image={card.image}
                href={card.href}
                placeholderKind={card.placeholderKind}
                viewLabel={tCommon("viewAll")}
              />
            ))}
          </div>
        </Container>
      </section>

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
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
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
            <p className="section-eyebrow">{t("testimonialsEyebrow")}</p>
            <h2 className="mt-2 font-serif text-xl text-brand-text sm:text-2xl">
              {t("testimonialsTitle")}
            </h2>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {reviews.map((review) => (
              <blockquote key={review.name} className="rounded-sm border border-brand-gold/15 bg-brand-surface p-4">
                <div className="flex gap-0.5 text-brand-gold/80">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i} className="text-sm">
                      &#9733;
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/70 line-clamp-4">
                  &ldquo;{review.text}&rdquo;
                </p>
                <footer className="mt-3 text-sm text-brand-text/80">
                  {review.name}
                </footer>
              </blockquote>
            ))}
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
