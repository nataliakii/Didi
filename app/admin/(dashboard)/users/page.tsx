import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatLabel } from "@/lib/utils";
import { getAdminUsers } from "@/services/user-admin.service";
import Link from "next/link";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-medium text-stone-900">Users</h2>
          <p className="mt-1 text-sm text-stone-500">
            Manage admin and staff accounts
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="rounded-sm bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          New user
        </Link>
      </div>

      {users.length > 0 ? (
        <div className="overflow-hidden rounded-sm border border-stone-200 bg-white">
          <table className="min-w-full divide-y divide-stone-200 text-sm">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Role
                </th>
                <th className="px-4 py-3 text-left font-medium text-stone-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-stone-50">
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/users/${user._id}`}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {user.name}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-stone-700">{user.email}</td>
                  <td className="px-4 py-4 text-stone-700">
                    {formatLabel(user.role.replace("_", "-"))}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      status={user.isActive ? "published" : "archived"}
                      label={user.isActive ? "Active" : "Inactive"}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title="No users found"
          description="Create admin users to manage the store."
        />
      )}
    </div>
  );
}
