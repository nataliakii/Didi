import { auth } from "@/auth";
import { canAccessAdmin } from "@/constants/admin-roles";
import { redirect } from "next/navigation";

export default async function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.id && canAccessAdmin(session.user.role)) {
    redirect("/admin");
  }
  return children;
}
