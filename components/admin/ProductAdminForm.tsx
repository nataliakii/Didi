"use client";

import {
  AVAILABILITY_STATUSES,
  PRODUCT_STATUSES,
  PRODUCT_TYPES,
  RING_STYLES,
} from "@/constants/jewellery";
import { formatLabel } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const fieldClass =
  "mt-1.5 w-full rounded-sm border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none";

export type ProductFormValues = {
  name: string;
  slug: string;
  sku: string;
  productType: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  basePrice: number;
  salePrice?: number;
  stockQuantity: number;
  availabilityStatus: string;
  status: string;
  isFeatured: boolean;
  imageUrl: string;
  videoUrl: string;
  style: string;
};

export function ProductAdminForm({
  productId,
  initial,
  categoryOptions = [],
}: {
  productId?: string;
  initial?: Partial<ProductFormValues>;
  categoryOptions?: Array<{ _id: string; name: string }>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    sku: initial?.sku ?? "",
    productType: initial?.productType ?? "ring",
    categoryId: initial?.categoryId ?? categoryOptions[0]?._id ?? "",
    shortDescription: initial?.shortDescription ?? "",
    description: initial?.description ?? "",
    basePrice: initial?.basePrice ?? 0,
    salePrice: initial?.salePrice,
    stockQuantity: initial?.stockQuantity ?? 0,
    availabilityStatus: initial?.availabilityStatus ?? "in-stock",
    status: initial?.status ?? "draft",
    isFeatured: initial?.isFeatured ?? false,
    imageUrl: initial?.imageUrl ?? "",
    videoUrl: initial?.videoUrl ?? "",
    style: initial?.style ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: values.name,
      slug: values.slug || undefined,
      sku: values.sku,
      productType: values.productType,
      categoryId: values.categoryId,
      shortDescription: values.shortDescription || undefined,
      description: values.description || undefined,
      basePrice: values.basePrice,
      salePrice: values.salePrice ?? null,
      stockQuantity: values.stockQuantity,
      availabilityStatus: values.availabilityStatus,
      status: values.status,
      isFeatured: values.isFeatured,
      imageUrl: values.imageUrl || undefined,
      videoUrl: values.videoUrl || undefined,
      attributes: values.style ? { style: values.style } : { style: null },
    };

    try {
      const response = await fetch(
        productId ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: productId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await response.json()) as { error?: string; id?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save product.");
        return;
      }
      router.push(`/admin/products/${productId ?? data.id}`);
      router.refresh();
    } catch {
      setError("Could not save product.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!productId || !confirm("Delete this product?")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        setError("Could not delete product.");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Could not delete product.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block text-sm sm:col-span-2">
          <span className="text-stone-600">Name</span>
          <input
            required
            className={fieldClass}
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Slug</span>
          <input
            className={fieldClass}
            placeholder="Auto-generated"
            value={values.slug}
            onChange={(e) => setField("slug", e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">SKU</span>
          <input
            required
            className={fieldClass}
            value={values.sku}
            onChange={(e) => setField("sku", e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Product type</span>
          <select
            className={fieldClass}
            value={values.productType}
            onChange={(e) => setField("productType", e.target.value)}
          >
            {PRODUCT_TYPES.map((v) => (
              <option key={v} value={v}>
                {formatLabel(v)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Category</span>
          <select
            required
            className={fieldClass}
            value={values.categoryId}
            onChange={(e) => setField("categoryId", e.target.value)}
          >
            <option value="" disabled>
              Select category
            </option>
            {categoryOptions.map((option) => (
              <option key={option._id} value={option._id}>
                {option.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Style</span>
          <select
            className={fieldClass}
            value={values.style}
            onChange={(e) => setField("style", e.target.value)}
          >
            <option value="">—</option>
            {RING_STYLES.map((v) => (
              <option key={v} value={v}>
                {formatLabel(v)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Base price</span>
          <input
            type="number"
            min="0"
            required
            className={fieldClass}
            value={values.basePrice}
            onChange={(e) => setField("basePrice", Number(e.target.value))}
          />
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Sale price</span>
          <input
            type="number"
            min="0"
            className={fieldClass}
            value={values.salePrice ?? ""}
            onChange={(e) =>
              setField(
                "salePrice",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Stock quantity</span>
          <input
            type="number"
            min="0"
            required
            className={fieldClass}
            value={values.stockQuantity}
            onChange={(e) => setField("stockQuantity", Number(e.target.value))}
          />
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Availability</span>
          <select
            className={fieldClass}
            value={values.availabilityStatus}
            onChange={(e) => setField("availabilityStatus", e.target.value)}
          >
            {AVAILABILITY_STATUSES.map((v) => (
              <option key={v} value={v}>
                {formatLabel(v)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Status</span>
          <select
            className={fieldClass}
            value={values.status}
            onChange={(e) => setField("status", e.target.value)}
          >
            {PRODUCT_STATUSES.map((v) => (
              <option key={v} value={v}>
                {formatLabel(v)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm sm:col-span-2 lg:col-span-3">
          <span className="text-stone-600">Short description</span>
          <input
            className={fieldClass}
            value={values.shortDescription}
            onChange={(e) => setField("shortDescription", e.target.value)}
          />
        </label>
        <label className="block text-sm sm:col-span-2 lg:col-span-3">
          <span className="text-stone-600">Description</span>
          <textarea
            rows={4}
            className={fieldClass}
            value={values.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="text-stone-600">Image URL</span>
          <input
            className={fieldClass}
            value={values.imageUrl}
            onChange={(e) => setField("imageUrl", e.target.value)}
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="text-stone-600">Video URL</span>
          <input
            className={fieldClass}
            value={values.videoUrl}
            onChange={(e) => setField("videoUrl", e.target.value)}
            placeholder="YouTube, Vimeo, or .mp4 link"
          />
        </label>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input
            type="checkbox"
            checked={values.isFeatured}
            onChange={(e) => setField("isFeatured", e.target.checked)}
          />
          Featured
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-sm bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save product"}
        </button>
        {productId && (
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
