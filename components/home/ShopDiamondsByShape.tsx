import { DemoImage } from "@/components/ui/DemoImage";
import { DiamondShapeIcon } from "@/components/ui/icons";
import { DEMO_RING_IMAGES } from "@/constants/demo-images";
import { HOME_DIAMOND_SHAPES } from "@/constants/jewellery";
import { Link } from "@/i18n/routing";
import { formatLabel } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export async function ShopDiamondsByShape() {
  const t = await getTranslations("home");

  return (
    <section className="border-b border-brand-gold/15 bg-white py-14 sm:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:px-8">
        <div className="mx-auto w-full max-w-sm text-center lg:mx-0 lg:text-left">
          <h2 className="font-serif text-3xl text-brand-navy sm:text-4xl">
            {t("shopByShapeTitle")}
          </h2>
          <div className="relative mx-auto mt-8 aspect-[4/5] max-w-[280px] overflow-hidden bg-brand-cream lg:mx-0">
            <DemoImage
              src={DEMO_RING_IMAGES.ovalSolitaire}
              fallback={DEMO_RING_IMAGES.roundSolitaire}
              alt={t("shopByShapeImageAlt")}
              placeholderKind="ring"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 280px, 320px"
            />
          </div>
        </div>

        <div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-5 md:gap-y-10">
            {HOME_DIAMOND_SHAPES.map((shape) => (
              <li key={shape}>
                <Link
                  href={`/diamonds?shape=${shape}`}
                  className="group flex flex-col items-center gap-3 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
                >
                  <span className="flex h-16 w-16 items-center justify-center text-brand-navy/80 transition-colors group-hover:text-brand-navy sm:h-20 sm:w-20">
                    <DiamondShapeIcon
                      shape={shape}
                      className="h-12 w-12 sm:h-14 sm:w-14"
                    />
                  </span>
                  <span className="text-sm text-brand-charcoal/75 transition-colors group-hover:text-brand-navy">
                    {formatLabel(shape)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center lg:text-left">
            <Link
              href="/diamonds"
              className="text-xs tracking-[0.2em] text-brand-gold uppercase transition-colors hover:text-brand-navy"
            >
              {t("shopByShapeCta")} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
