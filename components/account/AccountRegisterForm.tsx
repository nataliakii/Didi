"use client";

import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";

export function AccountRegisterForm() {
  const t = useTranslations("account");
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/account/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? t("registerError"));
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.replace("/account/login");
        return;
      }

      router.replace("/account");
      router.refresh();
    } catch {
      setError(t("registerError"));
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm">
        <span className="text-brand-muted">{t("name")}</span>
        <input
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5 w-full rounded-sm border border-brand-border bg-brand-surface px-3 py-2.5 text-sm text-brand-text focus:border-brand-teal focus:outline-none"
        />
      </label>
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
        <span className="text-brand-muted">{t("phone")}</span>
        <input
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1.5 w-full rounded-sm border border-brand-border bg-brand-surface px-3 py-2.5 text-sm text-brand-text focus:border-brand-teal focus:outline-none"
        />
      </label>
      <label className="block text-sm">
        <span className="text-brand-muted">{t("password")}</span>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-sm border border-brand-border bg-brand-surface px-3 py-2.5 text-sm text-brand-text focus:border-brand-teal focus:outline-none"
        />
        <span className="mt-1 block text-xs text-brand-muted">
          {t("passwordHint")}
        </span>
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
        {loading ? t("creatingAccount") : t("createAccount")}
      </button>

      <p className="text-center text-sm text-brand-muted">
        {t("hasAccount")}{" "}
        <Link href="/account/login" className="text-brand-teal underline-offset-2 hover:underline">
          {t("signIn")}
        </Link>
      </p>
    </form>
  );
}
