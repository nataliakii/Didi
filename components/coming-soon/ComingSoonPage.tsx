import { BrandLogo } from "@/components/layout/BrandLogo";
import { getTranslations } from "next-intl/server";

export async function ComingSoonPage() {
  const t = await getTranslations("comingSoon");
  const tCommon = await getTranslations("common");
  const tFooter = await getTranslations("footer");

  return (
    <div className="coming-soon relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-brand-navy px-6 py-16 text-center">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(201,162,74,0.18),transparent_60%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,162,74,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,74,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden
      />

      <div className="coming-soon-shimmer pointer-events-none absolute top-0 left-1/2 h-px w-[min(90vw,36rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent" />

      <div className="relative z-10 flex max-w-lg flex-col items-center">
        <BrandLogo size="lg" variant="light" />

        <p className="section-eyebrow mt-10">{t("eyebrow")}</p>

        <h1 className="mt-5 font-serif text-5xl leading-none tracking-wide text-brand-ivory sm:text-6xl lg:text-7xl">
          {t("title")}
        </h1>

        <p className="mt-6 max-w-sm text-base leading-relaxed text-brand-ivory/70 sm:text-lg">
          {t("description")}
        </p>

        <div className="mt-10 flex items-center gap-4" aria-hidden>
          <span className="h-px w-12 bg-brand-gold/40" />
          <span className="text-brand-gold/80">&#9670;</span>
          <span className="h-px w-12 bg-brand-gold/40" />
        </div>

        <div className="mt-10">
          <p className="font-serif text-xl text-brand-ivory">{tFooter("founderName")}</p>
          <p className="mt-2 text-[11px] tracking-[0.14em] text-brand-gold uppercase">
            {tFooter("founderTitle")}
          </p>
        </div>

        <p className="mt-12 text-xs tracking-[0.06em] text-brand-ivory/45">
          {tCommon("tagline")}
        </p>
      </div>

      <div className="coming-soon-shimmer pointer-events-none absolute bottom-0 left-1/2 h-px w-[min(70vw,28rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
    </div>
  );
}
