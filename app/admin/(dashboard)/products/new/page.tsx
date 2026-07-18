import { ProductAdminForm } from "@/components/admin/ProductAdminForm";
import { getAdminCategoryOptions } from "@/services/category-admin.service";
import Link from "next/link";

export default async function AdminNewProductPage() {
  const categoryOptions = await getAdminCategoryOptions();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="text-xs text-stone-500 hover:text-stone-800"
        >
          ← Products
        </Link>
        <h2 className="mt-2 text-2xl font-medium text-stone-900">
          New product
        </h2>
      </div>
      <div className="rounded-sm border border-stone-200 bg-white p-5">
        <ProductAdminForm categoryOptions={categoryOptions} />
      </div>
    </div>
  );
}
