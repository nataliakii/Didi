"use client";

import { AppointmentTypeSelect } from "@/components/appointment/AppointmentTypeSelect";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Locale } from "@/constants/i18n";
import type { AppointmentType } from "@/constants/order-status";
import { useRouter } from "@/i18n/routing";
import {
  appointmentFormSchema,
  type AppointmentFormInput,
} from "@/validation/appointment.schema";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

interface AppointmentFormProps {
  defaultValues?: Partial<AppointmentFormInput>;
  suggestedType?: AppointmentType;
}

const TIME_OPTIONS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export function AppointmentForm({
  defaultValues,
  suggestedType,
}: AppointmentFormProps) {
  const t = useTranslations("appointment.form");
  const tErrors = useTranslations("appointment.errors");
  const locale = useLocale() as Locale;
  const router = useRouter();

  const [form, setForm] = useState<AppointmentFormInput>({
    name: defaultValues?.name ?? "",
    email: defaultValues?.email ?? "",
    phone: defaultValues?.phone ?? "",
    appointmentType:
      defaultValues?.appointmentType ??
      suggestedType ??
      ("engagement-ring-consultation" as AppointmentType),
    preferredDate: defaultValues?.preferredDate ?? "",
    preferredTime: defaultValues?.preferredTime ?? "",
    budget: defaultValues?.budget ?? "",
    message: defaultValues?.message ?? "",
    productId: defaultValues?.productId,
    settingId: defaultValues?.settingId,
    diamondId: defaultValues?.diamondId,
    metal: defaultValues?.metal,
    ringSize: defaultValues?.ringSize,
    locale,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof AppointmentFormInput>(
    key: K,
    value: AppointmentFormInput[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitError(null);

    const payload = { ...form, locale };
    const parsed = appointmentFormSchema.safeParse(payload);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const [key, messages] of Object.entries(
        parsed.error.flatten().fieldErrors,
      )) {
        if (messages?.[0]) errors[key] = messages[0];
      }
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = (await response.json()) as {
        error?: string;
        appointmentId?: string;
      };

      if (!response.ok) {
        setSubmitError(data.error ?? tErrors("submitFailed"));
        return;
      }

      router.push("/appointment/success");
    } catch {
      setSubmitError(tErrors("submitFailedRetry"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        id="name"
        label={t("name")}
        value={form.name}
        onChange={(event) => updateField("name", event.target.value)}
        autoComplete="name"
        required
      />
      {fieldErrors.name && (
        <p className="-mt-3 text-sm text-red-600">{fieldErrors.name}</p>
      )}

      <Input
        id="email"
        label={t("email")}
        type="email"
        value={form.email}
        onChange={(event) => updateField("email", event.target.value)}
        autoComplete="email"
        required
      />
      {fieldErrors.email && (
        <p className="-mt-3 text-sm text-red-600">{fieldErrors.email}</p>
      )}

      <Input
        id="phone"
        label={t("phone")}
        type="tel"
        value={form.phone}
        onChange={(event) => updateField("phone", event.target.value)}
        autoComplete="tel"
        required
      />
      {fieldErrors.phone && (
        <p className="-mt-3 text-sm text-red-600">{fieldErrors.phone}</p>
      )}

      <AppointmentTypeSelect
        value={form.appointmentType}
        onChange={(value) =>
          updateField("appointmentType", value as AppointmentType)
        }
        error={fieldErrors.appointmentType}
      />

      <Input
        id="preferredDate"
        label={t("preferredDate")}
        type="date"
        value={form.preferredDate}
        onChange={(event) => updateField("preferredDate", event.target.value)}
        required
      />
      {fieldErrors.preferredDate && (
        <p className="-mt-3 text-sm text-red-600">{fieldErrors.preferredDate}</p>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="preferredTime"
          className="text-xs font-medium tracking-[0.15em] text-brand-navy/70 uppercase"
        >
          {t("preferredTime")}
        </label>
        <select
          id="preferredTime"
          value={form.preferredTime}
          onChange={(event) => updateField("preferredTime", event.target.value)}
          className="w-full rounded-sm border border-brand-gold/30 bg-white px-3 py-2.5 text-sm text-brand-charcoal focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/50"
          required
        >
          <option value="">{t("preferredTimePlaceholder")}</option>
          {TIME_OPTIONS.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        {fieldErrors.preferredTime && (
          <p className="text-sm text-red-600">{fieldErrors.preferredTime}</p>
        )}
      </div>

      <Input
        id="budget"
        label={t("budget")}
        value={form.budget ?? ""}
        onChange={(event) => updateField("budget", event.target.value)}
        placeholder={t("budgetPlaceholder")}
      />

      <div className="space-y-1.5">
        <label
          htmlFor="message"
          className="text-xs font-medium tracking-[0.15em] text-brand-navy/70 uppercase"
        >
          {t("message")}
        </label>
        <textarea
          id="message"
          value={form.message ?? ""}
          onChange={(event) => updateField("message", event.target.value)}
          rows={4}
          className="w-full rounded-sm border border-brand-gold/30 bg-white px-3 py-2.5 text-sm text-brand-charcoal focus:border-brand-gold focus:outline-none focus:ring-1 focus:ring-brand-gold/50"
          placeholder={t("messagePlaceholder")}
        />
        {fieldErrors.message && (
          <p className="text-sm text-red-600">{fieldErrors.message}</p>
        )}
      </div>

      {submitError && (
        <p className="rounded-sm border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
