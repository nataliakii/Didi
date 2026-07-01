"use client";

import { CompatibilityNotice } from "@/components/ring-builder/CompatibilityNotice";
import { CustomRingAppointmentSummary } from "@/components/appointment/CustomRingAppointmentSummary";
import { ProductAppointmentSummary } from "@/components/appointment/ProductAppointmentSummary";
import type { AppointmentContext } from "@/types/appointment";
import { useTranslations } from "next-intl";

interface AppointmentContextSummaryProps {
  context: AppointmentContext;
}

export function AppointmentContextSummary({
  context,
}: AppointmentContextSummaryProps) {
  const t = useTranslations("appointment.context");

  if (!context.product && !context.customRing && !context.warningKey) {
    return null;
  }

  return (
    <div className="space-y-4">
      {context.warningKey && (
        <CompatibilityNotice variant="warning">
          {t(context.warningKey)}
        </CompatibilityNotice>
      )}
      {context.product && <ProductAppointmentSummary product={context.product} />}
      {context.customRing && (
        <CustomRingAppointmentSummary customRing={context.customRing} />
      )}
    </div>
  );
}
