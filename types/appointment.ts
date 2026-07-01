import type { CertificationLab } from "@/constants/certification";
import type { AppointmentType } from "@/constants/order-status";

export interface AppointmentProductSnapshot {
  id: string;
  name: string;
  slug: string;
  productType?: string;
  basePrice: number;
  salePrice?: number;
  image?: string;
}

export interface AppointmentSettingSnapshot {
  id: string;
  name: string;
  style?: string;
  basePrice: number;
  image?: string;
}

export interface AppointmentDiamondSnapshot {
  id: string;
  diamondType?: string;
  shape: string;
  carat: number;
  cut?: string;
  color?: string;
  clarity?: string;
  price: number;
  certification?: {
    lab?: CertificationLab;
    reportNumber?: string;
    reportUrl?: string;
    certificateFileUrl?: string;
  };
}

export interface AppointmentCustomRingSnapshot {
  settingId: string;
  diamondId: string;
  selectedMetal: string;
  ringSize: string;
  estimatedPrice: number;
  setting: AppointmentSettingSnapshot;
  diamond: AppointmentDiamondSnapshot;
}

export type AppointmentWarningKey = "itemNotFound" | "incompatibleSelection";

export interface AppointmentContext {
  product?: AppointmentProductSnapshot;
  customRing?: {
    setting: AppointmentSettingSnapshot;
    diamond: AppointmentDiamondSnapshot;
    selectedMetal: string;
    ringSize: string;
    estimatedPrice: number;
  };
  warningKey?: AppointmentWarningKey;
}

export interface CreateAppointmentInput {
  name: string;
  email: string;
  phone: string;
  appointmentType: AppointmentType;
  preferredDate: string;
  preferredTime: string;
  budget?: string;
  message?: string;
  productId?: string;
  settingId?: string;
  diamondId?: string;
  metal?: string;
  ringSize?: string;
  locale?: string;
}

export interface CreateAppointmentResult {
  appointmentId: string;
}
