import { OPS_ROLES } from "@/constants/admin-roles";
import { requireAdminApi } from "@/lib/admin-auth";
import { createShipmentForOrder } from "@/services/shipment.service";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  const gate = await requireAdminApi(OPS_ROLES);
  if (!gate.ok) return gate.response;

  try {
    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as {
      force?: boolean;
    };

    const result = await createShipmentForOrder(id, {
      force: Boolean(body.force),
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/admin/orders/[id]/ship error:", error);
    return NextResponse.json(
      { error: "Could not create DHL shipment." },
      { status: 500 },
    );
  }
}
