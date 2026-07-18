import { CheckoutResult } from "@/components/checkout/CheckoutResult";
import { Container } from "@/components/ui/Container";
import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { getParam } from "@/lib/searchParams";
import { markOrderFailedFromViva } from "@/services/checkout.service";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface CheckoutFailurePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CheckoutFailurePage({
  params,
  searchParams,
}: CheckoutFailurePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("checkout");
  const tb = await getTranslations("breadcrumb");
  const resolved = await searchParams;
  const orderCode = getParam(resolved, "s");

  if (orderCode) {
    try {
      await markOrderFailedFromViva(orderCode);
    } catch {
      // Non-blocking — user can retry checkout.
    }
  }

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: tb("home"), href: "/" },
          { label: tb("checkout"), href: "/checkout" },
          { label: t("failureTitle") },
        ]}
      />
      <Container className="py-16 lg:py-24">
        <CheckoutResult
          variant="failure"
          title={t("failureTitle")}
          description={t("failureDescription")}
          orderLabel={t("orderNumber")}
          primaryLabel={t("tryAgain")}
          primaryHref="/checkout"
          secondaryLabel={t("backToCart")}
          secondaryHref="/cart"
        />
      </Container>
    </>
  );
}
