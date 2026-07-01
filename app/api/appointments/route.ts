import { NextResponse } from "next/server";
import { createAppointment } from "@/services/appointment.service";
import { parseAppointmentFormInput } from "@/validation/appointment.schema";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = parseAppointmentFormInput(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error, fieldErrors: parsed.fieldErrors },
        { status: 400 },
      );
    }

    const result = await createAppointment(parsed.data);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status },
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("POST /api/appointments error:", error);
    return NextResponse.json(
      { error: "Could not save your appointment request." },
      { status: 500 },
    );
  }
}
