import { AccountRegisterForm } from "@/components/account/AccountRegisterForm";
import { Container } from "@/components/ui/Container";
import { auth } from "@/auth";
import { canAccessAdmin, isCustomer } from "@/constants/admin-roles";
import { getLocaleFromParamsAsync } from "@/lib/i18n";
import { createLocalizedMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await getLocaleFromParamsAsync(params);
  const t = await getTranslations({ locale, namespace: "account" });
  return createLocalizedMetadata({
    locale,
    path: "/account/register",
    title: t("registerTitle"),
    description: t("registerDescription"),
    noIndex: true,
  });
}

export default async function AccountRegisterPage({ params }: PageProps) {
  const locale = await getLocaleFromParamsAsync(params);
  const t = await getTranslations("account");
  const session = await auth();

  if (session?.user?.id) {
    if (canAccessAdmin(session.user.role)) {
      redirect("/admin");
    }
    if (isCustomer(session.user.role)) {
      redirect(`/${locale}/account`);
    }
  }

  return (
    <Container className="py-16">
      <div className="mx-auto w-full max-w-md">
        <h1 className="font-serif text-3xl text-brand-text">
          {t("registerTitle")}
        </h1>
        <p className="mt-2 text-sm text-brand-muted">{t("registerDescription")}</p>
        <div className="mt-8 rounded-sm border border-brand-border bg-brand-surface p-6">
          <AccountRegisterForm />
        </div>
      </div>
    </Container>
  );
}
