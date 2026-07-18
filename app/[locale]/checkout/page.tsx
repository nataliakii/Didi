import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { Container } from "@/components/ui/Container";
import { generateLocalizedMetadata } from "@/lib/i18n-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return generateLocalizedMetadata(
    params,
    "/checkout",
    "checkoutTitle",
    "checkoutDescription",
    { noIndex: true },
  );
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("checkout");
  const tb = await getTranslations("breadcrumb");

  return (
    <>
      <PageBreadcrumb
        items={[
          { label: tb("home"), href: "/" },
          { label: tb("cart"), href: "/cart" },
          { label: tb("checkout") },
        ]}
      />
      <Container className="py-12 lg:py-16">
        <div className="max-w-2xl">
          <h1 className="font-serif text-3xl text-brand-navy sm:text-4xl">
            {t("pageTitle")}
          </h1>
          <p className="mt-4 text-brand-charcoal/70">{t("pageDescription")}</p>
        </div>
        <div className="mt-10">
          <CheckoutForm />
        </div>
      </Container>
    </>
  );
}
