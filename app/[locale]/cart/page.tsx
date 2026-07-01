import { PageBreadcrumb } from "@/components/ui/PageBreadcrumb";
import { CartPageContent } from "@/components/cart/CartPageContent";
import { generateLocalizedMetadata } from "@/lib/i18n-metadata";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return generateLocalizedMetadata(
    params,
    "/cart",
    "cartTitle",
    "cartDescription",
    { noIndex: true },
  );
}

export default async function CartPage({
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
          { label: tb("cart") },
        ]}
      />
      <CartPageContent />
    </>
  );
}
