import { AppointmentSuccess } from "@/components/appointment/AppointmentSuccess";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getLocaleFromParamsAsync } from "@/lib/i18n";
import { createLocalizedMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await getLocaleFromParamsAsync(params);
  const t = await getTranslations({ locale, namespace: "appointment" });

  return createLocalizedMetadata({
    locale,
    path: "/appointment/success",
    title: t("successTitle"),
    description: t("successDescription"),
  });
}

export default async function AppointmentSuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("appointment");

  return (
    <Container className="py-12 lg:py-16">
      <div className="mx-auto max-w-lg">
        <AppointmentSuccess />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/" className="flex-1">
            {t("backHome")}
          </Button>
          <Button href="/products" variant="outline" className="flex-1">
            {t("browseProducts")}
          </Button>
        </div>
      </div>
    </Container>
  );
}
