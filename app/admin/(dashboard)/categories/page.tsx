import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAdminCategories } from "@/services/category-admin.service";
import Link from "next/link";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-medium text-stone-900">Categories</h2>
          <p className="mt-1 text-sm text-stone-500">
            Organize products into storefront categories
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="rounded-sm bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          New category
        </Link>
      </div>

      {categories.length > 0 ? (
        <div className="overflow-hidden rounded-sm border border-stone-200 bg-white">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Slug
                </th>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Parent
                </th>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-stone-50">
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/categories/${category._id}`}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {category.name}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-stone-700">{category.slug}</td>
                  <td className="px-4 py-4 text-stone-700">
                    {category.parentName ?? "—"}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      status={category.isActive ? "published" : "archived"}
                      label={category.isActive ? "Active" : "Inactive"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No categories found"
          description="Create categories to organize your product catalog."
        />
      )}
    </div>
  );
}
