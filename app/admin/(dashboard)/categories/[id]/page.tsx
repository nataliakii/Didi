import { CategoryAdminForm } from "@/components/admin/CategoryAdminForm";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  getAdminCategories,
  getAdminCategoryById,
} from "@/services/category-admin.service";
import Link from "next/link";
import { notFound } from "next/navigation";

interface AdminCategoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCategoryDetailPage({
  params,
}: AdminCategoryDetailPageProps) {
  const { id } = await params;
  const [category, parentOptions] = await Promise.all([
    getAdminCategoryById(id),
    getAdminCategories(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/categories"
            className="text-xs text-stone-500 hover:text-stone-900"
          >
            &larr; Back to categories
          </Link>
          <h2 className="mt-2 text-2xl font-medium text-stone-900">
            {category.name}
          </h2>
          <p className="mt-1 text-sm text-stone-500">/{category.slug}</p>
        </div>
        <StatusBadge
          status={category.isActive ? "published" : "archived"}
          label={category.isActive ? "Active" : "Inactive"}
        />
      </div>

      <div className="rounded-sm border border-stone-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-medium text-stone-900">Edit category</h3>
        <CategoryAdminForm
          categoryId={category._id}
          parentOptions={parentOptions}
          initial={{
            name: category.name,
            slug: category.slug,
            description: category.description ?? "",
            imageUrl: category.image ?? "",
            parentId: category.parentId ?? "",
            isActive: category.isActive,
          }}
        />
      </div>
    </div>
  );
}
