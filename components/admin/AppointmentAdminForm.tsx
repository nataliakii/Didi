"use client";

import {
  APPOINTMENT_STATUSES,
  APPOINTMENT_STATUS_LABELS,
} from "@/constants/order-status";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const fieldClass =
  "mt-1.5 w-full rounded-sm border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none";

export function AppointmentAdminForm({
  appointmentId,
  status,
  internalNotes,
}: {
  appointmentId: string;
  status: string;
  internalNotes?: string;
}) {
  const router = useRouter();
  const [formStatus, setFormStatus] = useState(status);
  const [formNotes, setFormNotes] = useState(internalNotes ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch(
        `/api/admin/appointments/${appointmentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: formStatus,
            internalNotes: formNotes,
          }),
        },
      );
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save appointment.");
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Could not save appointment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm">
        <span className="text-stone-600">Status</span>
        <select
          value={formStatus}
          onChange={(e) => setFormStatus(e.target.value)}
          className={fieldClass}
        >
          {APPOINTMENT_STATUSES.map((value) => (
            <option key={value} value={value}>
              {APPOINTMENT_STATUS_LABELS[value]}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm">
        <span className="text-stone-600">Internal notes</span>
        <textarea
          value={formNotes}
          onChange={(e) => setFormNotes(e.target.value)}
          rows={4}
          className={fieldClass}
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && <p className="text-sm text-stone-600">Saved.</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-sm bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
