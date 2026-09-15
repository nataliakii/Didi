import { OPS_ROLES } from "@/constants/admin-roles";
import { revalidateOpsLists } from "@/lib/cache";
import { requireAdminApi } from "@/lib/admin-auth";
import { updateAdminReviewStatus } from "@/services/review-admin.service";
import { updateReviewStatusSchema } from "@/validation/admin/review.schema";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const gate = await requireAdminApi(OPS_ROLES);
  if (!gate.ok) return gate.response;

  try {
    const { id } = await context.params;
    const body: unknown = await request.json();
    const parsed = updateReviewStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid review update." }, { status: 400 });
    }

    const review = await updateAdminReviewStatus(id, parsed.data.status);
    if (!review) {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }

    revalidateOpsLists();
    revalidatePath("/", "layout");
    return NextResponse.json({ review });
  } catch (error) {
    console.error("PATCH /api/admin/reviews/[id] error:", error);
    return NextResponse.json(
      { error: "Could not update review." },
      { status: 500 },
    );
  }
}
