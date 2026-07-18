"use client";

import {
  AVAILABILITY_STATUSES,
  DIAMOND_CLARITY,
  DIAMOND_COLORS,
  DIAMOND_CUTS,
  DIAMOND_SHAPES,
  DIAMOND_TYPES,
} from "@/constants/jewellery";
import { CERTIFICATION_LABS } from "@/constants/certification";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const fieldClass =
  "mt-1.5 w-full rounded-sm border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none";

export type DiamondFormValues = {
  diamondType: string;
  shape: string;
  carat: number;
  cut: string;
  color: string;
  clarity: string;
  price: number;
  salePrice?: number;
  availabilityStatus: string;
  isActive: boolean;
  imageUrl?: string;
  videoUrl?: string;
  certification?: {
    lab?: string;
    reportNumber?: string;
    reportUrl?: string;
    certificateFileUrl?: string;
  };
};

export function DiamondAdminForm({
  diamondId,
  initial,
}: {
  diamondId?: string;
  initial?: Partial<DiamondFormValues>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<DiamondFormValues>({
    diamondType: initial?.diamondType ?? "natural",
    shape: initial?.shape ?? "round",
    carat: initial?.carat ?? 1,
    cut: initial?.cut ?? "Excellent",
    color: initial?.color ?? "G",
    clarity: initial?.clarity ?? "VS1",
    price: initial?.price ?? 0,
    salePrice: initial?.salePrice,
    availabilityStatus: initial?.availabilityStatus ?? "in-stock",
    isActive: initial?.isActive ?? true,
    imageUrl: initial?.imageUrl ?? "",
    videoUrl: initial?.videoUrl ?? "",
    certification: {
      lab: initial?.certification?.lab ?? "",
      reportNumber: initial?.certification?.reportNumber ?? "",
      reportUrl: initial?.certification?.reportUrl ?? "",
      certificateFileUrl: initial?.certification?.certificateFileUrl ?? "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof DiamondFormValues>(
    key: K,
    value: DiamondFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      ...values,
      salePrice: values.salePrice || null,
      certification: {
        lab: values.certification?.lab || null,
        reportNumber: values.certification?.reportNumber,
        reportUrl: values.certification?.reportUrl,
        certificateFileUrl: values.certification?.certificateFileUrl,
      },
    };

    try {
      const response = await fetch(
        diamondId ? `/api/admin/diamonds/${diamondId}` : "/api/admin/diamonds",
        {
          method: diamondId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await response.json()) as { error?: string; id?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save diamond.");
        return;
      }
      router.push(`/admin/diamonds/${diamondId ?? data.id}`);
      router.refresh();
    } catch {
      setError("Could not save diamond.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!diamondId || !confirm("Delete this diamond?")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/diamonds/${diamondId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        setError("Could not delete diamond.");
        return;
      }
      router.push("/admin/diamonds");
      router.refresh();
    } catch {
      setError("Could not delete diamond.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block text-sm">
          <span className="text-stone-600">Type</span>
          <select
            className={fieldClass}
            value={values.diamondType}
            onChange={(e) => setField("diamondType", e.target.value)}
          >
            {DIAMOND_TYPES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Shape</span>
          <select
            className={fieldClass}
            value={values.shape}
            onChange={(e) => setField("shape", e.target.value)}
          >
            {DIAMOND_SHAPES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Carat</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            required
            className={fieldClass}
            value={values.carat}
            onChange={(e) => setField("carat", Number(e.target.value))}
          />
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Cut</span>
          <select
            className={fieldClass}
            value={values.cut}
            onChange={(e) => setField("cut", e.target.value)}
          >
            {DIAMOND_CUTS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Color</span>
          <select
            className={fieldClass}
            value={values.color}
            onChange={(e) => setField("color", e.target.value)}
          >
            {DIAMOND_COLORS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Clarity</span>
          <select
            className={fieldClass}
            value={values.clarity}
            onChange={(e) => setField("clarity", e.target.value)}
          >
            {DIAMOND_CLARITY.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Price</span>
          <input
            type="number"
            min="0"
            required
            className={fieldClass}
            value={values.price}
            onChange={(e) => setField("price", Number(e.target.value))}
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
          <span className="text-stone-600">Availability</span>
          <select
            className={fieldClass}
            value={values.availabilityStatus}
            onChange={(e) => setField("availabilityStatus", e.target.value)}
          >
            {AVAILABILITY_STATUSES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
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
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) => setField("isActive", e.target.checked)}
          />
          Active on storefront
        </label>
      </div>

      <fieldset className="rounded-sm border border-stone-200 p-4">
        <legend className="px-1 text-sm font-medium text-stone-900">
          Certification
        </legend>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-stone-600">Lab</span>
            <select
              className={fieldClass}
              value={values.certification?.lab ?? ""}
              onChange={(e) =>
                setField("certification", {
                  ...values.certification,
                  lab: e.target.value,
                })
              }
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
              value={values.certification?.reportNumber ?? ""}
              onChange={(e) =>
                setField("certification", {
                  ...values.certification,
                  reportNumber: e.target.value,
                })
              }
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="text-stone-600">Report URL</span>
            <input
              className={fieldClass}
              value={values.certification?.reportUrl ?? ""}
              onChange={(e) =>
                setField("certification", {
                  ...values.certification,
                  reportUrl: e.target.value,
                })
              }
            />
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
          {loading ? "Saving…" : "Save diamond"}
        </button>
        {diamondId && (
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
