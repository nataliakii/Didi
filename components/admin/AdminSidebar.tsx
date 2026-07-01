"use client";

import { DEFAULT_LOCALE } from "@/constants/i18n";
import { localizePath } from "@/lib/i18n";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const adminNavItems = [
  { label: "Dashboard", href: "/admin", icon: "◻" },
  { label: "Products", href: "/admin/products", icon: "◇" },
  { label: "Diamonds", href: "/admin/diamonds", icon: "◆" },
  { label: "Ring Settings", href: "/admin/ring-settings", icon: "○" },
  { label: "Orders", href: "/admin/orders", icon: "▤" },
  { label: "Appointments", href: "/admin/appointments", icon: "▦" },
  { label: "Categories", href: "/admin/categories", icon: "▣" },
  { label: "Content", href: "/admin/content", icon: "▧" },
  { label: "Users", href: "/admin/users", icon: "▥" },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onNavigate?: () => void;
}

export function AdminSidebar({ mobileOpen, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  const navContent = (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {adminNavItems.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
            )}
          >
            <span className="text-xs opacity-60" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-stone-200 bg-white lg:flex">
        <div className="flex h-16 flex-col justify-center border-b border-stone-200 px-6">
          <Link href="/admin" className="w-fit transition-opacity hover:opacity-90">
            <BrandLogo size="sm" compact />
          </Link>
          <p className="mt-1 text-[10px] font-medium tracking-[0.2em] text-brand-gold uppercase">
            Admin
          </p>
        </div>
        {navContent}
        <div className="border-t border-stone-200 p-4">
          <Link
            href={localizePath(DEFAULT_LOCALE, "/")}
            className="text-xs text-stone-500 hover:text-stone-900"
          >
            &larr; Back to website
          </Link>
        </div>
      </aside>

      {mobileOpen && (
        <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-stone-200 bg-white lg:hidden">
          <div className="flex h-16 flex-col justify-center border-b border-stone-200 px-6">
            <BrandLogo size="sm" compact />
            <p className="text-[10px] font-medium tracking-[0.2em] text-brand-gold uppercase">
              Admin
            </p>
          </div>
          {navContent}
        </aside>
      )}
    </>
  );
}
