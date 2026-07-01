import { AppointmentContextSummary } from "@/components/appointment/AppointmentContextSummary";
import { AppointmentForm } from "@/components/appointment/AppointmentForm";
import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { Container } from "@/components/ui/Container";
import { generateLocalizedMetadata } from "@/lib/i18n-metadata";
import { getParam } from "@/lib/searchParams";
import { getAppointmentContextFromParams } from "@/services/appointment.service";
import type { AppointmentType } from "@/constants/order-status";
import type { Metal } from "@/constants/jewellery";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface AppointmentPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return generateLocalizedMetadata(
    params,
    "/appointment",
    "appointmentTitle",
    "appointmentDescription",
  );
}

function getSuggestedType(
  hasProduct: boolean,
  hasCustomRing: boolean,
): AppointmentType | undefined {
  if (hasCustomRing) return "custom-jewellery-consultation";
  if (hasProduct) return "engagement-ring-consultation";
  return undefined;
}

export default async function AppointmentPage({
  params,
  searchParams,
}: AppointmentPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("appointment");
  const tb = await getTranslations("breadcrumb");
  const tSidebar = await getTranslations("appointment.sidebar");
  const resolvedParams = await searchParams;
  const context = await getAppointmentContextFromParams(resolvedParams);

  const productId =
    getParam(resolvedParams, "productId") ?? getParam(resolvedParams, "product");
  const settingId = getParam(resolvedParams, "settingId");
  const diamondId = getParam(resolvedParams, "diamondId");
  const metal = getParam(resolvedParams, "metal") as Metal | undefined;
  const ringSize = getParam(resolvedParams, "ringSize");

  const suggestedType = getSuggestedType(
    Boolean(context.product),
    Boolean(context.customRing),
  );

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: tb("home"), href: "/" },
          { label: tb("appointments") },
        ]}
      />
      <Container className="py-12 lg:py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-start">
        <div>
          <div className="max-w-2xl">
            <h1 className="font-serif text-3xl text-brand-navy sm:text-4xl">
              {t("pageTitle")}
            </h1>
            <p className="mt-4 leading-relaxed text-brand-charcoal/70">
              {t("pageDescription")}
            </p>
          </div>

          <div className="mt-8 max-w-xl">
            <AppointmentContextSummary context={context} />
          </div>

          <div className="mt-10 max-w-xl">
            <AppointmentForm
              suggestedType={suggestedType}
              defaultValues={{
                productId,
                settingId,
                diamondId,
                metal,
                ringSize,
              }}
            />
          </div>
        </div>

        <aside className="panel-luxury p-6 text-sm text-brand-charcoal/70">
          <h2 className="text-xs font-medium tracking-[0.2em] text-brand-gold uppercase">
            {tSidebar("title")}
          </h2>
          <ul className="mt-4 space-y-4 leading-relaxed">
            <li>
              <strong className="font-medium text-brand-navy">
                {tSidebar("inStoreTitle")}
              </strong>
              <br />
              {tSidebar("inStoreDescription")}
            </li>
            <li>
              <strong className="font-medium text-brand-navy">
                {tSidebar("virtualTitle")}
              </strong>
              <br />
              {tSidebar("virtualDescription")}
            </li>
            <li>
              <strong className="font-medium text-brand-navy">
                {tSidebar("customRingTitle")}
              </strong>
              <br />
              {tSidebar("customRingDescription")}
            </li>
            <li>
              <strong className="font-medium text-brand-navy">
                {tSidebar("diamondTitle")}
              </strong>
              <br />
              {tSidebar("diamondDescription")}
            </li>
          </ul>
        </aside>
      </div>
    </Container>
    </>
  );
}
