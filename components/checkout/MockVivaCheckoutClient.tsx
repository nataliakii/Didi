"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

function formatEuroFromCents(cents: number): string {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function MockVivaCheckoutClient() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState<"paid" | "failed" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const orderCode = searchParams.get("ref")?.trim() ?? "";
  const orderNumber = searchParams.get("order")?.trim() ?? "";
  const amountCents = Number(searchParams.get("amount") ?? "0");

  const amountLabel = useMemo(() => {
    if (!Number.isFinite(amountCents) || amountCents <= 0) return null;
    return formatEuroFromCents(amountCents);
  }, [amountCents]);

  async function complete(outcome: "paid" | "failed") {
    if (!orderCode) {
      setError(t("mockMissingRef"));
      return;
    }

    setPending(outcome);
    setError(null);

    try {
      const response = await fetch("/api/checkout/mock/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderCode, outcome, locale }),
      });
      const data = (await response.json()) as {
        error?: string;
        redirectUrl?: string;
      };

      if (!response.ok || !data.redirectUrl) {
        setError(data.error ?? t("errorGeneric"));
        setPending(null);
        return;
      }

      window.location.href = data.redirectUrl;
    } catch {
      setError(t("errorGeneric"));
      setPending(null);
    }
  }

  return (
    <Container className="py-16 lg:py-24">
      <div className="mx-auto max-w-lg rounded-sm border border-brand-gold/20 bg-brand-surface p-8 text-center">
        <p className="section-eyebrow">{t("mockEyebrow")}</p>
        <h1 className="mt-3 font-serif text-3xl text-brand-text">
          {t("mockTitle")}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-brand-charcoal/70">
          {t("mockDescription")}
        </p>

        <dl className="mt-8 space-y-2 text-left text-sm text-brand-text/85">
          {orderNumber ? (
            <div className="flex justify-between gap-4 border-b border-brand-gold/10 py-2">
              <dt>{t("orderNumber")}</dt>
              <dd className="font-medium">{orderNumber}</dd>
            </div>
          ) : null}
          {orderCode ? (
            <div className="flex justify-between gap-4 border-b border-brand-gold/10 py-2">
              <dt>{t("mockOrderCode")}</dt>
              <dd className="font-mono text-xs">{orderCode}</dd>
            </div>
          ) : null}
          {amountLabel ? (
            <div className="flex justify-between gap-4 border-b border-brand-gold/10 py-2">
              <dt>{t("mockAmount")}</dt>
              <dd className="font-medium">{amountLabel}</dd>
            </div>
          ) : null}
        </dl>

        {error ? (
          <p className="mt-4 text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="gold"
            disabled={Boolean(pending) || !orderCode}
            onClick={() => complete("paid")}
          >
            {pending === "paid" ? t("mockPaying") : t("mockPaySuccess")}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={Boolean(pending) || !orderCode}
            onClick={() => complete("failed")}
          >
            {pending === "failed" ? t("redirecting") : t("mockPayFail")}
          </Button>
        </div>

        <p className="mt-6 text-xs text-brand-charcoal/55">
          <Link href="/checkout" className="underline underline-offset-2">
            {t("tryAgain")}
          </Link>
        </p>
      </div>
    </Container>
  );
}
