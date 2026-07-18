import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  APPOINTMENT_STATUSES,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_TYPE_LABELS,
  type AppointmentStatus,
  type AppointmentType,
} from "@/constants/order-status";
import { getAdminAppointments } from "@/services/appointment-admin.service";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminAppointmentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status =
    params.status &&
    APPOINTMENT_STATUSES.includes(params.status as AppointmentStatus)
      ? params.status
      : undefined;

  const appointments = await getAdminAppointments({ status });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium text-stone-900">Appointments</h2>
        <p className="mt-1 text-sm text-stone-500">
          Consultation requests from the storefront
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/appointments"
          className={`rounded-sm px-3 py-1.5 text-xs ${
            !status
              ? "bg-stone-900 text-white"
              : "border border-stone-200 text-stone-600 hover:bg-stone-100"
          }`}
        >
          All
        </Link>
        {APPOINTMENT_STATUSES.map((value) => (
          <Link
            key={value}
            href={`/admin/appointments?status=${value}`}
            className={`rounded-sm px-3 py-1.5 text-xs ${
              status === value
                ? "bg-stone-900 text-white"
                : "border border-stone-200 text-stone-600 hover:bg-stone-100"
            }`}
          >
            {APPOINTMENT_STATUS_LABELS[value]}
          </Link>
        ))}
      </div>

      {appointments.length === 0 ? (
        <EmptyState
          title="No appointments"
          description="Appointment requests will appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-sm border border-stone-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs tracking-wider text-stone-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Guest</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Preferred</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {appointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-stone-50/80">
                  <td className="px-4 py-3">
                    <div className="font-medium text-stone-900">
                      {appointment.name}
                    </div>
                    <div className="text-xs text-stone-400">
                      {appointment.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {APPOINTMENT_TYPE_LABELS[
                      appointment.appointmentType as AppointmentType
                    ] ?? appointment.appointmentType}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {new Date(appointment.preferredDate).toLocaleDateString()}{" "}
                    · {appointment.preferredTime}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={appointment.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/appointments/${appointment._id}`}
                      className="text-xs font-medium text-stone-700 underline-offset-2 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
