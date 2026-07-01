import { Container } from "@/components/ui/Container";
import { DemoImage } from "@/components/ui/DemoImage";
import {
  DEMO_CREATE_RING_IMAGES,
} from "@/constants/demo-images";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

const STEP_CARDS = [
  {
    key: "chooseDiamond",
    image: DEMO_CREATE_RING_IMAGES.diamond,
    placeholderKind: "diamond" as const,
    href: "/create-ring/diamond" as const,
    step: 1,
  },
  {
    key: "chooseSetting",
    image: DEMO_CREATE_RING_IMAGES.setting,
    placeholderKind: "setting" as const,
    href: "/create-ring/setting" as const,
    step: 2,
  },
  {
    key: "chooseMetal",
    image: DEMO_CREATE_RING_IMAGES.metal,
    placeholderKind: "ring" as const,
    href: "/create-ring/review" as const,
    step: 3,
  },
  {
    key: "reviewRing",
    image: DEMO_CREATE_RING_IMAGES.review,
    placeholderKind: "ring" as const,
    href: "/create-ring/review" as const,
    step: 4,
  },
] as const;

export async function RingBuilderStart() {
  const t = await getTranslations("ringBuilder");

  return (
    <Container className="py-10 lg:py-14">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-serif text-3xl text-brand-navy sm:text-4xl">
          {t("visualTitle")}
        </h1>
        <p className="mt-3 text-sm text-brand-charcoal/60">
          {t("visualSubtitle")}
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {STEP_CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="card-luxury group flex flex-col overflow-hidden transition-colors hover:border-brand-gold/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
          >
            <div className="relative aspect-[4/3] bg-brand-cream">
              <DemoImage
                src={card.image}
                alt={t(`${card.key}Title`)}
                placeholderKind={card.placeholderKind}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <span className="absolute top-3 left-3 flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy text-xs font-medium text-brand-gold">
                {card.step}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-4 lg:p-5">
              <h2 className="font-serif text-base text-brand-navy lg:text-lg">
                {t(`${card.key}Title`)}
              </h2>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-brand-charcoal/55">
                {t(`${card.key}Description`)}
              </p>
              <span className="mt-3 text-[10px] tracking-[0.22em] text-brand-gold uppercase group-hover:text-brand-navy">
                {t("beginStep")} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
