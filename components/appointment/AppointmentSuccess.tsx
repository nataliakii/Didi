"use client";

import { useTranslations } from "next-intl";

export function AppointmentSuccess() {
  const t = useTranslations("appointment.success");

  return (
    <div className="panel-luxury p-8 text-center">
      <h2 className="font-serif text-2xl text-brand-navy">{t("title")}</h2>
      <p className="mt-4 leading-relaxed text-brand-charcoal/70">{t("message")}</p>
    </div>
  );
}
