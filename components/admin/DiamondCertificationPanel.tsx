"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CERTIFICATION_LABS } from "@/constants/certification";
import type { DiamondCertification, UpdateDiamondCertificationInput } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DiamondCertificationPanelProps {
  diamondId: string;
  certification?: DiamondCertification;
}

export function DiamondCertificationPanel({
  diamondId,
  certification,
}: DiamondCertificationPanelProps) {
  const router = useRouter();
  const [form, setForm] = useState<UpdateDiamondCertificationInput>({
    lab: certification?.lab,
    reportNumber: certification?.reportNumber ?? "",
    reportUrl: certification?.reportUrl ?? "",
    certificateFileUrl: certification?.certificateFileUrl ?? "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/admin/diamonds/${diamondId}/certification`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        setMessage(data.error ?? "Could not save grading report details.");
        return;
      }

      setMessage(data.message ?? "Grading report details saved.");
      router.refresh();
    } catch {
      setMessage("Could not save grading report details.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-sm border border-stone-200 bg-white p-6">
      <div>
        <h3 className="text-lg font-medium text-stone-900">Grading Report</h3>
        <p className="mt-1 text-sm text-stone-500">
          Enter the certification lab and report details. Customers can check the
          report on the official laboratory website.
        </p>
      </div>

      <form onSubmit={handleSave} className="mt-6 space-y-4">
        <Select
          id="certificationLab"
          label="Certification Lab"
          value={form.lab ?? ""}
          placeholder="Select lab"
          options={CERTIFICATION_LABS.map((lab) => ({
            value: lab,
            label: lab,
          }))}
          onChange={(value) =>
            setForm((current) => ({
              ...current,
              lab: value as UpdateDiamondCertificationInput["lab"],
            }))
          }
        />

        <Input
          id="reportNumber"
          label="Report Number"
          value={form.reportNumber ?? ""}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              reportNumber: event.target.value,
            }))
          }
          placeholder="e.g. 2141234567"
        />

        <Input
          id="reportUrl"
          label="Official Report URL"
          type="url"
          value={form.reportUrl ?? ""}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              reportUrl: event.target.value,
            }))
          }
          placeholder="https://..."
        />

        <Input
          id="certificateFileUrl"
          label="Certificate File URL"
          type="url"
          value={form.certificateFileUrl ?? ""}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              certificateFileUrl: event.target.value,
            }))
          }
          placeholder="Uploaded file URL (Cloudinary in a later step)"
        />

        <div className="pt-2">
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Grading Report"}
          </Button>
        </div>
      </form>

      {message && (
        <p className="mt-4 rounded-sm border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
          {message}
        </p>
      )}
    </section>
  );
}
