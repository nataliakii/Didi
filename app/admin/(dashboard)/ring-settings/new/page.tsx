import { RingSettingAdminForm } from "@/components/admin/RingSettingAdminForm";
import Link from "next/link";

export default function AdminNewRingSettingPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/ring-settings"
          className="text-xs text-stone-500 hover:text-stone-800"
        >
          ← Ring settings
        </Link>
        <h2 className="mt-2 text-2xl font-medium text-stone-900">
          New ring setting
        </h2>
      </div>
      <div className="rounded-sm border border-stone-200 bg-white p-5">
        <RingSettingAdminForm />
      </div>
    </div>
  );
}
