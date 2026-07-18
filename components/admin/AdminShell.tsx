"use client";

import { SessionProvider } from "next-auth/react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import type { UserRole } from "@/constants/order-status";
import { useState } from "react";

export type AdminShellUser = {
  name?: string | null;
  email?: string | null;
  role: UserRole;
};

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AdminShellUser;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-stone-50">
        <AdminSidebar
          role={user.role}
          mobileOpen={mobileOpen}
          onNavigate={() => setMobileOpen(false)}
        />

        {mobileOpen && (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/20 lg:hidden"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <div className="flex flex-1 flex-col">
          <AdminTopbar
            userName={user.name}
            onMenuToggle={() => setMobileOpen((open) => !open)}
          />
          <div className="flex-1 p-4 lg:p-8">{children}</div>
        </div>
      </div>
    </SessionProvider>
  );
}
