"use client";

import {
  AVAILABILITY_STATUSES,
  DIAMOND_SHAPES,
  FANCY_DIAMOND_COLORS,
  GOLD_PURITIES,
  METALS,
  PRODUCT_SHIP_REGIONS,
  PRODUCT_STATUSES,
  PRODUCT_TYPES,
  RING_STYLES,
  STONE_TYPES,
} from "@/constants/jewellery";
import { CERTIFICATION_LABS } from "@/constants/certification";
import { formatLabel } from "@/lib/utils";
import { useAdminRefetch } from "@/components/admin/useAdminRefetch";
import { useState, type FormEvent } from "react";

const fieldClass =
  "mt-1.5 w-full rounded-sm border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none";

type ImageRow = { url: string; alt: string };

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
  productionTime: string;
  images: ImageRow[];
  videoUrl: string;
  seoTitle: string;
  seoDescription: string;
  style: string;
  metal: string[];
  goldPurity: string;
  stoneType: string;
  isLabGrown: boolean;
  diamondShape: string;
  diamondColor: string;
  diamondCarat: string;
  ringSizes: string;
  customSizeAvailable: boolean;
  customStoneAvailable: boolean;
  shipsTo: string;
  certificationLab: string;
  certificationReportNumber: string;
  certificationReportUrl: string;
};

const emptyForm: ProductFormValues = {
  name: "",
  slug: "",
  sku: "",
  productType: "ring",
  categoryId: "",
  shortDescription: "",
  description: "",
  basePrice: 0,
  stockQuantity: 0,
  availabilityStatus: "in-stock",
  status: "draft",
  isFeatured: false,
  productionTime: "",
  images: [{ url: "", alt: "" }],
  videoUrl: "",
  seoTitle: "",
  seoDescription: "",
  style: "",
  metal: [],
  goldPurity: "",
  stoneType: "lab-grown-diamond",
  isLabGrown: true,
  diamondShape: "",
  diamondColor: "",
  diamondCarat: "",
  ringSizes: "",
  customSizeAvailable: true,
  customStoneAvailable: false,
  shipsTo: "greece-eu",
  certificationLab: "",
  certificationReportNumber: "",
  certificationReportUrl: "",
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
  const refetch = useAdminRefetch();
  const [values, setValues] = useState<ProductFormValues>({
    ...emptyForm,
    categoryId: categoryOptions[0]?._id ?? "",
    ...initial,
    images:
      initial?.images?.length
        ? initial.images
        : [{ url: "", alt: "" }],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function updateImage(index: number, field: keyof ImageRow, value: string) {
    setValues((prev) => {
      const images = [...prev.images];
      images[index] = { ...images[index], [field]: value };
      return { ...prev, images };
    });
  }

  function addImageRow() {
    setValues((prev) => ({
      ...prev,
      images: [...prev.images, { url: "", alt: "" }],
    }));
  }

  function removeImageRow(index: number) {
    setValues((prev) => ({
      ...prev,
      images:
        prev.images.length <= 1
          ? [{ url: "", alt: "" }]
          : prev.images.filter((_, i) => i !== index),
    }));
  }

  function toggleMetal(metal: string) {
    setValues((prev) => ({
      ...prev,
      metal: prev.metal.includes(metal)
        ? prev.metal.filter((m) => m !== metal)
        : [...prev.metal, metal],
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const images = values.images
      .filter((img) => img.url.trim())
      .map((img, index) => ({
        url: img.url.trim(),
        alt: img.alt.trim() || undefined,
        isPrimary: index === 0,
      }));

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
      productionTime: values.productionTime || undefined,
      images,
      videoUrl: values.videoUrl || undefined,
      seoTitle: values.seoTitle || undefined,
      seoDescription: values.seoDescription || undefined,
      attributes: {
        metal: values.metal.length ? values.metal : undefined,
        goldPurity: values.goldPurity || null,
        stoneType: values.stoneType || null,
        isLabGrown: values.isLabGrown,
        diamondShape: values.diamondShape || null,
        diamondColor: values.diamondColor || null,
        diamondCarat: values.diamondCarat
          ? Number(values.diamondCarat)
          : null,
        style: values.style || null,
        ringSizes: values.ringSizes
          ? values.ringSizes.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
        customSizeAvailable: values.customSizeAvailable,
        customStoneAvailable: values.customStoneAvailable,
        shipsTo: values.shipsTo || null,
        certification:
          values.certificationLab ||
          values.certificationReportNumber ||
          values.certificationReportUrl
            ? {
                lab: values.certificationLab || null,
                reportNumber: values.certificationReportNumber || null,
                reportUrl: values.certificationReportUrl || null,
              }
            : null,
      },
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
      refetch(`/admin/products/${productId ?? data.id}`);
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
      refetch("/admin/products");
    } catch {
      setError("Could not delete product.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <fieldset className="space-y-4">
        <legend className="text-sm font-medium text-stone-900">Basics</legend>
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
            <span className="text-stone-600">Base price (EUR)</span>
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
            <span className="text-stone-600">Sale price (EUR)</span>
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
          <label className="block text-sm">
            <span className="text-stone-600">Production time</span>
            <input
              className={fieldClass}
              placeholder="e.g. 3–4 weeks"
              value={values.productionTime}
              onChange={(e) => setField("productionTime", e.target.value)}
            />
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
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium text-stone-900">
          Diamond & metal
        </legend>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-3">
            <span className="text-sm text-stone-600">Metals</span>
            <div className="mt-2 flex flex-wrap gap-3">
              {METALS.map((metal) => (
                <label key={metal} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={values.metal.includes(metal)}
                    onChange={() => toggleMetal(metal)}
                  />
                  {formatLabel(metal)}
                </label>
              ))}
            </div>
          </div>
          <label className="block text-sm">
            <span className="text-stone-600">Gold purity</span>
            <select
              className={fieldClass}
              value={values.goldPurity}
              onChange={(e) => setField("goldPurity", e.target.value)}
            >
              <option value="">—</option>
              {GOLD_PURITIES.map((v) => (
                <option key={v} value={v}>
                  {v.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">Stone type</span>
            <select
              className={fieldClass}
              value={values.stoneType}
              onChange={(e) => setField("stoneType", e.target.value)}
            >
              <option value="">—</option>
              {STONE_TYPES.map((v) => (
                <option key={v} value={v}>
                  {formatLabel(v)}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">Diamond shape</span>
            <select
              className={fieldClass}
              value={values.diamondShape}
              onChange={(e) => setField("diamondShape", e.target.value)}
            >
              <option value="">—</option>
              {DIAMOND_SHAPES.map((v) => (
                <option key={v} value={v}>
                  {formatLabel(v)}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">Diamond color</span>
            <select
              className={fieldClass}
              value={values.diamondColor}
              onChange={(e) => setField("diamondColor", e.target.value)}
            >
              <option value="">—</option>
              {FANCY_DIAMOND_COLORS.map((v) => (
                <option key={v} value={v}>
                  {formatLabel(v)}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">Diamond carat</span>
            <input
              type="number"
              min="0"
              step="0.01"
              className={fieldClass}
              value={values.diamondCarat}
              onChange={(e) => setField("diamondCarat", e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">Ring sizes (comma-separated)</span>
            <input
              className={fieldClass}
              placeholder="6, 6.5, 7"
              value={values.ringSizes}
              onChange={(e) => setField("ringSizes", e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">Ships to</span>
            <select
              className={fieldClass}
              value={values.shipsTo}
              onChange={(e) => setField("shipsTo", e.target.value)}
            >
              {PRODUCT_SHIP_REGIONS.map((v) => (
                <option key={v} value={v}>
                  {formatLabel(v)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 self-end pb-2 text-sm">
            <input
              type="checkbox"
              checked={values.isLabGrown}
              onChange={(e) => setField("isLabGrown", e.target.checked)}
            />
            Lab-grown diamond
          </label>
          <label className="flex items-center gap-2 self-end pb-2 text-sm">
            <input
              type="checkbox"
              checked={values.customSizeAvailable}
              onChange={(e) =>
                setField("customSizeAvailable", e.target.checked)
              }
            />
            Custom size available
          </label>
          <label className="flex items-center gap-2 self-end pb-2 text-sm">
            <input
              type="checkbox"
              checked={values.customStoneAvailable}
              onChange={(e) =>
                setField("customStoneAvailable", e.target.checked)
              }
            />
            Custom stone color/size available
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium text-stone-900">
          Certification (IGI / other)
        </legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="text-stone-600">Lab</span>
            <select
              className={fieldClass}
              value={values.certificationLab}
              onChange={(e) => setField("certificationLab", e.target.value)}
            >
              <option value="">—</option>
              {CERTIFICATION_LABS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">Report number</span>
            <input
              className={fieldClass}
              value={values.certificationReportNumber}
              onChange={(e) =>
                setField("certificationReportNumber", e.target.value)
              }
            />
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">Report URL</span>
            <input
              className={fieldClass}
              value={values.certificationReportUrl}
              onChange={(e) =>
                setField("certificationReportUrl", e.target.value)
              }
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium text-stone-900">
          Images & video
        </legend>
        <p className="text-xs text-stone-500">
          Prefer descriptive filenames, e.g.{" "}
          <code className="rounded bg-stone-100 px-1">
            asteria-blue-lab-grown-diamond-star-ring.jpg
          </code>
          . Each image needs a unique ALT.
        </p>
        {values.images.map((image, index) => (
          <div
            key={index}
            className="grid gap-3 rounded-sm border border-stone-200 p-3 sm:grid-cols-[1fr_1fr_auto]"
          >
            <label className="block text-sm">
              <span className="text-stone-600">
                Image URL {index === 0 ? "(primary)" : ""}
              </span>
              <input
                className={fieldClass}
                value={image.url}
                onChange={(e) => updateImage(index, "url", e.target.value)}
              />
            </label>
            <label className="block text-sm">
              <span className="text-stone-600">ALT text (unique)</span>
              <input
                className={fieldClass}
                placeholder="ASTERIA blue lab-grown diamond ring in yellow gold"
                value={image.alt}
                onChange={(e) => updateImage(index, "alt", e.target.value)}
              />
            </label>
            <button
              type="button"
              onClick={() => removeImageRow(index)}
              className="self-end rounded-sm border border-stone-200 px-3 py-2 text-sm text-stone-600 hover:bg-stone-50"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addImageRow}
          className="rounded-sm border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
        >
          Add image
        </button>
        <label className="block text-sm">
          <span className="text-stone-600">Video URL</span>
          <input
            className={fieldClass}
            value={values.videoUrl}
            onChange={(e) => setField("videoUrl", e.target.value)}
            placeholder="YouTube, Vimeo, or .mp4 link"
          />
        </label>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-medium text-stone-900">SEO</legend>
        <div className="grid gap-4">
          <label className="block text-sm">
            <span className="text-stone-600">SEO title</span>
            <input
              className={fieldClass}
              value={values.seoTitle}
              onChange={(e) => setField("seoTitle", e.target.value)}
            />
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">SEO description</span>
            <textarea
              rows={2}
              className={fieldClass}
              value={values.seoDescription}
              onChange={(e) => setField("seoDescription", e.target.value)}
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={values.isFeatured}
              onChange={(e) => setField("isFeatured", e.target.checked)}
            />
            Featured
          </label>
        </div>
      </fieldset>

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
