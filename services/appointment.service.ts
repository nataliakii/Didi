import type { Metal } from "@/constants/jewellery";
import type { CertificationLab } from "@/constants/certification";
import { getPrimaryImageUrl } from "@/lib/cart";
import { safeConnectDB } from "@/lib/db";
import { getParam, type SearchParamValue } from "@/lib/searchParams";
import {
  calculateCustomRingPrice,
  getAvailableRingSizes,
  isDiamondCompatibleWithSetting,
  isMetalAvailableForSetting,
} from "@/lib/ring-builder";
import { Appointment } from "@/models/Appointment";
import { getDiamondById } from "@/services/diamond.service";
import { getProductById } from "@/services/product.service";
import { getRingSettingById } from "@/services/ring-setting.service";
import type { AppointmentSummary } from "@/types";
import type {
  AppointmentContext,
  AppointmentCustomRingSnapshot,
  AppointmentDiamondSnapshot,
  AppointmentProductSnapshot,
  AppointmentSettingSnapshot,
  CreateAppointmentInput,
  CreateAppointmentResult,
} from "@/types/appointment";
import mongoose from "mongoose";

function toAppointmentSummary(appointment: {
  _id: { toString(): string };
  name: string;
  email: string;
  appointmentType: string;
  preferredDate: Date;
  status: string;
  createdAt: Date;
}): AppointmentSummary {
  return {
    _id: appointment._id.toString(),
    name: appointment.name,
    email: appointment.email,
    appointmentType:
      appointment.appointmentType as AppointmentSummary["appointmentType"],
    preferredDate: appointment.preferredDate.toISOString(),
    status: appointment.status as AppointmentSummary["status"],
    createdAt: appointment.createdAt.toISOString(),
  };
}

function toProductSnapshot(product: {
  _id: string;
  name: string;
  slug: string;
  productType?: string;
  basePrice: number;
  salePrice?: number;
  images?: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
}): AppointmentProductSnapshot {
  return {
    id: product._id,
    name: product.name,
    slug: product.slug,
    productType: product.productType,
    basePrice: product.basePrice,
    salePrice: product.salePrice,
    image: getPrimaryImageUrl(product.images),
  };
}

function toSettingSnapshot(setting: {
  _id: string;
  name: string;
  style?: string;
  basePrice: number;
  images?: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
}): AppointmentSettingSnapshot {
  return {
    id: setting._id,
    name: setting.name,
    style: setting.style,
    basePrice: setting.basePrice,
    image: getPrimaryImageUrl(setting.images),
  };
}

function toDiamondSnapshot(diamond: {
  _id: string;
  diamondType?: string;
  shape: string;
  carat: number;
  cut?: string;
  color?: string;
  clarity?: string;
  price: number;
  salePrice?: number;
  certification?: {
    lab?: string;
    reportNumber?: string;
    reportUrl?: string;
    certificateFileUrl?: string;
  };
}): AppointmentDiamondSnapshot {
  return {
    id: diamond._id,
    diamondType: diamond.diamondType,
    shape: diamond.shape,
    carat: diamond.carat,
    cut: diamond.cut,
    color: diamond.color,
    clarity: diamond.clarity,
    price: diamond.salePrice ?? diamond.price,
    certification: diamond.certification
      ? {
          lab: diamond.certification.lab as CertificationLab | undefined,
          reportNumber: diamond.certification.reportNumber,
          reportUrl: diamond.certification.reportUrl,
          certificateFileUrl: diamond.certification.certificateFileUrl,
        }
      : undefined,
  };
}

export async function getAppointmentContextFromParams(
  raw: Record<string, SearchParamValue>,
): Promise<AppointmentContext> {
  const productId = getParam(raw, "productId") ?? getParam(raw, "product");
  const settingId = getParam(raw, "settingId");
  const diamondId = getParam(raw, "diamondId");
  const metal = getParam(raw, "metal");
  const ringSize = getParam(raw, "ringSize");

  const context: AppointmentContext = {};

  if (productId) {
    const product = await getProductById(productId);
    if (product) {
      context.product = toProductSnapshot({
        _id: product._id,
        name: product.name,
        slug: product.slug,
        productType: product.productType,
        basePrice: product.basePrice,
        salePrice: product.salePrice,
        images: product.images,
      });
    } else {
      context.warningKey = "itemNotFound";
    }
  }

  if (settingId && diamondId) {
    const [setting, diamond] = await Promise.all([
      getRingSettingById(settingId),
      getDiamondById(diamondId),
    ]);

    if (!setting || !diamond) {
      context.warningKey = "itemNotFound";
      return context;
    }

    if (!isDiamondCompatibleWithSetting(setting, diamond)) {
      context.warningKey = "incompatibleSelection";
      return context;
    }

    const selectedMetal =
      metal && isMetalAvailableForSetting(setting, metal as Metal)
        ? (metal as Metal)
        : undefined;

    const priceBreakdown = calculateCustomRingPrice(
      setting,
      diamond,
      selectedMetal,
    );

    context.customRing = {
      setting: toSettingSnapshot({
        _id: setting._id,
        name: setting.name,
        style: setting.style,
        basePrice: setting.basePrice,
        images: setting.images,
      }),
      diamond: toDiamondSnapshot({
        _id: diamond._id,
        diamondType: diamond.diamondType,
        shape: diamond.shape,
        carat: diamond.carat,
        cut: diamond.cut,
        color: diamond.color,
        clarity: diamond.clarity,
        price: diamond.price,
        salePrice: diamond.salePrice,
        certification: diamond.certification,
      }),
      selectedMetal: selectedMetal ?? "",
      ringSize: ringSize ?? "",
      estimatedPrice: priceBreakdown.finalPrice,
    };
  }

  return context;
}

export interface AppointmentSnapshotData {
  productSnapshot?: AppointmentProductSnapshot;
  settingSnapshot?: AppointmentSettingSnapshot;
  diamondSnapshot?: AppointmentDiamondSnapshot;
  customRingSnapshot?: AppointmentCustomRingSnapshot;
  estimatedPrice?: number;
  selectedMetal?: Metal;
  ringSize?: string;
}

export async function createAppointmentSnapshots(
  input: CreateAppointmentInput,
): Promise<
  | { success: true; data: AppointmentSnapshotData }
  | { success: false; error: string; status: 400 }
> {
  const data: AppointmentSnapshotData = {};

  if (input.productId) {
    const product = await getProductById(input.productId);
    if (!product) {
      return {
        success: false,
        error: "The selected product could not be found.",
        status: 400,
      };
    }

    data.productSnapshot = toProductSnapshot({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      productType: product.productType,
      basePrice: product.basePrice,
      salePrice: product.salePrice,
      images: product.images,
    });
  }

  if (input.settingId && input.diamondId) {
    const [setting, diamond] = await Promise.all([
      getRingSettingById(input.settingId),
      getDiamondById(input.diamondId),
    ]);

    if (!setting || !diamond) {
      return {
        success: false,
        error: "The selected setting or diamond could not be found.",
        status: 400,
      };
    }

    if (!isDiamondCompatibleWithSetting(setting, diamond)) {
      return {
        success: false,
        error: "The selected setting and diamond are not compatible.",
        status: 400,
      };
    }

    if (input.metal && !isMetalAvailableForSetting(setting, input.metal as Metal)) {
      return {
        success: false,
        error: "The selected metal is not available for this setting.",
        status: 400,
      };
    }

    if (input.ringSize) {
      const availableSizes = getAvailableRingSizes(setting);
      if (!availableSizes.includes(input.ringSize)) {
        return {
          success: false,
          error: "The selected ring size is not available for this setting.",
          status: 400,
        };
      }
    }

    const selectedMetal = input.metal as Metal | undefined;
    const priceBreakdown = calculateCustomRingPrice(
      setting,
      diamond,
      selectedMetal,
    );

    const settingSnapshot = toSettingSnapshot({
      _id: setting._id,
      name: setting.name,
      style: setting.style,
      basePrice: setting.basePrice,
      images: setting.images,
    });

    const diamondSnapshot = toDiamondSnapshot({
      _id: diamond._id,
      diamondType: diamond.diamondType,
      shape: diamond.shape,
      carat: diamond.carat,
      cut: diamond.cut,
      color: diamond.color,
      clarity: diamond.clarity,
      price: diamond.price,
      salePrice: diamond.salePrice,
      certification: diamond.certification,
    });

    data.settingSnapshot = settingSnapshot;
    data.diamondSnapshot = diamondSnapshot;
    data.estimatedPrice = priceBreakdown.finalPrice;

    if (selectedMetal) data.selectedMetal = selectedMetal;
    if (input.ringSize) data.ringSize = input.ringSize;

    if (selectedMetal && input.ringSize) {
      data.customRingSnapshot = {
        settingId: setting._id,
        diamondId: diamond._id,
        selectedMetal,
        ringSize: input.ringSize,
        estimatedPrice: priceBreakdown.finalPrice,
        setting: settingSnapshot,
        diamond: diamondSnapshot,
      };
    }
  }

  return { success: true, data };
}

export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<
  | { success: true; data: CreateAppointmentResult }
  | { success: false; error: string; status: 400 | 503 }
> {
  const db = await safeConnectDB();
  if (!db) {
    return {
      success: false,
      error:
        "Appointments are temporarily unavailable. Please try again later or contact us directly.",
      status: 503,
    };
  }

  const snapshotResult = await createAppointmentSnapshots(input);
  if (!snapshotResult.success) {
    return {
      success: false,
      error: snapshotResult.error,
      status: snapshotResult.status,
    };
  }

  const snapshots = snapshotResult.data;

  try {
    const appointment = await Appointment.create({
      name: input.name,
      email: input.email,
      phone: input.phone,
      appointmentType: input.appointmentType,
      preferredDate: new Date(input.preferredDate),
      preferredTime: input.preferredTime,
      budget: input.budget || undefined,
      message: input.message || undefined,
      status: "requested",
      locale: input.locale || undefined,
      productId:
        input.productId && mongoose.Types.ObjectId.isValid(input.productId)
          ? input.productId
          : undefined,
      settingId:
        input.settingId && mongoose.Types.ObjectId.isValid(input.settingId)
          ? input.settingId
          : undefined,
      diamondId:
        input.diamondId && mongoose.Types.ObjectId.isValid(input.diamondId)
          ? input.diamondId
          : undefined,
      selectedMetal: snapshots.selectedMetal,
      ringSize: snapshots.ringSize,
      estimatedPrice: snapshots.estimatedPrice,
      productSnapshot: snapshots.productSnapshot,
      settingSnapshot: snapshots.settingSnapshot,
      diamondSnapshot: snapshots.diamondSnapshot,
      customRingSnapshot: snapshots.customRingSnapshot,
    });

    return {
      success: true,
      data: { appointmentId: appointment._id.toString() },
    };
  } catch (error) {
    console.error("createAppointment error:", error);
    return {
      success: false,
      error: "Could not save your appointment request. Please try again.",
      status: 503,
    };
  }
}

export async function getPendingAppointmentsCount(): Promise<number> {
  const db = await safeConnectDB();
  if (!db) return 0;

  try {
    return await Appointment.countDocuments({ status: "requested" });
  } catch (error) {
    console.error("getPendingAppointmentsCount error:", error);
    return 0;
  }
}

export async function getRecentAppointments(
  limit = 5,
): Promise<AppointmentSummary[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const appointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return appointments.map((appointment) => {
      const doc = appointment as unknown as {
        _id: { toString(): string };
        name: string;
        email: string;
        appointmentType: string;
        preferredDate: Date;
        status: string;
        createdAt: Date;
      };
      return toAppointmentSummary(doc);
    });
  } catch (error) {
    console.error("getRecentAppointments error:", error);
    return [];
  }
}
