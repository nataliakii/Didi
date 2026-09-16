import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

const USP_CARDS = [
  {
    key: "igi" as const,
    href: "/certification" as const,
  },
  {
    key: "design" as const,
    href: "/create-ring" as const,
  },
  {
    key: "payment" as const,
    href: "/appointment" as const,
  },
];

export async function HomeUspStrip() {
  const t = await getTranslations("home");

  return (
    <section className="bg-[#FDFBF7] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ul className="grid gap-12 sm:grid-cols-3 sm:gap-16 lg:gap-20">
          {USP_CARDS.map((card) => (
            <li key={card.key}>
              <Link
                href={card.href}
                className="group block text-center sm:text-left"
              >
                <span
                  className="mx-auto mb-6 block h-px w-10 bg-[#C5A059]/70 sm:mx-0"
                  aria-hidden
                />
                <h3 className="font-serif text-xl text-[#0A192F]">
                  {t(`uspCards.${card.key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#0A192F]/70">
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
