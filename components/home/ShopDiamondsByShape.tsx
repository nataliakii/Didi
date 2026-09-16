import { DiamondShapeOutline } from "@/components/ui/icons";
import { HOME_DIAMOND_SHAPES } from "@/constants/jewellery";
import { Link } from "@/i18n/routing";
import { formatLabel } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export async function ShopDiamondsByShape() {
  const t = await getTranslations("home");

  return (
    <section className="bg-[#FDFBF7] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-serif text-3xl text-brand-text sm:text-4xl">
            {t("shopByShapeTitle")}
          </h2>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-5 md:gap-y-12">
          {HOME_DIAMOND_SHAPES.map((shape) => (
            <li key={shape}>
              <Link
                href={`/diamonds?shape=${shape}`}
                className="group flex flex-col items-center gap-4 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
              >
                <DiamondShapeOutline
                  shape={shape}
                  className="h-14 w-14 transition-transform duration-500 group-hover:scale-[1.06] sm:h-16 sm:w-16"
                />
                <span className="text-sm tracking-wide text-brand-text/80 transition-colors group-hover:text-brand-text">
                  {formatLabel(shape)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-12 text-center">
          <Link
            href="/diamonds"
            className="text-xs tracking-[0.2em] text-brand-gold uppercase transition-colors hover:text-brand-text"
          >
            {t("shopByShapeCta")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
