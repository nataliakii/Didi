import {
  AVAILABILITY_STATUSES,
  CLARITY_SLIDER_GRADES,
  COLOR_SLIDER_GRADES,
  CUT_SLIDER_GRADES,
  DIAMOND_CLARITY,
  DIAMOND_COLORS,
  DIAMOND_CUTS,
  DIAMOND_FILTER_PRESETS,
  DIAMOND_SHAPES,
  DIAMOND_TYPES,
  FINISH_GRADES,
  FLUORESCENCE_SLIDER_GRADES,
} from "@/constants/jewellery";
import {
  CERTIFICATION_LABS,
  type CertificationLab,
} from "@/constants/certification";
import {
  expandCutGradesForQuery,
  gradesInRange,
} from "@/lib/diamond-grades";
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
  lengthMm?: number;
  widthMm?: number;
  depthMm?: number;
  tablePercent?: number;
  depthPercent?: number;
  lengthWidthRatio?: number;
  collections?: {
    flawless?: boolean;
    blockchain?: boolean;
    trulyBrilliant?: boolean;
  };
  availabilityStatus: string;
  images?: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
  videoUrl?: string;
}): DiamondDetail {
  return {
    ...toDiamondSummary(diamond),
    polish: diamond.polish,
    symmetry: diamond.symmetry,
    fluorescence: diamond.fluorescence,
    lengthMm: diamond.lengthMm,
    widthMm: diamond.widthMm,
    depthMm: diamond.depthMm,
    tablePercent: diamond.tablePercent,
    depthPercent: diamond.depthPercent,
    lengthWidthRatio: diamond.lengthWidthRatio,
    collections: diamond.collections,
    videoUrl: diamond.videoUrl,
  };
}

function parseBooleanFlag(value: string | undefined): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function isInScale(value: string | undefined, scale: readonly string[]): boolean {
  return Boolean(value && scale.includes(value));
}

export function parseDiamondFilters(
  raw: Record<string, SearchParamValue>,
): DiamondFilters {
  const diamondTypeRaw = getParam(raw, "diamondType");
  const shapeRaw = getParam(raw, "shape");
  const cutRaw = getParam(raw, "cut");
  const colorRaw = getParam(raw, "color");
  const clarityRaw = getParam(raw, "clarity");
  const polishRaw = getParam(raw, "polish");
  const symmetryRaw = getParam(raw, "symmetry");
  const presetRaw = getParam(raw, "preset");
  const certificationLabRaw =
    getParam(raw, "certificationLab") ?? getParam(raw, "certificateLab");
  const availabilityRaw = getParam(raw, "availabilityStatus");
  const sortRaw = getParam(raw, "sort");

  const page = Math.max(1, parseNumber(getParam(raw, "page")) ?? 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseNumber(getParam(raw, "limit")) ?? DEFAULT_LIMIT),
  );

  const minCut = getParam(raw, "minCut");
  const maxCut = getParam(raw, "maxCut");
  const minColor = getParam(raw, "minColor");
  const maxColor = getParam(raw, "maxColor");
  const minClarity = getParam(raw, "minClarity");
  const maxClarity = getParam(raw, "maxClarity");
  const minFluorescence = getParam(raw, "minFluorescence");
  const maxFluorescence = getParam(raw, "maxFluorescence");

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
    minCut: isInScale(minCut, CUT_SLIDER_GRADES) ? minCut : undefined,
    maxCut: isInScale(maxCut, CUT_SLIDER_GRADES) ? maxCut : undefined,
    minColor: isInScale(minColor, COLOR_SLIDER_GRADES) ? minColor : undefined,
    maxColor: isInScale(maxColor, COLOR_SLIDER_GRADES) ? maxColor : undefined,
    minClarity: isInScale(minClarity, CLARITY_SLIDER_GRADES)
      ? minClarity
      : undefined,
    maxClarity: isInScale(maxClarity, CLARITY_SLIDER_GRADES)
      ? maxClarity
      : undefined,
    minFluorescence: isInScale(minFluorescence, FLUORESCENCE_SLIDER_GRADES)
      ? minFluorescence
      : undefined,
    maxFluorescence: isInScale(maxFluorescence, FLUORESCENCE_SLIDER_GRADES)
      ? maxFluorescence
      : undefined,
    polish: isEnumValue(polishRaw, FINISH_GRADES) ? polishRaw : undefined,
    symmetry: isEnumValue(symmetryRaw, FINISH_GRADES) ? symmetryRaw : undefined,
    minLwRatio: parseNumber(getParam(raw, "minLwRatio")),
    maxLwRatio: parseNumber(getParam(raw, "maxLwRatio")),
    minTable: parseNumber(getParam(raw, "minTable")),
    maxTable: parseNumber(getParam(raw, "maxTable")),
    minDepthPercent: parseNumber(getParam(raw, "minDepthPercent")),
    maxDepthPercent: parseNumber(getParam(raw, "maxDepthPercent")),
    collectionFlawless: parseBooleanFlag(getParam(raw, "collectionFlawless")),
    collectionBlockchain: parseBooleanFlag(
      getParam(raw, "collectionBlockchain"),
    ),
    collectionTrulyBrilliant: parseBooleanFlag(
      getParam(raw, "collectionTrulyBrilliant"),
    ),
    preset: isEnumValue(presetRaw, DIAMOND_FILTER_PRESETS) ? presetRaw : undefined,
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

  if (filters.minCut || filters.maxCut) {
    const grades = expandCutGradesForQuery(
      gradesInRange(CUT_SLIDER_GRADES, filters.minCut, filters.maxCut),
    );
    query.cut = { $in: grades };
  } else if (filters.cut) {
    query.cut = filters.cut;
  }

  if (filters.minColor || filters.maxColor) {
    query.color = {
      $in: gradesInRange(COLOR_SLIDER_GRADES, filters.minColor, filters.maxColor),
    };
  } else if (filters.color) {
    query.color = filters.color;
  }

  if (filters.minClarity || filters.maxClarity) {
    query.clarity = {
      $in: gradesInRange(
        CLARITY_SLIDER_GRADES,
        filters.minClarity,
        filters.maxClarity,
      ),
    };
  } else if (filters.clarity) {
    query.clarity = filters.clarity;
  }

  if (filters.minFluorescence || filters.maxFluorescence) {
    query.fluorescence = {
      $in: gradesInRange(
        FLUORESCENCE_SLIDER_GRADES,
        filters.minFluorescence,
        filters.maxFluorescence,
      ),
    };
  }

  if (filters.polish) query.polish = filters.polish;
  if (filters.symmetry) query.symmetry = filters.symmetry;

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

  if (filters.minLwRatio !== undefined || filters.maxLwRatio !== undefined) {
    query.lengthWidthRatio = {};
    if (filters.minLwRatio !== undefined) {
      query.lengthWidthRatio.$gte = filters.minLwRatio;
    }
    if (filters.maxLwRatio !== undefined) {
      query.lengthWidthRatio.$lte = filters.maxLwRatio;
    }
  }

  if (filters.minTable !== undefined || filters.maxTable !== undefined) {
    query.tablePercent = {};
    if (filters.minTable !== undefined) query.tablePercent.$gte = filters.minTable;
    if (filters.maxTable !== undefined) query.tablePercent.$lte = filters.maxTable;
  }

  if (
    filters.minDepthPercent !== undefined ||
    filters.maxDepthPercent !== undefined
  ) {
    query.depthPercent = {};
    if (filters.minDepthPercent !== undefined) {
      query.depthPercent.$gte = filters.minDepthPercent;
    }
    if (filters.maxDepthPercent !== undefined) {
      query.depthPercent.$lte = filters.maxDepthPercent;
    }
  }

  if (filters.collectionFlawless) query["collections.flawless"] = true;
  if (filters.collectionBlockchain) query["collections.blockchain"] = true;
  if (filters.collectionTrulyBrilliant) {
    query["collections.trulyBrilliant"] = true;
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
