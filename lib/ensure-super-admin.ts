import { hashPassword } from "@/lib/password";
import { safeConnectDB } from "@/lib/db";
import { User } from "@/models/User";

let ensurePromise: Promise<void> | null = null;

/**
 * Production bootstrap: create/update the super_admin from env.
 *
 * Set on Vercel (Production):
 *   SUPER_ADMIN_EMAIL=you@asteriadiamondhouse.com
 *   SUPER_ADMIN_PASSWORD=<long random password>
 *   SUPER_ADMIN_NAME=Asteria Super Admin   (optional)
 *
 * Local seed still uses admin@didi.com / admin123 from `npm run seed`.
 */
export async function ensureSuperAdminFromEnv(): Promise<void> {
  if (ensurePromise) return ensurePromise;
  ensurePromise = (async () => {
    const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.SUPER_ADMIN_PASSWORD?.trim();
    const name =
      process.env.SUPER_ADMIN_NAME?.trim() || "Asteria Super Admin";

    if (!email || !password) return;
    if (password.length < 10) {
      console.warn(
        "SUPER_ADMIN_PASSWORD is set but shorter than 10 characters; refusing to bootstrap.",
      );
      return;
    }

    const db = await safeConnectDB();
    if (!db) return;

    try {
      const passwordHash = await hashPassword(password);
      await User.findOneAndUpdate(
        { email },
        {
          $set: {
            name,
            email,
            passwordHash,
            role: "super_admin",
            isActive: true,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    } catch (error) {
      console.error("ensureSuperAdminFromEnv error:", error);
    }
  })();

  return ensurePromise;
}
