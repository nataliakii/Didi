"use client";

import {
  DIAMOND_SHAPES,
  METALS,
  PRODUCT_STATUSES,
  RING_STYLES,
  RING_SIZES,
} from "@/constants/jewellery";
import { formatLabel } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const fieldClass =
  "mt-1.5 w-full rounded-sm border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none";

export type RingSettingFormValues = {
  name: string;
  slug: string;
  style: string;
  basePrice: number;
  description: string;
  availableMetals: string[];
  compatibleDiamondShapes: string[];
  minRingSize: string;
  maxRingSize: string;
  productionTime: string;
  status: string;
  isFeatured: boolean;
  imageUrl: string;
  videoUrl: string;
};

export function RingSettingAdminForm({
  settingId,
  initial,
}: {
  settingId?: string;
  initial?: Partial<RingSettingFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<RingSettingFormValues>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    style: initial?.style ?? "solitaire",
    basePrice: initial?.basePrice ?? 0,
    description: initial?.description ?? "",
    availableMetals: initial?.availableMetals ?? [],
    compatibleDiamondShapes: initial?.compatibleDiamondShapes ?? [],
    minRingSize: initial?.minRingSize ?? "3",
    maxRingSize: initial?.maxRingSize ?? "11",
    productionTime: initial?.productionTime ?? "",
    status: initial?.status ?? "draft",
    isFeatured: initial?.isFeatured ?? false,
    imageUrl: initial?.imageUrl ?? "",
    videoUrl: initial?.videoUrl ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleArrayItem(key: "availableMetals" | "compatibleDiamondShapes", item: string) {
    setValues((prev) => {
      const current = prev[key];
      const next = current.includes(item)
        ? current.filter((v) => v !== item)
        : [...current, item];
      return { ...prev, [key]: next };
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...values,
      slug: values.slug || undefined,
      description: values.description || undefined,
      productionTime: values.productionTime || undefined,
      imageUrl: values.imageUrl || undefined,
      videoUrl: values.videoUrl || undefined,
    };

    try {
      const response = await fetch(
        settingId
          ? `/api/admin/ring-settings/${settingId}`
          : "/api/admin/ring-settings",
        {
          method: settingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await response.json()) as { error?: string; id?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save ring setting.");
        return;
      }
      router.push(`/admin/ring-settings/${settingId ?? data.id}`);
      router.refresh();
    } catch {
      setError("Could not save ring setting.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!settingId || !confirm("Delete this ring setting?")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/ring-settings/${settingId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        setError("Could not delete ring setting.");
        return;
      }
      router.push("/admin/ring-settings");
      router.refresh();
    } catch {
      setError("Could not delete ring setting.");
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
            onChange={(e) =>
              setValues((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Slug</span>
          <input
            className={fieldClass}
            placeholder="Auto-generated"
            value={values.slug}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, slug: e.target.value }))
            }
          />
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Style</span>
          <select
            className={fieldClass}
            value={values.style}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, style: e.target.value }))
            }
          >
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
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                basePrice: Number(e.target.value),
              }))
            }
          />
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Status</span>
          <select
            className={fieldClass}
            value={values.status}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            {PRODUCT_STATUSES.map((v) => (
              <option key={v} value={v}>
                {formatLabel(v)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Min ring size</span>
          <select
            className={fieldClass}
            value={values.minRingSize}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, minRingSize: e.target.value }))
            }
          >
            {RING_SIZES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Max ring size</span>
          <select
            className={fieldClass}
            value={values.maxRingSize}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, maxRingSize: e.target.value }))
            }
          >
            {RING_SIZES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="text-stone-600">Production time</span>
          <input
            className={fieldClass}
            placeholder="e.g. 2-3 weeks"
            value={values.productionTime}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, productionTime: e.target.value }))
            }
          />
        </label>
        <label className="block text-sm sm:col-span-2 lg:col-span-3">
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
        <label className="block text-sm sm:col-span-2">
          <span className="text-stone-600">Video URL</span>
          <input
            className={fieldClass}
            value={values.videoUrl}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, videoUrl: e.target.value }))
            }
            placeholder="YouTube, Vimeo, or .mp4 link"
          />
        </label>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input
            type="checkbox"
            checked={values.isFeatured}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, isFeatured: e.target.checked }))
            }
          />
          Featured
        </label>
      </div>

      <fieldset className="rounded-sm border border-stone-200 p-4">
        <legend className="px-1 text-sm font-medium text-stone-900">
          Available metals
        </legend>
        <div className="mt-2 flex flex-wrap gap-3">
          {METALS.map((metal) => (
            <label key={metal} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={values.availableMetals.includes(metal)}
                onChange={() => toggleArrayItem("availableMetals", metal)}
              />
              {formatLabel(metal)}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded-sm border border-stone-200 p-4">
        <legend className="px-1 text-sm font-medium text-stone-900">
          Compatible diamond shapes
        </legend>
        <div className="mt-2 flex flex-wrap gap-3">
          {DIAMOND_SHAPES.map((shape) => (
            <label key={shape} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={values.compatibleDiamondShapes.includes(shape)}
                onChange={() =>
                  toggleArrayItem("compatibleDiamondShapes", shape)
                }
              />
              {formatLabel(shape)}
            </label>
          ))}
        </div>
      </fieldset>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-sm bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save ring setting"}
        </button>
        {settingId && (
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
