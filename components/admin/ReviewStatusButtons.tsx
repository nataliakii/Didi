"use client";

import { useAdminRefetch } from "@/components/admin/useAdminRefetch";
import {
  REVIEW_STATUS_LABELS,
  type ReviewStatus,
} from "@/constants/reviews";
import { useState } from "react";

export function ReviewStatusButtons({
  reviewId,
  status,
}: {
  reviewId: string;
  status: ReviewStatus;
}) {
  const refetch = useAdminRefetch();
  const [loading, setLoading] = useState<ReviewStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function setStatus(next: ReviewStatus) {
    if (next === status) return;
    setLoading(next);
    setError(null);
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not update review.");
        return;
      }
      refetch();
    } catch {
      setError("Could not update review.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap justify-end gap-1.5">
        {status !== "approved" && (
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => setStatus("approved")}
            className="rounded-sm bg-stone-900 px-2.5 py-1 text-xs text-white hover:bg-stone-800 disabled:opacity-50"
          >
            {loading === "approved" ? "…" : REVIEW_STATUS_LABELS.approved}
          </button>
        )}
        {status !== "pending" && (
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => setStatus("pending")}
            className="rounded-sm border border-stone-200 px-2.5 py-1 text-xs text-stone-700 hover:bg-stone-100 disabled:opacity-50"
          >
            {loading === "pending" ? "…" : REVIEW_STATUS_LABELS.pending}
          </button>
        )}
        {status !== "rejected" && (
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => setStatus("rejected")}
            className="rounded-sm border border-stone-200 px-2.5 py-1 text-xs text-stone-600 hover:bg-stone-100 disabled:opacity-50"
          >
            {loading === "rejected" ? "…" : REVIEW_STATUS_LABELS.rejected}
          </button>
        )}
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
