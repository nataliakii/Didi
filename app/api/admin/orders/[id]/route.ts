import { OPS_ROLES } from "@/constants/admin-roles";
import { requireAdminApi } from "@/lib/admin-auth";
import { updateOrderAdmin } from "@/services/order.service";
import { updateOrderAdminSchema } from "@/validation/admin/order.schema";
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
    const parsed = updateOrderAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid order update." },
        { status: 400 },
      );
    }

    const order = await updateOrderAdmin(id, parsed.data);
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("PATCH /api/admin/orders/[id] error:", error);
    return NextResponse.json(
      { error: "Could not update order." },
      { status: 500 },
    );
  }
}
