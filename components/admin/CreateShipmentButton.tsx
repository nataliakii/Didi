"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateShipmentButton({
  orderId,
  label = "Create DHL shipment",
  force = false,
}: {
  orderId: string;
  label?: string;
  force?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/ship`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force }),
      });
      const data = (await response.json()) as {
        error?: string;
        trackingNumber?: string;
        skipped?: boolean;
        reason?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Could not create shipment.");
        return;
      }

      if (data.skipped) {
        setMessage(data.reason ?? "Shipment skipped.");
      } else if (data.trackingNumber) {
        setMessage(`Created: ${data.trackingNumber}`);
      } else {
        setMessage("Done.");
      }
      router.refresh();
    } catch {
      setError("Could not create shipment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="rounded-sm border border-stone-300 bg-white px-3 py-2 text-xs font-medium text-stone-800 transition-colors hover:border-stone-500 disabled:opacity-50"
      >
        {loading ? "Creating…" : label}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {message && <p className="text-xs text-stone-600">{message}</p>}
    </div>
  );
}
