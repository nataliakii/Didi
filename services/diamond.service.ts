import {
  AVAILABILITY_STATUSES,
  DIAMOND_CLARITY,
  DIAMOND_COLORS,
  DIAMOND_CUTS,
  DIAMOND_SHAPES,
  DIAMOND_TYPES,
} from "@/constants/jewellery";
import {
  CERTIFICATION_LABS,
  type CertificationLab,
} from "@/constants/certification";
import { safeConnectDB } from "@/lib/db";
import { getParam, type SearchParamValue } from "@/lib/searchParams";
import { Diamond } from "@/models/Diamond";
import type {
  DiamondCertification,
  DiamondDetail,
  DiamondFilters,
  DiamondSortOption,
  DiamondSummary,
  PaginatedResult,
} from "@/types";
import mongoose, { type FilterQuery, type SortOrder } from "mongoose";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 48;

const DIAMOND_SORT_OPTIONS: DiamondSortOption[] = [
  "newest",
  "price-asc",
  "price-desc",
  "carat-asc",
  "carat-desc",
];

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

function isCertificationLab(value: string | undefined): value is CertificationLab {
  return Boolean(value && CERTIFICATION_LABS.includes(value as CertificationLab));
}

function toCertification(
  certification?: {
    lab?: string;
    reportNumber?: string;
    reportUrl?: string;
    certificateFileUrl?: string;
  } | null,
): DiamondCertification | undefined {
  if (!certification) return undefined;

  const hasData = Boolean(
    certification.lab ||
      certification.reportNumber ||
      certification.reportUrl ||
      certification.certificateFileUrl,
  );

  if (!hasData) return undefined;

  return {
    lab: isCertificationLab(certification.lab) ? certification.lab : undefined,
    reportNumber: certification.reportNumber,
    reportUrl: certification.reportUrl,
    certificateFileUrl: certification.certificateFileUrl,
  };
}

function toDiamondSummary(diamond: {
  _id: { toString(): string };
  diamondType: string;
  shape: string;
  carat: number;
  cut: string;
  color: string;
  clarity: string;
  price: number;
  salePrice?: number;
  certification?: Parameters<typeof toCertification>[0];
  availabilityStatus: string;
  images?: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
}): DiamondSummary {
  return {
    _id: diamond._id.toString(),
    diamondType: diamond.diamondType as DiamondSummary["diamondType"],
    shape: diamond.shape as DiamondSummary["shape"],
    carat: diamond.carat,
    cut: diamond.cut as DiamondSummary["cut"],
    color: diamond.color as DiamondSummary["color"],
    clarity: diamond.clarity as DiamondSummary["clarity"],
    price: diamond.price,
    salePrice: diamond.salePrice,
    certification: toCertification(diamond.certification),
    availabilityStatus:
      diamond.availabilityStatus as DiamondSummary["availabilityStatus"],
    images: diamond.images ?? [],
  };
}

function toDiamondDetail(diamond: {
  _id: { toString(): string };
  diamondType: string;
  shape: string;
  carat: number;
  cut: string;
  color: string;
  clarity: string;
  price: number;
  salePrice?: number;
  certification?: Parameters<typeof toCertification>[0];
  polish?: string;
  symmetry?: string;
  fluorescence?: string;
  availabilityStatus: string;
  images?: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
}): DiamondDetail {
  return {
    ...toDiamondSummary(diamond),
    polish: diamond.polish,
    symmetry: diamond.symmetry,
    fluorescence: diamond.fluorescence,
  };
}

export function parseDiamondFilters(
  raw: Record<string, SearchParamValue>,
): DiamondFilters {
  const diamondTypeRaw = getParam(raw, "diamondType");
  const shapeRaw = getParam(raw, "shape");
  const cutRaw = getParam(raw, "cut");
  const colorRaw = getParam(raw, "color");
  const clarityRaw = getParam(raw, "clarity");
  const certificationLabRaw =
    getParam(raw, "certificationLab") ?? getParam(raw, "certificateLab");
  const availabilityRaw = getParam(raw, "availabilityStatus");
  const sortRaw = getParam(raw, "sort");

  const page = Math.max(1, parseNumber(getParam(raw, "page")) ?? 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseNumber(getParam(raw, "limit")) ?? DEFAULT_LIMIT),
  );

  return {
    diamondType: isEnumValue(diamondTypeRaw, DIAMOND_TYPES)
      ? diamondTypeRaw
      : undefined,
    shape: isEnumValue(shapeRaw, DIAMOND_SHAPES) ? shapeRaw : undefined,
    minCarat: parseNumber(getParam(raw, "minCarat")),
    maxCarat: parseNumber(getParam(raw, "maxCarat")),
    minPrice: parseNumber(getParam(raw, "minPrice")),
    maxPrice: parseNumber(getParam(raw, "maxPrice")),
    cut: isEnumValue(cutRaw, DIAMOND_CUTS) ? cutRaw : undefined,
    color: isEnumValue(colorRaw, DIAMOND_COLORS) ? colorRaw : undefined,
    clarity: isEnumValue(clarityRaw, DIAMOND_CLARITY) ? clarityRaw : undefined,
    certificationLab: isCertificationLab(certificationLabRaw)
      ? certificationLabRaw
      : undefined,
    availabilityStatus: isEnumValue(availabilityRaw, AVAILABILITY_STATUSES)
      ? availabilityRaw
      : undefined,
    sort: isEnumValue(sortRaw, DIAMOND_SORT_OPTIONS) ? sortRaw : "newest",
    page,
    limit,
  };
}

function getDiamondSort(sort: DiamondSortOption = "newest"): Record<string, SortOrder> {
  switch (sort) {
    case "price-asc":
      return { price: 1 };
    case "price-desc":
      return { price: -1 };
    case "carat-asc":
      return { carat: 1 };
    case "carat-desc":
      return { carat: -1 };
    case "newest":
    default:
      return { createdAt: -1 };
  }
}

function buildDiamondQuery(filters: DiamondFilters): FilterQuery<typeof Diamond> {
  const query: FilterQuery<typeof Diamond> = { isActive: true };

  if (filters.diamondType) query.diamondType = filters.diamondType;
  if (filters.shape) {
    query.shape = filters.shape;
  } else if (filters.compatibleShapes && filters.compatibleShapes.length > 0) {
    query.shape = { $in: filters.compatibleShapes };
  }
  if (filters.cut) query.cut = filters.cut;
  if (filters.color) query.color = filters.color;
  if (filters.clarity) query.clarity = filters.clarity;
  if (filters.certificationLab) {
    query["certification.lab"] = filters.certificationLab;
  }
  if (filters.availabilityStatus) {
    query.availabilityStatus = filters.availabilityStatus;
  }

  if (filters.minCarat !== undefined || filters.maxCarat !== undefined) {
    query.carat = {};
    if (filters.minCarat !== undefined) query.carat.$gte = filters.minCarat;
    if (filters.maxCarat !== undefined) query.carat.$lte = filters.maxCarat;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
    if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
  }

  return query;
}

export async function getDiamonds(
  filters: DiamondFilters,
): Promise<PaginatedResult<DiamondSummary>> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? DEFAULT_LIMIT;

  const db = await safeConnectDB();
  if (!db) {
    return { items: [], total: 0, page, totalPages: 0 };
  }

  try {
    const query = buildDiamondQuery(filters);
    const skip = (page - 1) * limit;

    const [diamonds, total] = await Promise.all([
      Diamond.find(query)
        .sort(getDiamondSort(filters.sort))
        .skip(skip)
        .limit(limit)
        .lean(),
      Diamond.countDocuments(query),
    ]);

    return {
      items: diamonds.map((diamond) =>
        toDiamondSummary(diamond as unknown as Parameters<typeof toDiamondSummary>[0]),
      ),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("getDiamonds error:", error);
    return { items: [], total: 0, page, totalPages: 0 };
  }
}

export async function getDiamondById(id: string): Promise<DiamondDetail | null> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(id)) return null;

  try {
    const diamond = await Diamond.findOne({ _id: id, isActive: true }).lean();
    if (!diamond) return null;

    return toDiamondDetail(diamond as unknown as Parameters<typeof toDiamondDetail>[0]);
  } catch (error) {
    console.error("getDiamondById error:", error);
    return null;
  }
}

export async function getFeaturedDiamonds(
  limit = 4,
): Promise<DiamondSummary[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const diamonds = await Diamond.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return diamonds.map((diamond) =>
      toDiamondSummary(diamond as unknown as Parameters<typeof toDiamondSummary>[0]),
    );
  } catch (error) {
    console.error("getFeaturedDiamonds error:", error);
    return [];
  }
}

export async function getDiamondsCount(): Promise<number> {
  const db = await safeConnectDB();
  if (!db) return 0;

  try {
    return await Diamond.countDocuments({ isActive: true });
  } catch (error) {
    console.error("getDiamondsCount error:", error);
    return 0;
  }
}

export async function getActiveDiamondIds(): Promise<string[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const diamonds = await Diamond.find({ isActive: true }).select("_id").lean();
    return diamonds.map((diamond) => String(diamond._id));
  } catch (error) {
    console.error("getActiveDiamondIds error:", error);
    return [];
  }
}
