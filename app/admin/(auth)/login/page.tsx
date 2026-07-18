"use client";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { SessionProvider, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("admin@didi.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      router.replace(callbackUrl.startsWith("/admin") ? callbackUrl : "/admin");
      router.refresh();
    } catch {
      setError("Could not sign in. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <label className="block text-sm">
        <span className="text-stone-700">Email</span>
        <input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-sm border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 focus:border-stone-500 focus:outline-none"
        />
      </label>
      <label className="block text-sm">
        <span className="text-stone-700">Password</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-sm border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 focus:border-stone-500 focus:outline-none"
        />
      </label>

      {error && (
        <p className="rounded-sm border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-sm bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-50"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <SessionProvider>
      <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
        <div className="w-full max-w-sm rounded-sm border border-stone-200 bg-white p-8 shadow-sm">
          <div className="text-center">
            <div className="flex justify-center">
              <BrandLogo size="sm" compact />
            </div>
            <p className="mt-3 text-[10px] font-medium tracking-[0.2em] text-brand-gold uppercase">
              Admin
            </p>
            <h1 className="mt-4 font-serif text-2xl text-stone-900">Sign in</h1>
            <p className="mt-2 text-sm text-stone-500">
              Access the Asteria Diamond House admin panel.
            </p>
          </div>
          <Suspense
            fallback={
              <div className="mt-8 h-40 animate-pulse rounded-sm bg-stone-100" />
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </SessionProvider>
  );
}
