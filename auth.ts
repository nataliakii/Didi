import type { UserRole } from "@/constants/order-status";
import { canAccessAdmin } from "@/constants/admin-roles";
import { connectDB } from "@/lib/db";
import { ensureSuperAdminFromEnv } from "@/lib/ensure-super-admin";
import { verifyPassword } from "@/lib/password";
import { User } from "@/models/User";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) return null;

        await connectDB();
        await ensureSuperAdminFromEnv();

        const user = await User.findOne({ email }).lean<{
          _id: { toString(): string };
          name: string;
          email: string;
          passwordHash: string;
          role: UserRole;
          isActive: boolean;
        } | null>();

        if (!user || !user.isActive) return null;

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 14,
  },
  pages: {
    signIn: "/en/account/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id =
          typeof token.id === "string"
            ? token.id
            : typeof token.sub === "string"
              ? token.sub
              : "";
        session.user.role =
          (token.role as UserRole | undefined) ?? "customer";
      }
      return session;
    },
  },
  trustHost: true,
});

/** Convenience: current session user if they may use the admin panel. */
export async function requireStaffSession() {
  const session = await auth();
  if (!session?.user?.id || !canAccessAdmin(session.user.role)) {
    return null;
  }
  return session;
}
