import { ReviewStatusButtons } from "@/components/admin/ReviewStatusButtons";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  REVIEW_STATUSES,
  REVIEW_STATUS_LABELS,
  type ReviewStatus,
} from "@/constants/reviews";
import { getAdminReviews } from "@/services/review-admin.service";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminReviewsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status =
    params.status && REVIEW_STATUSES.includes(params.status as ReviewStatus)
      ? (params.status as ReviewStatus)
      : undefined;

  const reviews = await getAdminReviews({ status });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium text-stone-900">Reviews</h2>
        <p className="mt-1 text-sm text-stone-500">
          Customer reviews appear here after a purchase. Approve verified
          comments before they can show on the storefront. No placeholder names.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/reviews"
          className={`rounded-sm px-3 py-1.5 text-xs ${
            !status
              ? "bg-stone-900 text-white"
              : "border border-stone-200 text-stone-600 hover:bg-stone-100"
          }`}
        >
          All
        </Link>
        {REVIEW_STATUSES.map((value) => (
          <Link
            key={value}
            href={`/admin/reviews?status=${value}`}
            className={`rounded-sm px-3 py-1.5 text-xs ${
              status === value
                ? "bg-stone-900 text-white"
                : "border border-stone-200 text-stone-600 hover:bg-stone-100"
            }`}
          >
            {REVIEW_STATUS_LABELS[value]}
          </Link>
        ))}
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="When a customer who bought from Asteria leaves a review, it will wait here for approval."
        />
      ) : (
        <div className="overflow-hidden rounded-sm border border-stone-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs tracking-wider text-stone-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Review</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-stone-50/80">
                  <td className="px-4 py-3">
                    <div className="font-medium text-stone-900">
                      {review.customerName}
                    </div>
                    <div className="text-xs text-stone-400">
                      {review.verifiedPurchase ? "Verified purchase" : "Unverified"}
                      {review.locale ? ` · ${review.locale}` : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-700">{review.rating}/5</td>
                  <td className="max-w-sm px-4 py-3 text-stone-600">
                    <p className="line-clamp-3">{review.body}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={review.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ReviewStatusButtons
                      reviewId={review._id}
                      status={review.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
