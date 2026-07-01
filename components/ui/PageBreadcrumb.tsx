import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/Breadcrumb";
import { getTranslations } from "next-intl/server";

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
}

/** Server wrapper — passes localized breadcrumb nav label */
export async function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  const t = await getTranslations("breadcrumb");
  return <Breadcrumb items={items} navLabel={t("navLabel")} />;
}
