import type {
  AvailabilityStatus,
  FancyDiamondColor,
  GoldPurity,
  Metal,
  ProductShipRegion,
  ProductStatus,
  ProductType,
  RingStyle,
  StoneType,
} from "@/constants/jewellery";
import type { CertificationLab } from "@/constants/certification";
import { safeConnectDB } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { Product } from "@/models/Product";
import type { ProductAdminInput } from "@/validation/admin/product.schema";
import mongoose from "mongoose";

export type AdminProductSummary = {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  productType: ProductType;
  categoryId: string;
  categoryName?: string;
  shortDescription?: string;
  description?: string;
  basePrice: number;
  salePrice?: number;
  stockQuantity: number;
  availabilityStatus: AvailabilityStatus;
  status: ProductStatus;
  isFeatured: boolean;
  productionTime?: string;
  imageUrl?: string;
  imageAlt?: string;
  images?: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
  videoUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  style?: RingStyle;
  metal?: Metal[];
  goldPurity?: GoldPurity;
  stoneType?: StoneType;
  isLabGrown?: boolean;
  diamondShape?: string;
  diamondColor?: FancyDiamondColor;
  diamondCarat?: number;
  ringSizes?: string[];
  customSizeAvailable?: boolean;
  customStoneAvailable?: boolean;
  shipsTo?: ProductShipRegion;
  certificationLab?: CertificationLab;
  certificationReportNumber?: string;
  certificationReportUrl?: string;
  createdAt: string;
  updatedAt: string;
};

function resolveSlug(name: string, slug?: string): string {
  const value = slug?.trim() || slugify(name);
  return value || slugify(name);
}

function toAdminProductSummary(product: {
  _id: { toString(): string };
  name: string;
  slug: string;
  sku: string;
  productType: string;
  categoryId?: { toString(): string } | string;
  shortDescription?: string;
  description?: string;
  basePrice: number;
  salePrice?: number;
  stockQuantity: number;
  availabilityStatus: string;
  status: string;
  isFeatured: boolean;
  productionTime?: string;
  images?: Array<{ url: string; alt?: string; isPrimary?: boolean }>;
  videoUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  attributes?: {
    style?: string;
    metal?: Metal[];
    goldPurity?: string;
    stoneType?: string;
    isLabGrown?: boolean;
    diamondShape?: string;
    diamondColor?: string;
    diamondCarat?: number;
    ringSizes?: string[];
    customSizeAvailable?: boolean;
    customStoneAvailable?: boolean;
    shipsTo?: string;
    certification?: {
      lab?: string;
      reportNumber?: string;
      reportUrl?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
  categoryName?: string;
}): AdminProductSummary {
  const primary =
    product.images?.find((img) => img.isPrimary) ?? product.images?.[0];

  return {
    _id: product._id.toString(),
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    productType: product.productType as ProductType,
    categoryId:
      typeof product.categoryId === "string"
        ? product.categoryId
        : product.categoryId?.toString() ?? "",
    categoryName: product.categoryName,
    shortDescription: product.shortDescription,
    description: product.description,
    basePrice: product.basePrice,
    salePrice: product.salePrice,
    stockQuantity: product.stockQuantity,
    availabilityStatus: product.availabilityStatus as AvailabilityStatus,
    status: product.status as ProductStatus,
    isFeatured: product.isFeatured,
    productionTime: product.productionTime,
    imageUrl: primary?.url,
    imageAlt: primary?.alt,
    images: product.images,
    videoUrl: product.videoUrl,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    style: product.attributes?.style as RingStyle | undefined,
    metal: product.attributes?.metal,
    goldPurity: product.attributes?.goldPurity as GoldPurity | undefined,
    stoneType: product.attributes?.stoneType as StoneType | undefined,
    isLabGrown: product.attributes?.isLabGrown,
    diamondShape: product.attributes?.diamondShape,
    diamondColor: product.attributes?.diamondColor as
      | FancyDiamondColor
      | undefined,
    diamondCarat: product.attributes?.diamondCarat,
    ringSizes: product.attributes?.ringSizes,
    customSizeAvailable: product.attributes?.customSizeAvailable,
    customStoneAvailable: product.attributes?.customStoneAvailable,
    shipsTo: product.attributes?.shipsTo as ProductShipRegion | undefined,
    certificationLab: product.attributes?.certification?.lab as
      | CertificationLab
      | undefined,
    certificationReportNumber: product.attributes?.certification?.reportNumber,
    certificationReportUrl: product.attributes?.certification?.reportUrl,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

function toProductFields(input: ProductAdminInput) {
  let images =
    input.images
      ?.filter((img) => img.url.trim())
      .map((img, index) => ({
        url: img.url.trim(),
        alt: img.alt?.trim() || undefined,
        isPrimary: img.isPrimary ?? index === 0,
      })) ?? [];

  if (images.length === 0 && input.imageUrl?.trim()) {
    images = [
      {
        url: input.imageUrl.trim(),
        alt: input.imageAlt?.trim() || undefined,
        isPrimary: true,
      },
    ];
  }

  const attrs = input.attributes;
  const certification =
    attrs?.certification &&
    (attrs.certification.lab ||
      attrs.certification.reportNumber ||
      attrs.certification.reportUrl)
      ? {
          lab: attrs.certification.lab ?? undefined,
          reportNumber: attrs.certification.reportNumber?.trim() || undefined,
          reportUrl: attrs.certification.reportUrl?.trim() || undefined,
        }
      : undefined;

  const attributes = attrs
    ? {
        ...(attrs.metal?.length ? { metal: attrs.metal } : {}),
        ...(attrs.goldPurity != null ? { goldPurity: attrs.goldPurity } : {}),
        ...(attrs.stoneType != null ? { stoneType: attrs.stoneType } : {}),
        ...(attrs.isLabGrown !== undefined
          ? { isLabGrown: attrs.isLabGrown }
          : {}),
        ...(attrs.diamondShape != null
          ? { diamondShape: attrs.diamondShape }
          : {}),
        ...(attrs.diamondColor != null
          ? { diamondColor: attrs.diamondColor }
          : {}),
        ...(attrs.diamondCarat != null
          ? { diamondCarat: attrs.diamondCarat }
          : {}),
        ...(attrs.style != null ? { style: attrs.style } : {}),
        ...(attrs.ringSizes?.length ? { ringSizes: attrs.ringSizes } : {}),
        ...(attrs.customSizeAvailable !== undefined
          ? { customSizeAvailable: attrs.customSizeAvailable }
          : {}),
        ...(attrs.customStoneAvailable !== undefined
          ? { customStoneAvailable: attrs.customStoneAvailable }
          : {}),
        ...(attrs.shipsTo != null ? { shipsTo: attrs.shipsTo } : {}),
        ...(certification ? { certification } : {}),
      }
    : undefined;

  return {
    name: input.name.trim(),
    slug: resolveSlug(input.name, input.slug),
    sku: input.sku.trim(),
    productType: input.productType,
    categoryId: input.categoryId,
    shortDescription: input.shortDescription?.trim() || undefined,
    description: input.description?.trim() || undefined,
    basePrice: input.basePrice,
    salePrice: input.salePrice ?? undefined,
    stockQuantity: input.stockQuantity,
    availabilityStatus: input.availabilityStatus,
    status: input.status,
    isFeatured: input.isFeatured,
    productionTime: input.productionTime?.trim() || undefined,
    videoUrl: input.videoUrl?.trim() || undefined,
    seoTitle: input.seoTitle?.trim() || undefined,
    seoDescription: input.seoDescription?.trim() || undefined,
    images,
    ...(attributes && Object.keys(attributes).length
      ? { attributes }
      : {}),
  };
}

export async function getAdminProducts(): Promise<AdminProductSummary[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const products = await Product.find()
      .populate("categoryId", "name")
      .sort({ updatedAt: -1 })
      .limit(500)
      .lean();

    return products.map((product) => {
      const doc = product as unknown as Parameters<
        typeof toAdminProductSummary
      >[0] & {
        categoryId?:
          | { _id?: { toString(): string }; name?: string }
          | string
          | null;
      };
      const populated = doc.categoryId;
      const categoryName =
        populated && typeof populated === "object" ? populated.name : undefined;
      const categoryId =
        populated && typeof populated === "object" && populated._id
          ? populated._id.toString()
          : typeof populated === "string"
            ? populated
            : String(doc.categoryId ?? "");

      return toAdminProductSummary({
        ...doc,
        categoryId,
        categoryName,
      });
    });
  } catch (error) {
    console.error("getAdminProducts error:", error);
    return [];
  }
}

export async function getAdminProductById(
  id: string,
): Promise<AdminProductSummary | null> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(id)) return null;

  try {
    const product = await Product.findById(id)
      .populate("categoryId", "name")
      .lean();
    if (!product) return null;

    const doc = product as unknown as Parameters<
      typeof toAdminProductSummary
    >[0] & {
      categoryId?:
        | { _id?: { toString(): string }; name?: string }
        | string
        | null;
    };
    const populated = doc.categoryId;
    const categoryName =
      populated && typeof populated === "object" ? populated.name : undefined;
    const categoryId =
      populated && typeof populated === "object" && populated._id
        ? populated._id.toString()
        : typeof populated === "string"
          ? populated
          : String(doc.categoryId ?? "");

    return toAdminProductSummary({
      ...doc,
      categoryId,
      categoryName,
    });
  } catch (error) {
    console.error("getAdminProductById error:", error);
    return null;
  }
}

export async function createAdminProduct(
  input: ProductAdminInput,
): Promise<string | null> {
  const db = await safeConnectDB();
  if (!db) return null;

  try {
    const product = await Product.create(toProductFields(input));
    return product._id.toString();
  } catch (error) {
    console.error("createAdminProduct error:", error);
    return null;
  }
}

export async function updateAdminProduct(
  id: string,
  input: ProductAdminInput,
): Promise<boolean> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(id)) return false;

  try {
    const result = await Product.findByIdAndUpdate(
      id,
      { $set: toProductFields(input) },
      { runValidators: true },
    );
    return Boolean(result);
  } catch (error) {
    console.error("updateAdminProduct error:", error);
    return false;
  }
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(id)) return false;

  try {
    const result = await Product.findByIdAndDelete(id);
    return Boolean(result);
  } catch (error) {
    console.error("deleteAdminProduct error:", error);
    return false;
  }
}
