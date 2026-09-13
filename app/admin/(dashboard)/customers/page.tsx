import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPrice } from "@/lib/utils";
import { getAdminCustomers } from "@/services/customer-admin.service";
import Link from "next/link";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium text-stone-900">Customers</h2>
        <p className="mt-1 text-sm text-stone-500">
          Registered storefront accounts and their order activity
        </p>
      </div>

      {customers.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="Customer accounts will appear here after registration."
        />
      ) : (
        <div className="overflow-hidden rounded-sm border border-stone-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-xs tracking-wide text-stone-500 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Orders</th>
                <th className="px-4 py-3 font-medium">Spent</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {customers.map((customer) => (
                <tr key={customer._id} className="hover:bg-stone-50/80">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/customers/${customer._id}`}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {customer.name}
                    </Link>
                    <div className="text-xs text-stone-500">{customer.email}</div>
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {customer.phone || "—"}
                  </td>
                  <td className="px-4 py-3 text-stone-700">{customer.orderCount}</td>
                  <td className="px-4 py-3 text-stone-700">
                    {formatPrice(customer.totalSpent)}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={customer.isActive ? "in-stock" : "out-of-stock"}
                      label={customer.isActive ? "Active" : "Inactive"}
                    />
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
