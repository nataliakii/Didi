import { CategoryAdminForm } from "@/components/admin/CategoryAdminForm";
import { getAdminCategories } from "@/services/category-admin.service";
import Link from "next/link";

export default async function AdminNewCategoryPage() {
  const parentOptions = await getAdminCategories();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/categories"
          className="text-xs text-stone-500 hover:text-stone-800"
        >
          ← Categories
        </Link>
        <h2 className="mt-2 text-2xl font-medium text-stone-900">
          New category
        </h2>
      </div>
      <div className="rounded-sm border border-stone-200 bg-white p-5">
        <CategoryAdminForm parentOptions={parentOptions} />
      </div>
    </div>
  );
}
