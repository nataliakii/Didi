import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { getAdminCustomerById } from "@/services/customer-admin.service";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCustomerDetailPage({ params }: PageProps) {
  const { id } = await params;
  const customer = await getAdminCustomerById(id);
  if (!customer) notFound();

  const address = customer.shippingAddress;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/customers"
          className="text-xs text-stone-500 hover:text-stone-800"
        >
          ← Customers
        </Link>
        <h2 className="mt-2 text-2xl font-medium text-stone-900">
          {customer.name}
        </h2>
        <p className="mt-1 text-sm text-stone-500">{customer.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-stone-200 bg-white p-5">
          <p className="text-xs tracking-widest text-stone-400 uppercase">Orders</p>
          <p className="mt-2 text-2xl font-medium text-stone-900">
            {customer.orderCount}
          </p>
        </div>
        <div className="rounded-sm border border-stone-200 bg-white p-5">
          <p className="text-xs tracking-widest text-stone-400 uppercase">Spent</p>
          <p className="mt-2 text-2xl font-medium text-stone-900">
            {formatPrice(customer.totalSpent)}
          </p>
        </div>
        <div className="rounded-sm border border-stone-200 bg-white p-5">
          <p className="text-xs tracking-widest text-stone-400 uppercase">Joined</p>
          <p className="mt-2 text-lg font-medium text-stone-900">
            {new Date(customer.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-sm border border-stone-200 bg-white p-5">
          <h3 className="text-sm font-medium text-stone-900">Contact</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-stone-500">Email</dt>
              <dd className="mt-1 text-stone-900">{customer.email}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Phone</dt>
              <dd className="mt-1 text-stone-900">{customer.phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Status</dt>
              <dd className="mt-1">
                <StatusBadge
                  status={customer.isActive ? "in-stock" : "out-of-stock"}
                  label={customer.isActive ? "Active" : "Inactive"}
                />
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-sm border border-stone-200 bg-white p-5">
          <h3 className="text-sm font-medium text-stone-900">Saved address</h3>
          {address?.line1 ? (
            <p className="mt-4 text-sm leading-relaxed text-stone-700">
              {address.line1}
              {address.line2 ? (
                <>
                  <br />
                  {address.line2}
                </>
              ) : null}
              <br />
              {[address.city, address.state, address.postalCode]
                .filter(Boolean)
                .join(", ")}
              {address.country ? (
                <>
                  <br />
                  {address.country}
                </>
              ) : null}
            </p>
          ) : (
            <p className="mt-4 text-sm text-stone-500">No saved address.</p>
          )}
        </section>
      </div>

      <section className="overflow-hidden rounded-sm border border-stone-200 bg-white">
        <div className="border-b border-stone-200 px-4 py-3">
          <h3 className="text-sm font-medium text-stone-900">Orders</h3>
        </div>
        {customer.orders.length === 0 ? (
          <p className="px-4 py-8 text-sm text-stone-500">No orders yet.</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-xs tracking-wide text-stone-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {customer.orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-4 py-3">
                    {formatPrice(order.total, order.currency)}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
