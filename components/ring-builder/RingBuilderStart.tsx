import { Container } from "@/components/ui/Container";
import { DemoImage } from "@/components/ui/DemoImage";
import { DEMO_CREATE_RING_IMAGES } from "@/constants/demo-images";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

const ENTRY_PATHS = [
  {
    key: "startWithSetting",
    image: DEMO_CREATE_RING_IMAGES.setting,
    placeholderKind: "setting" as const,
    href: "/create-ring/setting" as const,
    ctaKey: "startWithSettingCta",
  },
  {
    key: "startWithDiamond",
    image: DEMO_CREATE_RING_IMAGES.diamond,
    placeholderKind: "diamond" as const,
    href: "/create-ring/diamond" as const,
    ctaKey: "startWithDiamondCta",
  },
] as const;

const JOURNEY_STEPS = [
  { n: 1, titleKey: "journeySettingTitle", bodyKey: "journeySettingBody" },
  { n: 2, titleKey: "journeyDiamondTitle", bodyKey: "journeyDiamondBody" },
  { n: 3, titleKey: "journeyMetalTitle", bodyKey: "journeyMetalBody" },
  { n: 4, titleKey: "journeyReviewTitle", bodyKey: "journeyReviewBody" },
] as const;

export async function RingBuilderStart() {
  const t = await getTranslations("ringBuilder");

  return (
    <Container className="py-10 lg:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="section-eyebrow">{t("builderEyebrow")}</p>
        <h1 className="mt-3 font-serif text-3xl text-brand-navy sm:text-4xl lg:text-5xl">
          {t("startTitle")}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-brand-charcoal/65">
          {t("startDescription")}
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
        {ENTRY_PATHS.map((path) => (
          <Link
            key={path.key}
            href={path.href}
            className="group relative flex min-h-[280px] flex-col overflow-hidden rounded-sm border border-brand-gold/20 bg-brand-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
          >
            <DemoImage
              src={path.image}
              alt={t(`${path.key}`)}
              placeholderKind={path.placeholderKind}
              fill
              className="object-cover opacity-45 transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-transparent" />
            <div className="relative z-10 mt-auto p-6 sm:p-8">
              <h2 className="font-serif text-2xl text-brand-ivory">
                {t(path.key)}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-brand-ivory/70">
                {t(`${path.key}Description`)}
              </p>
              <span className="mt-5 inline-flex text-xs tracking-[0.2em] text-brand-gold uppercase">
                {t(path.ctaKey)} →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-4xl border-t border-brand-gold/20 pt-12">
        <h2 className="text-center font-serif text-2xl text-brand-navy">
          {t("howItWorks")}
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {JOURNEY_STEPS.map((step) => (
            <li key={step.n} className="text-center sm:text-left">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-xs font-medium text-brand-gold">
                {step.n}
              </span>
              <h3 className="mt-3 font-serif text-lg text-brand-navy">
                {t(step.titleKey)}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-charcoal/60">
                {t(step.bodyKey)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Container>
  );
}
