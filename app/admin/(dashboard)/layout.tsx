import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { canAccessAdmin } from "@/constants/admin-roles";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id || !canAccessAdmin(session.user.role)) {
    redirect("/admin/login");
  }

  return (
    <AdminShell
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      }}
    >
      {children}
    </AdminShell>
  );
}
