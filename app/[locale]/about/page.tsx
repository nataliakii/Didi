import { AboutPageContent } from "@/components/about/AboutPageContent";
import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { generateLocalizedMetadata } from "@/lib/i18n-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return generateLocalizedMetadata(
    params,
    "/about",
    "aboutTitle",
    "aboutDescription",
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tb = await getTranslations("breadcrumb");

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: tb("home"), href: "/" },
          { label: tb("about") },
        ]}
      />
      <AboutPageContent />
    </>
  );
}
