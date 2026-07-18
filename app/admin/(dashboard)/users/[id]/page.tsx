import { UserAdminForm } from "@/components/admin/UserAdminForm";
import { auth } from "@/auth";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatLabel } from "@/lib/utils";
import { getAdminUserById } from "@/services/user-admin.service";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface AdminUserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({
  params,
}: AdminUserDetailPageProps) {
  const session = await auth();
  if (!session?.user?.role) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const user = await getAdminUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/users"
            className="text-xs text-stone-500 hover:text-stone-900"
          >
            &larr; Back to users
          </Link>
          <h2 className="mt-2 text-2xl font-medium text-stone-900">
            {user.name}
          </h2>
          <p className="mt-1 text-sm text-stone-500">{user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge
            status={user.isActive ? "published" : "archived"}
            label={user.isActive ? "Active" : "Inactive"}
          />
          <span className="text-sm text-stone-600">
            {formatLabel(user.role.replace("_", "-"))}
          </span>
        </div>
      </div>

      <div className="rounded-sm border border-stone-200 bg-white p-5">
        <h3 className="mb-4 text-sm font-medium text-stone-900">Edit user</h3>
        <UserAdminForm
          userId={user._id}
          actorRole={session.user.role}
          initial={{
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
          }}
        />
      </div>
    </div>
  );
}
