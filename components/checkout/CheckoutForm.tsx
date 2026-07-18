"use client";

import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, type FormEvent } from "react";

type ShippingOption = {
  id: string;
  carrier: "dhl";
  productCode: string;
  productName: string;
  price: number;
  currency: string;
  estimatedDelivery?: string;
  transitDays?: number;
  source: "dhl" | "fallback";
};

function formatDeliveryHint(option: ShippingOption): string | null {
  if (option.estimatedDelivery) {
    const date = new Date(option.estimatedDelivery);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  }
  if (typeof option.transitDays === "number") {
    return `${option.transitDays} days`;
  }
  return null;
}

export function CheckoutForm() {
  const t = useTranslations("checkout");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { items, getSubtotal, isHydrated } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("GR");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedProductCode, setSelectedProductCode] = useState<string | null>(
    null,
  );
  const [shippingSource, setShippingSource] = useState<"dhl" | "fallback" | null>(
    null,
  );
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ratesRequestId = useRef(0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const canQuoteShipping =
    city.trim().length >= 2 &&
    postalCode.trim().length >= 2 &&
    country.trim().length === 2;

  useEffect(() => {
    if (!canQuoteShipping) {
      setShippingOptions([]);
      setSelectedProductCode(null);
      setShippingSource(null);
      setShippingError(null);
      setShippingLoading(false);
      return;
    }

    const requestId = ++ratesRequestId.current;
    const timer = window.setTimeout(async () => {
      setShippingLoading(true);
      setShippingError(null);

      try {
        const response = await fetch("/api/shipping/rates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country,
            city,
            postalCode,
            itemCount,
          }),
        });

        const data = (await response.json()) as {
          options?: ShippingOption[];
          source?: "dhl" | "fallback";
          error?: string;
        };

        if (requestId !== ratesRequestId.current) return;

        if (!response.ok || !data.options) {
          setShippingOptions([]);
          setSelectedProductCode(null);
          setShippingSource(null);
          setShippingError(data.error ?? t("shippingError"));
          return;
        }

        setShippingOptions(data.options);
        setShippingSource(data.source ?? null);
        setSelectedProductCode((current) => {
          if (current && data.options!.some((o) => o.productCode === current)) {
            return current;
          }
          return data.options![0]?.productCode ?? null;
        });
      } catch {
        if (requestId !== ratesRequestId.current) return;
        setShippingOptions([]);
        setSelectedProductCode(null);
        setShippingSource(null);
        setShippingError(t("shippingError"));
      } finally {
        if (requestId === ratesRequestId.current) {
          setShippingLoading(false);
        }
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [canQuoteShipping, city, postalCode, country, itemCount, t]);

  if (!isHydrated) {
    return <div className="h-96 animate-pulse rounded-sm bg-brand-cream" />;
  }

  if (items.length === 0) {
    return (
      <div className="panel-luxury p-8 text-center">
        <p className="text-brand-charcoal/70">{t("emptyBag")}</p>
        <div className="mt-6">
          <Button href="/products" variant="outline">
            {t("continueShopping")}
          </Button>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const selectedShipping =
    shippingOptions.find((o) => o.productCode === selectedProductCode) ?? null;
  const shippingTotal = selectedShipping?.price ?? 0;
  const total = subtotal + shippingTotal;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!selectedProductCode) {
      setError(t("shippingRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customer: { name, email, phone },
        shippingAddress: {
          line1,
          line2: line2 || undefined,
          city,
          state: state || undefined,
          postalCode,
          country,
        },
        shipping: { productCode: selectedProductCode },
        locale,
        items: items.map((item) => {
          if (item.type === "product") {
            return {
              type: "product" as const,
              productId: item.productId,
              quantity: item.quantity,
              selectedOptions: item.selectedOptions,
            };
          }
          return {
            type: "custom-ring" as const,
            settingId: item.settingId,
            diamondId: item.diamondId,
            selectedMetal: item.selectedMetal,
            ringSize: item.ringSize,
            quantity: 1 as const,
          };
        }),
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !data.checkoutUrl) {
        setError(data.error ?? t("errorGeneric"));
        setIsSubmitting(false);
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setError(t("errorGeneric"));
      setIsSubmitting(false);
    }
  }

  const fieldClass =
    "mt-1.5 w-full rounded-sm border border-brand-gold/30 bg-white px-3 py-2.5 text-sm text-brand-charcoal focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/50";

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
      <div className="space-y-8">
        <section className="panel-luxury p-6">
          <h2 className="font-serif text-xl text-brand-navy">{t("contactTitle")}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              <span className="text-brand-navy/80">{t("name")}</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldClass}
                autoComplete="name"
              />
            </label>
            <label className="block text-sm">
              <span className="text-brand-navy/80">{t("email")}</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
                autoComplete="email"
              />
            </label>
            <label className="block text-sm">
              <span className="text-brand-navy/80">{t("phone")}</span>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={fieldClass}
                autoComplete="tel"
              />
            </label>
          </div>
        </section>

        <section className="panel-luxury p-6">
          <h2 className="font-serif text-xl text-brand-navy">{t("shippingTitle")}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-2">
              <span className="text-brand-navy/80">{t("addressLine1")}</span>
              <input
                required
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                className={fieldClass}
                autoComplete="address-line1"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="text-brand-navy/80">{t("addressLine2")}</span>
              <input
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                className={fieldClass}
                autoComplete="address-line2"
              />
            </label>
            <label className="block text-sm">
              <span className="text-brand-navy/80">{t("city")}</span>
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={fieldClass}
                autoComplete="address-level2"
              />
            </label>
            <label className="block text-sm">
              <span className="text-brand-navy/80">{t("state")}</span>
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                className={fieldClass}
                autoComplete="address-level1"
              />
            </label>
            <label className="block text-sm">
              <span className="text-brand-navy/80">{t("postalCode")}</span>
              <input
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className={fieldClass}
                autoComplete="postal-code"
              />
            </label>
            <label className="block text-sm">
              <span className="text-brand-navy/80">{t("country")}</span>
              <input
                required
                value={country}
                onChange={(e) => setCountry(e.target.value.toUpperCase())}
                className={fieldClass}
                autoComplete="country"
                maxLength={2}
                placeholder="GR"
              />
            </label>
          </div>
        </section>

        <section className="panel-luxury p-6">
          <h2 className="font-serif text-xl text-brand-navy">{t("shippingMethodTitle")}</h2>
          <p className="mt-2 text-sm text-brand-charcoal/60">
            {t("shippingMethodDescription")}
          </p>

          {!canQuoteShipping && (
            <p className="mt-5 text-sm text-brand-charcoal/55">
              {t("shippingEnterAddress")}
            </p>
          )}

          {canQuoteShipping && shippingLoading && (
            <p className="mt-5 text-sm text-brand-charcoal/55">
              {t("shippingCalculating")}
            </p>
          )}

          {canQuoteShipping && shippingError && !shippingLoading && (
            <p className="mt-5 rounded-sm border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
              {shippingError}
            </p>
          )}

          {canQuoteShipping && !shippingLoading && shippingOptions.length > 0 && (
            <fieldset className="mt-5 space-y-3">
              <legend className="sr-only">{t("shippingMethodTitle")}</legend>
              {shippingOptions.map((option) => {
                const delivery = formatDeliveryHint(option);
                const checked = selectedProductCode === option.productCode;
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-start justify-between gap-4 rounded-sm border px-4 py-3 transition-colors ${
                      checked
                        ? "border-brand-navy bg-brand-cream/60"
                        : "border-brand-gold/25 hover:border-brand-gold/50"
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        className="mt-1"
                        checked={checked}
                        onChange={() => setSelectedProductCode(option.productCode)}
                        value={option.productCode}
                      />
                      <span>
                        <span className="block text-sm text-brand-navy">
                          {option.productName}
                        </span>
                        {delivery && (
                          <span className="mt-0.5 block text-xs text-brand-charcoal/55">
                            {t("shippingEta", { date: delivery })}
                          </span>
                        )}
                      </span>
                    </span>
                    <span className="shrink-0 font-serif text-sm text-brand-navy">
                      {formatPrice(option.price)}
                    </span>
                  </label>
                );
              })}
              {shippingSource === "fallback" && (
                <p className="text-xs text-brand-charcoal/50">
                  {t("shippingFallbackNote")}
                </p>
              )}
            </fieldset>
          )}
        </section>
      </div>

      <aside className="panel-luxury p-6 lg:sticky lg:top-24">
        <h2 className="text-xs font-medium tracking-[0.2em] text-brand-gold uppercase">
          {t("orderSummary")}
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-brand-charcoal/70">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3">
              <span className="truncate">
                {item.name}
                {item.type === "product" && item.quantity > 1
                  ? ` × ${item.quantity}`
                  : ""}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-2 border-t border-brand-gold/25 pt-4 text-sm">
          <div className="flex items-center justify-between text-brand-charcoal/70">
            <span>{tCommon("subtotal")}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-brand-charcoal/70">
            <span>{t("shippingLine")}</span>
            <span>
              {selectedShipping
                ? formatPrice(shippingTotal)
                : shippingLoading
                  ? "…"
                  : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 font-serif text-brand-navy">
            <span>{tCommon("total")}</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-brand-charcoal/55">
          {t("vivaNote")}
        </p>

        {error && (
          <p className="mt-4 rounded-sm border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="gold"
          size="lg"
          className="mt-6 w-full"
          disabled={isSubmitting || !selectedProductCode || shippingLoading}
        >
          {isSubmitting ? t("redirecting") : t("payWithViva")}
        </Button>
      </aside>
    </form>
  );
}
