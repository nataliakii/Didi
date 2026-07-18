"use client";

import type { UserRole } from "@/constants/order-status";
import { USER_ROLES } from "@/constants/order-status";
import { formatLabel } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

const fieldClass =
  "mt-1.5 w-full rounded-sm border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none";

export type UserFormValues = {
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  password: string;
};

function assignableRoles(actorRole: UserRole): UserRole[] {
  if (actorRole === "super_admin") return [...USER_ROLES];
  return ["admin", "manager"];
}

export function UserAdminForm({
  userId,
  actorRole,
  initial,
}: {
  userId?: string;
  actorRole: UserRole;
  initial?: Partial<Omit<UserFormValues, "password">>;
}) {
  const router = useRouter();
  const roles = assignableRoles(actorRole);
  const [values, setValues] = useState<UserFormValues>({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    role: initial?.role && roles.includes(initial.role) ? initial.role : roles[0],
    isActive: initial?.isActive ?? true,
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!userId && !values.password) {
      setError("Password is required for new users.");
      setLoading(false);
      return;
    }

    const payload = userId
      ? {
          name: values.name,
          email: values.email,
          role: values.role,
          isActive: values.isActive,
          ...(values.password ? { password: values.password } : {}),
        }
      : {
          name: values.name,
          email: values.email,
          role: values.role,
          isActive: values.isActive,
          password: values.password,
        };

    try {
      const response = await fetch(
        userId ? `/api/admin/users/${userId}` : "/api/admin/users",
        {
          method: userId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await response.json()) as { error?: string; id?: string };
      if (!response.ok) {
        setError(data.error ?? "Could not save user.");
        return;
      }
      router.push(`/admin/users/${userId ?? data.id}`);
      router.refresh();
    } catch {
      setError("Could not save user.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-stone-600">Name</span>
          <input
            required
            className={fieldClass}
            value={values.name}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Email</span>
          <input
            type="email"
            required
            className={fieldClass}
            value={values.email}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">Role</span>
          <select
            className={fieldClass}
            value={values.role}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                role: e.target.value as UserRole,
              }))
            }
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {formatLabel(role.replace("_", "-"))}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-stone-600">
            {userId ? "New password (optional)" : "Password"}
          </span>
          <input
            type="password"
            minLength={8}
            required={!userId}
            className={fieldClass}
            value={values.password}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, password: e.target.value }))
            }
          />
        </label>
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, isActive: e.target.checked }))
            }
          />
          Active
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-sm bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save user"}
      </button>
    </form>
  );
}
