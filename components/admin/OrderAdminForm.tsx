"use client";

import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LABELS,
} from "@/constants/order-status";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const fieldClass =
  "mt-1.5 w-full rounded-sm border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none";

export function OrderAdminForm({
  orderId,
  status,
  paymentStatus,
  trackingNumber,
  internalNotes,
}: {
  orderId: string;
  status: string;
  paymentStatus: string;
  trackingNumber?: string;
  internalNotes?: string;
}) {
  const router = useRouter();
  const [formStatus, setFormStatus] = useState(status);
  const [formPayment, setFormPayment] = useState(paymentStatus);
  const [formTracking, setFormTracking] = useState(trackingNumber ?? "");
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
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: formStatus,
          paymentStatus: formPayment,
          trackingNumber: formTracking,
          internalNotes: formNotes,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save order.");
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Could not save order.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-stone-600">Order status</span>
          <select
            value={formStatus}
            onChange={(e) => setFormStatus(e.target.value)}
            className={fieldClass}
          >
            {ORDER_STATUSES.map((value) => (
              <option key={value} value={value}>
                {ORDER_STATUS_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Payment status</span>
          <select
            value={formPayment}
            onChange={(e) => setFormPayment(e.target.value)}
            className={fieldClass}
          >
            {PAYMENT_STATUSES.map((value) => (
              <option key={value} value={value}>
                {PAYMENT_STATUS_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-stone-600">Tracking number</span>
        <input
          value={formTracking}
          onChange={(e) => setFormTracking(e.target.value)}
          className={fieldClass}
        />
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
