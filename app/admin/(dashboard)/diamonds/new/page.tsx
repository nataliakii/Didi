import { DiamondAdminForm } from "@/components/admin/DiamondAdminForm";
import Link from "next/link";

export default function AdminNewDiamondPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/diamonds"
          className="text-xs text-stone-500 hover:text-stone-800"
        >
          ← Diamonds
        </Link>
        <h2 className="mt-2 text-2xl font-medium text-stone-900">
          New diamond
        </h2>
      </div>
      <div className="rounded-sm border border-stone-200 bg-white p-5">
        <DiamondAdminForm />
      </div>
    </div>
  );
}
