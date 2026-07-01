import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { generateLocalizedMetadata } from "@/lib/i18n-metadata";
import { setRequestLocale } from "next-intl/server";
import { RingBuilderStart } from "@/components/ring-builder/RingBuilderStart";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return generateLocalizedMetadata(
    params,
    "/create-ring",
    "createRingTitle",
    "createRingDescription",
  );
}

export default async function CreateRingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("breadcrumb");

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: t("home"), href: "/" },
          { label: t("createRing") },
        ]}
      />
      <RingBuilderStart />
    </>
  );
}
