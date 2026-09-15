import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

const USP_CARDS = [
  {
    key: "colored" as const,
    href: "/colored-lab-grown-diamonds" as const,
  },
  {
    key: "createRing" as const,
    href: "/create-ring" as const,
  },
  {
    key: "looseDiamonds" as const,
    href: "/diamonds" as const,
  },
];

export async function HomeUspStrip() {
  const t = await getTranslations("home");

  return (
    <section className="border-b border-brand-gold/15 bg-brand-bg py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ul className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0">
          {USP_CARDS.map((card) => (
            <li key={card.key} className="w-[78%] shrink-0 snap-start sm:w-auto">
              <Link
                href={card.href}
                className="flex h-full flex-col rounded-sm border border-brand-gold/20 bg-brand-surface px-5 py-5 transition-colors hover:border-brand-gold/45"
              >
                <h3 className="font-serif text-lg text-brand-text">
                  {t(`uspCards.${card.key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/65">
                  {t(`uspCards.${card.key}.description`)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
