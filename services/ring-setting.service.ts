import {
  DIAMOND_SHAPES,
  METALS,
  RING_STYLES,
} from "@/constants/jewellery";
import { safeConnectDB } from "@/lib/db";
import { getParam, type SearchParamValue } from "@/lib/searchParams";
import { RingSetting } from "@/models/RingSetting";
import type {
  PaginatedResult,
  RingSettingDetail,
  RingSettingFilters,
  RingSettingSummary,
} from "@/types";
import mongoose, { type FilterQuery, type SortOrder } from "mongoose";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 48;

function isEnumValue<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
): value is T {
  return Boolean(value && allowed.includes(value as T));
}

function parseNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? num : undefined;
}

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function toRingSettingSummary(setting: {
  _id: { toString(): string };
  name: string;
  slug: string;
  style: string;
  basePrice: number;
  description?: string;
  images?: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
  videoUrl?: string;
  availableMetals?: string[];
  compatibleDiamondShapes?: string[];
  minRingSize: string;
  maxRingSize: string;
  productionTime?: string;
  isFeatured: boolean;
}): RingSettingSummary {
  return {
    _id: setting._id.toString(),
    name: setting.name,
    slug: setting.slug,
    style: setting.style as RingSettingSummary["style"],
    basePrice: setting.basePrice,
    description: setting.description,
    images: setting.images ?? [],
    videoUrl: setting.videoUrl,
    availableMetals: (setting.availableMetals ?? []) as RingSettingSummary["availableMetals"],
    compatibleDiamondShapes: (setting.compatibleDiamondShapes ??
      []) as RingSettingSummary["compatibleDiamondShapes"],
    minRingSize: setting.minRingSize,
    maxRingSize: setting.maxRingSize,
    productionTime: setting.productionTime,
    isFeatured: setting.isFeatured,
  };
}

export function parseRingSettingFilters(
  raw: Record<string, SearchParamValue>,
): RingSettingFilters {
  const styleRaw = getParam(raw, "style");
  const metalRaw = getParam(raw, "metal");
  const compatibleShapeRaw = getParam(raw, "compatibleShape");

  const page = Math.max(1, parseNumber(getParam(raw, "page")) ?? 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseNumber(getParam(raw, "limit")) ?? DEFAULT_LIMIT),
  );

  return {
    style: isEnumValue(styleRaw, RING_STYLES) ? styleRaw : undefined,
    metal: isEnumValue(metalRaw, METALS) ? metalRaw : undefined,
    compatibleShape: isEnumValue(compatibleShapeRaw, DIAMOND_SHAPES)
      ? compatibleShapeRaw
      : undefined,
    minPrice: parseNumber(getParam(raw, "minPrice")),
    maxPrice: parseNumber(getParam(raw, "maxPrice")),
    isFeatured: parseBoolean(getParam(raw, "isFeatured")),
    status: "published",
    page,
    limit,
  };
}

function buildRingSettingQuery(
  filters: RingSettingFilters,
): FilterQuery<typeof RingSetting> {
  const query: FilterQuery<typeof RingSetting> = {
    status: filters.status ?? "published",
  };

  if (filters.style) query.style = filters.style;
  if (filters.metal) query.availableMetals = filters.metal;
  if (filters.compatibleShape) {
    query.compatibleDiamondShapes = filters.compatibleShape;
  }
  if (filters.isFeatured === true) query.isFeatured = true;

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.basePrice = {};
    if (filters.minPrice !== undefined) query.basePrice.$gte = filters.minPrice;
    if (filters.maxPrice !== undefined) query.basePrice.$lte = filters.maxPrice;
  }

  return query;
}

export async function getRingSettings(
  filters: RingSettingFilters,
): Promise<PaginatedResult<RingSettingSummary>> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? DEFAULT_LIMIT;

  const db = await safeConnectDB();
  if (!db) {
    return { items: [], total: 0, page, totalPages: 0 };
  }

  try {
    const query = buildRingSettingQuery(filters);
    const skip = (page - 1) * limit;

    const [settings, total] = await Promise.all([
      RingSetting.find(query)
        .sort({ isFeatured: -1, createdAt: -1 } as Record<string, SortOrder>)
        .skip(skip)
        .limit(limit)
        .lean(),
      RingSetting.countDocuments(query),
    ]);

    return {
      items: settings.map((setting) =>
        toRingSettingSummary(
          setting as unknown as Parameters<typeof toRingSettingSummary>[0],
        ),
      ),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("getRingSettings error:", error);
    return { items: [], total: 0, page, totalPages: 0 };
  }
}

export async function getRingSettingById(
  id: string,
): Promise<RingSettingDetail | null> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(id)) return null;

  try {
    const setting = await RingSetting.findOne({
      _id: id,
      status: "published",
    }).lean();

    if (!setting) return null;

    return toRingSettingSummary(
      setting as unknown as Parameters<typeof toRingSettingSummary>[0],
    );
  } catch (error) {
    console.error("getRingSettingById error:", error);
    return null;
  }
}

export async function getFeaturedRingSettings(
  limit = 4,
): Promise<RingSettingSummary[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const settings = await RingSetting.find({
      status: "published",
      isFeatured: true,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return settings.map((setting) =>
      toRingSettingSummary(
        setting as unknown as Parameters<typeof toRingSettingSummary>[0],
      ),
    );
  } catch (error) {
    console.error("getFeaturedRingSettings error:", error);
    return [];
  }
}
