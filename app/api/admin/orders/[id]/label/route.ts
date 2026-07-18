import { OPS_ROLES } from "@/constants/admin-roles";
import { requireAdminApi } from "@/lib/admin-auth";
import { getOrderLabelDocument } from "@/services/shipment.service";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  const gate = await requireAdminApi(OPS_ROLES);
  if (!gate.ok) return gate.response;

  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") === "invoice" ? "invoice" : "label";

    const result = await getOrderLabelDocument(id, type);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    const buffer = Buffer.from(result.contentBase64, "base64");
    const filename = `${result.orderNumber}-${type}.${result.imageFormat.toLowerCase()}`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          result.imageFormat.toUpperCase() === "PDF"
            ? "application/pdf"
            : "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("GET /api/admin/orders/[id]/label error:", error);
    return NextResponse.json(
      { error: "Could not download shipping label." },
      { status: 500 },
    );
  }
}
