import type {
  AvailabilityStatus,
  ProductStatus,
  ProductType,
  RingStyle,
} from "@/constants/jewellery";
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
  imageUrl?: string;
  videoUrl?: string;
  style?: RingStyle;
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
  images?: Array<{ url: string; isPrimary?: boolean }>;
  videoUrl?: string;
  attributes?: { style?: string };
  createdAt: Date;
  updatedAt: Date;
  categoryName?: string;
}): AdminProductSummary {
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ?? product.images?.[0]?.url;

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
    imageUrl: primaryImage,
    videoUrl: product.videoUrl,
    style: product.attributes?.style as RingStyle | undefined,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

function toProductFields(input: ProductAdminInput) {
  const images = input.imageUrl?.trim()
    ? [{ url: input.imageUrl.trim(), isPrimary: true }]
    : [];

  const attributes =
    input.attributes?.style != null
      ? { style: input.attributes.style }
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
    videoUrl: input.videoUrl?.trim() || undefined,
    ...(images.length ? { images } : {}),
    ...(attributes ? { attributes } : {}),
  };
}

export async function getAdminProducts(): Promise<AdminProductSummary[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const products = await Product.find()
      .populate("categoryId", "name")
      .sort({ updatedAt: -1 })
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
