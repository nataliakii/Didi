import { UserAdminForm } from "@/components/admin/UserAdminForm";
import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminNewUserPage() {
  const session = await auth();
  if (!session?.user?.role) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/users"
          className="text-xs text-stone-500 hover:text-stone-800"
        >
          ← Users
        </Link>
        <h2 className="mt-2 text-2xl font-medium text-stone-900">New user</h2>
      </div>
      <div className="rounded-sm border border-stone-200 bg-white p-5">
        <UserAdminForm actorRole={session.user.role} />
      </div>
    </div>
  );
}
