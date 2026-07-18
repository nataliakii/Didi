import type {
  DiamondShape,
  Metal,
  ProductStatus,
  RingStyle,
} from "@/constants/jewellery";
import { safeConnectDB } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { RingSetting } from "@/models/RingSetting";
import type { RingSettingAdminInput } from "@/validation/admin/ring-setting.schema";
import mongoose from "mongoose";

export type AdminRingSettingSummary = {
  _id: string;
  name: string;
  slug: string;
  style: RingStyle;
  basePrice: number;
  description?: string;
  availableMetals: Metal[];
  compatibleDiamondShapes: DiamondShape[];
  minRingSize: string;
  maxRingSize: string;
  productionTime?: string;
  status: ProductStatus;
  isFeatured: boolean;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
};

function resolveSlug(name: string, slug?: string): string {
  const value = slug?.trim() || slugify(name);
  return value || slugify(name);
}

function toAdminRingSettingSummary(setting: {
  _id: { toString(): string };
  name: string;
  slug: string;
  style: string;
  basePrice: number;
  description?: string;
  availableMetals?: string[];
  compatibleDiamondShapes?: string[];
  minRingSize: string;
  maxRingSize: string;
  productionTime?: string;
  status: string;
  isFeatured: boolean;
  images?: Array<{ url: string; isPrimary?: boolean }>;
  videoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}): AdminRingSettingSummary {
  const primaryImage =
    setting.images?.find((img) => img.isPrimary)?.url ??
    setting.images?.[0]?.url;

  return {
    _id: setting._id.toString(),
    name: setting.name,
    slug: setting.slug,
    style: setting.style as RingStyle,
    basePrice: setting.basePrice,
    description: setting.description,
    availableMetals: (setting.availableMetals ?? []) as Metal[],
    compatibleDiamondShapes: (setting.compatibleDiamondShapes ??
      []) as DiamondShape[],
    minRingSize: setting.minRingSize,
    maxRingSize: setting.maxRingSize,
    productionTime: setting.productionTime,
    status: setting.status as ProductStatus,
    isFeatured: setting.isFeatured,
    imageUrl: primaryImage,
    videoUrl: setting.videoUrl,
    createdAt: setting.createdAt.toISOString(),
    updatedAt: setting.updatedAt.toISOString(),
  };
}

function toRingSettingFields(input: RingSettingAdminInput) {
  const images = input.imageUrl?.trim()
    ? [{ url: input.imageUrl.trim(), isPrimary: true }]
    : [];

  return {
    name: input.name.trim(),
    slug: resolveSlug(input.name, input.slug),
    style: input.style,
    basePrice: input.basePrice,
    description: input.description?.trim() || undefined,
    availableMetals: input.availableMetals,
    compatibleDiamondShapes: input.compatibleDiamondShapes,
    minRingSize: input.minRingSize,
    maxRingSize: input.maxRingSize,
    productionTime: input.productionTime?.trim() || undefined,
    status: input.status,
    isFeatured: input.isFeatured,
    videoUrl: input.videoUrl?.trim() || undefined,
    ...(images.length ? { images } : {}),
  };
}

export async function getAdminRingSettings(): Promise<AdminRingSettingSummary[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const settings = await RingSetting.find().sort({ updatedAt: -1 }).lean();
    return settings.map((setting) =>
      toAdminRingSettingSummary(
        setting as unknown as Parameters<typeof toAdminRingSettingSummary>[0],
      ),
    );
  } catch (error) {
    console.error("getAdminRingSettings error:", error);
    return [];
  }
}

export async function getAdminRingSettingById(
  id: string,
): Promise<AdminRingSettingSummary | null> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(id)) return null;

  try {
    const setting = await RingSetting.findById(id).lean();
    if (!setting) return null;
    return toAdminRingSettingSummary(
      setting as unknown as Parameters<typeof toAdminRingSettingSummary>[0],
    );
  } catch (error) {
    console.error("getAdminRingSettingById error:", error);
    return null;
  }
}

export async function createAdminRingSetting(
  input: RingSettingAdminInput,
): Promise<string | null> {
  const db = await safeConnectDB();
  if (!db) return null;

  try {
    const setting = await RingSetting.create(toRingSettingFields(input));
    return setting._id.toString();
  } catch (error) {
    console.error("createAdminRingSetting error:", error);
    return null;
  }
}

export async function updateAdminRingSetting(
  id: string,
  input: RingSettingAdminInput,
): Promise<boolean> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(id)) return false;

  try {
    const result = await RingSetting.findByIdAndUpdate(
      id,
      { $set: toRingSettingFields(input) },
      { runValidators: true },
    );
    return Boolean(result);
  } catch (error) {
    console.error("updateAdminRingSetting error:", error);
    return false;
  }
}

export async function deleteAdminRingSetting(id: string): Promise<boolean> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(id)) return false;

  try {
    const result = await RingSetting.findByIdAndDelete(id);
    return Boolean(result);
  } catch (error) {
    console.error("deleteAdminRingSetting error:", error);
    return false;
  }
}
