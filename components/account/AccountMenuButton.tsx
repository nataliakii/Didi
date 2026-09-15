"use client";

import { UserIcon } from "@/components/ui/icons";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";

export function AccountMenuButton({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const t = useTranslations("navigation");
  const { data: session, status } = useSession();

  const buttonClass = cn(
    "inline-flex size-10 shrink-0 items-center justify-center rounded-sm leading-none text-brand-text transition-colors hover:text-brand-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal",
    className,
  );

  if (status === "loading") {
    return (
      <span className={buttonClass} aria-hidden>
        <UserIcon />
      </span>
    );
  }

  if (session?.user) {
    return (
      <Link
        href="/account"
        className={buttonClass}
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
      className={buttonClass}
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
