import { getApprovedReviews } from "@/services/review-admin.service";
import { NextResponse } from "next/server";

/** Storefront: approved reviews only. Empty until real customers are moderated. */
export async function GET() {
  const reviews = await getApprovedReviews();
  return NextResponse.json({ reviews });
}
