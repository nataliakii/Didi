"use client";

import { APPOINTMENT_TYPES } from "@/constants/order-status";
import { Select } from "@/components/ui/Select";
import { useTranslations } from "next-intl";

interface AppointmentTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function AppointmentTypeSelect({
  value,
  onChange,
  error,
}: AppointmentTypeSelectProps) {
  const t = useTranslations("appointment.form");
  const tTypes = useTranslations("appointment.types");

  return (
    <div>
      <Select
        id="appointmentType"
        label={t("appointmentType")}
        value={value}
        placeholder={t("appointmentTypePlaceholder")}
        options={APPOINTMENT_TYPES.map((type) => ({
          value: type,
          label: tTypes(type),
        }))}
        onChange={onChange}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
