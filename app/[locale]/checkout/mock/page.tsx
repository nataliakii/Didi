import { MockVivaCheckoutClient } from "@/components/checkout/MockVivaCheckoutClient";
import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { isVivaMock } from "@/constants/viva";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

interface MockCheckoutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MockCheckoutPage({
  params,
}: MockCheckoutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!isVivaMock()) {
    redirect(`/${locale}/checkout`);
  }

  const t = await getTranslations("checkout");
  const tb = await getTranslations("breadcrumb");

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: tb("home"), href: "/" },
          { label: tb("checkout"), href: "/checkout" },
          { label: t("mockTitle") },
        ]}
      />
      <Suspense fallback={null}>
        <MockVivaCheckoutClient />
      </Suspense>
    </>
  );
}
