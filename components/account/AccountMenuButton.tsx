"use client";

import { UserIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";

export function AccountMenuButton({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("navigation");
  const { data: session, status } = useSession();

  const className =
    "inline-flex items-center justify-center rounded-sm p-2 text-brand-text transition-colors hover:text-brand-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal";

  if (status === "loading") {
    return (
      <span className={className} aria-hidden>
        <UserIcon />
      </span>
    );
  }

  if (session?.user) {
    return (
      <Link
        href="/account"
        className={className}
        aria-label={t("account")}
        onClick={onNavigate}
        title={session.user.name ?? t("account")}
      >
        <UserIcon />
      </Link>
    );
  }

  return (
    <Link
      href="/account/login"
      className={className}
      aria-label={t("signIn")}
      onClick={onNavigate}
    >
      <UserIcon />
    </Link>
  );
}

export function AccountSignOutButton({ className }: { className?: string }) {
  const t = useTranslations("account");
  return (
    <button
      type="button"
      className={className}
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      {t("signOut")}
    </button>
  );
}
