import { connectDB } from "@/lib/db";
import { safeConnectDB } from "@/lib/db";
import { Appointment } from "@/models/Appointment";
import type { AppointmentStatus } from "@/constants/order-status";

export type AdminAppointmentSummary = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  appointmentType: string;
  preferredDate: string;
  preferredTime: string;
  status: string;
  createdAt: string;
};

export type AdminAppointmentDetail = AdminAppointmentSummary & {
  budget?: string;
  message?: string;
  internalNotes?: string;
  productSnapshot?: Record<string, unknown>;
  settingSnapshot?: Record<string, unknown>;
  diamondSnapshot?: Record<string, unknown>;
  customRingSnapshot?: Record<string, unknown>;
};

export async function getAdminAppointments(filters?: {
  status?: string;
}): Promise<AdminAppointmentSummary[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const query: Record<string, unknown> = {};
    if (filters?.status) query.status = filters.status;

    const rows = await Appointment.find(query)
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return rows.map((row) => {
      const a = row as unknown as {
        _id: { toString(): string };
        name: string;
        email: string;
        phone: string;
        appointmentType: string;
        preferredDate: Date;
        preferredTime: string;
        status: string;
        createdAt: Date;
      };
      return {
        _id: a._id.toString(),
        name: a.name,
        email: a.email,
        phone: a.phone,
        appointmentType: a.appointmentType,
        preferredDate: a.preferredDate.toISOString(),
        preferredTime: a.preferredTime,
        status: a.status,
        createdAt: a.createdAt.toISOString(),
      };
    });
  } catch (error) {
    console.error("getAdminAppointments error:", error);
    return [];
  }
}

export async function getAdminAppointmentById(
  id: string,
): Promise<AdminAppointmentDetail | null> {
  const db = await safeConnectDB();
  if (!db) return null;

  try {
    const row = await Appointment.findById(id).lean();
    if (!row || Array.isArray(row)) return null;
    const a = row as unknown as {
      _id: { toString(): string };
      name: string;
      email: string;
      phone: string;
      appointmentType: string;
      preferredDate: Date;
      preferredTime: string;
      status: string;
      createdAt: Date;
      budget?: string;
      message?: string;
      internalNotes?: string;
      productSnapshot?: Record<string, unknown>;
      settingSnapshot?: Record<string, unknown>;
      diamondSnapshot?: Record<string, unknown>;
      customRingSnapshot?: Record<string, unknown>;
    };
    return {
      _id: a._id.toString(),
      name: a.name,
      email: a.email,
      phone: a.phone,
      appointmentType: a.appointmentType,
      preferredDate: a.preferredDate.toISOString(),
      preferredTime: a.preferredTime,
      status: a.status,
      createdAt: a.createdAt.toISOString(),
      budget: a.budget,
      message: a.message,
      internalNotes: a.internalNotes,
      productSnapshot: a.productSnapshot,
      settingSnapshot: a.settingSnapshot,
      diamondSnapshot: a.diamondSnapshot,
      customRingSnapshot: a.customRingSnapshot,
    };
  } catch (error) {
    console.error("getAdminAppointmentById error:", error);
    return null;
  }
}

export async function updateAdminAppointment(
  id: string,
  input: { status?: AppointmentStatus; internalNotes?: string },
): Promise<AdminAppointmentDetail | null> {
  await connectDB();
  await Appointment.findByIdAndUpdate(id, { $set: input }, { runValidators: true });
  return getAdminAppointmentById(id);
}
