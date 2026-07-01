import { Link as IntlLink } from "@/i18n/routing";
import Link from "next/link";
import type { ComponentProps } from "react";

type AppLinkProps = ComponentProps<typeof IntlLink>;

function isExternalOrAdminHref(href: AppLinkProps["href"]): boolean {
  if (typeof href !== "string") return false;
  return (
    href.startsWith("http") ||
    href.startsWith("/admin") ||
    href.startsWith("/api")
  );
}

export function AppLink({ href, ...props }: AppLinkProps) {
  if (isExternalOrAdminHref(href)) {
    return <Link href={href as string} {...props} />;
  }

  return <IntlLink href={href} {...props} />;
}
