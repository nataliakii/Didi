import { AccountSignOutButton } from "@/components/account/AccountMenuButton";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { auth } from "@/auth";
import { canAccessAdmin, isCustomer } from "@/constants/admin-roles";
import { formatPrice } from "@/lib/utils";
import { getLocaleFromParamsAsync } from "@/lib/i18n";
import { createLocalizedMetadata } from "@/lib/seo";
import { getOrdersForCustomer } from "@/services/customer-admin.service";
import { getCustomerProfile } from "@/services/customer.service";
import { Link } from "@/i18n/routing";
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
    path: "/account",
    title: t("title"),
    description: t("description"),
    noIndex: true,
  });
}

export default async function AccountPage({ params }: PageProps) {
  const locale = await getLocaleFromParamsAsync(params);
  const t = await getTranslations("account");
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/account/login`);
  }

  if (canAccessAdmin(session.user.role)) {
    redirect("/admin");
  }

  if (!isCustomer(session.user.role)) {
    redirect(`/${locale}/account/login`);
  }

  const profile = await getCustomerProfile(session.user.id);
  if (!profile) {
    redirect(`/${locale}/account/login`);
  }

  const orders = await getOrdersForCustomer(profile._id, profile.email);

  return (
    <Container className="py-12 lg:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-brand-text">{t("title")}</h1>
          <p className="mt-2 text-sm text-brand-muted">{t("welcome", { name: profile.name })}</p>
        </div>
        <AccountSignOutButton className="rounded-sm border border-brand-border px-3 py-2 text-sm text-brand-text transition-colors hover:border-brand-teal" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <section className="rounded-sm border border-brand-border bg-brand-surface p-6">
          <h2 className="text-sm font-medium tracking-widest text-brand-muted uppercase">
            {t("profile")}
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-brand-muted">{t("name")}</dt>
              <dd className="mt-1 text-brand-text">{profile.name}</dd>
            </div>
            <div>
              <dt className="text-brand-muted">{t("email")}</dt>
              <dd className="mt-1 text-brand-text">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-brand-muted">{t("phone")}</dt>
              <dd className="mt-1 text-brand-text">{profile.phone || "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-sm border border-brand-border bg-brand-surface p-6">
          <h2 className="text-sm font-medium tracking-widest text-brand-muted uppercase">
            {t("orders")}
          </h2>
          {orders.length === 0 ? (
            <div className="mt-6 text-sm text-brand-muted">
              <p>{t("noOrders")}</p>
              <Link
                href="/products"
                className="mt-3 inline-block text-brand-teal underline-offset-2 hover:underline"
              >
                {t("shopNow")}
              </Link>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-brand-border">
              {orders.map((order) => (
                <li key={order._id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="font-medium text-brand-text">{order.orderNumber}</p>
                    <p className="mt-1 text-xs text-brand-muted">
                      {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                      {order.items.map((item) => item.name).join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <span className="text-sm text-brand-text">
                      {formatPrice(order.total, order.currency)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Container>
  );
}
