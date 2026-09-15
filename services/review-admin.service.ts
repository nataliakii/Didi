import { connectDB, safeConnectDB } from "@/lib/db";
import { Review } from "@/models/Review";
import type { ReviewStatus } from "@/constants/reviews";
import mongoose from "mongoose";

export type AdminReviewSummary = {
  _id: string;
  customerName: string;
  locale?: string;
  rating: number;
  body: string;
  productType?: string;
  status: ReviewStatus;
  verifiedPurchase: boolean;
  publishedAt?: string;
  createdAt: string;
};

function toSummary(row: {
  _id: { toString(): string };
  customerName: string;
  locale?: string;
  rating: number;
  body: string;
  productType?: string;
  status: ReviewStatus;
  verifiedPurchase?: boolean;
  publishedAt?: Date;
  createdAt: Date;
}): AdminReviewSummary {
  return {
    _id: row._id.toString(),
    customerName: row.customerName,
    locale: row.locale,
    rating: row.rating,
    body: row.body,
    productType: row.productType,
    status: row.status,
    verifiedPurchase: Boolean(row.verifiedPurchase),
    publishedAt: row.publishedAt?.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getAdminReviews(filters?: {
  status?: ReviewStatus;
}): Promise<AdminReviewSummary[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const query: Record<string, unknown> = {};
    if (filters?.status) query.status = filters.status;

    const rows = await Review.find(query).sort({ createdAt: -1 }).limit(200).lean();

    return rows.map((row) =>
      toSummary(row as unknown as Parameters<typeof toSummary>[0]),
    );
  } catch (error) {
    console.error("getAdminReviews error:", error);
    return [];
  }
}

export async function updateAdminReviewStatus(
  id: string,
  status: ReviewStatus,
): Promise<AdminReviewSummary | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  await connectDB();

  const publishedAt = status === "approved" ? new Date() : null;

  const row = await Review.findByIdAndUpdate(
    id,
    { $set: { status, publishedAt } },
    { new: true, runValidators: true },
  ).lean();

  if (!row) return null;
  return toSummary(row as unknown as Parameters<typeof toSummary>[0]);
}

export async function getApprovedReviews(limit = 12): Promise<AdminReviewSummary[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const rows = await Review.find({ status: "approved" })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return rows.map((row) =>
      toSummary(row as unknown as Parameters<typeof toSummary>[0]),
    );
  } catch (error) {
    console.error("getApprovedReviews error:", error);
    return [];
  }
}
