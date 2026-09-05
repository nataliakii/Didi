import { DemoImage } from "@/components/ui/DemoImage";
import { DEMO_CATEGORY_IMAGES } from "@/constants/demo-images";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

const JEWELRY_CATEGORIES = [
  {
    key: "rings",
    image: DEMO_CATEGORY_IMAGES.diamondRings,
    href: "/rings" as const,
  },
  {
    key: "necklaces",
    image: DEMO_CATEGORY_IMAGES.necklaces,
    href: "/necklaces" as const,
  },
  {
    key: "earrings",
    image: DEMO_CATEGORY_IMAGES.earrings,
    href: "/earrings" as const,
  },
  {
    key: "bracelets",
    image: DEMO_CATEGORY_IMAGES.bracelets,
    href: "/bracelets" as const,
  },
  {
    key: "coloredDiamonds",
    image: DEMO_CATEGORY_IMAGES.coloredLabGrownDiamonds,
    href: "/colored-lab-grown-diamonds" as const,
  },
  {
    key: "looseDiamonds",
    image: DEMO_CATEGORY_IMAGES.looseDiamonds,
    href: "/diamonds" as const,
  },
] as const;

export async function ShopJewelryByCategory() {
  const tNav = await getTranslations("navigation");
  const tHome = await getTranslations("home");

  return (
    <section className="border-b border-brand-gold/15 bg-brand-surface py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <p className="section-eyebrow">{tHome("collectionsEyebrow")}</p>
          <h2 className="mt-2 font-serif text-3xl text-brand-text sm:text-4xl">
            {tHome("shopJewelryTitle")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-brand-charcoal/65">
            {tHome("shopJewelryDescription")}
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {JEWELRY_CATEGORIES.map((category) => (
            <li key={category.key}>
              <Link
                href={category.href}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-sm border border-brand-gold/15 bg-brand-cream">
                  <DemoImage
                    src={category.image}
                    alt={tNav(category.key)}
                    placeholderKind="diamond"
                    fill
                    className="object-contain p-5 transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                </div>
                <p className="mt-3 text-sm text-brand-text/85 transition-colors group-hover:text-brand-text">
                  {tNav(category.key)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
