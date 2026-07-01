import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

type BuilderStep = "start" | "setting" | "diamond" | "review";

interface RingBuilderStepsProps {
  current: BuilderStep;
  settingId?: string;
  diamondId?: string;
}

function getStepIndex(step: BuilderStep): number {
  const order: BuilderStep[] = ["start", "setting", "diamond", "review"];
  return order.indexOf(step);
}

export async function RingBuilderSteps({
  current,
  settingId,
  diamondId,
}: RingBuilderStepsProps) {
  const t = await getTranslations("ringBuilder");

  const steps: Array<{ id: BuilderStep; label: string; href: string }> = [
    { id: "start", label: t("stepStart"), href: "/create-ring" },
    { id: "setting", label: t("stepSetting"), href: "/create-ring/setting" },
    { id: "diamond", label: t("stepDiamond"), href: "/create-ring/diamond" },
    { id: "review", label: t("stepReview"), href: "/create-ring/review" },
  ];

  const currentIndex = getStepIndex(current);

  function buildHref(step: (typeof steps)[number]): string {
    if (step.id === "start") return step.href;
    if (step.id === "review" && settingId && diamondId) {
      return `/create-ring/review?settingId=${settingId}&diamondId=${diamondId}`;
    }
    const params = new URLSearchParams();
    if (settingId) params.set("settingId", settingId);
    if (diamondId) params.set("diamondId", diamondId);
    const query = params.toString();
    return query ? `${step.href}?${query}` : step.href;
  }

  return (
    <nav aria-label={t("progressLabel")} className="mb-10">
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {steps.map((step, index) => {
          const isActive = step.id === current;
          const isComplete = index < currentIndex;
          const isClickable = index <= currentIndex || (settingId && diamondId);

          return (
            <li key={step.id} className="flex items-center gap-2 sm:gap-4">
              {index > 0 && (
                <span
                  className={cn(
                    "hidden h-px w-6 sm:block sm:w-10",
                    isComplete ? "bg-brand-gold" : "bg-brand-gold/25",
                  )}
                  aria-hidden="true"
                />
              )}
              {isClickable && !isActive ? (
                <Link
                  href={buildHref(step)}
                  className={cn(
                    "flex items-center gap-2 text-xs sm:text-sm",
                    isComplete
                      ? "text-brand-navy"
                      : "text-brand-charcoal/45 hover:text-brand-navy",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
                      isComplete
                        ? "bg-brand-navy text-brand-gold"
                        : "border border-brand-gold/40 bg-white text-brand-navy",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </Link>
              ) : (
                <span
                  className={cn(
                    "flex items-center gap-2 text-xs sm:text-sm",
                    isActive
                      ? "font-medium text-brand-navy"
                      : "text-brand-charcoal/45",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
                      isActive
                        ? "bg-brand-navy text-brand-gold"
                        : "border border-brand-gold/25 bg-brand-cream text-brand-charcoal/50",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
