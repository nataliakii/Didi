import { HomePageContent } from "@/components/home/HomePageContent";
import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tb = await getTranslations("breadcrumb");

  return (
    <>
      <PageBreadcrumb items={[{ label: tb("home") }]} />
      <HomePageContent />
    </>
  );
}
