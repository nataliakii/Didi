"use client";

import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LABELS,
} from "@/constants/order-status";
import { useAdminRefetch } from "@/components/admin/useAdminRefetch";
import { useState, type FormEvent } from "react";

const fieldClass =
  "mt-1.5 w-full rounded-sm border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none";

function toDateInput(value?: string | Date | null): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function OrderAdminForm({
  orderId,
  status,
  paymentStatus,
  trackingNumber,
  internalNotes,
  promisedDeliveryDate,
  productionEta,
  timelineNotes,
  carrierEta,
}: {
  orderId: string;
  status: string;
  paymentStatus: string;
  trackingNumber?: string;
  internalNotes?: string;
  promisedDeliveryDate?: string | Date | null;
  productionEta?: string | Date | null;
  timelineNotes?: string | null;
  carrierEta?: string | null;
}) {
  const refetch = useAdminRefetch();
  const [formStatus, setFormStatus] = useState(status);
  const [formPayment, setFormPayment] = useState(paymentStatus);
  const [formTracking, setFormTracking] = useState(trackingNumber ?? "");
  const [formNotes, setFormNotes] = useState(internalNotes ?? "");
  const [formPromised, setFormPromised] = useState(
    toDateInput(promisedDeliveryDate),
  );
  const [formProduction, setFormProduction] = useState(
    toDateInput(productionEta),
  );
  const [formTimeline, setFormTimeline] = useState(timelineNotes ?? "");
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [customerMessage, setCustomerMessage] = useState("");
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
          promisedDeliveryDate: formPromised || null,
          productionEta: formProduction || null,
          timelineNotes: formTimeline || null,
          notifyCustomer,
          customerMessage: customerMessage.trim() || undefined,
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save order.");
        return;
      }
      setSaved(true);
      setCustomerMessage("");
      refetch();
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

      <div className="rounded-sm border border-stone-200 bg-stone-50 p-4">
        <h4 className="text-sm font-medium text-stone-900">
          Delivery timeline
        </h4>
        {carrierEta ? (
          <p className="mt-1 text-xs text-stone-500">
            Carrier estimate at checkout: {carrierEta}
          </p>
        ) : null}
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-stone-600">Promised delivery date</span>
            <input
              type="date"
              value={formPromised}
              onChange={(e) => setFormPromised(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="block text-sm">
            <span className="text-stone-600">Production ready by</span>
            <input
              type="date"
              value={formProduction}
              onChange={(e) => setFormProduction(e.target.value)}
              className={fieldClass}
            />
          </label>
        </div>
        <label className="mt-4 block text-sm">
          <span className="text-stone-600">
            Timeline note for customer
          </span>
          <textarea
            value={formTimeline}
            onChange={(e) => setFormTimeline(e.target.value)}
            rows={2}
            placeholder="e.g. Custom sizing adds 5–7 working days"
            className={fieldClass}
          />
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

      <div className="rounded-sm border border-stone-200 p-4">
        <label className="flex items-start gap-3 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={notifyCustomer}
            onChange={(e) => setNotifyCustomer(e.target.checked)}
            className="mt-1"
          />
          <span>
            Email the customer about this update
            <span className="mt-0.5 block text-xs text-stone-500">
              Sent when status, tracking, or delivery dates change.
            </span>
          </span>
        </label>
        {notifyCustomer ? (
          <label className="mt-3 block text-sm">
            <span className="text-stone-600">
              Extra message in the email (optional)
            </span>
            <textarea
              value={customerMessage}
              onChange={(e) => setCustomerMessage(e.target.value)}
              rows={2}
              maxLength={500}
              className={fieldClass}
            />
          </label>
        ) : null}
      </div>

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
