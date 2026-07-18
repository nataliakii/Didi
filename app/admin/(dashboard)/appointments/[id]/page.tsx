import { AppointmentAdminForm } from "@/components/admin/AppointmentAdminForm";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  APPOINTMENT_TYPE_LABELS,
  type AppointmentType,
} from "@/constants/order-status";
import { getAdminAppointmentById } from "@/services/appointment-admin.service";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminAppointmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const appointment = await getAdminAppointmentById(id);
  if (!appointment) notFound();

  const custom = appointment.customRingSnapshot as
    | {
        estimatedPrice?: number;
        selectedMetal?: string;
        ringSize?: string;
        setting?: { name?: string };
        diamond?: { shape?: string; carat?: number };
      }
    | undefined;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/appointments"
          className="text-xs text-stone-500 hover:text-stone-800"
        >
          ← Appointments
        </Link>
        <h2 className="mt-2 text-2xl font-medium text-stone-900">
          {appointment.name}
        </h2>
        <div className="mt-2">
          <StatusBadge status={appointment.status} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-sm border border-stone-200 bg-white p-5">
          <h3 className="text-sm font-medium text-stone-900">Details</h3>
          <dl className="mt-3 space-y-2 text-sm text-stone-600">
            <div>
              <dt className="text-xs text-stone-400">Email</dt>
              <dd>{appointment.email}</dd>
            </div>
            <div>
              <dt className="text-xs text-stone-400">Phone</dt>
              <dd>{appointment.phone}</dd>
            </div>
            <div>
              <dt className="text-xs text-stone-400">Type</dt>
              <dd>
                {APPOINTMENT_TYPE_LABELS[
                  appointment.appointmentType as AppointmentType
                ] ?? appointment.appointmentType}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-stone-400">Preferred</dt>
              <dd>
                {new Date(appointment.preferredDate).toLocaleDateString()} ·{" "}
                {appointment.preferredTime}
              </dd>
            </div>
            {appointment.budget && (
              <div>
                <dt className="text-xs text-stone-400">Budget</dt>
                <dd>{appointment.budget}</dd>
              </div>
            )}
            {appointment.message && (
              <div>
                <dt className="text-xs text-stone-400">Message</dt>
                <dd className="whitespace-pre-wrap">{appointment.message}</dd>
              </div>
            )}
          </dl>
        </section>

        <section className="rounded-sm border border-stone-200 bg-white p-5">
          <h3 className="text-sm font-medium text-stone-900">Manage</h3>
          <div className="mt-4">
            <AppointmentAdminForm
              appointmentId={appointment._id}
              status={appointment.status}
              internalNotes={appointment.internalNotes}
            />
          </div>
        </section>
      </div>

      {custom && (
        <section className="rounded-sm border border-stone-200 bg-white p-5">
          <h3 className="text-sm font-medium text-stone-900">
            Custom ring context
          </h3>
          <dl className="mt-3 grid gap-3 text-sm text-stone-600 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-stone-400">Setting</dt>
              <dd>{custom.setting?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-stone-400">Diamond</dt>
              <dd>
                {custom.diamond
                  ? `${custom.diamond.carat}ct ${custom.diamond.shape}`
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-stone-400">Metal / size</dt>
              <dd>
                {custom.selectedMetal ?? "—"} / {custom.ringSize ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-stone-400">Estimated</dt>
              <dd>
                {typeof custom.estimatedPrice === "number"
                  ? formatPrice(custom.estimatedPrice)
                  : "—"}
              </dd>
            </div>
          </dl>
        </section>
      )}
    </div>
  );
}
