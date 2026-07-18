"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const fieldClass =
  "mt-1.5 w-full rounded-sm border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none";

export type CategoryFormValues = {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  parentId: string;
  isActive: boolean;
};

export function CategoryAdminForm({
  categoryId,
  initial,
  parentOptions = [],
}: {
  categoryId?: string;
  initial?: Partial<CategoryFormValues>;
  parentOptions?: Array<{ _id: string; name: string }>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<CategoryFormValues>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    imageUrl: initial?.imageUrl ?? "",
    parentId: initial?.parentId ?? "",
    isActive: initial?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectableParents = parentOptions.filter((p) => p._id !== categoryId);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...values,
      slug: values.slug || undefined,
      description: values.description || undefined,
      imageUrl: values.imageUrl || undefined,
      parentId: values.parentId || null,
    };

    try {
      const response = await fetch(
        categoryId
          ? `/api/admin/categories/${categoryId}`
          : "/api/admin/categories",
        {
          method: categoryId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await response.json()) as { error?: string; id?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save category.");
        return;
      }
      router.push(`/admin/categories/${categoryId ?? data.id}`);
      router.refresh();
    } catch {
      setError("Could not save category.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!categoryId || !confirm("Delete this category?")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        setError("Could not delete category.");
        return;
      }
      router.push("/admin/categories");
      router.refresh();
    } catch {
      setError("Could not delete category.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-stone-600">Name</span>
          <input
            required
            className={fieldClass}
            value={values.name}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Slug</span>
          <input
            className={fieldClass}
            placeholder="Auto-generated from name"
            value={values.slug}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, slug: e.target.value }))
            }
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="text-stone-600">Description</span>
          <textarea
            rows={3}
            className={fieldClass}
            value={values.description}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="text-stone-600">Image URL</span>
          <input
            className={fieldClass}
            value={values.imageUrl}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, imageUrl: e.target.value }))
            }
          />
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Parent category</span>
          <select
            className={fieldClass}
            value={values.parentId}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, parentId: e.target.value }))
            }
          >
            <option value="">None</option>
            {selectableParents.map((option) => (
              <option key={option._id} value={option._id}>
                {option.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, isActive: e.target.checked }))
            }
          />
          Active
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-sm bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save category"}
        </button>
        {categoryId && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-sm border border-red-200 px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
