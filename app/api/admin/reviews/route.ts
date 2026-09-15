import { OPS_ROLES } from "@/constants/admin-roles";
import { REVIEW_STATUSES, type ReviewStatus } from "@/constants/reviews";
import { requireAdminApi } from "@/lib/admin-auth";
import { getAdminReviews } from "@/services/review-admin.service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const gate = await requireAdminApi(OPS_ROLES);
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const status =
    statusParam && REVIEW_STATUSES.includes(statusParam as ReviewStatus)
      ? (statusParam as ReviewStatus)
      : undefined;

  const reviews = await getAdminReviews({ status });
  return NextResponse.json({ reviews });
}
