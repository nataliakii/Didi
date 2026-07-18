import { OPS_ROLES } from "@/constants/admin-roles";
import { APPOINTMENT_STATUSES } from "@/constants/order-status";
import { requireAdminApi } from "@/lib/admin-auth";
import { updateAdminAppointment } from "@/services/appointment-admin.service";
import { z } from "zod";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const schema = z.object({
  status: z.enum(APPOINTMENT_STATUSES).optional(),
  internalNotes: z.string().trim().optional(),
});

export async function PATCH(request: Request, context: RouteContext) {
  const gate = await requireAdminApi(OPS_ROLES);
  if (!gate.ok) return gate.response;

  try {
    const { id } = await context.params;
    const body: unknown = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid appointment update." },
        { status: 400 },
      );
    }

    const appointment = await updateAdminAppointment(id, parsed.data);
    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error("PATCH /api/admin/appointments/[id] error:", error);
    return NextResponse.json(
      { error: "Could not update appointment." },
      { status: 500 },
    );
  }
}
