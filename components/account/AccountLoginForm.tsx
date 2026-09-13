"use client";

import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";

export function AccountLoginForm({
  callbackPath = "/account",
}: {
  callbackPath?: string;
}) {
  const t = useTranslations("account");
  const router = useRouter();
  const [email, setEmail] = useState("");
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
        setError(t("invalidCredentials"));
        setLoading(false);
        return;
      }

      router.replace(callbackPath);
      router.refresh();
    } catch {
      setError(t("signInError"));
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm">
        <span className="text-brand-muted">{t("email")}</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-sm border border-brand-border bg-brand-surface px-3 py-2.5 text-sm text-brand-text focus:border-brand-teal focus:outline-none"
        />
      </label>
      <label className="block text-sm">
        <span className="text-brand-muted">{t("password")}</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-sm border border-brand-border bg-brand-surface px-3 py-2.5 text-sm text-brand-text focus:border-brand-teal focus:outline-none"
        />
      </label>

      {error && (
        <p className="rounded-sm border border-brand-crimson/20 bg-brand-crimson/5 px-3 py-2 text-sm text-brand-crimson">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-sm bg-brand-text px-4 py-2.5 text-sm font-medium text-brand-bg transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? t("signingIn") : t("signIn")}
      </button>

      <p className="text-center text-sm text-brand-muted">
        {t("noAccount")}{" "}
        <Link href="/account/register" className="text-brand-teal underline-offset-2 hover:underline">
          {t("createAccount")}
        </Link>
      </p>
    </form>
  );
}
