import {
  AVAILABILITY_STATUSES,
  DIAMOND_SHAPES,
  METALS,
  PRODUCT_STATUSES,
  PRODUCT_TYPES,
  RING_STYLES,
} from "@/constants/jewellery";
import { Schema, model, models, type InferSchemaType } from "mongoose";

const productImageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false },
);

const productVariantSchema = new Schema(
  {
    sku: { type: String, required: true },
    metal: { type: String, enum: METALS },
    ringSize: { type: String },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    stockQuantity: { type: Number, default: 0 },
    image: { type: String, trim: true },
  },
  { _id: false },
);

const productAttributesSchema = new Schema(
  {
    metal: [{ type: String, enum: METALS }],
    stoneType: { type: String },
    diamondShape: { type: String, enum: DIAMOND_SHAPES },
    style: { type: String, enum: RING_STYLES },
    ringSizes: [{ type: String }],
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    productType: { type: String, enum: PRODUCT_TYPES, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    collectionIds: [{ type: Schema.Types.ObjectId, ref: "Collection" }],
    shortDescription: { type: String, trim: true },
    description: { type: String },
    basePrice: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },
    images: [productImageSchema],
    videoUrl: { type: String, trim: true },
    attributes: productAttributesSchema,
    variants: [productVariantSchema],
    stockQuantity: { type: Number, default: 0, min: 0 },
    availabilityStatus: {
      type: String,
      enum: AVAILABILITY_STATUSES,
      default: "in-stock",
    },
    productionTime: { type: String },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isReadyToShip: { type: Boolean, default: false },
    status: { type: String, enum: PRODUCT_STATUSES, default: "draft" },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true },
);

productSchema.index({ categoryId: 1 });
productSchema.index({ productType: 1 });
productSchema.index({ status: 1 });
productSchema.index({ basePrice: 1 });
productSchema.index({ "attributes.metal": 1 });
productSchema.index({ "attributes.diamondShape": 1 });
productSchema.index({ "attributes.style": 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isBestSeller: 1 });

export type ProductDocument = InferSchemaType<typeof productSchema> & {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Product = models.Product || model("Product", productSchema);
