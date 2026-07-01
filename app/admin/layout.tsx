import { AdminShell } from "@/components/admin/AdminShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add NextAuth session check + proxy.ts protection in Step 2
  return <AdminShell>{children}</AdminShell>;
}
