import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { getRecentAppointments } from "@/services/appointment.service";
import {
  getDashboardStats,
  getRecentOrders,
} from "@/services/order.service";
import { APPOINTMENT_TYPE_LABELS } from "@/constants/order-status";
import Link from "next/link";

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string | number;
  href?: string;
}) {
  const content = (
    <div className="rounded-sm border border-stone-200 bg-white p-6">
      <p className="text-xs tracking-widest text-stone-400 uppercase">
        {label}
      </p>
      <p className="mt-2 text-2xl font-medium text-stone-900">{value}</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-shadow hover:shadow-sm">
        {content}
      </Link>
    );
  }

  return content;
}

export default async function AdminDashboardPage() {
  const [stats, recentOrders, recentAppointments] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(5),
    getRecentAppointments(5),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-medium text-stone-900">Dashboard</h2>
        <p className="mt-1 text-sm text-stone-500">
          Overview of your jewellery business
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Sales"
          value={formatPrice(stats.totalSales)}
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          href="/admin/orders"
        />
        <StatCard
          label="Pending Orders"
          value={stats.pendingOrders}
          href="/admin/orders"
        />
        <StatCard
          label="Pending Appointments"
          value={stats.pendingAppointments}
          href="/admin/appointments"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Products"
          value={stats.productsCount}
          href="/admin/products"
        />
        <StatCard
          label="Diamonds"
          value={stats.diamondsCount}
          href="/admin/diamonds"
        />
        <StatCard
          label="Low Stock Products"
          value={stats.lowStockProducts}
          href="/admin/products"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-sm border border-stone-200 bg-white">
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
            <h3 className="text-sm font-medium text-stone-900">
              Recent Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-xs text-stone-500 hover:text-stone-900"
            >
              View all
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <ul className="divide-y divide-stone-100">
              {recentOrders.map((order) => (
                <li
                  key={order._id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-900">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-stone-500">
                      {order.customer.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-stone-900">
                      {formatPrice(order.total)}
                    </p>
                    <StatusBadge status={order.status} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6">
              <EmptyState
                title="No orders yet"
                description="Orders will appear here once customers start purchasing."
              />
            </div>
          )}
        </section>

        <section className="rounded-sm border border-stone-200 bg-white">
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
            <h3 className="text-sm font-medium text-stone-900">
              Recent Appointments
            </h3>
            <Link
              href="/admin/appointments"
              className="text-xs text-stone-500 hover:text-stone-900"
            >
              View all
            </Link>
          </div>
          {recentAppointments.length > 0 ? (
            <ul className="divide-y divide-stone-100">
              {recentAppointments.map((appointment) => (
                <li
                  key={appointment._id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-900">
                      {appointment.name}
                    </p>
                    <p className="text-xs text-stone-500">
                      {APPOINTMENT_TYPE_LABELS[appointment.appointmentType]}
                    </p>
                  </div>
                  <StatusBadge status={appointment.status} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6">
              <EmptyState
                title="No appointments yet"
                description="Appointment requests will appear here."
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
