import { safeConnectDB } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { Category } from "@/models/Category";
import type { CategoryAdminInput } from "@/validation/admin/category.schema";
import mongoose from "mongoose";

export type AdminCategorySummary = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  parentName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

function resolveSlug(name: string, slug?: string): string {
  const value = slug?.trim() || slugify(name);
  return value || slugify(name);
}

function toAdminCategorySummary(category: {
  _id: { toString(): string };
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: { toString(): string } | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  parentName?: string;
}): AdminCategorySummary {
  return {
    _id: category._id.toString(),
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    parentId: category.parentId?.toString(),
    parentName: category.parentName,
    isActive: category.isActive,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}

function toCategoryFields(input: CategoryAdminInput) {
  const parentId =
    input.parentId && mongoose.Types.ObjectId.isValid(input.parentId)
      ? input.parentId
      : undefined;

  return {
    name: input.name.trim(),
    slug: resolveSlug(input.name, input.slug),
    description: input.description?.trim() || undefined,
    image: input.imageUrl?.trim() || undefined,
    parentId,
    isActive: input.isActive,
  };
}

export async function getAdminCategories(): Promise<AdminCategorySummary[]> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    const nameById = new Map(
      categories.map((c) => [String(c._id), c.name as string]),
    );

    return categories.map((category) => {
      const doc = category as unknown as Parameters<
        typeof toAdminCategorySummary
      >[0];
      return toAdminCategorySummary({
        ...doc,
        parentName: doc.parentId
          ? nameById.get(String(doc.parentId))
          : undefined,
      });
    });
  } catch (error) {
    console.error("getAdminCategories error:", error);
    return [];
  }
}

export async function getAdminCategoryById(
  id: string,
): Promise<AdminCategorySummary | null> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(id)) return null;

  try {
    const category = await Category.findById(id).lean();
    if (!category) return null;

    const doc = category as unknown as Parameters<
      typeof toAdminCategorySummary
    >[0];

    let parentName: string | undefined;
    if (doc.parentId) {
      const parent = await Category.findById(doc.parentId).lean();
      parentName = (parent as { name?: string } | null)?.name;
    }

    return toAdminCategorySummary({
      ...doc,
      parentName,
    });
  } catch (error) {
    console.error("getAdminCategoryById error:", error);
    return null;
  }
}

export async function createAdminCategory(
  input: CategoryAdminInput,
): Promise<string | null> {
  const db = await safeConnectDB();
  if (!db) return null;

  try {
    const category = await Category.create(toCategoryFields(input));
    return category._id.toString();
  } catch (error) {
    console.error("createAdminCategory error:", error);
    return null;
  }
}

export async function updateAdminCategory(
  id: string,
  input: CategoryAdminInput,
): Promise<boolean> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(id)) return false;

  try {
    const result = await Category.findByIdAndUpdate(
      id,
      { $set: toCategoryFields(input) },
      { runValidators: true },
    );
    return Boolean(result);
  } catch (error) {
    console.error("updateAdminCategory error:", error);
    return false;
  }
}

export async function deleteAdminCategory(id: string): Promise<boolean> {
  const db = await safeConnectDB();
  if (!db || !mongoose.Types.ObjectId.isValid(id)) return false;

  try {
    const result = await Category.findByIdAndDelete(id);
    return Boolean(result);
  } catch (error) {
    console.error("deleteAdminCategory error:", error);
    return false;
  }
}

export async function getAdminCategoryOptions(): Promise<
  Array<{ _id: string; name: string }>
> {
  const db = await safeConnectDB();
  if (!db) return [];

  try {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 })
      .select("name")
      .lean();
    return categories.map((c) => ({
      _id: String(c._id),
      name: c.name as string,
    }));
  } catch (error) {
    console.error("getAdminCategoryOptions error:", error);
    return [];
  }
}
