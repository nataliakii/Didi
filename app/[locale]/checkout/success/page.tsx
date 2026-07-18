import { CheckoutResult } from "@/components/checkout/CheckoutResult";
import { Container } from "@/components/ui/Container";
import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { getParam } from "@/lib/searchParams";
import {
  getOrderByVivaOrderCode,
  markOrderPaidFromViva,
} from "@/services/checkout.service";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface CheckoutSuccessPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: CheckoutSuccessPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("checkout");
  const tb = await getTranslations("breadcrumb");
  const resolved = await searchParams;

  const transactionId = getParam(resolved, "t");
  const orderCode = getParam(resolved, "s");

  let orderNumber: string | undefined;

  if (transactionId && orderCode) {
    const result = await markOrderPaidFromViva({
      orderCode,
      transactionId,
    });
    if (result.success) {
      orderNumber = result.orderNumber;
    }
  }

  if (!orderNumber && orderCode) {
    try {
      const order = await getOrderByVivaOrderCode(orderCode);
      orderNumber = order?.orderNumber;
    } catch {
      // DB may be briefly unavailable; still show success UI.
    }
  }

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: tb("home"), href: "/" },
          { label: tb("checkout"), href: "/checkout" },
          { label: t("successTitle") },
        ]}
      />
      <Container className="py-16 lg:py-24">
        <CheckoutResult
          variant="success"
          title={t("successTitle")}
          description={t("successDescription")}
          orderNumber={orderNumber}
          orderLabel={t("orderNumber")}
          primaryLabel={t("backHome")}
          primaryHref="/"
          secondaryLabel={t("bookAppointment")}
          secondaryHref="/appointment"
        />
      </Container>
    </>
  );
}
