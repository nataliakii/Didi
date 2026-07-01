import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getTranslations } from "next-intl/server";

export async function CartEmptyState() {
  const t = await getTranslations("cart");

  return (
    <EmptyState
      title={t("emptyTitle")}
      description={t("emptyDescription")}
      action={
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/diamonds">{t("shopDiamonds")}</Button>
          <Button href="/create-ring" variant="outline">
            {t("createRing")}
          </Button>
        </div>
      }
    />
  );
}
