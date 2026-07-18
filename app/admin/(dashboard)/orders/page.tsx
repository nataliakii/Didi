import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { getOrders } from "@/services/order.service";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const orders = await getOrders(100);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium text-stone-900">Orders</h2>
        <p className="mt-1 text-sm text-stone-500">
          Payments, DHL shipments, and labels
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Orders will appear here after checkout."
        />
      ) : (
        <div className="overflow-hidden rounded-sm border border-stone-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs tracking-wider text-stone-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-stone-50/80">
                  <td className="px-4 py-3 font-medium text-stone-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    <div>{order.customer.name}</div>
                    <div className="text-xs text-stone-400">
                      {order.customer.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-900">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${order._id}`}
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
