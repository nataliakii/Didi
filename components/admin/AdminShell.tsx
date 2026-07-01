"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { useState } from "react";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar
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
        <AdminTopbar onMenuToggle={() => setMobileOpen((open) => !open)} />
        <div className="flex-1 p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
