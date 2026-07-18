import {
  AVAILABILITY_STATUSES,
  DIAMOND_SHAPES,
  METALS,
  PRODUCT_TYPES,
  RING_STYLES,
  STONE_TYPES,
} from "@/constants/jewellery";
import { safeConnectDB } from "@/lib/db";
import { getParam, type SearchParamValue } from "@/lib/searchParams";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import type {
  CategorySummary,
  PaginatedResult,
  ProductDetail,
  ProductFilters,
  ProductSortOption,
  ProductSummary,
} from "@/types";
import mongoose, { type FilterQuery, type SortOrder } from "mongoose";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 48;

const PRODUCT_SORT_OPTIONS: ProductSortOption[] = [
  "newest",
  "price-asc",
  "price-desc",
  "featured",
  "best-sellers",
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

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toProductSummary(product: {
  _id: { toString(): string };
  name: string;
  slug: string;
  shortDescription?: string;
  basePrice: number;
  salePrice?: number;
  images?: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
  productType: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isReadyToShip: boolean;
  availabilityStatus: string;
  attributes?: ProductDetail["attributes"];
  variants?: ProductDetail["variants"];
}): ProductSummary {
  return {
    _id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    basePrice: product.basePrice,
    salePrice: product.salePrice,
    images: product.images ?? [],
    productType: product.productType as ProductSummary["productType"],
    isFeatured: product.isFeatured,
    isBestSeller: product.isBestSeller,
    isReadyToShip: product.isReadyToShip,
    availabilityStatus:
      product.availabilityStatus as ProductSummary["availabilityStatus"],
    attributes: product.attributes,
    variants: product.variants,
  };
}

function toProductDetail(product: {
  _id: { toString(): string };
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  basePrice: number;
  salePrice?: number;
  images?: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
  productType: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isReadyToShip: boolean;
  availabilityStatus: string;
  attributes?: ProductDetail["attributes"];
  variants?: ProductDetail["variants"];
  stockQuantity: number;
  productionTime?: string;
  categoryId: { toString(): string };
  seoTitle?: string;
  seoDescription?: string;
  videoUrl?: string;
}): ProductDetail {
  return {
    ...toProductSummary(product),
    description: product.description,
    attributes: product.attributes,
    variants: product.variants,
    stockQuantity: product.stockQuantity,
    productionTime: product.productionTime,
    categoryId: product.categoryId.toString(),
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    videoUrl: product.videoUrl,
  };
}

export function parseProductFilters(
  raw: Record<string, SearchParamValue>,
): ProductFilters {
  const search = getParam(raw, "search")?.trim();
  const category = getParam(raw, "category")?.trim();
  const productTypeRaw =
    getParam(raw, "productType") ?? getParam(raw, "type");
  const metalRaw = getParam(raw, "metal");
  const stoneTypeRaw = getParam(raw, "stoneType");
  const diamondShapeRaw = getParam(raw, "diamondShape");
  const styleRaw = getParam(raw, "style");
  const availabilityRaw = getParam(raw, "availabilityStatus");
  const sortRaw = getParam(raw, "sort");

  const page = Math.max(1, parseNumber(getParam(raw, "page")) ?? 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseNumber(getParam(raw, "limit")) ?? DEFAULT_LIMIT),
  );

  return {
    search: search || undefined,
    category: category || undefined,
    productType: isEnumValue(productTypeRaw, PRODUCT_TYPES)
      ? productTypeRaw
      : undefined,
    minPrice: parseNumber(getParam(raw, "minPrice")),
    maxPrice: parseNumber(getParam(raw, "maxPrice")),
    metal: isEnumValue(metalRaw, METALS) ? metalRaw : undefined,
    stoneType: isEnumValue(stoneTypeRaw, STONE_TYPES) ? stoneTypeRaw : undefined,
    diamondShape: isEnumValue(diamondShapeRaw, DIAMOND_SHAPES)
      ? diamondShapeRaw
      : undefined,
    style: isEnumValue(styleRaw, RING_STYLES) ? styleRaw : undefined,
    availabilityStatus: isEnumValue(availabilityRaw, AVAILABILITY_STATUSES)
      ? availabilityRaw
      : undefined,
    isReadyToShip: parseBoolean(getParam(raw, "isReadyToShip")),
    isFeatured: parseBoolean(getParam(raw, "isFeatured")),
    isBestSeller: parseBoolean(getParam(raw, "isBestSeller")),
    sort: isEnumValue(sortRaw, PRODUCT_SORT_OPTIONS) ? sortRaw : "newest",
    page,
    limit,
  };
}

function getProductSort(sort: ProductSortOption = "newest"): Record<string, SortOrder> {
  switch (sort) {
    case "price-asc":
      return { basePrice: 1 };
    case "price-desc":
      return { basePrice: -1 };
    case "featured":
      return { isFeatured: -1, createdAt: -1 };
    case "best-sellers":
      return { isBestSeller: -1, createdAt: -1 };
    case "newest":
    default:
      return { createdAt: -1 };
  }
}

async function buildProductQuery(
  filters: ProductFilters,
): Promise<FilterQuery<typeof Product>> {
  const query: FilterQuery<typeof Product> = { status: "published" };

  if (filters.search) {
    query.name = { $regex: escapeRegex(filters.search), $options: "i" };
  }

  if (filters.category) {
    const category = await Category.findOne({
      slug: filters.category,
      isActive: true,
    }).lean();

    if (category && !Array.isArray(category)) {
      query.categoryId = category._id;
    } else {
      query.categoryId = null;
    }
  }

  if (filters.productType) query.productType = filters.productType;

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.basePrice = {};
    if (filters.minPrice !== undefined) {
      query.basePrice.$gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      query.basePrice.$lte = filters.maxPrice;
    }
  }

  if (filters.metal) query["attributes.metal"] = filters.metal;
  if (filters.stoneType) query["attributes.stoneType"] = filters.stoneType;
  if (filters.diamondShape) query["attributes.diamondShape"] = filters.diamondShape;
  if (filters.style) query["attributes.style"] = filters.style;
  if (filters.availabilityStatus) {
    query.availabilityStatus = filters.availabilityStatus;
  }
  if (filters.isReadyToShip === true) query.isReadyToShip = true;
  if (filters.isFeatured === true) query.isFeatured = true;
  if (filters.isBestSeller === true) query.isBestSeller = true;

  return query;
}

export async function getProducts(
  filters: ProductFilters,
): Promise<PaginatedResult<ProductSummary>> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? DEFAULT_LIMIT;

  const db = await safeConnectDB();
  if (!db) {
    return { items: [], total: 0, page, totalPages: 0 };
  }

  try {
    const query = await buildProductQuery(filters);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(getProductSort(filters.sort))
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return {
      items: products.map((product) =>
        toProductSummary(product as unknown as Parameters<typeof toProductSummary>[0]),
      ),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("getProducts error:", error);
    return { items: [], total: 0, page, totalPages: 0 };
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  const db = await safeConnectDB();
  if (!db) return null;

  try {
    const product = await Product.findOne({
      slug: slug.toLowerCase().trim(),
      status: "published",
    }).lean();

    if (!product) return null;

    return toProductDetail(product as unknown as Parameters<typeof toProductDetail>[0]);
  } catch (error) {
    console.error("getProductBySlug error:", error);
    return null;
  }
}

export async function getProductById(id: string): Promise<ProductDetail | null> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(id)) return null;

  try {
    const product = await Product.findOne({
      _id: id,
      status: "published",
    }).lean();

    if (!product) return null;

    return toProductDetail(product as unknown as Parameters<typeof toProductDetail>[0]);
  } catch (error) {
    console.error("getProductById error:", error);
    return null;
  }
}

export async function getRelatedProducts(
  product: ProductDetail,
  limit = 4,
): Promise<ProductSummary[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const products = await Product.find({
      status: "published",
      _id: { $ne: product._id },
      $or: [
        { categoryId: product.categoryId },
        { productType: product.productType },
      ],
    })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return products.map((item) =>
      toProductSummary(item as unknown as Parameters<typeof toProductSummary>[0]),
    );
  } catch (error) {
    console.error("getRelatedProducts error:", error);
    return [];
  }
}

export async function getFeaturedProducts(
  limit = 4,
): Promise<ProductSummary[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const products = await Product.find({
      status: "published",
      isFeatured: true,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return products.map((product) =>
      toProductSummary(product as unknown as Parameters<typeof toProductSummary>[0]),
    );
  } catch (error) {
    console.error("getFeaturedProducts error:", error);
    return [];
  }
}

export async function getProductsCount(): Promise<number> {
  const db = await safeConnectDB();
  if (!db) return 0;

  try {
    return await Product.countDocuments({ status: "published" });
  } catch (error) {
    console.error("getProductsCount error:", error);
    return 0;
  }
}

export async function getLowStockProductsCount(
  threshold = 5,
): Promise<number> {
  const db = await safeConnectDB();
  if (!db) return 0;

  try {
    return await Product.countDocuments({
      status: "published",
      stockQuantity: { $lte: threshold, $gt: 0 },
    });
  } catch (error) {
    console.error("getLowStockProductsCount error:", error);
    return 0;
  }
}

export async function getActiveCategories(): Promise<CategorySummary[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 })
      .lean();

    return categories.map((category) => ({
      _id: String(category._id),
      name: category.name as string,
      slug: category.slug as string,
      description: category.description as string | undefined,
      image: category.image as string | undefined,
    }));
  } catch (error) {
    console.error("getActiveCategories error:", error);
    return [];
  }
}

export async function getPublishedProductSlugs(): Promise<string[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const products = await Product.find({ status: "published" })
      .select("slug")
      .lean();
    return products
      .map((product) => product.slug as string)
      .filter(Boolean);
  } catch (error) {
    console.error("getPublishedProductSlugs error:", error);
    return [];
  }
}
